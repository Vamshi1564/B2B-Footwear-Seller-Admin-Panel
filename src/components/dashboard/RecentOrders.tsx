import { Order } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface RecentOrdersProps {
  orders: Order[];
  linkTo: string;
}

const statusStyles: Record<Order['status'], string> = {
  pending: 'bg-warning/10 text-warning border-warning/20',
  confirmed: 'bg-info/10 text-info border-info/20',
  packed: 'bg-primary/10 text-primary border-primary/20',
  shipped: 'bg-primary/10 text-primary border-primary/20',
  delivered: 'bg-success/10 text-success border-success/20',
  returned: 'bg-destructive/10 text-destructive border-destructive/20',
};

export function RecentOrders({ orders, linkTo }: RecentOrdersProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card className="shadow-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-heading">Recent Orders</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link to={linkTo} className="flex items-center gap-1 text-primary">
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {orders.slice(0, 5).map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{order.id}</span>
                  <Badge 
                    variant="outline" 
                    className={cn("capitalize text-xs", statusStyles[order.status])}
                  >
                    {order.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{order.retailerName}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-sm">{formatCurrency(order.totalAmount)}</p>
                <p className="text-xs text-muted-foreground">{order.createdAt}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
