'use client';

import { useEffect, useState } from 'react';

/**
 * Reveals text one character at a time, HUD style. Returns the full string immediately when the
 * visitor prefers reduced motion.
 */
export function useTypewriter(text: string, delayMs = 0, speedMs = 22): string {
  const [length, setLength] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setLength(text.length);
      return undefined;
    }
    setLength(0);
    let interval = 0;
    const start = window.setTimeout(() => {
      interval = window.setInterval(() => {
        setLength((current) => {
          if (current >= text.length) window.clearInterval(interval);
          return Math.min(text.length, current + 1);
        });
      }, speedMs);
    }, delayMs);
    return (): void => {
      window.clearTimeout(start);
      window.clearInterval(interval);
    };
  }, [text, delayMs, speedMs]);

  return text.slice(0, length);
}
