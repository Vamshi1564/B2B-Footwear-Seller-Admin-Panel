import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { RecentOrders } from '@/components/dashboard/RecentOrders';
import { mockAdminStats, mockOrders, mockRetailers, mockSellers } from '@/data/mockData';
import { Users, Store, ShoppingCart, IndianRupee, Clock, TrendingUp, UserCheck, UserX } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { StatusBadge } from '@/components/ui/status-badge';

export default function AdminDashboard() {
  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)}Cr`;
    }
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    }
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const pendingRetailers = mockRetailers.filter(r => r.status === 'pending');
  const pendingSellers = mockSellers.filter(s => s.status === 'pending');

  return (
    <DashboardLayout userType="admin">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Overview of your B2B footwear marketplace
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Revenue"
            value={formatCurrency(mockAdminStats.totalRevenue)}
            change={mockAdminStats.revenueChange}
            icon={<IndianRupee className="w-5 h-5" />}
            variant="primary"
          />
          <StatsCard
            title="Total Orders"
            value={mockAdminStats.totalOrders.toLocaleString()}
            change={mockAdminStats.ordersChange}
            icon={<ShoppingCart className="w-5 h-5" />}
          />
          <StatsCard
            title="Active Retailers"
            value={mockAdminStats.totalRetailers}
            icon={<Users className="w-5 h-5" />}
            variant="accent"
          />
          <StatsCard
            title="Active Sellers"
            value={mockAdminStats.totalSellers}
            icon={<Store className="w-5 h-5" />}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <RecentOrders orders={mockOrders} linkTo="/admin/orders" />
          </div>

          {/* Pending Approvals */}
          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-heading flex items-center gap-2">
                <Clock className="w-5 h-5 text-warning" />
                Pending Approvals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Pending Retailers */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-muted-foreground">Retailers</span>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/admin/retailers?status=pending">View All</Link>
                    </Button>
                  </div>
                  {pendingRetailers.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-2">No pending retailers</p>
                  ) : (
                    <div className="space-y-2">
                      {pendingRetailers.slice(0, 3).map((retailer) => (
                        <div key={retailer.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div>
                            <p className="font-medium text-sm">{retailer.storeName}</p>
                            <p className="text-xs text-muted-foreground">{retailer.ownerName}</p>
                          </div>
                          <div className="flex gap-1">
                            <Button size="icon" variant="ghost" className="h-7 w-7 text-success hover:text-success">
                              <UserCheck className="w-4 h-4" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive hover:text-destructive">
                              <UserX className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Pending Sellers */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-muted-foreground">Sellers</span>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/admin/sellers?status=pending">View All</Link>
                    </Button>
                  </div>
                  {pendingSellers.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-2">No pending sellers</p>
                  ) : (
                    <div className="space-y-2">
                      {pendingSellers.slice(0, 3).map((seller) => (
                        <div key={seller.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div>
                            <p className="font-medium text-sm">{seller.businessName}</p>
                            <p className="text-xs text-muted-foreground">{seller.ownerName}</p>
                          </div>
                          <StatusBadge status={seller.status} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Overview */}
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-heading flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-success" />
              Platform Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <p className="text-3xl font-heading font-bold text-primary">324</p>
                <p className="text-sm text-muted-foreground mt-1">Total Products</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <p className="text-3xl font-heading font-bold text-success">89%</p>
                <p className="text-sm text-muted-foreground mt-1">Order Success Rate</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <p className="text-3xl font-heading font-bold text-accent">₹18.2K</p>
                <p className="text-sm text-muted-foreground mt-1">Avg. Order Value</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <p className="text-3xl font-heading font-bold text-info">2.1 days</p>
                <p className="text-sm text-muted-foreground mt-1">Avg. Delivery Time</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
