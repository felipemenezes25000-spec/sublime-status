import { StatusHeader } from '@/components/StatusHeader';
import { KPICard } from '@/components/KPICard';
import { SystemCard } from '@/components/SystemCard';
import { IncidentCard } from '@/components/IncidentCard';
import { MaintenanceCard } from '@/components/MaintenanceCard';
import { UptimeBar } from '@/components/UptimeBar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Rss, Bell } from 'lucide-react';
import { mockKPIs, mockSystems, mockIncidents, mockMaintenances, generateUptimeData } from '@/data/mockData';
import { useState } from 'react';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const uptimeData = generateUptimeData();

  const filteredSystems = mockSystems.filter((system) =>
    system.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen pb-20">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <StatusHeader />

        {/* KPIs Section */}
        <section className="mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="glass-card relative overflow-hidden p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Métricas Principais</h2>
              <p className="text-sm text-muted-foreground">MTTR, MTBF, SLA & SLO</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {mockKPIs.map((kpi, index) => (
                <div key={index} style={{ animationDelay: `${0.1 + index * 0.05}s` }}>
                  <KPICard kpi={kpi} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Uptime Timeline */}
        <section className="mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="glass-card relative overflow-hidden p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Linha do Tempo (90 dias)</h2>
              <p className="text-sm text-muted-foreground">
                Uptime médio: <span className="font-semibold text-status-ok">99.95%</span>
              </p>
            </div>
            <UptimeBar days={uptimeData} />
          </div>
        </section>

        {/* Search */}
        <section className="mb-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Filtrar por sistema ou componente..."
              className="pl-10 glass-card bg-card/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </section>

        {/* Systems Section */}
        <section className="mb-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="glass-card relative overflow-hidden p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Sistemas</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="bg-card/50">
                  Expandir Tudo
                </Button>
                <Button variant="outline" size="sm" className="bg-card/50">
                  Recolher Tudo
                </Button>
              </div>
            </div>
            <div className="space-y-3">
              {filteredSystems.map((system, index) => (
                <div key={system.id} style={{ animationDelay: `${0.4 + index * 0.05}s` }}>
                  <SystemCard system={system} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Incidents and Maintenances */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Incidents */}
          <section className="animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <div className="glass-card relative overflow-hidden p-6 h-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Incidentes Recentes</h2>
                <Button variant="link" size="sm" className="text-primary">
                  Ver Histórico
                </Button>
              </div>
              <div className="space-y-4">
                {mockIncidents.map((incident) => (
                  <IncidentCard key={incident.id} incident={incident} />
                ))}
              </div>
            </div>
          </section>

          {/* Maintenances */}
          <section className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="glass-card relative overflow-hidden p-6 h-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Manutenções Programadas</h2>
              </div>
              <div className="space-y-4">
                {mockMaintenances.map((maintenance) => (
                  <MaintenanceCard key={maintenance.id} maintenance={maintenance} />
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Subscription Section */}
        <section className="animate-fade-in" style={{ animationDelay: '0.7s' }}>
          <div className="glass-card relative overflow-hidden p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Assinaturas & Integrações</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              Receba alertas por e-mail, webhook ou RSS quando o status dos sistemas mudar.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <Input
                type="email"
                placeholder="seu@email.com"
                className="flex-1 glass-card bg-card/50"
              />
              <Input
                type="url"
                placeholder="https://webhook.site/... (opcional)"
                className="flex-1 glass-card bg-card/50"
              />
              <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                <Bell className="h-4 w-4 mr-2" />
                Assinar
              </Button>
            </div>
            <div className="flex gap-4 text-sm">
              <Button variant="link" className="p-0 h-auto text-primary">
                <Rss className="h-4 w-4 mr-1" />
                RSS Feed
              </Button>
              <Button variant="link" className="p-0 h-auto text-primary">
                API Docs
              </Button>
              <Button variant="link" className="p-0 h-auto text-primary">
                Changelog
              </Button>
              <Button variant="link" className="p-0 h-auto text-primary">
                Suporte
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <p>© 2025 BTG Pactual • Status Page • Todos os dados são simulados para demonstração</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
