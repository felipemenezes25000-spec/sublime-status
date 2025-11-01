export type StatusType = 'ok' | 'warn' | 'error' | 'info' | 'maint';

export interface System {
  id: string;
  name: string;
  status: StatusType;
  uptime: string;
  lastIncident?: string;
  subsystems?: Subsystem[];
}

export interface Subsystem {
  id: string;
  name: string;
  status: StatusType;
  metrics?: {
    latency?: string;
    errorRate?: string;
    throughput?: string;
    saturation?: string;
  };
}

export interface Incident {
  id: string;
  title: string;
  severity: StatusType;
  systems: string[];
  startTime: Date;
  endTime?: Date;
  updates: IncidentUpdate[];
}

export interface IncidentUpdate {
  time: Date;
  message: string;
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
}

export interface Maintenance {
  id: string;
  title: string;
  systems: string[];
  scheduledStart: Date;
  scheduledEnd: Date;
  impact: string;
  description: string;
}

export interface KPI {
  label: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  status?: StatusType;
}
