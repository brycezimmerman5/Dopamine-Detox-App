import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Profile, AddictionType } from '../types/database';

interface ProfileState extends Partial<Profile> {
  isLoading: boolean;
  fetchError: string | null;
  fetchProfile: (userId: string) => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<{ error: Error | null }>;
  setAddictions: (addictions: AddictionType[]) => void;
  setReplacements: (activities: string[]) => void;
  setFutureSelfMessage: (message: string) => void;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  isLoading: false,
  fetchError: null,

  fetchProfile: async (userId: string) => {
    set({ isLoading: true, fetchError: null });
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      set({ fetchError: error.message, isLoading: false });
      return;
    }

    if (data) {
      set({
        user_id: data.user_id,
        addictions: data.addictions ?? [],
        replacement_activities: data.replacement_activities ?? [],
        future_self_message: data.future_self_message ?? '',
        reminder_enabled: data.reminder_enabled ?? false,
        reminder_time: data.reminder_time ?? '09:00',
        fetchError: null,
      });
    } else {
      set({
        user_id: userId,
        addictions: [],
        replacement_activities: [],
        future_self_message: '',
        reminder_enabled: false,
        reminder_time: '09:00',
        fetchError: null,
      });
    }
    set({ isLoading: false });
  },

  updateProfile: async (data: Partial<Profile>) => {
    const userId = data.user_id ?? get().user_id;
    if (!userId) return { error: new Error('No user') };

    const payload = {
      user_id: userId,
      addictions: data.addictions ?? get().addictions ?? [],
      replacement_activities: data.replacement_activities ?? get().replacement_activities ?? [],
      future_self_message: data.future_self_message ?? get().future_self_message ?? '',
      reminder_enabled: data.reminder_enabled ?? get().reminder_enabled ?? false,
      reminder_time: data.reminder_time ?? get().reminder_time ?? '09:00',
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('profiles').upsert(payload, {
      onConflict: 'user_id',
    });

    if (!error) {
      set(data);
    }
    return { error: error as Error | null };
  },

  setAddictions: (addictions) => set({ addictions }),
  setReplacements: (activities) => set({ replacement_activities: activities }),
  setFutureSelfMessage: (message) => set({ future_self_message: message }),
}));
