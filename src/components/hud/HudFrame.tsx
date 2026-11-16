/** Purely decorative screen furniture: scan lines, sweep, vignette and corner brackets. */
export default function HudFrame(): React.JSX.Element {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
      <div className="hud-vignette absolute inset-0" />
      <div className="hud-scanlines absolute inset-0" />
      <div className="hud-sweep absolute inset-x-0 top-0 h-40" />
      <div className="hud-bracket left-2 top-2 border-l border-t" />
      <div className="hud-bracket right-2 top-2 border-r border-t" />
      <div className="hud-bracket bottom-2 left-2 border-b border-l" />
      <div className="hud-bracket bottom-2 right-2 border-b border-r" />
    </div>
  );
}
