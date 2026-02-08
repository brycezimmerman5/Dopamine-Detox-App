import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useProfileStore } from '../store/profileStore';
import { useUrgeStore } from '../store/urgeStore';
import { useStreakStore } from '../store/streakStore';
import { useDopamineStore } from '../store/dopamineStore';
import { RecoveryTree } from '../components/RecoveryTree';
import { WellbeingCheckin } from '../components/WellbeingCheckin';
import { StreakCelebration } from '../components/StreakCelebration';

export function HomeScreen() {
  const { session } = useAuthStore();
  const location = useLocation();
  const { replacement_activities = [] } = useProfileStore();
  const { urgesToday, fetchUrgesToday } = useUrgeStore();
  const { currentStreak, fetchStreak } = useStreakStore();
  const [showWellbeing, setShowWellbeing] = useState(false);
  const {
    dailyScore,
    fetchDailyScore,
    addAction,
    removeAction,
    positiveActions,
    negativeActions,
    actionsToday,
  } = useDopamineStore();

  const userId = session?.user?.id ?? '';

  // Refetch whenever we land on Home (e.g. after completing an urge) so counts stay in sync
  useEffect(() => {
    if (userId && location.pathname === '/') {
      fetchUrgesToday(userId);
      fetchStreak(userId);
      fetchDailyScore(userId);
    }
  }, [userId, location.pathname, fetchUrgesToday, fetchStreak, fetchDailyScore]);

  return (
    <div className="min-h-screen bg-app-bg p-6 pb-12 max-w-lg mx-auto">
      <StreakCelebration currentStreak={currentStreak} />
      <h1 className="text-2xl font-bold text-gray-50 text-center mb-3 flex items-center justify-center gap-2">
        <span className="text-xl opacity-80">🧠</span>
        Dopamine Detox
      </h1>

      <div className="flex justify-center mb-4">
        <span className="bg-app-surface px-4 py-1.5 rounded-full text-app-accent font-semibold text-sm inline-flex items-center gap-1.5">
          <span className={currentStreak >= 7 ? 'animate-pulse' : ''}>
            {currentStreak >= 7 ? '🔥' : '✨'}
          </span>
          Day {currentStreak} of 90
        </span>
      </div>

      <div className="bg-app-surface rounded-2xl p-5 mb-5">
        <RecoveryTree
          currentStreak={currentStreak}
          urgesDefeated={urgesToday + currentStreak * 2}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className="bg-app-surface p-5 rounded-2xl text-center relative overflow-hidden">
          <span className="absolute top-2 right-2 text-2xl opacity-60">🔥</span>
          <p className="text-3xl font-bold text-app-accent">{currentStreak}</p>
          <p className="text-xs text-gray-400 mt-1">Day streak</p>
        </div>
        <div className="bg-app-surface p-5 rounded-2xl text-center relative overflow-hidden">
          <span className="absolute top-2 right-2 text-2xl opacity-60">🛡️</span>
          <p className="text-3xl font-bold text-app-accent">{urgesToday}</p>
          <p className="text-xs text-gray-400 mt-1">Urges defeated today</p>
        </div>
      </div>

      <Link
        to="/analytics"
        className="block bg-app-surface p-5 rounded-2xl mb-6 text-center hover:ring-2 hover:ring-app-accent/30 transition"
      >
        <p className="text-sm text-gray-400 flex items-center justify-center gap-1.5">
          <span className="text-base">📊</span> Daily dopamine score
        </p>
        <p
          className={`text-2xl font-bold mt-1 ${
            dailyScore > 0 ? 'text-green-500' : dailyScore < 0 ? 'text-red-500' : 'text-gray-50'
          }`}
        >
          {dailyScore > 0 ? `+${dailyScore}` : dailyScore}
        </p>
        <p className="text-xs text-gray-500 mt-1">Tap to log + / −</p>
      </Link>

      <div className="bg-app-surface p-4 rounded-xl mb-6">
        <p className="text-sm font-semibold text-gray-400 mb-3">Quick log</p>
        {actionsToday.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-2">Logged today (tap × to remove)</p>
            <div className="flex flex-wrap gap-2">
              {actionsToday.map((a) => (
                <div
                  key={a.id}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-app-surfaceHover"
                >
                  <span className={a.type === 'positive' ? 'text-green-500 font-bold' : 'text-red-500 font-bold'}>
                    {a.type === 'positive' ? '+' : '−'}
                  </span>
                  <span className="text-gray-50 text-sm capitalize">{a.category.replace('_', ' ')}</span>
                  <button
                    type="button"
                    onClick={() => userId && removeAction(userId, a.id)}
                    className="text-gray-400 hover:text-red-500 text-lg leading-none -mr-0.5"
                    aria-label="Remove"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="text-green-500 font-bold text-lg w-6">+</span>
          {positiveActions.slice(0, 4).map((a) => (
            <button
              key={a.id}
              onClick={() => userId && addAction(userId, 'positive', a.id)}
              className="px-3 py-2 bg-green-500/20 rounded-lg text-gray-50 text-sm"
            >
              {a.label.split(' ')[0]}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-red-500 font-bold text-lg w-6">−</span>
          {negativeActions.slice(0, 4).map((a) => (
            <button
              key={a.id}
              onClick={() => userId && addAction(userId, 'negative', a.id)}
              className="px-3 py-2 bg-red-500/20 rounded-lg text-gray-50 text-sm"
            >
              {a.label.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      <Link
        to="/urge"
        className="block w-full bg-app-urge hover:opacity-90 text-white font-bold py-6 rounded-2xl text-center mb-8 transition relative overflow-hidden group"
      >
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl opacity-80 group-hover:scale-110 transition-transform">
          ⚡
        </span>
        I HAVE AN URGE
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl opacity-80 group-hover:scale-110 transition-transform">
          ⚡
        </span>
      </Link>

      <div className="bg-app-surface p-4 rounded-xl mb-6">
        <p className="text-sm font-semibold text-gray-400 mb-3">When urge hits:</p>
        {replacement_activities.length > 0 ? (
          replacement_activities.slice(0, 4).map((a, i) => (
            <p key={i} className="text-gray-50 text-sm mb-1">• {a}</p>
          ))
        ) : (
          <p className="text-gray-500 text-sm">
            <Link to="/settings/edit-profile" className="text-app-accent hover:underline">
              Add replacement activities in Settings
            </Link>
            {' '}so you know what to do instead when urges hit.
          </p>
        )}
      </div>

      <div className="flex flex-col items-center gap-2">
        <button
          onClick={() => setShowWellbeing(true)}
          className="text-gray-400 text-sm hover:text-gray-300"
        >
          Quick check-in
        </button>
        <WellbeingCheckin
          visible={showWellbeing}
          onClose={() => setShowWellbeing(false)}
        />
        <Link to="/why" className="text-app-accent text-sm hover:opacity-80">
          Why this works
        </Link>
        <button
          onClick={() => useAuthStore.getState().signOut()}
          className="text-gray-500 text-sm hover:text-gray-400"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
