// SFX gerados via Web Audio API — procedural, zero dependência externa.
// BGM removido: URLs públicas de .mp3 não são confiáveis no ambiente de produção.
import { useRef, useCallback, useState } from 'react';

export function useSound() {
  const ctxRef  = useRef(null);
  const [muted, setMuted] = useState(false); // state → re-render do botão
  const mutedRef = useRef(false);             // ref  → acesso síncrono nos callbacks

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (ctxRef.current.state === 'suspended') ctxRef.current.resume();
    return ctxRef.current;
  }, []);

  // Stubs de BGM — mantidos para não quebrar chamadas existentes no App
  const playBGM = useCallback(() => {}, []);
  const stopBGM = useCallback(() => {}, []);

  // SFX: vitória
  const sfxVictory = useCallback(() => {
    if (mutedRef.current) return;
    const ctx = getCtx();
    [523, 659, 784, 1047].forEach((freq, i) => {
      const osc = ctx.createOscillator(), gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = 'square'; osc.frequency.value = freq;
      const t = ctx.currentTime + i * 0.12;
      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
      osc.start(t); osc.stop(t + 0.22);
    });
  }, [getCtx]);

  // SFX: derrota
  const sfxDefeat = useCallback(() => {
    if (mutedRef.current) return;
    const ctx = getCtx();
    [392, 330, 262, 196].forEach((freq, i) => {
      const osc = ctx.createOscillator(), gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = 'triangle'; osc.frequency.value = freq;
      const t = ctx.currentTime + i * 0.18;
      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.30);
      osc.start(t); osc.stop(t + 0.30);
    });
  }, [getCtx]);

  // SFX: level up
  const sfxLevelUp = useCallback(() => {
    if (mutedRef.current) return;
    const ctx = getCtx();
    [
      { f: 262, t: 0.00, d: 0.08 }, { f: 330, t: 0.08, d: 0.08 },
      { f: 392, t: 0.16, d: 0.08 }, { f: 523, t: 0.24, d: 0.08 },
      { f: 659, t: 0.32, d: 0.08 }, { f: 784, t: 0.40, d: 0.28 },
    ].forEach(({ f, t, d }) => {
      const osc = ctx.createOscillator(), gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = 'square'; osc.frequency.value = f;
      const start = ctx.currentTime + t;
      gain.gain.setValueAtTime(0.13, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + d);
      osc.start(start); osc.stop(start + d);
    });
  }, [getCtx]);

  // SFX: captura
  const sfxCapture = useCallback(() => {
    if (mutedRef.current) return;
    const ctx = getCtx();
    // Arremesso
    const tOsc = ctx.createOscillator(), tGain = ctx.createGain();
    tOsc.connect(tGain); tGain.connect(ctx.destination);
    tOsc.type = 'sine';
    tOsc.frequency.setValueAtTime(600, ctx.currentTime);
    tOsc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.3);
    tGain.gain.setValueAtTime(0.18, ctx.currentTime);
    tGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    tOsc.start(ctx.currentTime); tOsc.stop(ctx.currentTime + 0.3);
    // Sacudidas
    [0.5, 1.0, 1.5].forEach(delay => {
      const osc = ctx.createOscillator(), gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = 'sawtooth'; osc.frequency.value = 160;
      const t = ctx.currentTime + delay;
      gain.gain.setValueAtTime(0.10, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);
      osc.start(t); osc.stop(t + 0.07);
    });
    // Confirmação
    [523, 784, 1047].forEach((freq, i) => {
      const osc = ctx.createOscillator(), gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = 'sine'; osc.frequency.value = freq;
      const t = ctx.currentTime + 1.9 + i * 0.09;
      gain.gain.setValueAtTime(0.13, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
      osc.start(t); osc.stop(t + 0.18);
    });
  }, [getCtx]);

  // SFX: cura (Centro Pokémon)
  const sfxHeal = useCallback(() => {
    if (mutedRef.current) return;
    const ctx = getCtx();
    [
      { f: 784,  t: 0.00, d: 0.16 }, { f: 880,  t: 0.16, d: 0.16 },
      { f: 988,  t: 0.32, d: 0.16 }, { f: 784,  t: 0.48, d: 0.16 },
      { f: 1047, t: 0.64, d: 0.30 }, { f: 988,  t: 0.94, d: 0.16 },
      { f: 784,  t: 1.10, d: 0.45 },
    ].forEach(({ f, t, d }) => {
      const osc = ctx.createOscillator(), gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = 'sine'; osc.frequency.value = f;
      const start = ctx.currentTime + t;
      gain.gain.setValueAtTime(0.16, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + d + 0.04);
      osc.start(start); osc.stop(start + d + 0.08);
    });
  }, [getCtx]);

  // Mute toggle — atualiza ref (síncrono) + state (re-render)
  const toggleMute = useCallback(() => {
    const next = !mutedRef.current;
    mutedRef.current = next;
    setMuted(next);
    return next;
  }, []);

  const isMuted = () => mutedRef.current;

  return { playBGM, stopBGM, sfxVictory, sfxDefeat, sfxLevelUp, sfxCapture, sfxHeal, toggleMute, isMuted, muted };
}
