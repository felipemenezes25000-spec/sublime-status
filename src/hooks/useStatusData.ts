import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ApiKPIs {
  mttrMinutes: number;
  mtbfDays: number;
  slaPct: number;
  sloPct: number;
  uptime90dPct: number;
}

export interface ApiProvider {
  id: string;
  name: string;
  baseUrl: string;
}

export interface ApiComponent {
  id: string;
  providerId: string;
  name: string;
  product: string;
  status: 'operational' | 'degraded' | 'incident' | 'maintenance' | 'informational';
}

export interface ApiIncident {
  id: string;
  providerId: string;
  title: string;
  severity: 'P1' | 'P2' | 'P3' | 'P4';
  state: 'investigating' | 'identified' | 'monitoring' | 'resolved';
  components: string[];
  startedAt: string;
  updatedAt: string;
  resolvedAt?: string;
  updates: Array<{
    at: string;
    text: string;
    state: string;
  }>;
}

export interface ApiMaintenance {
  id: string;
  providerId: string;
  title: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'canceled';
  windowStart: string;
  windowEnd: string;
  expectedImpact?: string;
  components: string[];
  notes?: string;
}

export interface StatusOverview {
  providers: ApiProvider[];
  kpis: ApiKPIs;
  uptime90d: Array<{ day: string; state: string }>;
  now: string;
}

export const useStatusData = () => {
  return useQuery({
    queryKey: ['status-overview'],
    queryFn: async () => {
      const response = await fetch(
        `https://xodbsskkcyvzbknrsars.supabase.co/functions/v1/status-aggregator?action=overview`,
        {
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvZGJzc2trY3l2emJrbnJzYXJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyOTQ0MTEsImV4cCI6MjA3Nzg3MDQxMX0.cB5wIeOr4j9PUKXGNeGH7s-1_yV0Qc9_UEOMqsmCdYw',
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (!response.ok) throw new Error('Failed to fetch overview');
      return await response.json() as StatusOverview;
    },
    refetchInterval: 60000,
    retry: 3,
  });
};

export const useIncidents = () => {
  return useQuery({
    queryKey: ['status-incidents'],
    queryFn: async () => {
      const response = await fetch(
        `https://xodbsskkcyvzbknrsars.supabase.co/functions/v1/status-aggregator?action=incidents&status=active`,
        {
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvZGJzc2trY3l2emJrbnJzYXJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyOTQ0MTEsImV4cCI6MjA3Nzg3MDQxMX0.cB5wIeOr4j9PUKXGNeGH7s-1_yV0Qc9_UEOMqsmCdYw',
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (!response.ok) throw new Error('Failed to fetch incidents');
      return await response.json() as ApiIncident[];
    },
    refetchInterval: 60000,
    retry: 3,
  });
};

export const useMaintenances = () => {
  return useQuery({
    queryKey: ['status-maintenances'],
    queryFn: async () => {
      const response = await fetch(
        `https://xodbsskkcyvzbknrsars.supabase.co/functions/v1/status-aggregator?action=maintenances&status=scheduled`,
        {
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvZGJzc2trY3l2emJrbnJzYXJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyOTQ0MTEsImV4cCI6MjA3Nzg3MDQxMX0.cB5wIeOr4j9PUKXGNeGH7s-1_yV0Qc9_UEOMqsmCdYw',
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (!response.ok) throw new Error('Failed to fetch maintenances');
      return await response.json() as ApiMaintenance[];
    },
    refetchInterval: 60000,
    retry: 3,
  });
};

export const useComponents = () => {
  return useQuery({
    queryKey: ['status-components'],
    queryFn: async () => {
      const response = await fetch(
        `https://xodbsskkcyvzbknrsars.supabase.co/functions/v1/status-aggregator?action=components`,
        {
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvZGJzc2trY3l2emJrbnJzYXJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyOTQ0MTEsImV4cCI6MjA3Nzg3MDQxMX0.cB5wIeOr4j9PUKXGNeGH7s-1_yV0Qc9_UEOMqsmCdYw',
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (!response.ok) throw new Error('Failed to fetch components');
      return await response.json() as ApiComponent[];
    },
    refetchInterval: 60000,
    retry: 3,
  });
};
