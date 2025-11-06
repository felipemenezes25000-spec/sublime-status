import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xodbsskkcyvzbknrsars.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvZGJzc2trY3l2emJrbnJzYXJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyOTQ0MTEsImV4cCI6MjA3Nzg3MDQxMX0.cB5wIeOr4j9PUKXGNeGH7s-1_yV0Qc9_UEOMqsmCdYw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
