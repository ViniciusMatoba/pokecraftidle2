import React, { useState, useMemo, useCallback } from 'react';
import {
  REGION_GYM_TYPES, GYM_SLOT_LEVELS, ELITE_SLOT_LEVELS, CHAMPION_LEVEL,
  GYM_SLOT_COSTS, ELITE_SLOT_COSTS, CHAMPION_SLOT_COST,
  REGION_CARD_STYLES, REGION_BATTLE_BACKGROUNDS,
  getGymSlots, getEliteSlots, isRegionReadyToPublish,
  defaultGymSlot, defaultEliteSlot, defaultChampion, getSlotLevel,
} from '../data/myRegion';
import { AVATAR_SPRITES } from '../data/cosmetics';
import { getPokemonSpriteUrl } from '../utils/pokemonSprites';
import { getItemSpriteUrl, getTrainerSpriteUrl } from '../utils/assetUrls';

const fixPath = (path) => {
  if (!path || typeof path !== 'string' || path.startsWith('http')) return path;
  const base = (import.meta.env.BASE_URL || './').replace(/\/$/, '');
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
};

const SLOT_POKEMON_LIMIT = 6;

const BADGE_MAP = [
  'boulder_badge', 'cascade_badge', 'thunder_badge', 'rainbow_badge',
  'soul_badge', 'marsh_badge', 'volcano_badge', 'earth_badge'
];

/* ─── Helpers ──────────────────────────────────────────────────────────────── */
const FALLBACK_SPRITE = getTrainerSpriteUrl('red');
const POKE_IMG = getPokemonSpriteUrl;
const TRAINER_IMG = getTrainerSpriteUrl;
const FALLBACK_POKEMON = getPokemonSpriteUrl(0);
const FALLBACK_BADGE = getItemSpriteUrl('poke-ball');
const TYPE_ORDER = ['normal','fire','water','grass','electric','ice','fighting','poison','ground','flying','psychic','bug','rock','ghost','dragon','dark','steel','fairy','mixed'];

/* ─── LevelSlider ──────────────────────────────────────────────────────────── */
const LevelSlider = ({ value, min, max, onChange }) => (
  <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-100">
    <div className="flex justify-between items-center mb-3">
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Nível do Desafio</p>
      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-black">Nv. {value}</span>
    </div>
    <input 
      type="range" min={min} max={max} value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
    />
    <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-2">
      <span>Mín: {min}</span>
      <span>Máx: {max}</span>
    </div>
  </div>
);

/* ─── SlotHeader ────────────────────────────────────────────────────────────── */
const SlotHeader = ({ label, level, color, configured }) => (
  <div className="flex items-center gap-3 mb-4">
    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0"
      style={{ background: color || '#6b7280' }}>
      {label}
    </div>
    <div className="flex-1">
      <p className="font-black text-slate-800 text-sm">Nível {level}</p>
      <p className={`text-xs font-bold ${configured ? 'text-emerald-500' : 'text-slate-400'}`}>
        {configured ? '✓ Configurado' : 'Não configurado'}
      </p>
    </div>
  </div>
);

/* ─── TypeSelector ──────────────────────────────────────────────────────────── */
const TypeSelector = ({ value, onChange }) => (
  <div>
    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Tipo do Ginásio</p>
    <div className="grid grid-cols-4 gap-2">
      {TYPE_ORDER.map(tid => {
        const t = REGION_GYM_TYPES[tid];
        const active = value === tid;
        return (
          <button
            key={tid}
            onClick={() => onChange(tid)}
            className={`flex flex-col items-center gap-1.5 py-3 px-1 rounded-xl border-2 transition-all active:scale-95
              ${active ? 'shadow-lg scale-[1.06]' : 'hover:scale-[1.03] hover:shadow-md'}`}
            style={{
              background:   active ? t.color : `${t.color}22`,
              borderColor:  active ? t.color : `${t.color}66`,
              color:        active ? '#fff'  : t.color,
            }}
          >
            <img
              src={t.icon}
              className="w-7 h-7 object-contain"
              alt={t.name}
              style={{ imageRendering: 'pixelated', filter: active ? 'brightness(0) invert(1)' : 'none' }}
              onError={e => { e.target.src = FALLBACK_BADGE; }}
            />
            <span className="text-[9px] font-black uppercase leading-none">{t.name}</span>
          </button>
        );
      })}
    </div>
  </div>
);

/* ─── SpriteSelector ─────────────────────────────────────────────────────────── */
const SpriteSelector = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const sprites = Object.values(AVATAR_SPRITES);
  return (
    <div>
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Sprite do Líder</p>
      <button onClick={() => setOpen(true)}
        className="flex items-center gap-3 w-full border-2 border-slate-200 rounded-2xl p-3 bg-white hover:border-blue-400 transition-all">
        <img src={TRAINER_IMG(value)} className="w-12 h-12 object-contain"
          style={{ imageRendering: 'pixelated' }}
          onError={e => { if (e.target.src !== FALLBACK_SPRITE) e.target.src = FALLBACK_SPRITE; }} />
        <span className="font-bold text-slate-600 text-sm capitalize">{value}</span>
        <span className="ml-auto text-slate-400 text-xs">Alterar →</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-[300000] flex items-end justify-center bg-black/60 pb-2 px-2"
          onClick={() => setOpen(false)}>
          <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <p className="font-black text-slate-800 text-sm uppercase">Escolher Sprite</p>
              <button onClick={() => setOpen(false)} className="text-slate-400 font-black text-lg">✕</button>
            </div>
            <div className="grid grid-cols-4 gap-2 p-4 max-h-64 overflow-y-auto">
              {sprites.map(sp => (
                <button key={sp.id} onClick={() => { onChange(sp.id); setOpen(false); }}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all
                    ${value === sp.id ? 'border-blue-400 bg-blue-50' : 'border-slate-100 hover:border-slate-300 bg-white'}`}>
                  <img src={sp.sprite} className="w-10 h-10 object-contain"
                    style={{ imageRendering: 'pixelated' }}
                    onError={e => { if (e.target.src !== FALLBACK_SPRITE) e.target.src = FALLBACK_SPRITE; }} />
                  <span className="text-[8px] font-bold text-slate-500 uppercase truncate w-full text-center">{sp.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ─── PokemonPicker ──────────────────────────────────────────────────────────── */
const PokemonPicker = ({ caughtData, selected, level, POKEDEX, onChange, gymType = 'mixed' }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const allCaughtIds = useMemo(
    () => Object.keys(caughtData || {}).map(Number).filter(Boolean).sort((a, b) => a - b),
    [caughtData]
  );
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return allCaughtIds.filter(id => {
      const types = (POKEDEX?.[id]?.types || [POKEDEX?.[id]?.type || 'Normal'])
        .map(type => String(type).toLowerCase());
      if (gymType !== 'mixed' && !types.includes(gymType)) return false;
      if (!search) return true;
      const name = POKEDEX?.[id]?.name?.toLowerCase() || `#${id}`;
      return name.includes(q) || String(id).includes(q);
    });
  }, [allCaughtIds, search, POKEDEX, gymType]);

  const toggle = (id) => {
    if (selected.includes(id)) {
      onChange(selected.filter(x => x !== id));
    } else if (selected.length < SLOT_POKEMON_LIMIT) {
      onChange([...selected, id]);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
          Equipe (Nível {level})
        </p>
        <span className="text-[10px] font-bold text-slate-400">{selected.length}/{SLOT_POKEMON_LIMIT}</span>
      </div>

      {/* Pokémon selecionados */}
      <div className="flex gap-2 flex-wrap mb-2 min-h-[56px] bg-slate-50 rounded-2xl p-2 border-2 border-slate-200">
        {selected.map(id => (
          <button key={id} onClick={() => toggle(id)}
            className="relative group flex flex-col items-center">
            <img src={POKE_IMG(id)} className="w-10 h-10 object-contain"
              onError={e => { e.target.src = FALLBACK_POKEMON; }} />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[8px] flex items-center justify-center font-black opacity-0 group-hover:opacity-100 transition-opacity">✕</div>
          </button>
        ))}
        {selected.length < SLOT_POKEMON_LIMIT && (
          <button onClick={() => setOpen(true)}
            className="w-10 h-10 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 text-xl hover:border-blue-400 hover:text-blue-400 transition-all">
            +
          </button>
        )}
      </div>

      {/* Modal de seleção */}
      {open && (
        <div className="fixed inset-0 z-[300000] flex items-end justify-center bg-black/60 pb-2 px-2"
          onClick={() => setOpen(false)}>
          <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[75vh] flex flex-col"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 shrink-0">
              <p className="font-black text-slate-800 text-sm flex-1">Pokémon Capturados</p>
              <span className="text-xs text-slate-400 font-bold">{selected.length}/{SLOT_POKEMON_LIMIT} selecionados</span>
              <button onClick={() => setOpen(false)} className="text-slate-400 font-black text-lg">✕</button>
            </div>
            <div className="px-4 py-2 shrink-0 border-b border-slate-100">
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Buscar Pokémon..." className="w-full border-2 border-slate-200 rounded-xl px-3 py-2 text-sm font-bold focus:outline-none focus:border-blue-400" />
            </div>
            <div className="grid grid-cols-4 gap-2 p-4 overflow-y-auto">
              {filtered.map(id => {
                const sel = selected.includes(id);
                const disabled = !sel && selected.length >= SLOT_POKEMON_LIMIT;
                const name = POKEDEX?.[id]?.name || `#${id}`;
                return (
                  <button key={id} onClick={() => !disabled && toggle(id)} disabled={disabled}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all
                      ${sel ? 'border-blue-500 bg-blue-50' : disabled ? 'border-slate-100 opacity-40 cursor-not-allowed' : 'border-slate-100 hover:border-slate-300 bg-white'}`}>
                    <img src={POKE_IMG(id)} className="w-10 h-10 object-contain"
                      onError={e => { e.target.src = FALLBACK_POKEMON; }} />
                    <span className="text-[8px] font-bold text-slate-500 uppercase truncate w-full text-center">{name}</span>
                    {sel && <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-white text-[8px] font-black">✓</div>}
                  </button>
                );
              })}
              {filtered.length === 0 && (
                <div className="col-span-4 py-8 text-center text-slate-400 font-bold text-sm">
                  Nenhum Pokémon encontrado
                </div>
              )}
            </div>
            <div className="px-4 py-3 border-t border-slate-100 shrink-0">
              <button onClick={() => setOpen(false)}
                className="w-full bg-blue-600 text-white font-black py-3 rounded-2xl hover:bg-blue-700 active:scale-95 transition-all">
                Confirmar Equipe
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ─── SlotEditor ─────────────────────────────────────────────────────────────── */
const SlotEditor = ({ slot, slotType, slotIndex, caughtData, POKEDEX, onSave, onCancel }) => {
  const defaultLevel = slotType === 'gym'
    ? GYM_SLOT_LEVELS[slotIndex]
    : slotType === 'elite'
    ? ELITE_SLOT_LEVELS[slotIndex]
    : CHAMPION_LEVEL;

  const [bannerId,         setBannerId]         = useState(slot.bannerId         || 'normal');
  const [leaderName,       setLeaderName]       = useState(slot.leaderName       || '');
  const [leaderSprite,     setLeaderSprite]     = useState(slot.leaderSprite     || 'red');
  const [team,             setTeam]             = useState(slot.team             || []);
  const [cardStyle,        setCardStyle]        = useState(slot.cardStyle        || 'classic');
  const [battleBackground, setBattleBackground] = useState(slot.battleBackground || '/bg_gym_1776863824590.webp');

  const handleSave = () => {
    onSave({
      ...slot,
      bannerId,
      leaderName:      leaderName.trim(),
      leaderSprite,
      team,
      customLevel:     defaultLevel,
      cardStyle,
      battleBackground,
      configured:      team.length > 0,
    });
  };

  return (
    <div className="fixed inset-0 z-[200000] flex items-center justify-center bg-black/70 p-3"
      onClick={onCancel}>
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 shrink-0 bg-slate-50">
          <button onClick={onCancel} className="text-slate-400 font-black text-lg w-8 h-8 flex items-center justify-center hover:bg-slate-200 rounded-full transition-all">←</button>
          <div className="flex-1">
            <p className="font-black text-slate-800 text-sm">
              {slotType === 'gym' ? `Ginásio ${slot.slot}` : slotType === 'elite' ? `Elite ${slot.slot}` : 'Campeão'}
            </p>
            <p className="text-[10px] font-bold text-slate-400">
              {slotType === 'gym' ? `Ginásio ${slot.slot} de 8` : slotType === 'elite' ? `Elite ${slot.slot} de 4` : 'Campeão da Região'}
            </p>
          </div>
          <div className="bg-blue-600 text-white px-3 py-1.5 rounded-xl font-black text-sm shadow">
            Nv. {defaultLevel}
          </div>
          <button onClick={handleSave}
            type="button"
            hidden
            className="bg-blue-600 text-white font-black text-xs px-4 py-2 rounded-xl hover:bg-blue-700 active:scale-95 transition-all">
            Salvar ✓
          </button>
        </div>

        {/* Form */}
        <div className="overflow-y-auto p-4 flex flex-col gap-5">
          {/* Tipo (apenas para ginásios) */}
          {slotType === 'gym' && (
            <TypeSelector value={bannerId} onChange={(nextType) => {
              setBannerId(nextType);
              if (nextType !== 'mixed') {
                setTeam(current => current.filter(id => {
                  const types = (POKEDEX?.[id]?.types || [POKEDEX?.[id]?.type || 'Normal']).map(type => String(type).toLowerCase());
                  return types.includes(nextType);
                }));
              }
            }} />
          )}

          {/* Nome do líder */}
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Nome do Líder</p>
            <input value={leaderName} onChange={e => setLeaderName(e.target.value)}
              placeholder={slotType === 'champion' ? 'Nome do Campeão...' : 'Nome do Líder...'}
              maxLength={20}
              className="w-full border-2 border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-400 transition-colors" />
          </div>

          {/* Sprite */}
          <SpriteSelector value={leaderSprite} onChange={setLeaderSprite} />

          {slotType === 'gym' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Visual do Card</p>
                <div className="grid grid-cols-2 gap-2">
                  {REGION_CARD_STYLES.map(style => (
                    <button
                      key={style.id}
                      onClick={() => setCardStyle(style.id)}
                      className={`h-16 rounded-2xl border-2 p-2 text-left overflow-hidden transition-all ${cardStyle === style.id ? 'border-blue-500 scale-[1.02]' : 'border-slate-200'}`}
                      style={{ background: style.preview }}
                    >
                      <span className="text-white text-[10px] font-black uppercase drop-shadow">{style.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Background da Batalha</p>
                <div className="grid grid-cols-1 gap-2 max-h-36 overflow-y-auto pr-1">
                  {REGION_BATTLE_BACKGROUNDS.map(bg => (
                    <button
                      key={bg.id}
                      onClick={() => setBattleBackground(bg.id)}
                      className={`flex items-center gap-2 rounded-2xl border-2 p-2 text-left transition-all ${battleBackground === bg.id ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white'}`}
                    >
                      <img
                        src={fixPath(bg.id)}
                        alt=""
                        className="w-14 h-10 rounded-xl object-cover bg-slate-100"
                        onError={e => { e.target.style.display = 'none'; }}
                      />
                      <span className="text-[10px] font-black uppercase text-slate-700">{bg.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Nível pré-determinado */}
          <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Nível do Desafio</p>
              <p className="text-xs text-slate-400 font-bold mt-0.5">
                {slotType === 'gym'
                  ? `Definido para o Ginásio ${slot.slot} de 8`
                  : slotType === 'elite'
                  ? `Definido para a Elite ${slot.slot} de 4`
                  : 'Nível do Campeão da Região'}
              </p>
            </div>
            <div className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-black text-2xl shadow-md">
              Nv. {defaultLevel}
            </div>
          </div>

          {/* Equipe */}
          <PokemonPicker
            caughtData={caughtData}
            selected={team}
            level={defaultLevel}
            POKEDEX={POKEDEX}
            gymType={slotType === 'gym' ? bannerId : 'mixed'}
            onChange={setTeam}
          />
        </div>
        <div className="shrink-0 border-t border-slate-100 bg-white p-4">
          <button onClick={handleSave}
            className="w-full min-h-[56px] bg-blue-600 text-white font-black text-sm uppercase tracking-widest rounded-2xl hover:bg-blue-700 active:scale-95 transition-all shadow-lg">
            Salvar Configuracao
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── SlotCard ───────────────────────────────────────────────────────────────── */
const SlotCard = ({ slot, slotType, slotIndex, onEdit, POKEDEX }) => {
  const level = getSlotLevel(slotType, slotIndex, slot);
  const typeInfo  = REGION_GYM_TYPES[slot.bannerId] || REGION_GYM_TYPES.normal;
  const labelText = slotType === 'gym' ? `Líder ${slot.slot}` : slotType === 'elite' ? `Elite ${slot.slot}` : 'Campeão';
  const badgeId   = slotType === 'gym' ? BADGE_MAP[slotIndex] : null;

  return (
    <div onClick={onEdit}
      className="relative bg-white rounded-[2rem] border-2 border-slate-100 shadow-xl overflow-hidden cursor-pointer hover:border-blue-400 hover:shadow-2xl active:scale-[0.98] transition-all group">
      
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-20 -mr-16 -mt-16 pointer-events-none transition-all group-hover:opacity-40"
        style={{ background: slotType === 'gym' ? typeInfo.color : slotType === 'elite' ? '#8b5cf6' : '#f59e0b' }} />

      {/* Type Icon Overlay (Gym Only) */}
      {slotType === 'gym' && (
        <div className="absolute top-4 right-4 w-12 h-12 flex items-center justify-center opacity-40 group-hover:opacity-100 transition-all">
          <img src={typeInfo.icon} className="w-8 h-8 object-contain filter drop-shadow-[0_0_8px_rgba(0,0,0,0.3)]" alt="" 
            style={{ filter: `drop-shadow(0 0 12px ${typeInfo.color})` }}/>
        </div>
      )}

      <div className="p-5 flex flex-col gap-4">
        {/* Header Section */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-[1.25rem] bg-slate-100 flex items-center justify-center border-2 border-slate-200 overflow-hidden shadow-inner">
              <img src={TRAINER_IMG(slot.leaderSprite)} className="w-14 h-14 object-contain"
                style={{ imageRendering: 'pixelated' }}
                onError={e => { if (e.target.src !== FALLBACK_SPRITE) e.target.src = FALLBACK_SPRITE; }} />
            </div>
            {badgeId && (
              <img src={`/badges/${badgeId}.webp`} className="absolute -bottom-1 -right-1 w-7 h-7 object-contain drop-shadow-md border-2 border-white rounded-full bg-white/80" alt="Badge" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-white px-2 py-0.5 rounded-lg shadow-sm"
                style={{ background: slotType === 'gym' ? typeInfo.color : slotType === 'elite' ? '#8b5cf6' : '#f59e0b' }}>
                {slotType === 'gym' ? `G${slot.slot}` : slotType === 'elite' ? `E${slot.slot}` : '🏆'}
              </span>
              <p className="font-black text-slate-800 text-sm truncate uppercase tracking-tight">
                {slot.leaderName || labelText}
              </p>
            </div>
            <div className="flex items-center gap-2 mt-1">
               <p className="text-[11px] font-black text-blue-600 bg-blue-50 px-2 rounded-md">Nv. {level}</p>
               <p className="text-[10px] font-bold text-slate-400">{slot.team.length}/6 Pokémon</p>
            </div>
          </div>
        </div>

        {/* Team Grid (Hign-Fidelity) */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 bg-slate-50/50 p-2 rounded-2xl border border-slate-100">
          {[...Array(6)].map((_, i) => {
            const pokeId = slot.team[i];
            return (
              <div key={i} className={`relative aspect-square rounded-xl flex items-center justify-center border-2 transition-all
                ${pokeId ? 'bg-white border-slate-100 shadow-sm' : 'bg-slate-100/50 border-dashed border-slate-200'}`}>
                {pokeId ? (
                  <>
                    <img src={POKE_IMG(pokeId)} className="w-10 h-10 object-contain"
                      onError={e => { e.target.src = FALLBACK_POKEMON; }} />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-slate-800 text-white rounded-full text-[8px] flex items-center justify-center font-black border border-white shadow-sm">
                      {level}
                    </div>
                  </>
                ) : (
                  <span className="text-slate-300 text-xs">+</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {!slot.configured && (
        <div className="bg-amber-500 py-1.5 px-4 text-center">
          <p className="text-[9px] font-black text-white uppercase tracking-widest flex items-center justify-center gap-1">
            <span>⚠️</span> Pendente: Configure a equipe
          </p>
        </div>
      )}
    </div>
  );
};

/* ─── LockedSlotCard ───────────────────────────────────────────────────────── */
const LockedSlotCard = ({ number, cost, onBuy, canAfford, slotType }) => (
  <div className={`bg-white rounded-2xl border-2 border-dashed ${canAfford ? 'border-blue-300' : 'border-slate-200'} shadow-sm overflow-hidden opacity-70`}>
    <div className="p-3 flex items-center gap-3">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center shrink-0 text-2xl text-slate-300">
        🔒
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-black text-slate-500 text-xs">
          {slotType === 'gym' ? `Ginásio ${number}` : slotType === 'elite' ? `Elite ${number}` : 'Campeão'}
        </p>
        <p className="text-[10px] font-bold text-slate-400 mt-0.5">
          Nv.{slotType === 'gym' ? GYM_SLOT_LEVELS[number - 1] : slotType === 'elite' ? ELITE_SLOT_LEVELS[number - 1] : CHAMPION_LEVEL}
        </p>
        <p className={`text-[10px] font-black mt-1 ${canAfford ? 'text-amber-500' : 'text-slate-400'}`}>
          {cost.toLocaleString()} coins
        </p>
      </div>
      <button onClick={onBuy} disabled={!canAfford}
        className={`text-xs font-black px-3 py-2 rounded-xl transition-all active:scale-95 shrink-0
          ${canAfford ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}>
        Comprar
      </button>
    </div>
  </div>
);

/* ─── RegionBuilderScreen ────────────────────────────────────────────────────── */
const RegionBuilderScreen = ({ gameState, setGameState, POKEDEX, onClose }) => {
  const myRegion   = gameState.myRegion   || {};
  const caughtData = gameState.caughtData || {};
  const currency   = gameState.currency   || 0;

  const [tab,         setTab]        = useState('gyms');
  const [editing,     setEditing]    = useState(null); // { type, index, slot }
  const [toast,       setToast]      = useState(null);
  const [regionName,  setRegionName] = useState(myRegion.regionName || '');
  const [published,   setPublished]  = useState(myRegion.published || false);

  const gymSlots   = getGymSlots(myRegion);
  const eliteSlots = getEliteSlots(myRegion);
  const champion   = myRegion.champion || null;

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  /* ── Comprar slot ── */
  const buySlot = (type) => {
    setGameState(prev => {
      const region = prev.myRegion || {};
      let cost = 0;

      if (type === 'gym') {
        const nextIdx = region.gymSlots || 0;
        if (nextIdx >= 8) return prev;
        cost = GYM_SLOT_COSTS[nextIdx];
      } else if (type === 'elite') {
        // Requer todos os 8 ginásios primeiro
        if ((region.gymSlots || 0) < 8) { showToast('Compre todos os 8 ginásios primeiro!', 'error'); return prev; }
        const nextIdx = region.eliteSlots || 0;
        if (nextIdx >= 4) return prev;
        cost = ELITE_SLOT_COSTS[nextIdx];
      } else if (type === 'champion') {
        // Requer toda a Elite Four primeiro
        if ((region.eliteSlots || 0) < 4) { showToast('Complete a Elite Four primeiro!', 'error'); return prev; }
        if (region.championSlot) return prev;
        cost = CHAMPION_SLOT_COST;
      }

      if ((prev.currency || 0) < cost) return prev;

      const updated = { ...region };
      if (type === 'gym')      updated.gymSlots      = (region.gymSlots      || 0) + 1;
      if (type === 'elite')    updated.eliteSlots     = (region.eliteSlots    || 0) + 1;
      if (type === 'champion') { updated.championSlot = true; updated.champion = defaultChampion(); }

      return { ...prev, currency: prev.currency - cost, myRegion: updated };
    });
    showToast('Slot desbloqueado!');
  };

  /* ── Salvar config de slot ── */
  const saveSlot = useCallback((updatedSlot) => {
    setGameState(prev => {
      const region = { ...(prev.myRegion || {}) };

      if (editing.type === 'gym') {
        const gyms = [...(region.gyms || [])];
        const idx = gyms.findIndex(g => g.slot === updatedSlot.slot);
        if (idx >= 0) gyms[idx] = updatedSlot; else gyms.push(updatedSlot);
        region.gyms = gyms;
      } else if (editing.type === 'elite') {
        const elites = [...(region.eliteFour || [])];
        const idx = elites.findIndex(e => e.slot === updatedSlot.slot);
        if (idx >= 0) elites[idx] = updatedSlot; else elites.push(updatedSlot);
        region.eliteFour = elites;
      } else if (editing.type === 'champion') {
        region.champion = updatedSlot;
      }

      return { ...prev, myRegion: region };
    });
    setEditing(null);
    showToast('Configuração salva!');
  }, [editing, setGameState]);

  /* ── Publicar / despublicar ── */
  const [publishConfirm, setPublishConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleTogglePublish = () => {
    if (!published) {
      // Ao publicar: validar região antes de mostrar confirmação
      const validationErrors = [];
      if (!regionName.trim()) validationErrors.push('Dê um nome à sua região antes de publicar.');
      if (!readyToPublish) validationErrors.push('Configure pelo menos 1 ginásio com equipe.');
      if (validationErrors.length > 0) { showToast(validationErrors[0], 'error'); return; }
      setPublishConfirm(true);
    } else {
      // Despublicar diretamente (sem confirmação)
      applyPublish(false);
    }
  };

  const applyPublish = (newPublished) => {
    setIsSaving(true);
    // Validar e limpar Pokémon removidos do caughtData antes de salvar
    setGameState(prev => {
      const region = { ...(prev.myRegion || {}) };
      const caught = prev.caughtData || {};

      // Limpa times com Pokémon que o jogador não tem mais
      const cleanTeam = (team) => (team || []).filter(id => !!caught[id]);
      region.gyms = (region.gyms || []).map(g => {
        const cleanedTeam = cleanTeam(g.team);
        return { ...g, team: cleanedTeam, configured: cleanedTeam.length > 0 };
      });
      region.eliteFour = (region.eliteFour || []).map(e => {
        const cleanedTeam = cleanTeam(e.team);
        return { ...e, team: cleanedTeam, configured: cleanedTeam.length > 0 };
      });
      if (region.champion) {
        const cleanedTeam = cleanTeam(region.champion.team);
        region.champion = { ...region.champion, team: cleanedTeam, configured: cleanedTeam.length > 0 };
      }

      return {
        ...prev,
        myRegion: {
          ...region,
          regionName: regionName.trim(),
          published:  newPublished,
          lastPublishedAt: newPublished ? Date.now() : (region.lastPublishedAt || null),
        }
      };
    });
    setPublished(newPublished);
    setPublishConfirm(false);
    setTimeout(() => setIsSaving(false), 1000);
    showToast(newPublished ? '🌐 Região publicada! Amigos podem te desafiar.' : 'Região retirada do ar.');
  };

  const handleSaveName = () => {
    setGameState(prev => ({
      ...prev,
      myRegion: { ...(prev.myRegion || {}), regionName: regionName.trim() }
    }));
    showToast('Nome salvo!');
  };

  const readyToPublish = isRegionReadyToPublish(myRegion);

  const tabs = [
    { id: 'gyms',     icon: '🏟️', label: 'Ginásios', badge: gymSlots.filter(g => g.configured).length + '/' + myRegion.gymSlots },
    { id: 'elite',    icon: '👑', label: 'Elite 4',  badge: eliteSlots.filter(e => e.configured).length + '/' + myRegion.eliteSlots },
    { id: 'champion', icon: '🏆', label: 'Campeão' },
    { id: 'publish',  icon: '🌐', label: 'Publicar' },
  ];

  return (
    <div className="fixed inset-x-0 bottom-0 z-[100001] flex flex-col bg-slate-50 animate-fadeIn" style={{ top: '56px' }}>

      {/* ── Header ── */}
      <div className="shrink-0 px-4 py-3 flex items-center gap-3"
        style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}>
        <button onClick={onClose}
          className="w-9 h-9 rounded-full bg-white/20 text-white font-black text-lg flex items-center justify-center hover:bg-white/30 active:scale-95 transition-all">
          ←
        </button>
        <div className="flex-1">
          <p className="text-white/60 text-[9px] font-black uppercase tracking-[0.35em]">LOJA DE PRESTÍGIO</p>
          <h2 className="text-white text-lg font-black uppercase leading-tight tracking-tighter">
            {myRegion.regionName ? myRegion.regionName : 'Minha Região'}
          </h2>
        </div>
        {myRegion.published && (
          <span className="bg-emerald-400 text-white text-[9px] font-black px-2 py-1 rounded-full uppercase tracking-wide">
            🌐 Publicado
          </span>
        )}
      </div>

      {/* ── Toast ── */}
      {toast && (
        <div className={`text-white text-sm font-bold text-center px-4 py-2 shrink-0 animate-fadeIn
          ${toast.type === 'error' ? 'bg-red-500' : toast.type === 'info' ? 'bg-slate-500' : 'bg-emerald-500'}`}>
          {toast.msg}
        </div>
      )}

      {/* ── Tabs ── */}
      <div className="shrink-0 flex bg-white border-b-2 border-slate-100 shadow-sm">
        {tabs.map(t => {
          const active = tab === t.id;
          return (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-black uppercase tracking-tight transition-all
                ${active ? 'text-violet-600 border-b-[3px] border-violet-600 -mb-0.5 bg-violet-50/50' : 'text-slate-400 hover:text-slate-600'}`}>
              <span className="text-base">{t.icon}</span>
              <span>{t.label}</span>
              {t.badge && <span className="text-[8px] font-bold text-slate-400">{t.badge}</span>}
            </button>
          );
        })}
      </div>

      {/* ── Conteúdo ── */}
      <div className="flex-1 overflow-y-auto p-4 pb-10">

        {/* ══ GINÁSIOS ═══════════════════════════════════════════════════ */}
        {tab === 'gyms' && (
          <div className="flex flex-col gap-3">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
              {myRegion.gymSlots || 0}/8 Ginásios desbloqueados
            </p>

            {/* Slots comprados */}
            {gymSlots.map((slot, i) => (
              <SlotCard key={slot.slot} slot={slot} slotType="gym" slotIndex={i}
                POKEDEX={POKEDEX}
                onEdit={() => setEditing({ type: 'gym', index: i, slot })} />
            ))}

            {/* Próximo slot a comprar */}
            {(myRegion.gymSlots || 0) < 8 && (
              <LockedSlotCard
                number={(myRegion.gymSlots || 0) + 1}
                cost={GYM_SLOT_COSTS[myRegion.gymSlots || 0]}
                slotType="gym"
                canAfford={currency >= GYM_SLOT_COSTS[myRegion.gymSlots || 0]}
                onBuy={() => buySlot('gym')}
              />
            )}

            {myRegion.gymSlots === 0 && (
              <div className="bg-violet-50 border border-violet-200 rounded-2xl p-4 text-center">
                <p className="text-violet-700 font-black text-sm">Compre seu primeiro Ginásio!</p>
                <p className="text-violet-500 text-xs mt-1 font-bold">Custo inicial: {GYM_SLOT_COSTS[0].toLocaleString()} coins</p>
              </div>
            )}
          </div>
        )}

        {/* ══ ELITE FOUR ════════════════════════════════════════════════ */}
        {tab === 'elite' && (
          <div className="flex flex-col gap-3">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
              {myRegion.eliteSlots || 0}/4 Membros desbloqueados
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-xs text-amber-700 font-bold">
              💡 Os membros da Elite Four exigem pelo menos {(myRegion.gymSlots || 0) < 4 ? `4 ginásios (você tem ${myRegion.gymSlots || 0})` : 'que a Liga esteja montada'} para desafio completo.
            </div>

            {eliteSlots.map((slot, i) => (
              <SlotCard key={slot.slot} slot={slot} slotType="elite" slotIndex={i}
                POKEDEX={POKEDEX}
                onEdit={() => setEditing({ type: 'elite', index: i, slot })} />
            ))}

            {(myRegion.eliteSlots || 0) < 4 && (
              <LockedSlotCard
                number={(myRegion.eliteSlots || 0) + 1}
                cost={ELITE_SLOT_COSTS[myRegion.eliteSlots || 0]}
                slotType="elite"
                canAfford={currency >= ELITE_SLOT_COSTS[myRegion.eliteSlots || 0]}
                onBuy={() => buySlot('elite')}
              />
            )}
          </div>
        )}

        {/* ══ CAMPEÃO ═══════════════════════════════════════════════════ */}
        {tab === 'champion' && (
          <div className="flex flex-col gap-3">
            {!myRegion.championSlot ? (
              <>
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center flex flex-col gap-2">
                  <span className="text-5xl">🏆</span>
                  <p className="font-black text-amber-800 text-sm">Slot de Campeão</p>
                  <p className="text-amber-600 text-xs font-bold">O Campeão é o último desafio da sua região. Ele usa Pokémon de nível {CHAMPION_LEVEL}.</p>
                </div>
                <LockedSlotCard
                  number={1}
                  cost={CHAMPION_SLOT_COST}
                  slotType="champion"
                  canAfford={currency >= CHAMPION_SLOT_COST}
                  onBuy={() => buySlot('champion')}
                />
              </>
            ) : champion ? (
              <SlotCard slot={champion} slotType="champion" slotIndex={0}
                POKEDEX={POKEDEX}
                onEdit={() => setEditing({ type: 'champion', index: 0, slot: champion })} />
            ) : null}
          </div>
        )}

        {/* ══ PUBLICAR ══════════════════════════════════════════════════ */}
        {tab === 'publish' && (
          <div className="flex flex-col gap-4">
            {/* Nome da região */}
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Nome da Região</p>
              <div className="flex gap-2">
                <input value={regionName} onChange={e => setRegionName(e.target.value)}
                  placeholder={`Região de ${gameState.trainer?.name || 'Treinador'}...`}
                  maxLength={30}
                  className="flex-1 border-2 border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-violet-400 transition-colors" />
                <button onClick={handleSaveName}
                  className="bg-violet-600 text-white font-black text-sm px-4 py-3 rounded-2xl hover:bg-violet-700 active:scale-95 transition-all">
                  ✓
                </button>
              </div>
            </div>

            {/* Status */}
            <div className="bg-white rounded-2xl border-2 border-slate-100 shadow-sm p-4 flex flex-col gap-3">
              <p className="font-black text-slate-700 text-sm">Status da Região</p>
              <div className="grid grid-cols-3 gap-3 text-center">
                {[
                  { label: 'Ginásios', value: `${gymSlots.filter(g=>g.configured).length}/${myRegion.gymSlots||0}`, color: 'text-violet-600' },
                  { label: 'Elite', value: `${eliteSlots.filter(e=>e.configured).length}/${myRegion.eliteSlots||0}`, color: 'text-purple-600' },
                  { label: 'Campeão', value: champion?.configured ? '✓' : '—', color: 'text-amber-600' },
                ].map(s => (
                  <div key={s.label} className="bg-slate-50 rounded-xl p-3">
                    <p className={`font-black text-lg ${s.color}`}>{s.value}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase">{s.label}</p>
                  </div>
                ))}
              </div>

              {!readyToPublish && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700 font-bold text-center">
                  ⚠ Configure pelo menos 1 ginásio com equipe para publicar.
                </div>
              )}
            </div>

            {/* Toggle publicar */}
            <div className={`rounded-2xl p-5 flex flex-col gap-3 border-2 transition-all ${published ? 'bg-emerald-50 border-emerald-300' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <p className={`font-black text-base ${published ? 'text-emerald-700' : 'text-slate-700'}`}>
                    {published ? '🌐 Região Publicada' : 'Região Privada'}
                  </p>
                  <p className={`text-xs font-bold mt-0.5 ${published ? 'text-emerald-500' : 'text-slate-400'}`}>
                    {published ? 'Amigos podem ver e desafiar sua região.' : 'Apenas você pode ver sua região.'}
                  </p>
                </div>
                {/* Toggle switch */}
                <button onClick={() => readyToPublish && handleTogglePublish()}
                  disabled={!readyToPublish && !published}
                  className={`relative w-14 h-8 rounded-full transition-all shrink-0 ${published ? 'bg-emerald-500' : 'bg-slate-300'} ${!readyToPublish && !published ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}>
                  <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-all ${published ? 'left-7' : 'left-1'}`} />
                </button>
              </div>

              {published && myRegion.lastPublishedAt && (
                <p className="text-[10px] font-bold text-emerald-500">
                  Publicado em {new Date(myRegion.lastPublishedAt).toLocaleDateString('pt-BR')}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Editor de slot (overlay) ── */}
      {editing && (
        <SlotEditor
          slot={editing.slot}
          slotType={editing.type}
          slotIndex={editing.index}
          caughtData={caughtData}
          POKEDEX={POKEDEX}
          onSave={saveSlot}
          onCancel={() => setEditing(null)}
        />
      )}

      {/* ── Modal: Confirmar publicação ── */}
      {publishConfirm && (
        <div className="fixed inset-0 z-[200000] flex items-end justify-center pb-6 px-4"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={() => setPublishConfirm(false)}>
          <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border-2 border-emerald-100 overflow-hidden"
            onClick={e => e.stopPropagation()}>
            <div className="p-5 text-center">
              <span className="text-4xl">🌐</span>
              <p className="font-black text-slate-800 text-lg mt-2">Publicar Região?</p>
              <p className="text-slate-500 text-sm mt-1 leading-relaxed">
                Sua região <strong>"{regionName.trim() || 'Sem nome'}"</strong> ficará visível para seus amigos desafiarem.
                Pokémon inválidos serão removidos automaticamente.
              </p>
            </div>
            <div className="flex border-t border-slate-100">
              <button onClick={() => setPublishConfirm(false)}
                className="flex-1 py-4 font-black text-slate-500 hover:bg-slate-50 transition-all">
                Cancelar
              </button>
              <div className="w-px bg-slate-100" />
              <button onClick={() => applyPublish(true)}
                disabled={isSaving}
                className="flex-1 py-4 font-black text-emerald-600 hover:bg-emerald-50 transition-all disabled:opacity-40">
                {isSaving ? '⏳ Salvando...' : '🌐 Publicar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegionBuilderScreen;
