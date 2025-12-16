import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { mockSellers } from '@/data/mockData';
import { Seller } from '@/types';
import { DataTable, Column } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Search, Eye, Plus, UserCheck, UserX, MapPin, Package, Truck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminSellers() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredSellers = mockSellers.filter(seller => {
    const matchesSearch = seller.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seller.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seller.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || seller.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApprove = (seller: Seller) => {
    toast({
      title: "Seller Approved",
      description: `${seller.businessName} has been approved successfully.`,
    });
    setSelectedSeller(null);
  };

  const handleReject = (seller: Seller) => {
    toast({
      title: "Seller Rejected",
      description: `${seller.businessName} has been rejected.`,
      variant: "destructive",
    });
    setSelectedSeller(null);
  };

  const columns: Column<Seller>[] = [
    {
      key: 'businessName',
      header: 'Business',
      render: (seller) => (
        <div>
          <p className="font-medium">{seller.businessName}</p>
          <p className="text-xs text-muted-foreground">{seller.ownerName}</p>
        </div>
      ),
    },
    {
      key: 'contact',
      header: 'Contact',
      render: (seller) => (
        <div>
          <p className="text-sm">{seller.email}</p>
          <p className="text-xs text-muted-foreground">{seller.phone}</p>
        </div>
      ),
    },
    {
      key: 'moq',
      header: 'MOQ',
      render: (seller) => (
        <Badge variant="outline" className="font-mono">
          {seller.moq} pairs
        </Badge>
      ),
    },
    {
      key: 'pincodes',
      header: 'Service Area',
      render: (seller) => (
        <div className="flex items-center gap-1">
          <MapPin className="w-3 h-3 text-muted-foreground" />
          <span className="text-sm">{seller.pincodes.length} pincodes</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (seller) => <StatusBadge status={seller.status} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (seller) => (
        <Button 
          variant="ghost" 
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedSeller(seller);
          }}
        >
          <Eye className="w-4 h-4 mr-1" />
          View
        </Button>
      ),
    },
  ];

  return (
    <DashboardLayout userType="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-heading font-bold">Sellers</h1>
            <p className="text-muted-foreground">Manage seller accounts and catalogs</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-accent text-accent-foreground">
                <Plus className="w-4 h-4 mr-2" />
                Add Seller
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="font-heading">Add New Seller</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input id="businessName" placeholder="Enter business name" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="ownerName">Owner Name</Label>
                  <Input id="ownerName" placeholder="Enter owner name" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Enter email" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" placeholder="Enter phone number" />
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="gradient-primary">Add Seller</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Sellers', count: mockSellers.length, color: 'bg-primary/10 text-primary' },
            { label: 'Active', count: mockSellers.filter(s => s.status === 'active').length, color: 'bg-success/10 text-success' },
            { label: 'Pending', count: mockSellers.filter(s => s.status === 'pending').length, color: 'bg-warning/10 text-warning' },
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
              placeholder="Search sellers..."
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
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sellers Table */}
        <DataTable
          columns={columns}
          data={filteredSellers}
          onRowClick={(seller) => setSelectedSeller(seller)}
          emptyMessage="No sellers found"
        />

        {/* Seller Details Dialog */}
        <Dialog open={!!selectedSeller} onOpenChange={() => setSelectedSeller(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="font-heading">
                Seller Details
              </DialogTitle>
            </DialogHeader>
            {selectedSeller && (
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Business Name</p>
                    <p className="font-medium">{selectedSeller.businessName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Owner</p>
                    <p className="font-medium">{selectedSeller.ownerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedSeller.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{selectedSeller.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <StatusBadge status={selectedSeller.status} className="mt-1" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Joined</p>
                    <p className="font-medium">{selectedSeller.createdAt}</p>
                  </div>
                </div>

                <Separator />

                {/* Business Settings */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      Order Settings
                    </h4>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Minimum Order Quantity</p>
                      <p className="font-medium text-lg">{selectedSeller.moq} pairs</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Truck className="w-4 h-4" />
                      Delivery Settings
                    </h4>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Delivery Charge</p>
                      <p className="font-medium text-lg">₹{selectedSeller.deliveryCharge}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Service Area */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Service Area Pincodes
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedSeller.pincodes.map((pincode) => (
                      <Badge key={pincode} variant="secondary">
                        {pincode}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                {selectedSeller.status === 'pending' && (
                  <div className="flex gap-2 pt-4 border-t">
                    <Button 
                      className="flex-1 bg-success hover:bg-success/90"
                      onClick={() => handleApprove(selectedSeller)}
                    >
                      <UserCheck className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button 
                      variant="destructive"
                      className="flex-1"
                      onClick={() => handleReject(selectedSeller)}
                    >
                      <UserX className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
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
