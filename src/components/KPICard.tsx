import { KPI } from '@/types/status';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { KPITooltip } from './KPITooltip';

interface KPICardProps {
  kpi: KPI;
  type: 'mttr' | 'mtbf' | 'sla' | 'slo';
}

export const KPICard = ({ kpi, type }: KPICardProps) => {
  const getTrendIcon = () => {
    if (!kpi.trend) return <Minus className="h-4 w-4 text-muted-foreground" />;
    if (kpi.trend === 'up')
      return <TrendingUp className="h-4 w-4 text-status-ok" />;
    if (kpi.trend === 'down')
      return <TrendingDown className="h-4 w-4 text-status-error" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <div className="glass-card p-5 hover:shadow-lg transition-all duration-300">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-muted-foreground">{kpi.label}</h3>
          <KPITooltip type={type} />
        </div>
        {getTrendIcon()}
      </div>
      
      <div className="flex items-end justify-between">
        <div>
          <p className="text-3xl font-bold tracking-tight">{kpi.value}</p>
          {kpi.change && (
            <p
              className={cn(
                'text-xs mt-2 font-medium',
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
    </div>
  );
};
