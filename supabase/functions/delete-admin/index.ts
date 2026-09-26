import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
Deno.serve(async (req) => {
  const auth = req.headers.get('Authorization');
  if (!auth) return new Response(JSON.stringify({error:'Unauthorized'}), {status:401, headers:{'content-type':'application/json'}});
  const client = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, {global:{headers:{Authorization:auth}}});
  const {data:{user}} = await client.auth.getUser();
  if (!user) return new Response(JSON.stringify({error:'Unauthorized'}), {status:401, headers:{'content-type':'application/json'}});
  const {data:owner} = await client.from('profiles').select('role').eq('id',user.id).maybeSingle();
  if (owner?.role !== 'owner') return new Response(JSON.stringify({error:'Owner only'}), {status:403, headers:{'content-type':'application/json'}});
  const {user_id} = await req.json().catch(()=>({}));
  if (!user_id || user_id === user.id) return new Response(JSON.stringify({error:'Invalid user'}), {status:400, headers:{'content-type':'application/json'}});
  const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
  const {error} = await admin.auth.admin.deleteUser(user_id);
  if (error) return new Response(JSON.stringify({error:error.message}), {status:400, headers:{'content-type':'application/json'}});
  return new Response(JSON.stringify({ok:true}), {headers:{'content-type':'application/json'}});
});
