import { Incident } from '@/types/status';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { Clock, AlertCircle, ChevronRight } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface IncidentCardProps {
  incident: Incident;
}

export const IncidentCard = ({ incident }: IncidentCardProps) => {
  const isResolved = !!incident.endTime;

  return (
    <div className="glass-card p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1">
          <AlertCircle className="h-5 w-5 text-status-error mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-base mb-1">{incident.title}</h3>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
              <span>{incident.area}</span>
              <ChevronRight className="h-3 w-3" />
              <span>{incident.journey}</span>
              <ChevronRight className="h-3 w-3" />
              <span className="font-medium">{incident.product}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span>
                {formatDistanceToNow(incident.startTime, { addSuffix: true, locale: ptBR })}
              </span>
              {isResolved && (
                <span className="text-status-ok font-medium">• Resolvido</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <PriorityBadge priority={incident.priority} />
          <StatusBadge status={incident.severity} label="" />
        </div>
      </div>

      {incident.updates.length > 0 && (
        <div className="mt-3 pt-3 border-t border-glass-border space-y-2">
          {incident.updates.map((update, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-primary capitalize">
                    {update.status === 'investigating' && '🔍 Investigando'}
                    {update.status === 'identified' && '✓ Identificado'}
                    {update.status === 'monitoring' && '👁 Monitorando'}
                    {update.status === 'resolved' && '✅ Resolvido'}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {format(update.time, 'HH:mm', { locale: ptBR })}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{update.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
