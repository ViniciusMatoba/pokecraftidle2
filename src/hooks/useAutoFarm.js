import { useEffect, useRef } from 'react';

export function useAutoFarm(activePoke, routeId, onTick) {
  const onTickRef = useRef(onTick);
  const timerRef = useRef(null);

  useEffect(() => {
    onTickRef.current = onTick;
  }, [onTick]);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (!activePoke || !routeId) return;

    const runTick = () => {
      const nextDelay = onTickRef.current() || 2500;
      timerRef.current = setTimeout(runTick, nextDelay);
    };

    timerRef.current = setTimeout(runTick, 800);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [activePoke?.instanceId, routeId]);
}
