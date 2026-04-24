export const VILLAIN_TEAMS = {
  rocket: {
    name: "Equipe Rocket",
    gruntName: "Recruta da Equipe Rocket",
    sprite: "https://play.pokemonshowdown.com/sprites/trainers/teamrocket.png",
    pokemonPool: [19, 23, 24, 41, 42, 52, 109, 110], // Rattata, Ekans, Arbok, Zubat, Golbat, Meowth, Koffing, Weezing
    color: "#333333",
    reasons: ["está roubando Pokémons!", "bloqueia seu caminho!", "quer seu dinheiro!"],
    rewardMult: 1.5
  },
  aqua: {
    name: "Equipe Aqua",
    gruntName: "Recruta da Equipe Aqua",
    sprite: "https://play.pokemonshowdown.com/sprites/trainers/teamaquagruntm.png",
    pokemonPool: [7, 8, 9, 41, 42, 52], // Squirtle family as placeholders for water theme
    color: "#2563eb",
    reasons: ["quer expandir os oceanos!", "acha que você é da Magma!", "está protegendo a água!"],
    rewardMult: 1.6,
    biome: "water"
  },
  magma: {
    name: "Equipe Magma",
    gruntName: "Recruta da Equipe Magma",
    sprite: "https://play.pokemonshowdown.com/sprites/trainers/teammagmagruntm.png",
    pokemonPool: [4, 5, 6, 74, 75, 76, 56, 57], // Charmander, Geodude, Mankey families
    color: "#dc2626",
    reasons: ["quer expandir a terra!", "está minerando aqui!", "acha que você é da Aqua!"],
    rewardMult: 1.6,
    biome: "mountain"
  },
  galactic: {
    name: "Equipe Galáctica",
    gruntName: "Recruta da Equipe Galáctica",
    sprite: "https://play.pokemonshowdown.com/sprites/trainers/teamgalacticgruntm.png",
    pokemonPool: [41, 42, 19, 20, 23, 109],
    color: "#6b7280",
    reasons: ["está pesquisando o espaço!", "quer criar um novo mundo!", "está coletando energia!"],
    rewardMult: 1.8
  }
};
