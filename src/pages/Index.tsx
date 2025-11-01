import { StatusHeader } from '@/components/StatusHeader';
import { OverallStatus } from '@/components/OverallStatus';
import { StatusLegend } from '@/components/StatusLegend';
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
        
        {/* Overall Status */}
        <OverallStatus 
          status="ok" 
          message="Todos os sistemas estão funcionando normalmente. Nenhum incidente ativo no momento."
          affectedSystems={0}
        />

        {/* KPIs Section */}
        <section className="mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="glass-card-lg">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-1">Indicadores de Confiabilidade</h2>
                <p className="text-sm text-muted-foreground">Métricas chave de desempenho operacional</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <KPICard kpi={mockKPIs[0]} type="mttr" />
              <KPICard kpi={mockKPIs[1]} type="mtbf" />
              <KPICard kpi={mockKPIs[2]} type="sla" />
              <KPICard kpi={mockKPIs[3]} type="slo" />
            </div>
          </div>
        </section>

        {/* Uptime Timeline */}
        <section className="mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="glass-card-lg">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-1">Histórico de Disponibilidade</h2>
                <p className="text-sm text-muted-foreground">Últimos 90 dias de uptime consolidado</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Uptime médio</p>
                <p className="text-2xl font-bold text-status-ok">99.95%</p>
              </div>
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
          <div className="glass-card-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-1">Status dos Sistemas</h2>
                <p className="text-sm text-muted-foreground">Monitoramento em tempo real de todos os serviços</p>
              </div>
              <div className="flex gap-2">
                <StatusLegend />
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
            <div className="glass-card-lg h-full">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-1">Incidentes Recentes</h2>
                  <p className="text-sm text-muted-foreground">Histórico de ocorrências e resoluções</p>
                </div>
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
            <div className="glass-card-lg h-full">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-1">Manutenções Programadas</h2>
                  <p className="text-sm text-muted-foreground">Janelas de manutenção planejadas</p>
                </div>
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
          <div className="glass-card-lg">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-1">Notificações e Integrações</h2>
                <p className="text-sm text-muted-foreground">Receba alertas em tempo real sobre mudanças de status</p>
              </div>
            </div>
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
