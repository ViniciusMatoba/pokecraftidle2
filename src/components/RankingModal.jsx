import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { getGlobalRanking, getUserProfile } from '../services/ranking';
import { auth } from '../firebase';
import { TrainerCardModal } from './CommonUI';
import { AVATAR_SPRITES, CARD_FRAMES, CARD_BACKGROUNDS, getTintFilter } from '../data/cosmetics';
import { TRAINER_TITLES } from '../data/trainerTitles';
import { SHOP_TITLES } from '../data/prestige';

const POKEAPI_ITEM_URL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/';

/**
 * Resolve o objeto de título ativo de um player do ranking.
 * Usa o ID salvo no Firebase diretamente (sem recomputar condições de unlock)
 * para evitar overhead com caughtData pesado.
 */
const resolvePlayerTitle = (player) => {
  const titleId = player.selectedTitle || player.prestige?.activeTitle || player.titleId || null;
  if (!titleId) return null;

  // Verifica títulos de conquista
  const achievementTitle = TRAINER_TITLES.find(t => t.id === titleId);
  if (achievementTitle) return achievementTitle;

  // Verifica títulos da loja de prestígio
  const shopTitleData = SHOP_TITLES[titleId];
  if (shopTitleData) {
    return {
      id: shopTitleData.id,
      label: shopTitleData.label,
      icon: shopTitleData.sprite,
      color: '#a78bfa',
      bg: 'linear-gradient(135deg, rgba(167,139,250,.25), rgba(15,23,42,.65))',
    };
  }
  return null;
};

const RankingModal = ({ onClose }) => {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchRanking = async () => {
      const data = await getGlobalRanking();
      setRanking(data);
      setLoading(false);
    };
    fetchRanking();
  }, []);

  const handlePlayerClick = async (uid) => {
    const profile = await getUserProfile(uid);
    if (profile) setSelectedProfile(profile);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="ranking-modal-title"
        className="bg-[#1a1a1a] w-full max-w-2xl rounded-[2.5rem] border-4 border-slate-800 shadow-2xl flex flex-col overflow-hidden animate-bounceIn"
        style={{ maxHeight: '90vh' }}
        onClick={e => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="p-6 bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] border-b-4 border-slate-800 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-500/20 rounded-2xl flex items-center justify-center shadow-inner border border-amber-500/30">
              <img src={POKEAPI_ITEM_URL + 'kings-rock.png'} className="h-9 w-9 object-contain" alt="" />
            </div>
            <div>
              <h2 id="ranking-modal-title" className="text-2xl font-black text-white uppercase italic tracking-tighter">Ranking Global</h2>
              <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em]">Os Maiores Treinadores do Mundo</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-slate-800 text-white rounded-full flex items-center justify-center hover:bg-red-500 transition-all font-black border-2 border-slate-700"
          >X</button>
        </div>

        {/* ── Content ── */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-[#141414]">
          {loading ? (
            <div className="h-64 flex flex-col items-center justify-center gap-4">
              <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-amber-500 font-black uppercase italic animate-pulse">Sincronizando Dados...</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {ranking.map((player, index) => {
                const rank = index + 1;
                const isTop3 = index < 3;
                const isMe = currentUser && player.id === currentUser.uid;

                // ── Aparência personalizada do jogador ──
                const appearance    = player.appearance || {};
                const equippedSprite = AVATAR_SPRITES[appearance.spriteId] || AVATAR_SPRITES.red;
                const equippedFrame  = CARD_FRAMES[appearance.frameId]     || CARD_FRAMES.default;
                const equippedBg     = CARD_BACKGROUNDS[appearance.bgId]   || CARD_BACKGROUNDS.slate;
                const tintFilter     = getTintFilter(appearance.tintId || 'none');
                const avatarSrc      = equippedSprite.sprite;

                // ── Título ativo ──
                const activeTitle = resolvePlayerTitle(player);

                // ── Medalha de posição ──
                const rankBadge =
                  rank === 1 ? <span className="text-2xl leading-none">🥇</span> :
                  rank === 2 ? <span className="text-2xl leading-none">🥈</span> :
                  rank === 3 ? <span className="text-2xl leading-none">🥉</span> :
                  <span className="text-sm font-black text-slate-400">#{rank}</span>;

                // ── Borda de destaque para top 3 / jogador atual ──
                const borderStyle = isMe
                  ? { borderColor: '#3b82f6', boxShadow: '0 0 18px rgba(59,130,246,0.45)' }
                  : isTop3
                    ? { borderColor: equippedFrame.preview, boxShadow: `0 0 12px ${equippedFrame.preview}55` }
                    : { borderColor: equippedFrame.preview + '66' };

                return (
                  <div
                    key={player.id}
                    onClick={() => handlePlayerClick(player.id)}
                    className="relative rounded-3xl border-2 overflow-hidden cursor-pointer transition-all hover:scale-[1.015] hover:brightness-110 active:scale-[0.99]"
                    style={borderStyle}
                  >
                    {/* fundo do mini-card com o gradiente do jogador */}
                    <div className={`flex items-center gap-3 p-3 bg-gradient-to-r ${equippedBg.gradient}`}>

                      {/* Posição */}
                      <div className="w-9 flex items-center justify-center shrink-0">
                        {rankBadge}
                      </div>

                      {/* Avatar no frame personalizado */}
                      <div
                        className="rounded-2xl p-1.5 border-2 bg-black/30 shrink-0"
                        style={{ borderColor: equippedFrame.preview }}
                      >
                        <img
                          src={avatarSrc}
                          alt=""
                          className="w-14 h-14 object-contain"
                          style={{
                            imageRendering: 'pixelated',
                            filter: tintFilter !== 'none' ? tintFilter : undefined,
                          }}
                        />
                      </div>

                      {/* Nome + título */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className={`font-black uppercase italic text-sm leading-none ${isMe ? 'text-blue-300' : 'text-white'}`}>
                            {player.name || 'Treinador'}
                          </h4>
                          {isMe && (
                            <span className="text-[8px] bg-blue-500 text-white px-1.5 py-0.5 rounded font-black tracking-normal not-italic">
                              VOCÊ
                            </span>
                          )}
                        </div>

                        {/* Título ativo do jogador */}
                        {activeTitle ? (
                          <div
                            className="mt-1.5 inline-flex items-center gap-1 rounded-lg border px-2 py-1 max-w-full"
                            style={{
                              borderColor: `${activeTitle.color}88`,
                              background: activeTitle.bg,
                            }}
                          >
                            {activeTitle.icon && (
                              <img
                                src={activeTitle.icon}
                                className="h-3.5 w-3.5 shrink-0 object-contain"
                                alt=""
                              />
                            )}
                            <span className="text-[9px] font-black uppercase text-white leading-none truncate">
                              {activeTitle.label}
                            </span>
                          </div>
                        ) : (
                          <div className="mt-1.5 inline-flex items-center rounded-lg border border-white/10 px-2 py-1 bg-black/20">
                            <span className="text-[9px] font-black uppercase text-slate-500 leading-none">Iniciante</span>
                          </div>
                        )}
                      </div>

                      {/* Stats: Power Score + Insígnias */}
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <div
                          className="rounded-xl px-3 py-1.5 border border-white/10 bg-black/30 text-center min-w-[88px]"
                        >
                          <p className="text-[7px] font-black text-slate-400 uppercase tracking-tighter">Power Score</p>
                          <p className={`text-sm font-black ${isTop3 ? 'text-amber-400' : 'text-emerald-400'}`}>
                            {(player.powerScore || 0).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 justify-end">
                          <span className="text-[10px] font-black text-slate-300">{player.badges || 0}</span>
                          <span className="text-xs">🎖️</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {ranking.length === 0 && !loading && (
                <div className="p-12 text-center text-slate-500 font-bold italic">
                  Nenhum treinador registrado no ranking ainda.
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="p-4 bg-[#1a1a1a] border-t-2 border-slate-800 text-center shrink-0">
          <p className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.3em]">
            Clique em um treinador para ver o card completo
          </p>
        </div>
      </div>

      {selectedProfile && (
        <TrainerCardModal
          userData={selectedProfile}
          onClose={() => setSelectedProfile(null)}
        />
      )}
    </div>,
    document.body
  );
};

export default RankingModal;
