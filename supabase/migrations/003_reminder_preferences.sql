-- Add reminder preferences to profiles
alter table profiles
  add column if not exists reminder_enabled boolean default false,
  add column if not exists reminder_time text default '09:00';
