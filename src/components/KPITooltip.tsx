import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Clock, Activity, Target, TrendingUp, HelpCircle } from 'lucide-react';

interface KPITooltipProps {
  type: 'mttr' | 'mtbf' | 'sla' | 'slo';
}

const tooltipContent = {
  mttr: {
    title: 'MTTR - Mean Time To Recovery',
    description: 'Tempo médio para recuperação de incidentes. Mede a velocidade de resposta da equipe. Quanto menor, melhor.',
    formula: 'Total de tempo de inatividade ÷ Número de incidentes',
    icon: Clock,
    color: 'text-blue-500',
    ideal: 'Ideal: < 15 minutos'
  },
  mtbf: {
    title: 'MTBF - Mean Time Between Failures',
    description: 'Tempo médio entre falhas do sistema. Indica a confiabilidade da infraestrutura. Quanto maior, melhor.',
    formula: 'Tempo total operacional ÷ Número de falhas',
    icon: Activity,
    color: 'text-green-500',
    ideal: 'Ideal: > 720 horas (30 dias)'
  },
  sla: {
    title: 'SLA - Service Level Agreement',
    description: 'Compromisso contratual de disponibilidade do serviço. Define as expectativas mínimas de performance.',
    formula: '(Tempo total - Tempo de inatividade) ÷ Tempo total × 100',
    icon: Target,
    color: 'text-purple-500',
    ideal: 'Ideal: ≥ 99.9%'
  },
  slo: {
    title: 'SLO - Service Level Objective',
    description: 'Meta interna de nível de serviço. Geralmente mais rigorosa que o SLA para criar margem de segurança.',
    formula: 'Similar ao SLA, com target mais alto',
    icon: TrendingUp,
    color: 'text-orange-500',
    ideal: 'Ideal: ≥ 99.95%'
  }
};

export const KPITooltip = ({ type }: KPITooltipProps) => {
  const config = tooltipContent[type];
  const Icon = config.icon;

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button 
            className="cursor-help hover:text-primary transition-colors"
            aria-label={`Informações sobre ${config.title}`}
          >
            <HelpCircle className="h-3.5 w-3.5" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-sm">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Icon className={`h-5 w-5 ${config.color}`} />
              <p className="font-semibold">{config.title}</p>
            </div>
            
            <p className="text-sm text-muted-foreground leading-relaxed">
              {config.description}
            </p>
            
            <div className="space-y-1.5 pt-2 border-t border-border">
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-1">Cálculo:</p>
                <p className="text-xs font-mono bg-accent/20 p-2 rounded">
                  {config.formula}
                </p>
              </div>
              <p className="text-xs font-medium text-primary">
                {config.ideal}
              </p>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
