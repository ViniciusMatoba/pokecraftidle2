import { useState, useEffect } from 'react';

// === Animador de spritesheet (batalha) ===
// Toca uma TIRA HORIZONTAL de quadros quadrados (o formato do pacote local:
// largura = N * altura). Percorre os quadros via background-position (setInterval,
// que segue rodando com a aba oculta). Enquanto carrega ou se a tira falhar,
// mostra o `fallbackSrc` (a sprite normal da CDN) — nada quebra.
//
// É um componente genérico de exibição (como um <img>): a arte vem do arquivo
// apontado por `localSrc`.
export default function AnimatedBattleSprite({ localSrc, fallbackSrc, className, alt, flip = false, fps = 16 }) {
  const [frames, setFrames] = useState(0); // 0 = ainda carregando, -1 = falhou
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    let alive = true;
    setFrames(0); setFrame(0);
    const img = new Image();
    img.onload = () => {
      if (!alive) return;
      const n = img.naturalHeight > 0 ? Math.max(1, Math.round(img.naturalWidth / img.naturalHeight)) : 1;
      setFrames(n);
    };
    img.onerror = () => { if (alive) setFrames(-1); };
    img.src = localSrc;
    return () => { alive = false; };
  }, [localSrc]);

  useEffect(() => {
    if (frames <= 1) return;
    const id = setInterval(() => setFrame((f) => (f + 1) % frames), 1000 / fps);
    return () => clearInterval(id);
  }, [frames, fps]);

  const flipStyle = flip ? { transform: 'scaleX(-1)' } : undefined;

  // Carregando ou falhou -> fallback estático (mesma className, sem piscar).
  if (frames <= 0) {
    return <img src={fallbackSrc} className={className} alt={alt} style={flipStyle} onError={(e) => { if (e.target.src !== fallbackSrc) e.target.src = fallbackSrc; }} />;
  }
  // Uma frame só -> imagem estática local.
  if (frames === 1) {
    return <img src={localSrc} className={className} alt={alt} style={flipStyle} />;
  }
  // Anima a tira.
  const posX = (frame / (frames - 1)) * 100;
  return (
    <div
      className={className}
      role="img"
      aria-label={alt}
      style={{
        backgroundImage: `url("${localSrc}")`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: `${frames * 100}% 100%`,
        backgroundPosition: `${posX}% 50%`,
        imageRendering: 'pixelated',
        ...flipStyle,
      }}
    />
  );
}
