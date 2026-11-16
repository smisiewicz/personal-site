'use client';

import { useEffect, useId, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { PiArrowLeft, PiArrowRight, PiX } from 'react-icons/pi';

import { Copyright } from '@/components/hud/HudStatusBar';
import { useTypewriter } from '@/hooks/useTypewriter';
import { focusLabel, stepFocus } from '@/lib/hive/nav';
import { navigateStep, navigateUp } from '@/lib/hive/navigate';
import { useHiveState } from '@/stores/useHiveStore';

interface PanelShellProps {
  /** Small identifier above the title, e.g. "02 // E.03". */
  code: string;
  title: string;
  children: React.ReactNode;
}

/** The camera needs a moment to fly into the cell before the panel appears on top of it. */
const ENTER_DELAY_S = 0.34;
const STEP_BUTTON_CLASS =
  'flex min-h-11 min-w-0 items-center gap-2 px-2 font-mono text-[11px] uppercase tracking-[0.18em] text-hive-muted transition-colors hover:text-hive-ice';

/** Chamfered HUD frame shared by every content panel: header, scrolling body, previous/next footer. */
export default function PanelShell({ code, title, children }: PanelShellProps): React.JSX.Element {
  const focus = useHiveState((state) => state.focus);
  const reducedMotion = useReducedMotion();
  const headingId = useId();
  const sectionRef = useRef<HTMLElement>(null);
  const typedTitle = useTypewriter(title, ENTER_DELAY_S * 1000);

  const previous = stepFocus(focus, -1);
  const next = stepFocus(focus, 1);

  useEffect(() => {
    sectionRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-20 flex items-center justify-center px-3 pb-20 pt-[4.5rem] md:px-16 lg:pb-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: reducedMotion ? 0 : ENTER_DELAY_S, duration: 0.25 } }}
      exit={{ opacity: 0, transition: { duration: 0.12 } }}
      onClick={navigateUp}
    >
      <motion.section
        ref={sectionRef}
        tabIndex={-1}
        aria-labelledby={headingId}
        className="hive-panel flex max-h-full w-full max-w-4xl outline-none"
        initial={reducedMotion ? false : { scale: 0.94, y: 14 }}
        animate={{ scale: 1, y: 0, transition: { delay: ENTER_DELAY_S, duration: 0.35, ease: [0.2, 0.8, 0.2, 1] } }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="hive-panel-surface flex min-h-0 w-full flex-col">
          <header className="flex items-start justify-between gap-4 border-b border-hive-line px-5 pb-4 pt-5 md:px-9 md:pt-7">
            <div className="min-w-0">
              <p className="font-mono text-xs tracking-[0.3em] text-hive-cyan">{code}</p>
              <h2
                id={headingId}
                aria-label={title}
                className="glow-text mt-1 min-h-[1.3em] font-display text-xl font-bold uppercase tracking-[0.14em] text-hive-ice md:text-3xl"
              >
                {typedTitle}
                <span aria-hidden="true" className="hud-blink ml-1 text-hive-accent">
                  _
                </span>
              </h2>
            </div>
            <button
              type="button"
              onClick={navigateUp}
              aria-label="Close and zoom out"
              className="hive-chip flex h-11 w-11 shrink-0 items-center justify-center border border-hive-line text-xl text-hive-cyan transition-colors hover:bg-hive-cyan hover:text-hive-bg"
            >
              <PiX />
            </button>
          </header>

          <div data-panel-scroll className="hive-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-6 md:px-9 md:py-8">
            {children}
            <Copyright className="mt-10 lg:hidden" />
          </div>

          <footer className="flex items-center justify-between gap-3 border-t border-hive-line px-3 md:px-7">
            <button type="button" onClick={() => navigateStep(-1)} className={STEP_BUTTON_CLASS}>
              <PiArrowLeft className="shrink-0 text-base text-hive-cyan" />
              <span className="truncate">{focusLabel(previous)}</span>
            </button>
            {next !== focus && (
              <button type="button" onClick={() => navigateStep(1)} className={STEP_BUTTON_CLASS}>
                <span className="truncate">{focusLabel(next)}</span>
                <PiArrowRight className="shrink-0 text-base text-hive-cyan" />
              </button>
            )}
          </footer>
        </div>
      </motion.section>
    </motion.div>
  );
}
