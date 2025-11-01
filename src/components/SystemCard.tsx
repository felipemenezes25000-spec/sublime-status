import { System } from '@/types/status';
import { StatusBadge } from './StatusBadge';
import { ChevronDown, Activity } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { GoldenSignalsTooltip } from './GoldenSignalsTooltip';

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
            <div className="flex items-center gap-2 mb-3">
              <h4 className="text-sm font-medium text-muted-foreground">Subsistemas - 4 Golden Signals</h4>
              <GoldenSignalsTooltip />
            </div>
            <div className="grid gap-2">
              {system.subsystems.map((sub) => (
                <div
                  key={sub.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-card/30 hover:bg-card/50 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium">{sub.name}</p>
                    {sub.metrics && (
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-xs">
                        {sub.metrics.latency && (
                          <div className="flex items-center gap-1">
                            <span className="text-muted-foreground">Latência:</span>
                            <span className="font-medium">{sub.metrics.latency}</span>
                          </div>
                        )}
                        {sub.metrics.throughput && (
                          <div className="flex items-center gap-1">
                            <span className="text-muted-foreground">Tráfego:</span>
                            <span className="font-medium">{sub.metrics.throughput}</span>
                          </div>
                        )}
                        {sub.metrics.errorRate && (
                          <div className="flex items-center gap-1">
                            <span className="text-muted-foreground">Erros:</span>
                            <span className="font-medium">{sub.metrics.errorRate}</span>
                          </div>
                        )}
                        {sub.metrics.saturation && (
                          <div className="flex items-center gap-1">
                            <span className="text-muted-foreground">Saturação:</span>
                            <span className="font-medium">{sub.metrics.saturation}</span>
                          </div>
                        )}
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
