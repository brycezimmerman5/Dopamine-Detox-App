import { useEffect, useRef } from 'react';
import { useProfileStore } from '../store/profileStore';

const REMINDER_TITLE = 'Dopamine Detox';
const REMINDER_BODY = 'How are you doing today? Take a quick check-in.';

export function useReminder() {
  const { reminder_enabled, reminder_time } = useProfileStore();
  const lastNotifiedRef = useRef<string>('');

  useEffect(() => {
    if (!reminder_enabled || !reminder_time || typeof window === 'undefined' || !('Notification' in window)) return;
    if (Notification.permission !== 'granted') return;

    const check = () => {
      const now = new Date();
      const [h, m] = (reminder_time ?? '09:00').split(':').map(Number);
      const targetHour = h;
      const targetMin = m;
      if (now.getHours() !== targetHour || now.getMinutes() !== targetMin) return;

      const today = now.toISOString().split('T')[0];
      if (lastNotifiedRef.current === today) return;
      lastNotifiedRef.current = today;

      new Notification(REMINDER_TITLE, { body: REMINDER_BODY });
    };

    const id = setInterval(check, 60000);
    check();
    return () => clearInterval(id);
  }, [reminder_enabled, reminder_time]);
}
