-- Lumina Intelligence: almacenamiento privado y busqueda contextual.
-- Ejecutar una sola vez en Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.lumina_sources (
  id uuid primary key default gen_random_uuid(),
  owner_email text not null,
  source_type text not null check (source_type in ('read_ai', 'calendar')),
  source_id text not null,
  title text not null,
  content text not null default '',
  source_date timestamptz,
  source_url text,
  metadata jsonb not null default '{}'::jsonb,
  content_hash text not null,
  sync_token text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  search_vector tsvector generated always as (
    setweight(to_tsvector('simple', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('simple', coalesce(content, '')), 'B')
  ) stored,
  unique (owner_email, source_type, source_id)
);

create index if not exists lumina_sources_search_idx
  on public.lumina_sources using gin (search_vector);
create index if not exists lumina_sources_owner_date_idx
  on public.lumina_sources (owner_email, source_date desc);

create table if not exists public.lumina_conversations (
  id uuid primary key default gen_random_uuid(),
  owner_email text not null,
  title text not null default 'Conversacion con Agente Lumina',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists lumina_conversations_owner_idx
  on public.lumina_conversations (owner_email, updated_at desc);

create table if not exists public.lumina_messages (
  id uuid primary key default gen_random_uuid(),
  sequence bigint generated always as identity,
  conversation_id uuid not null references public.lumina_conversations(id) on delete cascade,
  owner_email text not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  citations jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists lumina_messages_conversation_idx
  on public.lumina_messages (conversation_id, sequence);

alter table public.lumina_sources enable row level security;
alter table public.lumina_conversations enable row level security;
alter table public.lumina_messages enable row level security;

revoke all on public.lumina_sources from anon, authenticated;
revoke all on public.lumina_conversations from anon, authenticated;
revoke all on public.lumina_messages from anon, authenticated;
grant select, insert, update, delete on public.lumina_sources to service_role;
grant select, insert, update, delete on public.lumina_conversations to service_role;
grant select, insert, update, delete on public.lumina_messages to service_role;

create or replace function public.search_lumina_sources(
  p_owner_email text,
  p_query text,
  p_limit integer default 8
)
returns table (
  id uuid,
  source_type text,
  source_id text,
  title text,
  content text,
  source_date timestamptz,
  source_url text,
  metadata jsonb,
  rank real
)
language sql
stable
security definer
set search_path = public
as $$
  with query as (
    select websearch_to_tsquery('simple', left(coalesce(p_query, ''), 500)) as value
  )
  select
    source.id,
    source.source_type,
    source.source_id,
    source.title,
    source.content,
    source.source_date,
    source.source_url,
    source.metadata,
    ts_rank(source.search_vector, query.value)::real as rank
  from public.lumina_sources source, query
  where source.owner_email = p_owner_email
    and (
      source.search_vector @@ query.value
      or source.title ilike '%' || left(coalesce(p_query, ''), 200) || '%'
      or source.content ilike '%' || left(coalesce(p_query, ''), 200) || '%'
    )
  order by rank desc, source.source_date desc nulls last
  limit greatest(1, least(coalesce(p_limit, 8), 15));
$$;

revoke all on function public.search_lumina_sources(text, text, integer) from public, anon, authenticated;
grant execute on function public.search_lumina_sources(text, text, integer) to service_role;


drop function if exists public.save_lumina_turn(text, uuid, text, text, jsonb);

create or replace function public.save_lumina_turn(
  p_owner_email text,
  p_conversation_id uuid,
  p_title text,
  p_user_content text,
  p_assistant_content text,
  p_citations jsonb default '[]'::jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1 from public.lumina_conversations
    where id = p_conversation_id and owner_email = p_owner_email
  ) then
    insert into public.lumina_conversations (id, owner_email, title)
    values (p_conversation_id, p_owner_email, left(coalesce(nullif(p_title, ''), 'Conversacion con Agente Lumina'), 90));
  end if;

  insert into public.lumina_messages (conversation_id, owner_email, role, content)
  values (p_conversation_id, p_owner_email, 'user', p_user_content);

  insert into public.lumina_messages (conversation_id, owner_email, role, content, citations)
  values (p_conversation_id, p_owner_email, 'assistant', p_assistant_content, coalesce(p_citations, '[]'::jsonb));

  update public.lumina_conversations
  set updated_at = now()
  where id = p_conversation_id and owner_email = p_owner_email;
end;
$$;

revoke all on function public.save_lumina_turn(text, uuid, text, text, text, jsonb) from public, anon, authenticated;
grant execute on function public.save_lumina_turn(text, uuid, text, text, text, jsonb) to service_role;
