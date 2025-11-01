import { Maintenance } from '@/types/status';
import { Calendar, Clock, Wrench } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface MaintenanceCardProps {
  maintenance: Maintenance;
}

export const MaintenanceCard = ({ maintenance }: MaintenanceCardProps) => {
  const duration = Math.round(
    (maintenance.scheduledEnd.getTime() - maintenance.scheduledStart.getTime()) / (1000 * 60)
  );

  return (
    <div className="glass-card relative overflow-hidden p-4 hover:scale-[1.02] transition-transform duration-300">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-status-maint/10">
          <Wrench className="h-5 w-5 text-status-maint" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold mb-2">{maintenance.title}</h3>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                {format(maintenance.scheduledStart, "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Duração estimada: {duration} minutos</span>
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              {maintenance.systems.map((sys) => (
                <span
                  key={sys}
                  className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground"
                >
                  {sys}
                </span>
              ))}
            </div>

            <div className="p-3 rounded-lg bg-muted/30 border border-glass-border mt-3">
              <p className="text-xs text-muted-foreground mb-1">Impacto esperado</p>
              <p className="text-sm">{maintenance.impact}</p>
              {maintenance.description && (
                <>
                  <p className="text-xs text-muted-foreground mt-2 mb-1">Descrição</p>
                  <p className="text-sm">{maintenance.description}</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Status indicator */}
      <div className="absolute top-0 right-0 w-1 h-full bg-status-maint" />
    </div>
  );
};
