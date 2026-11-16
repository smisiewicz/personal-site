'use client';

import { useEffect } from 'react';

import HiveCanvas from '@/components/hive/HiveCanvas';
import HudFrame from '@/components/hud/HudFrame';
import HudHeading from '@/components/hud/HudHeading';
import HudNav from '@/components/hud/HudNav';
import HudStatusBar from '@/components/hud/HudStatusBar';
import HudTopBar from '@/components/hud/HudTopBar';
import PanelHost from '@/components/panels/PanelHost';
import { useHiveNavigation } from '@/hooks/useHiveNavigation';
import { personalInfo } from '@/data/personal';
import { useHiveState } from '@/stores/useHiveStore';

export default function HiveApp(): React.JSX.Element {
  useHiveNavigation();
  const booted = useHiveState((state) => state.booted);

  // The HUD's entrance is plain CSS keyed off this attribute (see .hud-enter in globals.css).
  useEffect(() => {
    if (booted) document.documentElement.dataset.booted = 'true';
  }, [booted]);

  return (
    <>
      <h1 className="sr-only">
        {personalInfo.name} — {personalInfo.title}
      </h1>
      <HiveCanvas />
      <HudFrame />
      <HudTopBar />
      <HudNav />
      <HudHeading />
      <main>
        <PanelHost />
      </main>
      <HudStatusBar />
    </>
  );
}
