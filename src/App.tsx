import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { useProfileStore } from './store/profileStore';
import { useOnboardingCheck } from './hooks/useOnboardingCheck';
import { MainLayout } from './components/MainLayout';
import { LoginScreen } from './screens/LoginScreen';
import { SignUpScreen } from './screens/SignUpScreen';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { HomeScreen } from './screens/HomeScreen';
import { UrgeScreen } from './screens/UrgeScreen';
import { AnalyticsScreen } from './screens/AnalyticsScreen';
import { WhyThisWorksScreen } from './screens/WhyThisWorksScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { EditProfileScreen } from './screens/EditProfileScreen';

const hasSupabaseConfig =
  import.meta.env.VITE_SUPABASE_URL &&
  (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY);

function SetupRequired() {
  return (
    <div className="min-h-screen bg-app-bg p-6 flex flex-col items-center justify-center text-center">
      <h1 className="text-2xl font-bold text-gray-50 mb-4">Setup required</h1>
      <p className="text-gray-400 max-w-md mb-6">
        Create a <code className="bg-[#1f2937] px-2 py-1 rounded">.env</code> file
        in the project root with your Supabase credentials:
      </p>
      <pre className="bg-[#1f2937] p-4 rounded-xl text-left text-sm text-gray-300 overflow-x-auto max-w-full">
        {`VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key`}
      </pre>
      <p className="text-gray-500 text-sm mt-6">
        Copy from <code className="bg-[#1f2937] px-1 rounded">.env.example</code>,
        then restart the dev server.
      </p>
    </div>
  );
}

function AppContent() {
  const { session, isInitialized, init, initError } = useAuthStore();
  const { needsOnboarding, isLoading: onboardingLoading, fetchError } = useOnboardingCheck();
  const fetchProfile = useProfileStore((s) => s.fetchProfile);

  useEffect(() => {
    init();
  }, [init]);

  if (initError) {
    return (
      <div className="min-h-screen bg-app-bg p-6 flex flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-bold text-red-400 mb-4">Connection error</h1>
        <p className="text-gray-400 max-w-md mb-6">
          Could not connect to Supabase. Check your .env and ensure the Supabase
          URL and anon key are correct.
        </p>
        <p className="text-gray-500 text-sm">{initError}</p>
      </div>
    );
  }

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-app-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-app-bg">
        <Routes>
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/signup" element={<SignUpScreen />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    );
  }

  if (fetchError && !onboardingLoading) {
    return (
      <div className="min-h-screen bg-app-bg p-6 flex flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-bold text-red-400 mb-4">Could not load profile</h1>
        <p className="text-gray-400 max-w-md mb-6">{fetchError}</p>
        <button
          onClick={() => session?.user?.id && fetchProfile(session.user.id)}
          className="px-6 py-3 bg-app-accent text-gray-900 font-semibold rounded-xl"
        >
          Retry
        </button>
      </div>
    );
  }

  if (needsOnboarding && !onboardingLoading) {
    return (
      <Routes>
        <Route path="/onboarding" element={<OnboardingScreen />} />
        <Route path="*" element={<Navigate to="/onboarding" replace />} />
      </Routes>
    );
  }

  if (onboardingLoading) {
    return (
      <div className="min-h-screen bg-app-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/urge" element={<UrgeScreen />} />
        <Route path="/analytics" element={<AnalyticsScreen />} />
        <Route path="/settings" element={<SettingsScreen />} />
        <Route path="/settings/edit-profile" element={<EditProfileScreen />} />
        <Route path="/why" element={<WhyThisWorksScreen />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  if (!hasSupabaseConfig) {
    return <SetupRequired />;
  }
  return <AppContent />;
}
