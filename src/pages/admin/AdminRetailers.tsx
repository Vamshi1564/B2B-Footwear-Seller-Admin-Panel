import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { mockRetailers } from '@/data/mockData';
import { Retailer } from '@/types';
import { DataTable, Column } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Search, Eye, UserCheck, UserX, FileText, CreditCard } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

export default function AdminRetailers() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRetailer, setSelectedRetailer] = useState<Retailer | null>(null);

  const filteredRetailers = mockRetailers.filter(retailer => {
    const matchesSearch = retailer.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      retailer.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      retailer.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || retailer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleApprove = (retailer: Retailer) => {
    toast({
      title: "Retailer Approved",
      description: `${retailer.storeName} has been approved successfully.`,
    });
    setSelectedRetailer(null);
  };

  const handleReject = (retailer: Retailer) => {
    toast({
      title: "Retailer Rejected",
      description: `${retailer.storeName} has been rejected.`,
      variant: "destructive",
    });
    setSelectedRetailer(null);
  };

  const columns: Column<Retailer>[] = [
    {
      key: 'storeName',
      header: 'Store',
      render: (retailer) => (
        <div>
          <p className="font-medium">{retailer.storeName}</p>
          <p className="text-xs text-muted-foreground">{retailer.ownerName}</p>
        </div>
      ),
    },
    {
      key: 'contact',
      header: 'Contact',
      render: (retailer) => (
        <div>
          <p className="text-sm">{retailer.email}</p>
          <p className="text-xs text-muted-foreground">{retailer.phone}</p>
        </div>
      ),
    },
    {
      key: 'location',
      header: 'Location',
      render: (retailer) => (
        <div>
          <p className="text-sm">{retailer.address}</p>
          <p className="text-xs text-muted-foreground">PIN: {retailer.pincode}</p>
        </div>
      ),
    },
    {
      key: 'credit',
      header: 'Credit',
      render: (retailer) => (
        retailer.creditLimit > 0 ? (
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>{formatCurrency(retailer.creditUsed)}</span>
              <span className="text-muted-foreground">/ {formatCurrency(retailer.creditLimit)}</span>
            </div>
            <Progress value={(retailer.creditUsed / retailer.creditLimit) * 100} className="h-1.5" />
          </div>
        ) : (
          <span className="text-muted-foreground text-sm">No credit line</span>
        )
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (retailer) => <StatusBadge status={retailer.status} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (retailer) => (
        <Button 
          variant="ghost" 
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedRetailer(retailer);
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
        <div>
          <h1 className="text-2xl font-heading font-bold">Retailers</h1>
          <p className="text-muted-foreground">Manage retailer accounts and approvals</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total', count: mockRetailers.length, color: 'bg-primary/10 text-primary' },
            { label: 'Approved', count: mockRetailers.filter(r => r.status === 'approved').length, color: 'bg-success/10 text-success' },
            { label: 'Pending', count: mockRetailers.filter(r => r.status === 'pending').length, color: 'bg-warning/10 text-warning' },
            { label: 'Rejected', count: mockRetailers.filter(r => r.status === 'rejected').length, color: 'bg-destructive/10 text-destructive' },
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
              placeholder="Search retailers..."
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
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Retailers Table */}
        <DataTable
          columns={columns}
          data={filteredRetailers}
          onRowClick={(retailer) => setSelectedRetailer(retailer)}
          emptyMessage="No retailers found"
        />

        {/* Retailer Details Dialog */}
        <Dialog open={!!selectedRetailer} onOpenChange={() => setSelectedRetailer(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-heading">
                Retailer Details
              </DialogTitle>
            </DialogHeader>
            {selectedRetailer && (
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Store Name</p>
                    <p className="font-medium">{selectedRetailer.storeName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Owner</p>
                    <p className="font-medium">{selectedRetailer.ownerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedRetailer.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{selectedRetailer.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <StatusBadge status={selectedRetailer.status} className="mt-1" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Registered On</p>
                    <p className="font-medium">{selectedRetailer.createdAt}</p>
                  </div>
                </div>

                <Separator />

                {/* Documents */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Verification Documents
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">GST Number</p>
                      <p className="font-medium">{selectedRetailer.gstNumber || 'Not provided'}</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Trade License</p>
                      <p className="font-medium">{selectedRetailer.tradeLicense || 'Not provided'}</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">PAN</p>
                      <p className="font-medium">{selectedRetailer.pan || 'Not provided'}</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Aadhaar</p>
                      <p className="font-medium">{selectedRetailer.aadhaar || 'Not provided'}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Credit Management */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Credit Management
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="creditLimit">Credit Limit (₹)</Label>
                      <Input 
                        id="creditLimit" 
                        type="number" 
                        defaultValue={selectedRetailer.creditLimit} 
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Current Usage</Label>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{formatCurrency(selectedRetailer.creditUsed)}</span>
                          <span className="text-muted-foreground">
                            of {formatCurrency(selectedRetailer.creditLimit)}
                          </span>
                        </div>
                        <Progress 
                          value={selectedRetailer.creditLimit > 0 
                            ? (selectedRetailer.creditUsed / selectedRetailer.creditLimit) * 100 
                            : 0
                          } 
                          className="h-2" 
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {selectedRetailer.status === 'pending' && (
                  <div className="flex gap-2 pt-4 border-t">
                    <Button 
                      className="flex-1 bg-success hover:bg-success/90"
                      onClick={() => handleApprove(selectedRetailer)}
                    >
                      <UserCheck className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button 
                      variant="destructive"
                      className="flex-1"
                      onClick={() => handleReject(selectedRetailer)}
                    >
                      <UserX className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                )}

                {selectedRetailer.status === 'approved' && (
                  <div className="flex justify-end pt-4 border-t">
                    <Button className="gradient-primary">
                      Save Changes
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
