-- Allow users to delete their own dopamine_actions (e.g. undo a log entry)
create policy "Users can delete own dopamine_actions"
  on dopamine_actions for delete
  using (auth.uid() = user_id);
