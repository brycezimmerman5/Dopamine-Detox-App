import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useProfileStore } from '../store/profileStore';
import { useUrgeStore } from '../store/urgeStore';
import { useStreakStore } from '../store/streakStore';
import type { AddictionType, TriggerType } from '../types/database';

const TRIGGER_OPTIONS: { id: TriggerType; label: string }[] = [
  { id: 'boredom', label: 'Boredom' },
  { id: 'stress', label: 'Stress' },
  { id: 'loneliness', label: 'Loneliness' },
  { id: 'social_media', label: 'Social media' },
  { id: 'late_night', label: 'Late night' },
  { id: 'after_meals', label: 'After meals' },
  { id: 'custom', label: 'Other' },
];

const TIMER_DURATION = 90;

type Phase = 'idle' | 'timer' | 'result' | 'trigger';

export function UrgeScreen() {
  const navigate = useNavigate();
  const { session } = useAuthStore();
  const {
    future_self_message = '',
    replacement_activities = [],
    addictions = [],
  } = useProfileStore();
  const { addUrgeSession } = useUrgeStore();

  const [phase, setPhase] = useState<Phase>('idle');
  const [secondsLeft, setSecondsLeft] = useState(TIMER_DURATION);
  const [beatUrge, setBeatUrge] = useState<boolean | null>(null);
  const [trigger, setTrigger] = useState<TriggerType | null>(null);
  const [intensity, setIntensity] = useState<number>(5);
  const [sessionStartedAt, setSessionStartedAt] = useState<string>('');
  const [breathPhase, setBreathPhase] = useState<'in' | 'hold' | 'out'>('in');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const primaryAddiction = (addictions[0] ?? 'custom') as AddictionType;

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (phase !== 'timer') return;
    const cycle = () => {
      setBreathPhase('in');
      setTimeout(() => setBreathPhase('hold'), 4000);
      setTimeout(() => setBreathPhase('out'), 8000);
    };
    cycle();
    const id = setInterval(cycle, 12000);
    return () => clearInterval(id);
  }, [phase]);

  const startTimer = () => {
    setSessionStartedAt(new Date().toISOString());
    setPhase('timer');
    setSecondsLeft(TIMER_DURATION);

    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          timerRef.current = null;
          setPhase('result');
          if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  const handleResult = (beat: boolean) => {
    setBeatUrge(beat);
    setTrigger(null);
    setIntensity(5);
    setPhase('trigger');
  };

  const finish = async () => {
    const userId = session?.user?.id ?? '';
    if (userId) {
      await addUrgeSession({
        user_id: userId,
        addiction_type: primaryAddiction,
        started_at: sessionStartedAt || new Date(Date.now() - TIMER_DURATION * 1000).toISOString(),
        duration_sec: TIMER_DURATION,
        beat_urge: beatUrge ?? false,
        trigger: trigger ?? undefined,
        intensity,
      });
      if (beatUrge === false) {
        await useStreakStore.getState().updateStreakOnRelapse(userId, primaryAddiction);
      }
    }
    navigate('/');
  };

  if (phase === 'idle') {
    return (
      <div className="min-h-screen bg-app-bg p-6 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-50 text-center mb-2">
          The urge will pass.
        </h1>
        <p className="text-gray-400 text-center mb-8">
          Neuroscience shows urges peak within 90 seconds. Breathe through it.
        </p>
        <button
          onClick={startTimer}
          className="w-full max-w-sm bg-app-urge hover:opacity-90 text-white font-bold py-6 rounded-2xl mb-8"
        >
          I HAVE AN URGE
        </button>
        {replacement_activities.length > 0 && (
          <div className="w-full max-w-sm bg-app-surface p-4 rounded-xl">
            <p className="text-sm font-semibold text-gray-400 mb-2">Try instead:</p>
            {replacement_activities.slice(0, 4).map((a, i) => (
              <p key={i} className="text-gray-50 text-sm mb-1">• {a}</p>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (phase === 'timer') {
    return (
      <div className="min-h-screen bg-app-bg p-6 flex flex-col items-center justify-center">
        <div
          className={`w-40 h-40 rounded-full bg-app-accent mb-8 transition-all duration-4000 ${
            breathPhase === 'in' ? 'opacity-100 scale-110' : breathPhase === 'out' ? 'opacity-70 scale-95' : 'opacity-100 scale-110'
          }`}
        />
        <p className="text-5xl font-bold text-gray-50">{secondsLeft}</p>
        <p className="text-gray-400 mt-1">seconds</p>
        {future_self_message && (
          <div className="mt-8 p-4 bg-app-surface rounded-xl max-w-xs">
            <p className="text-xs text-gray-500 mb-2">From your future self:</p>
            <p className="text-gray-50 italic">{future_self_message}</p>
          </div>
        )}
      </div>
    );
  }

  if (phase === 'result') {
    return (
      <div className="min-h-screen bg-app-bg p-6 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-50 mb-2">90 seconds done.</h2>
        <p className="text-gray-400 mb-8">Did you beat the urge?</p>
        <div className="flex gap-4">
          <button
            onClick={() => handleResult(true)}
            className="px-8 py-4 bg-app-accent text-white font-semibold rounded-xl"
          >
            Yes
          </button>
          <button
            onClick={() => handleResult(false)}
            className="px-8 py-4 bg-app-surfaceHover text-white font-semibold rounded-xl"
          >
            No
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'trigger') {
    return (
      <div className="min-h-screen bg-app-bg p-6 pb-12">
        {beatUrge && (
          <div className="flex flex-col items-center mb-4">
            <span className="text-5xl text-app-accent mb-2 animate-scale-in">✓</span>
            <h2 className="text-2xl font-bold text-gray-50 text-center">You did it.</h2>
            <p className="text-app-accent/80 text-center mt-1">One urge at a time.</p>
          </div>
        )}
        {!beatUrge && (
          <h2 className="text-2xl font-bold text-gray-50 text-center mb-2">Reset, not failure.</h2>
        )}
        <p className="text-gray-400 text-center mb-6">What triggered this urge?</p>
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {TRIGGER_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setTrigger(opt.id)}
              className={`px-4 py-2 rounded-lg border-2 transition ${
                trigger === opt.id
                  ? 'border-app-accent text-app-accent font-semibold'
                  : 'border-transparent bg-app-surface text-gray-50'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <p className="text-center text-gray-400 mb-3">Intensity (1-10): {intensity}</p>
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
            <button
              key={n}
              onClick={() => setIntensity(n)}
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm ${
                intensity === n ? 'bg-app-accent text-gray-900 font-semibold' : 'bg-app-surface text-gray-50'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
        <button
          onClick={finish}
          className="block mx-auto px-12 py-4 bg-app-accent text-gray-900 font-semibold rounded-xl"
        >
          Done
        </button>
      </div>
    );
  }

  return null;
}
