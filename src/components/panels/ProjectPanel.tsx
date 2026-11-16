'use client';

import { useCallback, useState } from 'react';
import { PiImages, PiPlayFill } from 'react-icons/pi';

import ImageGalleryModal from '@/components/ui/ImageGalleryModal';
import VideoModal from '@/components/ui/VideoModal';
import { projects } from '@/data/projects';

import PanelShell from './PanelShell';

interface ProjectPanelProps {
  index: number;
}

export default function ProjectPanel({ index }: ProjectPanelProps): React.JSX.Element | null {
  const [isMediaOpen, setIsMediaOpen] = useState(false);
  const closeMedia = useCallback((): void => setIsMediaOpen(false), []);
  const project = projects[index];
  if (!project) return null;

  const code = `03 // P.${String(index + 1).padStart(2, '0')} OF ${String(projects.length).padStart(2, '0')}`;
  const isVideo = Boolean(project.videoUrl);
  const actionLabel = isVideo ? 'Play demo' : `View gallery (${project.images?.length ?? 0})`;

  return (
    <PanelShell code={code} title={project.title}>
      <div className="grid gap-7 md:grid-cols-[minmax(0,5fr)_minmax(0,4fr)] md:items-start">
        <button
          type="button"
          onClick={() => setIsMediaOpen(true)}
          aria-label={`${actionLabel}: ${project.title}`}
          className="hive-chip group relative block w-full border border-hive-line bg-black"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.thumbnail}
            alt=""
            className="aspect-[4/3] w-full object-cover opacity-80 transition-opacity duration-300 group-hover:opacity-100"
          />
          <span className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-hive-bg/35 transition-colors group-hover:bg-transparent">
            <span className="hex-clip flex h-[4.5rem] w-16 items-center justify-center bg-hive-cyan text-2xl text-hive-bg transition-colors group-hover:bg-hive-ice">
              {isVideo ? <PiPlayFill /> : <PiImages />}
            </span>
            <span className="bg-hive-bg/80 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.25em] text-hive-ice">
              {actionLabel}
            </span>
          </span>
        </button>

        <div>
          <p className="font-mono text-sm uppercase tracking-[0.25em] text-hive-cyan">{project.company}</p>
          <p className="mt-4 font-light leading-relaxed">{project.description}</p>
        </div>
      </div>

      <VideoModal videoUrl={isMediaOpen && project.videoUrl ? project.videoUrl : null} onClose={closeMedia} />
      <ImageGalleryModal
        images={isMediaOpen && !isVideo && project.images ? project.images : null}
        onClose={closeMedia}
      />
    </PanelShell>
  );
}
