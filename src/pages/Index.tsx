import { StatusHeader } from '@/components/StatusHeader';
import { OverallStatus } from '@/components/OverallStatus';
import { StatusLegend } from '@/components/StatusLegend';
import { KPICard } from '@/components/KPICard';
import { AreaCard } from '@/components/AreaCard';
import { IncidentCard } from '@/components/IncidentCard';
import { MaintenanceCard } from '@/components/MaintenanceCard';
import { UptimeBar } from '@/components/UptimeBar';
import { WorldClockTicker } from '@/components/WorldClockTicker';
import { AllProductsTicker } from '@/components/AllProductsTicker';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Rss, Bell, Loader2 } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useStatusData, useIncidents, useMaintenances, useComponents } from '@/hooks/useStatusData';
import { mapApiKPIsToUI, mapApiComponentsToAreas, mapApiIncidentsToUI, mapApiMaintenancesToUI, mapUptimeDataToUI } from '@/utils/statusMapper';
import { mockKPIs, mockAreas, mockIncidents, mockMaintenances, generateUptimeData } from '@/data/mockData';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Fetch data from edge functions
  const { data: overviewData, isLoading: overviewLoading } = useStatusData();
  const { data: incidentsData, isLoading: incidentsLoading } = useIncidents();
  const { data: maintenancesData, isLoading: maintenancesLoading } = useMaintenances();
  const { data: componentsData, isLoading: componentsLoading } = useComponents();

  // Map API data to UI format or fallback to mock data
  const kpis = useMemo(() => 
    overviewData?.kpis ? mapApiKPIsToUI(overviewData.kpis) : mockKPIs,
    [overviewData]
  );

  const areas = useMemo(() => 
    componentsData ? mapApiComponentsToAreas(componentsData) : mockAreas,
    [componentsData]
  );

  const incidents = useMemo(() => 
    incidentsData ? mapApiIncidentsToUI(incidentsData) : mockIncidents,
    [incidentsData]
  );

  const maintenances = useMemo(() => 
    maintenancesData ? mapApiMaintenancesToUI(maintenancesData) : mockMaintenances,
    [maintenancesData]
  );

  const uptimeData = useMemo(() => 
    overviewData?.uptime90d ? mapUptimeDataToUI(overviewData.uptime90d) : generateUptimeData(),
    [overviewData]
  );

  const hasErrors = areas.some(area => area.status === 'error');
  const hasWarnings = areas.some(area => area.status === 'warn');
  const overallStatus = hasErrors ? 'error' : hasWarnings ? 'warn' : 'ok';
  const affectedCount = areas.filter(a => a.status !== 'ok').length;

  const filteredAreas = areas.filter(area =>
    area.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    area.journeys.some(j =>
      j.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.products.some(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  );

  const isLoading = overviewLoading || incidentsLoading || maintenancesLoading || componentsLoading;
  
  return (
    <div className="min-h-screen bg-background">
      {/* Skip to main content - Accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md"
      >
        Pular para conteúdo principal
      </a>

      {/* Top Tickers Section */}
      <div className="bg-primary border-b border-primary-hover shadow-sm" role="banner">
        <div className="container mx-auto px-4 max-w-7xl">
          <WorldClockTicker />
        </div>
      </div>
      
      <div className="bg-card border-b border-border shadow-sm" aria-label="Ticker de produtos">
        <div className="container mx-auto px-4 max-w-7xl">
          <AllProductsTicker areas={areas} />
        </div>
      </div>

      <main id="main-content" className="container mx-auto px-4 py-8 max-w-7xl">
        <StatusHeader />
        
        {/* Overall Status */}
        <section aria-labelledby="overall-status-heading">
          <h2 id="overall-status-heading" className="sr-only">Status Geral do Sistema</h2>
          <OverallStatus
            status={overallStatus}
            message={
              overallStatus === 'ok'
                ? 'Todos os sistemas estão funcionando normalmente. Nenhum incidente ativo no momento.'
                : overallStatus === 'error'
                ? 'Há incidentes críticos em andamento. Nossas equipes estão trabalhando na resolução.'
                : 'Alguns sistemas apresentam degradação. Acompanhe os detalhes abaixo.'
            }
            affectedSystems={affectedCount}
          />
        </section>

        {/* KPIs Section */}
        <section 
          className="mb-8 animate-fade-in" 
          style={{ animationDelay: '0.1s' }}
          aria-labelledby="kpis-heading"
        >
          <h2 id="kpis-heading" className="sr-only">Indicadores Chave de Performance (KPIs)</h2>
          {isLoading ? (
            <div className="flex items-center justify-center py-12" role="status" aria-live="polite">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="sr-only">Carregando KPIs...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <KPICard kpi={kpis[0]} type="mttr" />
              <KPICard kpi={kpis[1]} type="mtbf" />
              <KPICard kpi={kpis[2]} type="sla" />
              <KPICard kpi={kpis[3]} type="slo" />
            </div>
          )}
        </section>

        {/* Uptime Timeline */}
        <section 
          className="mb-8 animate-fade-in" 
          style={{ animationDelay: '0.2s' }}
          aria-labelledby="uptime-heading"
        >
          <div className="glass-card-lg">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 id="uptime-heading" className="text-xl font-semibold mb-1">Linha do Tempo de Disponibilidade</h2>
                <p className="text-sm text-muted-foreground">Últimos 90 dias de uptime consolidado - Passe o mouse para ver detalhes de cada dia</p>
              </div>
              <div className="text-right" aria-label="Estatísticas de uptime">
                <p className="text-sm text-muted-foreground mb-1">Uptime médio</p>
                <p className="text-2xl font-bold text-status-ok" aria-label="Uptime médio de 99.95%">99.95%</p>
              </div>
            </div>
            <UptimeBar days={uptimeData} />
          </div>
        </section>

        {/* Search */}
        <section 
          className="mb-6 animate-fade-in" 
          style={{ animationDelay: '0.3s' }}
          role="search"
          aria-label="Buscar sistemas"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <Input 
              type="search" 
              placeholder="Filtrar por área, jornada ou produto..." 
              className="pl-10 h-11 glass-card" 
              value={searchQuery} 
              onChange={e => setSearchQuery(e.target.value)}
              aria-label="Campo de busca para filtrar áreas, jornadas e produtos"
            />
          </div>
        </section>

        {/* Systems Section */}
        <section 
          className="mb-8 animate-fade-in" 
          style={{ animationDelay: '0.4s' }}
          aria-labelledby="systems-heading"
        >
          <div className="glass-card-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
              <div>
                <h2 id="systems-heading" className="text-xl font-semibold mb-1">Áreas, Jornadas e Produtos</h2>
                <p className="text-sm text-muted-foreground">Estrutura hierárquica completa com 4 Golden Signals - Passe o mouse nos indicadores para ver explicações detalhadas</p>
              </div>
              <StatusLegend />
            </div>
            <div className="space-y-3" role="list" aria-label="Lista de áreas do sistema">
              {filteredAreas.length > 0 ? (
                filteredAreas.map((area, index) => (
                  <div 
                    key={area.id} 
                    style={{ animationDelay: `${0.5 + index * 0.03}s` }} 
                    className="animate-fade-in"
                    role="listitem"
                  >
                    <AreaCard area={area} />
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Nenhum resultado encontrado para "{searchQuery}"
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Incidents and Maintenances */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Incidents */}
          <section 
            className="animate-fade-in" 
            style={{ animationDelay: '0.5s' }}
            aria-labelledby="incidents-heading"
          >
            <div className="glass-card-lg h-full">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 id="incidents-heading" className="text-xl font-semibold mb-1">Incidentes Recentes</h2>
                  <p className="text-sm text-muted-foreground">Histórico de ocorrências e resoluções com timeline completa</p>
                </div>
                <Button 
                  variant="link" 
                  size="sm" 
                  className="text-primary text-sm h-auto p-0"
                  aria-label="Ver histórico completo de incidentes"
                >
                  Ver Histórico
                </Button>
              </div>
              <div className="space-y-4" role="list" aria-label="Lista de incidentes">
                {incidents.length > 0 ? (
                  incidents.map(incident => (
                    <div key={incident.id} role="listitem">
                      <IncidentCard incident={incident} />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 bg-status-ok-bg/30 rounded-lg border border-status-ok/20">
                    <p className="text-sm font-medium text-status-ok">✓ Nenhum incidente ativo no momento</p>
                    <p className="text-xs text-muted-foreground mt-1">Todos os sistemas operando normalmente</p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Maintenances */}
          <section 
            className="animate-fade-in" 
            style={{ animationDelay: '0.6s' }}
            aria-labelledby="maintenances-heading"
          >
            <div className="glass-card-lg h-full">
              <div className="mb-5">
                <h2 id="maintenances-heading" className="text-xl font-semibold mb-1">Manutenções Programadas</h2>
                <p className="text-sm text-muted-foreground">Janelas de manutenção planejadas com antecedência</p>
              </div>
              <div className="space-y-4" role="list" aria-label="Lista de manutenções">
                {maintenances.length > 0 ? (
                  maintenances.map(maintenance => (
                    <div key={maintenance.id} role="listitem">
                      <MaintenanceCard maintenance={maintenance} />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 bg-status-info-bg/30 rounded-lg border border-status-info/20">
                    <p className="text-sm font-medium text-status-info">ℹ Nenhuma manutenção programada</p>
                    <p className="text-xs text-muted-foreground mt-1">Não há janelas de manutenção agendadas</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* Subscription Section */}
        <section 
          className="animate-fade-in" 
          style={{ animationDelay: '0.7s' }}
          aria-labelledby="notifications-heading"
        >
          <div className="glass-card-lg">
            <div className="mb-5">
              <h2 id="notifications-heading" className="text-xl font-semibold mb-1">Notificações e Integrações</h2>
              <p className="text-sm text-muted-foreground">Receba alertas em tempo real sobre mudanças de status via email ou webhook</p>
            </div>
            <form 
              className="flex flex-col sm:flex-row gap-3 mb-4"
              onSubmit={(e) => e.preventDefault()}
              aria-label="Formulário de inscrição para notificações"
            >
              <Input 
                type="email" 
                placeholder="seu@email.com" 
                className="flex-1 h-11 glass-card"
                aria-label="Digite seu email para receber notificações"
                required
              />
              <Input 
                type="url" 
                placeholder="https://webhook.site/... (opcional)" 
                className="flex-1 h-11 glass-card"
                aria-label="URL do webhook (opcional)"
              />
              <Button 
                className="h-11 px-6 bg-primary hover:bg-primary-hover"
                type="submit"
                aria-label="Assinar notificações"
              >
                <Bell className="h-4 w-4 mr-2" aria-hidden="true" />
                Assinar
              </Button>
            </form>
            <nav className="flex flex-wrap gap-5 text-sm" aria-label="Links de recursos">
              <Button variant="link" className="p-0 h-auto text-primary" aria-label="Acessar RSS Feed">
                <Rss className="h-4 w-4 mr-1.5" aria-hidden="true" />
                RSS Feed
              </Button>
              <Button variant="link" className="p-0 h-auto text-primary" aria-label="Ver documentação da API">
                API Docs
              </Button>
              <Button variant="link" className="p-0 h-auto text-primary" aria-label="Ver histórico de mudanças">
                Changelog
              </Button>
              <Button variant="link" className="p-0 h-auto text-primary" aria-label="Entrar em contato com suporte">
                Suporte
              </Button>
            </nav>
          </div>
        </section>

        {/* Footer */}
        <footer 
          className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground animate-fade-in" 
          style={{ animationDelay: '0.8s' }}
          role="contentinfo"
        >
          <p className="font-medium">© 2025 BTG Pactual • Command Center & Status Operacional</p>
          <p className="mt-2 text-xs">Todos os dados são simulados para demonstração • Última atualização: em tempo real</p>
        </footer>
      </main>
    </div>
  );
};
export default Index;