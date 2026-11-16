'use client';

import { useEffect } from 'react';

import { setHiveState } from '@/stores/useHiveStore';

/** While a modal is open: pause hive navigation input and close the modal on Escape. */
export function useModalLock(isOpen: boolean, onClose: () => void): void {
  useEffect(() => {
    if (!isOpen) return undefined;
    setHiveState({ modalOpen: true });
    const handleKey = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return (): void => {
      window.removeEventListener('keydown', handleKey);
      setHiveState({ modalOpen: false });
    };
  }, [isOpen, onClose]);
}
