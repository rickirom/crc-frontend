"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!<>-_\\/[]{}—=+*^?#■□▢▣▤▨▩▪▫▬▭▮▯";

type ScrambleTextProps = {
  /** The two states this text toggles between on hover */
  values: string[];
  /** ms per scramble tick (lower = faster flicker) */
  speed?: number;
  /** how many extra ticks each character scrambles before locking in */
  scrambleSteps?: number;
  className?: string;
  scrambleColor?: string;
};

/**
 * Text that scrambles through random characters before settling on
 * the "other" value each time it's hovered. Stays on whatever value
 * it landed on until hovered again.
 */
export function ScrambleText({
  values,
  speed = 20,
  scrambleSteps = 5,
  className,
  scrambleColor = "#00fbff",
}: ScrambleTextProps) {
  const [index, setIndex] = useState(0); // which of values[] is "current"
  const [color, setColor] = useState('inherit')
  const [display, setDisplay] = useState(values[0]);
  const frameRef = useRef<number | null>(null);
  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
  }, []);

  const runScramble = useCallback(
    (target: string) => {

      if (frameRef.current) window.clearInterval(frameRef.current);

      // Reduced motion: just swap instantly, no animation.
      if (prefersReducedMotion.current) {
        setDisplay(target);
        return;
      }

      const length = target.length;
      // each character gets its own "reveal time" so they don't all
      // lock in at once — that's what gives the Matrix decode feel
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
        const brightness = Math.round(((maxTick-tick)/(maxTick == 0? 1:maxTick))*255).toString(16);

        setColor(scrambleColor+brightness);
        setDisplay(out);
        tick++;

        if (tick > maxTick) {
          if (frameRef.current) window.clearInterval(frameRef.current);
          setDisplay(target); // guarantee it ends exactly right
          setColor('inherit');
        }
      }, speed);
    },
    [speed, scrambleSteps, scrambleColor]
  );

  const handleHover = () => {
    const nextIndex = (index + 1) % values.length; //this makes it possible to have an arbitrary number of strings
    setIndex(nextIndex);
    runScramble(values[nextIndex]);
  };

  useEffect(() => {
    return () => {
      if (frameRef.current) window.clearInterval(frameRef.current);
    };
  }, []);

  return (
    <span
      onMouseEnter={handleHover}
      className={className}
      style={{ cursor: "pointer", display: "inline-block", backgroundColor: color, borderBottom: "dashed 1px", borderColor: "gray"}}
      aria-label={values[index]}
    >
      {display}
    </span>
  );
}