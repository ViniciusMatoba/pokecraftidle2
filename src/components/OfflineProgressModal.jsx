import { useState } from 'react';
import { formatOfflineTime } from '../utils/offlineProgress';

const MATERIAL_INFO = {
  normal_essence:      { label: 'Essência Normal',          use: 'Forja de itens tipo Normal e receitas gerais.' },
  fire_essence:        { label: 'Essência Fogo',            use: 'Forja de itens de Fogo e equipamentos de ataque.' },
  water_essence:       { label: 'Essência Água',            use: 'Forja de itens de Água e equipamentos defensivos.' },
  grass_essence:       { label: 'Essência Planta',          use: 'Forja de itens de Planta e suporte de cura.' },
  electric_essence:    { label: 'Essência Elétrica',        use: 'Forja de itens Elétrico e boosts de velocidade.' },
  ice_essence:         { label: 'Essência Gelo',            use: 'Forja de itens de Gelo e redução de status.' },
  fighting_essence:    { label: 'Essência Luta',            use: 'Forja de itens físicos e aumento de ataque.' },
  poison_essence:      { label: 'Essência Veneno',          use: 'Forja de itens Venenosos e DoT de batalha.' },
  ground_essence:      { label: 'Essência Terra',           use: 'Forja de itens de Terra e armaduras físicas.' },
  flying_essence:      { label: 'Essência Voador',          use: 'Forja de itens Voadores e boosts de evasão.' },
  psychic_essence:     { label: 'Essência Psíquico',        use: 'Forja de itens Psíquicos e aumentos de Sp. Atk.' },
  bug_essence:         { label: 'Essência Inseto',          use: 'Forja de itens de Inseto e recuperação de PP.' },
  rock_essence:        { label: 'Essência Pedra',           use: 'Forja de armaduras de pedra e escudos.' },
  ghost_essence:       { label: 'Essência Fantasma',        use: 'Forja de itens Fantasma e habilidades especiais.' },
  dragon_essence:      { label: 'Essência Dragão',          use: 'Forja de itens de Dragão e equipamentos raros.' },
  steel_essence:       { label: 'Essência Aço',             use: 'Forja de armaduras de Aço e itens defensivos.' },
  fairy_essence:       { label: 'Essência Fada',            use: 'Forja de itens Fada e boosts de Sp. Def.' },
  dark_essence:        { label: 'Essência Sombrio',         use: 'Forja de itens Sombrios e boost de crítico.' },
  mystic_dust:         { label: 'Pó Místico',               use: 'Ingrediente raro para receitas de evolução e forja avançada. Só cai de Pokémon Shiny.' },
  iron_ore:            { label: 'Minério de Ferro',         use: 'Base para forjar armaduras e escudos físicos.' },
  armor_fragment:      { label: 'Fragmento de Armadura',    use: 'Necessário para melhorar equipamentos de defesa.' },
  stardust:            { label: 'Pó Estelar',               use: 'Item raro usado em receitas especiais e boosts de XP.' },
  sharp_claw:          { label: 'Garra Afiada',             use: 'Ingrediente para forjar garras e itens de ataque físico.' },
  scale_dust:          { label: 'Pó de Escama',             use: 'Forja de armaduras leves e itens de Sp. Def.' },
  ember_shard:         { label: 'Estilhaço de Brasa',       use: 'Ingrediente de forja de itens de Fogo potentes.' },
  thunder_fang:        { label: 'Presa Trovão',             use: 'Ingrediente de itens Elétricos e boost de paralisia.' },
  ice_crystal:         { label: 'Cristal de Gelo',          use: 'Ingrediente para itens de Gelo e congelamento.' },
  poison_barb:         { label: 'Farpa Venenosa',           use: 'Ingrediente de itens de envenenamento e DoT.' },
  hard_shell:          { label: 'Casca Dura',               use: 'Base para escudos e armaduras de alta defesa.' },
  spirit_dust:         { label: 'Pó Espiritual',            use: 'Forja de itens Fantasma e recuperação de HP noturna.' },
  dragon_fang:         { label: 'Presa Dracônica',          use: 'Ingrediente raro para itens de Dragão e armas épicas.' },
  aura_fragment:       { label: 'Fragmento de Aura',        use: 'Ingrediente de itens Psíquicos e Fada de alta raridade.' },
  leaf_debris:         { label: 'Folha Dispersa',           use: 'Ingrediente básico de Planta para poções e itens de cura.' },
  wave_stone:          { label: 'Pedra Onda',               use: 'Ingrediente de itens de Água e boost de precisão.' },
  moon_stone_shard:    { label: 'Estilhaço Pedra Lua',      use: 'Fragmento de Pedra Lua — pode ser combinado em uma Pedra Lua completa para evoluções.' },
  fire_stone_shard:    { label: 'Estilhaço Pedra Fogo',     use: 'Fragmento de Pedra Fogo — combine para evoluir Pokémon de Fogo.' },
  thunder_stone_shard: { label: 'Estilhaço Pedra Trovão',   use: 'Fragmento de Pedra Trovão — combine para evoluções elétricas.' },
  leaf_stone_shard:    { label: 'Estilhaço Pedra Folha',    use: 'Fragmento de Pedra Folha — combine para evoluções de Planta.' },
  sun_stone_shard:     { label: 'Estilhaço Pedra Sol',      use: 'Fragmento de Pedra Sol — combine para evoluções de Fogo/Fada.' },
  water_stone_shard:   { label: 'Estilhaço Pedra Água',     use: 'Fragmento de Pedra Água — combine para evoluções aquáticas.' },
  fury_essence:        { label: 'Essência Furiosa',         use: 'Ingrediente de itens de combate e boost de Ataque físico.' },
  dragon_scale:        { label: 'Escama de Dragão',         use: 'Ingrediente raro para forja de itens de Dragão épicos.' },
};

const TYPE_COLORS = {
  Normal: '#A8A878', Fire: '#F08030', Water: '#6890F0', Grass: '#78C850',
  Electric: '#F8D030', Ice: '#98D8D8', Fighting: '#C03028', Poison: '#A040A0',
  Ground: '#E0C068', Flying: '#A890F0', Psychic: '#F85888', Bug: '#A8B820',
  Rock: '#B8A038', Ghost: '#705898', Dragon: '#7038F8', Dark: '#705848',
  Steel: '#B8B8D0', Fairy: '#EE99AC',
};

const RARITY_COLORS = {
  common: '#94a3b8', uncommon: '#4ade80', rare: '#60a5fa',
  very_rare: '#c084fc', super_rare: '#f59e0b', legendary: '#ef4444',
};

const RARITY_LABELS = {
  common: 'Comum', uncommon: 'Incomum', rare: 'Raro',
  very_rare: 'Muito Raro', super_rare: 'Super Raro', legendary: 'Lendário',
};

function XPBar({ xp, level }) {
  const xpNeeded = Math.pow(level + 1, 3) - Math.pow(level, 3);
  const pct = level >= 100 ? 100 : Math.min(100, Math.floor((xp / xpNeeded) * 100));
  return (
    <div className="w-full bg-white/10 rounded-full h-1.5 mt-1">
      <div className="h-1.5 rounded-full bg-yellow-400 transition-all" style={{ width: `${pct}%` }} />
    </div>
  );
}

function TeamMemberCard({ member }) {
  const [open, setOpen] = useState(false);
  const leveledUp = member.levelsGained > 0;

  return (
    <button
      onClick={() => setOpen(o => !o)}
      className="w-full text-left bg-white/10 rounded-2xl overflow-hidden transition-all active:scale-98"
    >
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
            style={{ background: 'rgba(255,255,255,0.1)' }}>
            {member.isShiny ? '✨' : '⚔️'}
          </div>
          <div>
            <p className="text-white font-bold text-sm">{member.name}</p>
            <p className="text-indigo-300 text-xs">Nv. {member.startLevel} → <span className={leveledUp ? 'text-yellow-300 font-black' : 'text-indigo-200'}>{member.newLevel}</span></p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {leveledUp && (
            <span className="bg-yellow-400 text-black text-xs font-black px-2 py-0.5 rounded-full">
              +{member.levelsGained} nível{member.levelsGained > 1 ? 'is' : ''}
            </span>
          )}
          <span className="text-indigo-400 text-xs">{open ? '▲' : '▼'}</span>
        </div>
      </div>

      {open && (
        <div className="px-4 pb-3 border-t border-white/10 pt-2">
          <div className="flex justify-between items-center mb-1">
            <span className="text-indigo-300 text-xs">XP ganho offline</span>
            <span className="text-yellow-300 text-xs font-bold">+{member.xpGained.toLocaleString()} XP</span>
          </div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-indigo-300 text-xs">Nível atual</span>
            <span className="text-white text-xs font-bold">{member.newLevel}</span>
          </div>
          <XPBar xp={member.newXp} level={member.newLevel} />
          <p className="text-indigo-400 text-xs mt-1 text-right">
            {member.newLevel < 100
              ? `${member.newXp} / ${Math.pow(member.newLevel + 1, 3) - Math.pow(member.newLevel, 3)} XP`
              : 'Nível máximo!'}
          </p>
        </div>
      )}
    </button>
  );
}

function MaterialCard({ matKey, qty }) {
  const [open, setOpen] = useState(false);
  const info = MATERIAL_INFO[matKey] || { label: matKey, use: 'Ingrediente de forja.' };

  return (
    <button
      onClick={() => setOpen(o => !o)}
      className="w-full text-left flex flex-col rounded-xl overflow-hidden transition-all active:scale-98"
      style={{ background: open ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)' }}
    >
      <div className="flex justify-between items-center px-3 py-2">
        <span className="text-white text-xs font-medium">{info.label}</span>
        <div className="flex items-center gap-2">
          <span className="text-indigo-200 font-bold text-xs">+{qty}</span>
          <span className="text-indigo-400 text-[10px]">{open ? '▲' : 'ℹ'}</span>
        </div>
      </div>
      {open && (
        <div className="px-3 pb-2 border-t border-white/10 pt-1">
          <p className="text-indigo-300 text-[11px] leading-relaxed">{info.use}</p>
        </div>
      )}
    </button>
  );
}

function CaptureCard({ capture }) {
  const [open, setOpen] = useState(false);
  const typeColor = TYPE_COLORS[capture.type] || '#888';
  const rarityColor = RARITY_COLORS[capture.rarity] || '#888';

  return (
    <button
      onClick={() => setOpen(o => !o)}
      className="w-full text-left flex flex-col rounded-xl overflow-hidden transition-all active:scale-98"
      style={{ background: open ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)' }}
    >
      <div className="flex items-center justify-between px-3 py-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: typeColor }} />
          <span className="text-white text-xs font-bold">{capture.name}</span>
          {capture.count > 1 && (
            <span className="text-indigo-300 text-[10px]">×{capture.count}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: rarityColor + '30', color: rarityColor }}>
            {RARITY_LABELS[capture.rarity] || capture.rarity}
          </span>
          <span className="text-indigo-400 text-[10px]">{open ? '▲' : 'ℹ'}</span>
        </div>
      </div>
      {open && (
        <div className="px-3 pb-2 border-t border-white/10 pt-1 flex flex-col gap-1">
          <div className="flex justify-between">
            <span className="text-indigo-300 text-[11px]">Nível capturado</span>
            <span className="text-white text-[11px] font-bold">{capture.level}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-indigo-300 text-[11px]">Tipo</span>
            <span className="text-[11px] font-bold" style={{ color: typeColor }}>{capture.type}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-indigo-300 text-[11px]">Raridade</span>
            <span className="text-[11px] font-bold" style={{ color: rarityColor }}>{RARITY_LABELS[capture.rarity]}</span>
          </div>
          <p className="text-indigo-400 text-[10px] mt-1">Capturado enquanto você estava offline via Auto-Captura.</p>
        </div>
      )}
    </button>
  );
}

export default function OfflineProgressModal({ progress, onClose }) {
  if (!progress) return null;

  const [section, setSection] = useState('team'); // 'team' | 'items' | 'captures'

  const hasMaterials = Object.keys(progress.materials).length > 0;
  const hasCaptures = progress.captures?.length > 0;
  const hasTeam = progress.teamProgress?.length > 0;
  const timeStr = formatOfflineTime(progress.cappedMs);

  const tabs = [
    { id: 'team', label: 'Time', icon: '⚔️', show: hasTeam },
    { id: 'items', label: 'Itens', icon: '📦', show: hasMaterials },
    { id: 'captures', label: 'Capturas', icon: '🔴', show: true },
  ].filter(t => t.show);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      style={{ background: 'rgba(0,0,0,0.80)', backdropFilter: 'blur(6px)' }}
    >
      <div
        className="relative w-full max-w-sm rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col"
        style={{
          background: 'linear-gradient(160deg, #1e1b4b 0%, #312e81 60%, #1e1b4b 100%)',
          border: '2px solid rgba(129,140,248,0.35)',
          maxHeight: '90vh',
        }}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 text-center flex-shrink-0">
          <div className="text-4xl mb-1">🌙</div>
          <h2 className="text-white font-black text-xl tracking-wide">Bem-vindo de volta!</h2>
          <p className="text-indigo-300 text-sm mt-1">
            Fora por <span className="text-white font-bold">{timeStr}</span>
            {' · '}
            <span className="text-indigo-200">{progress.battles.toLocaleString()} batalhas</span>
          </p>

          {/* Resumo rápido */}
          <div className="flex gap-2 mt-3 justify-center">
            <div className="bg-white/10 rounded-xl px-3 py-1.5 text-center">
              <p className="text-yellow-300 font-black text-sm">+{progress.coins.toLocaleString()}</p>
              <p className="text-indigo-400 text-[10px]">moedas</p>
            </div>
            <div className="bg-white/10 rounded-xl px-3 py-1.5 text-center">
              <p className="text-yellow-300 font-black text-sm">+{progress.xp.toLocaleString()}</p>
              <p className="text-indigo-400 text-[10px]">XP total</p>
            </div>
            {hasMaterials && (
              <div className="bg-white/10 rounded-xl px-3 py-1.5 text-center">
                <p className="text-yellow-300 font-black text-sm">{Object.keys(progress.materials).length}</p>
                <p className="text-indigo-400 text-[10px]">materiais</p>
              </div>
            )}
            {hasCaptures && (
              <div className="bg-white/10 rounded-xl px-3 py-1.5 text-center">
                <p className="text-yellow-300 font-black text-sm">{progress.captures.length}</p>
                <p className="text-indigo-400 text-[10px]">capturados</p>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        {tabs.length > 1 && (
          <div className="flex gap-1 mx-4 mb-3 bg-white/5 rounded-xl p-1 flex-shrink-0">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setSection(tab.id)}
                className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-bold transition-all"
                style={{
                  background: section === tab.id ? 'rgba(99,102,241,0.6)' : 'transparent',
                  color: section === tab.id ? 'white' : 'rgba(148,163,184,1)',
                }}
              >
                <span>{tab.icon}</span> {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Content — scrollable */}
        <div className="px-4 pb-4 flex flex-col gap-2 overflow-y-auto flex-1" style={{ minHeight: 0 }}>

          {/* Seção Time */}
          {section === 'team' && hasTeam && progress.teamProgress.map((member, idx) => (
            <TeamMemberCard key={member.instanceId || idx} member={member} />
          ))}

          {/* Seção Itens */}
          {section === 'items' && (
            <>
              {/* Moedas */}
              <div className="flex items-center justify-between bg-white/10 rounded-2xl px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🪙</span>
                  <div>
                    <p className="text-white font-bold text-sm">Moedas</p>
                    <p className="text-indigo-400 text-[11px]">Ganhas derrotando inimigos</p>
                  </div>
                </div>
                <span className="text-yellow-300 font-black">+{progress.coins.toLocaleString()}</span>
              </div>

              {hasMaterials && (
                <div className="bg-white/10 rounded-2xl px-3 py-3">
                  <p className="text-indigo-300 text-xs font-bold uppercase tracking-widest mb-2 px-1">
                    Materiais — toque para detalhes
                  </p>
                  <div className="flex flex-col gap-1">
                    {Object.entries(progress.materials).map(([key, qty]) => (
                      <MaterialCard key={key} matKey={key} qty={qty} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Seção Capturas */}
          {section === 'captures' && (
            hasCaptures ? (
              <div className="bg-white/10 rounded-2xl px-3 py-3">
                <p className="text-indigo-300 text-xs font-bold uppercase tracking-widest mb-2 px-1">
                  Pokémon capturados — toque para detalhes
                </p>
                <div className="flex flex-col gap-1">
                  {progress.captures.map((cap, i) => (
                    <CaptureCard key={i} capture={cap} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 gap-2">
                <span className="text-4xl">🔴</span>
                <p className="text-indigo-300 text-sm font-bold">Nenhuma captura</p>
                <p className="text-indigo-500 text-xs text-center px-4">
                  Ative a Auto-Captura e configure o modo para capturar Pokémon enquanto está offline.
                </p>
              </div>
            )
          )}
        </div>

        {/* Botão */}
        <div className="px-4 pb-6 pt-2 flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-95"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', boxShadow: '0 4px 20px rgba(99,102,241,0.5)' }}
          >
            Continuar aventura!
          </button>
        </div>
      </div>
    </div>
  );
}
