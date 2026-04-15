import { useEffect, useRef, useState } from 'react';

/** Animates from 0 to `target` over `duration` ms using an ease-out cubic curve. */
export function useCountUp(target: number, duration = 600): number {
  const [value, setValue] = useState(0);
  const raf = useRef<number>();

  useEffect(() => {
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(eased * target));
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [target, duration]);

  return value;
}
