'use client';

import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { PiX } from 'react-icons/pi';

import { useModalLock } from '@/hooks/useModalLock';

interface ModalBackdropProps {
  isOpen: boolean;
  label: string;
  onClose: () => void;
  children: React.ReactNode;
}

export const MODAL_BUTTON_CLASS =
  'hive-chip absolute z-10 flex h-12 w-12 items-center justify-center border border-hive-line bg-hive-bg/80 text-2xl text-hive-cyan transition-colors hover:bg-hive-cyan hover:text-hive-bg';

/**
 * Full-screen dialog layer. Portalled to <body> because content panels are transformed and clipped,
 * which would otherwise trap a fixed-position child inside the panel.
 */
export default function ModalBackdrop({ isOpen, label, onClose, children }: ModalBackdropProps): React.JSX.Element | null {
  useModalLock(isOpen, onClose);
  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={label}
          className="fixed inset-0 z-50 flex items-center justify-center bg-hive-bg/85 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(event) => {
            event.stopPropagation();
            onClose();
          }}
        >
          <button
            type="button"
            autoFocus
            aria-label="Close"
            className={`${MODAL_BUTTON_CLASS} right-4 top-4`}
            onClick={onClose}
          >
            <PiX />
          </button>
          {children}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
