import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { MAX_AVATARS, checkNickAvailable, createAvatarSlot, deleteAvatarSlot, getSlotDocId } from '../services/avatars';
import { trainerAvatars } from '../data/constants';

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

const SLOT_BORDER_ACTIVE = {
  1: 'border-red-500/70',
  2: 'border-blue-500/70',
  3: 'border-green-500/70',
};

function getTrainerImg(profile) {
  // Preferência: avatarImg (URL completa salva pelo handleSelectAvatar)
  const raw = profile?.avatarImg || profile?.avatar;
  if (!raw) return null;
  // URL direta
  if (typeof raw === 'string' && raw.startsWith('http')) return raw;
  // ID de trainerAvatars ('red', 'leaf', etc.)
  const found = trainerAvatars.find(a => a.id === raw);
  if (found) return found.img;
  // Fallback: tenta como sprite do Showdown pelo nome
  if (typeof raw === 'string') return `https://play.pokemonshowdown.com/sprites/trainers/${raw}.png`;
  return null;
}

function getRegionLabel(worldFlags = []) {
  const order = ['paldea','galar','alola','kalos','unova','sinnoh','hoenn','johto','kanto'];
  const championFlags = {
    paldea: 'paldea_champion', galar: 'galar_champion', alola: 'alola_champion',
    kalos: 'kalos_champion', unova: 'unova_champion', sinnoh: 'sinnoh_champion',
    hoenn: 'hoenn_champion', johto: 'johto_champion', kanto: 'champion',
  };
  const regionNames = {
    paldea: 'Paldea', galar: 'Galar', alola: 'Alola', kalos: 'Kalos',
    unova: 'Unova', sinnoh: 'Sinnoh', hoenn: 'Hoenn', johto: 'Johto', kanto: 'Kanto',
  };
  const flags = new Set(worldFlags || []);
  for (const region of order) {
    if (flags.has(championFlags[region])) return `Campeão de ${regionNames[region]}`;
  }
  // Se não é campeão de nada, mostra a região mais avançada com insígnias
  return null;
}

export default function AvatarSelectScreen({ uid, avatarMeta, onSelectSlot, onMetaUpdate, onLogout }) {
  const [creating, setCreating] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [nick, setNick] = useState('');
  const [nickStatus, setNickStatus] = useState('idle');
  const [actionError, setActionError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [profiles, setProfiles] = useState({}); // slot → profile data
  const [profilesLoading, setProfilesLoading] = useState(true);
  const [showBackups, setShowBackups] = useState(null); // { slot, trainerName }
  const [backupsList, setBackupsList] = useState([]);
  const [backupsLoading, setBackupsLoading] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const nickCheckTimer = useRef(null);

  const handleOpenBackups = async (slot, name) => {
    setShowBackups({ slot, trainerName: name });
    setBackupsLoading(true);
    setBackupsList([]);
    try {
      const { collection, getDocs, query, orderBy } = await import('firebase/firestore');
      const LZString = (await import('lz-string')).default;
      
      const docId = getSlotDocId(uid, slot);
      const snapsRef = collection(db, 'saves', docId, 'snapshots');
      const q = query(snapsRef, orderBy('createdAt', 'desc'));
      const snaps = await getDocs(q);
      
      const list = [];
      snaps.forEach(docSnap => {
        const data = docSnap.data();
        let label = 'Backup sem detalhes';
        try {
          if (data.compressedState) {
            const decompressed = LZString.decompress(data.compressedState);
            if (decompressed) {
              const state = JSON.parse(decompressed);
              const lvl = state.trainer?.level || 1;
              const bCount = state.badges?.length || 0;
              const cCount = Object.keys(state.caughtData || {}).length;
              label = `Nível ${lvl} · ${bCount} Insígnias · ${cCount} Pokémon`;
            }
          }
        } catch (e) {
          console.warn('Erro ao decodificar backup para label:', e);
        }
        
        list.push({
          id: docSnap.id,
          label,
          data: data,
        });
      });
      setBackupsList(list);
    } catch (err) {
      console.error('Erro ao buscar backups:', err);
    } finally {
      setBackupsLoading(false);
    }
  };

  const handleRestoreBackup = async (backup) => {
    if (!showBackups) return;
    const { slot } = showBackups;
    const docId = getSlotDocId(uid, slot);
    
    if (!window.confirm(`Tem certeza que deseja restaurar o backup de ${backup.id}?\nO save atual deste slot será substituído.`)) {
      return;
    }
    
    setRestoring(true);
    try {
      const { doc, setDoc } = await import('firebase/firestore');
      const LZString = (await import('lz-string')).default;
      
      // 1. Restaura o compressedState no save principal
      await setDoc(doc(db, 'saves', docId), {
        compressedState: backup.data.compressedState,
        updatedAtClient: Date.now(),
      }, { merge: true });
      
      // 2. Atualiza o perfil público (users/{docId}) a partir dos dados do backup
      try {
        const decompressed = LZString.decompress(backup.data.compressedState);
        if (decompressed) {
          const state = JSON.parse(decompressed);
          
          await setDoc(doc(db, 'users', docId), {
            name: state.trainer?.name || 'Treinador',
            level: state.trainer?.level || 1,
            avatar: state.trainer?.avatar || null,
            avatarImg: state.trainer?.avatarImg || state.trainer?.avatar || null,
            badges: state.badges?.length || 0,
            caughtCount: Object.keys(state.caughtData || {}).length,
            powerScore: 0,
            worldFlags: state.worldFlags || [],
            playerStats: state.playerStats || {},
            updatedAt: Date.now()
          }, { merge: true });
        }
      } catch (errProfile) {
        console.error('Erro ao atualizar perfil durante restore:', errProfile);
      }
      
      alert('Backup restaurado com sucesso! O jogo será recarregado.');
      window.location.reload();
    } catch (err) {
      alert('Erro ao restaurar backup: ' + err.message);
    } finally {
      setRestoring(false);
    }
  };

  const avatars = avatarMeta?.avatars || [];
  const usedSlots = new Set(avatars.map(a => a.slot));
  const allSlots = [1, 2, 3];

  // Carrega perfis públicos de cada slot existente
  useEffect(() => {
    if (!uid || avatars.length === 0) { setProfilesLoading(false); return; }
    let cancelled = false;
    setProfilesLoading(true);
    Promise.all(
      avatars.map(async (av) => {
        try {
          const docId = getSlotDocId(uid, av.slot);
          const snap = await getDoc(doc(db, 'users', docId));
          return { slot: av.slot, data: snap.exists() ? snap.data() : null };
        } catch {
          return { slot: av.slot, data: null };
        }
      })
    ).then(results => {
      if (cancelled) return;
      const map = {};
      results.forEach(r => { map[r.slot] = r.data; });
      setProfiles(map);
      setProfilesLoading(false);
    });
    return () => { cancelled = true; };
  }, [uid, avatars.length]);

  // Debounced nick check
  useEffect(() => {
    if (!nick.trim() || nick.trim().length < 2) { setNickStatus('idle'); return; }
    setNickStatus('checking');
    clearTimeout(nickCheckTimer.current);
    nickCheckTimer.current = setTimeout(async () => {
      const available = await checkNickAvailable(nick);
      setNickStatus(available ? 'available' : 'taken');
    }, 600);
    return () => clearTimeout(nickCheckTimer.current);
  }, [nick]);

  const handleCreate = async (slot) => {
    if (!nick.trim() || nick.trim().length < 2) { setActionError('Nick deve ter pelo menos 2 caracteres.'); return; }
    if (nickStatus !== 'available') { setActionError('Escolha um nick disponível.'); return; }
    setActionLoading(true); setActionError('');
    try {
      const newMeta = await createAvatarSlot(uid, slot, nick, avatarMeta);
      onMetaUpdate(newMeta);
      setCreating(null); setNick(''); setNickStatus('idle');
      onSelectSlot(slot, newMeta);
    } catch (e) {
      setActionError(e.message || 'Erro ao criar avatar.');
    } finally { setActionLoading(false); }
  };

  const handleDelete = async (slot) => {
    setActionLoading(true); setActionError('');
    try {
      const newMeta = await deleteAvatarSlot(uid, slot, avatarMeta);
      onMetaUpdate(newMeta);
      setDeleting(null);
    } catch (e) {
      setActionError(e.message || 'Erro ao deletar avatar.');
    } finally { setActionLoading(false); }
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

      <div className="w-full max-w-sm flex flex-col gap-3">
        {allSlots.map(slot => {
          const avatar = avatars.find(a => a.slot === slot);
          const isEmpty = !avatar;
          const isCreatingThis = creating === slot;
          const isDeletingThis = deleting === slot;
          const colorClass = SLOT_COLORS[slot];
          const accentClass = SLOT_ACCENT[slot];

          // ── Slot vazio ──
          if (isEmpty && !isCreatingThis) {
            return (
              <button
                key={slot}
                onClick={() => { setCreating(slot); setDeleting(null); setNick(''); setNickStatus('idle'); setActionError(''); }}
                disabled={avatars.length >= MAX_AVATARS}
                className="w-full rounded-2xl border-2 border-dashed border-gray-600 bg-gray-900/40 p-4 flex items-center gap-3 text-gray-500 hover:border-gray-400 hover:text-gray-300 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <span className="text-2xl opacity-40">👤</span>
                <div className="text-left">
                  <p className="font-bold text-sm">Slot {slot} — Vazio</p>
                  <p className="text-xs">Criar novo avatar</p>
                </div>
                <span className="ml-auto text-xl">＋</span>
              </button>
            );
          }

          // ── Formulário de criação ──
          if (isCreatingThis) {
            return (
              <div key={slot} className={`w-full rounded-2xl border-2 bg-gradient-to-b ${colorClass} p-4 flex flex-col gap-3`}>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">👤</span>
                  <span className="font-bold text-white text-sm">Slot {slot} — Criar Avatar</span>
                  <button onClick={() => { setCreating(null); setNick(''); setNickStatus('idle'); setActionError(''); }} className="ml-auto text-gray-400 hover:text-white text-lg">✕</button>
                </div>
                <div>
                  <label className="text-gray-300 text-xs font-bold uppercase tracking-wider mb-1 block">Nick (nome do treinador)</label>
                  <input
                    type="text" value={nick} onChange={e => setNick(e.target.value)}
                    maxLength={16} placeholder="Ex: Ash, Misty, Brock..."
                    className="w-full bg-black/40 border border-white/20 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-white/40"
                    autoFocus
                  />
                  <div className="mt-1 h-4">{nickIndicator()}</div>
                </div>
                {actionError && <p className="text-red-400 text-xs">{actionError}</p>}
                <button
                  onClick={() => handleCreate(slot)}
                  disabled={actionLoading || nickStatus !== 'available'}
                  className={`w-full py-2 rounded-xl font-black text-sm text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed ${accentClass} hover:brightness-110`}
                >
                  {actionLoading ? 'Criando...' : 'Criar Avatar'}
                </button>
              </div>
            );
          }

          // ── Confirmação de deleção ──
          if (isDeletingThis) {
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

          // ── Card do avatar existente ──
          const isLegacy = !!avatar.legacy;
          const profile = profiles[slot];
          const trainerImg = profile ? getTrainerImg(profile) : null;
          // Nome: prefere o perfil público, depois o nick do avatarMeta, depois fallback
          const trainerName = profile?.name || avatar.nick || 'Treinador';
          const trainerLevel = profile?.level || null;
          const badgeCount = profile?.badges ?? null;
          const powerScore = profile?.powerScore ?? null;
          const caughtCount = profile?.caughtCount ?? null;
          const championLabel = profile?.worldFlags ? getRegionLabel(profile.worldFlags) : null;
          const loading = profilesLoading && !profile;
          const hasStats = !loading && (badgeCount !== null || caughtCount !== null || (powerScore !== null && powerScore > 0));

          return (
            <div key={slot} className={`w-full rounded-2xl border-2 bg-gradient-to-b ${colorClass} ${SLOT_BORDER_ACTIVE[slot]} p-0 overflow-hidden flex flex-col`}>
              {/* Topo do card: sprite + info principal */}
              <div className="flex items-center gap-3 p-4 pb-3">
                {/* Sprite do treinador */}
                <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center bg-black/20 rounded-xl overflow-hidden">
                  {loading ? (
                    <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
                  ) : trainerImg ? (
                    <img
                      src={trainerImg}
                      alt={trainerName}
                      className="w-14 h-14 object-contain"
                      onError={e => { e.currentTarget.onerror = null; e.currentTarget.style.display = 'none'; }}
                    />
                  ) : (
                    <span className="text-3xl">🧢</span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="font-black text-white text-base truncate">{trainerName}</p>
                    {trainerLevel && (
                      <span className="text-xs text-gray-400 font-semibold flex-shrink-0">Lv.{trainerLevel}</span>
                    )}
                  </div>

                  {championLabel ? (
                    <p className="text-yellow-400 text-xs font-bold truncate">{championLabel}</p>
                  ) : (
                    <p className="text-gray-400 text-xs">Slot {slot}{isLegacy ? ' · conta existente' : ''}</p>
                  )}

                  {/* Stats linha — sempre visível quando disponível */}
                  {hasStats && (
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      {badgeCount !== null && (
                        <span className="text-xs text-gray-300">
                          🏅 <span className="font-semibold">{badgeCount}</span> insígnias
                        </span>
                      )}
                      {caughtCount !== null && (
                        <span className="text-xs text-gray-300">
                          📖 <span className="font-semibold">{caughtCount}</span> capturados
                        </span>
                      )}
                      {powerScore !== null && powerScore > 0 && (
                        <span className="text-xs text-gray-300">
                          ⚡ <span className="font-semibold">{powerScore.toLocaleString('pt-BR')}</span>
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Botão backups */}
                <button
                  onClick={() => handleOpenBackups(slot, trainerName)}
                  className="text-gray-500 hover:text-blue-400 transition-colors text-sm p-1 flex-shrink-0 self-start mr-1"
                  title="Histórico de Backups"
                >
                  ☁️
                </button>

                {/* Botão deletar */}
                {!isLegacy && (
                  <button
                    onClick={() => { setDeleting(slot); setCreating(null); setActionError(''); }}
                    className="text-slate-600 hover:text-red-400 transition-colors text-sm p-1 flex-shrink-0 self-start"
                    title="Deletar avatar"
                  >
                    🗑
                  </button>
                )}
              </div>

              {/* Botão jogar */}
              <button
                onClick={() => onSelectSlot(slot, avatarMeta)}
                className={`w-full py-2.5 font-black text-sm text-white transition-all ${accentClass} hover:brightness-110 active:scale-[0.98]`}
              >
                {`Jogar como ${trainerName}`}
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-6 text-center flex flex-col gap-3 items-center">
        <button
          onClick={async () => {
            try {
              const docId = getSlotDocId(uid, 1);
              const { doc, getDoc, setDoc } = await import('firebase/firestore');
              const saveRef = doc(db, 'saves', docId);
              const snap = await getDoc(saveRef);
              if (snap.exists()) {
                const data = snap.data();
                if (data.backupGameState) {
                  const LZString = (await import('lz-string')).default;
                  const compressed = LZString.compressToBase64(JSON.stringify(data.backupGameState));
                  await setDoc(saveRef, {
                    compressedState: compressed,
                    updatedAtClient: Date.now(),
                  }, { merge: true });
                  alert('Save do Treinador MATOBA restaurado com sucesso! Recarregando a página...');
                  window.location.reload();
                } else {
                  alert('Nenhum backupGameState encontrado para este save.');
                }
              } else {
                alert('Save do slot 1 não encontrado no banco de dados.');
              }
            } catch (err) {
              alert('Erro ao restaurar: ' + err.message);
            }
          }}
          className="text-amber-500 hover:text-amber-400 text-xs font-bold transition-colors bg-amber-950/40 border border-amber-500/30 px-4 py-2 rounded-xl cursor-pointer"
        >
          🛠️ Restaurar Save de Emergência (MATOBA)
        </button>

        <button onClick={onLogout} className="text-gray-600 hover:text-gray-400 text-sm transition-colors cursor-pointer">
          Sair da conta
        </button>
      </div>

      {/* Modal de Backups */}
      {showBackups && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 max-h-[85vh] flex flex-col gap-4 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-white font-black text-base uppercase tracking-wider">Histórico de Backups</h3>
                <p className="text-xs text-blue-400 font-bold uppercase">{showBackups.trainerName}</p>
              </div>
              <button 
                onClick={() => { setShowBackups(null); setBackupsList([]); }} 
                className="text-slate-400 hover:text-white text-xl"
                disabled={restoring}
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto min-h-[200px] flex flex-col gap-2.5 py-2">
              {backupsLoading ? (
                <div className="flex flex-col items-center justify-center gap-3 py-10">
                  <div className="w-8 h-8 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
                  <p className="text-slate-400 text-sm">Buscando backups na nuvem...</p>
                </div>
              ) : backupsList.length === 0 ? (
                <div className="text-center py-10 text-slate-500 text-sm">
                  Nenhum backup automático encontrado para este slot.
                </div>
              ) : (
                backupsList.map(backup => (
                  <div key={backup.id} className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-black text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded-md">
                        📅 {backup.id}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-slate-200">{backup.label}</p>
                    <button
                      onClick={() => handleRestoreBackup(backup)}
                      disabled={restoring}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-black uppercase text-xs rounded-xl tracking-wider transition-all"
                    >
                      {restoring ? 'Restaurando...' : 'Restaurar este backup'}
                    </button>
                  </div>
                ))
              )}
            </div>
            
            <p className="text-[10px] text-slate-500 text-center leading-relaxed">
              * Os backups são gerados automaticamente a cada 24 horas de jogo ativo.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
