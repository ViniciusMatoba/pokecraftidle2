// ── Cadeia de Captura (Catch Combo) ─────────────────────────────────────────
// Capturas consecutivas na MESMA rota constroem uma cadeia que escala shiny rate,
// drops e candy. Trocar de rota zera a cadeia. Marcos concedem baús.

export const CHAIN_MILESTONES = [
  { at: 10,  reward: { currency: 5000,   items: { great_ball: 5 } } },
  { at: 25,  reward: { currency: 15000,  items: { ultra_ball: 5 },  materials: { stardust: 3 } } },
  { at: 50,  reward: { currency: 40000,  items: { ultra_ball: 10, rare_candy: 1 }, materials: { stardust: 8 } } },
  { at: 100, reward: { currency: 120000, items: { rare_candy: 3 }, materials: { stardust: 20 } } },
  { at: 200, reward: { currency: 400000, items: { rare_candy: 8 }, materials: { stardust: 50, mega_stone_shard: 1 } } },
];

// Multiplicador de chance de shiny pela cadeia (×1 → ×6). Ex.: 40→×2, 100→×3,5, 200→×6.
export const getChainShinyMult = (count = 0) => Math.max(1, Math.min(6, 1 + (count || 0) / 40));

// Bônus fracionário de drops/candy/coins (0 → +100% na cadeia 100).
export const getChainDropBonus = (count = 0) => Math.min(1, (count || 0) * 0.01);

// Marcos cruzados ao subir de `from` para `to`.
export const milestonesCrossed = (from = 0, to = 0) =>
  CHAIN_MILESTONES.filter(m => m.at > from && m.at <= to);

// Tier visual (para cor/rótulo do indicador).
export const getChainTier = (count = 0) => {
  if (count >= 200) return { label: 'LENDÁRIA', color: '#f43f5e' };
  if (count >= 100) return { label: 'ÉPICA',    color: '#a855f7' };
  if (count >= 50)  return { label: 'ALTA',     color: '#f59e0b' };
  if (count >= 25)  return { label: 'BOA',      color: '#3b82f6' };
  if (count >= 10)  return { label: 'AQUECENDO',color: '#22c55e' };
  return { label: '', color: '#94a3b8' };
};

// Aplica N capturas na rota `routeId`. Retorna { chain, rewards } — o novo estado
// da cadeia e a lista de recompensas de marcos cruzados nesta atualização.
export const applyCaptureToChain = (chain = {}, routeId, gained = 1) => {
  const sameRoute = chain.routeId === routeId;
  const from = sameRoute ? (chain.count || 0) : 0;
  const to = from + Math.max(1, gained);
  const rewards = milestonesCrossed(from, to).map(m => m.reward);
  return {
    chain: {
      routeId,
      count: to,
      best: Math.max(chain.best || 0, to),
    },
    rewards,
  };
};
