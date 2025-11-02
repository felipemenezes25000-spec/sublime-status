import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { Office } from '@/types/status';

const offices: Office[] = [
  { city: 'São Paulo', timezone: 'America/Sao_Paulo', offset: 0 },
  { city: 'Rio de Janeiro', timezone: 'America/Sao_Paulo', offset: 0 },
  { city: 'Belo Horizonte', timezone: 'America/Sao_Paulo', offset: 0 },
  { city: 'Recife', timezone: 'America/Recife', offset: 0 },
  { city: 'Porto Alegre', timezone: 'America/Sao_Paulo', offset: 0 },
  { city: 'Curitiba', timezone: 'America/Sao_Paulo', offset: 0 },
  { city: 'Bogotá', timezone: 'America/Bogota', offset: -2 },
  { city: 'Medellín', timezone: 'America/Bogota', offset: -2 },
  { city: 'Barranquilla', timezone: 'America/Bogota', offset: -2 },
  { city: 'Lima', timezone: 'America/Lima', offset: -2 },
  { city: 'Buenos Aires', timezone: 'America/Argentina/Buenos_Aires', offset: 0 },
  { city: 'Santiago', timezone: 'America/Santiago', offset: 0 },
  { city: 'Cidade do México', timezone: 'America/Mexico_City', offset: -3 },
  { city: 'Nova Iorque', timezone: 'America/New_York', offset: -2 },
  { city: 'Miami', timezone: 'America/New_York', offset: -2 },
  { city: 'Atlanta', timezone: 'America/New_York', offset: -2 },
  { city: 'Londres', timezone: 'Europe/London', offset: 3 },
  { city: 'Lisboa', timezone: 'Europe/Lisbon', offset: 3 },
  { city: 'Hong Kong', timezone: 'Asia/Hong_Kong', offset: 11 },
  { city: 'Tóquio', timezone: 'Asia/Tokyo', offset: 12 },
  { city: 'Luxemburgo', timezone: 'Europe/Luxembourg', offset: 4 },
];

export const WorldClockTicker = () => {
  const [times, setTimes] = useState<{ city: string; time: string; offset: string }[]>([]);

  useEffect(() => {
    const updateTimes = () => {
      const newTimes = offices.map(office => {
        const time = new Date().toLocaleTimeString('pt-BR', {
          timeZone: office.timezone,
          hour: '2-digit',
          minute: '2-digit',
        });
        
        const offsetStr = office.offset === 0 
          ? '(BRT)' 
          : office.offset > 0 
            ? `(+${office.offset}h)`
            : `(${office.offset}h)`;

        return {
          city: office.city,
          time,
          offset: offsetStr,
        };
      });
      setTimes(newTimes);
    };

    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-card-lg overflow-hidden mb-8">
      <div className="flex items-center gap-2 mb-3">
        <Clock className="h-5 w-5 text-primary" />
        <h3 className="text-sm font-semibold">Horários dos Escritórios BTG Pactual</h3>
      </div>
      <div className="relative overflow-hidden">
        <div className="ticker-wrapper">
          <div className="ticker-content">
            {times.concat(times).map((item, idx) => (
              <div key={idx} className="ticker-item">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="font-medium">{item.city}</span>
                <span className="text-primary font-mono">{item.time}</span>
                <span className="text-xs text-muted-foreground">{item.offset}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
