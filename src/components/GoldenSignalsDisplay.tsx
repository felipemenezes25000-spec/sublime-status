import { GoldenSignals } from '@/types/status';
import { SignalTooltip } from './GoldenSignalsTooltip';

interface GoldenSignalsDisplayProps {
  signals: GoldenSignals;
}

export const GoldenSignalsDisplay = ({ signals }: GoldenSignalsDisplayProps) => {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      <SignalTooltip type="latency" value={`${signals.latency} ms`} />
      <SignalTooltip type="traffic" value={`${signals.traffic} req/s`} />
      <SignalTooltip type="errors" value={`${signals.errors.toFixed(2)} %`} />
      <SignalTooltip type="saturation" value={`${signals.saturation} %`} />
    </div>
  );
};
