import { useRef, useCallback, useState, useEffect } from 'react';

const SFX_MAP = {
  victory: null,
  defeat: 'sounds/DERROTA.mp3',
  levelUp: 'sounds/NIVEL.mp3',
  capture: null,
  heal: 'sounds/POKE CENTER.mp3',
  gym: 'sounds/GYM.mp3'
};

const getBaseUrl = () => {
  const base = import.meta.env?.BASE_URL || '/';
  return base.endsWith('/') ? base : `${base}/`;
};

const resolveAudioPath = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${getBaseUrl()}${cleanPath}`;
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
    const path = resolveAudioPath(SFX_MAP[key]);
    if (!path) return;

    // Cooldown para evitar barulho excessivo (ex: múltiplos level ups)
    const now = Date.now();
    if (lastPlayTime.current[key] && now - lastPlayTime.current[key] < 200) return;
    lastPlayTime.current[key] = now;
    
    // Cria uma nova instância para permitir sons sobrepostos se necessário
    const audio = new Audio(path);
    audio.volume = 0.4;
    audio.play().catch(e => {
      if (e.name !== 'NotAllowedError') {
        console.warn(`SFX play failed for ${key} (${path}):`, e);
      }
    });
  }, []);

  const stopSFX = useCallback(() => {
    // Não paramos sons curtos individuais, apenas os persistentes se houver
    if (defeatAudioRef.current) {
      defeatAudioRef.current.pause();
      defeatAudioRef.current.currentTime = 0;
      defeatAudioRef.current = null;
    }
  }, []);

  const sfxVictory = useCallback(() => playSFX('victory'), [playSFX]);
  const sfxDefeat = useCallback(() => {
    if (mutedRef.current) return;
    const path = resolveAudioPath(SFX_MAP['defeat']);
    if (!path) return;

    if (defeatAudioRef.current) {
      defeatAudioRef.current.pause();
      defeatAudioRef.current = null;
    }

    const audio = new Audio(path);
    audio.volume = 0.4;
    defeatAudioRef.current = audio;
    audio.play().catch(e => {
      if (e.name !== 'NotAllowedError') {
        console.warn(`Defeat SFX play failed (${path}):`, e);
      }
    });
  }, []);
  const sfxLevelUp = useCallback(() => playSFX('levelUp'), [playSFX]);
  const sfxCapture = useCallback(() => playSFX('capture'), [playSFX]);
  const sfxHeal = useCallback(() => playSFX('heal'), [playSFX]);
  const sfxHealPokemonCenter = useCallback(() => playSFX('heal'), [playSFX]); 
  const sfxGym = useCallback(() => playSFX('gym'), [playSFX]);

  const playBGM = useCallback((url, volume = 0.25, loop = true, onEnded = null) => {
    const resolvedUrl = resolveAudioPath(url);
    
    // Se a música já for a mesma, não reinicia
    if (currentBgmKey.current === resolvedUrl && bgmRef.current) {
      if (bgmRef.current.paused && !mutedRef.current) {
        bgmRef.current.play().catch(() => {});
      }
      return;
    }
    
    if (bgmRef.current) {
      bgmRef.current.pause();
      bgmRef.current.onended = null;
      bgmRef.current = null;
    }

    if (!resolvedUrl) {
      currentBgmKey.current = null;
      return;
    }

    const audio = new Audio(resolvedUrl);
    audio.loop = loop;
    audio.volume = volume;
    
    // O loop nativo costuma ser mais estável, mas usamos onended como fallback
    // ou para transições (shuffle)
    audio.onended = () => {
      if (loop) {
        // Native loop should handle this, but some browsers need a nudge
        if (audio.paused) audio.play().catch(() => {});
      } else if (onEnded) {
        onEnded();
      }
    };
    
    bgmRef.current = audio;
    currentBgmKey.current = resolvedUrl;

    if (!mutedRef.current) {
      audio.play().catch(e => {
        if (e.name !== 'NotAllowedError') {
          console.warn(`BGM play failed (${resolvedUrl}):`, e);
        }
      });
    }
  }, []);

  const stopBGM = useCallback((fadeMs = 0) => {
    if (!bgmRef.current) return;
    
    if (fadeMs > 0) {
      const initialVolume = bgmRef.current.volume;
      const step = initialVolume / (fadeMs / 50);
      const interval = setInterval(() => {
        if (!bgmRef.current) {
          clearInterval(interval);
          return;
        }
        if (bgmRef.current.volume <= step) {
          bgmRef.current.pause();
          bgmRef.current.onended = null;
          bgmRef.current = null;
          currentBgmKey.current = null;
          clearInterval(interval);
        } else {
          bgmRef.current.volume -= step;
        }
      }, 50);
    } else {
      bgmRef.current.pause();
      bgmRef.current.onended = null;
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

  useEffect(() => {
    return () => {
      if (bgmRef.current) {
        bgmRef.current.pause();
        bgmRef.current.onended = null;
        bgmRef.current = null;
      }
    };
  }, []);

  return { playBGM, stopBGM, sfxVictory, sfxDefeat, sfxLevelUp, sfxCapture, sfxHeal, sfxHealPokemonCenter, sfxGym, stopSFX, toggleMute, isMuted, muted };
}

