// ── Mega Evolução Permanente — PokéCraft Idle 2 ───────────────────────────────
import React, { useState } from 'react';
import { MEGA_EVOLUTION_MAP, MEGA_STONE_ICONS, getMegaSprite, getCompatibleMegaStones } from '../data/megaEvolutions';

const TYPE_COLORS = {
  Normal: '#9ea0aa', Fire: '#ff9741', Water: '#3391d4', Grass: '#38bf4f',
  Electric: '#fbd100', Ice: '#70cbd4', Fighting: '#e0306a', Poison: '#b567ce',
  Ground: '#e87236', Flying: '#89aae3', Psychic: '#ff6675', Bug: '#83c300',
  Rock: '#c9bb8a', Ghost: '#4c6ab2', Dragon: '#006fc9', Dark: '#5b5466',
  Steel: '#5a8ea2', Fairy: '#fb89eb',
};

// ── Card de Pokémon elegível para Mega ────────────────────────────────────────
const MegaCandidateCard = ({ pokemon, teamIndex, onSelect, selected }) => {
  const compatibles = getCompatibleMegaStones(pokemon.id);
  const accentColor = TYPE_COLORS[pokemon.type] || '#3b82f6';

  if (compatibles.length === 0) return null;

  return (
    <button
      onClick={() => onSelect({ pokemon, teamIndex, compatibles })}
      style={{
        background: selected ? `${accentColor}18` : 'rgba(255,255,255,0.03)',
        border: selected ? `2px solid ${accentColor}80` : '2px solid rgba(255,255,255,0.08)',
        borderRadius: 16, padding: 14,
        display: 'flex', alignItems: 'center', gap: 12,
        width: '100%', textAlign: 'left', cursor: 'pointer',
        transition: 'all 0.2s',
        boxShadow: selected ? `0 4px 20px ${accentColor}20` : 'none',
      }}
    >
      <div style={{
        width: 56, height: 56, flexShrink: 0, borderRadius: 12,
        background: `${accentColor}15`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative',
      }}>
        <img
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
          style={{ width: 44, height: 44, objectFit: 'contain' }}
          alt={pokemon.name}
        />
        {pokemon.isShiny && (
          <span style={{ position: 'absolute', top: -4, right: -4, fontSize: 10 }}>✨</span>
        )}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ color: '#fff', fontWeight: 900, fontSize: 13, textTransform: 'uppercase', fontStyle: 'italic', margin: '0 0 4px' }}>
          {pokemon.name}
        </p>
        <p style={{ color: '#94a3b8', fontSize: 10, fontWeight: 700, margin: '0 0 6px' }}>
          Nível {pokemon.level}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {compatibles.map(m => (
            <span key={m.stoneId} style={{
              fontSize: 8, fontWeight: 700, textTransform: 'uppercase',
              padding: '2px 6px', borderRadius: 99,
              background: '#fef3c720', color: '#fbbf24',
              border: '1px solid #fcd34d30',
              display: 'flex', alignItems: 'center', gap: 3,
            }}>
              {MEGA_STONE_ICONS[m.stoneId] ? (
                <img src={MEGA_STONE_ICONS[m.stoneId]} style={{ width: 10, height: 10 }} alt="" />
              ) : '💎'}
              {m.name}
            </span>
          ))}
        </div>
      </div>

      {selected && <span style={{ color: accentColor, fontSize: 18, flexShrink: 0 }}>→</span>}
    </button>
  );
};

// ── Card de Mega Pedra disponível ─────────────────────────────────────────────
const MegaStoneCard = ({ megaData, stoneId, hasStone, onChoose }) => {
  const primaryType = megaData.types?.[0] || 'Normal';
  const accentColor = TYPE_COLORS[primaryType] || '#3b82f6';

  const bonusLines = Object.entries(megaData.statBonus || {}).map(([stat, val]) => {
    const labels = { attack: 'Atq', defense: 'Def', spAtk: 'SpAtq', spDef: 'SpDef', speed: 'Vel' };
    return `${labels[stat] || stat} +${Math.round(val * 100)}%`;
  });

  return (
    <button
      onClick={() => hasStone && onChoose(stoneId, megaData)}
      disabled={!hasStone}
      style={{
        background: hasStone ? `${accentColor}12` : 'rgba(255,255,255,0.03)',
        border: hasStone ? `2px solid ${accentColor}50` : '2px solid rgba(255,255,255,0.05)',
        borderRadius: 16, padding: 14,
        display: 'flex', alignItems: 'center', gap: 12,
        width: '100%', textAlign: 'left',
        cursor: hasStone ? 'pointer' : 'not-allowed',
        opacity: hasStone ? 1 : 0.5,
        transition: 'all 0.2s',
        boxShadow: hasStone ? `0 4px 16px ${accentColor}15` : 'none',
      }}
    >
      {/* Comparação: normal vs mega */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
        <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img
            src={getMegaSprite(megaData.megaFormId)}
            onError={e => {
              if (!e.target.dataset.triedBase) {
                e.target.dataset.triedBase = '1';
                // Fallback para sprite base (sem mega) usando baseId do megaData
                e.target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${megaData.baseId}.png`;
              }
            }}
            style={{ width: 36, height: 36, objectFit: 'contain', filter: hasStone ? 'none' : 'brightness(0) invert(0.3)' }}
            alt={megaData.name}
          />
        </div>
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ color: hasStone ? '#fff' : '#64748b', fontWeight: 900, fontSize: 12, textTransform: 'uppercase', fontStyle: 'italic', margin: '0 0 4px' }}>
          {megaData.name}
        </p>

        {/* Tipos da forma Mega */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 6 }}>
          {(megaData.types || []).map(t => (
            <span key={t} style={{
              fontSize: 8, fontWeight: 700, textTransform: 'uppercase',
              padding: '2px 6px', borderRadius: 99,
              background: `${TYPE_COLORS[t] || '#94a3b8'}22`,
              color: TYPE_COLORS[t] || '#94a3b8',
            }}>{t}</span>
          ))}
        </div>

        {/* Bônus de stats */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {bonusLines.map((b, i) => (
            <span key={i} style={{
              fontSize: 8, fontWeight: 700, padding: '2px 6px', borderRadius: 99,
              background: '#dcfce720', color: '#4ade80',
            }}>{b}</span>
          ))}
        </div>

        {/* Pedra necessária */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6 }}>
          {MEGA_STONE_ICONS[stoneId] && (
            <img src={MEGA_STONE_ICONS[stoneId]} style={{ width: 12, height: 12 }} alt="" />
          )}
          <span style={{ fontSize: 9, fontWeight: 700, color: hasStone ? '#fbbf24' : '#475569' }}>
            {hasStone ? 'Pedra Disponível ✓' : 'Pedra Necessária ✗'}
          </span>
        </div>
      </div>

      {hasStone && <span style={{ color: accentColor, fontSize: 20, fontWeight: 900, flexShrink: 0 }}>⬆</span>}
    </button>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

const MegaEvolutionScreen = ({
  megaEvolutionPending,
  setMegaEvolutionPending,
  gameState,
  setGameState,
  addLog,
  POKEDEX,
}) => {
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [confirmData, setConfirmData]             = useState(null); // { stoneId, megaData, candidate }
  const [phase, setPhase]                         = useState('select'); // select | confirm | animating

  if (!megaEvolutionPending) return null;

  const inventory = gameState?.inventory?.items || {};
  const team = gameState?.team || [];

  // Pokémon do time que podem mega evoluir e ainda não o fizeram
  const candidates = team
    .map((p, idx) => ({ pokemon: p, teamIndex: idx }))
    .filter(({ pokemon }) => !pokemon.isMega && getCompatibleMegaStones(pokemon.id).length > 0);

  const handleSelectCandidate = (data) => {
    setSelectedCandidate(data);
    setConfirmData(null);
  };

  const handleChooseStone = (stoneId, megaData) => {
    setConfirmData({ stoneId, megaData, candidate: selectedCandidate });
    setPhase('confirm');
  };

  const handleConfirm = () => {
    if (!confirmData) return;
    const { stoneId, megaData, candidate } = confirmData;
    const { pokemon, teamIndex } = candidate;

    setPhase('animating');

    setTimeout(() => {
      // Consome a pedra
      setGameState(prev => {
        const newTeam = prev.team.map((p, i) => {
          if (i !== teamIndex) return p;

          // Aplica bônus de stats permanentemente
          const bonus = megaData.statBonus || {};
          const applyBonus = (base, key) => Math.ceil((base || 0) * (1 + (bonus[key] || 0)));

          return {
            ...p,
            // Identidade Mega
            isMega:       true,
            megaFormId:   megaData.megaFormId,
            megaName:     megaData.name,
            megaStatBonus: bonus,
            // Tipo atualizado
            type:         megaData.types?.[0] || p.type,
            types:        megaData.types || p.types,
            // Sprite atualizado
            megaSprite:   getMegaSprite(megaData.megaFormId),
            // Stats aumentados permanentemente
            attack:   applyBonus(p.attack,  'attack'),
            defense:  applyBonus(p.defense, 'defense'),
            spAtk:    applyBonus(p.spAtk,   'spAtk'),
            spDef:    applyBonus(p.spDef,   'spDef'),
            speed:    applyBonus(p.speed,   'speed'),
            maxHp:    applyBonus(p.maxHp,   'hp'),
            hp:       applyBonus(p.hp,      'hp'),
          };
        });

        return {
          ...prev,
          team: newTeam,
          inventory: {
            ...prev.inventory,
            items: {
              ...prev.inventory?.items,
              [stoneId]: Math.max(0, (prev.inventory?.items?.[stoneId] || 1) - 1),
            },
          },
          caughtData: { ...prev.caughtData, [megaData.megaFormId]: true },
        };
      });

      addLog?.(`⚡ ${pokemon.name} realizou a Mega Evolução para ${megaData.name} — PERMANENTEMENTE!`, 'success');
      setMegaEvolutionPending(null);
    }, 2000);
  };

  const handleClose = () => {
    setMegaEvolutionPending(null);
  };

  // ─── TELA DE SELEÇÃO ────────────────────────────────────────────────────────
  if (phase === 'select') {
    return (
      <div className="fixed inset-0 z-[9998] flex flex-col bg-slate-900/98 backdrop-blur-3xl animate-fadeIn overflow-hidden">
        {/* Partículas decorativas */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 blur-[100px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/10 blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        {/* Header */}
        <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'relative', zIndex: 10, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ color: '#fff', fontWeight: 900, fontSize: 20, textTransform: 'uppercase', fontStyle: 'italic', margin: 0 }}>
                ⚡ Mega Evolução
              </h2>
              <p style={{ color: '#7c3aed', fontSize: 11, fontWeight: 700, margin: '2px 0 0' }}>
                Transformação Permanente e Definitiva
              </p>
            </div>
            <button onClick={handleClose} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: 10, padding: '6px 14px', color: '#94a3b8', fontSize: 11, fontWeight: 900, cursor: 'pointer' }}>
              ✕ Fechar
            </button>
          </div>

          <div style={{ marginTop: 12, padding: '8px 12px', borderRadius: 10, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
            <p style={{ color: '#f87171', fontSize: 10, fontWeight: 700, margin: 0 }}>
              ⚠️ ATENÇÃO: A Mega Evolução é IRREVERSÍVEL. O Pokémon não poderá retornar à forma normal!
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto" style={{ position: 'relative', zIndex: 10 }}>

          {candidates.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40 }}>
              <div style={{ fontSize: 64 }}>🔮</div>
              <h3 style={{ color: '#64748b', fontWeight: 900, fontSize: 16, textTransform: 'uppercase', marginTop: 16 }}>
                Nenhum Candidato no Time
              </h3>
              <p style={{ color: '#475569', fontSize: 13, marginTop: 8 }}>
                Adicione ao seu time Pokémon como Charizard, Blastoise, Venusaur, Gengar, Gyarados e outros para acessar a Mega Evolução.
              </p>
            </div>
          ) : (
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <p style={{ color: '#94a3b8', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>
                Escolha o Pokémon para Mega Evoluir:
              </p>
              {candidates.map(({ pokemon, teamIndex }) => (
                <MegaCandidateCard
                  key={pokemon.instanceId || teamIndex}
                  pokemon={pokemon}
                  teamIndex={teamIndex}
                  onSelect={handleSelectCandidate}
                  selected={selectedCandidate?.teamIndex === teamIndex}
                />
              ))}
            </div>
          )}

          {/* Pedras disponíveis para o candidato selecionado */}
          {selectedCandidate && (
            <div style={{ padding: '0 16px 16px' }}>
              <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '8px 0 16px' }} />
              <p style={{ color: '#94a3b8', fontSize: 12, fontWeight: 700, marginBottom: 8 }}>
                Mega Pedras disponíveis para {selectedCandidate.pokemon.name}:
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {selectedCandidate.compatibles.map(({ stoneId, ...megaData }) => {
                  const hasStone = (inventory[stoneId] || 0) > 0;
                  return (
                    <MegaStoneCard
                      key={stoneId}
                      stoneId={stoneId}
                      megaData={megaData}
                      hasStone={hasStone}
                      onChoose={handleChooseStone}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── TELA DE CONFIRMAÇÃO ──────────────────────────────────────────────────
  if (phase === 'confirm' && confirmData) {
    const { megaData, candidate } = confirmData;
    const primaryType = megaData.types?.[0] || 'Normal';
    const accentColor = TYPE_COLORS[primaryType] || '#7c3aed';

    return (
      <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4 bg-slate-900/98 backdrop-blur-3xl animate-fadeIn">
        <div style={{ maxWidth: 400, width: '100%', position: 'relative' }}>
          <div className="absolute inset-0 blur-[120px] animate-pulse pointer-events-none"
            style={{ background: `radial-gradient(circle, ${accentColor}30 0%, transparent 70%)` }} />

          <div style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
            {/* Comparação */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, marginBottom: 24 }}>
              <div style={{ textAlign: 'center' }}>
                <img
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${candidate.pokemon.id}.png`}
                  style={{ width: 80, height: 80, filter: 'grayscale(0.3)' }} alt="before"
                />
                <p style={{ color: '#64748b', fontSize: 10, fontWeight: 700, marginTop: 4 }}>{candidate.pokemon.name}</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 28 }}>⚡</span>
                <div style={{ width: 40, height: 2, background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }} />
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <div className="absolute inset-0 blur-2xl rounded-full animate-pulse"
                    style={{ background: `${accentColor}40` }} />
                  <img
                    src={getMegaSprite(megaData.megaFormId)}
                    onError={e => {
                      if (!e.target.dataset.triedBase) {
                        e.target.dataset.triedBase = '1';
                        e.target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${candidate.pokemon.isShiny ? 'shiny/' : ''}${candidate.pokemon.id}.png`;
                      }
                    }}
                    style={{ width: 90, height: 90, position: 'relative', zIndex: 1, filter: `drop-shadow(0 0 16px ${accentColor}80)` }}
                    alt="mega"
                  />
                </div>
                <p style={{ color: '#fff', fontSize: 11, fontWeight: 900, textTransform: 'uppercase', marginTop: 4, fontStyle: 'italic' }}>
                  {megaData.name}
                </p>
              </div>
            </div>

            {/* Bônus */}
            <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 16, padding: 16, marginBottom: 20, border: '1px solid rgba(255,255,255,0.08)' }}>
              <p style={{ color: '#94a3b8', fontSize: 11, fontWeight: 700, marginBottom: 10 }}>BÔNUS DE STATS PERMANENTES</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
                {Object.entries(megaData.statBonus || {}).map(([stat, val]) => {
                  const labels = { attack: 'ATQ', defense: 'DEF', spAtk: 'SP.ATQ', spDef: 'SP.DEF', speed: 'VEL', hp: 'HP' };
                  return (
                    <span key={stat} style={{
                      fontSize: 11, fontWeight: 900, padding: '4px 10px', borderRadius: 99,
                      background: '#dcfce720', color: '#4ade80', border: '1px solid #4ade8030',
                    }}>
                      {labels[stat] || stat} +{Math.round(val * 100)}%
                    </span>
                  );
                })}
              </div>
              <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 8 }}>
                {(megaData.types || []).map(t => (
                  <span key={t} style={{
                    fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 99,
                    background: `${TYPE_COLORS[t] || '#94a3b8'}22`, color: TYPE_COLORS[t] || '#94a3b8',
                  }}>{t}</span>
                ))}
              </div>
            </div>

            <div style={{ padding: '10px 16px', borderRadius: 12, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', marginBottom: 20 }}>
              <p style={{ color: '#f87171', fontSize: 11, fontWeight: 700, margin: 0 }}>
                ⚠️ Esta ação é PERMANENTE e não pode ser desfeita!
              </p>
            </div>

            <button
              onClick={handleConfirm}
              style={{
                width: '100%', padding: '18px 0', borderRadius: 20, border: 'none',
                background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
                color: '#fff', fontWeight: 900, fontSize: 15, textTransform: 'uppercase',
                letterSpacing: '0.1em', cursor: 'pointer',
                boxShadow: `0 8px 24px ${accentColor}40`,
                marginBottom: 10,
              }}
            >
              ⚡ Confirmar Mega Evolução!
            </button>
            <button
              onClick={() => setPhase('select')}
              style={{ background: 'transparent', border: 'none', color: '#475569', fontSize: 11, fontWeight: 900, cursor: 'pointer', padding: '8px 0', textTransform: 'uppercase', letterSpacing: '0.1em' }}
            >
              Voltar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── ANIMAÇÃO ─────────────────────────────────────────────────────────────
  if (phase === 'animating' && confirmData) {
    const { megaData } = confirmData;
    const primaryType = megaData.types?.[0] || 'Normal';
    const accentColor = TYPE_COLORS[primaryType] || '#7c3aed';

    return (
      <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-slate-900/98 backdrop-blur-3xl">
        <div style={{ textAlign: 'center' }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <div className="absolute inset-0 animate-ping rounded-full"
              style={{ background: `${accentColor}40`, borderRadius: '50%' }} />
            <div className="absolute inset-0 animate-ping rounded-full"
              style={{ background: `${accentColor}20`, borderRadius: '50%', animationDelay: '0.3s' }} />
            <img
              src={getMegaSprite(megaData.megaFormId)}
              onError={e => {
                if (!e.target.dataset.triedBase) {
                  e.target.dataset.triedBase = '1';
                  e.target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${confirmData.candidate.pokemon.isShiny ? 'shiny/' : ''}${confirmData.candidate.pokemon.id}.png`;
                }
              }}
              style={{ width: 160, height: 160, position: 'relative', zIndex: 1,
                filter: `brightness(0) invert(1) drop-shadow(0 0 40px ${accentColor})`,
                animation: 'pulse 0.5s ease-in-out infinite' }}
              alt={megaData.name}
            />
          </div>
          <h2 style={{ color: '#fff', fontWeight: 900, fontSize: 24, textTransform: 'uppercase', fontStyle: 'italic', marginTop: 24 }}>
            MEGA EVOLUINDO!
          </h2>
          <p style={{ color: accentColor, fontSize: 14, fontWeight: 700 }}>{megaData.name}</p>
        </div>
      </div>
    );
  }

  return null;
};

export default MegaEvolutionScreen;
