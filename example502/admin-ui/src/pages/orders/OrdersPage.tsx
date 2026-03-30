import { useEffect, useState } from 'react';
import axios from 'axios';
import { api } from '@/lib/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Eye, Pencil } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type OrderUser = {
  userName?: string;
};

type OrderProduct = {
  productName?: string;
  price?: number;
};

type OrderItem = {
  quantity: number;
  subTotal: number;
  product?: OrderProduct | null;
};

type Order = {
  id: number;
  orderedDate: string;
  total: number;
  status: string;
  user?: OrderUser | null;
  items?: OrderItem[];
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [status, setStatus] = useState('');

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [orderDetails, setOrderDetails] = useState<Order | null>(null);

  const { toast } = useToast();

  const fetchOrders = async () => {
    try {
      const res = await api.get<Order[]>('/shop/orders');
      setOrders(res.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        setOrders([]);
        return;
      }
      toast({ title: 'Error fetching orders', variant: 'destructive' });
    }
  };

  useEffect(() => {
    void fetchOrders();
  }, []);

  const openStatusForm = (order: Order) => {
    setEditingOrder(order);
    setStatus(order.status);
    setIsStatusOpen(true);
  };

  const openDetails = async (orderId: number) => {
    try {
      const res = await api.get<Order>(`/shop/order/${orderId}`);
      setOrderDetails(res.data);
      setIsDetailsOpen(true);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        toast({ title: 'Order not found', variant: 'destructive' });
        return;
      }
      toast({ title: 'Error loading order details', variant: 'destructive' });
    }
  };

  const handleSave = async () => {
    if (!editingOrder) return;

    try {
      await api.put(`/shop/order/${editingOrder.id}/status?status=${status}`);
      toast({ title: 'Order status updated' });
      setIsStatusOpen(false);
      await fetchOrders();

      if (orderDetails?.id === editingOrder.id) {
        await openDetails(editingOrder.id);
      }
    } catch {
      toast({ title: 'Error saving order', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold tracking-tight">Orders</h2>
      <div className="rounded-md border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total ($)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((o) => (
              <TableRow key={o.id}>
                <TableCell>{o.id}</TableCell>
                <TableCell>{o.user?.userName || '-'}</TableCell>
                <TableCell>{o.orderedDate}</TableCell>
                <TableCell>${o.total}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${o.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' : o.status === 'DELIVERED' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                    {o.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => void openDetails(o.id)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => openStatusForm(o)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {orders.length === 0 && <TableRow><TableCell colSpan={6} className="text-center py-8 text-neutral-500">No orders found.</TableCell></TableRow>}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isStatusOpen} onOpenChange={setIsStatusOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right font-medium">Status</Label>
              <div className="col-span-3">
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PAYMENT_EXPECTED">Payment Expected</SelectItem>
                    <SelectItem value="SHIPPED">Shipped</SelectItem>
                    <SelectItem value="DELIVERED">Delivered</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setIsStatusOpen(false)}>Cancel</Button>
            <Button onClick={() => void handleSave()}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[720px]">
          <DialogHeader>
            <DialogTitle>Order Details #{orderDetails?.id}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-2 text-sm">
            <p><span className="text-neutral-500">User:</span> {orderDetails?.user?.userName || '-'}</p>
            <p><span className="text-neutral-500">Date:</span> {orderDetails?.orderedDate || '-'}</p>
            <p><span className="text-neutral-500">Status:</span> {orderDetails?.status || '-'}</p>
            <p><span className="text-neutral-500">Total:</span> ${orderDetails?.total ?? 0}</p>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Price ($)</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">Subtotal ($)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(orderDetails?.items || []).map((item, index) => (
                  <TableRow key={`${item.product?.productName || 'item'}-${index}`}>
                    <TableCell>{item.product?.productName || '-'}</TableCell>
                    <TableCell className="text-right">{item.product?.price ?? '-'}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">{item.subTotal}</TableCell>
                  </TableRow>
                ))}
                {(orderDetails?.items || []).length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6 text-neutral-500">
                      No items in this order.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
