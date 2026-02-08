import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { AddictionType } from '../types/database';

interface StreakState {
  currentStreak: number;
  longestStreak: number;
  primaryAddiction: AddictionType | null;
  isLoading: boolean;
  fetchStreak: (userId: string) => Promise<void>;
  updateStreakOnRelapse: (userId: string, addictionType: AddictionType) => Promise<void>;
}

function daysSince(dateStr: string): number {
  const d = new Date(dateStr);
  d.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.max(0, Math.floor((today.getTime() - d.getTime()) / 86400000));
}

export const useStreakStore = create<StreakState>((set, get) => ({
  currentStreak: 0,
  longestStreak: 0,
  primaryAddiction: null,
  isLoading: false,

  fetchStreak: async (userId: string) => {
    set({ isLoading: true });
    const { data } = await supabase
      .from('streaks')
      .select('*')
      .eq('user_id', userId)
      .order('last_relapse_at', { ascending: false, nullsFirst: false })
      .limit(1)
      .maybeSingle();

    if (data?.last_relapse_at) {
      const current = daysSince(data.last_relapse_at);
      const longest = Math.max(current, data.longest_streak ?? 0);
      set({
        currentStreak: current,
        longestStreak: longest,
        primaryAddiction: (data.addiction_type as AddictionType) ?? null,
      });
    } else {
      const { data: lastRelapse } = await supabase
        .from('urge_sessions')
        .select('started_at')
        .eq('user_id', userId)
        .eq('beat_urge', false)
        .order('started_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (lastRelapse?.started_at) {
        const current = daysSince(lastRelapse.started_at);
        set({
          currentStreak: current,
          longestStreak: Math.max(current, get().longestStreak),
          primaryAddiction: get().primaryAddiction,
        });
      } else {
        const { data: firstSession } = await supabase
          .from('urge_sessions')
          .select('started_at')
          .eq('user_id', userId)
          .order('started_at', { ascending: true })
          .limit(1)
          .maybeSingle();
        if (firstSession?.started_at) {
          const current = daysSince(firstSession.started_at);
          set({
            currentStreak: current,
            longestStreak: Math.max(current, get().longestStreak),
            primaryAddiction: get().primaryAddiction,
          });
        }
      }
    }
    set({ isLoading: false });
  },

  updateStreakOnRelapse: async (userId: string, addictionType: AddictionType) => {
    await supabase.from('streaks').upsert(
      {
        user_id: userId,
        addiction_type: addictionType,
        last_relapse_at: new Date().toISOString(),
        current_streak: 0,
        longest_streak: get().longestStreak,
      },
      { onConflict: 'user_id,addiction_type' }
    );
    set({ currentStreak: 0 });
  },
}));
