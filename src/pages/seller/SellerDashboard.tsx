import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { RecentOrders } from '@/components/dashboard/RecentOrders';
import { mockSellerStats, mockOrders, mockProducts } from '@/data/mockData';
import { Package, ShoppingCart, IndianRupee, Clock, TrendingUp, Box } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export default function SellerDashboard() {
  const formatCurrency = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    }
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const sellerOrders = mockOrders.filter(order => order.sellerId === '1');
  const sellerProducts = mockProducts.filter(product => product.sellerId === '1');
  const lowStockProducts = sellerProducts.filter(p => p.stock < 100);

  return (
    <DashboardLayout userType="seller">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">
            Welcome back, Premier Footwear Co.
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening with your store today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Revenue"
            value={formatCurrency(mockSellerStats.totalRevenue)}
            change={mockSellerStats.revenueChange}
            icon={<IndianRupee className="w-5 h-5" />}
            variant="primary"
          />
          <StatsCard
            title="Total Orders"
            value={mockSellerStats.totalOrders}
            change={mockSellerStats.ordersChange}
            icon={<ShoppingCart className="w-5 h-5" />}
          />
          <StatsCard
            title="Pending Orders"
            value={mockSellerStats.pendingOrders}
            icon={<Clock className="w-5 h-5" />}
            variant="accent"
          />
          <StatsCard
            title="Active Products"
            value={mockSellerStats.totalProducts}
            icon={<Package className="w-5 h-5" />}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <RecentOrders orders={sellerOrders} linkTo="/seller/orders" />
          </div>

          {/* Low Stock Alert */}
          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-heading flex items-center gap-2">
                <Box className="w-5 h-5 text-warning" />
                Low Stock Alert
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lowStockProducts.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    All products are well stocked!
                  </p>
                ) : (
                  lowStockProducts.map((product) => (
                    <div key={product.id} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium truncate max-w-[180px]">{product.title}</span>
                        <span className="text-muted-foreground">{product.stock} units</span>
                      </div>
                      <Progress 
                        value={(product.stock / 500) * 100} 
                        className="h-2"
                      />
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Overview */}
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-heading flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-success" />
              Performance Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <p className="text-3xl font-heading font-bold text-primary">92%</p>
                <p className="text-sm text-muted-foreground mt-1">Order Fulfillment Rate</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <p className="text-3xl font-heading font-bold text-success">4.8</p>
                <p className="text-sm text-muted-foreground mt-1">Average Rating</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <p className="text-3xl font-heading font-bold text-accent">2.3 days</p>
                <p className="text-sm text-muted-foreground mt-1">Avg. Delivery Time</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
