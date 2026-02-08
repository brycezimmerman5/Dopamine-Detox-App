import { create } from 'zustand';
import { supabase } from '../lib/supabase';

const POSITIVE_ACTIONS = [
  { id: 'gym', label: 'Gym / Exercise' },
  { id: 'deep_work', label: 'Deep work' },
  { id: 'reading', label: 'Reading' },
  { id: 'sunlight', label: 'Sunlight / Outdoor' },
  { id: 'meditation', label: 'Meditation' },
  { id: 'social', label: 'Quality time with others' },
];

const NEGATIVE_ACTIONS = [
  { id: 'relapse', label: 'Relapse' },
  { id: 'smoking', label: 'Smoking' },
  { id: 'porn', label: 'Porn / Compulsive' },
  { id: 'junk_food', label: 'Junk food binge' },
  { id: 'social_media', label: 'Social media scroll' },
  { id: 'gaming', label: 'Gaming binge' },
  { id: 'procrastination', label: 'Procrastination' },
];

interface DopamineActionEntry {
  id: string;
  type: 'positive' | 'negative';
  category: string;
}

interface DopamineState {
  dailyScore: number;
  actionsToday: DopamineActionEntry[];
  isLoading: boolean;
  positiveActions: typeof POSITIVE_ACTIONS;
  negativeActions: typeof NEGATIVE_ACTIONS;
  fetchDailyScore: (userId: string) => Promise<void>;
  addAction: (
    userId: string,
    type: 'positive' | 'negative',
    category: string
  ) => Promise<void>;
  removeAction: (userId: string, actionId: string) => Promise<void>;
}

export const useDopamineStore = create<DopamineState>((set, get) => ({
  dailyScore: 0,
  actionsToday: [],
  isLoading: false,
  positiveActions: POSITIVE_ACTIONS,
  negativeActions: NEGATIVE_ACTIONS,

  fetchDailyScore: async (userId: string) => {
    set({ isLoading: true });
    const today = new Date().toISOString().split('T')[0];

    const { data } = await supabase
      .from('dopamine_actions')
      .select('id, action_type, category')
      .eq('user_id', userId)
      .gte('created_at', `${today}T00:00:00`)
      .lte('created_at', `${today}T23:59:59`);

    const actions = data ?? [];
    const positives = actions.filter((a) => a.action_type === 'positive').length;
    const negatives = actions.filter((a) => a.action_type === 'negative').length;
    const score = Math.max(-10, Math.min(10, positives - negatives));

    set({
      dailyScore: score,
      actionsToday: actions.map((a) => ({
        id: a.id,
        type: a.action_type as 'positive' | 'negative',
        category: a.category,
      })),
      isLoading: false,
    });
  },

  addAction: async (userId: string, type: 'positive' | 'negative', category: string) => {
    await supabase.from('dopamine_actions').insert({
      user_id: userId,
      action_type: type,
      category,
    });
    get().fetchDailyScore(userId);
  },

  removeAction: async (userId: string, actionId: string) => {
    await supabase.from('dopamine_actions').delete().eq('id', actionId).eq('user_id', userId);
    get().fetchDailyScore(userId);
  },
}));
