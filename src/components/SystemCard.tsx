import { System } from '@/types/status';
import { StatusBadge } from './StatusBadge';
import { ChevronDown, Activity } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SystemCardProps {
  system: System;
}

export const SystemCard = ({ system }: SystemCardProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="glass-card relative overflow-hidden transition-all duration-300 hover:shadow-lg">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-4 flex items-center justify-between hover:bg-card/30 transition-colors"
      >
        <div className="flex items-center gap-4 flex-1">
          <Activity className="h-5 w-5 text-primary" />
          <div className="flex-1 text-left">
            <h3 className="font-semibold text-lg">{system.name}</h3>
            <p className="text-sm text-muted-foreground">
              Uptime: {system.uptime}
              {system.lastIncident && ` • Último incidente: ${system.lastIncident}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <StatusBadge status={system.status} label="" />
          {system.subsystems && system.subsystems.length > 0 && (
            <ChevronDown
              className={cn(
                'h-5 w-5 text-muted-foreground transition-transform duration-300',
                expanded && 'rotate-180'
              )}
            />
          )}
        </div>
      </button>

      {expanded && system.subsystems && system.subsystems.length > 0 && (
        <div className="px-4 pb-4 space-y-2 animate-slide-up">
          <div className="border-t border-glass-border pt-3">
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Subsistemas</h4>
            <div className="grid gap-2">
              {system.subsystems.map((sub) => (
                <div
                  key={sub.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-card/30 hover:bg-card/50 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium">{sub.name}</p>
                    {sub.metrics && (
                      <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                        {sub.metrics.latency && <span>Latência: {sub.metrics.latency}</span>}
                        {sub.metrics.errorRate && <span>Erro: {sub.metrics.errorRate}</span>}
                        {sub.metrics.throughput && <span>Vazão: {sub.metrics.throughput}</span>}
                      </div>
                    )}
                  </div>
                  <StatusBadge status={sub.status} label="" showDot={true} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
