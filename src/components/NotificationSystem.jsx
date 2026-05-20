import React, { useState, useEffect, useCallback } from 'react';
import { getPokemonSpriteUrl } from '../utils/pokemonSprites';

const NOTIF_COLORS = {
  success:    { bg: '#dcfce7', border: '#86efac', text: '#166534', icon: 'OK' },
  warning:    { bg: '#fef9c3', border: '#fde047', text: '#854d0e', icon: '!' },
  info:       { bg: '#dbeafe', border: '#93c5fd', text: '#1e3a5f', icon: 'i' },
  quest:      { bg: '#f3e8ff', border: '#c084fc', text: '#581c87', icon: 'Q' },
  expedition: { bg: '#fef3c7', border: '#fcd34d', text: '#78350f', icon: 'EXP' },
  harvest:    { bg: '#d1fae5', border: '#6ee7b7', text: '#065f46', icon: 'COL' },
  capture:    { bg: '#dbeafe', border: '#93c5fd', text: '#1e40af', icon: 'CAP' },
  level_up:   { bg: '#fef9c3', border: '#fde047', text: '#713f12', icon: 'LV' },
};

let _addNotification = null;
let _lastNotificationKey = '';
let _lastNotificationAt = 0;

export const notify = (notif, typeArg) => {
  // Suporte ao formato legado: notify('mensagem', 'tipo')
  if (typeof notif === 'string') {
    notif = { type: typeArg || 'info', message: notif };
  }
  if (!notif || typeof notif !== 'object') return;
  const key = `${notif.type || ''}|${notif.title || ''}|${notif.message || ''}`;
  const now = Date.now();
  if (key === _lastNotificationKey && now - _lastNotificationAt < 1200) return;
  _lastNotificationKey = key;
  _lastNotificationAt = now;
  if (_addNotification) setTimeout(() => _addNotification && _addNotification(notif), 0);
};

const NotificationSystem = () => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((notif) => {
    const id = Date.now() + Math.random();
    setNotifications(prev => [...prev.slice(-4), { ...notif, id }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, notif.duration || 4000);
  }, []);

  useEffect(() => {
    _addNotification = addNotification;
    return () => { _addNotification = null; };
  }, [addNotification]);

  return (
    <div className="fixed top-[72px] left-1/2 z-[9999] flex w-[min(calc(100vw-24px),406px)] -translate-x-1/2 flex-col gap-2">
      {notifications.map(n => {
        const cfg = NOTIF_COLORS[n.type] || NOTIF_COLORS.info;
        const levelSprite = n.type === 'level_up' && n.pokemonId
          ? getPokemonSpriteUrl(n)
          : null;
        return (
          <button
            type="button"
            key={n.id}
            className={`flex w-full cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 text-left shadow-xl transition-all animate-slideInRight hover:scale-[1.02] active:scale-95 ${n.type === 'level_up' ? 'border-2' : ''}`}
            style={{
              background: n.type === 'level_up' ? 'linear-gradient(135deg, #fff7ed 0%, #fef9c3 50%, #dcfce7 100%)' : cfg.bg,
              borderColor: cfg.border,
            }}
            onClick={() => setNotifications(prev => prev.filter(x => x.id !== n.id))}
          >
            {levelSprite ? (
              <span className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-2 border-yellow-300 bg-white shadow-inner">
                <img src={levelSprite} className="h-12 w-12 object-contain" alt="" />
                <span className="absolute -right-1 -top-1 rounded-full bg-yellow-400 px-1.5 py-0.5 text-[8px] font-black text-yellow-950 shadow">LV</span>
              </span>
            ) : (
              <span className="shrink-0 rounded-lg bg-white/60 px-2 py-1 text-[10px] font-black" style={{ color: cfg.text }}>
                {n.icon || cfg.icon}
              </span>
            )}
            <span className="min-w-0">
              {n.title && (
                <span className="block font-black text-xs uppercase leading-tight" style={{ color: cfg.text }}>
                  {n.title}
                </span>
              )}
              {n.message && (
                <span className="mt-1 block text-[10px] font-bold leading-tight" style={{ color: cfg.text, opacity: 0.8 }}>
                  {n.message}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default NotificationSystem;
