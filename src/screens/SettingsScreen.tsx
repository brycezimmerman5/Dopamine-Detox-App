import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useProfileStore } from '../store/profileStore';
import { ReminderSettings } from '../components/ReminderSettings';

export function SettingsScreen() {
  const { session } = useAuthStore();
  const { fetchProfile } = useProfileStore();

  useEffect(() => {
    const userId = session?.user?.id;
    if (userId) fetchProfile(userId);
  }, [session?.user?.id, fetchProfile]);

  return (
    <div className="min-h-screen bg-app-bg p-6 pb-12 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-gray-50 mb-6">Settings</h1>

      <div className="space-y-4 mb-8">
        <ReminderSettings />
        <Link
          to="/settings/edit-profile"
          className="block bg-app-surface p-5 rounded-2xl text-gray-50 hover:bg-app-surfaceHover transition"
        >
          <p className="font-semibold">Edit profile</p>
          <p className="text-sm text-gray-400 mt-1">
            Addictions, replacement activities, future-self message
          </p>
        </Link>

        <Link
          to="/why"
          className="block bg-app-surface p-5 rounded-2xl text-gray-50 hover:bg-app-surfaceHover transition"
        >
          <p className="font-semibold">Why this works</p>
          <p className="text-sm text-gray-400 mt-1">
            Neuroscience behind the 90-second rule
          </p>
        </Link>
      </div>

      <button
        onClick={() => useAuthStore.getState().signOut()}
        className="w-full py-4 bg-app-surfaceHover hover:opacity-90 text-gray-50 font-semibold rounded-xl transition"
      >
        Sign Out
      </button>
    </div>
  );
}
