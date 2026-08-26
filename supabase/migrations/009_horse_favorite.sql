-- Run once in the Supabase SQL Editor. Adds an "oshi" favorite flag to
-- uma_horses so specific trainees can be pinned/starred in the roster view.
-- Additive and defaulted, safe to run any time.

alter table uma_horses add column if not exists is_favorite boolean not null default false;
