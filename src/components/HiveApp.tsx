'use client';

import HiveCanvas from '@/components/hive/HiveCanvas';
import BootSequence from '@/components/hud/BootSequence';
import HudFrame from '@/components/hud/HudFrame';
import HudHeading from '@/components/hud/HudHeading';
import HudNav from '@/components/hud/HudNav';
import HudStatusBar from '@/components/hud/HudStatusBar';
import HudTopBar from '@/components/hud/HudTopBar';
import PanelHost from '@/components/panels/PanelHost';
import { useHiveNavigation } from '@/hooks/useHiveNavigation';
import { personalInfo } from '@/data/personal';

export default function HiveApp(): React.JSX.Element {
  useHiveNavigation();

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
      <BootSequence />
    </>
  );
}
