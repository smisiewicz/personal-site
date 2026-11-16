'use client';

import { experiences } from '@/data/experiences';

import PanelShell from './PanelShell';

interface ExperiencePanelProps {
  index: number;
}

export default function ExperiencePanel({ index }: ExperiencePanelProps): React.JSX.Element | null {
  const entry = experiences[index];
  if (!entry) return null;
  const code = `02 // E.${String(index + 1).padStart(2, '0')} OF ${String(experiences.length).padStart(2, '0')}`;

  return (
    <PanelShell code={code} title={entry.company}>
      <p className="font-mono text-sm uppercase tracking-[0.25em] text-hive-cyan">{entry.date}</p>
      <p className="mt-2 text-xl font-semibold text-hive-ice md:text-2xl">{entry.title}</p>

      {entry.description && <p className="mt-5 font-light leading-relaxed">{entry.description}</p>}

      {entry.highlights && (
        <ul className="mt-6 space-y-3">
          {entry.highlights.map((highlight) => (
            <li key={highlight} className="flex gap-3 font-light leading-relaxed">
              <span aria-hidden="true" className="hex-clip mt-2 h-2.5 w-2 shrink-0 bg-hive-cyan" />
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      )}
    </PanelShell>
  );
}
