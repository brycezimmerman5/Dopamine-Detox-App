export type AddictionType =
  | 'nicotine'
  | 'porn'
  | 'social_media'
  | 'junk_food'
  | 'gaming'
  | 'procrastination'
  | 'custom';

export type TriggerType =
  | 'boredom'
  | 'stress'
  | 'loneliness'
  | 'social_media'
  | 'late_night'
  | 'after_meals'
  | 'custom';

export interface Profile {
  user_id: string;
  addictions: AddictionType[];
  replacement_activities: string[];
  future_self_message: string;
  reminder_enabled?: boolean;
  reminder_time?: string;
  created_at: string;
}

export interface UrgeSession {
  id?: string;
  user_id: string;
  addiction_type: AddictionType;
  started_at: string;
  duration_sec: number;
  beat_urge: boolean;
  trigger?: TriggerType;
  intensity?: number;
  synced?: boolean;
}

export interface DopamineAction {
  id?: string;
  user_id: string;
  action_type: 'positive' | 'negative';
  category: string;
  created_at: string;
  synced?: boolean;
}

export interface Streak {
  user_id: string;
  addiction_type: AddictionType;
  current_streak: number;
  longest_streak: number;
  last_relapse_at: string | null;
}
