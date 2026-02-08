import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useDopamineStore } from '../store/dopamineStore';
import { EmptyState } from '../components/EmptyState';
import { supabase } from '../lib/supabase';

export function AnalyticsScreen() {
  const { session } = useAuthStore();
  const { dailyScore, actionsToday, fetchDailyScore, removeAction } = useDopamineStore();
  const userId = session?.user?.id ?? '';

  const [urgeHistory, setUrgeHistory] = useState<{ date: string; count: number }[]>([]);
  const [triggerCounts, setTriggerCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    if (userId) {
      fetchDailyScore(userId);
      (async () => {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const { data } = await supabase
          .from('urge_sessions')
          .select('started_at, beat_urge, trigger')
          .eq('user_id', userId)
          .gte('started_at', sevenDaysAgo.toISOString());

        if (data) {
          const byDate: Record<string, number> = {};
          const triggers: Record<string, number> = {};
          data.forEach((r) => {
            const d = r.started_at.split('T')[0];
            byDate[d] = (byDate[d] ?? 0) + (r.beat_urge ? 1 : 0);
            if (r.trigger) {
              triggers[r.trigger] = (triggers[r.trigger] ?? 0) + 1;
            }
          });
          setUrgeHistory(
            Object.entries(byDate)
              .map(([date, count]) => ({ date, count }))
              .sort((a, b) => a.date.localeCompare(b.date))
              .slice(-7)
          );
          setTriggerCounts(triggers);
        }
      })();
    }
  }, [userId, fetchDailyScore]);

  const maxUrges = Math.max(1, ...urgeHistory.map((u) => u.count));

  return (
    <div className="min-h-screen bg-app-bg p-6 pb-12 max-w-lg mx-auto">
      <Link to="/" className="text-gray-400 text-sm mb-6 inline-block hover:text-gray-300">
        ← Back
      </Link>
      <h1 className="text-2xl font-bold text-gray-50 mb-6">Analytics</h1>

      <div className="bg-app-surface p-5 rounded-2xl mb-5">
        <p className="text-sm font-semibold text-gray-400 mb-2">Daily dopamine score</p>
        <p
          className={`text-3xl font-bold ${
            dailyScore > 0 ? 'text-green-500' : dailyScore < 0 ? 'text-red-500' : 'text-gray-50'
          }`}
        >
          {dailyScore > 0 ? `+${dailyScore}` : dailyScore}
        </p>
      </div>

      <div className="bg-app-surface p-5 rounded-2xl mb-5">
        <p className="text-sm font-semibold text-gray-400 mb-4">Urges defeated (last 7 days)</p>
        {urgeHistory.length === 0 ? (
          <EmptyState
            icon="🌱"
            title="No urges tracked yet"
            message="Beat your first urge to see your progress here. You've got this."
            ctaText="I HAVE AN URGE"
            ctaTo="/urge"
            compact
          />
        ) : (
          <div className="space-y-3">
            {urgeHistory.map(({ date, count }) => (
              <div key={date} className="flex items-center gap-3">
                <span className="text-gray-400 text-sm w-10">{date.slice(5)}</span>
                <div className="flex-1 h-5 bg-app-surfaceHover rounded overflow-hidden">
                  <div
                    className="h-full bg-app-accent rounded transition-all"
                    style={{ width: `${(count / maxUrges) * 100}%` }}
                  />
                </div>
                <span className="text-gray-50 text-sm w-6 text-right">{count}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-app-surface p-5 rounded-2xl mb-5">
        <p className="text-sm font-semibold text-gray-400 mb-4">Top triggers</p>
        {Object.keys(triggerCounts).length === 0 ? (
          <p className="text-gray-500">No trigger data yet</p>
        ) : (
          <div className="space-y-2">
            {Object.entries(triggerCounts)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 5)
              .map(([t, count]) => (
                <div key={t} className="flex justify-between py-1">
                  <span className="text-gray-50 capitalize">{t.replace('_', ' ')}</span>
                  <span className="text-app-accent font-semibold">{count}</span>
                </div>
              ))}
          </div>
        )}
      </div>

      <div className="bg-app-surface p-5 rounded-2xl">
        <p className="text-sm font-semibold text-gray-400 mb-4">Today's actions</p>
        {actionsToday.length === 0 ? (
          <p className="text-gray-500 py-2">
            None logged. Tap the + / − buttons on Home to track your daily dopamine balance.
          </p>
        ) : (
          <div className="space-y-2">
            {actionsToday.map((a) => (
              <div key={a.id} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={a.type === 'positive' ? 'text-green-500 font-bold' : 'text-red-500 font-bold'}>
                    {a.type === 'positive' ? '+' : '−'}
                  </span>
                  <span className="text-gray-50 capitalize">{a.category.replace('_', ' ')}</span>
                </div>
                <button
                  type="button"
                  onClick={() => userId && removeAction(userId, a.id)}
                  className="text-gray-400 hover:text-red-500 text-sm"
                  aria-label="Remove"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
