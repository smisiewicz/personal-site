import Link from 'next/link';

export default function NotFound(): React.JSX.Element {
  return (
    <main className="flex h-full flex-col items-center justify-center px-6 text-center">
      <div className="hex-clip flex h-56 w-48 flex-col items-center justify-center bg-hive-cyan/15">
        <span className="font-mono text-xs tracking-[0.3em] text-hive-cyan">ERR //</span>
        <h1 className="glow-text font-display text-5xl font-bold text-hive-ice">404</h1>
      </div>
      <p className="mt-8 font-mono text-sm uppercase tracking-[0.25em] text-hive-muted">Sector not found</p>
      <Link
        href="/"
        className="hive-chip mt-6 bg-hive-cyan px-6 py-3 font-display text-xs font-bold uppercase tracking-[0.25em] text-hive-bg transition-colors hover:bg-hive-ice"
      >
        Return to hive
      </Link>
    </main>
  );
}
