-- Run once in the Supabase SQL Editor. Reworks uma_agenda from a freeform
-- checklist into a per-horse G1 race agenda (matching the real in-game
-- Independent Training "Agenda" mechanic). Safe to run even with existing
-- rows -- the old checklist columns are dropped along with their data.

alter table uma_agenda drop column if exists text;
alter table uma_agenda drop column if exists done;

alter table uma_agenda add column if not exists race_id integer;
alter table uma_agenda add column if not exists race_name text;

update uma_agenda set race_id = 0 where race_id is null;
update uma_agenda set race_name = '' where race_name is null;

alter table uma_agenda alter column race_id set not null;
alter table uma_agenda alter column race_name set not null;
alter table uma_agenda alter column horse_id set not null;

alter table uma_agenda drop constraint if exists uma_agenda_horse_id_fkey;
alter table uma_agenda add constraint uma_agenda_horse_id_fkey
  foreign key (horse_id) references uma_horses(id) on delete cascade;

alter table uma_agenda add constraint uma_agenda_horse_race_unique unique (horse_id, race_id);
