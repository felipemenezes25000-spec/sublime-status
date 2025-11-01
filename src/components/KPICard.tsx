import { KPI } from '@/types/status';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPICardProps {
  kpi: KPI;
}

export const KPICard = ({ kpi }: KPICardProps) => {
  const getTrendIcon = () => {
    if (!kpi.trend) return <Minus className="h-4 w-4 text-muted-foreground" />;
    if (kpi.trend === 'up')
      return <TrendingUp className="h-4 w-4 text-status-ok" />;
    if (kpi.trend === 'down')
      return <TrendingDown className="h-4 w-4 text-status-error" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <div className="glass-card relative overflow-hidden p-4 hover:scale-105 transition-transform duration-300">
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-sm font-medium text-muted-foreground">{kpi.label}</h3>
        {getTrendIcon()}
      </div>
      
      <div className="flex items-end justify-between">
        <div>
          <p className="text-3xl font-bold tracking-tight">{kpi.value}</p>
          {kpi.change && (
            <p
              className={cn(
                'text-xs mt-1',
                kpi.trend === 'up' && 'text-status-ok',
                kpi.trend === 'down' && 'text-status-error',
                !kpi.trend && 'text-muted-foreground'
              )}
            >
              {kpi.change}
            </p>
          )}
        </div>
      </div>

      {/* Glow effect */}
      <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-primary/10 rounded-full blur-xl" />
    </div>
  );
};
