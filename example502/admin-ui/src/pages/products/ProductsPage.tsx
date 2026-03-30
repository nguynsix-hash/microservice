import { useEffect, useState } from 'react';
import axios from 'axios';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Search, Trash2, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Category = {
  id: number;
  categoryName: string;
};

type Product = {
  id: number;
  productName: string;
  price: number;
  discription: string | null;
  availability: number;
  category: Category | null;
};

type ProductFormData = {
  productName: string;
  price: string;
  discription: string;
  availability: string;
  categoryId: string;
};

const NO_CATEGORY_VALUE = 'none';
const ALL_CATEGORIES_VALUE = 'all-categories';

const emptyFormData: ProductFormData = {
  productName: '',
  price: '',
  discription: '',
  availability: '',
  categoryId: '',
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchName, setSearchName] = useState('');
  const [selectedFilterCategory, setSelectedFilterCategory] = useState(ALL_CATEGORIES_VALUE);
  const [isOpen, setIsOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState<ProductFormData>(emptyFormData);

  const fetchProducts = async (filters?: { name?: string; categoryName?: string }) => {
    const name = filters?.name?.trim() || '';
    const categoryName =
      filters?.categoryName && filters.categoryName !== ALL_CATEGORIES_VALUE
        ? filters.categoryName
        : '';

    try {
      const res = name
        ? await api.get<Product[]>('/catalog/products', { params: { name } })
        : categoryName
          ? await api.get<Product[]>('/catalog/products', { params: { category: categoryName } })
          : await api.get<Product[]>('/catalog/products');

      setProducts(res.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        setProducts([]);
        return;
      }
      toast({ title: 'Error fetching products', variant: 'destructive' });
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get<Category[]>('/catalog/categories');
      setCategories(res.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        setCategories([]);
        return;
      }
      setCategories([]);
      toast({ title: 'Error fetching categories', variant: 'destructive' });
    }
  };

  useEffect(() => {
    void fetchProducts();
    void fetchCategories();
  }, []);

  const refreshCurrentProducts = async () => {
    await fetchProducts({ name: searchName, categoryName: selectedFilterCategory });
  };

  const handleApplyFilters = async () => {
    await fetchProducts({ name: searchName, categoryName: selectedFilterCategory });
  };

  const handleResetFilters = async () => {
    setSearchName('');
    setSelectedFilterCategory(ALL_CATEGORIES_VALUE);
    await fetchProducts();
  };

  const openForm = (product: Product | null = null) => {
    setEditingProduct(product);
    if (product) {
      setFormData({
        productName: product.productName,
        price: String(product.price),
        discription: product.discription || '',
        availability: String(product.availability),
        categoryId: product.category?.id ? String(product.category.id) : '',
      });
    } else {
      setFormData({ ...emptyFormData });
    }
    setIsOpen(true);
  };

  const handleSave = async () => {
    if (!formData.productName.trim()) {
      toast({ title: 'Product name is required', variant: 'destructive' });
      return;
    }

    const parsedPrice = Number(formData.price);
    const parsedAvailability = Number(formData.availability);

    if (Number.isNaN(parsedPrice) || Number.isNaN(parsedAvailability)) {
      toast({ title: 'Price and stock must be numbers', variant: 'destructive' });
      return;
    }

    try {
      const payload = {
        productName: formData.productName.trim(),
        price: parsedPrice,
        discription: formData.discription.trim(),
        availability: parsedAvailability,
        category: formData.categoryId ? { id: Number(formData.categoryId) } : null,
      };

      if (editingProduct) {
        await api.put(`/catalog/admin/products/${editingProduct.id}`, payload);
        toast({ title: 'Product updated' });
      } else {
        await api.post('/catalog/admin/products', payload);
        toast({ title: 'Product created' });
      }
      setIsOpen(false);
      await refreshCurrentProducts();
    } catch {
      toast({ title: 'Error saving product', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/catalog/admin/products/${id}`);
      toast({ title: 'Product deleted' });
      await refreshCurrentProducts();
    } catch {
      toast({ title: 'Error deleting product', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Products</h2>
        <Button onClick={() => openForm()}><Plus className="mr-2 h-4 w-4" /> Add Product</Button>
      </div>

      <div className="rounded-md border bg-white shadow-sm p-4">
        <div className="grid gap-3 md:grid-cols-[2fr_1fr_auto_auto]">
          <Input
            placeholder="Search by product name..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                void handleApplyFilters();
              }
            }}
          />
          <Select value={selectedFilterCategory} onValueChange={setSelectedFilterCategory}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_CATEGORIES_VALUE}>All categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.categoryName}>
                  {category.categoryName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="secondary" onClick={() => void handleApplyFilters()}>
            <Search className="mr-2 h-4 w-4" /> Search
          </Button>
          <Button variant="outline" onClick={() => void handleResetFilters()}>
            <X className="mr-2 h-4 w-4" /> Reset
          </Button>
        </div>
      </div>

      <div className="rounded-md border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.id}</TableCell>
                <TableCell className="font-medium">{p.productName}</TableCell>
                <TableCell>{p.category?.categoryName || '-'}</TableCell>
                <TableCell>${p.price}</TableCell>
                <TableCell>{p.availability}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => openForm(p)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700" onClick={() => handleDelete(p.id)}><Trash2 className="h-4 w-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
            {products.length === 0 && <TableRow><TableCell colSpan={6} className="text-center py-8 text-neutral-500">No products found.</TableCell></TableRow>}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Edit Product' : 'Create New Product'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right font-medium">Name</Label>
              <Input className="col-span-3" value={formData.productName} onChange={e => setFormData({...formData, productName: e.target.value})} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right font-medium">Description</Label>
              <Input className="col-span-3" value={formData.discription} onChange={e => setFormData({...formData, discription: e.target.value})} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right font-medium">Category</Label>
              <div className="col-span-3">
                <Select
                  value={formData.categoryId || NO_CATEGORY_VALUE}
                  onValueChange={(value) => setFormData({ ...formData, categoryId: value === NO_CATEGORY_VALUE ? '' : value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NO_CATEGORY_VALUE}>No category</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={String(category.id)}>
                        {category.categoryName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right font-medium">Price ($)</Label>
              <Input type="number" className="col-span-3" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right font-medium">Stock/Avail</Label>
              <Input type="number" className="col-span-3" value={formData.availability} onChange={e => setFormData({...formData, availability: e.target.value})} />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save Product</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
