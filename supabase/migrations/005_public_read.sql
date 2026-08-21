-- Run once in the Supabase SQL Editor. Switches all uma_ tables from
-- "authenticated only" to "public read, authenticated write" -- matching the
-- cysa+ tracker's pattern: anyone can view your roster/cards/team, only you
-- (signed in) can change them.

drop policy if exists "uma_horses_authenticated_all" on uma_horses;
drop policy if exists "uma_cards_authenticated_all" on uma_cards;
drop policy if exists "uma_agenda_authenticated_all" on uma_agenda;
drop policy if exists "uma_veterans_authenticated_all" on uma_veterans;

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
