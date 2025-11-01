import { CheckCircle2, AlertTriangle, AlertCircle, Info, Wrench } from 'lucide-react';
import { StatusType } from '@/types/status';

interface OverallStatusProps {
  status: StatusType;
  message: string;
  affectedSystems?: number;
}

export const OverallStatus = ({ status, message, affectedSystems }: OverallStatusProps) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'ok':
        return {
          icon: CheckCircle2,
          text: 'Todos os Sistemas Operacionais',
          bgClass: 'bg-status-ok-bg border-status-ok/20',
          iconClass: 'text-status-ok',
          textClass: 'text-status-ok',
        };
      case 'warn':
        return {
          icon: AlertTriangle,
          text: 'Degradação Parcial',
          bgClass: 'bg-status-warn-bg border-status-warn/20',
          iconClass: 'text-status-warn',
          textClass: 'text-status-warn',
        };
      case 'error':
        return {
          icon: AlertCircle,
          text: 'Interrupção de Serviço',
          bgClass: 'bg-status-error-bg border-status-error/20',
          iconClass: 'text-status-error',
          textClass: 'text-status-error',
        };
      case 'info':
        return {
          icon: Info,
          text: 'Informação',
          bgClass: 'bg-status-info-bg border-status-info/20',
          iconClass: 'text-status-info',
          textClass: 'text-status-info',
        };
      case 'maint':
        return {
          icon: Wrench,
          text: 'Manutenção Programada',
          bgClass: 'bg-status-maint-bg border-status-maint/20',
          iconClass: 'text-status-maint',
          textClass: 'text-status-maint',
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div className={`${config.bgClass} border-2 rounded-xl p-6 mb-6 animate-fade-in`}>
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-xl bg-background/50 ${config.iconClass}`}>
          <Icon className="h-8 w-8" />
        </div>
        <div className="flex-1">
          <h2 className={`text-2xl font-bold mb-1 ${config.textClass}`}>
            {config.text}
          </h2>
          <p className="text-base text-muted-foreground">
            {message}
          </p>
          {affectedSystems && affectedSystems > 0 && (
            <p className="text-sm text-muted-foreground mt-2">
              {affectedSystems} {affectedSystems === 1 ? 'sistema afetado' : 'sistemas afetados'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
