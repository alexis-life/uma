-- uma.alexischao.com — run this once in the Supabase SQL Editor for this project.
-- Tables are prefixed with uma_ so they don't collide with other apps
-- (e.g. the cysa+ study tracker) sharing this same Supabase project.

create table if not exists uma_horses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  talent_rank integer not null default 1,
  aptitudes jsonb not null default '{}'::jsonb,
  style_apt jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists uma_cards (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null,
  rarity text not null,
  level integer not null default 1,
  created_at timestamptz not null default now()
);

create table if not exists uma_agenda (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  done boolean not null default false,
  horse_id uuid references uma_horses(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table uma_horses enable row level security;
alter table uma_cards enable row level security;
alter table uma_agenda enable row level security;

-- Single-user app: any authenticated session (there will only ever be the
-- one account you create) gets full read/write access.
create policy "uma_horses_authenticated_all" on uma_horses
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "uma_cards_authenticated_all" on uma_cards
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "uma_agenda_authenticated_all" on uma_agenda
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
