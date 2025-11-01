import { StatusType } from '@/types/status';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: StatusType;
  label: string;
  showDot?: boolean;
  className?: string;
}

const statusConfig: Record<StatusType, { label: string; dotClass: string; badgeClass: string }> = {
  ok: {
    label: 'Operacional',
    dotClass: 'status-dot-ok',
    badgeClass: 'border-status-ok/30 bg-status-ok/10 text-status-ok hover:bg-status-ok/20',
  },
  warn: {
    label: 'Degradado',
    dotClass: 'status-dot-warn',
    badgeClass: 'border-status-warn/30 bg-status-warn/10 text-status-warn hover:bg-status-warn/20',
  },
  error: {
    label: 'Incidente',
    dotClass: 'status-dot-error',
    badgeClass: 'border-status-error/30 bg-status-error/10 text-status-error hover:bg-status-error/20',
  },
  info: {
    label: 'Informativo',
    dotClass: 'status-dot-info',
    badgeClass: 'border-status-info/30 bg-status-info/10 text-status-info hover:bg-status-info/20',
  },
  maint: {
    label: 'Manutenção',
    dotClass: 'status-dot-maint',
    badgeClass: 'border-status-maint/30 bg-status-maint/10 text-status-maint hover:bg-status-maint/20',
  },
};

export const StatusBadge = ({ status, label, showDot = true, className }: StatusBadgeProps) => {
  const config = statusConfig[status];

  return (
    <Badge
      variant="outline"
      className={cn(
        'transition-all duration-300 font-medium',
        config.badgeClass,
        className
      )}
    >
      {showDot && <span className={cn('status-dot mr-1.5', config.dotClass)} />}
      {label || config.label}
    </Badge>
  );
};
