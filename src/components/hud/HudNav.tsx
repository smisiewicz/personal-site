'use client';

import { SECTIONS } from '@/lib/constants';
import { hasPanel, isHub, itemCount, itemLabel, ROOT_FOCUS, sameFocus } from '@/lib/hive/nav';
import { navigate } from '@/lib/hive/navigate';
import { useHiveState } from '@/stores/useHiveStore';
import type { Focus } from '@/types';

interface NavEntry {
  code: string;
  label: string;
  short: string;
  target: Focus;
}

const ENTRIES: ReadonlyArray<NavEntry> = [
  { code: '00', label: 'Overview', short: 'Hive', target: ROOT_FOCUS },
  ...SECTIONS.map((section) => ({
    code: section.code,
    label: section.label,
    short: section.label.length > 8 ? `${section.label.slice(0, 4)}.` : section.label,
    target: { section: section.id, item: null },
  })),
];

function isActive(entry: NavEntry, focus: Focus): boolean {
  return entry.target.section === focus.section;
}

/** Side index on desktop, tab bar on phones. Also the keyboard and screen-reader route to every cell. */
export default function HudNav(): React.JSX.Element {
  const focus = useHiveState((state) => state.focus);
  const compact = hasPanel(focus);

  return (
    <>
      <nav
        aria-label="Sections"
        className="hive-chip fixed left-4 top-1/2 z-30 -translate-y-1/2 bg-hive-bg/75 py-3 pl-3 pr-2 backdrop-blur-sm max-lg:sr-only lg:left-5"
      >
        <ul className="space-y-1 border-l border-hive-line">
          {ENTRIES.map((entry) => {
            const active = isActive(entry, focus);
            const section = entry.target.section;
            return (
              <li key={entry.code}>
                <button
                  type="button"
                  aria-current={active && focus.item === null ? 'page' : undefined}
                  onClick={() => navigate(entry.target)}
                  className={`group -ml-px flex items-center gap-3 border-l-2 py-1.5 pl-3 pr-2 font-mono text-xs uppercase tracking-[0.22em] transition-colors hover:text-hive-ice ${
                    active ? 'border-hive-accent text-hive-ice' : 'border-transparent text-hive-muted'
                  }`}
                >
                  <span className={active ? 'glow-accent text-hive-accent' : ''}>{entry.code}</span>
                  <span className={compact ? 'sr-only group-hover:not-sr-only group-focus-visible:not-sr-only' : ''}>
                    {entry.label}
                  </span>
                </button>

                {active && isHub(section) && !compact && (
                  <ul className="mb-2 ml-9 space-y-0.5">
                    {Array.from({ length: itemCount(section) }, (_, item) => (
                      <li key={item}>
                        <button
                          type="button"
                          onClick={() => navigate({ section, item })}
                          className="block max-w-40 truncate py-0.5 text-left font-mono text-[11px] uppercase tracking-[0.12em] text-hive-muted transition-colors hover:text-hive-accent"
                        >
                          {itemLabel(section, item)}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Phones: same destinations as a tab bar. Hidden from assistive tech because the list above covers it. */}
      <div
        aria-hidden="true"
        className="hud-bar-bottom fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-4 lg:hidden"
      >
        {ENTRIES.map((entry) => {
          const active = isActive(entry, focus);
          return (
            <button
              key={entry.code}
              type="button"
              tabIndex={-1}
              onClick={() => navigate(sameFocus(entry.target, focus) ? ROOT_FOCUS : entry.target)}
              className={`flex min-h-11 flex-col items-center justify-center gap-0.5 border-t-2 font-mono uppercase transition-colors ${
                active ? 'border-hive-accent text-hive-ice' : 'border-hive-line text-hive-muted'
              }`}
            >
              <span className={`text-[10px] tracking-[0.2em] ${active ? 'glow-accent text-hive-accent' : ''}`}>{entry.code}</span>
              <span className="text-[10px] tracking-[0.1em]">{entry.short}</span>
            </button>
          );
        })}
      </div>
    </>
  );
}
