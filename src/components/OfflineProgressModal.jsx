import { formatOfflineTime } from '../utils/offlineProgress';

const MATERIAL_LABELS = {
  normal_essence: 'Essência Normal', fire_essence: 'Essência Fogo',
  water_essence: 'Essência Água', grass_essence: 'Essência Planta',
  electric_essence: 'Essência Elétrica', ice_essence: 'Essência Gelo',
  fighting_essence: 'Essência Luta', poison_essence: 'Essência Veneno',
  ground_essence: 'Essência Terra', flying_essence: 'Essência Voador',
  psychic_essence: 'Essência Psíquico', bug_essence: 'Essência Inseto',
  rock_essence: 'Essência Pedra', ghost_essence: 'Essência Fantasma',
  dragon_essence: 'Essência Dragão', steel_essence: 'Essência Aço',
  fairy_essence: 'Essência Fada', dark_essence: 'Essência Sombrio',
  mystic_dust: 'Pó Místico', iron_ore: 'Minério de Ferro',
  armor_fragment: 'Fragmento de Armadura', stardust: 'Pó Estelar',
  sharp_claw: 'Garra Afiada', scale_dust: 'Pó de Escama',
  ember_shard: 'Estilhaço de Brasa', thunder_fang: 'Presa Trovão',
  ice_crystal: 'Cristal de Gelo', poison_barb: 'Farpa Venenosa',
  hard_shell: 'Casca Dura', spirit_dust: 'Pó Espiritual',
  dragon_fang: 'Presa Dracônica', aura_fragment: 'Fragmento de Aura',
  leaf_debris: 'Folha Dispersa', wave_stone: 'Pedra Onda',
  moon_stone_shard: 'Estilhaço Pedra Lua', fire_stone_shard: 'Estilhaço Pedra Fogo',
  thunder_stone_shard: 'Estilhaço Pedra Trovão', leaf_stone_shard: 'Estilhaço Pedra Folha',
  sun_stone_shard: 'Estilhaço Pedra Sol', water_stone_shard: 'Estilhaço Pedra Água',
};

export default function OfflineProgressModal({ progress, onClose }) {
  if (!progress) return null;

  const hasMaterials = Object.keys(progress.materials).length > 0;
  const timeStr = formatOfflineTime(progress.cappedMs);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
    >
      <div
        className="relative w-full max-w-sm mx-4 rounded-3xl overflow-hidden shadow-2xl"
        style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)', border: '2px solid rgba(129,140,248,0.4)' }}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 text-center">
          <div className="text-4xl mb-2">🌙</div>
          <h2 className="text-white font-black text-xl tracking-wide">Bem-vindo de volta!</h2>
          <p className="text-indigo-300 text-sm mt-1">
            Você ficou fora por <span className="text-white font-bold">{timeStr}</span>
          </p>
          <p className="text-indigo-400 text-xs mt-1">
            Seu time farmou durante sua ausência — <span className="text-indigo-200">{progress.battles.toLocaleString()} batalhas</span>
          </p>
        </div>

        {/* Recompensas */}
        <div className="px-6 pb-4 flex flex-col gap-3">
          {/* XP */}
          <div className="flex items-center justify-between bg-white/10 rounded-2xl px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">⭐</span>
              <span className="text-white font-bold text-sm">Experiência</span>
            </div>
            <span className="text-yellow-300 font-black">+{progress.xp.toLocaleString()} XP</span>
          </div>

          {/* Moedas */}
          <div className="flex items-center justify-between bg-white/10 rounded-2xl px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">🪙</span>
              <span className="text-white font-bold text-sm">Moedas</span>
            </div>
            <span className="text-yellow-300 font-black">+{progress.coins.toLocaleString()}</span>
          </div>

          {/* Materiais */}
          {hasMaterials && (
            <div className="bg-white/10 rounded-2xl px-4 py-3">
              <p className="text-indigo-300 text-xs font-bold uppercase tracking-widest mb-2">Materiais coletados</p>
              <div className="flex flex-col gap-1">
                {Object.entries(progress.materials).map(([key, qty]) => (
                  <div key={key} className="flex justify-between items-center">
                    <span className="text-white text-xs">{MATERIAL_LABELS[key] || key}</span>
                    <span className="text-indigo-200 font-bold text-xs">+{qty}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Botão */}
        <div className="px-6 pb-6">
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
