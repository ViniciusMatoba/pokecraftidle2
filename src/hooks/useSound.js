import { useRef, useCallback, useState, useEffect } from 'react';

const SFX_MAP = {
  victory: null,
  defeat: '/sounds/DERROTA.mp3',
  levelUp: '/sounds/NIVEL.mp3',
  capture: null, // Removido para ser usado apenas na cura
  heal: '/sounds/POKE CENTER.mp3',
  gym: '/sounds/GYM.mp3'
};

export function useSound() {
  const [muted, setMuted] = useState(false);
  const mutedRef = useRef(false);
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

  const playBGM = useCallback((url, volume = 0.25, loop = true, onEnded = null) => {
    if (currentBgmKey.current === url && bgmRef.current && bgmRef.current.loop === loop) return;
    
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
    audio.volume = volume;
    if (onEnded) audio.onended = onEnded;
    
    bgmRef.current = audio;
    currentBgmKey.current = url;

    if (!mutedRef.current) {
      audio.play().catch(e => console.warn("BGM play failed:", e));
    }
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

  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      if (bgmRef.current) {
        bgmRef.current.pause();
        bgmRef.current = null;
      }
    };
  }, []);

  return { playBGM, stopBGM, sfxVictory, sfxDefeat, sfxLevelUp, sfxCapture, sfxHeal, sfxGym, stopSFX, toggleMute, isMuted, muted };
}
