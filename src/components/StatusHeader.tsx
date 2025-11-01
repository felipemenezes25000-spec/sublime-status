import { Moon, Sun, Eye, Palette, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

export const StatusHeader = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [colorblindMode, setColorblindMode] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    if (colorblindMode) {
      root.classList.add('colorblind');
    } else {
      root.classList.remove('colorblind');
    }
  }, [colorblindMode]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="glass-card relative overflow-hidden p-4 md:p-6 mb-6 animate-fade-in">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center shadow-lg">
            <span className="text-lg font-extrabold text-primary-foreground">BTG</span>
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Status Page BTG Pactual
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Atualizado há 2 minutos • Todos os sistemas operacionais
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="relative bg-card/50 hover:bg-card transition-all"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => setColorblindMode(!colorblindMode)}
            className={`relative bg-card/50 hover:bg-card transition-all ${
              colorblindMode ? 'ring-2 ring-primary' : ''
            }`}
          >
            <Eye className="h-5 w-5" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="relative bg-card/50 hover:bg-card transition-all"
          >
            <Palette className="h-5 w-5" />
          </Button>

          <Button
            variant="default"
            className="gap-2 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
          >
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Assinar Atualizações</span>
          </Button>
        </div>
      </div>
    </header>
  );
};
