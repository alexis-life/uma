-- Run once in the Supabase SQL Editor. Replaces the track_type/track_grade
-- single-select pair from migration 007 with two always-present columns —
-- every veteran has both a Turf and a Dirt grade in-game, not a choice of
-- one, so the UI now shows both instead of gating Dirt behind a dropdown.
-- Safe to run whether or not migration 007 was ever applied.

alter table uma_veterans add column if not exists turf_grade text not null default 'A';
alter table uma_veterans add column if not exists dirt_grade text not null default 'G';

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_name = 'uma_veterans' and column_name = 'track_type'
  ) then
    update uma_veterans set turf_grade = track_grade where track_type = 'Turf';
    update uma_veterans set dirt_grade = track_grade where track_type = 'Dirt';
    alter table uma_veterans drop column track_type;
    alter table uma_veterans drop column track_grade;
  end if;
end $$;
