import { Product } from '@/types/status';
import { StatusBadge } from './StatusBadge';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { GoldenSignalsDisplay } from './GoldenSignalsDisplay';
import { PriorityBadge } from './PriorityBadge';
import * as LucideIcons from 'lucide-react';

interface ProductCardProps {
  product: Product;
  areaName: string;
  journeyName: string;
}

export const ProductCard = ({ product, areaName, journeyName }: ProductCardProps) => {
  const [expanded, setExpanded] = useState(false);
  
  const IconComponent = (LucideIcons as any)[product.icon] || LucideIcons.Activity;

  return (
    <div className="rounded-lg bg-card/30 hover:bg-card/50 transition-colors overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 flex items-center justify-between"
      >
        <div className="flex items-center gap-3 flex-1">
          <IconComponent className="h-4 w-4 text-primary/70" />
          <div className="flex-1 text-left">
            <p className="font-medium text-sm">{product.name}</p>
            <p className="text-xs text-muted-foreground">
              {areaName} › {journeyName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <PriorityBadge priority={product.priority} />
          <StatusBadge status={product.status} label="" showDot={true} />
          <ChevronDown
            className={cn(
              'h-4 w-4 text-muted-foreground transition-transform duration-300',
              expanded && 'rotate-180'
            )}
          />
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-3 animate-slide-up">
          <div className="border-t border-glass-border pt-3">
            <h5 className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-2">
              4 Golden Signals
            </h5>
            <GoldenSignalsDisplay signals={product.signals} />
          </div>
        </div>
      )}
    </div>
  );
};
