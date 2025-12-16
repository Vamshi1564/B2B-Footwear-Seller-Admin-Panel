import { ReactNode } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: ReactNode;
  variant?: 'default' | 'primary' | 'accent' | 'success';
}

const variantStyles = {
  default: 'bg-card',
  primary: 'gradient-primary text-primary-foreground',
  accent: 'gradient-accent text-accent-foreground',
  success: 'bg-success text-success-foreground',
};

const iconWrapperStyles = {
  default: 'bg-primary/10 text-primary',
  primary: 'bg-primary-foreground/20 text-primary-foreground',
  accent: 'bg-accent-foreground/20 text-accent-foreground',
  success: 'bg-success-foreground/20 text-success-foreground',
};

export function StatsCard({ title, value, change, icon, variant = 'default' }: StatsCardProps) {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-200 hover:shadow-lg",
      variantStyles[variant],
      variant === 'default' && "shadow-card hover:shadow-md"
    )}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className={cn(
              "text-sm font-medium",
              variant === 'default' ? "text-muted-foreground" : "opacity-80"
            )}>
              {title}
            </p>
            <p className="text-2xl font-heading font-bold">{value}</p>
            {change !== undefined && (
              <div className={cn(
                "flex items-center gap-1 text-xs font-medium",
                variant === 'default' ? (
                  isPositive ? "text-success" : isNegative ? "text-destructive" : "text-muted-foreground"
                ) : "opacity-80"
              )}>
                {isPositive ? (
                  <ArrowUp className="w-3 h-3" />
                ) : isNegative ? (
                  <ArrowDown className="w-3 h-3" />
                ) : null}
                <span>{Math.abs(change)}% from last month</span>
              </div>
            )}
          </div>
          <div className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center",
            iconWrapperStyles[variant]
          )}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
