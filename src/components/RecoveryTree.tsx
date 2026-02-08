
const STAGES = [
  { minScore: 0, label: 'Seed', symbol: '🌱' },
  { minScore: 5, label: 'Sprout', symbol: '🌿' },
  { minScore: 15, label: 'Growing', symbol: '🪴' },
  { minScore: 30, label: 'Strong', symbol: '🌳' },
  { minScore: 60, label: 'Thriving', symbol: '🌲' },
];

function getStage(score: number) {
  let stage = STAGES[0];
  for (const s of STAGES) {
    if (score >= s.minScore) stage = s;
  }
  return stage;
}

interface RecoveryTreeProps {
  currentStreak: number;
  urgesDefeated: number;
  compact?: boolean;
}

export function RecoveryTree({
  currentStreak,
  urgesDefeated,
  compact = false,
}: RecoveryTreeProps) {
  const score = currentStreak * 2 + Math.min(urgesDefeated, 20);
  const stage = getStage(score);

  return (
    <div className={`flex flex-col items-center ${compact ? 'py-3' : 'py-5'}`}>
      <span className={`${compact ? 'text-4xl mb-1' : 'text-6xl mb-2'}`}>
        {stage.symbol}
      </span>
      <p className={`font-semibold text-app-accent ${compact ? 'text-sm' : 'text-lg'}`}>
        {stage.label}
      </p>
      {!compact && (
        <p className="text-xs text-gray-500 mt-1">Keep going to watch it grow</p>
      )}
    </div>
  );
}
