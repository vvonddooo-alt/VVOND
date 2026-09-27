-- WOND Professional site: run this SQL in Supabase SQL Editor.
create table if not exists public.site_media(id uuid primary key default gen_random_uuid(),slot text unique not null,public_url text not null,storage_path text not null,created_at timestamptz default now());
create table if not exists public.country_documents(id uuid primary key default gen_random_uuid(),country_code text not null,title text not null,public_url text not null,storage_path text not null,published boolean not null default true,created_at timestamptz default now());
create table if not exists public.company_identifiers(id uuid primary key default gen_random_uuid(),country_code text not null,label text not null,value text not null,created_at timestamptz default now());
alter table public.site_media enable row level security; alter table public.country_documents enable row level security; alter table public.company_identifiers enable row level security;
drop policy if exists "public read media" on public.site_media; create policy "public read media" on public.site_media for select using (true);
drop policy if exists "auth write media" on public.site_media; create policy "auth write media" on public.site_media for all to authenticated using (true) with check (true);
drop policy if exists "public read docs" on public.country_documents; create policy "public read docs" on public.country_documents for select using (published=true);
drop policy if exists "auth write docs" on public.country_documents; create policy "auth write docs" on public.country_documents for all to authenticated using (true) with check (true);
drop policy if exists "public read ids" on public.company_identifiers; create policy "public read ids" on public.company_identifiers for select using (true);
drop policy if exists "auth write ids" on public.company_identifiers; create policy "auth write ids" on public.company_identifiers for all to authenticated using (true) with check (true);
-- Storage bucket. If your project already has this bucket, the insert may report a duplicate; that is harmless.
insert into storage.buckets(id,name,public) values('wond-public','wond-public',true) on conflict(id) do nothing;
drop policy if exists "public read wond files" on storage.objects; create policy "public read wond files" on storage.objects for select using (bucket_id='wond-public');
drop policy if exists "auth upload wond files" on storage.objects; create policy "auth upload wond files" on storage.objects for insert to authenticated with check (bucket_id='wond-public');
drop policy if exists "auth delete wond files" on storage.objects; create policy "auth delete wond files" on storage.objects for delete to authenticated using (bucket_id='wond-public');
