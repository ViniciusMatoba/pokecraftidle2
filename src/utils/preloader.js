/**
 * Preloader utility for PokéCraft Idle
 * Manages concurrent downloads of images and sounds with progress tracking.
 */

export const preloadAssets = async (images = [], sounds = [], onProgress = () => {}) => {
  const total = images.length + sounds.length;
  let loaded = 0;

  const tick = () => {
    loaded++;
    onProgress(Math.floor((loaded / total) * 100));
  };

  const imagePromises = images.map((src) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        tick();
        resolve();
      };
      img.onerror = () => {
        console.warn(`Failed to preload image: ${src}`);
        tick();
        resolve(); // Resolve anyway to not block the game
      };
    });
  });

  const soundPromises = sounds.map((src) => {
    return new Promise((resolve) => {
      const audio = new Audio();
      audio.src = src;
      // Preload metadata and enough to play
      audio.oncanplaythrough = () => {
        tick();
        resolve();
      };
      audio.onerror = () => {
        console.warn(`Failed to preload sound: ${src}`);
        tick();
        resolve();
      };
      // For sounds, we set a timeout because oncanplaythrough might be fickle on some browsers
      setTimeout(() => {
        if (audio.readyState < 3) {
           // If after 3 seconds it's not ready, just move on
           tick();
           resolve();
        }
      }, 3000);
    });
  });

  if (total === 0) {
    onProgress(100);
    return Promise.resolve();
  }

  return Promise.all([...imagePromises, ...soundPromises]);
};
