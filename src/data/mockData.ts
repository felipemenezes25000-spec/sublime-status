import { System, Incident, Maintenance, KPI } from '@/types/status';

export const mockKPIs: KPI[] = [
  {
    label: 'Uptime 30d',
    value: '99.95%',
    change: '+0.05%',
    trend: 'up',
    status: 'ok',
  },
  {
    label: 'Latência p95',
    value: '210ms',
    change: '-15ms',
    trend: 'up',
    status: 'ok',
  },
  {
    label: 'Taxa de Erro',
    value: '0.12%',
    change: '+0.03%',
    trend: 'down',
    status: 'warn',
  },
  {
    label: 'Incidentes 7d',
    value: '2',
    change: 'vs 3 anterior',
    trend: 'up',
  },
  {
    label: 'MTTR',
    value: '1h 43m',
    change: '-12m',
    trend: 'up',
  },
  {
    label: 'MTBF',
    value: '22h',
    change: '+3h',
    trend: 'up',
  },
  {
    label: 'SLA',
    value: '99.7%',
    status: 'ok',
  },
  {
    label: 'SLO Budget',
    value: '23%',
    trend: 'neutral',
  },
];

export const mockSystems: System[] = [
  {
    id: 'btg-app-pf',
    name: 'BTG App Pessoa Física',
    status: 'ok',
    uptime: '99.98%',
    lastIncident: '23 Out 2025',
    subsystems: [
      {
        id: 'onboarding',
        name: 'Onboarding',
        status: 'ok',
        metrics: { latency: '120ms', errorRate: '0.01%' },
      },
      {
        id: 'login',
        name: 'Login',
        status: 'ok',
        metrics: { latency: '95ms', errorRate: '0.02%' },
      },
      {
        id: 'transactions',
        name: 'Transações',
        status: 'warn',
        metrics: { latency: '450ms', errorRate: '0.8%' },
      },
      {
        id: 'notifications',
        name: 'Notificações',
        status: 'ok',
        metrics: { latency: '200ms', errorRate: '0.05%' },
      },
    ],
  },
  {
    id: 'btg-empresas',
    name: 'BTG Empresas',
    status: 'warn',
    uptime: '99.85%',
    lastIncident: '24 Out 2025',
    subsystems: [
      {
        id: 'portal',
        name: 'Portal',
        status: 'warn',
        metrics: { latency: '850ms', errorRate: '1.2%' },
      },
      {
        id: 'invoice-upload',
        name: 'Upload de Notas',
        status: 'ok',
        metrics: { latency: '320ms', errorRate: '0.1%' },
      },
    ],
  },
  {
    id: 'btg-banking',
    name: 'BTG Banking',
    status: 'ok',
    uptime: '99.99%',
    lastIncident: '22 Out 2025',
    subsystems: [
      {
        id: 'accounts',
        name: 'Contas',
        status: 'ok',
        metrics: { latency: '110ms', errorRate: '0.01%' },
      },
      {
        id: 'cards',
        name: 'Cartões',
        status: 'ok',
        metrics: { latency: '150ms', errorRate: '0.03%' },
      },
    ],
  },
  {
    id: 'btg-investments',
    name: 'BTG Investimentos',
    status: 'info',
    uptime: '99.92%',
    lastIncident: '24 Out 2025',
    subsystems: [
      {
        id: 'home-broker',
        name: 'Home Broker',
        status: 'info',
        metrics: { latency: '180ms', errorRate: '0.05%' },
      },
    ],
  },
  {
    id: 'api-gateway',
    name: 'API Gateway',
    status: 'ok',
    uptime: '99.97%',
    subsystems: [
      {
        id: 'waf',
        name: 'WAF',
        status: 'ok',
        metrics: { latency: '45ms', throughput: '50k req/s' },
      },
      {
        id: 'rate-limit',
        name: 'Rate Limiting',
        status: 'ok',
        metrics: { latency: '25ms' },
      },
    ],
  },
  {
    id: 'database',
    name: 'Banco de Dados',
    status: 'warn',
    uptime: '99.88%',
    lastIncident: '24 Out 2025',
    subsystems: [
      {
        id: 'cluster-a',
        name: 'Cluster A',
        status: 'warn',
        metrics: { latency: '380ms', errorRate: '0.5%' },
      },
      {
        id: 'replica',
        name: 'Réplica',
        status: 'ok',
        metrics: { latency: '120ms', errorRate: '0.02%' },
      },
    ],
  },
];

export const mockIncidents: Incident[] = [
  {
    id: 'inc-001',
    title: 'Falha no Portal Cliente',
    severity: 'error',
    systems: ['BTG Empresas', 'Portal'],
    startTime: new Date('2025-10-24T09:20:00-03:00'),
    endTime: new Date('2025-10-24T10:05:00-03:00'),
    updates: [
      {
        time: new Date('2025-10-24T09:25:00-03:00'),
        message: 'Investigando erro 5xx no gateway.',
        status: 'investigating',
      },
      {
        time: new Date('2025-10-24T09:40:00-03:00'),
        message: 'Mitigação aplicada. Tráfego normalizando.',
        status: 'identified',
      },
      {
        time: new Date('2025-10-24T10:05:00-03:00'),
        message: 'Resolvido. Causa: estouro de pool de conexões.',
        status: 'resolved',
      },
    ],
  },
  {
    id: 'inc-002',
    title: 'Latência Elevada em Transações',
    severity: 'warn',
    systems: ['BTG App PF', 'Transações'],
    startTime: new Date('2025-10-24T14:10:00-03:00'),
    updates: [
      {
        time: new Date('2025-10-24T14:12:00-03:00'),
        message: 'Aumento de p95 em autorização. Investigando causa raiz.',
        status: 'investigating',
      },
      {
        time: new Date('2025-10-24T15:30:00-03:00'),
        message: 'Identificada lentidão em banco de dados. Aplicando correção.',
        status: 'identified',
      },
    ],
  },
];

export const mockMaintenances: Maintenance[] = [
  {
    id: 'maint-001',
    title: 'Janela de Manutenção — Banco de Dados',
    systems: ['Banco de Dados', 'Cluster A'],
    scheduledStart: new Date('2025-11-02T01:00:00-03:00'),
    scheduledEnd: new Date('2025-11-02T02:30:00-03:00'),
    impact: 'Intermitência esperada',
    description: 'Atualização de versão e reindexação de tabelas principais.',
  },
  {
    id: 'maint-002',
    title: 'Atualização de Certificados — Autenticação',
    systems: ['API Gateway', 'OAuth'],
    scheduledStart: new Date('2025-10-28T01:00:00-03:00'),
    scheduledEnd: new Date('2025-10-28T02:30:00-03:00'),
    impact: 'Possíveis erros 401/timeout durante a janela',
    description: 'Rotação da cadeia de certificados SSL/TLS.',
  },
];

// Generate 90 days of uptime data
export const generateUptimeData = () => {
  const days = [];
  const today = new Date();
  
  for (let i = 89; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Random status with higher probability of 'ok'
    const random = Math.random();
    let status: 'ok' | 'warn' | 'error' | 'info' | 'maint';
    
    if (random < 0.92) status = 'ok';
    else if (random < 0.96) status = 'info';
    else if (random < 0.98) status = 'warn';
    else if (random < 0.99) status = 'maint';
    else status = 'error';
    
    const uptime = status === 'ok' ? 0.99 + Math.random() * 0.01 : 0.85 + Math.random() * 0.14;
    
    days.push({ date, status, uptime });
  }
  
  return days;
};
