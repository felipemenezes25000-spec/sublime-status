import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || 'https://xodbsskkcyvzbknrsars.supabase.co';
    const aggregatorUrl = `${supabaseUrl}/functions/v1/status-aggregator`;
    
    console.log('Calling aggregator:', aggregatorUrl);
    
    const response = await fetch(`${aggregatorUrl}?action=overview`, {
      headers: {
        'Authorization': req.headers.get('Authorization') || '',
        'apikey': req.headers.get('apikey') || '',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Aggregator error:', response.status, errorText);
      throw new Error(`Aggregator returned ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('Overview data retrieved successfully');

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error in status-overview:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error instanceof Error ? error.stack : undefined
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
