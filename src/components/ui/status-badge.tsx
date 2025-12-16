import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type StatusType = 'pending' | 'approved' | 'rejected' | 'active' | 'inactive' | 'confirmed' | 'packed' | 'shipped' | 'delivered' | 'returned' | 'paid' | 'failed';

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'bg-warning/10 text-warning border-warning/30' },
  approved: { label: 'Approved', className: 'bg-success/10 text-success border-success/30' },
  rejected: { label: 'Rejected', className: 'bg-destructive/10 text-destructive border-destructive/30' },
  active: { label: 'Active', className: 'bg-success/10 text-success border-success/30' },
  inactive: { label: 'Inactive', className: 'bg-muted text-muted-foreground border-border' },
  confirmed: { label: 'Confirmed', className: 'bg-info/10 text-info border-info/30' },
  packed: { label: 'Packed', className: 'bg-primary/10 text-primary border-primary/30' },
  shipped: { label: 'Shipped', className: 'bg-primary/10 text-primary border-primary/30' },
  delivered: { label: 'Delivered', className: 'bg-success/10 text-success border-success/30' },
  returned: { label: 'Returned', className: 'bg-destructive/10 text-destructive border-destructive/30' },
  paid: { label: 'Paid', className: 'bg-success/10 text-success border-success/30' },
  failed: { label: 'Failed', className: 'bg-destructive/10 text-destructive border-destructive/30' },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <Badge 
      variant="outline" 
      className={cn("capitalize font-medium", config.className, className)}
    >
      {config.label}
    </Badge>
  );
}
