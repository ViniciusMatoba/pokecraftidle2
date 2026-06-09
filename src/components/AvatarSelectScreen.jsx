import React, { useState, useEffect, useRef } from 'react';
import { MAX_AVATARS, checkNickAvailable, createAvatarSlot, deleteAvatarSlot } from '../services/avatars';

const SLOT_COLORS = {
  1: 'from-red-900/60 to-red-950/80 border-red-500/40',
  2: 'from-blue-900/60 to-blue-950/80 border-blue-500/40',
  3: 'from-green-900/60 to-green-950/80 border-green-500/40',
};

const SLOT_ACCENT = {
  1: 'bg-red-500',
  2: 'bg-blue-500',
  3: 'bg-green-500',
};

const STARTERS = { 1: '🔴', 2: '🔵', 3: '🟢' };

export default function AvatarSelectScreen({ uid, avatarMeta, onSelectSlot, onMetaUpdate, onLogout }) {
  const [creating, setCreating] = useState(null); // slot being created
  const [deleting, setDeleting] = useState(null); // slot being deleted
  const [nick, setNick] = useState('');
  const [nickStatus, setNickStatus] = useState('idle'); // 'idle'|'checking'|'available'|'taken'
  const [actionError, setActionError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const nickCheckTimer = useRef(null);

  const avatars = avatarMeta?.avatars || [];
  const usedSlots = new Set(avatars.map(a => a.slot));
  const allSlots = [1, 2, 3];

  // Debounced nick availability check
  useEffect(() => {
    if (!nick.trim() || nick.trim().length < 2) {
      setNickStatus('idle');
      return;
    }
    setNickStatus('checking');
    clearTimeout(nickCheckTimer.current);
    nickCheckTimer.current = setTimeout(async () => {
      const available = await checkNickAvailable(nick);
      setNickStatus(available ? 'available' : 'taken');
    }, 600);
    return () => clearTimeout(nickCheckTimer.current);
  }, [nick]);

  const handleCreate = async (slot) => {
    if (!nick.trim() || nick.trim().length < 2) {
      setActionError('Nick deve ter pelo menos 2 caracteres.');
      return;
    }
    if (nickStatus !== 'available') {
      setActionError('Escolha um nick disponível.');
      return;
    }
    setActionLoading(true);
    setActionError('');
    try {
      const newMeta = await createAvatarSlot(uid, slot, nick, avatarMeta);
      onMetaUpdate(newMeta);
      setCreating(null);
      setNick('');
      setNickStatus('idle');
      // Entra direto no avatar recém-criado
      onSelectSlot(slot, newMeta);
    } catch (e) {
      setActionError(e.message || 'Erro ao criar avatar.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (slot) => {
    setActionLoading(true);
    setActionError('');
    try {
      const newMeta = await deleteAvatarSlot(uid, slot, avatarMeta);
      onMetaUpdate(newMeta);
      setDeleting(null);
    } catch (e) {
      setActionError(e.message || 'Erro ao deletar avatar.');
    } finally {
      setActionLoading(false);
    }
  };

  const nickIndicator = () => {
    if (nick.trim().length < 2) return null;
    if (nickStatus === 'checking') return <span className="text-yellow-400 text-xs">Verificando...</span>;
    if (nickStatus === 'available') return <span className="text-green-400 text-xs">✓ Disponível</span>;
    if (nickStatus === 'taken') return <span className="text-red-400 text-xs">✗ Já em uso</span>;
    return null;
  };

  return (
    <div className="h-full flex flex-col items-center justify-center bg-gray-950 p-4 overflow-y-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="text-4xl mb-2">🎮</div>
        <h1 className="text-2xl font-black text-white uppercase tracking-wider">Escolha seu Avatar</h1>
        <p className="text-gray-400 text-sm mt-1">Cada e-mail suporta até {MAX_AVATARS} avatares independentes</p>
      </div>

      {/* Avatar slots */}
      <div className="w-full max-w-sm flex flex-col gap-3">
        {allSlots.map(slot => {
          const avatar = avatars.find(a => a.slot === slot);
          const isEmpty = !avatar;
          const isCreatingThis = creating === slot;
          const isDeletingThis = deleting === slot;
          const colorClass = SLOT_COLORS[slot];

          if (isEmpty && !isCreatingThis) {
            // Slot vazio — botão de criar
            return (
              <button
                key={slot}
                onClick={() => { setCreating(slot); setDeleting(null); setNick(''); setNickStatus('idle'); setActionError(''); }}
                disabled={avatars.length >= MAX_AVATARS}
                className={`w-full rounded-2xl border-2 border-dashed border-gray-600 bg-gray-900/40 p-4 flex items-center gap-3 text-gray-500 hover:border-gray-400 hover:text-gray-300 transition-all disabled:opacity-30 disabled:cursor-not-allowed`}
              >
                <span className="text-2xl">{STARTERS[slot]}</span>
                <div className="text-left">
                  <p className="font-bold text-sm">Slot {slot} — Vazio</p>
                  <p className="text-xs">Criar novo avatar</p>
                </div>
                <span className="ml-auto text-xl">＋</span>
              </button>
            );
          }

          if (isCreatingThis) {
            // Formulário de criação
            return (
              <div key={slot} className={`w-full rounded-2xl border-2 bg-gradient-to-b ${colorClass} p-4 flex flex-col gap-3`}>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{STARTERS[slot]}</span>
                  <span className="font-bold text-white text-sm">Slot {slot} — Criar Avatar</span>
                  <button onClick={() => { setCreating(null); setNick(''); setNickStatus('idle'); setActionError(''); }} className="ml-auto text-gray-400 hover:text-white text-lg">✕</button>
                </div>

                <div>
                  <label className="text-gray-300 text-xs font-bold uppercase tracking-wider mb-1 block">Nick (nome do treinador)</label>
                  <input
                    type="text"
                    value={nick}
                    onChange={e => setNick(e.target.value)}
                    maxLength={16}
                    placeholder="Ex: Ash, Misty, Brock..."
                    className="w-full bg-black/40 border border-white/20 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-white/40"
                    autoFocus
                  />
                  <div className="mt-1 h-4">{nickIndicator()}</div>
                </div>

                {actionError && <p className="text-red-400 text-xs">{actionError}</p>}

                <button
                  onClick={() => handleCreate(slot)}
                  disabled={actionLoading || nickStatus !== 'available'}
                  className={`w-full py-2 rounded-xl font-black text-sm text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed ${SLOT_ACCENT[slot]} hover:brightness-110`}
                >
                  {actionLoading ? 'Criando...' : 'Criar Avatar'}
                </button>
              </div>
            );
          }

          if (isDeletingThis) {
            // Confirmação de deleção
            return (
              <div key={slot} className="w-full rounded-2xl border-2 border-red-500/60 bg-red-950/60 p-4 flex flex-col gap-3">
                <p className="text-white font-bold text-sm">⚠️ Deletar <span className="text-red-300">{avatar.nick}</span>?</p>
                <p className="text-gray-400 text-xs">Todo o progresso deste avatar será perdido permanentemente. Esta ação não pode ser desfeita.</p>
                {actionError && <p className="text-red-400 text-xs">{actionError}</p>}
                <div className="flex gap-2">
                  <button onClick={() => setDeleting(null)} className="flex-1 py-2 rounded-xl bg-gray-700 text-white text-sm font-bold hover:bg-gray-600 transition-all">Cancelar</button>
                  <button onClick={() => handleDelete(slot)} disabled={actionLoading} className="flex-1 py-2 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-500 transition-all disabled:opacity-50">
                    {actionLoading ? 'Deletando...' : 'Confirmar'}
                  </button>
                </div>
              </div>
            );
          }

          // Slot existente
          const isLegacy = !!avatar.legacy;
          const createdDate = avatar.createdAt
            ? new Date(avatar.createdAt).toLocaleDateString('pt-BR')
            : '';

          return (
            <div key={slot} className={`w-full rounded-2xl border-2 bg-gradient-to-b ${colorClass} p-4 flex flex-col gap-2`}>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{STARTERS[slot]}</span>
                <div className="flex-1">
                  {isLegacy
                    ? <p className="font-black text-white text-base">Minha Conta</p>
                    : <p className="font-black text-white text-base">{avatar.nick}</p>
                  }
                  <p className="text-gray-400 text-xs">
                    {isLegacy ? 'Slot 1 · conta existente' : `Slot ${slot}${createdDate ? ` · criado em ${createdDate}` : ''}`}
                  </p>
                </div>
                {!isLegacy && (
                  <button
                    onClick={() => { setDeleting(slot); setCreating(null); setActionError(''); }}
                    className="text-gray-500 hover:text-red-400 transition-colors text-sm p-1"
                    title="Deletar avatar"
                  >
                    🗑
                  </button>
                )}
              </div>
              <button
                onClick={() => onSelectSlot(slot, avatarMeta)}
                className={`w-full py-2.5 rounded-xl font-black text-sm text-white transition-all ${SLOT_ACCENT[slot]} hover:brightness-110 active:scale-95`}
              >
                {isLegacy ? 'Jogar' : `Jogar como ${avatar.nick}`}
              </button>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-6 text-center">
        <button
          onClick={onLogout}
          className="text-gray-600 hover:text-gray-400 text-sm transition-colors"
        >
          Sair da conta
        </button>
      </div>
    </div>
  );
}
