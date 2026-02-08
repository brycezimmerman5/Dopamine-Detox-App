import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useProfileStore } from '../store/profileStore';

const ONBOARDING_KEY_PREFIX = 'dopamine-onboarding-complete-';

export function useOnboardingCheck(): {
  needsOnboarding: boolean;
  isLoading: boolean;
  fetchError: string | null;
} {
  const { session } = useAuthStore();
  const { fetchProfile, addictions, future_self_message, fetchError } = useProfileStore();
  const [checkDone, setCheckDone] = useState(false);

  const userId = session?.user?.id;

  useEffect(() => {
    if (!userId) {
      setCheckDone(true);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        await fetchProfile(userId);
      } finally {
        if (!cancelled) setCheckDone(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  // If localStorage says onboarding is complete for this user, skip regardless of Supabase
  const hasLocalCompletion =
    !!userId &&
    typeof localStorage !== 'undefined' &&
    !!localStorage.getItem(ONBOARDING_KEY_PREFIX + userId);

  const needsOnboarding =
    !hasLocalCompletion &&
    checkDone &&
    (!addictions?.length || !future_self_message?.trim());

  return {
    needsOnboarding: !!needsOnboarding,
    isLoading: !checkDone,
    fetchError: !hasLocalCompletion ? fetchError : null,
  };
}
