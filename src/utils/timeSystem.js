// Sistema de Dia/Noite baseado no horário real do jogador
// Afeta: Pokémon que aparecem, cor do background, música

export const getTimeOfDay = () => {
  const hour = new Date().getHours();
  if (hour >= 5  && hour < 10) return 'morning';   // 05h-09h — Manhã
  if (hour >= 10 && hour < 17) return 'day';        // 10h-16h — Dia
  if (hour >= 17 && hour < 20) return 'evening';    // 17h-19h — Tarde
  if (hour >= 20 && hour < 24) return 'night';      // 20h-23h — Noite
  return 'night';                                    // 00h-04h — Madrugada
};

export const TIME_CONFIG = {
  morning: {
    label: 'Manhã',
    emoji: '🌅',
    skyFilter: 'brightness(1.1) saturate(1.2)',
    overlayColor: 'rgba(255,200,100,0.08)',
    rarityBonus: { Normal: 1.2, Flying: 1.3 },  // Pokémon comuns mais frequentes
    specialPokemon: [],
  },
  day: {
    label: 'Dia',
    emoji: '☀️',
    skyFilter: 'brightness(1.0) saturate(1.0)',
    overlayColor: 'transparent',
    rarityBonus: {},
    specialPokemon: [],
  },
  evening: {
    label: 'Tarde',
    emoji: '🌆',
    skyFilter: 'brightness(0.9) saturate(1.1) hue-rotate(10deg)',
    overlayColor: 'rgba(255,120,50,0.12)',
    rarityBonus: { Fire: 1.2 },
    specialPokemon: [],
  },
  night: {
    label: 'Noite',
    emoji: '🌙',
    skyFilter: 'brightness(0.65) saturate(0.8) hue-rotate(200deg)',
    overlayColor: 'rgba(0,0,80,0.25)',
    rarityBonus: { Ghost: 1.5, Poison: 1.3, Dark: 1.5, Psychic: 1.2 },
    specialPokemon: [92, 93, 94, 41, 42],  // Gastly, Haunter, Gengar, Zubat, Golbat
  },
};

// Pokémon exclusivos de noite que podem aparecer em qualquer rota com Ghost/Poison
export const NIGHT_ONLY_POKEMON = [92, 93, 94, 41, 42, 52, 88];
export const MORNING_BONUS_POKEMON = [16, 17, 18, 19, 20, 21, 22];
