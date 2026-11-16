interface SpinnerProps {
  hidden?: boolean;
  className?: string;
}

export default function Spinner({ hidden = false, className = '' }: SpinnerProps): React.JSX.Element | null {
  if (hidden) return null;

  return (
    <div
      role="status"
      aria-label="Loading"
      className={`absolute h-8 w-8 animate-spin rounded-full border-2 border-hive-line border-t-hive-cyan ${className}`}
    />
  );
}
