'use client';

import { useEffect, useState } from 'react';
import { PiDownloadSimple, PiSpeakerHigh, PiSpeakerSlash } from 'react-icons/pi';

import { personalInfo, resumePath } from '@/data/personal';
import { focusLabel, ROOT_FOCUS } from '@/lib/hive/nav';
import { navigate } from '@/lib/hive/navigate';
import { playSound, readSoundPreference, setSoundEnabled } from '@/lib/sound';
import { setHiveState, useHiveState } from '@/stores/useHiveStore';
import type { Focus } from '@/types';

const CONTROL_CLASS =
  'hive-chip flex h-9 items-center gap-2 border border-hive-line bg-hive-panel/80 px-3 font-mono text-[11px] uppercase tracking-[0.2em] text-hive-cyan transition-colors hover:bg-hive-cyan hover:text-hive-bg';

function Clock(): React.JSX.Element | null {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return (): void => window.clearInterval(timer);
  }, []);

  // Rendered only after mount: the server cannot know the visitor's local time.
  if (!now) return null;
  return (
    <span aria-hidden="true" className="hidden font-mono text-xs tracking-[0.2em] text-hive-muted lg:block">
      {now.toLocaleTimeString('en-GB')} <span className="hud-blink text-hive-cyan">●</span> LIVE
    </span>
  );
}

function Breadcrumb({ focus }: { focus: Focus }): React.JSX.Element {
  const trail: Focus[] = [ROOT_FOCUS];
  if (focus.section !== null) trail.push({ section: focus.section, item: null });
  if (focus.item !== null) trail.push(focus);

  return (
    <nav aria-label="Breadcrumb" className="hidden min-w-0 md:block">
      <ol className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em]">
        {trail.map((stop, i) => {
          const isCurrent = i === trail.length - 1;
          return (
            <li key={focusLabel(stop)} className="flex min-w-0 items-center gap-2">
              {i > 0 && <span className="text-hive-muted">/</span>}
              <button
                type="button"
                aria-current={isCurrent ? 'page' : undefined}
                onClick={() => navigate(stop)}
                className={`truncate transition-colors hover:text-hive-ice ${isCurrent ? 'text-hive-ice' : 'text-hive-muted'}`}
              >
                {i === 0 ? 'Hive' : focusLabel(stop)}
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default function HudTopBar(): React.JSX.Element {
  const focus = useHiveState((state) => state.focus);
  const soundOn = useHiveState((state) => state.soundOn);
  const [firstName, ...lastNames] = personalInfo.name.split(' ');

  useEffect(() => {
    if (readSoundPreference()) {
      setSoundEnabled(true);
      setHiveState({ soundOn: true });
    }
  }, []);

  const toggleSound = (): void => {
    const next = !soundOn;
    setSoundEnabled(next);
    setHiveState({ soundOn: next });
    if (next) playSound('select');
  };

  return (
    <header className="hud-enter hud-enter-top hud-bar fixed inset-x-0 top-0 z-30 flex h-16 items-start gap-4 px-4 pt-3 md:gap-6 md:px-7">
      <button
        type="button"
        onClick={() => navigate(ROOT_FOCUS)}
        aria-label={`${personalInfo.name}, ${personalInfo.title} — back to overview`}
        className="group flex shrink-0 items-center gap-3 text-left"
      >
        <span className="hex-clip flex h-9 w-8 items-center justify-center bg-hive-cyan font-display text-[11px] font-black text-hive-bg transition-colors group-hover:bg-hive-ice">
          SM
        </span>
        <span className="leading-tight">
          <span className="block font-display text-xs font-bold tracking-[0.22em] text-hive-ice sm:text-sm">
            <span className="max-sm:hidden">{firstName.toUpperCase()} </span>
            <span className="sm:hidden">{firstName.charAt(0)}. </span>
            {lastNames.join(' ').toUpperCase()}
          </span>
          <span className="block font-mono text-[10px] tracking-[0.3em] text-hive-cyan">
            {personalInfo.title.toUpperCase()}
          </span>
        </span>
      </button>

      <div className="flex h-9 min-w-0 items-center border-l border-hive-line pl-4 max-md:hidden">
        <Breadcrumb focus={focus} />
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-2 md:gap-4">
        <Clock />
        <button
          type="button"
          onClick={toggleSound}
          aria-pressed={soundOn}
          aria-label="Interface sound effects"
          className={CONTROL_CLASS}
        >
          {soundOn ? <PiSpeakerHigh className="text-base" /> : <PiSpeakerSlash className="text-base" />}
          <span className="max-sm:hidden">{soundOn ? 'Sound on' : 'Sound off'}</span>
        </button>
        <a href={resumePath} download="sebastian-misiewicz-resume.pdf" className={CONTROL_CLASS}>
          <PiDownloadSimple className="text-base" />
          Resume
        </a>
      </div>
    </header>
  );
}
