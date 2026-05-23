// src/components/MoveAnimationLayer.jsx
import React, { useRef, useImperativeHandle, forwardRef, useCallback } from 'react';
import { FX_BASE, TYPE_COLORS, resolveMoveAnimation } from '../data/moveAnimations';
import { MOVES } from '../data/moves';
import { MOVE_TRANSLATIONS } from '../data/translations';

const normalizeMoveKey = (value) => String(value || '')
  .trim()
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/['’]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

const TRANSLATED_MOVE_KEYS = Object.fromEntries(
  Object.entries(MOVE_TRANSLATIONS).map(([moveId, label]) => [normalizeMoveKey(label), moveId])
);

const POS = {
  player: { x: 20, y: 72 },
  enemy: { x: 72, y: 38 },
};

const clampCount = (count, max) => Math.max(1, Math.min(Number(count || 1), max));
const jitter = (amount = 10) => (Math.random() - 0.5) * amount;
const targetFor = (def, direction, from, to) => (def?.self ? from : to);

const MoveAnimationLayer = forwardRef((props, ref) => {
  const layerRef = useRef(null);

  const addNode = useCallback((node) => {
    if (!layerRef.current) return null;
    layerRef.current.appendChild(node);
    return node;
  }, []);

  const spawnSprite = useCallback((spriteName, from, to, opts = {}) => {
    if (!layerRef.current) return;
    const {
      duration = 450,
      delay = 0,
      startScale = 0.4,
      endScale = 2.0,
      startOpacity = 1,
      endOpacity = 0,
      easing = 'ease-out',
      size = 64,
      fallbackSprite = 'impact',
      rotateStart = 0,
      rotateEnd = 0,
      zIndex = 50,
      filter = '',
      blend = 'normal',
    } = opts;

    const img = document.createElement('img');
    const safeSpriteName = spriteName || fallbackSprite;
    img.src = `${FX_BASE}${safeSpriteName}.png`;
    img.draggable = false;
    img.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      object-fit: contain;
      pointer-events: none;
      left: ${from.x}%;
      top: ${from.y}%;
      transform: translate(-50%, -50%) scale(${startScale}) rotate(${rotateStart}deg);
      opacity: ${startOpacity};
      z-index: ${zIndex};
      image-rendering: pixelated;
      mix-blend-mode: ${blend};
      filter: ${filter};
    `;
    addNode(img);

    const animation = img.animate([
      {
        left: `${from.x}%`,
        top: `${from.y}%`,
        transform: `translate(-50%, -50%) scale(${startScale}) rotate(${rotateStart}deg)`,
        opacity: startOpacity,
      },
      {
        left: `${to.x}%`,
        top: `${to.y}%`,
        transform: `translate(-50%, -50%) scale(${endScale}) rotate(${rotateEnd}deg)`,
        opacity: endOpacity,
      },
    ], { duration, delay, easing, fill: 'forwards' });

    animation.onfinish = () => { try { img.remove(); } catch (_) {} };
    img.onerror = () => {
      if (fallbackSprite && safeSpriteName !== fallbackSprite && img.dataset.fxFallback !== '1') {
        img.dataset.fxFallback = '1';
        img.src = `${FX_BASE}${fallbackSprite}.png`;
      } else {
        try { img.remove(); } catch (_) {}
      }
    };
  }, [addNode]);

  const flashOverlay = useCallback((color, duration = 160, opacity = 0.26, delay = 0) => {
    if (!layerRef.current || !color) return;
    const div = document.createElement('div');
    div.style.cssText = `
      position: absolute; inset: 0;
      background: ${color};
      opacity: 0;
      pointer-events: none;
      z-index: 46;
      mix-blend-mode: screen;
    `;
    addNode(div);
    div.animate(
      [{ opacity: 0 }, { opacity }, { opacity: 0 }],
      { duration, delay, easing: 'ease-out', fill: 'forwards' }
    ).onfinish = () => { try { div.remove(); } catch (_) {} };
  }, [addNode]);

  const spawnRing = useCallback((center, color, opts = {}) => {
    const {
      duration = 420,
      delay = 0,
      startSize = 12,
      endSize = 120,
      opacity = 0.65,
      borderWidth = 3,
      zIndex = 48,
    } = opts;
    const ring = document.createElement('div');
    ring.style.cssText = `
      position: absolute;
      left: ${center.x}%;
      top: ${center.y}%;
      width: ${startSize}px;
      height: ${startSize}px;
      border: ${borderWidth}px solid ${color};
      border-radius: 999px;
      transform: translate(-50%, -50%);
      opacity: ${opacity};
      pointer-events: none;
      z-index: ${zIndex};
      box-shadow: 0 0 18px ${color};
    `;
    addNode(ring);
    ring.animate([
      { width: `${startSize}px`, height: `${startSize}px`, opacity },
      { width: `${endSize}px`, height: `${endSize}px`, opacity: 0 },
    ], { duration, delay, easing: 'ease-out', fill: 'forwards' }).onfinish = () => {
      try { ring.remove(); } catch (_) {}
    };
  }, [addNode]);

  const spawnShield = useCallback((center, color, opts = {}) => {
    const {
      duration = 560,
      delay = 0,
      width = 92,
      height = 118,
      opacity = 0.5,
      zIndex = 49,
    } = opts;
    const shield = document.createElement('div');
    shield.style.cssText = `
      position: absolute;
      left: ${center.x}%;
      top: ${center.y}%;
      width: ${width}px;
      height: ${height}px;
      border: 3px solid ${color};
      border-radius: 48% 52% 45% 55%;
      transform: translate(-50%, -50%) scale(0.55);
      opacity: 0;
      pointer-events: none;
      z-index: ${zIndex};
      background: radial-gradient(circle at 50% 40%, rgba(255,255,255,0.45), ${color}33 48%, transparent 74%);
      box-shadow: inset 0 0 22px ${color}, 0 0 24px ${color};
      mix-blend-mode: screen;
    `;
    addNode(shield);
    shield.animate([
      { transform: 'translate(-50%, -50%) scale(0.55)', opacity: 0 },
      { transform: 'translate(-50%, -50%) scale(1)', opacity },
      { transform: 'translate(-50%, -50%) scale(1.06)', opacity: opacity * 0.55 },
      { transform: 'translate(-50%, -50%) scale(1.16)', opacity: 0 },
    ], { duration, delay, easing: 'ease-out', fill: 'forwards' }).onfinish = () => {
      try { shield.remove(); } catch (_) {}
    };
  }, [addNode]);

  const spawnBeam = useCallback((from, to, color, opts = {}) => {
    const { duration = 420, delay = 0, width = 8, opacity = 0.8, zIndex = 47 } = opts;
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    const length = Math.sqrt(dx * dx + dy * dy);
    const beam = document.createElement('div');
    beam.style.cssText = `
      position: absolute;
      left: ${from.x}%;
      top: ${from.y}%;
      width: ${length}%;
      height: ${width}px;
      transform-origin: 0 50%;
      transform: translateY(-50%) rotate(${angle}deg) scaleX(0);
      border-radius: 999px;
      background: linear-gradient(90deg, transparent, ${color}, #fff, ${color}, transparent);
      box-shadow: 0 0 18px ${color};
      opacity: ${opacity};
      pointer-events: none;
      z-index: ${zIndex};
      mix-blend-mode: screen;
    `;
    addNode(beam);
    beam.animate([
      { transform: `translateY(-50%) rotate(${angle}deg) scaleX(0)`, opacity: 0 },
      { transform: `translateY(-50%) rotate(${angle}deg) scaleX(1)`, opacity },
      { transform: `translateY(-50%) rotate(${angle}deg) scaleX(1)`, opacity: 0 },
    ], { duration, delay, easing: 'ease-out', fill: 'forwards' }).onfinish = () => {
      try { beam.remove(); } catch (_) {}
    };
  }, [addNode]);

  const shakeLayer = useCallback((level = 'light') => {
    if (!layerRef.current) return;
    const distance = level === 'heavy' ? 8 : level === 'medium' ? 5 : 3;
    const duration = level === 'heavy' ? 420 : level === 'medium' ? 300 : 220;
    layerRef.current.animate([
      { transform: 'translate(0, 0)' },
      { transform: `translate(${-distance}px, ${distance}px)` },
      { transform: `translate(${distance}px, ${-distance}px)` },
      { transform: `translate(${-distance / 2}px, ${-distance}px)` },
      { transform: 'translate(0, 0)' },
    ], { duration, easing: 'ease-in-out' });
  }, []);

  const playOverlay = useCallback((type, target, color) => {
    const overlay = String(type || '').toLowerCase();
    const effectMap = {
      fire: { sprite: 'fireball', count: 4, scale: 1.45, color: TYPE_COLORS.Fire },
      water: { sprite: 'waterwisp', count: 4, scale: 1.45, color: TYPE_COLORS.Water },
      electric: { sprite: 'lightning', count: 3, scale: 1.3, color: TYPE_COLORS.Electric },
      ice: { sprite: 'icicle', count: 4, scale: 1.25, color: TYPE_COLORS.Ice },
      poison: { sprite: 'poisonwisp', count: 4, scale: 1.45, color: TYPE_COLORS.Poison },
      dark: { sprite: 'shadowball', count: 3, scale: 1.35, color: TYPE_COLORS.Dark },
      ghost: { sprite: 'poisonwisp', count: 4, scale: 1.35, color: TYPE_COLORS.Ghost },
      grass: { sprite: 'leaf1', count: 5, scale: 1.25, color: TYPE_COLORS.Grass },
      fairy: { sprite: 'shine', count: 5, scale: 1.25, color: TYPE_COLORS.Fairy },
      steel: { sprite: 'impact', count: 3, scale: 1.4, color: TYPE_COLORS.Steel },
      fighting: { sprite: 'impact', count: 3, scale: 1.4, color: TYPE_COLORS.Fighting },
      flying: { sprite: 'wind', count: 4, scale: 1.3, color: TYPE_COLORS.Flying },
      psychic: { sprite: 'wisp', count: 4, scale: 1.3, color: TYPE_COLORS.Psychic },
      dragon: { sprite: 'lightball', count: 4, scale: 1.4, color: TYPE_COLORS.Dragon },
      bug: { sprite: 'energyball', count: 4, scale: 1.2, color: TYPE_COLORS.Bug },
    };
    const effect = effectMap[overlay];
    if (!effect) return;
    for (let i = 0; i < effect.count; i++) {
      spawnSprite(effect.sprite, { x: target.x + jitter(18), y: target.y + jitter(18) }, target, {
        duration: 330,
        delay: i * 55,
        startScale: 0.12,
        endScale: effect.scale,
        filter: `drop-shadow(0 0 8px ${effect.color || color})`,
      });
    }
  }, [spawnSprite]);

  const playMiss = useCallback((from, to, color, sprite, duration) => {
    const missTarget = { x: to.x + (to.x > from.x ? 16 : -16), y: to.y - 18 };
    spawnSprite(sprite || 'impact', from, missTarget, {
      duration: Math.min(duration || 420, 520),
      startScale: 0.25,
      endScale: 0.9,
      endOpacity: 0,
      easing: 'ease-in',
    });
    spawnRing(missTarget, color || '#94a3b8', { duration: 260, endSize: 42, opacity: 0.35, borderWidth: 2 });
  }, [spawnRing, spawnSprite]);

  const playAnimation = useCallback((moveName, moveType, direction = 'player-to-enemy', moveKey = null, onHit, onAttack, meta = {}) => {
    if (!layerRef.current) return;

    const from = direction === 'player-to-enemy' ? POS.player : POS.enemy;
    const to = direction === 'player-to-enemy' ? POS.enemy : POS.player;
    const resolvedKey = moveKey || TRANSLATED_MOVE_KEYS[normalizeMoveKey(moveName)] || normalizeMoveKey(moveName);
    const moveData = MOVES[resolvedKey] || { type: moveType || 'Normal', category: meta.category || 'Physical', power: meta.power || 0 };
    const def = resolveMoveAnimation(moveName, { ...moveData, type: moveType || moveData.type });

    const color = def?.color || TYPE_COLORS[moveType] || '#ffffff';
    const sprite = def?.sprite || 'impact';
    const count = def?.count || 3;
    const duration = def?.duration || 420;
    const animType = def?.type || 'projectile';
    const target = targetFor(def, direction, from, to);
    const powerScale = meta.critical ? 1.35 : meta.effectiveness > 1 ? 1.18 : meta.effectiveness > 0 && meta.effectiveness < 1 ? 0.82 : 1;
    const noEffect = meta.effectiveness === 0 || meta.noEffect;

    if (onAttack) onAttack();
    if (def?.background) flashOverlay(def.background, Math.max(360, duration), meta.critical ? 0.34 : 0.18);
    if (meta.critical) flashOverlay('#ffffff', 180, 0.42, Math.max(80, duration * 0.45));
    if (def?.overlay && !meta.missed) playOverlay(def.overlay, target, color);
    if (meta.missed) {
      playMiss(from, to, color, sprite, duration);
      return;
    }

    const triggerHit = (delay = 0) => {
      if (onHit) setTimeout(onHit, delay);
      if (def?.shake && !noEffect) setTimeout(() => shakeLayer(meta.critical ? 'heavy' : def.shake), delay);
    };

    if (noEffect) {
      spawnRing(target, '#94a3b8', { duration: 360, endSize: 70, opacity: 0.28, borderWidth: 2 });
      flashOverlay('#64748b', 160, 0.16);
      return;
    }

    switch (animType) {
      case 'projectile':
        for (let i = 0; i < clampCount(count, 6); i++) {
          spawnSprite(sprite, { x: from.x + jitter(4), y: from.y + jitter(4) }, { x: target.x + jitter(8), y: target.y + jitter(8) }, {
            duration,
            delay: i * 50,
            startScale: 0.28,
            endScale: 1.6 * powerScale,
            filter: `drop-shadow(0 0 8px ${color})`,
          });
        }
        flashOverlay(color, 110, 0.18);
        triggerHit(duration * 0.78);
        break;

      case 'projectile_trail':
        for (let i = 0; i < clampCount(count, 8); i++) {
          spawnSprite(sprite, from, { x: target.x + jitter(14), y: target.y + jitter(14) }, {
            duration: duration * 0.8,
            delay: i * 45,
            startScale: 0.24,
            endScale: 1.45 * powerScale,
            filter: `drop-shadow(0 0 8px ${color})`,
          });
        }
        flashOverlay(color, 120, 0.16);
        triggerHit(duration * 0.68);
        break;

      case 'multi_projectile':
        for (let i = 0; i < clampCount(count, 8); i++) {
          const lane = (i % 3) - 1;
          spawnSprite(sprite, { x: from.x + jitter(5), y: from.y + lane * 5 + jitter(4) }, { x: target.x + jitter(16), y: target.y + lane * 8 + jitter(10) }, {
            duration: duration * 0.58,
            delay: i * 74,
            startScale: 0.22,
            endScale: 1.35 * powerScale,
            rotateEnd: 180 + i * 32,
            filter: `drop-shadow(0 0 8px ${color})`,
          });
        }
        flashOverlay(color, 120, 0.15);
        triggerHit(duration * 0.42);
        break;

      case 'stream':
      case 'high_frequency_stream':
        for (let i = 0; i < clampCount(count * 2, 22); i++) {
          spawnSprite(sprite, { x: from.x + jitter(4), y: from.y + jitter(4) }, { x: target.x + jitter(18), y: target.y + jitter(18) }, {
            duration: duration * 0.56,
            delay: i * 26,
            startScale: 0.18,
            endScale: 1.35 * powerScale,
            endOpacity: 0,
            filter: `drop-shadow(0 0 9px ${color})`,
          });
        }
        spawnBeam(from, target, color, { duration: duration * 0.7, delay: 80, width: 7 * powerScale, opacity: 0.44 });
        flashOverlay(color, 180, 0.18);
        triggerHit(140);
        break;

      case 'beam':
        spawnBeam(from, target, color, { duration, width: 10 * powerScale, opacity: 0.78 });
        for (let i = 0; i < clampCount(count, 8); i++) {
          spawnSprite(sprite, { x: from.x + (target.x - from.x) * (i / count), y: from.y + (target.y - from.y) * (i / count) }, target, {
            duration: duration * 0.65,
            delay: i * 34,
            startScale: 0.2,
            endScale: 1.8 * powerScale,
            size: 52,
            blend: 'screen',
            filter: `drop-shadow(0 0 10px ${color})`,
          });
        }
        flashOverlay(color, 180, 0.18);
        triggerHit(duration * 0.55);
        break;

      case 'charge_projectile':
        for (let i = 0; i < 4; i++) {
          spawnRing(from, color, { duration: 320, delay: i * 70, endSize: 48 + i * 12, opacity: 0.34 });
        }
        spawnSprite(sprite, from, from, {
          duration: 260,
          startScale: 0.08,
          endScale: 1.45 * powerScale,
          endOpacity: 0.65,
          blend: 'screen',
          filter: `drop-shadow(0 0 12px ${color})`,
        });
        for (let i = 0; i < clampCount(count, 8); i++) {
          spawnSprite(sprite, { x: from.x + jitter(5), y: from.y + jitter(5) }, { x: target.x + jitter(12), y: target.y + jitter(12) }, {
            duration: duration * 0.55,
            delay: 240 + i * 36,
            startScale: 0.35,
            endScale: 1.8 * powerScale,
            filter: `drop-shadow(0 0 10px ${color})`,
          });
        }
        flashOverlay(color, 180, 0.2, 220);
        triggerHit(260 + duration * 0.35);
        break;

      case 'charge_beam':
        for (let i = 0; i < 4; i++) spawnRing(from, color, { duration: 360, delay: i * 90, endSize: 70 + i * 20, opacity: 0.42 });
        spawnBeam(from, target, color, { duration: duration * 0.62, delay: 280, width: 14 * powerScale, opacity: 0.86 });
        for (let i = 0; i < clampCount(count, 10); i++) {
          spawnSprite(sprite, from, target, {
            duration: duration * 0.48,
            delay: 260 + i * 36,
            startScale: 0.3,
            endScale: 2.4 * powerScale,
            blend: 'screen',
            filter: `drop-shadow(0 0 12px ${color})`,
          });
        }
        flashOverlay(color, 240, 0.22, 260);
        triggerHit(duration * 0.72);
        break;

      case 'lightning_strike':
        flashOverlay('#020617', duration, 0.22);
        for (let i = 0; i < clampCount(count, 7); i++) {
          spawnSprite('lightning', { x: target.x + jitter(18), y: -12 }, { x: target.x + jitter(10), y: target.y + jitter(8) }, {
            duration: 190,
            delay: i * 85,
            startScale: 0.35,
            endScale: 1.35 * powerScale,
            easing: 'linear',
            filter: `drop-shadow(0 0 12px ${color})`,
          });
        }
        triggerHit(160);
        break;

      case 'dual_impact':
        spawnSprite('topbite', { x: target.x, y: target.y - 25 }, target, { duration: 250, startScale: 1.55, endScale: 1.65 * powerScale });
        spawnSprite('bottombite', { x: target.x, y: target.y + 25 }, target, { duration: 250, startScale: 1.55, endScale: 1.65 * powerScale });
        flashOverlay(color, 100, 0.2);
        triggerHit(190);
        break;

      case 'burst':
      case 'sparkle_burst': {
        const n = clampCount(count, 12);
        for (let i = 0; i < n; i++) {
          const angle = (i / n) * 2 * Math.PI;
          spawnSprite(sprite, target, { x: target.x + Math.cos(angle) * 20, y: target.y + Math.sin(angle) * 20 }, {
            duration: duration * 0.66,
            delay: i * 28,
            startScale: 0.15,
            endScale: 1.55 * powerScale,
            rotateEnd: 180,
            blend: animType === 'sparkle_burst' ? 'screen' : 'normal',
            filter: `drop-shadow(0 0 9px ${color})`,
          });
        }
        spawnRing(target, color, { duration: duration * 0.6, endSize: 120 * powerScale, opacity: 0.42 });
        flashOverlay(color, 170, 0.22);
        triggerHit(60);
        break;
      }

      case 'delayed_burst': {
        for (let i = 0; i < 3; i++) spawnRing(target, color, { duration: 360, delay: i * 120, endSize: 70 + i * 28, opacity: 0.28 });
        for (let i = 0; i < clampCount(count, 12); i++) {
          const angle = (i / count) * Math.PI * 2;
          spawnSprite(sprite, { x: target.x + Math.cos(angle) * 30, y: target.y + Math.sin(angle) * 22 }, target, {
            duration: duration * 0.42,
            delay: 360 + i * 34,
            startScale: 0.18,
            endScale: 1.9 * powerScale,
            blend: 'screen',
            filter: `drop-shadow(0 0 12px ${color})`,
          });
        }
        flashOverlay(color, 260, 0.22, 340);
        triggerHit(duration * 0.58);
        break;
      }

      case 'tri_burst': {
        const triColors = [TYPE_COLORS.Fire, TYPE_COLORS.Electric, TYPE_COLORS.Ice];
        triColors.forEach((triColor, index) => {
          spawnBeam(from, target, triColor, { duration: duration * 0.62, delay: index * 80, width: 6 * powerScale, opacity: 0.58 });
          spawnSprite(sprite, from, { x: target.x + jitter(10), y: target.y + jitter(10) }, {
            duration: duration * 0.55,
            delay: index * 85,
            startScale: 0.2,
            endScale: 1.7 * powerScale,
            blend: 'screen',
            filter: `drop-shadow(0 0 10px ${triColor})`,
          });
        });
        flashOverlay('#ffffff', 140, 0.22, 180);
        triggerHit(duration * 0.52);
        break;
      }

      case 'impact_flash':
      case 'impact_multi':
      case 'contact_attack': {
        if (animType === 'contact_attack') {
          spawnSprite(sprite, from, { x: target.x + jitter(6), y: target.y + jitter(6) }, {
            duration: duration * 0.75,
            startScale: 0.35,
            endScale: 1.4 * powerScale,
            endOpacity: 0.25,
          });
        }
        const hits = animType === 'impact_multi' ? clampCount(count, 6) : clampCount(count || 3, 5);
        for (let i = 0; i < hits; i++) {
          const hit = { x: target.x + jitter(18), y: target.y + jitter(18) };
          spawnSprite(sprite || 'impact', hit, hit, {
            duration: 240,
            delay: 70 + i * 60,
            startScale: 0.1,
            endScale: 2.1 * powerScale,
            endOpacity: 0,
            filter: `drop-shadow(0 0 8px ${color})`,
          });
        }
        flashOverlay(color, 110, 0.18);
        triggerHit(animType === 'contact_attack' ? duration * 0.6 : 70);
        break;
      }

      case 'slash':
        for (let i = 0; i < clampCount(count, 5); i++) {
          const offset = i * 7;
          spawnSprite(i % 2 ? 'leftslash' : sprite, { x: target.x - 18, y: target.y - 13 + offset }, { x: target.x + 18, y: target.y + 12 - offset }, {
            duration: 220,
            delay: i * 55,
            startScale: 0.45,
            endScale: 1.8 * powerScale,
            filter: `drop-shadow(0 0 8px ${color})`,
          });
        }
        flashOverlay(color, 90, 0.16);
        triggerHit(120);
        break;

      case 'drain':
      case 'drain_hit': {
        if (animType === 'drain_hit') {
          spawnSprite(sprite, from, target, { duration: 260, startScale: 0.3, endScale: 1.6, endOpacity: 0.35 });
        }
        const half = Math.floor(duration * 0.48);
        for (let i = 0; i < clampCount(count, 8); i++) {
          spawnSprite(sprite || 'wisp', target, from, {
            duration: half,
            delay: 120 + i * 55,
            startScale: 1.0,
            endScale: 0.2,
            startOpacity: 0.9,
            endOpacity: 0,
            filter: `drop-shadow(0 0 10px ${TYPE_COLORS.Grass})`,
          });
        }
        flashOverlay(TYPE_COLORS.Grass, 220, 0.22);
        triggerHit(120);
        break;
      }

      case 'quake':
        shakeLayer(def?.shake || 'medium');
        for (let i = 0; i < clampCount(count, 12); i++) {
          const rx = 8 + Math.random() * 84;
          spawnSprite(sprite, { x: rx, y: 96 }, { x: rx + jitter(8), y: 55 + jitter(12) }, {
            duration: 330,
            delay: i * 58,
            startScale: 0.35,
            endScale: 1.5 * powerScale,
            endOpacity: 0,
          });
        }
        flashOverlay(color, 220, 0.2);
        triggerHit(180);
        break;

      case 'rock_rise':
      case 'ground_burst':
        for (let i = 0; i < clampCount(count, 10); i++) {
          spawnSprite(sprite, { x: target.x + jitter(34), y: target.y + 30 }, { x: target.x + jitter(22), y: target.y + jitter(18) }, {
            duration: 360,
            delay: i * 50,
            startScale: 0.25,
            endScale: 1.4 * powerScale,
            endOpacity: 0,
          });
        }
        spawnRing(target, color, { duration: 380, endSize: 105, opacity: 0.36 });
        triggerHit(130);
        break;

      case 'rock_rain':
      case 'meteor_rain':
        for (let i = 0; i < clampCount(count, 14); i++) {
          spawnSprite(sprite, { x: target.x + jitter(70), y: -10 }, { x: target.x + jitter(32), y: target.y + jitter(18) }, {
            duration: 420,
            delay: i * 55,
            startScale: animType === 'meteor_rain' ? 0.45 : 0.3,
            endScale: 1.55 * powerScale,
            rotateEnd: 220,
            filter: animType === 'meteor_rain' ? `drop-shadow(0 0 12px ${color})` : '',
          });
        }
        flashOverlay(color, 240, 0.22);
        triggerHit(260);
        break;

      case 'leaf_swirl':
      case 'gust':
      case 'snowstorm':
      case 'screen_waves':
        for (let i = 0; i < clampCount(count, 16); i++) {
          const start = animType === 'snowstorm'
            ? { x: Math.random() * 100, y: -8 }
            : { x: from.x + jitter(20), y: from.y + jitter(10) };
          const end = animType === 'screen_waves'
            ? { x: 100 + Math.random() * 10, y: target.y + jitter(35) }
            : { x: target.x + jitter(30), y: target.y + jitter(28) };
          spawnSprite(sprite, start, end, {
            duration: duration * (0.65 + Math.random() * 0.35),
            delay: i * 40,
            startScale: 0.25,
            endScale: 1.2 * powerScale,
            rotateEnd: 240,
            endOpacity: 0,
            filter: `drop-shadow(0 0 8px ${color})`,
          });
        }
        flashOverlay(color, 220, 0.14);
        triggerHit(duration * 0.55);
        break;

      case 'vortex': {
        const n = clampCount(count, 16);
        for (let i = 0; i < n; i++) {
          const angle = (i / n) * Math.PI * 2;
          const radius = 34 - (i % 4) * 5;
          const start = { x: target.x + Math.cos(angle) * radius, y: target.y + Math.sin(angle) * radius * 0.6 };
          const end = { x: target.x + Math.cos(angle + 1.9) * 8, y: target.y + Math.sin(angle + 1.9) * 6 };
          spawnSprite(sprite, start, end, {
            duration: duration * 0.72,
            delay: i * 42,
            startScale: 0.25,
            endScale: 1.35 * powerScale,
            rotateEnd: 360,
            blend: 'screen',
            filter: `drop-shadow(0 0 9px ${color})`,
          });
        }
        spawnRing(target, color, { duration: duration * 0.7, endSize: 112, opacity: 0.34 });
        flashOverlay(color, 180, 0.16);
        triggerHit(duration * 0.5);
        break;
      }

      case 'ice_beam':
        spawnBeam(from, target, color, { duration, width: 9 * powerScale, opacity: 0.68 });
        for (let i = 0; i < clampCount(count, 8); i++) {
          spawnSprite('icicle', { x: from.x + (target.x - from.x) * ((i + 1) / (count + 1)), y: from.y + (target.y - from.y) * ((i + 1) / (count + 1)) }, target, {
            duration: duration * 0.6,
            delay: i * 38,
            startScale: 0.35,
            endScale: 1.65 * powerScale,
            endOpacity: 0,
            filter: `drop-shadow(0 0 10px ${color})`,
          });
        }
        spawnRing(target, color, { duration: 440, delay: duration * 0.45, endSize: 90, opacity: 0.35 });
        triggerHit(duration * 0.6);
        break;

      case 'psychic_wave':
      case 'pulse':
      case 'dragon_pulse':
      case 'electric_field':
        for (let i = 0; i < clampCount(count, 8); i++) {
          spawnRing(target, color, { duration: 360, delay: i * 80, endSize: 65 + i * 14, opacity: 0.5, borderWidth: 2 });
          spawnSprite(sprite, { x: from.x + jitter(12), y: from.y + jitter(12) }, target, {
            duration: duration * 0.55,
            delay: i * 48,
            startScale: 0.22,
            endScale: 1.7 * powerScale,
            endOpacity: 0.12,
            blend: 'screen',
            filter: `drop-shadow(0 0 10px ${color})`,
          });
        }
        flashOverlay(color, 220, 0.2);
        triggerHit(duration * 0.48);
        break;

      case 'shadow_orbs':
      case 'poison_cloud':
      case 'status_cloud':
        for (let i = 0; i < clampCount(count, 10); i++) {
          spawnSprite(sprite, { x: from.x + jitter(26), y: from.y + jitter(26) }, { x: target.x + jitter(24), y: target.y + jitter(24) }, {
            duration: duration * 0.72,
            delay: i * 58,
            startScale: 0.25,
            endScale: 1.6 * powerScale,
            startOpacity: 0.75,
            endOpacity: 0,
            filter: `drop-shadow(0 0 10px ${color})`,
          });
        }
        flashOverlay(color, 220, 0.2);
        triggerHit(duration * 0.55);
        break;

      case 'status_swords':
        for (let i = 0; i < clampCount(count, 6); i++) {
          const angle = (i / count) * Math.PI * 2;
          spawnSprite(sprite, { x: from.x + Math.cos(angle) * 16, y: from.y + Math.sin(angle) * 16 }, from, {
            duration: duration * 0.6,
            delay: i * 70,
            startScale: 0.45,
            endScale: 1.15,
            rotateEnd: 270,
            filter: `drop-shadow(0 0 8px ${color})`,
          });
        }
        spawnRing(from, color, { duration, endSize: 100, opacity: 0.45 });
        triggerHit(duration * 0.35);
        break;

      case 'status_orbit': {
        const center = def?.self ? from : target;
        const n = clampCount(count, 8);
        for (let i = 0; i < n; i++) {
          const angle = (i / n) * Math.PI * 2;
          spawnSprite(sprite, { x: center.x + Math.cos(angle) * 24, y: center.y + Math.sin(angle) * 17 }, { x: center.x + Math.cos(angle + 1.6) * 12, y: center.y + Math.sin(angle + 1.6) * 9 }, {
            duration: duration * 0.72,
            delay: i * 58,
            startScale: 0.28,
            endScale: 1.05,
            rotateEnd: 270,
            blend: 'screen',
            filter: `drop-shadow(0 0 10px ${color})`,
          });
        }
        spawnRing(center, color, { duration, endSize: 95, opacity: 0.38 });
        flashOverlay(color, 160, 0.12);
        triggerHit(duration * 0.35);
        break;
      }

      case 'barrier':
      case 'protect': {
        const center = def?.self ? from : target;
        spawnShield(center, color, { duration, opacity: animType === 'protect' ? 0.56 : 0.44 });
        for (let i = 0; i < clampCount(count, 8); i++) {
          spawnRing(center, color, { duration: 320, delay: i * 55, endSize: 42 + i * 12, opacity: 0.22, borderWidth: 2 });
        }
        flashOverlay(color, 160, 0.1);
        triggerHit(120);
        break;
      }

      case 'trap_field':
        for (let i = 0; i < clampCount(count, 10); i++) {
          const baseX = target.x - 28 + i * 7 + jitter(5);
          spawnSprite(sprite, { x: baseX, y: target.y + 34 }, { x: baseX + jitter(4), y: target.y + 16 + jitter(6) }, {
            duration: 420,
            delay: i * 48,
            startScale: 0.18,
            endScale: 0.95,
            endOpacity: 0.58,
            rotateEnd: 90 + i * 15,
            filter: `drop-shadow(0 0 7px ${color})`,
          });
        }
        spawnRing(target, color, { duration: 520, endSize: 130, opacity: 0.25 });
        triggerHit(180);
        break;

      case 'status_aura':
      case 'status_rings':
      case 'field_effect':
      case 'weather_rain':
      case 'weather_sun':
      case 'weather_sand':
      case 'heal':
        for (let i = 0; i < clampCount(count, 12); i++) {
          const center = def?.self ? from : target;
          spawnRing(center, color, { duration: 360 + i * 25, delay: i * 65, endSize: 48 + i * 11, opacity: animType === 'heal' ? 0.5 : 0.34 });
          spawnSprite(sprite, { x: center.x + jitter(28), y: center.y + 20 + jitter(10) }, { x: center.x + jitter(18), y: center.y - 28 + jitter(16) }, {
            duration: 520,
            delay: i * 55,
            startScale: 0.18,
            endScale: 0.95,
            endOpacity: 0,
            blend: 'screen',
            filter: `drop-shadow(0 0 8px ${color})`,
          });
        }
        flashOverlay(color, 240, animType === 'heal' ? 0.16 : 0.12);
        triggerHit(100);
        break;

      case 'wave':
        for (let i = 0; i < clampCount(count, 8); i++) {
          spawnRing({ x: from.x + i * 7, y: from.y - 4 }, color, { duration: duration * 0.65, delay: i * 70, endSize: 95, opacity: 0.3 });
          spawnSprite(sprite, { x: from.x + i * 8, y: from.y }, { x: target.x + jitter(12), y: target.y + jitter(8) }, {
            duration,
            delay: i * 65,
            startScale: 0.3,
            endScale: 1.8 * powerScale,
            filter: `drop-shadow(0 0 9px ${color})`,
          });
        }
        flashOverlay(color, 180, 0.18);
        triggerHit(duration * 0.78);
        break;

      case 'sound_wave':
        for (let i = 0; i < clampCount(count, 10); i++) {
          const t = i / Math.max(1, count - 1);
          const center = { x: from.x + (target.x - from.x) * t, y: from.y + (target.y - from.y) * t };
          spawnRing(center, color, { duration: 360, delay: i * 55, endSize: 48 + i * 9, opacity: 0.32, borderWidth: 2 });
        }
        spawnBeam(from, target, color, { duration: duration * 0.65, delay: 60, width: 18 * powerScale, opacity: 0.22 });
        flashOverlay(color, 160, 0.14);
        triggerHit(duration * 0.5);
        break;

      default:
        spawnSprite(sprite, from, target, { duration, startScale: 0.35, endScale: 1.8 * powerScale });
        flashOverlay(color, 100, 0.16);
        triggerHit(duration * 0.75);
    }
  }, [flashOverlay, playMiss, playOverlay, shakeLayer, spawnBeam, spawnRing, spawnShield, spawnSprite]);

  useImperativeHandle(ref, () => ({
    play: playAnimation,
  }), [playAnimation]);

  return (
    <div
      ref={layerRef}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 25,
        borderRadius: 'inherit',
      }}
    />
  );
});

MoveAnimationLayer.displayName = 'MoveAnimationLayer';
export default MoveAnimationLayer;
