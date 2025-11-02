import { mockAreas } from '@/data/mockData';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import * as LucideIcons from 'lucide-react';

export const AllProductsTicker = () => {
  // Flatten all products from all areas and journeys
  const allProducts = mockAreas.flatMap(area =>
    area.journeys.flatMap(journey =>
      journey.products.map(product => ({
        ...product,
        areaName: area.name,
        journeyName: journey.name,
      }))
    )
  );

  // Duplicate the array for seamless loop
  const tickerItems = [...allProducts, ...allProducts];

  return (
    <div className="w-full overflow-hidden bg-card/20 border-y border-glass-border backdrop-blur-sm">
      <div className="relative flex overflow-hidden py-3">
        <div className="flex animate-ticker hover:pause-animation gap-8 px-4">
          {tickerItems.map((product, index) => {
            const IconComponent = (LucideIcons as any)[product.icon] || LucideIcons.Activity;
            
            return (
              <div
                key={`${product.id}-${index}`}
                className="flex items-center gap-2 whitespace-nowrap"
              >
                <IconComponent className="h-4 w-4 text-primary/70" />
                <span className="font-medium text-sm">{product.name}</span>
                <span className="text-xs text-muted-foreground">
                  {product.areaName} › {product.journeyName}
                </span>
                <div className="flex items-center gap-1">
                  {product.priority && <PriorityBadge priority={product.priority} />}
                  <StatusBadge status={product.status} label="" showDot={true} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
