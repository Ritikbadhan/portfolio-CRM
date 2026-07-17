import { useState, useCallback, useEffect } from 'react';

export const useUnsavedChanges = (isDirty: boolean) => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [nextAction, setNextAction] = useState<(() => void) | null>(null);

  // Handle browser close/reload
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // Handle intra-app navigation/tab clicks
  const checkUnsaved = useCallback(
    (action: () => void) => {
      if (isDirty) {
        setNextAction(() => action);
        setShowPrompt(true);
      } else {
        action();
      }
    },
    [isDirty]
  );

  const confirmNavigation = useCallback(() => {
    setShowPrompt(false);
    if (nextAction) {
      nextAction();
      setNextAction(null);
    }
  }, [nextAction]);

  const cancelNavigation = useCallback(() => {
    setShowPrompt(false);
    setNextAction(null);
  }, []);

  return {
    showPrompt,
    checkUnsaved,
    confirmNavigation,
    cancelNavigation,
  };
};
