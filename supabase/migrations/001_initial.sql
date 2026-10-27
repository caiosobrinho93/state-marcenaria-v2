-- Apply once in Supabase SQL Editor. No service_role key is used by the application.
create table public.admins(id uuid primary key references auth.users(id) on delete cascade);
alter table public.admins enable row level security;
create policy "admin reads own membership" on public.admins for select to authenticated using(id=auth.uid());
create function public.is_admin() returns boolean language sql stable security definer set search_path=public as $$ select exists(select 1 from public.admins where id=auth.uid()); $$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon,authenticated;
create table public.entries (
 id uuid primary key default gen_random_uuid(),kind text not null check(kind in ('material','project','category','manufacturer')),
 title text not null check(length(title) between 2 and 160),category text not null default '',description text not null default '',image text not null default '',images text[] not null default '{}',brand text not null default '',reference text not null default '',specifications text not null default '',variations text not null default '',availability text not null default 'consultar' check(availability in ('consultar','disponivel','indisponivel')),featured boolean not null default false,published boolean not null default false,position integer not null default 0,created_at timestamptz not null default now()
);
alter table public.entries enable row level security;
create policy "published entries" on public.entries for select using(published or public.is_admin());
create policy "admin writes entries" on public.entries for all to authenticated using(public.is_admin()) with check(public.is_admin());
create index entries_public_order on public.entries(published,kind,position);
create table public.settings(id integer primary key check(id=1),data jsonb not null default '{}');
alter table public.settings enable row level security;
create policy "public settings" on public.settings for select using(true);
create policy "admin writes settings" on public.settings for all to authenticated using(public.is_admin()) with check(public.is_admin());
create table public.leads(id uuid primary key default gen_random_uuid(),name text not null,phone text not null,email text not null default '',message text not null,materials jsonb not null default '[]',status text not null default 'novo' check(status in ('novo','em_atendimento','proposta','concluido','arquivado')),created_at timestamptz not null default now());
create table public.lead_history(id uuid primary key default gen_random_uuid(),lead_id uuid not null references public.leads(id) on delete cascade,status text not null,note text not null default '',actor uuid references auth.users(id),created_at timestamptz not null default now());
alter table public.leads enable row level security;
alter table public.lead_history enable row level security;
create policy "admin leads" on public.leads for all to authenticated using(public.is_admin()) with check(public.is_admin());
create policy "admin history" on public.lead_history for select to authenticated using(public.is_admin());
create function public.submit_lead(p_name text,p_phone text,p_email text,p_message text,p_materials uuid[]) returns uuid language plpgsql security definer set search_path=public as $$
declare result uuid; snapshots jsonb; normalized text;
begin
 normalized:=regexp_replace(p_phone,'[^0-9]','','g');
 if length(trim(p_name)) not between 2 and 100 or length(normalized) not between 10 and 15 or length(p_message) not between 10 and 2000 or length(p_email)>254 or cardinality(p_materials)>30 then raise exception 'Invalid input'; end if;
 perform pg_advisory_xact_lock(hashtext(normalized));
 if exists(select 1 from public.leads where regexp_replace(phone,'[^0-9]','','g')=normalized and created_at>now()-interval '5 minutes') then raise exception 'Please wait before submitting again'; end if;
 select coalesce(jsonb_agg(jsonb_build_object('id',id,'title',title,'reference',reference)),'[]') into snapshots from public.entries where id=any(p_materials) and published and kind='material';
 if jsonb_array_length(snapshots)<>cardinality(p_materials) then raise exception 'Invalid materials'; end if;
 insert into public.leads(name,phone,email,message,materials) values(trim(p_name),normalized,p_email,p_message,snapshots) returning id into result;
 insert into public.lead_history(lead_id,status,note) values(result,'novo','Solicitação recebida pelo website.');return result;
end; $$;
revoke all on function public.submit_lead(text,text,text,text,uuid[]) from public;
grant execute on function public.submit_lead(text,text,text,text,uuid[]) to anon,authenticated;
create function public.update_lead(p_id uuid,p_status text,p_note text) returns void language plpgsql security invoker set search_path=public as $$
begin
 if not public.is_admin() then raise exception 'Forbidden'; end if;
 if length(p_note)>2000 then raise exception 'Invalid note'; end if;
 update public.leads set status=p_status where id=p_id;
 if not found then raise exception 'Lead not found'; end if;
 insert into public.lead_history(lead_id,status,note,actor) values(p_id,p_status,p_note,auth.uid());
end; $$;
create policy "admin inserts history" on public.lead_history for insert to authenticated with check(public.is_admin());
revoke all on function public.update_lead(uuid,text,text) from public;
grant execute on function public.update_lead(uuid,text,text) to authenticated;
grant select on public.entries,public.settings to anon;
grant select,insert,update,delete on public.entries,public.settings,public.leads to authenticated;
grant select,insert on public.lead_history to authenticated;
grant select on public.admins to authenticated;
revoke all on public.leads,public.lead_history,public.admins from anon;
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('media','media',true,3145728,array['image/jpeg','image/png','image/webp']);
create policy "public media" on storage.objects for select using(bucket_id='media');
create policy "admin media" on storage.objects for all to authenticated using(bucket_id='media' and public.is_admin()) with check(bucket_id='media' and public.is_admin());
-- Create an email/password user in Authentication, then explicitly grant admin:
-- insert into public.admins(id) values ('AUTH_USER_UUID');

