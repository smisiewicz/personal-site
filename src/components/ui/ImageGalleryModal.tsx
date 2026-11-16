'use client';

import { useState } from 'react';
import { PiArrowLeft, PiArrowRight } from 'react-icons/pi';

import ModalBackdrop, { MODAL_BUTTON_CLASS } from './ModalBackdrop';

interface ImageGalleryModalProps {
  images: ReadonlyArray<string> | null;
  onClose: () => void;
}

export default function ImageGalleryModal({ images, onClose }: ImageGalleryModalProps): React.JSX.Element | null {
  const [currentIndex, setCurrentIndex] = useState(0);
  const count = images?.length ?? 0;

  const move = (event: React.MouseEvent, delta: number): void => {
    event.stopPropagation();
    if (count > 0) setCurrentIndex((previous) => (previous + delta + count) % count);
  };

  return (
    <ModalBackdrop isOpen={images !== null} label="Image gallery" onClose={onClose}>
      <button
        type="button"
        aria-label="Previous image"
        className={`${MODAL_BUTTON_CLASS} left-4 top-1/2 -translate-y-1/2`}
        onClick={(event) => move(event, -1)}
      >
        <PiArrowLeft />
      </button>
      <button
        type="button"
        aria-label="Next image"
        className={`${MODAL_BUTTON_CLASS} right-4 top-1/2 -translate-y-1/2`}
        onClick={(event) => move(event, 1)}
      >
        <PiArrowRight />
      </button>

      {images && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[currentIndex]}
            alt={`Screenshot ${currentIndex + 1} of ${count}`}
            className="max-h-[85vh] max-w-[90%] object-contain"
            onClick={(event) => event.stopPropagation()}
          />
          <p className="absolute bottom-5 font-mono text-xs tracking-[0.3em] text-hive-muted">
            {String(currentIndex + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
          </p>
        </>
      )}
    </ModalBackdrop>
  );
}
