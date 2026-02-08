import { useEffect, useState } from 'react';

const MILESTONES = [7, 14, 30, 90];
const STORAGE_KEY = 'dopamine-streak-celebrated';

function getCelebrated(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function markCelebrated(streak: number) {
  const prev = getCelebrated();
  if (!prev.includes(streak)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...prev, streak]));
  }
}

interface StreakCelebrationProps {
  currentStreak: number;
}

export function StreakCelebration({ currentStreak }: StreakCelebrationProps) {
  const [show, setShow] = useState(false);
  const [milestone, setMilestone] = useState<number | null>(null);

  useEffect(() => {
    if (currentStreak < 1) return;
    const celebrated = getCelebrated();
    const hit = MILESTONES.find((m) => m === currentStreak && !celebrated.includes(m));
    if (hit) {
      setMilestone(hit);
      setShow(true);
      markCelebrated(hit);
    }
  }, [currentStreak]);

  if (!show || milestone === null) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60"
      onClick={() => setShow(false)}
    >
      <div
        className="bg-app-surface rounded-2xl p-8 max-w-sm text-center border-2 border-app-accent/50"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="text-5xl block mb-3">🎉</span>
        <h3 className="text-xl font-bold text-gray-50 mb-1">
          {milestone}-day streak!
        </h3>
        <p className="text-gray-400 text-sm mb-6">Keep going. You've got this.</p>
        <button
          onClick={() => setShow(false)}
          className="w-full py-3 bg-app-accent text-gray-900 font-semibold rounded-xl"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
