import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useProfileStore } from '../store/profileStore';

export function ReminderSettings() {
  const { session } = useAuthStore();
  const {
    reminder_enabled = false,
    reminder_time = '09:00',
    updateProfile,
  } = useProfileStore();
  const [enabled, setEnabled] = useState(reminder_enabled);
  const [time, setTime] = useState(reminder_time);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setEnabled(reminder_enabled);
    setTime(reminder_time);
  }, [reminder_enabled, reminder_time]);

  const handleToggle = async () => {
    if (enabled && 'Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') return;
    }
    setSaving(true);
    const next = !enabled;
    setEnabled(next);
    const { error } = await updateProfile({
      user_id: session?.user?.id ?? '',
      reminder_enabled: next,
      reminder_time: time,
    });
    setSaving(false);
    if (error) setEnabled(enabled);
  };

  const handleTimeChange = async (newTime: string) => {
    setTime(newTime);
    setSaving(true);
    await updateProfile({
      user_id: session?.user?.id ?? '',
      reminder_enabled: enabled,
      reminder_time: newTime,
    });
    setSaving(false);
  };

  return (
    <div className="bg-app-surface p-5 rounded-2xl">
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="font-semibold text-gray-50">Daily reminder</p>
          <p className="text-sm text-gray-400 mt-1">
            Get a notification to check in (when app is open)
          </p>
        </div>
        <button
          type="button"
          onClick={handleToggle}
          disabled={saving}
          className={`relative w-12 h-7 rounded-full transition ${enabled ? 'bg-app-accent' : 'bg-app-surfaceHover'}`}
        >
          <span
            className={`absolute top-1 w-5 h-5 rounded-full bg-white transition ${
              enabled ? 'left-6' : 'left-1'
            }`}
          />
        </button>
      </div>
      {enabled && (
        <div>
          <label className="text-sm text-gray-400 block mb-2">Reminder time</label>
          <input
            type="time"
            value={time}
            onChange={(e) => handleTimeChange(e.target.value)}
            className="bg-app-surfaceHover rounded-xl px-4 py-2 text-gray-50"
          />
        </div>
      )}
    </div>
  );
}
