-- Run once in the Supabase SQL Editor. Tracks a veteran's surface (Turf/Dirt)
-- aptitude separately from their distance-category aptitude, since most
-- veterans default to Turf but some are also worth flagging for Dirt.

alter table uma_veterans add column if not exists track_type text not null default 'Turf';
alter table uma_veterans add column if not exists track_grade text not null default 'A';
