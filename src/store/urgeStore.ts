import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { useToastStore } from './toastStore';
import type { UrgeSession } from '../types/database';

const URGES_QUEUE_KEY = 'dopamine_detox_urges_queue';

interface UrgeState {
  urgesToday: number;
  pendingSync: UrgeSession[];
  isLoading: boolean;
  fetchUrgesToday: (userId: string) => Promise<void>;
  addUrgeSession: (session: Omit<UrgeSession, 'id'>) => Promise<void>;
  syncPendingUrges: (userId: string) => Promise<void>;
}

function getPendingQueue(): UrgeSession[] {
  try {
    const raw = localStorage.getItem(URGES_QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setPendingQueue(items: UrgeSession[]) {
  localStorage.setItem(URGES_QUEUE_KEY, JSON.stringify(items));
}

function getLocalDayBounds() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  return { start: start.toISOString(), end: end.toISOString() };
}

export const useUrgeStore = create<UrgeState>((set, get) => ({
  urgesToday: 0,
  pendingSync: [],
  isLoading: false,

  fetchUrgesToday: async (userId: string) => {
    set({ isLoading: true });
    const { start, end } = getLocalDayBounds();
    const { count } = await supabase
      .from('urge_sessions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('beat_urge', true)
      .gte('started_at', start)
      .lte('started_at', end);

    const newCount = count ?? 0;
    set((s) => ({
      urgesToday: Math.max(s.urgesToday, newCount),
      isLoading: false,
    }));
  },

  addUrgeSession: async (session: Omit<UrgeSession, 'id'>) => {
    const fullSession: UrgeSession = {
      ...session,
      id: `local-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    };

    try {
      const { error } = await supabase.from('urge_sessions').insert({
        user_id: fullSession.user_id,
        addiction_type: fullSession.addiction_type,
        started_at: fullSession.started_at,
        duration_sec: fullSession.duration_sec,
        beat_urge: fullSession.beat_urge,
        trigger: fullSession.trigger,
        intensity: fullSession.intensity,
      });

      if (error) throw error;
      if (fullSession.beat_urge) {
        const { start, end } = getLocalDayBounds();
        const { count } = await supabase
          .from('urge_sessions')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', fullSession.user_id)
          .eq('beat_urge', true)
          .gte('started_at', start)
          .lte('started_at', end);
        set({ urgesToday: Math.max(count ?? 0, get().urgesToday + 1) });
      }
    } catch {
      const queue = getPendingQueue();
      queue.push({ ...fullSession, synced: false });
      setPendingQueue(queue);
      set({ pendingSync: queue });
      if (fullSession.beat_urge) {
        set((s) => ({ urgesToday: s.urgesToday + 1 }));
      }
      useToastStore.getState().add('Saved locally – will sync when online.');
    }
  },

  syncPendingUrges: async (userId: string) => {
    const queue = getPendingQueue();
    if (queue.length === 0) return;

    const toSync = queue.filter((u) => u.user_id === userId);
    for (const session of toSync) {
      try {
        await supabase.from('urge_sessions').insert({
          user_id: session.user_id,
          addiction_type: session.addiction_type,
          started_at: session.started_at,
          duration_sec: session.duration_sec,
          beat_urge: session.beat_urge,
          trigger: session.trigger,
          intensity: session.intensity,
        });
      } catch {
        continue;
      }
    }
    const remaining = queue.filter((u) => u.user_id !== userId || !toSync.includes(u));
    setPendingQueue(remaining);
    set({ pendingSync: remaining });
    get().fetchUrgesToday(userId);
  },
}));
