import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  searchUsersByName,
  sendFriendRequest,
  hasPendingRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriendList,
  removeFriend,
  loadFriendRegion,
} from '../services/friends';

/* ─── Constantes ─────────────────────────────────────────────────────────── */

const REGION_CHAMPS = [
  { flag: 'champion',        label: 'Kanto',  color: '#ef4444' },
  { flag: 'johto_champion',  label: 'Johto',  color: '#f59e0b' },
  { flag: 'hoenn_champion',  label: 'Hoenn',  color: '#22c55e' },
  { flag: 'sinnoh_champion', label: 'Sinnoh', color: '#38bdf8' },
  { flag: 'unova_champion',  label: 'Unova',  color: '#64748b' },
  { flag: 'kalos_champion',  label: 'Kalos',  color: '#ec4899' },
  { flag: 'alola_champion',  label: 'Alola',  color: '#f97316' },
  { flag: 'galar_champion',  label: 'Galar',  color: '#8b5cf6' },
  { flag: 'paldea_champion', label: 'Paldea', color: '#14b8a6' },
];

const getSprite = (profile) => {
  const id = profile?.appearance?.spriteId || 'red';
  return `https://play.pokemonshowdown.com/sprites/trainers/${id}.png`;
};

const FALLBACK_SPRITE = 'https://play.pokemonshowdown.com/sprites/trainers/red.png';

/* ─── FriendCard ─────────────────────────────────────────────────────────── */

const FriendCard = ({ profile = {}, children }) => {
  const sprite     = getSprite(profile);
  const flags      = profile.worldFlags || [];
  const champs     = REGION_CHAMPS.filter(r => flags.includes(r.flag));
  const badgeCount = typeof profile.badges === 'number' ? profile.badges : (profile.badgesList?.length ?? profile.badges ?? 0);

  return (
    <div className="bg-white rounded-2xl border-2 border-slate-100 shadow-sm overflow-hidden">
      {/* Info row */}
      <div className="flex items-center gap-3 p-3">
        {/* Avatar */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center shrink-0 border-2 border-slate-200">
          <img
            src={sprite}
            alt={profile.name}
            className="w-14 h-14 object-contain"
            style={{ imageRendering: 'pixelated' }}
            onError={e => { if (e.target.src !== FALLBACK_SPRITE) e.target.src = FALLBACK_SPRITE; }}
          />
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            <p className="font-black text-slate-800 text-sm leading-none">{profile.name || 'Treinador'}</p>
            <span className="text-[10px] font-bold text-slate-400">Nv.{profile.level || 1}</span>
          </div>
          <p className="text-xs font-bold text-amber-500 mt-0.5">
            ⚡ {(profile.powerScore || 0).toLocaleString()} PS
          </p>

          {/* Stats chips */}
          <div className="flex gap-2 mt-1 flex-wrap items-center">
            <span className="text-[10px] font-bold text-slate-500">🏅 {badgeCount}</span>
            <span className="text-[10px] font-bold text-slate-500">📖 {profile.caughtCount || 0}</span>
            {(profile.shinyCapturedCount || 0) > 0 && (
              <span className="text-[10px] font-bold text-yellow-500">✨ {profile.shinyCapturedCount}</span>
            )}
          </div>

          {/* Champion region chips */}
          {champs.length > 0 && (
            <div className="flex gap-1 mt-1.5 flex-wrap">
              {champs.map(r => (
                <span
                  key={r.flag}
                  className="text-[8px] font-black px-1.5 py-0.5 rounded-full text-white leading-none"
                  style={{ background: r.color }}
                >
                  {r.label}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action slot */}
      {children && (
        <div className="border-t border-slate-100 px-3 py-2.5 bg-slate-50/50">
          {children}
        </div>
      )}
    </div>
  );
};

/* ─── Toast simples ──────────────────────────────────────────────────────── */

const Toast = ({ msg, type }) => {
  if (!msg) return null;
  const bg =
    type === 'error'   ? 'bg-red-500'     :
    type === 'info'    ? 'bg-slate-500'   :
    type === 'warning' ? 'bg-amber-500'   :
    'bg-emerald-500';
  return (
    <div className={`${bg} text-white text-sm font-bold text-center px-4 py-2.5 shrink-0 animate-fadeIn`}>
      {msg}
    </div>
  );
};

/* ─── Componente principal ───────────────────────────────────────────────── */

const FriendsScreen = ({
  currentUserUid,
  currentUserProfile,   // perfil do jogador atual (para enviar junto com solicitação)
  pendingRequests,      // array vindo do listener em AppRoot
  onClose,
  onRequestsChanged,    // callback para refresh quando aceitar/recusar
}) => {
  const [tab,             setTab]             = useState('friends');
  const [friends,         setFriends]         = useState([]);
  const [friendsLoading,  setFriendsLoading]  = useState(false);
  const [searchQuery,     setSearchQuery]      = useState('');
  const [searchResults,   setSearchResults]   = useState([]);
  const [searchLoading,   setSearchLoading]   = useState(false);
  const [searchDone,      setSearchDone]      = useState(false);
  const [sentRequests,    setSentRequests]    = useState(new Set());
  const [confirmRemove,   setConfirmRemove]   = useState(null);
  const [toast,           setToast]           = useState(null);
  const [loadingChallenge,setLoadingChallenge]= useState({}); // { [uid]: bool }
  const requestCooldowns  = useRef({});  // { [toUid]: timestamp } — rate limit
  const searchDebounce    = useRef(null);

  /* -- Helpers -- */
  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  /* -- Carregar amigos -- */
  const loadFriends = useCallback(async () => {
    if (!currentUserUid) return;
    setFriendsLoading(true);
    const list = await getFriendList(currentUserUid);
    setFriends(list);
    setFriendsLoading(false);
  }, [currentUserUid]);

  useEffect(() => { loadFriends(); }, [loadFriends]);

  /* -- Busca -- */
  const handleSearch = async () => {
    const q = searchQuery.trim();
    if (!q) return;
    setSearchLoading(true);
    setSearchResults([]);
    setSearchDone(false);

    const results = await searchUsersByName(q);
    const friendUids = new Set(friends.map(f => f.uid || f.id));

    // Filtrar: remover self e amigos já existentes
    const filtered = results.filter(
      r => r.uid !== currentUserUid && !friendUids.has(r.uid)
    );

    // Para cada resultado, verificar se já enviei solicitação
    const checkedSent = new Set(sentRequests);
    await Promise.all(
      filtered.map(async r => {
        if (!checkedSent.has(r.uid)) {
          const pending = await hasPendingRequest(currentUserUid, r.uid);
          if (pending) checkedSent.add(r.uid);
        }
      })
    );
    setSentRequests(checkedSent);
    setSearchResults(filtered);
    setSearchLoading(false);
    setSearchDone(true);
  };

  /* -- Enviar solicitação (com rate limit de 30s por destinatário) -- */
  const handleSendRequest = async (toProfile) => {
    const now = Date.now();
    const lastSent = requestCooldowns.current[toProfile.uid] || 0;
    if (now - lastSent < 30_000) {
      showToast('Aguarde antes de enviar outra solicitação.', 'warning');
      return;
    }
    requestCooldowns.current[toProfile.uid] = now;
    const { ok } = await sendFriendRequest(currentUserUid, currentUserProfile, toProfile.uid);
    if (ok) {
      setSentRequests(prev => new Set([...prev, toProfile.uid]));
      showToast(`Solicitação enviada para ${toProfile.name}! 🎉`);
    } else {
      showToast('Erro ao enviar solicitação.', 'error');
    }
  };

  /* -- Aceitar solicitação -- */
  const handleAccept = async (req) => {
    const { ok } = await acceptFriendRequest(
      currentUserUid,
      currentUserProfile,
      req.id,
      req
    );
    if (ok) {
      onRequestsChanged?.();
      loadFriends();
      showToast(`${req.fromName || req.profile?.name || 'Treinador'} agora é seu amigo! 👥`);
    } else {
      showToast('Erro ao aceitar solicitação.', 'error');
    }
  };

  /* -- Recusar solicitação -- */
  const handleReject = async (req) => {
    const { ok } = await rejectFriendRequest(currentUserUid, req.id);
    if (ok) {
      onRequestsChanged?.();
      showToast(`Solicitação recusada.`, 'info');
    } else {
      showToast('Erro ao recusar solicitação.', 'error');
    }
  };

  /* -- Remover amigo -- */
  const handleRemove = async (friend) => {
    const uid = friend.uid || friend.id;
    const { ok } = await removeFriend(currentUserUid, uid);
    setConfirmRemove(null);
    if (ok) {
      setFriends(prev => prev.filter(f => (f.uid || f.id) !== uid));
      showToast(`${friend.name || 'Amigo'} removido.`, 'info');
    } else {
      showToast('Erro ao remover amigo.', 'error');
    }
  };

  /* -- Tabs -- */
  const tabs = [
    { id: 'friends',  icon: '👥', label: 'Amigos',       badge: friends.length },
    { id: 'requests', icon: '📬', label: 'Solicitações',  badge: pendingRequests.length },
    { id: 'search',   icon: '🔍', label: 'Buscar' },
  ];

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[100000] flex flex-col bg-slate-50 animate-fadeIn"
      style={{ top: '56px' }}
    >
      {/* ── Header ── */}
      <div
        className="shrink-0 px-4 py-3 flex items-center gap-3"
        style={{ background: 'linear-gradient(135deg, #1d4ed8, #2563eb)' }}
      >
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-white/20 text-white font-black text-lg flex items-center justify-center hover:bg-white/30 active:scale-95 transition-all"
        >
          ←
        </button>
        <div className="flex-1">
          <p className="text-white/60 text-[9px] font-black uppercase tracking-[0.35em] leading-none">CIDADE</p>
          <h2 className="text-white text-lg font-black uppercase leading-tight tracking-tighter">Rede de Amigos</h2>
        </div>
        <img
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/vs-seeker.png"
          className="w-10 h-10 object-contain opacity-80"
          style={{ imageRendering: 'pixelated' }}
          alt=""
        />
      </div>

      {/* ── Toast ── */}
      <Toast msg={toast?.msg} type={toast?.type} />

      {/* ── Tabs ── */}
      <div className="shrink-0 flex bg-white border-b-2 border-slate-100 shadow-sm">
        {tabs.map(t => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 flex flex-col items-center gap-0.5 py-3 transition-all text-xs font-black uppercase tracking-tight relative
                ${active
                  ? 'text-blue-600 border-b-[3px] border-blue-600 -mb-[2px] bg-blue-50/50'
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
            >
              <span className="text-base relative">
                {t.icon}
                {t.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 bg-red-500 text-white text-[8px] font-black min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center shadow-sm">
                    {t.badge > 99 ? '99+' : t.badge}
                  </span>
                )}
              </span>
              <span className="leading-none">{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── Conteúdo ── */}
      <div className="flex-1 overflow-y-auto p-4 pb-8">

        {/* ══ ABA: AMIGOS ══════════════════════════════════════════════════ */}
        {tab === 'friends' && (
          <div className="flex flex-col gap-3">
            {friendsLoading && (
              <p className="text-center text-slate-400 font-bold py-10 animate-pulse">Carregando...</p>
            )}

            {!friendsLoading && friends.length === 0 && (
              <div className="flex flex-col items-center gap-4 py-14 text-center">
                <span className="text-6xl opacity-50">👥</span>
                <p className="font-black text-slate-700 text-xl">Sem amigos ainda</p>
                <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                  Busque pelo nome de um treinador para enviar uma solicitação de amizade!
                </p>
                <button
                  onClick={() => setTab('search')}
                  className="bg-blue-600 text-white font-black text-sm px-6 py-3 rounded-2xl shadow-md hover:bg-blue-700 active:scale-95 transition-all mt-1"
                >
                  🔍 Buscar Treinadores
                </button>
              </div>
            )}

            {friends.map(friend => {
              const profile = friend.profile || friend;
              const hasRegion = !!(profile.hasRegion);
              const friendUid = friend.uid || friend.id;
              const isChallenging = !!loadingChallenge[friendUid];
              return (
                <FriendCard key={friendUid} profile={profile}>
                  <div className="flex gap-2">
                    {hasRegion ? (
                      <button
                        disabled={isChallenging}
                        onClick={async () => {
                          setLoadingChallenge(prev => ({ ...prev, [friendUid]: true }));
                          try {
                            const region = await loadFriendRegion(friendUid);
                            if (!region) {
                              showToast('Região não encontrada ou ainda não publicada.', 'error');
                            } else {
                              // TODO Fase 3: navegar para RegionChallengeScreen com { region, ownerProfile: profile }
                              showToast(`Região "${region.regionName || 'Sem nome'}" encontrada! Batalhas em breve.`, 'info');
                            }
                          } finally {
                            setLoadingChallenge(prev => ({ ...prev, [friendUid]: false }));
                          }
                        }}
                        className={`flex-1 font-black text-xs py-2.5 rounded-xl active:scale-95 transition-all shadow-sm
                          ${isChallenging ? 'bg-amber-300 text-white cursor-wait' : 'bg-amber-500 hover:bg-amber-600 text-white'}`}
                      >
                        {isChallenging ? '⏳ Carregando...' : '⚔️ Desafiar Região'}
                      </button>
                    ) : (
                      <button
                        disabled
                        className="flex-1 bg-slate-100 text-slate-400 font-black text-xs py-2.5 rounded-xl cursor-not-allowed"
                        title="Este treinador não tem uma região publicada"
                      >
                        ⚔️ Batalhar <span className="opacity-60">(em breve)</span>
                      </button>
                    )}
                    <button
                      onClick={() => setConfirmRemove(friend)}
                      className="bg-red-50 border-2 border-red-100 text-red-500 font-black text-xs px-4 py-2.5 rounded-xl hover:bg-red-100 active:scale-95 transition-all"
                    >
                      Remover
                    </button>
                  </div>
                </FriendCard>
              );
            })}
          </div>
        )}

        {/* ══ ABA: SOLICITAÇÕES ════════════════════════════════════════════ */}
        {tab === 'requests' && (
          <div className="flex flex-col gap-3">
            {pendingRequests.length === 0 && (
              <div className="flex flex-col items-center gap-4 py-14 text-center">
                <span className="text-6xl opacity-40">📬</span>
                <p className="font-black text-slate-700 text-xl">Nenhuma solicitação</p>
                <p className="text-slate-400 text-sm">
                  Quando alguém te adicionar como amigo, vai aparecer aqui.
                </p>
              </div>
            )}

            {pendingRequests.map(req => (
              <FriendCard
                key={req.id}
                profile={req.profile || { name: req.fromName }}
              >
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAccept(req)}
                    className="flex-1 bg-emerald-500 text-white font-black text-sm py-2.5 rounded-xl hover:bg-emerald-600 active:scale-95 transition-all shadow-sm"
                  >
                    ✓ Aceitar
                  </button>
                  <button
                    onClick={() => handleReject(req)}
                    className="flex-1 bg-red-50 border-2 border-red-100 text-red-500 font-black text-sm py-2.5 rounded-xl hover:bg-red-100 active:scale-95 transition-all"
                  >
                    ✗ Recusar
                  </button>
                </div>
              </FriendCard>
            ))}
          </div>
        )}

        {/* ══ ABA: BUSCAR ══════════════════════════════════════════════════ */}
        {tab === 'search' && (
          <div className="flex flex-col gap-4">
            {/* Dica */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3 flex items-start gap-2">
              <span className="text-blue-500 text-base mt-0.5 shrink-0">💡</span>
              <p className="text-xs text-blue-700 font-bold leading-relaxed">
                Pesquise pelo <strong>nome exato</strong> do treinador (letras maiúsculas/minúsculas importam).
                Para ser encontrado, seu nome deve ser único — configure-o no início do jogo.
              </p>
            </div>

            {/* Campo de busca */}
            <div className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  // Debounce: aguarda 800ms sem digitar antes de buscar automaticamente
                  clearTimeout(searchDebounce.current);
                  if (e.target.value.trim().length >= 3) {
                    searchDebounce.current = setTimeout(() => handleSearch(), 800);
                  }
                }}
                onKeyDown={e => { clearTimeout(searchDebounce.current); if (e.key === 'Enter') handleSearch(); }}
                placeholder="Nome do treinador..."
                className="flex-1 border-2 border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold bg-white focus:outline-none focus:border-blue-400 transition-colors shadow-sm"
              />
              <button
                onClick={handleSearch}
                disabled={searchLoading || !searchQuery.trim()}
                className="bg-blue-600 text-white font-black text-base px-5 py-3 rounded-2xl shadow-md disabled:opacity-40 hover:bg-blue-700 active:scale-95 transition-all"
              >
                {searchLoading ? (
                  <span className="animate-spin inline-block">⟳</span>
                ) : '🔍'}
              </button>
            </div>

            {/* Resultados */}
            <div className="flex flex-col gap-3">
              {searchDone && searchResults.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-slate-400 font-bold">Nenhum treinador encontrado.</p>
                  <p className="text-slate-300 text-sm mt-1">Verifique o nome e tente novamente.</p>
                </div>
              )}

              {searchResults.map(result => {
                const alreadySent   = sentRequests.has(result.uid);
                const alreadyFriend = friends.some(f => (f.uid || f.id) === result.uid);
                return (
                  <FriendCard key={result.uid} profile={result}>
                    <button
                      onClick={() => {
                        if (!alreadySent && !alreadyFriend) handleSendRequest(result);
                      }}
                      disabled={alreadySent || alreadyFriend}
                      className={`w-full font-black text-sm py-2.5 rounded-xl transition-all active:scale-95
                        ${alreadyFriend
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          : alreadySent
                          ? 'bg-emerald-50 border-2 border-emerald-200 text-emerald-600 cursor-default'
                          : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'}`}
                    >
                      {alreadyFriend ? '✓ Já é amigo' : alreadySent ? '✓ Solicitação enviada' : '➕ Adicionar'}
                    </button>
                  </FriendCard>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── Modal de confirmação: Remover amigo ── */}
      {confirmRemove && (
        <div
          className="fixed inset-0 z-[200000] flex items-end justify-center pb-6 px-4"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={() => setConfirmRemove(null)}
        >
          <div
            className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border-2 border-slate-100 overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-5 text-center">
              <span className="text-4xl">🤔</span>
              <p className="font-black text-slate-800 text-lg mt-2">Remover amigo?</p>
              <p className="text-slate-500 text-sm mt-1">
                Tem certeza que deseja remover <strong>{confirmRemove.name || 'este treinador'}</strong> da sua lista?
              </p>
            </div>
            <div className="flex border-t border-slate-100">
              <button
                onClick={() => setConfirmRemove(null)}
                className="flex-1 py-4 font-black text-slate-500 hover:bg-slate-50 transition-all"
              >
                Cancelar
              </button>
              <div className="w-px bg-slate-100" />
              <button
                onClick={() => handleRemove(confirmRemove)}
                className="flex-1 py-4 font-black text-red-500 hover:bg-red-50 transition-all"
              >
                Remover
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FriendsScreen;
