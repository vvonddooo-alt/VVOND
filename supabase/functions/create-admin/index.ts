import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
Deno.serve(async (req) => {
  const auth = req.headers.get('Authorization');
  if (!auth) return new Response(JSON.stringify({error:'Unauthorized'}), {status:401, headers:{'content-type':'application/json'}});
  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, {global:{headers:{Authorization:auth}}});
  const {data:{user}} = await supabase.auth.getUser();
  if (!user) return new Response(JSON.stringify({error:'Unauthorized'}), {status:401, headers:{'content-type':'application/json'}});
  const {data:owner} = await supabase.from('profiles').select('role').eq('id',user.id).maybeSingle();
  if (owner?.role !== 'owner') return new Response(JSON.stringify({error:'Owner only'}), {status:403, headers:{'content-type':'application/json'}});
  const body = await req.json().catch(()=>({}));
  if (!body.email || !body.password) return new Response(JSON.stringify({error:'Email and password required'}), {status:400, headers:{'content-type':'application/json'}});
  const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
  const {data,error} = await admin.auth.admin.createUser({email:body.email, password:body.password, email_confirm:true});
  if (error) return new Response(JSON.stringify({error:error.message}), {status:400, headers:{'content-type':'application/json'}});
  if (data.user) await admin.from('profiles').update({role:'admin',email:body.email}).eq('id',data.user.id);
  return new Response(JSON.stringify({ok:true}), {headers:{'content-type':'application/json'}});
});
