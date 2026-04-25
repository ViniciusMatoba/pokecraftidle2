import React, { useState, useEffect, useCallback } from 'react';

// Sistema de notificações toast para o jogo
// Uso: notificationSystem.show({ type, title, message, icon })
// Tipos: 'success', 'warning', 'info', 'quest', 'expedition', 'harvest'

const NOTIF_COLORS = {
  success:    { bg: '#dcfce7', border: '#86efac', text: '#166534', icon: '✅' },
  warning:    { bg: '#fef9c3', border: '#fde047', text: '#854d0e', icon: '⚠️' },
  info:       { bg: '#dbeafe', border: '#93c5fd', text: '#1e3a5f', icon: 'ℹ️' },
  quest:      { bg: '#f3e8ff', border: '#c084fc', text: '#581c87', icon: '📋' },
  expedition: { bg: '#fef3c7', border: '#fcd34d', text: '#78350f', icon: '🚀' },
  harvest:    { bg: '#d1fae5', border: '#6ee7b7', text: '#065f46', icon: '🌾' },
  capture:    { bg: '#dbeafe', border: '#93c5fd', text: '#1e40af', icon: '⚪' },
  level_up:   { bg: '#fef9c3', border: '#fde047', text: '#713f12', icon: '⬆️' },
};

let _addNotification = null;

export const notify = (notif) => {
  if (_addNotification) _addNotification(notif);
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
    <div style={{
      position: 'absolute',
      top: '100px',
      right: '12px',
      zIndex: 300,
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      pointerEvents: 'none',
      maxWidth: '260px',
      width: '100%',
    }}>
      {notifications.map(n => {
        const cfg = NOTIF_COLORS[n.type] || NOTIF_COLORS.info;
        return (
          <div
            key={n.id}
            className="rounded-2xl px-4 py-3 shadow-xl border flex items-start gap-3 animate-slideInRight cursor-pointer hover:scale-105 active:scale-95 transition-all"
            style={{ background: cfg.bg, borderColor: cfg.border }}
            onClick={() => setNotifications(prev => prev.filter(x => x.id !== n.id))}
          >
            <span className="text-xl shrink-0">{n.icon || cfg.icon}</span>
            <div className="min-w-0">
              {n.title && (
                <p className="font-black text-xs uppercase leading-none" style={{ color: cfg.text }}>
                  {n.title}
                </p>
              )}
              {n.message && (
                <p className="text-[10px] font-bold mt-0.5 leading-tight" style={{ color: cfg.text, opacity: 0.8 }}>
                  {n.message}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default NotificationSystem;
