-- Run once in the Supabase SQL Editor. Adds stable GameTora identity columns
-- so a pasted export can upsert by ID instead of fuzzy name matching.

alter table uma_horses add column if not exists card_id integer;
alter table uma_cards add column if not exists support_id integer;
