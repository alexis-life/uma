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
  limit_break integer not null default 0,
  created_at timestamptz not null default now()
);

-- Per-horse G1 race agenda for Independent Training runs.
create table if not exists uma_agenda (
  id uuid primary key default gen_random_uuid(),
  horse_id uuid not null references uma_horses(id) on delete cascade,
  race_id integer not null,
  race_name text not null,
  created_at timestamptz not null default now(),
  unique (horse_id, race_id)
);

-- Team Trials roster: up to 3 Veteran Umas per distance category. Veterans
-- are completed/trained career runs, distinct from uma_horses (which track
-- a character card's base/potential aptitude) -- so their grades are entered
-- independently rather than inherited from the linked horse.
create table if not exists uma_veterans (
  id uuid primary key default gen_random_uuid(),
  horse_id uuid references uma_horses(id) on delete set null,
  name text not null,
  distance_category text not null,
  style text not null,
  distance_grade text not null default 'A',
  style_grade text not null default 'A',
  is_ace boolean not null default false,
  reliable_unique boolean not null default true,
  notes text not null default '',
  created_at timestamptz not null default now()
);

alter table uma_horses enable row level security;
alter table uma_cards enable row level security;
alter table uma_agenda enable row level security;
alter table uma_veterans enable row level security;

-- Public can read everything (viewing the roster needs no login); only an
-- authenticated session (there will only ever be the one account you
-- create) can write.
create policy "uma_horses_public_read" on uma_horses for select using (true);
create policy "uma_horses_authenticated_insert" on uma_horses for insert with check (auth.role() = 'authenticated');
create policy "uma_horses_authenticated_update" on uma_horses for update using (auth.role() = 'authenticated');
create policy "uma_horses_authenticated_delete" on uma_horses for delete using (auth.role() = 'authenticated');

create policy "uma_cards_public_read" on uma_cards for select using (true);
create policy "uma_cards_authenticated_insert" on uma_cards for insert with check (auth.role() = 'authenticated');
create policy "uma_cards_authenticated_update" on uma_cards for update using (auth.role() = 'authenticated');
create policy "uma_cards_authenticated_delete" on uma_cards for delete using (auth.role() = 'authenticated');

create policy "uma_agenda_public_read" on uma_agenda for select using (true);
create policy "uma_agenda_authenticated_insert" on uma_agenda for insert with check (auth.role() = 'authenticated');
create policy "uma_agenda_authenticated_update" on uma_agenda for update using (auth.role() = 'authenticated');
create policy "uma_agenda_authenticated_delete" on uma_agenda for delete using (auth.role() = 'authenticated');

create policy "uma_veterans_public_read" on uma_veterans for select using (true);
create policy "uma_veterans_authenticated_insert" on uma_veterans for insert with check (auth.role() = 'authenticated');
create policy "uma_veterans_authenticated_update" on uma_veterans for update using (auth.role() = 'authenticated');
create policy "uma_veterans_authenticated_delete" on uma_veterans for delete using (auth.role() = 'authenticated');
