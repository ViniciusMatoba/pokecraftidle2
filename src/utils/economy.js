export const TRAINER_CURRENCY_MULTIPLIER = 0.03;

export const getTrainerCurrencyReward = (baseReward = 0) =>
  Math.max(0, Math.floor(Number(baseReward || 0) * TRAINER_CURRENCY_MULTIPLIER));
