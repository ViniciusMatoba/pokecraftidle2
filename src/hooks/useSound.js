import { useRef, useCallback, useState, useEffect } from 'react';

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

const SFX_MAP = {
  victory: null,
  defeat: `${BASE}/sounds/derrota.mp3`,
  levelUp: `${BASE}/sounds/nivel.mp3`,
  capture: null, // Removido para ser usado apenas na cura
  heal: `${BASE}/sounds/POKE CENTER.mp3`,
  gym: `${BASE}/sounds/gym.mp3`
};

export function useSound() {
  const [muted, setMuted] = useState(false);
  const mutedRef = useRef(false);
  const bgmVolumeRef = useRef(0.25);
  const bgmRef = useRef(null);
  const currentBgmKey = useRef(null);
  const sfxRef = useRef(null);
  const defeatAudioRef = useRef(null);

  const lastPlayTime = useRef({});

  const playSFX = useCallback((key) => {
    if (mutedRef.current) return;
    const path = SFX_MAP[key];
    if (!path) return;

    // Cooldown para evitar barulho excessivo (ex: múltiplos level ups)
    const now = Date.now();
    if (lastPlayTime.current[key] && now - lastPlayTime.current[key] < 150) return;
    lastPlayTime.current[key] = now;

    const audio = new Audio(path);
    audio.volume = 0.4;
    sfxRef.current = audio;
    audio.play().catch(e => console.warn("SFX play failed:", e));
  }, []);

  const stopSFX = useCallback(() => {
    if (sfxRef.current) {
      sfxRef.current.pause();
      sfxRef.current.currentTime = 0;
      sfxRef.current = null;
    }
    if (defeatAudioRef.current) {
      defeatAudioRef.current.pause();
      defeatAudioRef.current.currentTime = 0;
      defeatAudioRef.current = null;
    }
  }, []);

  const sfxVictory = useCallback(() => playSFX('victory'), [playSFX]);
  const sfxDefeat = useCallback(() => {
    if (mutedRef.current) return;
    const path = SFX_MAP['defeat'];
    if (!path) return;

    if (defeatAudioRef.current) {
      defeatAudioRef.current.pause();
      defeatAudioRef.current = null;
    }

    const audio = new Audio(path);
    audio.volume = 0.4;
    defeatAudioRef.current = audio;
    audio.play().catch(e => console.warn("Defeat SFX play failed:", e));
  }, []);
  const sfxLevelUp = useCallback(() => playSFX('levelUp'), [playSFX]);
  const sfxCapture = useCallback(() => playSFX('capture'), [playSFX]);
  const sfxHeal = useCallback(() => playSFX('heal'), [playSFX]);
  const sfxGym = useCallback(() => playSFX('gym'), [playSFX]);
  const sfxShiny = useCallback(() => {
    if (mutedRef.current) return;

    const now = Date.now();
    if (lastPlayTime.current.shiny && now - lastPlayTime.current.shiny < 1200) return;
    lastPlayTime.current.shiny = now;

    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const master = ctx.createGain();
      master.gain.setValueAtTime(0.0001, ctx.currentTime);
      master.gain.exponentialRampToValueAtTime(0.16, ctx.currentTime + 0.02);
      master.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.72);
      master.connect(ctx.destination);

      [880, 1175, 1568].forEach((freq, index) => {
        const start = ctx.currentTime + index * 0.09;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.18, start + 0.18);
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(0.11, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.26);
        osc.connect(gain);
        gain.connect(master);
        osc.start(start);
        osc.stop(start + 0.32);
      });

      setTimeout(() => ctx.close().catch(() => {}), 900);
    } catch (e) {
      console.warn('Shiny SFX failed:', e);
    }
  }, []);

  const playBGM = useCallback((url, volume, loop = true, onEnded = null) => {
    const vol = volume !== undefined ? volume : bgmVolumeRef.current;
    if (currentBgmKey.current === url && bgmRef.current && bgmRef.current.loop === loop) {
      bgmRef.current.volume = vol;
      // Sempre atualiza onEnded — evita silêncio quando shuffle escolhe a mesma faixa duas vezes
      bgmRef.current.onended = onEnded || null;
      return;
    }

    if (bgmRef.current) {
      bgmRef.current.pause();
      bgmRef.current.onended = null;
      bgmRef.current = null;
    }

    if (!url) {
      currentBgmKey.current = null;
      return;
    }

    const audio = new Audio(url);
    audio.loop = loop;
    audio.volume = vol;
    if (onEnded) audio.onended = onEnded;

    bgmRef.current = audio;
    currentBgmKey.current = url;

    if (!mutedRef.current) {
      audio.play().catch(e => console.warn("BGM play failed:", e));
    }
  }, []);

  const setBgmVolume = useCallback((vol) => {
    bgmVolumeRef.current = vol;
    if (bgmRef.current) bgmRef.current.volume = vol;
  }, []);

  const stopBGM = useCallback((fadeMs = 0) => {
    if (!bgmRef.current) return;

    if (fadeMs > 0) {
      const step = bgmRef.current.volume / (fadeMs / 50);
      const interval = setInterval(() => {
        if (!bgmRef.current || bgmRef.current.volume <= step) {
          if (bgmRef.current) {
            bgmRef.current.pause();
            bgmRef.current = null;
          }
          currentBgmKey.current = null;
          clearInterval(interval);
        } else {
          bgmRef.current.volume -= step;
        }
      }, 50);
    } else {
      bgmRef.current.pause();
      bgmRef.current = null;
      currentBgmKey.current = null;
    }
  }, []);

  const toggleMute = useCallback(() => {
    const next = !mutedRef.current;
    mutedRef.current = next;
    setMuted(next);

    if (bgmRef.current) {
      if (next) bgmRef.current.pause();
      else bgmRef.current.play().catch(() => {});
    }

    return next;
  }, []);

  const isMuted = () => mutedRef.current;

  // Retoma BGM quando o usuário volta para a aba (browser pausa áudio em abas escondidas)
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && bgmRef.current && bgmRef.current.paused && !mutedRef.current) {
        bgmRef.current.play().catch(() => {});
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      if (bgmRef.current) {
        bgmRef.current.pause();
        bgmRef.current = null;
      }
    };
  }, []);

  return { playBGM, stopBGM, setBgmVolume, sfxVictory, sfxDefeat, sfxLevelUp, sfxCapture, sfxHeal, sfxGym, sfxShiny, stopSFX, toggleMute, isMuted, muted };
}
