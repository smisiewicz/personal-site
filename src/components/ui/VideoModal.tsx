'use client';

import { motion } from 'framer-motion';

import ModalBackdrop from './ModalBackdrop';

interface VideoModalProps {
  videoUrl: string | null;
  onClose: () => void;
}

export default function VideoModal({ videoUrl, onClose }: VideoModalProps): React.JSX.Element | null {
  return (
    <ModalBackdrop isOpen={videoUrl !== null} label="Video player" onClose={onClose}>
      <motion.div
        className="relative aspect-video w-[90%] max-w-[1200px] overflow-hidden border border-hive-line bg-black"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={(event) => event.stopPropagation()}
      >
        <iframe
          className="absolute left-0 top-0 h-full w-full"
          src={`${videoUrl}?autoplay=1`}
          allow="autoplay; encrypted-media"
          allowFullScreen
          title="Video Player"
        />
      </motion.div>
    </ModalBackdrop>
  );
}
