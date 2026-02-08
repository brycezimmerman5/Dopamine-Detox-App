-- Wellbeing check-in entries (cloud storage)
create table if not exists wellbeing_entries (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  date date not null,
  mental_clarity integer not null check (mental_clarity >= 1 and mental_clarity <= 5),
  mood integer not null check (mood >= 1 and mood <= 5),
  energy integer not null check (energy >= 1 and energy <= 5),
  created_at timestamptz default now(),
  unique (user_id, date)
);

alter table wellbeing_entries enable row level security;

create policy "Users can read own wellbeing_entries"
  on wellbeing_entries for select
  using (auth.uid() = user_id);

create policy "Users can insert own wellbeing_entries"
  on wellbeing_entries for insert
  with check (auth.uid() = user_id);

create policy "Users can update own wellbeing_entries"
  on wellbeing_entries for update
  using (auth.uid() = user_id);
