// Bordas automáticas por MAESTRIA DE ESPÉCIE — desbloqueadas ao capturar a mesma
// espécie X vezes (speciesMastery[id]). Aplicadas nos cards do Time e do PC.

export const MASTERY_TIERS = {
  bronze: { min: 25,  label: 'Bronze', badge: '🥉', color: '#b45309',
            ring: '0 0 0 2px #b45309, 0 0 8px rgba(180,83,9,0.5)' },
  silver: { min: 100, label: 'Prata',  badge: '🥈', color: '#94a3b8',
            ring: '0 0 0 2px #cbd5e1, 0 0 10px rgba(148,163,184,0.65)' },
  gold:   { min: 250, label: 'Ouro',   badge: '🥇', color: '#f59e0b',
            ring: '0 0 0 2px #f59e0b, 0 0 14px rgba(245,158,11,0.75)' },
};

// Retorna a chave do tier ('gold' | 'silver' | 'bronze') ou null.
export const getSpeciesMasteryTier = (count = 0) => {
  const c = Number(count) || 0;
  if (c >= MASTERY_TIERS.gold.min) return 'gold';
  if (c >= MASTERY_TIERS.silver.min) return 'silver';
  if (c >= MASTERY_TIERS.bronze.min) return 'bronze';
  return null;
};
