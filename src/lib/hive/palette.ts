export function cyan(alpha: number): string {
  return `rgba(64, 214, 255, ${alpha})`;
}

export function ice(alpha: number): string {
  return `rgba(218, 247, 255, ${alpha})`;
}

/** White-hot accent, reserved for whatever the visitor is selecting: the cell looks powered up. */
export function accent(alpha: number): string {
  return `rgba(240, 252, 255, ${alpha})`;
}

/** Line colour that shifts from cyan (heat 0) to the white-hot accent (heat 1). */
export function tone(heat: number, alpha: number): string {
  const h = Math.max(0, Math.min(1, heat));
  return `rgba(${Math.round(64 + 176 * h)}, ${Math.round(214 + 38 * h)}, 255, ${alpha})`;
}

export function deep(alpha: number): string {
  return `rgba(2, 8, 14, ${alpha})`;
}

export function cellFill(alpha: number): string {
  return `rgba(6, 30, 44, ${alpha})`;
}
