-- WOND / Supabase setup
-- Run this entire file in Supabase -> SQL Editor -> New query -> Run.
-- Do NOT put a service_role key into the website.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text not null default '',
  role text not null default 'member',
  permissions jsonb not null default '{"gallery_read":true,"gallery_write":false,"applications_read":false,"applications_write":false,"members_manage":false}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.member_invites (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  full_name text not null default '',
  role text not null default 'member',
  permissions jsonb not null default '{}'::jsonb,
  token_hash text not null unique,
  expires_at timestamptz not null default (now() + interval '7 days'),
  accepted_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  title text not null default 'Naše práce',
  storage_path text not null unique,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  address text not null,
  phone text not null,
  email text not null,
  message text,
  consent boolean not null default false,
  status text not null default 'new' check (status in ('new','contacted','accepted','rejected')),
  created_at timestamptz not null default now()
);

create index if not exists applications_created_at_idx on public.applications(created_at desc);
create index if not exists member_invites_email_idx on public.member_invites(lower(email));

-- Helper functions used by RLS.
create or replace function public.is_owner()
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'owner');
$$;

create or replace function public.has_permission(permission_name text)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists(
    select 1 from public.profiles p
    where p.id = auth.uid()
      and (p.role = 'owner' or coalesce((p.permissions ->> permission_name)::boolean, false))
  );
$$;

create or replace function public.has_owner()
returns boolean
language sql stable security definer set search_path = public
as $$ select exists(select 1 from public.profiles where role='owner'); $$;

-- First administrator: only works while the profiles table is empty.
create or replace function public.claim_initial_owner(p_full_name text default '')
returns public.profiles
language plpgsql security definer set search_path = public
as $$
declare
  new_profile public.profiles;
  current_email text;
begin
  if auth.uid() is null then raise exception 'Musíte být přihlášeni.'; end if;
  if exists(select 1 from public.profiles) then
    raise exception 'První administrátor už byl vytvořen.';
  end if;
  current_email := coalesce(auth.jwt() ->> 'email','');
  insert into public.profiles(id,email,full_name,role,permissions)
  values(auth.uid(), current_email, coalesce(nullif(trim(p_full_name),''), current_email), 'owner',
         '{"gallery_read":true,"gallery_write":true,"applications_read":true,"applications_write":true,"members_manage":true}'::jsonb)
  returning * into new_profile;
  return new_profile;
end;
$$;

-- Owner creates an invitation. The raw token is returned once so the owner can send the link.
create or replace function public.create_member_invite(
  p_email text,
  p_full_name text,
  p_role text,
  p_permissions jsonb
)
returns table(invite_id uuid, token text, expires_at timestamptz)
language plpgsql security definer set search_path = public
as $$
declare
  raw_token text;
  new_id uuid;
  expiry timestamptz;
  current_count integer;
begin
  if not public.is_owner() then raise exception 'Pouze hlavní administrátor může vytvářet pozvánky.'; end if;
  select (count(*) + (select count(*) from public.member_invites where accepted_at is null and expires_at > now())) into current_count from public.profiles where role <> 'owner';
  if current_count >= 10 then raise exception 'Je možné mít nejvýše 10 dalších členů včetně nevyužitých pozvánek.'; end if;
  if exists(select 1 from public.profiles where lower(email)=lower(trim(p_email))) or exists(select 1 from public.member_invites where lower(email)=lower(trim(p_email)) and accepted_at is null and expires_at > now()) then raise exception 'Pro tento e-mail už účet nebo pozvánka existuje.'; end if;
  raw_token := encode(gen_random_bytes(24),'hex');
  expiry := now() + interval '7 days';
  insert into public.member_invites(email,full_name,role,permissions,token_hash,expires_at)
  values(lower(trim(p_email)),coalesce(trim(p_full_name),''),coalesce(nullif(trim(p_role),''),'member'),coalesce(p_permissions,'{}'::jsonb),encode(digest(raw_token,'sha256'),'hex'),expiry)
  returning id into new_id;
  return query select new_id, raw_token, expiry;
end;
$$;

-- Invitee calls this after signing up / logging in with the invited email.
create or replace function public.accept_member_invite(p_token text)
returns public.profiles
language plpgsql security definer set search_path = public
as $$
declare
  inv public.member_invites;
  result public.profiles;
  current_email text;
begin
  if auth.uid() is null then raise exception 'Musíte být přihlášeni.'; end if;
  current_email := lower(coalesce(auth.jwt() ->> 'email',''));
  select * into inv from public.member_invites
   where token_hash = encode(digest(p_token,'sha256'),'hex')
     and accepted_at is null and expires_at > now()
   limit 1;
  if inv.id is null then raise exception 'Pozvánka je neplatná nebo vypršela.'; end if;
  if lower(inv.email) <> current_email then raise exception 'E-mail účtu neodpovídá pozvánce.'; end if;
  insert into public.profiles(id,email,full_name,role,permissions)
  values(auth.uid(),current_email,inv.full_name,inv.role,inv.permissions)
  on conflict(id) do update set email=excluded.email, full_name=excluded.full_name, role=excluded.role, permissions=excluded.permissions
  returning * into result;
  update public.member_invites set accepted_at=now() where id=inv.id;
  return result;
end;
$$;

-- Make the script safe to re-run when these policies already exist.
drop policy if exists "profiles_self_read" on public.profiles;
drop policy if exists "profiles_owner_update" on public.profiles;
drop policy if exists "profiles_owner_delete" on public.profiles;
drop policy if exists "invites_owner_read" on public.member_invites;
drop policy if exists "invites_owner_delete" on public.member_invites;
drop policy if exists "gallery_read" on public.gallery_items;
drop policy if exists "gallery_insert" on public.gallery_items;
drop policy if exists "gallery_delete" on public.gallery_items;
drop policy if exists "applications_public_insert" on public.applications;
drop policy if exists "applications_staff_read" on public.applications;
drop policy if exists "applications_staff_update" on public.applications;
drop policy if exists "applications_staff_delete" on public.applications;
drop policy if exists "gallery_storage_public_read" on storage.objects;
drop policy if exists "gallery_storage_staff_insert" on storage.objects;
drop policy if exists "gallery_storage_staff_delete" on storage.objects;

-- Profile access.
alter table public.profiles enable row level security;
create policy "profiles_self_read" on public.profiles for select to authenticated using (id = auth.uid() or public.is_owner());
create policy "profiles_owner_update" on public.profiles for update to authenticated using (public.is_owner()) with check (public.is_owner());
create policy "profiles_owner_delete" on public.profiles for delete to authenticated using (public.is_owner() and role <> 'owner');

alter table public.member_invites enable row level security;
create policy "invites_owner_read" on public.member_invites for select to authenticated using (public.is_owner());
create policy "invites_owner_delete" on public.member_invites for delete to authenticated using (public.is_owner());

alter table public.gallery_items enable row level security;
create policy "gallery_read" on public.gallery_items for select to anon, authenticated using (true);
create policy "gallery_insert" on public.gallery_items for insert to authenticated with check (public.has_permission('gallery_write'));
create policy "gallery_delete" on public.gallery_items for delete to authenticated using (public.has_permission('gallery_write'));

alter table public.applications enable row level security;
create policy "applications_public_insert" on public.applications for insert to anon, authenticated with check (consent = true);
create policy "applications_staff_read" on public.applications for select to authenticated using (public.has_permission('applications_read'));
create policy "applications_staff_update" on public.applications for update to authenticated using (public.has_permission('applications_write')) with check (public.has_permission('applications_write'));
create policy "applications_staff_delete" on public.applications for delete to authenticated using (public.has_permission('applications_write'));

-- Storage bucket for the public gallery.
insert into storage.buckets (id,name,public)
values ('wond-gallery','wond-gallery',true)
on conflict (id) do update set public=true;

create policy "gallery_storage_public_read" on storage.objects for select to public
using (bucket_id='wond-gallery');
create policy "gallery_storage_staff_insert" on storage.objects for insert to authenticated
with check (bucket_id='wond-gallery' and public.has_permission('gallery_write'));
create policy "gallery_storage_staff_delete" on storage.objects for delete to authenticated
using (bucket_id='wond-gallery' and public.has_permission('gallery_write'));

-- Never expose this function to anon.
revoke all on function public.claim_initial_owner(text) from public;
revoke all on function public.create_member_invite(text,text,text,jsonb) from public;
revoke all on function public.accept_member_invite(text) from public;
grant execute on function public.has_owner() to anon, authenticated;
grant execute on function public.claim_initial_owner(text) to authenticated;
grant execute on function public.create_member_invite(text,text,text,jsonb) to authenticated;
grant execute on function public.accept_member_invite(text) to authenticated;
