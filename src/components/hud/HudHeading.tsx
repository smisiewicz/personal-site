'use client';

import { AnimatePresence, motion } from 'framer-motion';

import { SECTIONS } from '@/lib/constants';
import { isHub, itemCount } from '@/lib/hive/nav';
import { useHiveState } from '@/stores/useHiveStore';

/** Title shown while the camera is inside a hub section, where the cell's own label has faded out. */
export default function HudHeading(): React.JSX.Element {
  const focus = useHiveState((state) => state.focus);
  const section = focus.item === null && isHub(focus.section) ? focus.section : null;
  const meta = SECTIONS.find((entry) => entry.id === section);

  return (
    <AnimatePresence>
      {meta && section && (
        <motion.div
          key={section}
          className="pointer-events-none fixed left-4 top-[4.5rem] z-20 md:left-7 md:top-20"
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
          exit={{ opacity: 0, transition: { duration: 0.12 } }}
        >
          <p className="font-mono text-xs tracking-[0.3em] text-hive-cyan">{meta.code} //</p>
          <h2 className="glow-text font-display text-xl font-bold uppercase tracking-[0.2em] text-hive-ice md:text-3xl">
            {meta.label}
          </h2>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.22em] text-hive-muted">
            {String(itemCount(section)).padStart(2, '0')} nodes <span className="text-hive-cyan">›</span> select one
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
