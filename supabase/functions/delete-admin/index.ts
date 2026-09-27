import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: corsHeaders });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  const auth = req.headers.get('Authorization');
  if (!auth) return json({ error: 'Unauthorized' }, 401);

  const client = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: auth } } },
  );

  const { data: { user } } = await client.auth.getUser();
  if (!user) return json({ error: 'Unauthorized' }, 401);

  const { data: owner } = await client
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  if (owner?.role !== 'owner') return json({ error: 'Owner only' }, 403);

  const body = await req.json().catch(() => ({}));
  const userId = typeof body.user_id === 'string' ? body.user_id : '';
  if (!userId || userId === user.id) return json({ error: 'Invalid user' }, 400);

  const admin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  const { error } = await admin.auth.admin.deleteUser(userId);
  if (error) return json({ error: error.message }, 400);

  return json({ ok: true });
});
