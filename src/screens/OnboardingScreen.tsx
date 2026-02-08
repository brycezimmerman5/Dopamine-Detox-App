import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useProfileStore } from '../store/profileStore';
import type { AddictionType } from '../types/database';

const ADDICTION_OPTIONS: { id: AddictionType; label: string }[] = [
  { id: 'nicotine', label: 'Nicotine / Vaping' },
  { id: 'porn', label: 'Porn / Compulsive behavior' },
  { id: 'social_media', label: 'Social media' },
  { id: 'junk_food', label: 'Junk food' },
  { id: 'gaming', label: 'Gaming' },
  { id: 'procrastination', label: 'Procrastination' },
  { id: 'custom', label: 'Custom' },
];

const DEFAULT_REPLACEMENTS = [
  'Walk for 2 minutes',
  'Do 20 pushups',
  'Drink water',
  'Call a friend',
  'Take a cold shower',
  'Write why you started',
];

export function OnboardingScreen() {
  const navigate = useNavigate();
  const { session } = useAuthStore();
  const {
    addictions = [],
    replacement_activities = [],
    future_self_message = '',
    setAddictions,
    setReplacements,
    setFutureSelfMessage,
    updateProfile,
  } = useProfileStore();

  const [step, setStep] = useState(1);
  const [customReplacement, setCustomReplacement] = useState('');
  const [futureSelf, setFutureSelf] = useState(future_self_message);
  const [replacements, setLocalReplacements] = useState<string[]>(
    replacement_activities.length > 0 ? replacement_activities : DEFAULT_REPLACEMENTS
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleAddiction = (id: AddictionType) => {
    if (addictions.includes(id)) {
      setAddictions(addictions.filter((a) => a !== id));
    } else {
      setAddictions([...addictions, id]);
    }
  };

  const addReplacement = () => {
    const trimmed = customReplacement.trim();
    if (trimmed && !replacements.includes(trimmed)) {
      setLocalReplacements([...replacements, trimmed]);
      setCustomReplacement('');
    }
  };

  const removeReplacement = (item: string) => {
    setLocalReplacements(replacements.filter((r) => r !== item));
  };

  const handleComplete = async () => {
    setError('');
    if (addictions.length === 0) {
      setError('Select at least one addiction to work on.');
      return;
    }
    if (replacements.length === 0) {
      setError('Add at least one replacement activity.');
      return;
    }
    if (!futureSelf.trim()) {
      setError('Write a message to your future self.');
      return;
    }

    setIsLoading(true);
    setReplacements(replacements);
    setFutureSelfMessage(futureSelf.trim());

    const { error: err } = await updateProfile({
      user_id: session?.user?.id ?? '',
      addictions,
      replacement_activities: replacements,
      future_self_message: futureSelf.trim(),
    });

    setIsLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    const userId = session?.user?.id;
    if (userId) {
      localStorage.setItem('dopamine-onboarding-complete-' + userId, '1');
    }
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen bg-app-bg p-6 pb-12">
      <h1 className="text-2xl font-bold text-gray-50 text-center mb-2">
        Dopamine Detox
      </h1>
      <p className="text-gray-500 text-center mb-6">Step {step} of 3</p>

      {step === 1 && (
        <>
          <h2 className="text-xl font-semibold text-gray-50 mb-2">What do you want to quit?</h2>
          <p className="text-gray-400 mb-5">Select all that apply</p>
          <div className="space-y-3 mb-6">
            {ADDICTION_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => toggleAddiction(opt.id)}
                className={`w-full p-4 rounded-xl text-left border-2 transition ${
                  addictions.includes(opt.id)
                    ? 'bg-[#1f2937] border-green-500 text-green-500 font-semibold'
                    : 'bg-[#1f2937] border-transparent text-gray-50'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setStep(2)}
            disabled={addictions.length === 0}
            className="w-full bg-green-500 text-gray-900 font-semibold py-4 rounded-xl disabled:opacity-50"
          >
            Next
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <h2 className="text-xl font-semibold text-gray-50 mb-2">Replacement activities</h2>
          <p className="text-gray-400 mb-5">When an urge hits, what will you do instead?</p>
          <div className="space-y-2 mb-4">
            {replacements.map((item) => (
              <div
                key={item}
                className="flex justify-between items-center p-3 bg-[#1f2937] rounded-lg"
              >
                <span className="text-gray-50">• {item}</span>
                <button
                  type="button"
                  onClick={() => removeReplacement(item)}
                  className="text-red-500 text-sm hover:text-red-400"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-3 mb-6">
            <input
              type="text"
              placeholder="Add activity..."
              value={customReplacement}
              onChange={(e) => setCustomReplacement(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addReplacement()}
              className="flex-1 bg-[#1f2937] rounded-xl px-4 py-3 text-gray-50 placeholder-gray-500 border-0 outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              type="button"
              onClick={addReplacement}
              className="bg-green-500 px-5 rounded-xl font-semibold text-gray-900"
            >
              Add
            </button>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 bg-[#374151] text-gray-50 font-semibold py-4 rounded-xl"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              disabled={replacements.length === 0}
              className="flex-1 bg-green-500 text-gray-900 font-semibold py-4 rounded-xl disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <h2 className="text-xl font-semibold text-gray-50 mb-2">Message to your future self</h2>
          <p className="text-gray-400 mb-5">Why do you want to quit? You'll see this when urges hit.</p>
          <textarea
            placeholder="e.g. I want to feel in control. I deserve better. My future self will thank me."
            value={futureSelf}
            onChange={(e) => setFutureSelf(e.target.value)}
            rows={5}
            className="w-full bg-[#1f2937] rounded-xl px-4 py-3 text-gray-50 placeholder-gray-500 border-0 outline-none focus:ring-2 focus:ring-green-500 mb-6 resize-none"
          />
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="flex-1 bg-[#374151] text-gray-50 font-semibold py-4 rounded-xl"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleComplete}
              disabled={isLoading}
              className="flex-1 bg-green-500 text-gray-900 font-semibold py-4 rounded-xl disabled:opacity-70"
            >
              {isLoading ? 'Saving...' : 'Complete'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
