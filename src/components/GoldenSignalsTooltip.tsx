import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Timer, GitBranch, TriangleAlert, Gauge } from 'lucide-react';

interface SignalTooltipProps {
  type: 'latency' | 'traffic' | 'errors' | 'saturation';
  value: string | number;
  children?: React.ReactNode;
}

const tooltipContent = {
  latency: {
    title: 'Latência (p95)',
    description: 'Tempo que 95% das requisições levam para ser processadas. Valor ideal: abaixo de 200ms.',
    icon: Timer,
    color: 'text-blue-500'
  },
  traffic: {
    title: 'Tráfego',
    description: 'Volume de requisições por segundo. Indica a demanda atual do sistema.',
    icon: GitBranch,
    color: 'text-green-500'
  },
  errors: {
    title: 'Taxa de Erros',
    description: 'Percentual de requisições que falharam. Valor ideal: abaixo de 0.1%.',
    icon: TriangleAlert,
    color: 'text-red-500'
  },
  saturation: {
    title: 'Saturação',
    description: 'Percentual de utilização dos recursos (CPU, memória, rede). Valor ideal: abaixo de 80%.',
    icon: Gauge,
    color: 'text-orange-500'
  }
};

export const SignalTooltip = ({ type, value, children }: SignalTooltipProps) => {
  const config = tooltipContent[type];
  const Icon = config.icon;

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="cursor-help">
            {children || (
              <div className="flex items-center gap-2 p-2 rounded-md bg-accent/20 hover:bg-accent/30 transition-colors">
                <Icon className={`h-3.5 w-3.5 ${config.color} flex-shrink-0`} />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-muted-foreground uppercase font-medium">
                    {type === 'latency' && 'Latência p95'}
                    {type === 'traffic' && 'Tráfego'}
                    {type === 'errors' && 'Erros'}
                    {type === 'saturation' && 'Saturação'}
                  </p>
                  <p className="font-mono font-semibold text-xs">{value}</p>
                </div>
              </div>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Icon className={`h-4 w-4 ${config.color}`} />
              <p className="font-semibold text-sm">{config.title}</p>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {config.description}
            </p>
            <div className="pt-2 border-t border-border">
              <p className="text-xs">
                <span className="text-muted-foreground">Valor atual:</span>{' '}
                <span className="font-mono font-semibold">{value}</span>
              </p>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
