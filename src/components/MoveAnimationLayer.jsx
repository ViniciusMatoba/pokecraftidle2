// src/components/MoveAnimationLayer.jsx
import React, { useRef, useImperativeHandle, forwardRef, useCallback } from 'react';
import { FX_BASE, MOVE_ANIMATIONS, TYPE_FX } from '../data/moveAnimations';

// Posições dos sprites dentro do container de batalha (em % do container)
// Confirmado pelo código do BattleScreen.jsx:
//   Enemy:  absolute top-12 right-10  → x≈72%, y≈38%
//   Player: absolute bottom-2 left-6  → x≈20%, y≈72%
const POS = {
  player: { x: 20, y: 72 },
  enemy:  { x: 72, y: 38 },
};

const MoveAnimationLayer = forwardRef((props, ref) => {
  const layerRef = useRef(null);

  // Cria um sprite de efeito e anima via Web Animations API
  const spawnSprite = useCallback((spriteName, from, to, opts = {}) => {
    if (!layerRef.current) return;
    const {
      duration     = 450,
      delay        = 0,
      startScale   = 0.4,
      endScale     = 2.0,
      startOpacity = 1,
      endOpacity   = 0,
      easing       = 'ease-out',
      size         = 64,
    } = opts;

    const img = document.createElement('img');
    img.src = `${FX_BASE}${spriteName}.png`;
    img.draggable = false;
    img.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      object-fit: contain;
      pointer-events: none;
      left: ${from.x}%;
      top: ${from.y}%;
      transform: translate(-50%, -50%) scale(${startScale});
      opacity: ${startOpacity};
      z-index: 50;
      image-rendering: pixelated;
    `;
    layerRef.current.appendChild(img);

    const animation = img.animate([
      {
        left:      `${from.x}%`,
        top:       `${from.y}%`,
        transform: `translate(-50%, -50%) scale(${startScale})`,
        opacity:   startOpacity,
      },
      {
        left:      `${to.x}%`,
        top:       `${to.y}%`,
        transform: `translate(-50%, -50%) scale(${endScale})`,
        opacity:   endOpacity,
      },
    ], {
      duration,
      delay,
      easing,
      fill: 'forwards',
    });

    animation.onfinish = () => { try { img.remove(); } catch (_) {} };
    img.onerror        = () => { try { img.remove(); } catch (_) {} };
  }, []);

  // Flash de cor sobre toda a área de batalha
  const flashOverlay = useCallback((color, duration = 120) => {
    if (!layerRef.current) return;
    const div = document.createElement('div');
    div.style.cssText = `
      position: absolute; inset: 0;
      background: ${color};
      opacity: 0.30;
      pointer-events: none;
      z-index: 49;
    `;
    layerRef.current.appendChild(div);
    div.animate(
      [{ opacity: 0.30 }, { opacity: 0 }],
      { duration, easing: 'ease-out', fill: 'forwards' }
    ).onfinish = () => { try { div.remove(); } catch (_) {} };
  }, []);

  // Motor de animação principal
  const playAnimation = useCallback((moveName, moveType, direction = 'player-to-enemy') => {
    if (!layerRef.current) return;

    const from = direction === 'player-to-enemy' ? POS.player : POS.enemy;
    const to   = direction === 'player-to-enemy' ? POS.enemy  : POS.player;

    // Resolve definição de animação
    const key    = (moveName || '').toLowerCase().replace(/ /g, '-');
    const def    = MOVE_ANIMATIONS[key];
    const typeFb = TYPE_FX[moveType] || TYPE_FX['Normal'];

    const sprite   = def?.sprite   || typeFb.sprite   || 'impact';
    const color    = def?.color    || typeFb.color     || '#ffffff';
    const count    = def?.count    || 3;
    const duration = def?.duration || 420;
    const type     = def?.type     || 'projectile';

    switch (type) {

      // ── Projétil simples ────────────────────────────────────────────────
      case 'projectile':
        for (let i = 0; i < Math.min(count, 5); i++) {
          spawnSprite(sprite, from, to, {
            duration,
            delay:      i * 55,
            startScale: 0.35,
            endScale:   1.8,
          });
        }
        flashOverlay(color, 90);
        break;

      // ── Projétil com rastro (vários em sequência) ────────────────────────
      case 'projectile_trail':
        for (let i = 0; i < Math.min(count, 6); i++) {
          spawnSprite(sprite, from, to, {
            duration:   duration * 0.8,
            delay:      i * 50,
            startScale: 0.3,
            endScale:   1.6,
          });
        }
        flashOverlay(color, 100);
        break;

      // ── Explosão no alvo (sprites em todas as direções) ──────────────────
      case 'burst': {
        const n = Math.min(count, 8);
        for (let i = 0; i < n; i++) {
          const angle  = (i / n) * 2 * Math.PI;
          const spread = 18;
          const target = {
            x: to.x + Math.cos(angle) * spread,
            y: to.y + Math.sin(angle) * spread,
          };
          spawnSprite(sprite, to, target, {
            duration:   duration * 0.65,
            delay:      i * 35,
            startScale: 0.15,
            endScale:   1.5,
          });
        }
        flashOverlay(color, 160);
        break;
      }

      // ── Raio que cai do céu ──────────────────────────────────────────────
      case 'lightning_strike': {
        const skyPos = { x: to.x, y: -15 };
        for (let i = 0; i < Math.min(count, 4); i++) {
          const jitter = { x: to.x + (Math.random() - 0.5) * 12, y: -15 };
          spawnSprite(sprite, jitter, to, {
            duration:   200,
            delay:      i * 90,
            startScale: 0.4,
            endScale:   1.2,
            easing:     'linear',
          });
        }
        flashOverlay(color, 80);
        break;
      }

      // ── Impacto no alvo com flash ────────────────────────────────────────
      case 'impact_flash':
      case 'impact_multi': {
        const hits = type === 'impact_multi' ? Math.min(count, 5) : 3;
        for (let i = 0; i < hits; i++) {
          const jx = to.x + (Math.random() - 0.5) * 16;
          const jy = to.y + (Math.random() - 0.5) * 16;
          spawnSprite('impact', { x: jx, y: jy }, { x: jx, y: jy }, {
            duration:    220,
            delay:       i * 60,
            startScale:  0.1,
            endScale:    2.2,
            endOpacity:  0,
          });
          if (sprite !== 'impact' && i === 0) {
            spawnSprite(sprite, from, to, {
              duration:    duration * 0.55,
              startScale:  0.3,
              endScale:    1.5,
            });
          }
        }
        flashOverlay(color, 120);
        break;
      }

      // ── Corte / slash no alvo ────────────────────────────────────────────
      case 'slash': {
        const slashFrom = { x: to.x - 18, y: to.y - 12 };
        const slashTo   = { x: to.x + 18, y: to.y + 12 };
        spawnSprite(sprite, slashFrom, slashTo, {
          duration:   220,
          startScale: 0.5,
          endScale:   1.8,
        });
        spawnSprite('impact', to, to, {
          duration:   280,
          delay:      120,
          startScale: 0.1,
          endScale:   2.0,
          endOpacity: 0,
        });
        flashOverlay(color, 80);
        break;
      }

      // ── Dreno: vai ao alvo e retorna ao usuário ──────────────────────────
      case 'drain': {
        const half = Math.floor(duration * 0.5);
        for (let i = 0; i < Math.min(count, 5); i++) {
          // Vai até o inimigo
          spawnSprite(sprite, from, to, {
            duration:    half,
            delay:       i * 65,
            startScale:  0.3,
            endScale:    1.4,
          });
          // Retorna ao jogador (drenando)
          spawnSprite(sprite, to, from, {
            duration:    half,
            delay:       half + i * 65,
            startScale:  0.9,
            endScale:    0.2,
            startOpacity: 0.85,
            endOpacity:  0,
          });
        }
        flashOverlay('#22ff66', 200);
        break;
      }

      // ── Terremoto: pedras sobem do chão ─────────────────────────────────
      case 'quake': {
        const n = Math.min(count, 7);
        for (let i = 0; i < n; i++) {
          const rx  = 10 + Math.random() * 80;
          const top = { x: rx, y: 55 };
          const bot = { x: rx, y: 95 };
          spawnSprite(sprite, bot, top, {
            duration:   320,
            delay:      i * 75,
            startScale: 0.4,
            endScale:   1.6,
            endOpacity: 0,
          });
        }
        flashOverlay(color, 220);
        break;
      }

      // ── Carrega energia, depois dispara ─────────────────────────────────
      case 'charge_projectile': {
        // Fase 1: carrega no atacante
        spawnSprite(sprite, from, from, {
          duration:   280,
          startScale: 0.05,
          endScale:   1.6,
          endOpacity: 0.9,
        });
        // Fase 2: dispara ao inimigo
        for (let i = 0; i < Math.min(count - 1, 4); i++) {
          spawnSprite(sprite, from, to, {
            duration:   duration * 0.6,
            delay:      280 + i * 45,
            startScale: 0.55,
            endScale:   2.2,
          });
        }
        flashOverlay(color, 160);
        break;
      }

      // ── Feixe contínuo ───────────────────────────────────────────────────
      case 'beam': {
        const n = Math.min(count, 6);
        for (let i = 0; i < n; i++) {
          const jy = from.y + (Math.random() - 0.5) * 10;
          spawnSprite(sprite, { x: from.x, y: jy }, to, {
            duration,
            delay:      i * 38,
            startScale: 0.2,
            endScale:   3.0,
            size:       56,
          });
        }
        flashOverlay(color, 200);
        break;
      }

      // ── Pulso que expande a partir do alvo ───────────────────────────────
      case 'pulse': {
        for (let i = 0; i < Math.min(count, 4); i++) {
          spawnSprite(sprite, to, to, {
            duration:    280,
            delay:       i * 95,
            startScale:  0.05,
            endScale:    3.2,
            startOpacity: 0.85,
            endOpacity:  0,
          });
        }
        flashOverlay(color, 200);
        break;
      }

      // ── Onda que avança ──────────────────────────────────────────────────
      case 'wave': {
        const n = Math.min(count, 5);
        for (let i = 0; i < n; i++) {
          spawnSprite(sprite, { x: from.x + i * 10, y: from.y }, to, {
            duration,
            delay:      i * 75,
            startScale: 0.35,
            endScale:   2.0,
          });
        }
        flashOverlay(color, 160);
        break;
      }

      // ── Fallback genérico ────────────────────────────────────────────────
      default:
        spawnSprite(sprite, from, to, {
          duration,
          startScale: 0.35,
          endScale:   2.0,
        });
        flashOverlay(color, 100);
    }
  }, [spawnSprite, flashOverlay]);

  // Expõe o método play() para o componente pai via ref
  useImperativeHandle(ref, () => ({
    play: playAnimation,
  }), [playAnimation]);

  return (
    <div
      ref={layerRef}
      style={{
        position:       'absolute',
        inset:          0,
        pointerEvents:  'none',
        overflow:       'hidden',
        zIndex:         25,
        borderRadius:   'inherit',
      }}
    />
  );
});

MoveAnimationLayer.displayName = 'MoveAnimationLayer';
export default MoveAnimationLayer;
