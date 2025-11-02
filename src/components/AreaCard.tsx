import { Area } from '@/types/status';
import { StatusBadge } from './StatusBadge';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { JourneyCard } from './JourneyCard';
import * as LucideIcons from 'lucide-react';

interface AreaCardProps {
  area: Area;
}

export const AreaCard = ({ area }: AreaCardProps) => {
  const [expanded, setExpanded] = useState(false);
  
  const IconComponent = (LucideIcons as any)[area.icon] || LucideIcons.Activity;

  return (
    <div className="glass-card relative overflow-hidden transition-all duration-300 hover:shadow-lg">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-5 py-4 flex items-center justify-between hover:bg-card/30 transition-colors"
      >
        <div className="flex items-center gap-4 flex-1">
          <IconComponent className="h-6 w-6 text-primary" />
          <div className="flex-1 text-left">
            <h3 className="font-bold text-xl">{area.name}</h3>
            <p className="text-sm text-muted-foreground">
              {area.journeys.length} {area.journeys.length === 1 ? 'jornada' : 'jornadas'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <StatusBadge status={area.status} label="" />
          <ChevronDown
            className={cn(
              'h-5 w-5 text-muted-foreground transition-transform duration-300',
              expanded && 'rotate-180'
            )}
          />
        </div>
      </button>

      {expanded && area.journeys.length > 0 && (
        <div className="px-5 pb-4 space-y-3 animate-slide-up">
          <div className="border-t border-glass-border pt-4">
            {area.journeys.map((journey) => (
              <JourneyCard key={journey.id} journey={journey} areaName={area.name} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
