import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useWellbeingStore } from '../store/wellbeingStore';

interface WellbeingCheckinProps {
  visible: boolean;
  onClose: () => void;
}

export function WellbeingCheckin({ visible, onClose }: WellbeingCheckinProps) {
  const { session } = useAuthStore();
  const [mentalClarity, setMentalClarity] = useState(3);
  const [mood, setMood] = useState(3);
  const [energy, setEnergy] = useState(3);
  const { addEntry } = useWellbeingStore();

  const handleSave = async () => {
    const userId = session?.user?.id ?? '';
    if (userId) await addEntry(userId, { mentalClarity, mood, energy });
    onClose();
  };

  if (!visible) return null;

  const Slider = ({
    label,
    value,
    onChange,
  }: {
    label: string;
    value: number;
    onChange: (n: number) => void;
  }) => (
    <div className="mb-5">
      <p className="text-gray-50 mb-2">{label}</p>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={`flex-1 py-3 rounded-lg transition ${
              value === n
                ? 'bg-green-500 text-gray-900 font-semibold'
                : 'bg-[#374151] text-gray-50'
            }`}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center p-6 z-50"
      onClick={onClose}
    >
      <div
        className="bg-[#1f2937] rounded-2xl p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-gray-50 mb-2">Quick check-in</h2>
        <p className="text-gray-400 text-sm mb-6">
          How are you feeling? (1 = low, 5 = high)
        </p>
        <Slider
          label="Mental clarity"
          value={mentalClarity}
          onChange={setMentalClarity}
        />
        <Slider label="Mood" value={mood} onChange={setMood} />
        <Slider label="Energy" value={energy} onChange={setEnergy} />
        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3.5 bg-[#374151] text-gray-50 rounded-xl"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 py-3.5 bg-green-500 text-gray-900 font-semibold rounded-xl"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
