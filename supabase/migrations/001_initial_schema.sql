-- Dopamine Detox App - Initial Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles (extends auth.users)
create table if not exists profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  addictions text[] default '{}',
  replacement_activities text[] default '{}',
  future_self_message text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Urge sessions
create table if not exists urge_sessions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  addiction_type text not null,
  started_at timestamptz not null,
  duration_sec integer not null default 90,
  beat_urge boolean not null,
  trigger text,
  intensity integer check (intensity >= 1 and intensity <= 10),
  created_at timestamptz default now()
);

-- Dopamine actions (positive/negative)
create table if not exists dopamine_actions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  action_type text not null check (action_type in ('positive', 'negative')),
  category text not null,
  created_at timestamptz default now()
);

-- Streaks (computed or stored per user per addiction)
create table if not exists streaks (
  user_id uuid references auth.users(id) on delete cascade,
  addiction_type text not null,
  current_streak integer default 0,
  longest_streak integer default 0,
  last_relapse_at timestamptz,
  primary key (user_id, addiction_type)
);

-- RLS policies
alter table profiles enable row level security;
alter table urge_sessions enable row level security;
alter table dopamine_actions enable row level security;
alter table streaks enable row level security;

create policy "Users can read own profile"
  on profiles for select
  using (auth.uid() = user_id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = user_id);

create policy "Users can insert own profile"
  on profiles for insert
  with check (auth.uid() = user_id);

create policy "Users can read own urge_sessions"
  on urge_sessions for select
  using (auth.uid() = user_id);

create policy "Users can insert own urge_sessions"
  on urge_sessions for insert
  with check (auth.uid() = user_id);

create policy "Users can read own dopamine_actions"
  on dopamine_actions for select
  using (auth.uid() = user_id);

create policy "Users can insert own dopamine_actions"
  on dopamine_actions for insert
  with check (auth.uid() = user_id);

create policy "Users can read own streaks"
  on streaks for select
  using (auth.uid() = user_id);

create policy "Users can insert own streaks"
  on streaks for insert
  with check (auth.uid() = user_id);

create policy "Users can update own streaks"
  on streaks for update
  using (auth.uid() = user_id);
