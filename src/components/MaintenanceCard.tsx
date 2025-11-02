import { Maintenance } from '@/types/status';
import { Wrench, Clock, AlertCircle, ChevronRight, Calendar } from 'lucide-react';
import { format, differenceInMinutes } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface MaintenanceCardProps {
  maintenance: Maintenance;
}

export const MaintenanceCard = ({ maintenance }: MaintenanceCardProps) => {
  const durationMinutes = differenceInMinutes(maintenance.scheduledEnd, maintenance.scheduledStart);

  return (
    <div className="glass-card p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        <Wrench className="h-5 w-5 text-status-info mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-base mb-2">{maintenance.title}</h3>
          
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
            <span>{maintenance.area}</span>
            <ChevronRight className="h-3 w-3" />
            <span>{maintenance.journey}</span>
            <ChevronRight className="h-3 w-3" />
            <span className="font-medium">{maintenance.product}</span>
          </div>
          
          <div className="space-y-1.5 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              <span>
                {format(maintenance.scheduledStart, "d 'de' MMMM 'às' HH:mm", { locale: ptBR })}
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span>Duração: {durationMinutes} minutos</span>
            </div>

            <div className="mt-3 p-3 rounded-lg bg-card/40">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-status-warn mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-1">Impacto Esperado</p>
                  <p className="text-sm">{maintenance.impact}</p>
                  {maintenance.description && (
                    <>
                      <p className="text-xs font-semibold text-muted-foreground mt-2 mb-1">Descrição</p>
                      <p className="text-sm text-muted-foreground">{maintenance.description}</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
