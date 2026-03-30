import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2 } from 'lucide-react';

type Category = {
  id: number;
  categoryName: string;
  description: string | null;
};

type CategoryFormData = {
  categoryName: string;
  description: string;
};

const emptyFormData: CategoryFormData = {
  categoryName: '',
  description: '',
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>(emptyFormData);
  const { toast } = useToast();

  const fetchCategories = async () => {
    try {
      const res = await api.get<Category[]>('/catalog/categories');
      setCategories(res.data);
    } catch {
      setCategories([]);
      toast({ title: 'Error fetching categories', variant: 'destructive' });
    }
  };

  useEffect(() => {
    void fetchCategories();
  }, []);

  const openForm = (category: Category | null = null) => {
    setEditingCategory(category);
    if (category) {
      setFormData({
        categoryName: category.categoryName,
        description: category.description ?? '',
      });
    } else {
      setFormData({ ...emptyFormData });
    }
    setIsOpen(true);
  };

  const handleSave = async () => {
    if (!formData.categoryName.trim()) {
      toast({ title: 'Category name is required', variant: 'destructive' });
      return;
    }

    const payload = {
      categoryName: formData.categoryName.trim(),
      description: formData.description.trim(),
    };

    try {
      if (editingCategory) {
        try {
          await api.put(`/catalog/categories/${editingCategory.id}`, payload);
        } catch {
          await api.post('/catalog/categories', { id: editingCategory.id, ...payload });
        }
      } else {
        await api.post('/catalog/categories', payload);
      }
      toast({ title: editingCategory ? 'Category updated' : 'Category created' });
      setIsOpen(false);
      await fetchCategories();
    } catch {
      toast({ title: 'Error saving category', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      await api.delete(`/catalog/categories/${id}`);
      toast({ title: 'Category deleted' });
      await fetchCategories();
    } catch {
      toast({ title: 'Error deleting category', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Categories</h2>
        <Button onClick={() => openForm()}>
          <Plus className="mr-2 h-4 w-4" /> Add Category
        </Button>
      </div>

      <div className="rounded-md border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.id}</TableCell>
                <TableCell className="font-medium">{category.categoryName}</TableCell>
                <TableCell>{category.description || '-'}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => openForm(category)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDelete(category.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {categories.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-neutral-500">
                  No categories found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingCategory ? 'Edit Category' : 'Create New Category'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right font-medium">Name</Label>
              <Input
                className="col-span-3"
                value={formData.categoryName}
                onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right font-medium">Description</Label>
              <Input
                className="col-span-3"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Category</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
