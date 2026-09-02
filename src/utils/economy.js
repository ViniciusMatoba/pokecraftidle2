export const TRAINER_CURRENCY_MULTIPLIER = 0.20;

// Piso: cada treinador derrotado paga pelo menos o preço de 1 Poké Bola.
export const MIN_TRAINER_REWARD = 400;

export const getTrainerCurrencyReward = (baseReward = 0) => {
  const base = Number(baseReward || 0);
  // Sem treinador (batalha selvagem passa 0 aqui) → não aplica o piso.
  if (base <= 0) return 0;
  return Math.max(MIN_TRAINER_REWARD, Math.floor(base * TRAINER_CURRENCY_MULTIPLIER));
};
