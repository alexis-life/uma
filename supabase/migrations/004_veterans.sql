-- Run once in the Supabase SQL Editor. Adds the Team Trials roster table.

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

alter table uma_veterans enable row level security;

create policy "uma_veterans_authenticated_all" on uma_veterans
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
