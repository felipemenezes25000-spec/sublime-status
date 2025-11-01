import { Incident } from '@/types/status';
import { StatusBadge } from './StatusBadge';
import { Clock, AlertTriangle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface IncidentCardProps {
  incident: Incident;
}

export const IncidentCard = ({ incident }: IncidentCardProps) => {
  const isResolved = !!incident.endTime;
  const latestUpdate = incident.updates[incident.updates.length - 1];

  return (
    <div className="glass-card relative overflow-hidden p-4 hover:scale-[1.02] transition-transform duration-300">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-status-error" />
            <h3 className="font-semibold">{incident.title}</h3>
          </div>
          <div className="flex flex-wrap gap-2 mb-2">
            <StatusBadge status={incident.severity} label="" />
            {incident.systems.map((sys) => (
              <span
                key={sys}
                className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground"
              >
                {sys}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>
            Iniciado {formatDistanceToNow(incident.startTime, { addSuffix: true, locale: ptBR })}
          </span>
        </div>

        {latestUpdate && (
          <div className="p-3 rounded-lg bg-muted/30 border border-glass-border">
            <p className="text-xs text-muted-foreground mb-1">Última atualização</p>
            <p className="text-sm">{latestUpdate.message}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {formatDistanceToNow(latestUpdate.time, { addSuffix: true, locale: ptBR })}
            </p>
          </div>
        )}

        {isResolved && (
          <div className="flex items-center gap-2 text-status-ok text-sm font-medium">
            <div className="w-2 h-2 rounded-full bg-status-ok" />
            Resolvido
          </div>
        )}
      </div>

      {/* Priority indicator */}
      <div
        className={`absolute top-0 right-0 w-1 h-full ${
          incident.severity === 'error'
            ? 'bg-status-error'
            : incident.severity === 'warn'
            ? 'bg-status-warn'
            : 'bg-status-info'
        }`}
      />
    </div>
  );
};
