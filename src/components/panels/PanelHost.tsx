'use client';

import { AnimatePresence } from 'framer-motion';

import { focusToHash, hasPanel } from '@/lib/hive/nav';
import { useHiveState } from '@/stores/useHiveStore';

import AboutPanel from './AboutPanel';
import ContactPanel from './ContactPanel';
import ExperiencePanel from './ExperiencePanel';
import ProjectPanel from './ProjectPanel';

/** Shows the content panel for the focused cell, if that cell has one. */
export default function PanelHost(): React.JSX.Element {
  const focus = useHiveState((state) => state.focus);
  const key = focusToHash(focus);

  let panel: React.JSX.Element | null = null;
  if (hasPanel(focus)) {
    if (focus.section === 'about') panel = <AboutPanel key={key} />;
    else if (focus.section === 'contact') panel = <ContactPanel key={key} />;
    else if (focus.section === 'experience') panel = <ExperiencePanel key={key} index={focus.item ?? 0} />;
    else if (focus.section === 'projects') panel = <ProjectPanel key={key} index={focus.item ?? 0} />;
  }

  return <AnimatePresence mode="wait">{panel}</AnimatePresence>;
}
