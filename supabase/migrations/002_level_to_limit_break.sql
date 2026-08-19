-- Run once in the Supabase SQL Editor if uma_cards already exists with the
-- old `level` column (training level, which doesn't matter since it's always
-- maxed) — renames it to `limit_break` (0-4, which does matter).

alter table uma_cards rename column level to limit_break;
alter table uma_cards alter column limit_break set default 0;
