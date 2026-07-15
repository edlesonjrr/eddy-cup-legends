create table public.rooms (
  code text primary key check (code ~ '^[A-Z0-9]{6}$'),
  host_token_hash text not null,
  guest_token_hash text,
  host_state jsonb not null default '{}'::jsonb,
  guest_state jsonb not null default '{}'::jsonb,
  match_state jsonb not null default '{}'::jsonb,
  host_decision jsonb not null default '{}'::jsonb,
  guest_decision jsonb not null default '{}'::jsonb,
  status text not null default 'waiting' check (status in ('waiting','drafting','playing','finished')),
  deadline timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '4 hours')
);
create index rooms_expires_at_idx on public.rooms(expires_at);
alter table public.rooms enable row level security;
revoke all on public.rooms from anon, authenticated;
create policy "deny direct room access" on public.rooms
for all to anon, authenticated using (false) with check (false);
