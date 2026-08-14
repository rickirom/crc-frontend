"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!<>-_\\/[]{}—=+*^?#";

type ScrambleTextOnLoadProps = {
  /** The values to cycle through, one per page load */
  values: string[];
  /** localStorage key used to remember which index was shown last.
   *  Give each instance on the page a unique key if you use more than one. */
  storageKey?: string;
  /** ms per scramble tick (lower = faster flicker) */
  speed?: number;
  /** how many extra ticks each character scrambles before locking in */
  scrambleSteps?: number;
  className?: string;
};

/**
 * Text that scrambles into the "next" value in `values` once, on mount.
 * Which value that is advances by one every page load and is remembered
 * in localStorage, so a reload shows the next value in the list, wrapping
 * back to the start after the last one.
 */
export function ScrambleTextOnLoad({
  values,
  storageKey = "scramble-text-index",
  speed = 20,
  scrambleSteps = 5,
  className,
}: ScrambleTextOnLoadProps) {
  const [display, setDisplay] = useState(values[0]);
  const frameRef = useRef<number | null>(null);
  const prefersReducedMotion = useRef(false);

  const runScramble = useCallback(
    (target: string) => {
      if (frameRef.current) window.clearInterval(frameRef.current);

      if (prefersReducedMotion.current) {
        setDisplay(target);
        return;
      }

      const length = target.length;
      const revealAt = Array.from({ length }, (_, i) =>
        Math.round((i / length) * scrambleSteps * length + scrambleSteps)
      );

      let tick = 0;
      const maxTick = Math.max(...revealAt) + 1;

      frameRef.current = window.setInterval(() => {
        let out = "";
        for (let i = 0; i < length; i++) {
          const char = target[i];
          if (char === " ") {
            out += " ";
          } else if (tick >= revealAt[i]) {
            out += char;
          } else {
            out += CHARS[Math.floor(Math.random() * CHARS.length)];
          }
        }
        setDisplay(out);
        tick++;

        if (tick > maxTick) {
          if (frameRef.current) window.clearInterval(frameRef.current);
          setDisplay(target);
        }
      }, speed);
    },
    [speed, scrambleSteps]
  );

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Figure out which value comes next, based on what was shown last time.
    const stored = window.localStorage.getItem(storageKey);
    const lastIndex = stored === null ? -1 : parseInt(stored, 10);
    // -1 -> 0 on a user's very first visit (nothing stored yet).
    const nextIndex = (lastIndex + 1) % values.length;

    window.localStorage.setItem(storageKey, String(nextIndex));

    runScramble(values[nextIndex]);

    return () => {
      if (frameRef.current) window.clearInterval(frameRef.current);
    };
    // Deliberately run once on mount only — this isn't a hover-driven
    // effect, so values/runScramble changing shouldn't re-trigger it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <span
      className={className}
      style={{ display: "inline-block" }}
    >
      {display}
    </span>
  );
}