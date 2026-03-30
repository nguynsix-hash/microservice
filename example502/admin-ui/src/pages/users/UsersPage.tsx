import { useEffect, useState } from 'react';
import axios from 'axios';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Eye, Pencil, Plus, Search, Trash2, X } from 'lucide-react';

type UserDetails = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  locality?: string;
  country?: string;
};

type User = {
  id: number;
  userName: string;
  userPassword: string;
  active: number;
  userDetails?: UserDetails | null;
};

type UserFormData = {
  userName: string;
  userPassword: string;
  firstName: string;
  lastName: string;
  email: string;
  active: number;
};

const emptyFormData: UserFormData = {
  userName: '',
  userPassword: '',
  firstName: '',
  lastName: '',
  email: '',
  active: 1,
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchName, setSearchName] = useState('');
  const [searchId, setSearchId] = useState('');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [viewingUser, setViewingUser] = useState<User | null>(null);

  const { toast } = useToast();
  const [formData, setFormData] = useState<UserFormData>(emptyFormData);

  const fetchUsers = async () => {
    try {
      const res = await api.get<User[]>('/accounts/users');
      setUsers(res.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        setUsers([]);
        return;
      }
      toast({ title: 'Error fetching users', variant: 'destructive' });
    }
  };

  useEffect(() => {
    void fetchUsers();
  }, []);

  const searchUsersByName = async () => {
    const name = searchName.trim();

    if (!name) {
      await fetchUsers();
      return;
    }

    try {
      const res = await api.get<User>('/accounts/users', { params: { name } });
      setUsers([res.data]);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        setUsers([]);
        toast({ title: `No user found with name "${name}"` });
        return;
      }
      toast({ title: 'Error searching user', variant: 'destructive' });
    }
  };

  const openDetails = async (id: number) => {
    try {
      const res = await api.get<User>(`/accounts/users/${id}`);
      setViewingUser(res.data);
      setIsDetailsOpen(true);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        toast({ title: 'User not found', variant: 'destructive' });
        return;
      }
      toast({ title: 'Error loading user details', variant: 'destructive' });
    }
  };

  const handleFindById = async () => {
    const id = Number(searchId.trim());
    if (!searchId.trim() || Number.isNaN(id)) {
      toast({ title: 'Please enter a valid user ID', variant: 'destructive' });
      return;
    }
    await openDetails(id);
  };

  const handleResetFilters = async () => {
    setSearchName('');
    setSearchId('');
    await fetchUsers();
  };

  const openForm = (user: User | null = null) => {
    setEditingUser(user);
    if (user) {
      setFormData({
        userName: user.userName,
        userPassword: user.userPassword,
        firstName: user.userDetails?.firstName || '',
        lastName: user.userDetails?.lastName || '',
        email: user.userDetails?.email || '',
        active: user.active,
      });
    } else {
      setFormData({ ...emptyFormData });
    }
    setIsFormOpen(true);
  };

  const handleSave = async () => {
    if (!formData.userName.trim() || !formData.userPassword.trim()) {
      toast({ title: 'Username and password are required', variant: 'destructive' });
      return;
    }

    try {
      const payload = {
        userName: formData.userName.trim(),
        userPassword: formData.userPassword,
        active: formData.active,
        userDetails: {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
        },
      };

      if (editingUser) {
        await api.put(`/accounts/users/${editingUser.id}`, payload);
        toast({ title: 'User updated' });
      } else {
        await api.post('/accounts/users', payload);
        toast({ title: 'User created' });
      }
      setIsFormOpen(false);
      await fetchUsers();
    } catch {
      toast({ title: 'Error saving user', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/accounts/users/${id}`);
      toast({ title: 'User deleted' });
      await fetchUsers();
    } catch {
      toast({ title: 'Error deleting user', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Users</h2>
        <Button onClick={() => openForm()}>
          <Plus className="mr-2 h-4 w-4" /> Add User
        </Button>
      </div>

      <div className="rounded-md border bg-white shadow-sm p-4">
        <div className="grid gap-3 lg:grid-cols-[2fr_1fr_auto_auto]">
          <Input
            placeholder="Search by username..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                void searchUsersByName();
              }
            }}
          />
          <Input
            placeholder="Find by ID..."
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                void handleFindById();
              }
            }}
          />
          <Button variant="secondary" onClick={() => void searchUsersByName()}>
            <Search className="mr-2 h-4 w-4" /> Search
          </Button>
          <Button variant="outline" onClick={() => void handleResetFilters()}>
            <X className="mr-2 h-4 w-4" /> Reset
          </Button>
        </div>
        <div className="mt-3">
          <Button variant="outline" onClick={() => void handleFindById()}>
            <Eye className="mr-2 h-4 w-4" /> Open Detail By ID
          </Button>
        </div>
      </div>

      <div className="rounded-md border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell>{u.id}</TableCell>
                <TableCell className="font-medium">{u.userName}</TableCell>
                <TableCell>{u.userDetails?.firstName} {u.userDetails?.lastName}</TableCell>
                <TableCell>{u.userDetails?.email}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${u.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {u.active ? 'Active' : 'Inactive'}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => void openDetails(u.id)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => openForm(u)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700" onClick={() => void handleDelete(u.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-neutral-500">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingUser ? 'Edit User' : 'Create New User'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right font-medium">Username</Label>
              <Input className="col-span-3" value={formData.userName} onChange={(e) => setFormData({ ...formData, userName: e.target.value })} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right font-medium">Password</Label>
              <Input type="password" className="col-span-3" value={formData.userPassword} onChange={(e) => setFormData({ ...formData, userPassword: e.target.value })} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right font-medium">First Name</Label>
              <Input className="col-span-3" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right font-medium">Last Name</Label>
              <Input className="col-span-3" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right font-medium">Email</Label>
              <Input type="email" className="col-span-3" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
            <Button onClick={() => void handleSave()}>Save User</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 text-sm">
            <div className="grid grid-cols-3 gap-2">
              <span className="text-neutral-500">ID</span>
              <span className="col-span-2 font-medium">{viewingUser?.id ?? '-'}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="text-neutral-500">Username</span>
              <span className="col-span-2 font-medium">{viewingUser?.userName || '-'}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="text-neutral-500">First Name</span>
              <span className="col-span-2">{viewingUser?.userDetails?.firstName || '-'}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="text-neutral-500">Last Name</span>
              <span className="col-span-2">{viewingUser?.userDetails?.lastName || '-'}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="text-neutral-500">Email</span>
              <span className="col-span-2">{viewingUser?.userDetails?.email || '-'}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="text-neutral-500">Phone</span>
              <span className="col-span-2">{viewingUser?.userDetails?.phoneNumber || '-'}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="text-neutral-500">Location</span>
              <span className="col-span-2">
                {[viewingUser?.userDetails?.locality, viewingUser?.userDetails?.country].filter(Boolean).join(', ') || '-'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="text-neutral-500">Status</span>
              <span className="col-span-2">{viewingUser?.active ? 'Active' : 'Inactive'}</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
