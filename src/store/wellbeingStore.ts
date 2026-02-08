import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface WellbeingEntry {
  date: string;
  mentalClarity: number;
  mood: number;
  energy: number;
}

interface WellbeingState {
  entries: WellbeingEntry[];
  isLoading: boolean;
  fetchEntries: (userId: string) => Promise<void>;
  addEntry: (userId: string, entry: Omit<WellbeingEntry, 'date'>) => Promise<void>;
}

export const useWellbeingStore = create<WellbeingState>((set, get) => ({
  entries: [],
  isLoading: false,

  fetchEntries: async (userId: string) => {
    if (!userId) return;
    set({ isLoading: true });
    const { data } = await supabase
      .from('wellbeing_entries')
      .select('date, mental_clarity, mood, energy')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .limit(30);

    const entries: WellbeingEntry[] = (data ?? []).map((row) => ({
      date: row.date,
      mentalClarity: row.mental_clarity,
      mood: row.mood,
      energy: row.energy,
    }));
    set({ entries, isLoading: false });
  },

  addEntry: async (userId: string, entry) => {
    if (!userId) return;
    const date = new Date().toISOString().split('T')[0];
    const { error } = await supabase.from('wellbeing_entries').upsert(
      {
        user_id: userId,
        date,
        mental_clarity: entry.mentalClarity,
        mood: entry.mood,
        energy: entry.energy,
      },
      { onConflict: 'user_id,date' }
    );

    if (!error) {
      const newEntry: WellbeingEntry = { ...entry, date };
      const entries = [...get().entries.filter((e) => e.date !== date), newEntry]
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 30);
      set({ entries });
    }
  },
}));
