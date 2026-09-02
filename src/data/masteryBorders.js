// Bordas automáticas por MAESTRIA DE ESPÉCIE — desbloqueadas ao capturar a mesma
// espécie X vezes (speciesMastery[id]). Aplicadas nos cards do Time e do PC.

export const MASTERY_TIERS = {
  // ring = moldura de medalhão: núcleo colorido (3px) + halo claro (2px) + brilho externo.
  bronze: { min: 25,  label: 'Bronze', badge: '🥉', color: '#b45309',
            ring: '0 0 0 3px #b45309, 0 0 0 5px #fcd9b6, 0 0 16px 2px rgba(180,83,9,0.60)' },
  silver: { min: 100, label: 'Prata',  badge: '🥈', color: '#94a3b8',
            ring: '0 0 0 3px #94a3b8, 0 0 0 5px #f1f5f9, 0 0 18px 3px rgba(148,163,184,0.72)' },
  gold:   { min: 250, label: 'Ouro',   badge: '🥇', color: '#f59e0b',
            ring: '0 0 0 3px #f59e0b, 0 0 0 5px #fef08a, 0 0 22px 4px rgba(245,158,11,0.85)' },
};

// Retorna a chave do tier ('gold' | 'silver' | 'bronze') ou null.
export const getSpeciesMasteryTier = (count = 0) => {
  const c = Number(count) || 0;
  if (c >= MASTERY_TIERS.gold.min) return 'gold';
  if (c >= MASTERY_TIERS.silver.min) return 'silver';
  if (c >= MASTERY_TIERS.bronze.min) return 'bronze';
  return null;
};
