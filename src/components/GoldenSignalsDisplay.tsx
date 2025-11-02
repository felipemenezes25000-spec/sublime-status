import { GoldenSignals } from '@/types/status';
import { Timer, GitBranch, TriangleAlert, Gauge } from 'lucide-react';

interface GoldenSignalsDisplayProps {
  signals: GoldenSignals;
}

export const GoldenSignalsDisplay = ({ signals }: GoldenSignalsDisplayProps) => {
  return (
    <div className="grid grid-cols-2 gap-3 mt-3">
      <div className="flex items-center gap-2">
        <Timer className="h-4 w-4 text-blue-500" />
        <div className="flex-1">
          <p className="text-xs text-muted-foreground">Latência p95</p>
          <p className="font-mono font-semibold text-sm">{signals.latency} ms</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <GitBranch className="h-4 w-4 text-green-500" />
        <div className="flex-1">
          <p className="text-xs text-muted-foreground">Tráfego</p>
          <p className="font-mono font-semibold text-sm">{signals.traffic} req/s</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <TriangleAlert className="h-4 w-4 text-red-500" />
        <div className="flex-1">
          <p className="text-xs text-muted-foreground">Erros</p>
          <p className="font-mono font-semibold text-sm">{signals.errors.toFixed(2)} %</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Gauge className="h-4 w-4 text-orange-500" />
        <div className="flex-1">
          <p className="text-xs text-muted-foreground">Saturação</p>
          <p className="font-mono font-semibold text-sm">{signals.saturation} %</p>
        </div>
      </div>
    </div>
  );
};
