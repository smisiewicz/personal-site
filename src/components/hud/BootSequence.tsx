'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { experiences } from '@/data/experiences';
import { projects } from '@/data/projects';
import { playSound } from '@/lib/sound';
import { setHiveState, useHiveState } from '@/stores/useHiveStore';

const pad = (value: number): string => String(value).padStart(2, '0');

const LINES: ReadonlyArray<string> = [
  'SM-OS // KERNEL LINK ESTABLISHED',
  'LOADING IDENTITY MATRIX',
  `MAPPING EXPERIENCE NODES [${pad(experiences.length)}]`,
  `INDEXING PROJECT MODULES [${pad(projects.length)}]`,
  'OPENING COMM CHANNEL',
  'RENDERING HIVE GRID',
];

const LINE_INTERVAL_MS = 300;
const SESSION_KEY = 'hive-booted';

function finishBoot(): void {
  try {
    window.sessionStorage.setItem(SESSION_KEY, '1');
  } catch {
    // Without session storage the intro simply plays again next visit.
  }
  setHiveState({ booted: true });
}

/** Short "system start-up" overlay. Plays once per browser session and can be skipped with any input. */
export default function BootSequence(): React.JSX.Element {
  const booted = useHiveState((state) => state.booted);
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    let alreadySeen = false;
    try {
      alreadySeen = window.sessionStorage.getItem(SESSION_KEY) === '1';
    } catch {
      alreadySeen = false;
    }
    if (alreadySeen || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setHiveState({ booted: true });
      return undefined;
    }

    playSound('boot');
    let shown = 0;
    const timer = window.setInterval(() => {
      shown += 1;
      setVisibleLines(Math.min(shown, LINES.length));
      // One extra tick so the last line is readable before the overlay fades.
      if (shown > LINES.length) {
        window.clearInterval(timer);
        finishBoot();
      }
    }, LINE_INTERVAL_MS);

    window.addEventListener('keydown', finishBoot);
    return (): void => {
      window.clearInterval(timer);
      window.removeEventListener('keydown', finishBoot);
    };
  }, []);

  return (
    <AnimatePresence>
      {!booted && (
        <motion.div
          className="fixed inset-0 z-50 flex cursor-pointer items-center justify-center bg-hive-bg/45 px-6"
          exit={{ opacity: 0, transition: { duration: 0.45 } }}
          onClick={finishBoot}
        >
          <div className="hive-panel w-full max-w-lg">
            <div className="hive-panel-surface px-6 py-7 font-mono text-xs uppercase tracking-[0.18em] text-hive-cyan sm:px-8 sm:text-sm">
            <ul aria-hidden="true" className="min-h-40 space-y-1.5">
              {LINES.slice(0, visibleLines).map((line, i) => (
                <li key={line} className="flex justify-between gap-4">
                  <span className="text-hive-text">
                    <span className="text-hive-cyan">&gt;</span> {line}
                  </span>
                  <span className="text-hive-ice">{i < visibleLines - 1 || visibleLines === LINES.length ? 'OK' : '..'}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 h-1 w-full bg-hive-cyan/15">
              <div
                className="h-full bg-hive-cyan transition-[width] duration-300 ease-linear"
                style={{ width: `${(visibleLines / LINES.length) * 100}%` }}
              />
            </div>
            <p role="status" className="mt-4 text-center text-[10px] tracking-[0.3em] text-hive-muted">
              Initialising — click or press any key to skip
            </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
