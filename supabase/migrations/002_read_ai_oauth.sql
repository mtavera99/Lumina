create table if not exists public.lumina_read_ai_connections (
  owner_email text primary key,
  client_id text not null,
  client_secret text not null,
  callback_url text not null,
  app_origin text not null,
  access_token text,
  refresh_token text,
  token_expires_at timestamptz,
  oauth_state_hash text,
  pkce_verifier text,
  oauth_expires_at timestamptz,
  connected_at timestamptz,
  sync_cursor text,
  history_complete boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists lumina_read_ai_connections_state_idx
  on public.lumina_read_ai_connections (oauth_state_hash)
  where oauth_state_hash is not null;

alter table public.lumina_read_ai_connections enable row level security;
revoke all on public.lumina_read_ai_connections from public, anon, authenticated;
grant select, insert, update, delete on public.lumina_read_ai_connections to service_role;
