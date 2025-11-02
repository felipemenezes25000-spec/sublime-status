import { Journey } from '@/types/status';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ProductCard } from './ProductCard';
import * as LucideIcons from 'lucide-react';

interface JourneyCardProps {
  journey: Journey;
  areaName: string;
}

export const JourneyCard = ({ journey, areaName }: JourneyCardProps) => {
  const [expanded, setExpanded] = useState(false);
  
  const IconComponent = (LucideIcons as any)[journey.icon] || LucideIcons.Activity;

  return (
    <div className="mb-3 last:mb-0">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 flex items-center justify-between rounded-lg bg-card/20 hover:bg-card/40 transition-colors"
      >
        <div className="flex items-center gap-3 flex-1">
          <IconComponent className="h-5 w-5 text-primary/80" />
          <div className="flex-1 text-left">
            <h4 className="font-semibold text-base">{journey.name}</h4>
            <p className="text-xs text-muted-foreground">
              {journey.products.length} {journey.products.length === 1 ? 'produto' : 'produtos'}
            </p>
          </div>
        </div>

        <ChevronDown
          className={cn(
            'h-4 w-4 text-muted-foreground transition-transform duration-300',
            expanded && 'rotate-180'
          )}
        />
      </button>

      {expanded && journey.products.length > 0 && (
        <div className="mt-2 space-y-2 pl-4 animate-slide-up">
          {journey.products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              areaName={areaName}
              journeyName={journey.name}
            />
          ))}
        </div>
      )}
    </div>
  );
};
