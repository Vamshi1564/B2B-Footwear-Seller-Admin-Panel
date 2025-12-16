import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { mockOrders } from '@/data/mockData';
import { Order } from '@/types';
import { DataTable, Column } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Search, Eye, Package, Truck, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function SellerOrders() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const sellerOrders = mockOrders.filter(o => o.sellerId === '1');

  const filteredOrders = sellerOrders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.retailerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const columns: Column<Order>[] = [
    {
      key: 'id',
      header: 'Order ID',
      render: (order) => (
        <span className="font-medium text-primary">{order.id}</span>
      ),
    },
    {
      key: 'retailerName',
      header: 'Retailer',
      render: (order) => (
        <div>
          <p className="font-medium">{order.retailerName}</p>
          <p className="text-xs text-muted-foreground">{order.items.length} items</p>
        </div>
      ),
    },
    {
      key: 'totalAmount',
      header: 'Amount',
      render: (order) => (
        <span className="font-semibold">{formatCurrency(order.totalAmount)}</span>
      ),
    },
    {
      key: 'paymentMode',
      header: 'Payment',
      render: (order) => (
        <div className="space-y-1">
          <Badge variant="outline" className="uppercase text-xs">
            {order.paymentMode}
          </Badge>
          <StatusBadge status={order.paymentStatus} className="text-xs" />
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (order) => <StatusBadge status={order.status} />,
    },
    {
      key: 'createdAt',
      header: 'Date',
      render: (order) => (
        <span className="text-muted-foreground">{order.createdAt}</span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (order) => (
        <Button 
          variant="ghost" 
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedOrder(order);
          }}
        >
          <Eye className="w-4 h-4 mr-1" />
          View
        </Button>
      ),
    },
  ];

  const getStatusActions = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return [
          { label: 'Confirm Order', icon: CheckCircle, action: 'confirm' },
        ];
      case 'confirmed':
        return [
          { label: 'Mark as Packed', icon: Package, action: 'pack' },
        ];
      case 'packed':
        return [
          { label: 'Mark as Shipped', icon: Truck, action: 'ship' },
        ];
      default:
        return [];
    }
  };

  return (
    <DashboardLayout userType="seller">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-heading font-bold">Orders</h1>
          <p className="text-muted-foreground">Manage and fulfill customer orders</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Pending', count: sellerOrders.filter(o => o.status === 'pending').length, color: 'bg-warning/10 text-warning' },
            { label: 'Confirmed', count: sellerOrders.filter(o => o.status === 'confirmed').length, color: 'bg-info/10 text-info' },
            { label: 'Shipped', count: sellerOrders.filter(o => o.status === 'shipped').length, color: 'bg-primary/10 text-primary' },
            { label: 'Delivered', count: sellerOrders.filter(o => o.status === 'delivered').length, color: 'bg-success/10 text-success' },
          ].map((stat) => (
            <Card key={stat.label} className="shadow-card">
              <CardContent className="p-4 text-center">
                <p className={`text-2xl font-bold ${stat.color} inline-block px-3 py-1 rounded-lg`}>
                  {stat.count}
                </p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="packed">Packed</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Orders Table */}
        <DataTable
          columns={columns}
          data={filteredOrders}
          onRowClick={(order) => setSelectedOrder(order)}
          emptyMessage="No orders found"
        />

        {/* Order Details Dialog */}
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="font-heading">
                Order Details - {selectedOrder?.id}
              </DialogTitle>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-6">
                {/* Order Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Retailer</p>
                    <p className="font-medium">{selectedOrder.retailerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Order Date</p>
                    <p className="font-medium">{selectedOrder.createdAt}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Payment Mode</p>
                    <Badge variant="outline" className="uppercase mt-1">
                      {selectedOrder.paymentMode}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <StatusBadge status={selectedOrder.status} className="mt-1" />
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h4 className="font-semibold mb-3">Order Items</h4>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                        <div>
                          <p className="font-medium">{item.productTitle}</p>
                          <p className="text-sm text-muted-foreground">
                            Size: {item.size} | Color: {item.color} | Qty: {item.quantity}
                          </p>
                        </div>
                        <p className="font-semibold">{formatCurrency(item.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Total */}
                <div className="border-t pt-4">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{formatCurrency(selectedOrder.totalAmount - selectedOrder.deliveryCharge)}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span>Delivery Charge</span>
                    <span>{formatCurrency(selectedOrder.deliveryCharge)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg mt-2">
                    <span>Total</span>
                    <span>{formatCurrency(selectedOrder.totalAmount)}</span>
                  </div>
                </div>

                {/* Actions */}
                {getStatusActions(selectedOrder.status).length > 0 && (
                  <div className="flex gap-2 pt-4 border-t">
                    {getStatusActions(selectedOrder.status).map((action) => (
                      <Button key={action.action} className="gradient-primary">
                        <action.icon className="w-4 h-4 mr-2" />
                        {action.label}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
