import { create } from 'zustand';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthState {
  session: Session | null;
  isLoading: boolean;
  isInitialized: boolean;
  initError: string | null;
  init: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  isLoading: false,
  isInitialized: false,
  initError: null,

  init: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      set({ session, isInitialized: true, initError: null });

      supabase.auth.onAuthStateChange((_event, session) => {
        set({ session });
      });
    } catch (err) {
      set({
        isInitialized: true,
        initError: err instanceof Error ? err.message : 'Failed to connect',
      });
    }
  },

  signIn: async (email: string, password: string) => {
    set({ isLoading: true });
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    set({ isLoading: false });
    return { error: error as Error | null };
  },

  signUp: async (email: string, password: string) => {
    set({ isLoading: true });
    const { error } = await supabase.auth.signUp({ email, password });
    set({ isLoading: false });
    return { error: error as Error | null };
  },

  signOut: async () => {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('dopamine-onboarding-complete-')) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));
    await supabase.auth.signOut();
    set({ session: null });
    window.location.href = '/login';
  },
}));
