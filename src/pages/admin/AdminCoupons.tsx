import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { mockCoupons } from '@/data/mockData';
import { Coupon } from '@/types';
import { DataTable, Column } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Plus, Search, Edit, Trash2, Tag, Percent, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminCoupons() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredCoupons = mockCoupons.filter(coupon =>
    coupon.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleDelete = (coupon: Coupon) => {
    toast({
      title: "Coupon Deleted",
      description: `Coupon ${coupon.code} has been deleted.`,
      variant: "destructive",
    });
  };

  const columns: Column<Coupon>[] = [
    {
      key: 'code',
      header: 'Coupon Code',
      render: (coupon) => (
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-accent" />
          <span className="font-mono font-bold text-primary">{coupon.code}</span>
        </div>
      ),
    },
    {
      key: 'discount',
      header: 'Discount',
      render: (coupon) => (
        <div>
          <p className="font-semibold">{coupon.discountPercent}% OFF</p>
          <p className="text-xs text-muted-foreground">Max: {formatCurrency(coupon.maxDiscount)}</p>
        </div>
      ),
    },
    {
      key: 'minOrder',
      header: 'Min. Order',
      render: (coupon) => formatCurrency(coupon.minOrder),
    },
    {
      key: 'validity',
      header: 'Validity',
      render: (coupon) => (
        <div className="text-sm">
          <p>{coupon.validFrom}</p>
          <p className="text-muted-foreground">to {coupon.validTo}</p>
        </div>
      ),
    },
    {
      key: 'scope',
      header: 'Scope',
      render: (coupon) => (
        coupon.retailerIds ? (
          <Badge variant="outline">{coupon.retailerIds.length} Retailers</Badge>
        ) : (
          <Badge variant="secondary">All Retailers</Badge>
        )
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (coupon) => <StatusBadge status={coupon.status} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (coupon) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Edit className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(coupon);
            }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout userType="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-heading font-bold">Coupons & Schemes</h1>
            <p className="text-muted-foreground">Manage discount coupons and promotional schemes</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-accent text-accent-foreground">
                <Plus className="w-4 h-4 mr-2" />
                Create Coupon
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="font-heading">Create New Coupon</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="code">Coupon Code</Label>
                  <Input id="code" placeholder="e.g., SUMMER20" className="uppercase" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="discount">Discount %</Label>
                    <Input id="discount" type="number" placeholder="0" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="maxDiscount">Max Discount (₹)</Label>
                    <Input id="maxDiscount" type="number" placeholder="0" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="minOrder">Min. Order Value (₹)</Label>
                  <Input id="minOrder" type="number" placeholder="0" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="validFrom">Valid From</Label>
                    <Input id="validFrom" type="date" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="validTo">Valid To</Label>
                    <Input id="validTo" type="date" />
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <Label htmlFor="active">Active</Label>
                  <Switch id="active" defaultChecked />
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="gradient-primary">Create Coupon</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Coupons', count: mockCoupons.length, icon: Tag, color: 'bg-primary/10 text-primary' },
            { label: 'Active', count: mockCoupons.filter(c => c.status === 'active').length, icon: Percent, color: 'bg-success/10 text-success' },
            { label: 'Expired', count: mockCoupons.filter(c => c.status === 'inactive').length, icon: Calendar, color: 'bg-muted text-muted-foreground' },
          ].map((stat) => (
            <Card key={stat.label} className="shadow-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.count}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search coupons..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Coupons Table */}
        <DataTable
          columns={columns}
          data={filteredCoupons}
          emptyMessage="No coupons found"
        />
      </div>
    </DashboardLayout>
  );
}
