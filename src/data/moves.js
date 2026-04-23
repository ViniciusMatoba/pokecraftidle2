export const MOVES = {
  "pound": {
    "id": 1,
    "name": "Pound",
    "type": "Normal",
    "category": "Physical",
    "power": 40,
    "accuracy": 100,
    "pp": 35,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "karate-chop": {
    "id": 2,
    "name": "Karate Chop",
    "type": "Fighting",
    "category": "Physical",
    "power": 50,
    "accuracy": 100,
    "pp": 25,
    "priority": 0,
    "effect": "Has an increased chance for a critical hit."
  },
  "double-slap": {
    "id": 3,
    "name": "Double Slap",
    "type": "Normal",
    "category": "Physical",
    "power": 15,
    "accuracy": 85,
    "pp": 10,
    "priority": 0,
    "effect": "Hits 2-5 times in one turn."
  },
  "comet-punch": {
    "id": 4,
    "name": "Comet Punch",
    "type": "Normal",
    "category": "Physical",
    "power": 18,
    "accuracy": 85,
    "pp": 15,
    "priority": 0,
    "effect": "Hits 2-5 times in one turn."
  },
  "mega-punch": {
    "id": 5,
    "name": "Mega Punch",
    "type": "Normal",
    "category": "Physical",
    "power": 80,
    "accuracy": 85,
    "pp": 20,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "pay-day": {
    "id": 6,
    "name": "Pay Day",
    "type": "Normal",
    "category": "Physical",
    "power": 40,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Scatters money on the ground worth five times the user’s level."
  },
  "fire-punch": {
    "id": 7,
    "name": "Fire Punch",
    "type": "Fire",
    "category": "Physical",
    "power": 75,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to burn the target."
  },
  "ice-punch": {
    "id": 8,
    "name": "Ice Punch",
    "type": "Ice",
    "category": "Physical",
    "power": 75,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to freeze the target."
  },
  "thunder-punch": {
    "id": 9,
    "name": "Thunder Punch",
    "type": "Electric",
    "category": "Physical",
    "power": 75,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to paralyze the target."
  },
  "scratch": {
    "id": 10,
    "name": "Scratch",
    "type": "Normal",
    "category": "Physical",
    "power": 40,
    "accuracy": 100,
    "pp": 35,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "vice-grip": {
    "id": 11,
    "name": "Vise Grip",
    "type": "Normal",
    "category": "Physical",
    "power": 55,
    "accuracy": 100,
    "pp": 30,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "guillotine": {
    "id": 12,
    "name": "Guillotine",
    "type": "Normal",
    "category": "Physical",
    "power": 0,
    "accuracy": 30,
    "pp": 5,
    "priority": 0,
    "effect": "Causes a one-hit KO."
  },
  "razor-wind": {
    "id": 13,
    "name": "Razor Wind",
    "type": "Normal",
    "category": "Special",
    "power": 80,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Requires a turn to charge before attacking."
  },
  "swords-dance": {
    "id": 14,
    "name": "Swords Dance",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Raises the user’s Attack by two stages.",
    "statChanges": [
      {
        "stat": "attack",
        "change": 2
      }
    ],
    "target": "user"
  },
  "cut": {
    "id": 15,
    "name": "Cut",
    "type": "Normal",
    "category": "Physical",
    "power": 50,
    "accuracy": 95,
    "pp": 30,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "gust": {
    "id": 16,
    "name": "Gust",
    "type": "Flying",
    "category": "Special",
    "power": 40,
    "accuracy": 100,
    "pp": 35,
    "priority": 0,
    "effect": "Inflicts regular damage and can hit Pokémon in the air."
  },
  "wing-attack": {
    "id": 17,
    "name": "Wing Attack",
    "type": "Flying",
    "category": "Physical",
    "power": 60,
    "accuracy": 100,
    "pp": 35,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "whirlwind": {
    "id": 18,
    "name": "Whirlwind",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": -6,
    "effect": "Immediately ends wild battles.  Forces trainers to switch Pokémon.",
    "statChanges": []
  },
  "fly": {
    "id": 19,
    "name": "Fly",
    "type": "Flying",
    "category": "Physical",
    "power": 90,
    "accuracy": 95,
    "pp": 15,
    "priority": 0,
    "effect": "User flies high into the air, dodging all attacks, and hits next turn."
  },
  "bind": {
    "id": 20,
    "name": "Bind",
    "type": "Normal",
    "category": "Physical",
    "power": 15,
    "accuracy": 85,
    "pp": 20,
    "priority": 0,
    "effect": "Prevents the target from fleeing and inflicts damage for 2-5 turns."
  },
  "slam": {
    "id": 21,
    "name": "Slam",
    "type": "Normal",
    "category": "Physical",
    "power": 80,
    "accuracy": 75,
    "pp": 20,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "vine-whip": {
    "id": 22,
    "name": "Vine Whip",
    "type": "Grass",
    "category": "Physical",
    "power": 45,
    "accuracy": 100,
    "pp": 25,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "stomp": {
    "id": 23,
    "name": "Stomp",
    "type": "Normal",
    "category": "Physical",
    "power": 65,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to make the target flinch."
  },
  "double-kick": {
    "id": 24,
    "name": "Double Kick",
    "type": "Fighting",
    "category": "Physical",
    "power": 30,
    "accuracy": 100,
    "pp": 30,
    "priority": 0,
    "effect": "Hits twice in one turn."
  },
  "mega-kick": {
    "id": 25,
    "name": "Mega Kick",
    "type": "Normal",
    "category": "Physical",
    "power": 120,
    "accuracy": 75,
    "pp": 5,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "jump-kick": {
    "id": 26,
    "name": "Jump Kick",
    "type": "Fighting",
    "category": "Physical",
    "power": 100,
    "accuracy": 95,
    "pp": 10,
    "priority": 0,
    "effect": "If the user misses, it takes half the damage it would have inflicted in recoil."
  },
  "rolling-kick": {
    "id": 27,
    "name": "Rolling Kick",
    "type": "Fighting",
    "category": "Physical",
    "power": 60,
    "accuracy": 85,
    "pp": 15,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to make the target flinch."
  },
  "sand-attack": {
    "id": 28,
    "name": "Sand Attack",
    "type": "Ground",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "Lowers the target’s accuracy by one stage.",
    "statChanges": [
      {
        "stat": "accuracy",
        "change": -1
      }
    ],
    "target": "user"
  },
  "headbutt": {
    "id": 29,
    "name": "Headbutt",
    "type": "Normal",
    "category": "Physical",
    "power": 70,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to make the target flinch."
  },
  "horn-attack": {
    "id": 30,
    "name": "Horn Attack",
    "type": "Normal",
    "category": "Physical",
    "power": 65,
    "accuracy": 100,
    "pp": 25,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "fury-attack": {
    "id": 31,
    "name": "Fury Attack",
    "type": "Normal",
    "category": "Physical",
    "power": 15,
    "accuracy": 85,
    "pp": 20,
    "priority": 0,
    "effect": "Hits 2-5 times in one turn."
  },
  "horn-drill": {
    "id": 32,
    "name": "Horn Drill",
    "type": "Normal",
    "category": "Physical",
    "power": 0,
    "accuracy": 30,
    "pp": 5,
    "priority": 0,
    "effect": "Causes a one-hit KO."
  },
  "tackle": {
    "id": 33,
    "name": "Tackle",
    "type": "Normal",
    "category": "Physical",
    "power": 40,
    "accuracy": 100,
    "pp": 35,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "body-slam": {
    "id": 34,
    "name": "Body Slam",
    "type": "Normal",
    "category": "Physical",
    "power": 85,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to paralyze the target."
  },
  "wrap": {
    "id": 35,
    "name": "Wrap",
    "type": "Normal",
    "category": "Physical",
    "power": 15,
    "accuracy": 90,
    "pp": 20,
    "priority": 0,
    "effect": "Prevents the target from fleeing and inflicts damage for 2-5 turns."
  },
  "take-down": {
    "id": 36,
    "name": "Take Down",
    "type": "Normal",
    "category": "Physical",
    "power": 90,
    "accuracy": 85,
    "pp": 20,
    "priority": 0,
    "effect": "User receives 1/4 the damage it inflicts in recoil."
  },
  "thrash": {
    "id": 37,
    "name": "Thrash",
    "type": "Normal",
    "category": "Physical",
    "power": 120,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Hits every turn for 2-3 turns, then confuses the user."
  },
  "double-edge": {
    "id": 38,
    "name": "Double-Edge",
    "type": "Normal",
    "category": "Physical",
    "power": 120,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "User receives 1/3 the damage inflicted in recoil."
  },
  "tail-whip": {
    "id": 39,
    "name": "Tail Whip",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 30,
    "priority": 0,
    "effect": "Lowers the target’s Defense by one stage.",
    "statChanges": [
      {
        "stat": "defense",
        "change": -1
      }
    ],
    "target": "user"
  },
  "poison-sting": {
    "id": 40,
    "name": "Poison Sting",
    "type": "Poison",
    "category": "Physical",
    "power": 15,
    "accuracy": 100,
    "pp": 35,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to poison the target."
  },
  "twineedle": {
    "id": 41,
    "name": "Twineedle",
    "type": "Bug",
    "category": "Physical",
    "power": 25,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Hits twice in the same turn.  Has a $effect_chance% chance to poison the target."
  },
  "pin-missile": {
    "id": 42,
    "name": "Pin Missile",
    "type": "Bug",
    "category": "Physical",
    "power": 25,
    "accuracy": 95,
    "pp": 20,
    "priority": 0,
    "effect": "Hits 2-5 times in one turn."
  },
  "leer": {
    "id": 43,
    "name": "Leer",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 30,
    "priority": 0,
    "effect": "Lowers the target’s Defense by one stage.",
    "statChanges": [
      {
        "stat": "defense",
        "change": -1
      }
    ],
    "target": "user"
  },
  "bite": {
    "id": 44,
    "name": "Bite",
    "type": "Dark",
    "category": "Physical",
    "power": 60,
    "accuracy": 100,
    "pp": 25,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to make the target flinch."
  },
  "growl": {
    "id": 45,
    "name": "Growl",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 40,
    "priority": 0,
    "effect": "Lowers the target’s Attack by one stage.",
    "statChanges": [
      {
        "stat": "attack",
        "change": -1
      }
    ],
    "target": "user"
  },
  "roar": {
    "id": 46,
    "name": "Roar",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": -6,
    "effect": "Immediately ends wild battles.  Forces trainers to switch Pokémon.",
    "statChanges": []
  },
  "sing": {
    "id": 47,
    "name": "Sing",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 55,
    "pp": 15,
    "priority": 0,
    "effect": "Puts the target to sleep.",
    "statChanges": [],
    "target": "enemy"
  },
  "supersonic": {
    "id": 48,
    "name": "Supersonic",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 55,
    "pp": 20,
    "priority": 0,
    "effect": "Confuses the target.",
    "statChanges": [],
    "target": "enemy"
  },
  "sonic-boom": {
    "id": 49,
    "name": "Sonic Boom",
    "type": "Normal",
    "category": "Special",
    "power": 0,
    "accuracy": 90,
    "pp": 20,
    "priority": 0,
    "effect": "Inflicts 20 points of damage."
  },
  "disable": {
    "id": 50,
    "name": "Disable",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Disables the target’s last used move for 1-8 turns.",
    "statChanges": [],
    "target": "enemy"
  },
  "acid": {
    "id": 51,
    "name": "Acid",
    "type": "Poison",
    "category": "Special",
    "power": 40,
    "accuracy": 100,
    "pp": 30,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to lower the target’s Special Defense by one stage."
  },
  "ember": {
    "id": 52,
    "name": "Ember",
    "type": "Fire",
    "category": "Special",
    "power": 40,
    "accuracy": 100,
    "pp": 25,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to burn the target."
  },
  "flamethrower": {
    "id": 53,
    "name": "Flamethrower",
    "type": "Fire",
    "category": "Special",
    "power": 90,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to burn the target."
  },
  "mist": {
    "id": 54,
    "name": "Mist",
    "type": "Ice",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 30,
    "priority": 0,
    "effect": "Protects the user’s stats from being changed by enemy moves.",
    "statChanges": []
  },
  "water-gun": {
    "id": 55,
    "name": "Water Gun",
    "type": "Water",
    "category": "Special",
    "power": 40,
    "accuracy": 100,
    "pp": 25,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "hydro-pump": {
    "id": 56,
    "name": "Hydro Pump",
    "type": "Water",
    "category": "Special",
    "power": 110,
    "accuracy": 80,
    "pp": 5,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "surf": {
    "id": 57,
    "name": "Surf",
    "type": "Water",
    "category": "Special",
    "power": 90,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "Inflicts regular damage and can hit Dive users."
  },
  "ice-beam": {
    "id": 58,
    "name": "Ice Beam",
    "type": "Ice",
    "category": "Special",
    "power": 90,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to freeze the target."
  },
  "blizzard": {
    "id": 59,
    "name": "Blizzard",
    "type": "Ice",
    "category": "Special",
    "power": 110,
    "accuracy": 70,
    "pp": 5,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to freeze the target."
  },
  "psybeam": {
    "id": 60,
    "name": "Psybeam",
    "type": "Psychic",
    "category": "Special",
    "power": 65,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to confuse the target."
  },
  "bubble-beam": {
    "id": 61,
    "name": "Bubble Beam",
    "type": "Water",
    "category": "Special",
    "power": 65,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to lower the target’s Speed by one stage."
  },
  "aurora-beam": {
    "id": 62,
    "name": "Aurora Beam",
    "type": "Ice",
    "category": "Special",
    "power": 65,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to lower the target’s Attack by one stage."
  },
  "hyper-beam": {
    "id": 63,
    "name": "Hyper Beam",
    "type": "Normal",
    "category": "Special",
    "power": 150,
    "accuracy": 90,
    "pp": 5,
    "priority": 0,
    "effect": "User foregoes its next turn to recharge."
  },
  "peck": {
    "id": 64,
    "name": "Peck",
    "type": "Flying",
    "category": "Physical",
    "power": 35,
    "accuracy": 100,
    "pp": 35,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "drill-peck": {
    "id": 65,
    "name": "Drill Peck",
    "type": "Flying",
    "category": "Physical",
    "power": 80,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "submission": {
    "id": 66,
    "name": "Submission",
    "type": "Fighting",
    "category": "Physical",
    "power": 80,
    "accuracy": 80,
    "pp": 20,
    "priority": 0,
    "effect": "User receives 1/4 the damage it inflicts in recoil."
  },
  "low-kick": {
    "id": 67,
    "name": "Low Kick",
    "type": "Fighting",
    "category": "Physical",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Inflicts more damage to heavier targets, with a maximum of 120 power."
  },
  "counter": {
    "id": 68,
    "name": "Counter",
    "type": "Fighting",
    "category": "Physical",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": -5,
    "effect": "Inflicts twice the damage the user received from the last physical hit it took."
  },
  "seismic-toss": {
    "id": 69,
    "name": "Seismic Toss",
    "type": "Fighting",
    "category": "Physical",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Inflicts damage equal to the user’s level."
  },
  "strength": {
    "id": 70,
    "name": "Strength",
    "type": "Normal",
    "category": "Physical",
    "power": 80,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "absorb": {
    "id": 71,
    "name": "Absorb",
    "type": "Grass",
    "category": "Special",
    "power": 20,
    "accuracy": 100,
    "pp": 25,
    "priority": 0,
    "effect": "Drains half the damage inflicted to heal the user."
  },
  "mega-drain": {
    "id": 72,
    "name": "Mega Drain",
    "type": "Grass",
    "category": "Special",
    "power": 40,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "Drains half the damage inflicted to heal the user."
  },
  "leech-seed": {
    "id": 73,
    "name": "Leech Seed",
    "type": "Grass",
    "category": "Status",
    "power": 0,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "effect": "Seeds the target, stealing HP from it every turn.",
    "statChanges": [],
    "target": "enemy"
  },
  "growth": {
    "id": 74,
    "name": "Growth",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Raises the user’s Attack and Special Attack by one stage.",
    "statChanges": [
      {
        "stat": "attack",
        "change": 1
      },
      {
        "stat": "spAtk",
        "change": 1
      }
    ],
    "target": "user"
  },
  "razor-leaf": {
    "id": 75,
    "name": "Razor Leaf",
    "type": "Grass",
    "category": "Physical",
    "power": 55,
    "accuracy": 95,
    "pp": 25,
    "priority": 0,
    "effect": "Has an increased chance for a critical hit."
  },
  "solar-beam": {
    "id": 76,
    "name": "Solar Beam",
    "type": "Grass",
    "category": "Special",
    "power": 120,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Requires a turn to charge before attacking."
  },
  "poison-powder": {
    "id": 77,
    "name": "Poison Powder",
    "type": "Poison",
    "category": "Status",
    "power": 0,
    "accuracy": 75,
    "pp": 35,
    "priority": 0,
    "effect": "Poisons the target.",
    "statChanges": [],
    "target": "enemy"
  },
  "stun-spore": {
    "id": 78,
    "name": "Stun Spore",
    "type": "Grass",
    "category": "Status",
    "power": 0,
    "accuracy": 75,
    "pp": 30,
    "priority": 0,
    "effect": "Paralyzes the target.",
    "statChanges": [],
    "target": "enemy"
  },
  "sleep-powder": {
    "id": 79,
    "name": "Sleep Powder",
    "type": "Grass",
    "category": "Status",
    "power": 0,
    "accuracy": 75,
    "pp": 15,
    "priority": 0,
    "effect": "Puts the target to sleep.",
    "statChanges": [],
    "target": "enemy"
  },
  "petal-dance": {
    "id": 80,
    "name": "Petal Dance",
    "type": "Grass",
    "category": "Special",
    "power": 120,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Hits every turn for 2-3 turns, then confuses the user."
  },
  "string-shot": {
    "id": 81,
    "name": "String Shot",
    "type": "Bug",
    "category": "Status",
    "power": 0,
    "accuracy": 95,
    "pp": 40,
    "priority": 0,
    "effect": "Lowers the target’s Speed by two stages.",
    "statChanges": [
      {
        "stat": "speed",
        "change": -2
      }
    ],
    "target": "user"
  },
  "dragon-rage": {
    "id": 82,
    "name": "Dragon Rage",
    "type": "Dragon",
    "category": "Special",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Inflicts 40 points of damage."
  },
  "fire-spin": {
    "id": 83,
    "name": "Fire Spin",
    "type": "Fire",
    "category": "Special",
    "power": 35,
    "accuracy": 85,
    "pp": 15,
    "priority": 0,
    "effect": "Prevents the target from fleeing and inflicts damage for 2-5 turns."
  },
  "thunder-shock": {
    "id": 84,
    "name": "Thunder Shock",
    "type": "Electric",
    "category": "Special",
    "power": 40,
    "accuracy": 100,
    "pp": 30,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to paralyze the target."
  },
  "thunderbolt": {
    "id": 85,
    "name": "Thunderbolt",
    "type": "Electric",
    "category": "Special",
    "power": 90,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to paralyze the target."
  },
  "thunder-wave": {
    "id": 86,
    "name": "Thunder Wave",
    "type": "Electric",
    "category": "Status",
    "power": 0,
    "accuracy": 90,
    "pp": 20,
    "priority": 0,
    "effect": "Paralyzes the target.",
    "statChanges": [],
    "target": "enemy"
  },
  "thunder": {
    "id": 87,
    "name": "Thunder",
    "type": "Electric",
    "category": "Special",
    "power": 110,
    "accuracy": 70,
    "pp": 10,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to paralyze the target."
  },
  "rock-throw": {
    "id": 88,
    "name": "Rock Throw",
    "type": "Rock",
    "category": "Physical",
    "power": 50,
    "accuracy": 90,
    "pp": 15,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "earthquake": {
    "id": 89,
    "name": "Earthquake",
    "type": "Ground",
    "category": "Physical",
    "power": 100,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Inflicts regular damage and can hit Dig users."
  },
  "fissure": {
    "id": 90,
    "name": "Fissure",
    "type": "Ground",
    "category": "Physical",
    "power": 0,
    "accuracy": 30,
    "pp": 5,
    "priority": 0,
    "effect": "Causes a one-hit KO."
  },
  "dig": {
    "id": 91,
    "name": "Dig",
    "type": "Ground",
    "category": "Physical",
    "power": 80,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "User digs underground, dodging all attacks, and hits next turn."
  },
  "toxic": {
    "id": 92,
    "name": "Toxic",
    "type": "Poison",
    "category": "Status",
    "power": 0,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "effect": "Badly poisons the target, inflicting more damage every turn.",
    "statChanges": [],
    "target": "enemy"
  },
  "confusion": {
    "id": 93,
    "name": "Confusion",
    "type": "Psychic",
    "category": "Special",
    "power": 50,
    "accuracy": 100,
    "pp": 25,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to confuse the target."
  },
  "psychic": {
    "id": 94,
    "name": "Psychic",
    "type": "Psychic",
    "category": "Special",
    "power": 90,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to lower the target’s Special Defense by one stage."
  },
  "hypnosis": {
    "id": 95,
    "name": "Hypnosis",
    "type": "Psychic",
    "category": "Status",
    "power": 0,
    "accuracy": 60,
    "pp": 20,
    "priority": 0,
    "effect": "Puts the target to sleep.",
    "statChanges": [],
    "target": "enemy"
  },
  "meditate": {
    "id": 96,
    "name": "Meditate",
    "type": "Psychic",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 40,
    "priority": 0,
    "effect": "Raises the user’s Attack by one stage.",
    "statChanges": [
      {
        "stat": "attack",
        "change": 1
      }
    ],
    "target": "user"
  },
  "agility": {
    "id": 97,
    "name": "Agility",
    "type": "Psychic",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 30,
    "priority": 0,
    "effect": "Raises the user’s Speed by two stages.",
    "statChanges": [
      {
        "stat": "speed",
        "change": 2
      }
    ],
    "target": "user"
  },
  "quick-attack": {
    "id": 98,
    "name": "Quick Attack",
    "type": "Normal",
    "category": "Physical",
    "power": 40,
    "accuracy": 100,
    "pp": 30,
    "priority": 1,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "rage": {
    "id": 99,
    "name": "Rage",
    "type": "Normal",
    "category": "Physical",
    "power": 20,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "If the user is hit after using this move, its Attack rises by one stage."
  },
  "teleport": {
    "id": 100,
    "name": "Teleport",
    "type": "Psychic",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": -6,
    "effect": "Immediately ends wild battles.  No effect otherwise.",
    "statChanges": []
  },
  "night-shade": {
    "id": 101,
    "name": "Night Shade",
    "type": "Ghost",
    "category": "Special",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "Inflicts damage equal to the user’s level."
  },
  "mimic": {
    "id": 102,
    "name": "Mimic",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Copies the target’s last used move.",
    "statChanges": []
  },
  "screech": {
    "id": 103,
    "name": "Screech",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 85,
    "pp": 40,
    "priority": 0,
    "effect": "Lowers the target’s Defense by two stages.",
    "statChanges": [
      {
        "stat": "defense",
        "change": -2
      }
    ],
    "target": "user"
  },
  "double-team": {
    "id": 104,
    "name": "Double Team",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "Raises the user’s evasion by one stage.",
    "statChanges": [
      {
        "stat": "evasion",
        "change": 1
      }
    ],
    "target": "user"
  },
  "recover": {
    "id": 105,
    "name": "Recover",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": "Heals the user by half its max HP.",
    "statChanges": [],
    "target": "user"
  },
  "harden": {
    "id": 106,
    "name": "Harden",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 30,
    "priority": 0,
    "effect": "Raises the user’s Defense by one stage.",
    "statChanges": [
      {
        "stat": "defense",
        "change": 1
      }
    ],
    "target": "user"
  },
  "minimize": {
    "id": 107,
    "name": "Minimize",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Raises the user’s evasion by two stages.",
    "statChanges": [
      {
        "stat": "evasion",
        "change": 2
      }
    ],
    "target": "user"
  },
  "smokescreen": {
    "id": 108,
    "name": "Smokescreen",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Lowers the target’s accuracy by one stage.",
    "statChanges": [
      {
        "stat": "accuracy",
        "change": -1
      }
    ],
    "target": "user"
  },
  "confuse-ray": {
    "id": 109,
    "name": "Confuse Ray",
    "type": "Ghost",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Confuses the target.",
    "statChanges": [],
    "target": "enemy"
  },
  "withdraw": {
    "id": 110,
    "name": "Withdraw",
    "type": "Water",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 40,
    "priority": 0,
    "effect": "Raises the user’s Defense by one stage.",
    "statChanges": [
      {
        "stat": "defense",
        "change": 1
      }
    ],
    "target": "user"
  },
  "defense-curl": {
    "id": 111,
    "name": "Defense Curl",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 40,
    "priority": 0,
    "effect": "Raises user’s Defense by one stage.",
    "statChanges": [
      {
        "stat": "defense",
        "change": 1
      }
    ],
    "target": "user"
  },
  "barrier": {
    "id": 112,
    "name": "Barrier",
    "type": "Psychic",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Raises the user’s Defense by two stages.",
    "statChanges": [
      {
        "stat": "defense",
        "change": 2
      }
    ],
    "target": "user"
  },
  "light-screen": {
    "id": 113,
    "name": "Light Screen",
    "type": "Psychic",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 30,
    "priority": 0,
    "effect": "Reduces damage from special attacks by 50% for five turns.",
    "statChanges": []
  },
  "haze": {
    "id": 114,
    "name": "Haze",
    "type": "Ice",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 30,
    "priority": 0,
    "effect": "Resets all Pokémon’s stats, accuracy, and evasion.",
    "statChanges": []
  },
  "reflect": {
    "id": 115,
    "name": "Reflect",
    "type": "Psychic",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Reduces damage from physical attacks by half.",
    "statChanges": []
  },
  "focus-energy": {
    "id": 116,
    "name": "Focus Energy",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 30,
    "priority": 0,
    "effect": "Increases the user’s chance to score a critical hit.",
    "statChanges": []
  },
  "bide": {
    "id": 117,
    "name": "Bide",
    "type": "Normal",
    "category": "Physical",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 1,
    "effect": "User waits for two turns, then hits back for twice the damage it took."
  },
  "metronome": {
    "id": 118,
    "name": "Metronome",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Randomly selects and uses any move in the game.",
    "statChanges": []
  },
  "mirror-move": {
    "id": 119,
    "name": "Mirror Move",
    "type": "Flying",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Uses the target’s last used move.",
    "statChanges": []
  },
  "self-destruct": {
    "id": 120,
    "name": "Self-Destruct",
    "type": "Normal",
    "category": "Physical",
    "power": 200,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": "User faints."
  },
  "egg-bomb": {
    "id": 121,
    "name": "Egg Bomb",
    "type": "Normal",
    "category": "Physical",
    "power": 100,
    "accuracy": 75,
    "pp": 10,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "lick": {
    "id": 122,
    "name": "Lick",
    "type": "Ghost",
    "category": "Physical",
    "power": 30,
    "accuracy": 100,
    "pp": 30,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to paralyze the target."
  },
  "smog": {
    "id": 123,
    "name": "Smog",
    "type": "Poison",
    "category": "Special",
    "power": 30,
    "accuracy": 70,
    "pp": 20,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to poison the target."
  },
  "sludge": {
    "id": 124,
    "name": "Sludge",
    "type": "Poison",
    "category": "Special",
    "power": 65,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to poison the target."
  },
  "bone-club": {
    "id": 125,
    "name": "Bone Club",
    "type": "Ground",
    "category": "Physical",
    "power": 65,
    "accuracy": 85,
    "pp": 20,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to make the target flinch."
  },
  "fire-blast": {
    "id": 126,
    "name": "Fire Blast",
    "type": "Fire",
    "category": "Special",
    "power": 110,
    "accuracy": 85,
    "pp": 5,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to burn the target."
  },
  "waterfall": {
    "id": 127,
    "name": "Waterfall",
    "type": "Water",
    "category": "Physical",
    "power": 80,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to make the target flinch."
  },
  "clamp": {
    "id": 128,
    "name": "Clamp",
    "type": "Water",
    "category": "Physical",
    "power": 35,
    "accuracy": 85,
    "pp": 15,
    "priority": 0,
    "effect": "Prevents the target from fleeing and inflicts damage for 2-5 turns."
  },
  "swift": {
    "id": 129,
    "name": "Swift",
    "type": "Normal",
    "category": "Special",
    "power": 60,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Never misses."
  },
  "skull-bash": {
    "id": 130,
    "name": "Skull Bash",
    "type": "Normal",
    "category": "Physical",
    "power": 130,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Raises the user’s Defense by one stage.  User charges for one turn before attacking."
  },
  "spike-cannon": {
    "id": 131,
    "name": "Spike Cannon",
    "type": "Normal",
    "category": "Physical",
    "power": 20,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "Hits 2-5 times in one turn."
  },
  "constrict": {
    "id": 132,
    "name": "Constrict",
    "type": "Normal",
    "category": "Physical",
    "power": 10,
    "accuracy": 100,
    "pp": 35,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to lower the target’s Speed by one stage."
  },
  "amnesia": {
    "id": 133,
    "name": "Amnesia",
    "type": "Psychic",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Raises the user’s Special Defense by two stages.",
    "statChanges": [
      {
        "stat": "spDef",
        "change": 2
      }
    ],
    "target": "user"
  },
  "kinesis": {
    "id": 134,
    "name": "Kinesis",
    "type": "Psychic",
    "category": "Status",
    "power": 0,
    "accuracy": 80,
    "pp": 15,
    "priority": 0,
    "effect": "Lowers the target’s accuracy by one stage.",
    "statChanges": [
      {
        "stat": "accuracy",
        "change": -1
      }
    ],
    "target": "user"
  },
  "soft-boiled": {
    "id": 135,
    "name": "Soft-Boiled",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": "Heals the user by half its max HP.",
    "statChanges": [],
    "target": "user"
  },
  "high-jump-kick": {
    "id": 136,
    "name": "High Jump Kick",
    "type": "Fighting",
    "category": "Physical",
    "power": 130,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "effect": "If the user misses, it takes half the damage it would have inflicted in recoil."
  },
  "glare": {
    "id": 137,
    "name": "Glare",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 30,
    "priority": 0,
    "effect": "Paralyzes the target.",
    "statChanges": [],
    "target": "enemy"
  },
  "dream-eater": {
    "id": 138,
    "name": "Dream Eater",
    "type": "Psychic",
    "category": "Special",
    "power": 100,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "Only works on sleeping Pokémon.  Drains half the damage inflicted to heal the user."
  },
  "poison-gas": {
    "id": 139,
    "name": "Poison Gas",
    "type": "Poison",
    "category": "Status",
    "power": 0,
    "accuracy": 90,
    "pp": 40,
    "priority": 0,
    "effect": "Poisons the target.",
    "statChanges": [],
    "target": "enemy"
  },
  "barrage": {
    "id": 140,
    "name": "Barrage",
    "type": "Normal",
    "category": "Physical",
    "power": 15,
    "accuracy": 85,
    "pp": 20,
    "priority": 0,
    "effect": "Hits 2-5 times in one turn."
  },
  "leech-life": {
    "id": 141,
    "name": "Leech Life",
    "type": "Bug",
    "category": "Physical",
    "power": 80,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Drains half the damage inflicted to heal the user."
  },
  "lovely-kiss": {
    "id": 142,
    "name": "Lovely Kiss",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 75,
    "pp": 10,
    "priority": 0,
    "effect": "Puts the target to sleep.",
    "statChanges": [],
    "target": "enemy"
  },
  "sky-attack": {
    "id": 143,
    "name": "Sky Attack",
    "type": "Flying",
    "category": "Physical",
    "power": 140,
    "accuracy": 90,
    "pp": 5,
    "priority": 0,
    "effect": "User charges for one turn before attacking.  Has a $effect_chance% chance to make the target flinch."
  },
  "transform": {
    "id": 144,
    "name": "Transform",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "User becomes a copy of the target until it leaves battle.",
    "statChanges": []
  },
  "bubble": {
    "id": 145,
    "name": "Bubble",
    "type": "Water",
    "category": "Special",
    "power": 40,
    "accuracy": 100,
    "pp": 30,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to lower the target’s Speed by one stage."
  },
  "dizzy-punch": {
    "id": 146,
    "name": "Dizzy Punch",
    "type": "Normal",
    "category": "Physical",
    "power": 70,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to confuse the target."
  },
  "spore": {
    "id": 147,
    "name": "Spore",
    "type": "Grass",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "Puts the target to sleep.",
    "statChanges": [],
    "target": "enemy"
  },
  "flash": {
    "id": 148,
    "name": "Flash",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Lowers the target’s accuracy by one stage.",
    "statChanges": [
      {
        "stat": "accuracy",
        "change": -1
      }
    ],
    "target": "user"
  },
  "psywave": {
    "id": 149,
    "name": "Psywave",
    "type": "Psychic",
    "category": "Special",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "Inflicts damage between 50% and 150% of the user’s level."
  },
  "splash": {
    "id": 150,
    "name": "Splash",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 40,
    "priority": 0,
    "effect": "Does nothing.",
    "statChanges": []
  },
  "acid-armor": {
    "id": 151,
    "name": "Acid Armor",
    "type": "Poison",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Raises the user’s Defense by two stages.",
    "statChanges": [
      {
        "stat": "defense",
        "change": 2
      }
    ],
    "target": "user"
  },
  "crabhammer": {
    "id": 152,
    "name": "Crabhammer",
    "type": "Water",
    "category": "Physical",
    "power": 100,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "effect": "Has an increased chance for a critical hit."
  },
  "explosion": {
    "id": 153,
    "name": "Explosion",
    "type": "Normal",
    "category": "Physical",
    "power": 250,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": "User faints."
  },
  "fury-swipes": {
    "id": 154,
    "name": "Fury Swipes",
    "type": "Normal",
    "category": "Physical",
    "power": 18,
    "accuracy": 80,
    "pp": 15,
    "priority": 0,
    "effect": "Hits 2-5 times in one turn."
  },
  "bonemerang": {
    "id": 155,
    "name": "Bonemerang",
    "type": "Ground",
    "category": "Physical",
    "power": 50,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "effect": "Hits twice in one turn."
  },
  "rest": {
    "id": 156,
    "name": "Rest",
    "type": "Psychic",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": "User sleeps for two turns, completely healing itself.",
    "statChanges": []
  },
  "rock-slide": {
    "id": 157,
    "name": "Rock Slide",
    "type": "Rock",
    "category": "Physical",
    "power": 75,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to make the target flinch."
  },
  "hyper-fang": {
    "id": 158,
    "name": "Hyper Fang",
    "type": "Normal",
    "category": "Physical",
    "power": 80,
    "accuracy": 90,
    "pp": 15,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to make the target flinch."
  },
  "sharpen": {
    "id": 159,
    "name": "Sharpen",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 30,
    "priority": 0,
    "effect": "Raises the user’s Attack by one stage.",
    "statChanges": [
      {
        "stat": "attack",
        "change": 1
      }
    ],
    "target": "user"
  },
  "conversion": {
    "id": 160,
    "name": "Conversion",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 30,
    "priority": 0,
    "effect": "User’s type changes to the type of one of its moves at random.",
    "statChanges": []
  },
  "tri-attack": {
    "id": 161,
    "name": "Tri Attack",
    "type": "Normal",
    "category": "Special",
    "power": 80,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to burn, freeze, or paralyze the target."
  },
  "super-fang": {
    "id": 162,
    "name": "Super Fang",
    "type": "Normal",
    "category": "Physical",
    "power": 0,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "effect": "Inflicts damage equal to half the target’s HP."
  },
  "slash": {
    "id": 163,
    "name": "Slash",
    "type": "Normal",
    "category": "Physical",
    "power": 70,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Has an increased chance for a critical hit."
  },
  "substitute": {
    "id": 164,
    "name": "Substitute",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Transfers 1/4 of the user’s max HP into a doll, protecting the user from further damage or status changes until it breaks.",
    "statChanges": []
  },
  "struggle": {
    "id": 165,
    "name": "Struggle",
    "type": "Normal",
    "category": "Physical",
    "power": 50,
    "accuracy": 100,
    "pp": 1,
    "priority": 0,
    "effect": "User takes 1/4 its max HP in recoil."
  },
  "sketch": {
    "id": 166,
    "name": "Sketch",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 1,
    "priority": 0,
    "effect": "Permanently becomes the target’s last used move.",
    "statChanges": []
  },
  "triple-kick": {
    "id": 167,
    "name": "Triple Kick",
    "type": "Fighting",
    "category": "Physical",
    "power": 10,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "effect": "Hits three times, increasing power by 100% with each successful hit."
  },
  "thief": {
    "id": 168,
    "name": "Thief",
    "type": "Dark",
    "category": "Physical",
    "power": 60,
    "accuracy": 100,
    "pp": 25,
    "priority": 0,
    "effect": "Takes the target’s item."
  },
  "spider-web": {
    "id": 169,
    "name": "Spider Web",
    "type": "Bug",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Prevents the target from leaving battle.",
    "statChanges": []
  },
  "mind-reader": {
    "id": 170,
    "name": "Mind Reader",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": "Ensures that the user’s next move will hit the target.",
    "statChanges": []
  },
  "nightmare": {
    "id": 171,
    "name": "Nightmare",
    "type": "Ghost",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "Target loses 1/4 its max HP every turn as long as it’s asleep.",
    "statChanges": [],
    "target": "enemy"
  },
  "flame-wheel": {
    "id": 172,
    "name": "Flame Wheel",
    "type": "Fire",
    "category": "Physical",
    "power": 60,
    "accuracy": 100,
    "pp": 25,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to burn the target.  Lets frozen Pokémon thaw themselves."
  },
  "snore": {
    "id": 173,
    "name": "Snore",
    "type": "Normal",
    "category": "Special",
    "power": 50,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to make the target flinch.  Only works if the user is sleeping."
  },
  "curse": {
    "id": 174,
    "name": "Curse",
    "type": "Ghost",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Ghosts pay half their max HP to hurt the target every turn.  Others decrease Speed but raise Attack and Defense.",
    "statChanges": []
  },
  "flail": {
    "id": 175,
    "name": "Flail",
    "type": "Normal",
    "category": "Physical",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "Inflicts more damage when the user has less HP remaining, with a maximum of 200 power."
  },
  "conversion-2": {
    "id": 176,
    "name": "Conversion 2",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 30,
    "priority": 0,
    "effect": "Changes the user’s type to a random type either resistant or immune to the last move used against it.",
    "statChanges": []
  },
  "aeroblast": {
    "id": 177,
    "name": "Aeroblast",
    "type": "Flying",
    "category": "Special",
    "power": 100,
    "accuracy": 95,
    "pp": 5,
    "priority": 0,
    "effect": "Has an increased chance for a critical hit."
  },
  "cotton-spore": {
    "id": 178,
    "name": "Cotton Spore",
    "type": "Grass",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 40,
    "priority": 0,
    "effect": "Lowers the target’s Speed by two stages.",
    "statChanges": [
      {
        "stat": "speed",
        "change": -2
      }
    ],
    "target": "user"
  },
  "reversal": {
    "id": 179,
    "name": "Reversal",
    "type": "Fighting",
    "category": "Physical",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "Inflicts more damage when the user has less HP remaining, with a maximum of 200 power."
  },
  "spite": {
    "id": 180,
    "name": "Spite",
    "type": "Ghost",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Lowers the PP of the target’s last used move by 4.",
    "statChanges": []
  },
  "powder-snow": {
    "id": 181,
    "name": "Powder Snow",
    "type": "Ice",
    "category": "Special",
    "power": 40,
    "accuracy": 100,
    "pp": 25,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to freeze the target."
  },
  "protect": {
    "id": 182,
    "name": "Protect",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 4,
    "effect": "Prevents any moves from hitting the user this turn.",
    "statChanges": []
  },
  "mach-punch": {
    "id": 183,
    "name": "Mach Punch",
    "type": "Fighting",
    "category": "Physical",
    "power": 40,
    "accuracy": 100,
    "pp": 30,
    "priority": 1,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "scary-face": {
    "id": 184,
    "name": "Scary Face",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Lowers the target’s Speed by two stages.",
    "statChanges": [
      {
        "stat": "speed",
        "change": -2
      }
    ],
    "target": "user"
  },
  "feint-attack": {
    "id": 185,
    "name": "Feint Attack",
    "type": "Dark",
    "category": "Physical",
    "power": 60,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Never misses."
  },
  "sweet-kiss": {
    "id": 186,
    "name": "Sweet Kiss",
    "type": "Fairy",
    "category": "Status",
    "power": 0,
    "accuracy": 75,
    "pp": 10,
    "priority": 0,
    "effect": "Confuses the target.",
    "statChanges": [],
    "target": "enemy"
  },
  "belly-drum": {
    "id": 187,
    "name": "Belly Drum",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "User pays half its max HP to max out its Attack.",
    "statChanges": []
  },
  "sludge-bomb": {
    "id": 188,
    "name": "Sludge Bomb",
    "type": "Poison",
    "category": "Special",
    "power": 90,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to poison the target."
  },
  "mud-slap": {
    "id": 189,
    "name": "Mud-Slap",
    "type": "Ground",
    "category": "Special",
    "power": 20,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to lower the target’s accuracy by one stage."
  },
  "octazooka": {
    "id": 190,
    "name": "Octazooka",
    "type": "Water",
    "category": "Special",
    "power": 65,
    "accuracy": 85,
    "pp": 10,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to lower the target’s accuracy by one stage."
  },
  "spikes": {
    "id": 191,
    "name": "Spikes",
    "type": "Ground",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Scatters Spikes, hurting opposing Pokémon that switch in.",
    "statChanges": []
  },
  "zap-cannon": {
    "id": 192,
    "name": "Zap Cannon",
    "type": "Electric",
    "category": "Special",
    "power": 120,
    "accuracy": 50,
    "pp": 5,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to paralyze the target."
  },
  "foresight": {
    "id": 193,
    "name": "Foresight",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 40,
    "priority": 0,
    "effect": "Forces the target to have no Evade, and allows it to be hit by Normal and Fighting moves even if it’s a Ghost.",
    "statChanges": [],
    "target": "enemy"
  },
  "destiny-bond": {
    "id": 194,
    "name": "Destiny Bond",
    "type": "Ghost",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": "If the user faints this turn, the target automatically will, too.",
    "statChanges": []
  },
  "perish-song": {
    "id": 195,
    "name": "Perish Song",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": "User and target both faint after three turns.",
    "statChanges": [],
    "target": "enemy"
  },
  "icy-wind": {
    "id": 196,
    "name": "Icy Wind",
    "type": "Ice",
    "category": "Special",
    "power": 55,
    "accuracy": 95,
    "pp": 15,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to lower the target’s Speed by one stage."
  },
  "detect": {
    "id": 197,
    "name": "Detect",
    "type": "Fighting",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 5,
    "priority": 4,
    "effect": "Prevents any moves from hitting the user this turn.",
    "statChanges": []
  },
  "bone-rush": {
    "id": 198,
    "name": "Bone Rush",
    "type": "Ground",
    "category": "Physical",
    "power": 25,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "effect": "Hits 2-5 times in one turn."
  },
  "lock-on": {
    "id": 199,
    "name": "Lock-On",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": "Ensures that the user’s next move will hit the target.",
    "statChanges": []
  },
  "outrage": {
    "id": 200,
    "name": "Outrage",
    "type": "Dragon",
    "category": "Physical",
    "power": 120,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Hits every turn for 2-3 turns, then confuses the user."
  },
  "sandstorm": {
    "id": 201,
    "name": "Sandstorm",
    "type": "Rock",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Changes the weather to a sandstorm for five turns.",
    "statChanges": []
  },
  "giga-drain": {
    "id": 202,
    "name": "Giga Drain",
    "type": "Grass",
    "category": "Special",
    "power": 75,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Drains half the damage inflicted to heal the user."
  },
  "endure": {
    "id": 203,
    "name": "Endure",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 4,
    "effect": "Prevents the user’s HP from lowering below 1 this turn.",
    "statChanges": []
  },
  "charm": {
    "id": 204,
    "name": "Charm",
    "type": "Fairy",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Lowers the target’s Attack by two stages.",
    "statChanges": [
      {
        "stat": "attack",
        "change": -2
      }
    ],
    "target": "user"
  },
  "rollout": {
    "id": 205,
    "name": "Rollout",
    "type": "Rock",
    "category": "Physical",
    "power": 30,
    "accuracy": 90,
    "pp": 20,
    "priority": 0,
    "effect": "Power doubles every turn this move is used in succession after the first, resetting after five turns."
  },
  "false-swipe": {
    "id": 206,
    "name": "False Swipe",
    "type": "Normal",
    "category": "Physical",
    "power": 40,
    "accuracy": 100,
    "pp": 40,
    "priority": 0,
    "effect": "Cannot lower the target’s HP below 1."
  },
  "swagger": {
    "id": 207,
    "name": "Swagger",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 85,
    "pp": 15,
    "priority": 0,
    "effect": "Raises the target’s Attack by two stages and confuses the target.",
    "statChanges": [
      {
        "stat": "attack",
        "change": 2
      }
    ],
    "target": "enemy"
  },
  "milk-drink": {
    "id": 208,
    "name": "Milk Drink",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": "Heals the user by half its max HP.",
    "statChanges": [],
    "target": "user"
  },
  "spark": {
    "id": 209,
    "name": "Spark",
    "type": "Electric",
    "category": "Physical",
    "power": 65,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to paralyze the target."
  },
  "fury-cutter": {
    "id": 210,
    "name": "Fury Cutter",
    "type": "Bug",
    "category": "Physical",
    "power": 40,
    "accuracy": 95,
    "pp": 20,
    "priority": 0,
    "effect": "Power doubles every turn this move is used in succession after the first, maxing out after five turns."
  },
  "steel-wing": {
    "id": 211,
    "name": "Steel Wing",
    "type": "Steel",
    "category": "Physical",
    "power": 70,
    "accuracy": 90,
    "pp": 25,
    "priority": 0,
    "effect": "Has a 10% chance to raise the user’s Defense by one stage."
  },
  "mean-look": {
    "id": 212,
    "name": "Mean Look",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": "Prevents the target from leaving battle.",
    "statChanges": []
  },
  "attract": {
    "id": 213,
    "name": "Attract",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "Target falls in love if it has the opposite gender, and has a 50% chance to refuse attacking the user.",
    "statChanges": [],
    "target": "enemy"
  },
  "sleep-talk": {
    "id": 214,
    "name": "Sleep Talk",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Randomly uses one of the user’s other three moves.  Only works if the user is sleeping.",
    "statChanges": []
  },
  "heal-bell": {
    "id": 215,
    "name": "Heal Bell",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": "Cures the entire party of major status effects.",
    "statChanges": []
  },
  "return": {
    "id": 216,
    "name": "Return",
    "type": "Normal",
    "category": "Physical",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Power increases with happiness, up to a maximum of 102."
  },
  "present": {
    "id": 217,
    "name": "Present",
    "type": "Normal",
    "category": "Physical",
    "power": 0,
    "accuracy": 90,
    "pp": 15,
    "priority": 0,
    "effect": "Randomly inflicts damage with power from 40 to 120 or heals the target for 1/4 its max HP."
  },
  "frustration": {
    "id": 218,
    "name": "Frustration",
    "type": "Normal",
    "category": "Physical",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Power increases as happiness decreases, up to a maximum of 102."
  },
  "safeguard": {
    "id": 219,
    "name": "Safeguard",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 25,
    "priority": 0,
    "effect": "Protects the user’s field from major status ailments and confusion for five turns.",
    "statChanges": []
  },
  "pain-split": {
    "id": 220,
    "name": "Pain Split",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Sets the user’s and targets’s HP to the average of their current HP.",
    "statChanges": []
  },
  "sacred-fire": {
    "id": 221,
    "name": "Sacred Fire",
    "type": "Fire",
    "category": "Physical",
    "power": 100,
    "accuracy": 95,
    "pp": 5,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to burn the target.  Lets frozen Pokémon thaw themselves."
  },
  "magnitude": {
    "id": 222,
    "name": "Magnitude",
    "type": "Ground",
    "category": "Physical",
    "power": 0,
    "accuracy": 100,
    "pp": 30,
    "priority": 0,
    "effect": "Power varies randomly from 10 to 150."
  },
  "dynamic-punch": {
    "id": 223,
    "name": "Dynamic Punch",
    "type": "Fighting",
    "category": "Physical",
    "power": 100,
    "accuracy": 50,
    "pp": 5,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to confuse the target."
  },
  "megahorn": {
    "id": 224,
    "name": "Megahorn",
    "type": "Bug",
    "category": "Physical",
    "power": 120,
    "accuracy": 85,
    "pp": 10,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "dragon-breath": {
    "id": 225,
    "name": "Dragon Breath",
    "type": "Dragon",
    "category": "Special",
    "power": 60,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to paralyze the target."
  },
  "baton-pass": {
    "id": 226,
    "name": "Baton Pass",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 40,
    "priority": 0,
    "effect": "Allows the trainer to switch out the user and pass effects along to its replacement.",
    "statChanges": []
  },
  "encore": {
    "id": 227,
    "name": "Encore",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": "Forces the target to repeat its last used move every turn for 2 to 6 turns.",
    "statChanges": []
  },
  "pursuit": {
    "id": 228,
    "name": "Pursuit",
    "type": "Dark",
    "category": "Physical",
    "power": 40,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Has double power against, and can hit, Pokémon attempting to switch out."
  },
  "rapid-spin": {
    "id": 229,
    "name": "Rapid Spin",
    "type": "Normal",
    "category": "Physical",
    "power": 50,
    "accuracy": 100,
    "pp": 40,
    "priority": 0,
    "effect": "Frees the user from binding moves, removes Leech Seed, and blows away Spikes."
  },
  "sweet-scent": {
    "id": 230,
    "name": "Sweet Scent",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Lowers the target’s evasion by one stage.",
    "statChanges": [
      {
        "stat": "evasion",
        "change": -2
      }
    ],
    "target": "user"
  },
  "iron-tail": {
    "id": 231,
    "name": "Iron Tail",
    "type": "Steel",
    "category": "Physical",
    "power": 100,
    "accuracy": 75,
    "pp": 15,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to lower the target’s Defense by one stage."
  },
  "metal-claw": {
    "id": 232,
    "name": "Metal Claw",
    "type": "Steel",
    "category": "Physical",
    "power": 50,
    "accuracy": 95,
    "pp": 35,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to raise the user’s Attack by one stage."
  },
  "vital-throw": {
    "id": 233,
    "name": "Vital Throw",
    "type": "Fighting",
    "category": "Physical",
    "power": 70,
    "accuracy": 100,
    "pp": 10,
    "priority": -1,
    "effect": "Never misses."
  },
  "morning-sun": {
    "id": 234,
    "name": "Morning Sun",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": "Heals the user by half its max HP.  Affected by weather.",
    "statChanges": [],
    "target": "user"
  },
  "synthesis": {
    "id": 235,
    "name": "Synthesis",
    "type": "Grass",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": "Heals the user by half its max HP.  Affected by weather.",
    "statChanges": [],
    "target": "user"
  },
  "moonlight": {
    "id": 236,
    "name": "Moonlight",
    "type": "Fairy",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": "Heals the user by half its max HP.  Affected by weather.",
    "statChanges": [],
    "target": "user"
  },
  "hidden-power": {
    "id": 237,
    "name": "Hidden Power",
    "type": "Normal",
    "category": "Special",
    "power": 60,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "Power and type depend upon user’s IVs.  Power can range from 30 to 70."
  },
  "cross-chop": {
    "id": 238,
    "name": "Cross Chop",
    "type": "Fighting",
    "category": "Physical",
    "power": 100,
    "accuracy": 80,
    "pp": 5,
    "priority": 0,
    "effect": "Has an increased chance for a critical hit."
  },
  "twister": {
    "id": 239,
    "name": "Twister",
    "type": "Dragon",
    "category": "Special",
    "power": 40,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to make the target flinch."
  },
  "rain-dance": {
    "id": 240,
    "name": "Rain Dance",
    "type": "Water",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": "Changes the weather to rain for five turns.",
    "statChanges": []
  },
  "sunny-day": {
    "id": 241,
    "name": "Sunny Day",
    "type": "Fire",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": "Changes the weather to sunny for five turns.",
    "statChanges": []
  },
  "crunch": {
    "id": 242,
    "name": "Crunch",
    "type": "Dark",
    "category": "Physical",
    "power": 80,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to lower the target’s Defense by one stage."
  },
  "mirror-coat": {
    "id": 243,
    "name": "Mirror Coat",
    "type": "Psychic",
    "category": "Special",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": -5,
    "effect": "Inflicts twice the damage the user received from the last special hit it took."
  },
  "psych-up": {
    "id": 244,
    "name": "Psych Up",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Discards the user’s stat changes and copies the target’s.",
    "statChanges": []
  },
  "extreme-speed": {
    "id": 245,
    "name": "Extreme Speed",
    "type": "Normal",
    "category": "Physical",
    "power": 80,
    "accuracy": 100,
    "pp": 5,
    "priority": 2,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "ancient-power": {
    "id": 246,
    "name": "Ancient Power",
    "type": "Rock",
    "category": "Special",
    "power": 60,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to raise all of the user’s stats by one stage."
  },
  "shadow-ball": {
    "id": 247,
    "name": "Shadow Ball",
    "type": "Ghost",
    "category": "Special",
    "power": 80,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to lower the target’s Special Defense by one stage."
  },
  "future-sight": {
    "id": 248,
    "name": "Future Sight",
    "type": "Psychic",
    "category": "Special",
    "power": 120,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Hits the target two turns later."
  },
  "rock-smash": {
    "id": 249,
    "name": "Rock Smash",
    "type": "Fighting",
    "category": "Physical",
    "power": 40,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to lower the target’s Defense by one stage."
  },
  "whirlpool": {
    "id": 250,
    "name": "Whirlpool",
    "type": "Water",
    "category": "Special",
    "power": 35,
    "accuracy": 85,
    "pp": 15,
    "priority": 0,
    "effect": "Prevents the target from leaving battle and inflicts 1/16 its max HP in damage for 2-5 turns."
  },
  "beat-up": {
    "id": 251,
    "name": "Beat Up",
    "type": "Dark",
    "category": "Physical",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Hits once for every conscious Pokémon the trainer has."
  },
  "fake-out": {
    "id": 252,
    "name": "Fake Out",
    "type": "Normal",
    "category": "Physical",
    "power": 40,
    "accuracy": 100,
    "pp": 10,
    "priority": 3,
    "effect": "Can only be used as the first move after the user enters battle.  Causes the target to flinch."
  },
  "uproar": {
    "id": 253,
    "name": "Uproar",
    "type": "Normal",
    "category": "Special",
    "power": 90,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Forced to use this move for several turns.  Pokémon cannot fall asleep in that time."
  },
  "stockpile": {
    "id": 254,
    "name": "Stockpile",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Stores energy up to three times for use with Spit Up and Swallow.",
    "statChanges": [
      {
        "stat": "defense",
        "change": 1
      },
      {
        "stat": "spDef",
        "change": 1
      }
    ],
    "target": "user"
  },
  "spit-up": {
    "id": 255,
    "name": "Spit Up",
    "type": "Normal",
    "category": "Special",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Power is 100 times the amount of energy Stockpiled."
  },
  "swallow": {
    "id": 256,
    "name": "Swallow",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Recovers 1/4 HP after one Stockpile, 1/2 HP after two Stockpiles, or full HP after three Stockpiles.",
    "statChanges": [],
    "target": "user"
  },
  "heat-wave": {
    "id": 257,
    "name": "Heat Wave",
    "type": "Fire",
    "category": "Special",
    "power": 95,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to burn the target."
  },
  "hail": {
    "id": 258,
    "name": "Hail",
    "type": "Ice",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Changes the weather to a hailstorm for five turns.",
    "statChanges": []
  },
  "torment": {
    "id": 259,
    "name": "Torment",
    "type": "Dark",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "Prevents the target from using the same move twice in a row.",
    "statChanges": [],
    "target": "enemy"
  },
  "flatter": {
    "id": 260,
    "name": "Flatter",
    "type": "Dark",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "Raises the target’s Special Attack by one stage and confuses the target.",
    "statChanges": [
      {
        "stat": "spAtk",
        "change": 1
      }
    ],
    "target": "enemy"
  },
  "will-o-wisp": {
    "id": 261,
    "name": "Will-O-Wisp",
    "type": "Fire",
    "category": "Status",
    "power": 0,
    "accuracy": 85,
    "pp": 15,
    "priority": 0,
    "effect": "Burns the target.",
    "statChanges": [],
    "target": "enemy"
  },
  "memento": {
    "id": 262,
    "name": "Memento",
    "type": "Dark",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Lowers the target’s Attack and Special Attack by two stages.  User faints.",
    "statChanges": [
      {
        "stat": "attack",
        "change": -2
      },
      {
        "stat": "spAtk",
        "change": -2
      }
    ],
    "target": "enemy"
  },
  "facade": {
    "id": 263,
    "name": "Facade",
    "type": "Normal",
    "category": "Physical",
    "power": 70,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Power doubles if user is burned, paralyzed, or poisoned."
  },
  "focus-punch": {
    "id": 264,
    "name": "Focus Punch",
    "type": "Fighting",
    "category": "Physical",
    "power": 150,
    "accuracy": 100,
    "pp": 20,
    "priority": -3,
    "effect": "If the user takes damage before attacking, the attack is canceled."
  },
  "smelling-salts": {
    "id": 265,
    "name": "Smelling Salts",
    "type": "Normal",
    "category": "Physical",
    "power": 70,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "If the target is paralyzed, inflicts double damage and cures the paralysis."
  },
  "follow-me": {
    "id": 266,
    "name": "Follow Me",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 2,
    "effect": "Redirects the target’s single-target effects to the user for this turn.",
    "statChanges": []
  },
  "nature-power": {
    "id": 267,
    "name": "Nature Power",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Uses a move which depends upon the terrain.",
    "statChanges": []
  },
  "charge": {
    "id": 268,
    "name": "Charge",
    "type": "Electric",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Raises the user’s Special Defense by one stage.  User’s Electric moves have doubled power next turn.",
    "statChanges": [
      {
        "stat": "spDef",
        "change": 1
      }
    ],
    "target": "user"
  },
  "taunt": {
    "id": 269,
    "name": "Taunt",
    "type": "Dark",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "For the next few turns, the target can only use damaging moves.",
    "statChanges": []
  },
  "helping-hand": {
    "id": 270,
    "name": "Helping Hand",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 5,
    "effect": "Ally’s next move inflicts half more damage.",
    "statChanges": []
  },
  "trick": {
    "id": 271,
    "name": "Trick",
    "type": "Psychic",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "User and target swap items.",
    "statChanges": []
  },
  "role-play": {
    "id": 272,
    "name": "Role Play",
    "type": "Psychic",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Copies the target’s ability.",
    "statChanges": []
  },
  "wish": {
    "id": 273,
    "name": "Wish",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "User will recover half its max HP at the end of the next turn.",
    "statChanges": []
  },
  "assist": {
    "id": 274,
    "name": "Assist",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Randomly selects and uses one of the trainer’s other Pokémon’s moves.",
    "statChanges": []
  },
  "ingrain": {
    "id": 275,
    "name": "Ingrain",
    "type": "Grass",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Prevents the user from leaving battle.  User regains 1/16 of its max HP every turn.",
    "statChanges": [],
    "target": "enemy"
  },
  "superpower": {
    "id": 276,
    "name": "Superpower",
    "type": "Fighting",
    "category": "Physical",
    "power": 120,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": "Lowers the user’s Attack and Defense by one stage after inflicting damage."
  },
  "magic-coat": {
    "id": 277,
    "name": "Magic Coat",
    "type": "Psychic",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 4,
    "effect": "Reflects back the first effect move used on the user this turn.",
    "statChanges": []
  },
  "recycle": {
    "id": 278,
    "name": "Recycle",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "User recovers the item it last used up.",
    "statChanges": []
  },
  "revenge": {
    "id": 279,
    "name": "Revenge",
    "type": "Fighting",
    "category": "Physical",
    "power": 60,
    "accuracy": 100,
    "pp": 10,
    "priority": -4,
    "effect": "Inflicts double damage if the user takes damage before attacking this turn."
  },
  "brick-break": {
    "id": 280,
    "name": "Brick Break",
    "type": "Fighting",
    "category": "Physical",
    "power": 75,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "Destroys Reflect and Light Screen."
  },
  "yawn": {
    "id": 281,
    "name": "Yawn",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Target sleeps at the end of the next turn.",
    "statChanges": [],
    "target": "enemy"
  },
  "knock-off": {
    "id": 282,
    "name": "Knock Off",
    "type": "Dark",
    "category": "Physical",
    "power": 65,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Target drops its held item."
  },
  "endeavor": {
    "id": 283,
    "name": "Endeavor",
    "type": "Normal",
    "category": "Physical",
    "power": 0,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": "Lowers the target’s HP to equal the user’s."
  },
  "eruption": {
    "id": 284,
    "name": "Eruption",
    "type": "Fire",
    "category": "Special",
    "power": 150,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": "Inflicts more damage when the user has more HP remaining, with a maximum of 150 power."
  },
  "skill-swap": {
    "id": 285,
    "name": "Skill Swap",
    "type": "Psychic",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "User and target swap abilities.",
    "statChanges": []
  },
  "imprison": {
    "id": 286,
    "name": "Imprison",
    "type": "Psychic",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Prevents the target from using any moves that the user also knows.",
    "statChanges": []
  },
  "refresh": {
    "id": 287,
    "name": "Refresh",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Cleanses the user of a burn, paralysis, or poison.",
    "statChanges": []
  },
  "grudge": {
    "id": 288,
    "name": "Grudge",
    "type": "Ghost",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": "If the user faints this turn, the PP of the move that fainted it drops to 0.",
    "statChanges": []
  },
  "snatch": {
    "id": 289,
    "name": "Snatch",
    "type": "Dark",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 4,
    "effect": "Steals the target’s move, if it’s self-targeted.",
    "statChanges": []
  },
  "secret-power": {
    "id": 290,
    "name": "Secret Power",
    "type": "Normal",
    "category": "Physical",
    "power": 70,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to inflict a status effect which depends upon the terrain."
  },
  "dive": {
    "id": 291,
    "name": "Dive",
    "type": "Water",
    "category": "Physical",
    "power": 80,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "User dives underwater, dodging all attacks, and hits next turn."
  },
  "arm-thrust": {
    "id": 292,
    "name": "Arm Thrust",
    "type": "Fighting",
    "category": "Physical",
    "power": 15,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Hits 2-5 times in one turn."
  },
  "camouflage": {
    "id": 293,
    "name": "Camouflage",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "User’s type changes to match the terrain.",
    "statChanges": []
  },
  "tail-glow": {
    "id": 294,
    "name": "Tail Glow",
    "type": "Bug",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Raises the user’s Special Attack by three stages.",
    "statChanges": [
      {
        "stat": "spAtk",
        "change": 3
      }
    ],
    "target": "user"
  },
  "luster-purge": {
    "id": 295,
    "name": "Luster Purge",
    "type": "Psychic",
    "category": "Special",
    "power": 95,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to lower the target’s Special Defense by one stage."
  },
  "mist-ball": {
    "id": 296,
    "name": "Mist Ball",
    "type": "Psychic",
    "category": "Special",
    "power": 95,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to lower the target’s Special Attack by one stage."
  },
  "feather-dance": {
    "id": 297,
    "name": "Feather Dance",
    "type": "Flying",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "Lowers the target’s Attack by two stages.",
    "statChanges": [
      {
        "stat": "attack",
        "change": -2
      }
    ],
    "target": "user"
  },
  "teeter-dance": {
    "id": 298,
    "name": "Teeter Dance",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Confuses the target.",
    "statChanges": [],
    "target": "enemy"
  },
  "blaze-kick": {
    "id": 299,
    "name": "Blaze Kick",
    "type": "Fire",
    "category": "Physical",
    "power": 85,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "effect": "Has an increased chance for a critical hit and a $effect_chance% chance to burn the target."
  },
  "mud-sport": {
    "id": 300,
    "name": "Mud Sport",
    "type": "Ground",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "Halves all Electric-type damage.",
    "statChanges": []
  },
  "ice-ball": {
    "id": 301,
    "name": "Ice Ball",
    "type": "Ice",
    "category": "Physical",
    "power": 30,
    "accuracy": 90,
    "pp": 20,
    "priority": 0,
    "effect": "Power doubles every turn this move is used in succession after the first, resetting after five turns."
  },
  "needle-arm": {
    "id": 302,
    "name": "Needle Arm",
    "type": "Grass",
    "category": "Physical",
    "power": 60,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to make the target flinch."
  },
  "slack-off": {
    "id": 303,
    "name": "Slack Off",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": "Heals the user by half its max HP.",
    "statChanges": [],
    "target": "user"
  },
  "hyper-voice": {
    "id": 304,
    "name": "Hyper Voice",
    "type": "Normal",
    "category": "Special",
    "power": 90,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "poison-fang": {
    "id": 305,
    "name": "Poison Fang",
    "type": "Poison",
    "category": "Physical",
    "power": 50,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to badly poison the target."
  },
  "crush-claw": {
    "id": 306,
    "name": "Crush Claw",
    "type": "Normal",
    "category": "Physical",
    "power": 75,
    "accuracy": 95,
    "pp": 10,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to lower the target’s Defense by one stage."
  },
  "blast-burn": {
    "id": 307,
    "name": "Blast Burn",
    "type": "Fire",
    "category": "Special",
    "power": 150,
    "accuracy": 90,
    "pp": 5,
    "priority": 0,
    "effect": "User foregoes its next turn to recharge."
  },
  "hydro-cannon": {
    "id": 308,
    "name": "Hydro Cannon",
    "type": "Water",
    "category": "Special",
    "power": 150,
    "accuracy": 90,
    "pp": 5,
    "priority": 0,
    "effect": "User foregoes its next turn to recharge."
  },
  "meteor-mash": {
    "id": 309,
    "name": "Meteor Mash",
    "type": "Steel",
    "category": "Physical",
    "power": 90,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to raise the user’s Attack by one stage."
  },
  "astonish": {
    "id": 310,
    "name": "Astonish",
    "type": "Ghost",
    "category": "Physical",
    "power": 30,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to make the target flinch."
  },
  "weather-ball": {
    "id": 311,
    "name": "Weather Ball",
    "type": "Normal",
    "category": "Special",
    "power": 50,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "If there be weather, this move has doubled power and the weather’s type."
  },
  "aromatherapy": {
    "id": 312,
    "name": "Aromatherapy",
    "type": "Grass",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": "Cures the entire party of major status effects.",
    "statChanges": []
  },
  "fake-tears": {
    "id": 313,
    "name": "Fake Tears",
    "type": "Dark",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Lowers the target’s Special Defense by two stages.",
    "statChanges": [
      {
        "stat": "spDef",
        "change": -2
      }
    ],
    "target": "user"
  },
  "air-cutter": {
    "id": 314,
    "name": "Air Cutter",
    "type": "Flying",
    "category": "Special",
    "power": 60,
    "accuracy": 95,
    "pp": 25,
    "priority": 0,
    "effect": "Has an increased chance for a critical hit."
  },
  "overheat": {
    "id": 315,
    "name": "Overheat",
    "type": "Fire",
    "category": "Special",
    "power": 130,
    "accuracy": 90,
    "pp": 5,
    "priority": 0,
    "effect": "Lowers the user’s Special Attack by two stages after inflicting damage."
  },
  "odor-sleuth": {
    "id": 316,
    "name": "Odor Sleuth",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 40,
    "priority": 0,
    "effect": "Forces the target to have no Evade, and allows it to be hit by Normal and Fighting moves even if it’s a Ghost.",
    "statChanges": [],
    "target": "enemy"
  },
  "rock-tomb": {
    "id": 317,
    "name": "Rock Tomb",
    "type": "Rock",
    "category": "Physical",
    "power": 60,
    "accuracy": 95,
    "pp": 15,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to lower the target’s Speed by one stage."
  },
  "silver-wind": {
    "id": 318,
    "name": "Silver Wind",
    "type": "Bug",
    "category": "Special",
    "power": 60,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to raise all of the user’s stats by one stage."
  },
  "metal-sound": {
    "id": 319,
    "name": "Metal Sound",
    "type": "Steel",
    "category": "Status",
    "power": 0,
    "accuracy": 85,
    "pp": 40,
    "priority": 0,
    "effect": "Lowers the target’s Special Defense by two stages.",
    "statChanges": [
      {
        "stat": "spDef",
        "change": -2
      }
    ],
    "target": "user"
  },
  "grass-whistle": {
    "id": 320,
    "name": "Grass Whistle",
    "type": "Grass",
    "category": "Status",
    "power": 0,
    "accuracy": 55,
    "pp": 15,
    "priority": 0,
    "effect": "Puts the target to sleep.",
    "statChanges": [],
    "target": "enemy"
  },
  "tickle": {
    "id": 321,
    "name": "Tickle",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Lowers the target’s Attack and Defense by one stage.",
    "statChanges": [
      {
        "stat": "attack",
        "change": -1
      },
      {
        "stat": "defense",
        "change": -1
      }
    ],
    "target": "user"
  },
  "cosmic-power": {
    "id": 322,
    "name": "Cosmic Power",
    "type": "Psychic",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Raises the user’s Defense and Special Defense by one stage.",
    "statChanges": [
      {
        "stat": "defense",
        "change": 1
      },
      {
        "stat": "spDef",
        "change": 1
      }
    ],
    "target": "user"
  },
  "water-spout": {
    "id": 323,
    "name": "Water Spout",
    "type": "Water",
    "category": "Special",
    "power": 150,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": "Inflicts more damage when the user has more HP remaining, with a maximum of 150 power."
  },
  "signal-beam": {
    "id": 324,
    "name": "Signal Beam",
    "type": "Bug",
    "category": "Special",
    "power": 75,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to confuse the target."
  },
  "shadow-punch": {
    "id": 325,
    "name": "Shadow Punch",
    "type": "Ghost",
    "category": "Physical",
    "power": 60,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Never misses."
  },
  "extrasensory": {
    "id": 326,
    "name": "Extrasensory",
    "type": "Psychic",
    "category": "Special",
    "power": 80,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to make the target flinch."
  },
  "sky-uppercut": {
    "id": 327,
    "name": "Sky Uppercut",
    "type": "Fighting",
    "category": "Physical",
    "power": 85,
    "accuracy": 90,
    "pp": 15,
    "priority": 0,
    "effect": "Inflicts regular damage and can hit Bounce and Fly users."
  },
  "sand-tomb": {
    "id": 328,
    "name": "Sand Tomb",
    "type": "Ground",
    "category": "Physical",
    "power": 35,
    "accuracy": 85,
    "pp": 15,
    "priority": 0,
    "effect": "Prevents the target from fleeing and inflicts damage for 2-5 turns."
  },
  "sheer-cold": {
    "id": 329,
    "name": "Sheer Cold",
    "type": "Ice",
    "category": "Special",
    "power": 0,
    "accuracy": 30,
    "pp": 5,
    "priority": 0,
    "effect": "Causes a one-hit KO."
  },
  "muddy-water": {
    "id": 330,
    "name": "Muddy Water",
    "type": "Water",
    "category": "Special",
    "power": 90,
    "accuracy": 85,
    "pp": 10,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to lower the target’s accuracy by one stage."
  },
  "bullet-seed": {
    "id": 331,
    "name": "Bullet Seed",
    "type": "Grass",
    "category": "Physical",
    "power": 25,
    "accuracy": 100,
    "pp": 30,
    "priority": 0,
    "effect": "Hits 2-5 times in one turn."
  },
  "aerial-ace": {
    "id": 332,
    "name": "Aerial Ace",
    "type": "Flying",
    "category": "Physical",
    "power": 60,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Never misses."
  },
  "icicle-spear": {
    "id": 333,
    "name": "Icicle Spear",
    "type": "Ice",
    "category": "Physical",
    "power": 25,
    "accuracy": 100,
    "pp": 30,
    "priority": 0,
    "effect": "Hits 2-5 times in one turn."
  },
  "iron-defense": {
    "id": 334,
    "name": "Iron Defense",
    "type": "Steel",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "Raises the user’s Defense by two stages.",
    "statChanges": [
      {
        "stat": "defense",
        "change": 2
      }
    ],
    "target": "user"
  },
  "block": {
    "id": 335,
    "name": "Block",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": "Prevents the target from leaving battle.",
    "statChanges": []
  },
  "howl": {
    "id": 336,
    "name": "Howl",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 40,
    "priority": 0,
    "effect": "Raises the user’s Attack by one stage.",
    "statChanges": [
      {
        "stat": "attack",
        "change": 1
      }
    ],
    "target": "user"
  },
  "dragon-claw": {
    "id": 337,
    "name": "Dragon Claw",
    "type": "Dragon",
    "category": "Physical",
    "power": 80,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "frenzy-plant": {
    "id": 338,
    "name": "Frenzy Plant",
    "type": "Grass",
    "category": "Special",
    "power": 150,
    "accuracy": 90,
    "pp": 5,
    "priority": 0,
    "effect": "User foregoes its next turn to recharge."
  },
  "bulk-up": {
    "id": 339,
    "name": "Bulk Up",
    "type": "Fighting",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Raises the user’s Attack and Defense by one stage.",
    "statChanges": [
      {
        "stat": "attack",
        "change": 1
      },
      {
        "stat": "defense",
        "change": 1
      }
    ],
    "target": "user"
  },
  "bounce": {
    "id": 340,
    "name": "Bounce",
    "type": "Flying",
    "category": "Physical",
    "power": 85,
    "accuracy": 85,
    "pp": 5,
    "priority": 0,
    "effect": "User bounces high into the air, dodging all attacks, and hits next turn."
  },
  "mud-shot": {
    "id": 341,
    "name": "Mud Shot",
    "type": "Ground",
    "category": "Special",
    "power": 55,
    "accuracy": 95,
    "pp": 15,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to lower the target’s Speed by one stage."
  },
  "poison-tail": {
    "id": 342,
    "name": "Poison Tail",
    "type": "Poison",
    "category": "Physical",
    "power": 50,
    "accuracy": 100,
    "pp": 25,
    "priority": 0,
    "effect": "Has an increased chance for a critical hit and a $effect_chance% chance to poison the target."
  },
  "covet": {
    "id": 343,
    "name": "Covet",
    "type": "Normal",
    "category": "Physical",
    "power": 60,
    "accuracy": 100,
    "pp": 25,
    "priority": 0,
    "effect": "Takes the target’s item."
  },
  "volt-tackle": {
    "id": 344,
    "name": "Volt Tackle",
    "type": "Electric",
    "category": "Physical",
    "power": 120,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "User takes 1/3 the damage inflicted in recoil.  Has a $effect_chance% chance to paralyze the target."
  },
  "magical-leaf": {
    "id": 345,
    "name": "Magical Leaf",
    "type": "Grass",
    "category": "Special",
    "power": 60,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Never misses."
  },
  "water-sport": {
    "id": 346,
    "name": "Water Sport",
    "type": "Water",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "Halves all Fire-type damage.",
    "statChanges": []
  },
  "calm-mind": {
    "id": 347,
    "name": "Calm Mind",
    "type": "Psychic",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Raises the user’s Special Attack and Special Defense by one stage.",
    "statChanges": [
      {
        "stat": "spAtk",
        "change": 1
      },
      {
        "stat": "spDef",
        "change": 1
      }
    ],
    "target": "user"
  },
  "leaf-blade": {
    "id": 348,
    "name": "Leaf Blade",
    "type": "Grass",
    "category": "Physical",
    "power": 90,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "Has an increased chance for a critical hit."
  },
  "dragon-dance": {
    "id": 349,
    "name": "Dragon Dance",
    "type": "Dragon",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Raises the user’s Attack and Speed by one stage.",
    "statChanges": [
      {
        "stat": "attack",
        "change": 1
      },
      {
        "stat": "speed",
        "change": 1
      }
    ],
    "target": "user"
  },
  "rock-blast": {
    "id": 350,
    "name": "Rock Blast",
    "type": "Rock",
    "category": "Physical",
    "power": 25,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "effect": "Hits 2-5 times in one turn."
  },
  "shock-wave": {
    "id": 351,
    "name": "Shock Wave",
    "type": "Electric",
    "category": "Special",
    "power": 60,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Never misses."
  },
  "water-pulse": {
    "id": 352,
    "name": "Water Pulse",
    "type": "Water",
    "category": "Special",
    "power": 60,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to confuse the target."
  },
  "doom-desire": {
    "id": 353,
    "name": "Doom Desire",
    "type": "Steel",
    "category": "Special",
    "power": 140,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": "Hits the target two turns later."
  },
  "psycho-boost": {
    "id": 354,
    "name": "Psycho Boost",
    "type": "Psychic",
    "category": "Special",
    "power": 140,
    "accuracy": 90,
    "pp": 5,
    "priority": 0,
    "effect": "Lowers the user’s Special Attack by two stages after inflicting damage."
  },
  "roost": {
    "id": 355,
    "name": "Roost",
    "type": "Flying",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": "Heals the user by half its max HP.",
    "statChanges": [],
    "target": "user"
  },
  "gravity": {
    "id": 356,
    "name": "Gravity",
    "type": "Psychic",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": "Disables moves and immunities that involve flying or levitating for five turns.",
    "statChanges": []
  },
  "miracle-eye": {
    "id": 357,
    "name": "Miracle Eye",
    "type": "Psychic",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 40,
    "priority": 0,
    "effect": "Forces the target to have no evasion, and allows it to be hit by Psychic moves even if it’s Dark.",
    "statChanges": [],
    "target": "enemy"
  },
  "wake-up-slap": {
    "id": 358,
    "name": "Wake-Up Slap",
    "type": "Fighting",
    "category": "Physical",
    "power": 70,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "If the target is asleep, has double power and wakes it up."
  },
  "hammer-arm": {
    "id": 359,
    "name": "Hammer Arm",
    "type": "Fighting",
    "category": "Physical",
    "power": 100,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "effect": "Lowers user’s Speed by one stage."
  },
  "gyro-ball": {
    "id": 360,
    "name": "Gyro Ball",
    "type": "Steel",
    "category": "Physical",
    "power": 0,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": "Power raises when the user has lower Speed, up to a maximum of 150."
  },
  "healing-wish": {
    "id": 361,
    "name": "Healing Wish",
    "type": "Psychic",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "User faints.  Its replacement has its HP fully restored and any major status effect removed.",
    "statChanges": []
  },
  "brine": {
    "id": 362,
    "name": "Brine",
    "type": "Water",
    "category": "Special",
    "power": 65,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Has double power against Pokémon that have less than half their max HP remaining."
  },
  "natural-gift": {
    "id": 363,
    "name": "Natural Gift",
    "type": "Normal",
    "category": "Physical",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "Power and type depend on the held berry."
  },
  "feint": {
    "id": 364,
    "name": "Feint",
    "type": "Normal",
    "category": "Physical",
    "power": 30,
    "accuracy": 100,
    "pp": 10,
    "priority": 2,
    "effect": "Hits through Protect and Detect."
  },
  "pluck": {
    "id": 365,
    "name": "Pluck",
    "type": "Flying",
    "category": "Physical",
    "power": 60,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "If target has a berry, inflicts double damage and uses the berry."
  },
  "tailwind": {
    "id": 366,
    "name": "Tailwind",
    "type": "Flying",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "For three turns, friendly Pokémon have doubled Speed.",
    "statChanges": []
  },
  "acupressure": {
    "id": 367,
    "name": "Acupressure",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 30,
    "priority": 0,
    "effect": "Raises one of a friendly Pokémon’s stats at random by two stages.",
    "statChanges": []
  },
  "metal-burst": {
    "id": 368,
    "name": "Metal Burst",
    "type": "Steel",
    "category": "Physical",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Strikes back at the last Pokémon to hit the user this turn with 1.5× the damage."
  },
  "u-turn": {
    "id": 369,
    "name": "U-turn",
    "type": "Bug",
    "category": "Physical",
    "power": 70,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "User must switch out after attacking."
  },
  "close-combat": {
    "id": 370,
    "name": "Close Combat",
    "type": "Fighting",
    "category": "Physical",
    "power": 120,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": "Lowers the user’s Defense and Special Defense by one stage after inflicting damage."
  },
  "payback": {
    "id": 371,
    "name": "Payback",
    "type": "Dark",
    "category": "Physical",
    "power": 50,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Power is doubled if the target has already moved this turn."
  },
  "assurance": {
    "id": 372,
    "name": "Assurance",
    "type": "Dark",
    "category": "Physical",
    "power": 60,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Power is doubled if the target has already received damage this turn."
  },
  "embargo": {
    "id": 373,
    "name": "Embargo",
    "type": "Dark",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "Target cannot use held items.",
    "statChanges": [],
    "target": "enemy"
  },
  "fling": {
    "id": 374,
    "name": "Fling",
    "type": "Dark",
    "category": "Physical",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Throws held item at the target; power depends on the item."
  },
  "psycho-shift": {
    "id": 375,
    "name": "Psycho Shift",
    "type": "Psychic",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Transfers the user’s major status effect to the target.",
    "statChanges": []
  },
  "trump-card": {
    "id": 376,
    "name": "Trump Card",
    "type": "Normal",
    "category": "Special",
    "power": 0,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": "Power increases when this move has less PP, up to a maximum of 200."
  },
  "heal-block": {
    "id": 377,
    "name": "Heal Block",
    "type": "Psychic",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "Prevents target from restoring its HP for five turns.",
    "statChanges": [],
    "target": "enemy"
  },
  "wring-out": {
    "id": 378,
    "name": "Wring Out",
    "type": "Normal",
    "category": "Special",
    "power": 0,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": "Power increases against targets with more HP remaining, up to a maximum of 121 power."
  },
  "power-trick": {
    "id": 379,
    "name": "Power Trick",
    "type": "Psychic",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "User swaps Attack and Defense.",
    "statChanges": []
  },
  "gastro-acid": {
    "id": 380,
    "name": "Gastro Acid",
    "type": "Poison",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Nullifies target’s ability until it leaves battle.",
    "statChanges": []
  },
  "lucky-chant": {
    "id": 381,
    "name": "Lucky Chant",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 30,
    "priority": 0,
    "effect": "Prevents the target from scoring critical hits for five turns.",
    "statChanges": []
  },
  "me-first": {
    "id": 382,
    "name": "Me First",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Uses the target’s move against it before it attacks, with power increased by half.",
    "statChanges": []
  },
  "copycat": {
    "id": 383,
    "name": "Copycat",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Uses the target’s last used move.",
    "statChanges": []
  },
  "power-swap": {
    "id": 384,
    "name": "Power Swap",
    "type": "Psychic",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "User swaps Attack and Special Attack changes with the target.",
    "statChanges": []
  },
  "guard-swap": {
    "id": 385,
    "name": "Guard Swap",
    "type": "Psychic",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "User swaps Defense and Special Defense changes with the target.",
    "statChanges": []
  },
  "punishment": {
    "id": 386,
    "name": "Punishment",
    "type": "Dark",
    "category": "Physical",
    "power": 0,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": "Power increases against targets with more raised stats, up to a maximum of 200."
  },
  "last-resort": {
    "id": 387,
    "name": "Last Resort",
    "type": "Normal",
    "category": "Physical",
    "power": 140,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": "Can only be used after all of the user’s other moves have been used."
  },
  "worry-seed": {
    "id": 388,
    "name": "Worry Seed",
    "type": "Grass",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Changes the target’s ability to Insomnia.",
    "statChanges": []
  },
  "sucker-punch": {
    "id": 389,
    "name": "Sucker Punch",
    "type": "Dark",
    "category": "Physical",
    "power": 70,
    "accuracy": 100,
    "pp": 5,
    "priority": 1,
    "effect": "Only works if the target is about to use a damaging move."
  },
  "toxic-spikes": {
    "id": 390,
    "name": "Toxic Spikes",
    "type": "Poison",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Scatters poisoned spikes, poisoning opposing Pokémon that switch in.",
    "statChanges": []
  },
  "heart-swap": {
    "id": 391,
    "name": "Heart Swap",
    "type": "Psychic",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "User and target swap stat changes.",
    "statChanges": []
  },
  "aqua-ring": {
    "id": 392,
    "name": "Aqua Ring",
    "type": "Water",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Restores 1/16 of the user’s max HP each turn.",
    "statChanges": []
  },
  "magnet-rise": {
    "id": 393,
    "name": "Magnet Rise",
    "type": "Electric",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "User is immune to Ground moves and effects for five turns.",
    "statChanges": []
  },
  "flare-blitz": {
    "id": 394,
    "name": "Flare Blitz",
    "type": "Fire",
    "category": "Physical",
    "power": 120,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "User takes 1/3 the damage inflicted in recoil.  Has a $effect_chance% chance to burn the target."
  },
  "force-palm": {
    "id": 395,
    "name": "Force Palm",
    "type": "Fighting",
    "category": "Physical",
    "power": 60,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to paralyze the target."
  },
  "aura-sphere": {
    "id": 396,
    "name": "Aura Sphere",
    "type": "Fighting",
    "category": "Special",
    "power": 80,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Never misses."
  },
  "rock-polish": {
    "id": 397,
    "name": "Rock Polish",
    "type": "Rock",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Raises the user’s Speed by two stages.",
    "statChanges": [
      {
        "stat": "speed",
        "change": 2
      }
    ],
    "target": "user"
  },
  "poison-jab": {
    "id": 398,
    "name": "Poison Jab",
    "type": "Poison",
    "category": "Physical",
    "power": 80,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to poison the target."
  },
  "dark-pulse": {
    "id": 399,
    "name": "Dark Pulse",
    "type": "Dark",
    "category": "Special",
    "power": 80,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to make the target flinch."
  },
  "night-slash": {
    "id": 400,
    "name": "Night Slash",
    "type": "Dark",
    "category": "Physical",
    "power": 70,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "Has an increased chance for a critical hit."
  },
  "aqua-tail": {
    "id": 401,
    "name": "Aqua Tail",
    "type": "Water",
    "category": "Physical",
    "power": 90,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "seed-bomb": {
    "id": 402,
    "name": "Seed Bomb",
    "type": "Grass",
    "category": "Physical",
    "power": 80,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "air-slash": {
    "id": 403,
    "name": "Air Slash",
    "type": "Flying",
    "category": "Special",
    "power": 75,
    "accuracy": 95,
    "pp": 15,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to make the target flinch."
  },
  "x-scissor": {
    "id": 404,
    "name": "X-Scissor",
    "type": "Bug",
    "category": "Physical",
    "power": 80,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "bug-buzz": {
    "id": 405,
    "name": "Bug Buzz",
    "type": "Bug",
    "category": "Special",
    "power": 90,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to lower the target’s Special Defense by one stage."
  },
  "dragon-pulse": {
    "id": 406,
    "name": "Dragon Pulse",
    "type": "Dragon",
    "category": "Special",
    "power": 85,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "dragon-rush": {
    "id": 407,
    "name": "Dragon Rush",
    "type": "Dragon",
    "category": "Physical",
    "power": 100,
    "accuracy": 75,
    "pp": 10,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to make the target flinch."
  },
  "power-gem": {
    "id": 408,
    "name": "Power Gem",
    "type": "Rock",
    "category": "Special",
    "power": 80,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "drain-punch": {
    "id": 409,
    "name": "Drain Punch",
    "type": "Fighting",
    "category": "Physical",
    "power": 75,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Drains half the damage inflicted to heal the user."
  },
  "vacuum-wave": {
    "id": 410,
    "name": "Vacuum Wave",
    "type": "Fighting",
    "category": "Special",
    "power": 40,
    "accuracy": 100,
    "pp": 30,
    "priority": 1,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "focus-blast": {
    "id": 411,
    "name": "Focus Blast",
    "type": "Fighting",
    "category": "Special",
    "power": 120,
    "accuracy": 70,
    "pp": 5,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to lower the target’s Special Defense by one stage."
  },
  "energy-ball": {
    "id": 412,
    "name": "Energy Ball",
    "type": "Grass",
    "category": "Special",
    "power": 90,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to lower the target’s Special Defense by one stage."
  },
  "brave-bird": {
    "id": 413,
    "name": "Brave Bird",
    "type": "Flying",
    "category": "Physical",
    "power": 120,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "User receives 1/3 the damage inflicted in recoil."
  },
  "earth-power": {
    "id": 414,
    "name": "Earth Power",
    "type": "Ground",
    "category": "Special",
    "power": 90,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to lower the target’s Special Defense by one stage."
  },
  "switcheroo": {
    "id": 415,
    "name": "Switcheroo",
    "type": "Dark",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "User and target swap items.",
    "statChanges": []
  },
  "giga-impact": {
    "id": 416,
    "name": "Giga Impact",
    "type": "Normal",
    "category": "Physical",
    "power": 150,
    "accuracy": 90,
    "pp": 5,
    "priority": 0,
    "effect": "User foregoes its next turn to recharge."
  },
  "nasty-plot": {
    "id": 417,
    "name": "Nasty Plot",
    "type": "Dark",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Raises the user’s Special Attack by two stages.",
    "statChanges": [
      {
        "stat": "spAtk",
        "change": 2
      }
    ],
    "target": "user"
  },
  "bullet-punch": {
    "id": 418,
    "name": "Bullet Punch",
    "type": "Steel",
    "category": "Physical",
    "power": 40,
    "accuracy": 100,
    "pp": 30,
    "priority": 1,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "avalanche": {
    "id": 419,
    "name": "Avalanche",
    "type": "Ice",
    "category": "Physical",
    "power": 60,
    "accuracy": 100,
    "pp": 10,
    "priority": -4,
    "effect": "Inflicts double damage if the user takes damage before attacking this turn."
  },
  "ice-shard": {
    "id": 420,
    "name": "Ice Shard",
    "type": "Ice",
    "category": "Physical",
    "power": 40,
    "accuracy": 100,
    "pp": 30,
    "priority": 1,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "shadow-claw": {
    "id": 421,
    "name": "Shadow Claw",
    "type": "Ghost",
    "category": "Physical",
    "power": 70,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "Has an increased chance for a critical hit."
  },
  "thunder-fang": {
    "id": 422,
    "name": "Thunder Fang",
    "type": "Electric",
    "category": "Physical",
    "power": 65,
    "accuracy": 95,
    "pp": 15,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to paralyze the target and a $effect_chance% chance to make the target flinch."
  },
  "ice-fang": {
    "id": 423,
    "name": "Ice Fang",
    "type": "Ice",
    "category": "Physical",
    "power": 65,
    "accuracy": 95,
    "pp": 15,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to freeze the target and a $effect_chance% chance to make the target flinch."
  },
  "fire-fang": {
    "id": 424,
    "name": "Fire Fang",
    "type": "Fire",
    "category": "Physical",
    "power": 65,
    "accuracy": 95,
    "pp": 15,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to burn the target and a $effect_chance% chance to make the target flinch."
  },
  "shadow-sneak": {
    "id": 425,
    "name": "Shadow Sneak",
    "type": "Ghost",
    "category": "Physical",
    "power": 40,
    "accuracy": 100,
    "pp": 30,
    "priority": 1,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "mud-bomb": {
    "id": 426,
    "name": "Mud Bomb",
    "type": "Ground",
    "category": "Special",
    "power": 65,
    "accuracy": 85,
    "pp": 10,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to lower the target’s accuracy by one stage."
  },
  "psycho-cut": {
    "id": 427,
    "name": "Psycho Cut",
    "type": "Psychic",
    "category": "Physical",
    "power": 70,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Has an increased chance for a critical hit."
  },
  "zen-headbutt": {
    "id": 428,
    "name": "Zen Headbutt",
    "type": "Psychic",
    "category": "Physical",
    "power": 80,
    "accuracy": 90,
    "pp": 15,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to make the target flinch."
  },
  "mirror-shot": {
    "id": 429,
    "name": "Mirror Shot",
    "type": "Steel",
    "category": "Special",
    "power": 65,
    "accuracy": 85,
    "pp": 10,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to lower the target’s accuracy by one stage."
  },
  "flash-cannon": {
    "id": 430,
    "name": "Flash Cannon",
    "type": "Steel",
    "category": "Special",
    "power": 80,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to lower the target’s Special Defense by one stage."
  },
  "rock-climb": {
    "id": 431,
    "name": "Rock Climb",
    "type": "Normal",
    "category": "Physical",
    "power": 90,
    "accuracy": 85,
    "pp": 20,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to confuse the target."
  },
  "defog": {
    "id": 432,
    "name": "Defog",
    "type": "Flying",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "Lowers the target’s evasion by one stage.  Removes field effects from the enemy field.",
    "statChanges": [
      {
        "stat": "evasion",
        "change": -1
      }
    ],
    "target": "enemy"
  },
  "trick-room": {
    "id": 433,
    "name": "Trick Room",
    "type": "Psychic",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 5,
    "priority": -7,
    "effect": "For five turns, slower Pokémon will act before faster Pokémon.",
    "statChanges": []
  },
  "draco-meteor": {
    "id": 434,
    "name": "Draco Meteor",
    "type": "Dragon",
    "category": "Special",
    "power": 130,
    "accuracy": 90,
    "pp": 5,
    "priority": 0,
    "effect": "Lowers the user’s Special Attack by two stages after inflicting damage."
  },
  "discharge": {
    "id": 435,
    "name": "Discharge",
    "type": "Electric",
    "category": "Special",
    "power": 80,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to paralyze the target."
  },
  "lava-plume": {
    "id": 436,
    "name": "Lava Plume",
    "type": "Fire",
    "category": "Special",
    "power": 80,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to burn the target."
  },
  "leaf-storm": {
    "id": 437,
    "name": "Leaf Storm",
    "type": "Grass",
    "category": "Special",
    "power": 130,
    "accuracy": 90,
    "pp": 5,
    "priority": 0,
    "effect": "Lowers the user’s Special Attack by two stages after inflicting damage."
  },
  "power-whip": {
    "id": 438,
    "name": "Power Whip",
    "type": "Grass",
    "category": "Physical",
    "power": 120,
    "accuracy": 85,
    "pp": 10,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "rock-wrecker": {
    "id": 439,
    "name": "Rock Wrecker",
    "type": "Rock",
    "category": "Physical",
    "power": 150,
    "accuracy": 90,
    "pp": 5,
    "priority": 0,
    "effect": "User foregoes its next turn to recharge."
  },
  "cross-poison": {
    "id": 440,
    "name": "Cross Poison",
    "type": "Poison",
    "category": "Physical",
    "power": 70,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Has an increased chance for a critical hit and a $effect_chance% chance to poison the target."
  },
  "gunk-shot": {
    "id": 441,
    "name": "Gunk Shot",
    "type": "Poison",
    "category": "Physical",
    "power": 120,
    "accuracy": 80,
    "pp": 5,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to poison the target."
  },
  "iron-head": {
    "id": 442,
    "name": "Iron Head",
    "type": "Steel",
    "category": "Physical",
    "power": 80,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to make the target flinch."
  },
  "magnet-bomb": {
    "id": 443,
    "name": "Magnet Bomb",
    "type": "Steel",
    "category": "Physical",
    "power": 60,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Never misses."
  },
  "stone-edge": {
    "id": 444,
    "name": "Stone Edge",
    "type": "Rock",
    "category": "Physical",
    "power": 100,
    "accuracy": 80,
    "pp": 5,
    "priority": 0,
    "effect": "Has an increased chance for a critical hit."
  },
  "captivate": {
    "id": 445,
    "name": "Captivate",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Lowers the target’s Special Attack by two stages if it’s the opposite gender.",
    "statChanges": [
      {
        "stat": "spAtk",
        "change": -2
      }
    ],
    "target": "user"
  },
  "stealth-rock": {
    "id": 446,
    "name": "Stealth Rock",
    "type": "Rock",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Causes damage when opposing Pokémon switch in.",
    "statChanges": []
  },
  "grass-knot": {
    "id": 447,
    "name": "Grass Knot",
    "type": "Grass",
    "category": "Special",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Inflicts more damage to heavier targets, with a maximum of 120 power."
  },
  "chatter": {
    "id": 448,
    "name": "Chatter",
    "type": "Flying",
    "category": "Special",
    "power": 65,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Has a higher chance to confuse the target when the recorded sound is louder."
  },
  "judgment": {
    "id": 449,
    "name": "Judgment",
    "type": "Normal",
    "category": "Special",
    "power": 100,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "If the user is holding a appropriate plate or drive, the damage inflicted will match it."
  },
  "bug-bite": {
    "id": 450,
    "name": "Bug Bite",
    "type": "Bug",
    "category": "Physical",
    "power": 60,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "If target has a berry, inflicts double damage and uses the berry."
  },
  "charge-beam": {
    "id": 451,
    "name": "Charge Beam",
    "type": "Electric",
    "category": "Special",
    "power": 50,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to raise the user’s Special Attack by one stage."
  },
  "wood-hammer": {
    "id": 452,
    "name": "Wood Hammer",
    "type": "Grass",
    "category": "Physical",
    "power": 120,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "User receives 1/3 the damage inflicted in recoil."
  },
  "aqua-jet": {
    "id": 453,
    "name": "Aqua Jet",
    "type": "Water",
    "category": "Physical",
    "power": 40,
    "accuracy": 100,
    "pp": 20,
    "priority": 1,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "attack-order": {
    "id": 454,
    "name": "Attack Order",
    "type": "Bug",
    "category": "Physical",
    "power": 90,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "Has an increased chance for a critical hit."
  },
  "defend-order": {
    "id": 455,
    "name": "Defend Order",
    "type": "Bug",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Raises the user’s Defense and Special Defense by one stage.",
    "statChanges": [
      {
        "stat": "defense",
        "change": 1
      },
      {
        "stat": "spDef",
        "change": 1
      }
    ],
    "target": "user"
  },
  "heal-order": {
    "id": 456,
    "name": "Heal Order",
    "type": "Bug",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Heals the user by half its max HP.",
    "statChanges": [],
    "target": "user"
  },
  "head-smash": {
    "id": 457,
    "name": "Head Smash",
    "type": "Rock",
    "category": "Physical",
    "power": 150,
    "accuracy": 80,
    "pp": 5,
    "priority": 0,
    "effect": "User receives 1/2 the damage inflicted in recoil."
  },
  "double-hit": {
    "id": 458,
    "name": "Double Hit",
    "type": "Normal",
    "category": "Physical",
    "power": 35,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "effect": "Hits twice in one turn."
  },
  "roar-of-time": {
    "id": 459,
    "name": "Roar of Time",
    "type": "Dragon",
    "category": "Special",
    "power": 150,
    "accuracy": 90,
    "pp": 5,
    "priority": 0,
    "effect": "User foregoes its next turn to recharge."
  },
  "spacial-rend": {
    "id": 460,
    "name": "Spacial Rend",
    "type": "Dragon",
    "category": "Special",
    "power": 100,
    "accuracy": 95,
    "pp": 5,
    "priority": 0,
    "effect": "Has an increased chance for a critical hit."
  },
  "lunar-dance": {
    "id": 461,
    "name": "Lunar Dance",
    "type": "Psychic",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "User faints, and its replacement is fully healed.",
    "statChanges": []
  },
  "crush-grip": {
    "id": 462,
    "name": "Crush Grip",
    "type": "Normal",
    "category": "Physical",
    "power": 0,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": "Power increases against targets with more HP remaining, up to a maximum of 121 power."
  },
  "magma-storm": {
    "id": 463,
    "name": "Magma Storm",
    "type": "Fire",
    "category": "Special",
    "power": 100,
    "accuracy": 75,
    "pp": 5,
    "priority": 0,
    "effect": "Prevents the target from fleeing and inflicts damage for 2-5 turns."
  },
  "dark-void": {
    "id": 464,
    "name": "Dark Void",
    "type": "Dark",
    "category": "Status",
    "power": 0,
    "accuracy": 50,
    "pp": 10,
    "priority": 0,
    "effect": "Puts the target to sleep.",
    "statChanges": [],
    "target": "enemy"
  },
  "seed-flare": {
    "id": 465,
    "name": "Seed Flare",
    "type": "Grass",
    "category": "Special",
    "power": 120,
    "accuracy": 85,
    "pp": 5,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to lower the target’s Special Defense by two stages."
  },
  "ominous-wind": {
    "id": 466,
    "name": "Ominous Wind",
    "type": "Ghost",
    "category": "Special",
    "power": 60,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to raise all of the user’s stats by one stage."
  },
  "shadow-force": {
    "id": 467,
    "name": "Shadow Force",
    "type": "Ghost",
    "category": "Physical",
    "power": 120,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": "User vanishes, dodging all attacks, and hits next turn.  Hits through Protect and Detect."
  },
  "hone-claws": {
    "id": 468,
    "name": "Hone Claws",
    "type": "Dark",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "Raises the user’s Attack and accuracy by one stage.",
    "statChanges": [
      {
        "stat": "attack",
        "change": 1
      },
      {
        "stat": "accuracy",
        "change": 1
      }
    ],
    "target": "user"
  },
  "wide-guard": {
    "id": 469,
    "name": "Wide Guard",
    "type": "Rock",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 3,
    "effect": "Prevents any multi-target moves from hitting friendly Pokémon this turn.",
    "statChanges": []
  },
  "guard-split": {
    "id": 470,
    "name": "Guard Split",
    "type": "Psychic",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Averages Defense and Special Defense with the target.",
    "statChanges": []
  },
  "power-split": {
    "id": 471,
    "name": "Power Split",
    "type": "Psychic",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Averages Attack and Special Attack with the target.",
    "statChanges": []
  },
  "wonder-room": {
    "id": 472,
    "name": "Wonder Room",
    "type": "Psychic",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "All Pokémon’s Defense and Special Defense are swapped for 5 turns.",
    "statChanges": []
  },
  "psyshock": {
    "id": 473,
    "name": "Psyshock",
    "type": "Psychic",
    "category": "Special",
    "power": 80,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Inflicts damage based on the target’s Defense, not Special Defense."
  },
  "venoshock": {
    "id": 474,
    "name": "Venoshock",
    "type": "Poison",
    "category": "Special",
    "power": 65,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Inflicts double damage if the target is Poisoned."
  },
  "autotomize": {
    "id": 475,
    "name": "Autotomize",
    "type": "Steel",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "Raises the user’s Speed by two stages and halves the user’s weight.",
    "statChanges": [
      {
        "stat": "speed",
        "change": 2
      }
    ],
    "target": "user"
  },
  "rage-powder": {
    "id": 476,
    "name": "Rage Powder",
    "type": "Bug",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 2,
    "effect": "Redirects the target’s single-target effects to the user for this turn.",
    "statChanges": []
  },
  "telekinesis": {
    "id": 477,
    "name": "Telekinesis",
    "type": "Psychic",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "Moves have 100% accuracy against the target for three turns.",
    "statChanges": [],
    "target": "enemy"
  },
  "magic-room": {
    "id": 478,
    "name": "Magic Room",
    "type": "Psychic",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Negates held items for five turns.",
    "statChanges": []
  },
  "smack-down": {
    "id": 479,
    "name": "Smack Down",
    "type": "Rock",
    "category": "Physical",
    "power": 50,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "Removes any immunity to Ground damage."
  },
  "storm-throw": {
    "id": 480,
    "name": "Storm Throw",
    "type": "Fighting",
    "category": "Physical",
    "power": 60,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Always scores a critical hit."
  },
  "flame-burst": {
    "id": 481,
    "name": "Flame Burst",
    "type": "Fire",
    "category": "Special",
    "power": 70,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "Deals splash damage to Pokémon next to the target."
  },
  "sludge-wave": {
    "id": 482,
    "name": "Sludge Wave",
    "type": "Poison",
    "category": "Special",
    "power": 95,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to poison the target."
  },
  "quiver-dance": {
    "id": 483,
    "name": "Quiver Dance",
    "type": "Bug",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Raises the user’s Special Attack, Special Defense, and Speed by one stage each.",
    "statChanges": [
      {
        "stat": "spAtk",
        "change": 1
      },
      {
        "stat": "spDef",
        "change": 1
      },
      {
        "stat": "speed",
        "change": 1
      }
    ],
    "target": "user"
  },
  "heavy-slam": {
    "id": 484,
    "name": "Heavy Slam",
    "type": "Steel",
    "category": "Physical",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Power is higher when the user weighs more than the target, up to a maximum of 120."
  },
  "synchronoise": {
    "id": 485,
    "name": "Synchronoise",
    "type": "Psychic",
    "category": "Special",
    "power": 120,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Hits any Pokémon that shares a type with the user."
  },
  "electro-ball": {
    "id": 486,
    "name": "Electro Ball",
    "type": "Electric",
    "category": "Special",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Power is higher when the user has greater Speed than the target, up to a maximum of 150."
  },
  "soak": {
    "id": 487,
    "name": "Soak",
    "type": "Water",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Changes the target’s type to Water.",
    "statChanges": []
  },
  "flame-charge": {
    "id": 488,
    "name": "Flame Charge",
    "type": "Fire",
    "category": "Physical",
    "power": 50,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Inflicts regular damage.  Raises the user’s Speed by one stage."
  },
  "coil": {
    "id": 489,
    "name": "Coil",
    "type": "Poison",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Raises the user’s Attack, Defense, and accuracy by one stage each.",
    "statChanges": [
      {
        "stat": "attack",
        "change": 1
      },
      {
        "stat": "defense",
        "change": 1
      },
      {
        "stat": "accuracy",
        "change": 1
      }
    ],
    "target": "user"
  },
  "low-sweep": {
    "id": 490,
    "name": "Low Sweep",
    "type": "Fighting",
    "category": "Physical",
    "power": 65,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Lowers the target’s Speed by one stage."
  },
  "acid-spray": {
    "id": 491,
    "name": "Acid Spray",
    "type": "Poison",
    "category": "Special",
    "power": 40,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Lowers the target’s Special Defense by two stages."
  },
  "foul-play": {
    "id": 492,
    "name": "Foul Play",
    "type": "Dark",
    "category": "Physical",
    "power": 95,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "Calculates damage with the target’s attacking stat."
  },
  "simple-beam": {
    "id": 493,
    "name": "Simple Beam",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "Changes the target’s ability to Simple.",
    "statChanges": []
  },
  "entrainment": {
    "id": 494,
    "name": "Entrainment",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "Copies the user’s ability onto the target.",
    "statChanges": []
  },
  "after-you": {
    "id": 495,
    "name": "After You",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "Makes the target act next this turn.",
    "statChanges": []
  },
  "round": {
    "id": 496,
    "name": "Round",
    "type": "Normal",
    "category": "Special",
    "power": 60,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "Has double power if it’s used more than once per turn."
  },
  "echoed-voice": {
    "id": 497,
    "name": "Echoed Voice",
    "type": "Normal",
    "category": "Special",
    "power": 40,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "Power increases by 100% for each consecutive use by any friendly Pokémon, to a maximum of 200."
  },
  "chip-away": {
    "id": 498,
    "name": "Chip Away",
    "type": "Normal",
    "category": "Physical",
    "power": 70,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Ignores the target’s stat modifiers."
  },
  "clear-smog": {
    "id": 499,
    "name": "Clear Smog",
    "type": "Poison",
    "category": "Special",
    "power": 50,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "Removes all of the target’s stat modifiers."
  },
  "stored-power": {
    "id": 500,
    "name": "Stored Power",
    "type": "Psychic",
    "category": "Special",
    "power": 20,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Power is higher the more the user’s stats have been raised, to a maximum of 31×."
  },
  "quick-guard": {
    "id": 501,
    "name": "Quick Guard",
    "type": "Fighting",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 3,
    "effect": "Prevents any priority moves from hitting friendly Pokémon this turn.",
    "statChanges": []
  },
  "ally-switch": {
    "id": 502,
    "name": "Ally Switch",
    "type": "Psychic",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 2,
    "effect": "User switches places with the friendly Pokémon opposite it.",
    "statChanges": []
  },
  "scald": {
    "id": 503,
    "name": "Scald",
    "type": "Water",
    "category": "Special",
    "power": 80,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to burn the target."
  },
  "shell-smash": {
    "id": 504,
    "name": "Shell Smash",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "Raises user’s Attack, Special Attack, and Speed by two stages.  Lower user’s Defense and Special Defense by one stage.",
    "statChanges": [
      {
        "stat": "defense",
        "change": -1
      },
      {
        "stat": "spDef",
        "change": -1
      },
      {
        "stat": "attack",
        "change": 2
      },
      {
        "stat": "spAtk",
        "change": 2
      },
      {
        "stat": "speed",
        "change": 2
      }
    ],
    "target": "enemy"
  },
  "heal-pulse": {
    "id": 505,
    "name": "Heal Pulse",
    "type": "Psychic",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Heals the target for half its max HP.",
    "statChanges": [],
    "target": "user"
  },
  "hex": {
    "id": 506,
    "name": "Hex",
    "type": "Ghost",
    "category": "Special",
    "power": 65,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Has double power if the target has a major status ailment."
  },
  "sky-drop": {
    "id": 507,
    "name": "Sky Drop",
    "type": "Flying",
    "category": "Physical",
    "power": 60,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Carries the target high into the air, dodging all attacks against either, and drops it next turn."
  },
  "shift-gear": {
    "id": 508,
    "name": "Shift Gear",
    "type": "Steel",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Raises the user’s Attack by one stage and its Speed by two stages.",
    "statChanges": [
      {
        "stat": "attack",
        "change": 1
      },
      {
        "stat": "speed",
        "change": 2
      }
    ],
    "target": "user"
  },
  "circle-throw": {
    "id": 509,
    "name": "Circle Throw",
    "type": "Fighting",
    "category": "Physical",
    "power": 60,
    "accuracy": 90,
    "pp": 10,
    "priority": -6,
    "effect": "Ends wild battles.  Forces trainers to switch Pokémon."
  },
  "incinerate": {
    "id": 510,
    "name": "Incinerate",
    "type": "Fire",
    "category": "Special",
    "power": 60,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "Destroys the target’s held berry."
  },
  "quash": {
    "id": 511,
    "name": "Quash",
    "type": "Dark",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "Makes the target act last this turn.",
    "statChanges": []
  },
  "acrobatics": {
    "id": 512,
    "name": "Acrobatics",
    "type": "Flying",
    "category": "Physical",
    "power": 55,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "Has double power if the user has no held item."
  },
  "reflect-type": {
    "id": 513,
    "name": "Reflect Type",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "User becomes the target’s type.",
    "statChanges": []
  },
  "retaliate": {
    "id": 514,
    "name": "Retaliate",
    "type": "Normal",
    "category": "Physical",
    "power": 70,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": "Has double power if a friendly Pokémon fainted last turn."
  },
  "final-gambit": {
    "id": 515,
    "name": "Final Gambit",
    "type": "Fighting",
    "category": "Special",
    "power": 0,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": "Inflicts damage equal to the user’s remaining HP.  User faints."
  },
  "bestow": {
    "id": 516,
    "name": "Bestow",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "Gives the user’s held item to the target.",
    "statChanges": []
  },
  "inferno": {
    "id": 517,
    "name": "Inferno",
    "type": "Fire",
    "category": "Special",
    "power": 100,
    "accuracy": 50,
    "pp": 5,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to burn the target."
  },
  "water-pledge": {
    "id": 518,
    "name": "Water Pledge",
    "type": "Water",
    "category": "Special",
    "power": 80,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "With Grass Pledge, halves opposing Pokémon’s Speed for four turns."
  },
  "fire-pledge": {
    "id": 519,
    "name": "Fire Pledge",
    "type": "Fire",
    "category": "Special",
    "power": 80,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "With Water Pledge, doubles the effect chance of friendly Pokémon’s moves for four turns."
  },
  "grass-pledge": {
    "id": 520,
    "name": "Grass Pledge",
    "type": "Grass",
    "category": "Special",
    "power": 80,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "With Fire Pledge, damages opposing Pokémon for 1/8 their max HP every turn for four turns."
  },
  "volt-switch": {
    "id": 521,
    "name": "Volt Switch",
    "type": "Electric",
    "category": "Special",
    "power": 70,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "User must switch out after attacking."
  },
  "struggle-bug": {
    "id": 522,
    "name": "Struggle Bug",
    "type": "Bug",
    "category": "Special",
    "power": 50,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to lower the target’s Special Attack by one stage."
  },
  "bulldoze": {
    "id": 523,
    "name": "Bulldoze",
    "type": "Ground",
    "category": "Physical",
    "power": 60,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to lower the target’s Speed by one stage."
  },
  "frost-breath": {
    "id": 524,
    "name": "Frost Breath",
    "type": "Ice",
    "category": "Special",
    "power": 60,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "effect": "Always scores a critical hit."
  },
  "dragon-tail": {
    "id": 525,
    "name": "Dragon Tail",
    "type": "Dragon",
    "category": "Physical",
    "power": 60,
    "accuracy": 90,
    "pp": 10,
    "priority": -6,
    "effect": "Ends wild battles.  Forces trainers to switch Pokémon."
  },
  "work-up": {
    "id": 526,
    "name": "Work Up",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 30,
    "priority": 0,
    "effect": "Raises the user’s Attack and Special Attack by one stage each.",
    "statChanges": [
      {
        "stat": "attack",
        "change": 1
      },
      {
        "stat": "spAtk",
        "change": 1
      }
    ],
    "target": "user"
  },
  "electroweb": {
    "id": 527,
    "name": "Electroweb",
    "type": "Electric",
    "category": "Special",
    "power": 55,
    "accuracy": 95,
    "pp": 15,
    "priority": 0,
    "effect": "Lowers the target’s Speed by one stage."
  },
  "wild-charge": {
    "id": 528,
    "name": "Wild Charge",
    "type": "Electric",
    "category": "Physical",
    "power": 90,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "User receives 1/4 the damage it inflicts in recoil."
  },
  "drill-run": {
    "id": 529,
    "name": "Drill Run",
    "type": "Ground",
    "category": "Physical",
    "power": 80,
    "accuracy": 95,
    "pp": 10,
    "priority": 0,
    "effect": "Has an increased chance for a critical hit."
  },
  "dual-chop": {
    "id": 530,
    "name": "Dual Chop",
    "type": "Dragon",
    "category": "Physical",
    "power": 40,
    "accuracy": 90,
    "pp": 15,
    "priority": 0,
    "effect": "Hits twice in one turn."
  },
  "heart-stamp": {
    "id": 531,
    "name": "Heart Stamp",
    "type": "Psychic",
    "category": "Physical",
    "power": 60,
    "accuracy": 100,
    "pp": 25,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to make the target flinch."
  },
  "horn-leech": {
    "id": 532,
    "name": "Horn Leech",
    "type": "Grass",
    "category": "Physical",
    "power": 75,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Drains half the damage inflicted to heal the user."
  },
  "sacred-sword": {
    "id": 533,
    "name": "Sacred Sword",
    "type": "Fighting",
    "category": "Physical",
    "power": 90,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "Ignores the target’s stat modifiers."
  },
  "razor-shell": {
    "id": 534,
    "name": "Razor Shell",
    "type": "Water",
    "category": "Physical",
    "power": 75,
    "accuracy": 95,
    "pp": 10,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to lower the target’s Defense by one stage."
  },
  "heat-crash": {
    "id": 535,
    "name": "Heat Crash",
    "type": "Fire",
    "category": "Physical",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Power is higher when the user weighs more than the target, up to a maximum of 120."
  },
  "leaf-tornado": {
    "id": 536,
    "name": "Leaf Tornado",
    "type": "Grass",
    "category": "Special",
    "power": 65,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to lower the target’s accuracy by one stage."
  },
  "steamroller": {
    "id": 537,
    "name": "Steamroller",
    "type": "Bug",
    "category": "Physical",
    "power": 65,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to make the target flinch."
  },
  "cotton-guard": {
    "id": 538,
    "name": "Cotton Guard",
    "type": "Grass",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Raises the user’s Defense by three stages.",
    "statChanges": [
      {
        "stat": "defense",
        "change": 3
      }
    ],
    "target": "user"
  },
  "night-daze": {
    "id": 539,
    "name": "Night Daze",
    "type": "Dark",
    "category": "Special",
    "power": 85,
    "accuracy": 95,
    "pp": 10,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to lower the target’s accuracy by one stage."
  },
  "psystrike": {
    "id": 540,
    "name": "Psystrike",
    "type": "Psychic",
    "category": "Special",
    "power": 100,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Inflicts damage based on the target’s Defense, not Special Defense."
  },
  "tail-slap": {
    "id": 541,
    "name": "Tail Slap",
    "type": "Normal",
    "category": "Physical",
    "power": 25,
    "accuracy": 85,
    "pp": 10,
    "priority": 0,
    "effect": "Hits 2-5 times in one turn."
  },
  "hurricane": {
    "id": 542,
    "name": "Hurricane",
    "type": "Flying",
    "category": "Special",
    "power": 110,
    "accuracy": 70,
    "pp": 10,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to confuse the target."
  },
  "head-charge": {
    "id": 543,
    "name": "Head Charge",
    "type": "Normal",
    "category": "Physical",
    "power": 120,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "User receives 1/4 the damage it inflicts in recoil."
  },
  "gear-grind": {
    "id": 544,
    "name": "Gear Grind",
    "type": "Steel",
    "category": "Physical",
    "power": 50,
    "accuracy": 85,
    "pp": 15,
    "priority": 0,
    "effect": "Hits twice in one turn."
  },
  "searing-shot": {
    "id": 545,
    "name": "Searing Shot",
    "type": "Fire",
    "category": "Special",
    "power": 100,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to burn the target."
  },
  "techno-blast": {
    "id": 546,
    "name": "Techno Blast",
    "type": "Normal",
    "category": "Special",
    "power": 120,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": "If the user is holding a appropriate plate or drive, the damage inflicted will match it."
  },
  "relic-song": {
    "id": 547,
    "name": "Relic Song",
    "type": "Normal",
    "category": "Special",
    "power": 75,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to put the target to sleep."
  },
  "secret-sword": {
    "id": 548,
    "name": "Secret Sword",
    "type": "Fighting",
    "category": "Special",
    "power": 85,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Inflicts damage based on the target’s Defense, not Special Defense."
  },
  "glaciate": {
    "id": 549,
    "name": "Glaciate",
    "type": "Ice",
    "category": "Special",
    "power": 65,
    "accuracy": 95,
    "pp": 10,
    "priority": 0,
    "effect": "Lowers the target’s Speed by one stage."
  },
  "bolt-strike": {
    "id": 550,
    "name": "Bolt Strike",
    "type": "Electric",
    "category": "Physical",
    "power": 130,
    "accuracy": 85,
    "pp": 5,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to paralyze the target."
  },
  "blue-flare": {
    "id": 551,
    "name": "Blue Flare",
    "type": "Fire",
    "category": "Special",
    "power": 130,
    "accuracy": 85,
    "pp": 5,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to burn the target."
  },
  "fiery-dance": {
    "id": 552,
    "name": "Fiery Dance",
    "type": "Fire",
    "category": "Special",
    "power": 80,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to raise the user’s Special Attack by one stage."
  },
  "freeze-shock": {
    "id": 553,
    "name": "Freeze Shock",
    "type": "Ice",
    "category": "Physical",
    "power": 140,
    "accuracy": 90,
    "pp": 5,
    "priority": 0,
    "effect": "Requires a turn to charge before attacking.  Has a $effect_chance% chance to paralyze the target."
  },
  "ice-burn": {
    "id": 554,
    "name": "Ice Burn",
    "type": "Ice",
    "category": "Special",
    "power": 140,
    "accuracy": 90,
    "pp": 5,
    "priority": 0,
    "effect": "Requires a turn to charge before attacking.  Has a $effect_chance% chance to burn the target."
  },
  "snarl": {
    "id": 555,
    "name": "Snarl",
    "type": "Dark",
    "category": "Special",
    "power": 55,
    "accuracy": 95,
    "pp": 15,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to lower the target’s Special Attack by one stage."
  },
  "icicle-crash": {
    "id": 556,
    "name": "Icicle Crash",
    "type": "Ice",
    "category": "Physical",
    "power": 85,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to make the target flinch."
  },
  "v-create": {
    "id": 557,
    "name": "V-create",
    "type": "Fire",
    "category": "Physical",
    "power": 180,
    "accuracy": 95,
    "pp": 5,
    "priority": 0,
    "effect": "Lowers the user’s Defense, Special Defense, and Speed by one stage each."
  },
  "fusion-flare": {
    "id": 558,
    "name": "Fusion Flare",
    "type": "Fire",
    "category": "Special",
    "power": 100,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": "With Fusion Bolt, inflicts double damage."
  },
  "fusion-bolt": {
    "id": 559,
    "name": "Fusion Bolt",
    "type": "Electric",
    "category": "Physical",
    "power": 100,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": "With Fusion Flare, inflicts double damage."
  },
  "flying-press": {
    "id": 560,
    "name": "Flying Press",
    "type": "Fighting",
    "category": "Physical",
    "power": 100,
    "accuracy": 95,
    "pp": 10,
    "priority": 0,
    "effect": "Deals both fighting and flying-type damage."
  },
  "mat-block": {
    "id": 561,
    "name": "Mat Block",
    "type": "Fighting",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Protects all friendly Pokémon from damaging moves.  Only works on the first turn after the user is sent out.",
    "statChanges": []
  },
  "belch": {
    "id": 562,
    "name": "Belch",
    "type": "Poison",
    "category": "Special",
    "power": 120,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "effect": "Can only be used after the user has eaten a berry."
  },
  "rototiller": {
    "id": 563,
    "name": "Rototiller",
    "type": "Ground",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Raises the Attack and Special Attack of all grass Pokémon in battle.",
    "statChanges": [
      {
        "stat": "attack",
        "change": 1
      },
      {
        "stat": "spAtk",
        "change": 1
      }
    ],
    "target": "user"
  },
  "sticky-web": {
    "id": 564,
    "name": "Sticky Web",
    "type": "Bug",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Covers the opposing field, lowering opponents’ Speed by one stage upon switching in.",
    "statChanges": []
  },
  "fell-stinger": {
    "id": 565,
    "name": "Fell Stinger",
    "type": "Bug",
    "category": "Physical",
    "power": 50,
    "accuracy": 100,
    "pp": 25,
    "priority": 0,
    "effect": "Raises the user’s Attack by two stages if it KOs the target."
  },
  "phantom-force": {
    "id": 566,
    "name": "Phantom Force",
    "type": "Ghost",
    "category": "Physical",
    "power": 90,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "User vanishes, dodging all attacks, and hits next turn.  Hits through Protect and Detect."
  },
  "trick-or-treat": {
    "id": 567,
    "name": "Trick-or-Treat",
    "type": "Ghost",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Adds ghost to the target’s types.",
    "statChanges": []
  },
  "noble-roar": {
    "id": 568,
    "name": "Noble Roar",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 30,
    "priority": 0,
    "effect": "Lowers the target’s Attack and Special Attack by one stage.",
    "statChanges": [
      {
        "stat": "attack",
        "change": -1
      },
      {
        "stat": "spAtk",
        "change": -1
      }
    ],
    "target": "user"
  },
  "ion-deluge": {
    "id": 569,
    "name": "Ion Deluge",
    "type": "Electric",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 25,
    "priority": 1,
    "effect": "Changes all normal moves to electric moves for the rest of the turn.",
    "statChanges": []
  },
  "parabolic-charge": {
    "id": 570,
    "name": "Parabolic Charge",
    "type": "Electric",
    "category": "Special",
    "power": 65,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Heals the user for half the total damage dealt to all targets."
  },
  "forests-curse": {
    "id": 571,
    "name": "Forest’s Curse",
    "type": "Grass",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Adds grass to the target’s types.",
    "statChanges": []
  },
  "petal-blizzard": {
    "id": 572,
    "name": "Petal Blizzard",
    "type": "Grass",
    "category": "Physical",
    "power": 90,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "Inflicts regular damage."
  },
  "freeze-dry": {
    "id": 573,
    "name": "Freeze-Dry",
    "type": "Ice",
    "category": "Special",
    "power": 70,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Super-effective against water."
  },
  "disarming-voice": {
    "id": 574,
    "name": "Disarming Voice",
    "type": "Fairy",
    "category": "Special",
    "power": 40,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "Never misses."
  },
  "parting-shot": {
    "id": 575,
    "name": "Parting Shot",
    "type": "Dark",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Lowers all targets’ Attack and Special Attack by one stage.  Makes the user switch out.",
    "statChanges": [
      {
        "stat": "attack",
        "change": -1
      },
      {
        "stat": "spAtk",
        "change": -1
      }
    ],
    "target": "user"
  },
  "topsy-turvy": {
    "id": 576,
    "name": "Topsy-Turvy",
    "type": "Dark",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Inverts the target’s stat modifiers.",
    "statChanges": []
  },
  "draining-kiss": {
    "id": 577,
    "name": "Draining Kiss",
    "type": "Fairy",
    "category": "Special",
    "power": 50,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Drains 75% of the damage inflicted to heal the user."
  },
  "crafty-shield": {
    "id": 578,
    "name": "Crafty Shield",
    "type": "Fairy",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 3,
    "effect": "Protects all friendly Pokémon from non-damaging moves.",
    "statChanges": []
  },
  "flower-shield": {
    "id": 579,
    "name": "Flower Shield",
    "type": "Fairy",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Raises the Defense of all grass Pokémon in battle.",
    "statChanges": [
      {
        "stat": "defense",
        "change": 1
      }
    ],
    "target": "user"
  },
  "grassy-terrain": {
    "id": 580,
    "name": "Grassy Terrain",
    "type": "Grass",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "For five turns, heals all Pokémon on the ground for 1/16 max HP each turn and strengthens their grass moves to 1.5× their power.",
    "statChanges": []
  },
  "misty-terrain": {
    "id": 581,
    "name": "Misty Terrain",
    "type": "Fairy",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "For five turns, protects all Pokémon on the ground from major status ailments and confusion, and halves the power of incoming dragon moves.",
    "statChanges": []
  },
  "electrify": {
    "id": 582,
    "name": "Electrify",
    "type": "Electric",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Changes the target’s move’s type to electric if it hasn’t moved yet this turn.",
    "statChanges": []
  },
  "play-rough": {
    "id": 583,
    "name": "Play Rough",
    "type": "Fairy",
    "category": "Physical",
    "power": 90,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to lower the target’s Attack by one stage."
  },
  "fairy-wind": {
    "id": 584,
    "name": "Fairy Wind",
    "type": "Fairy",
    "category": "Special",
    "power": 40,
    "accuracy": 100,
    "pp": 30,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "moonblast": {
    "id": 585,
    "name": "Moonblast",
    "type": "Fairy",
    "category": "Special",
    "power": 95,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to lower the target’s Special Attack by one stage."
  },
  "boomburst": {
    "id": 586,
    "name": "Boomburst",
    "type": "Normal",
    "category": "Special",
    "power": 140,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Inflicts regular damage."
  },
  "fairy-lock": {
    "id": 587,
    "name": "Fairy Lock",
    "type": "Fairy",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Prevents all Pokémon from fleeing or switching out during the next turn.",
    "statChanges": []
  },
  "kings-shield": {
    "id": 588,
    "name": "King’s Shield",
    "type": "Steel",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 4,
    "effect": "Blocks damaging attacks and lowers attacking Pokémon’s Attack by two stages on contact.  Switches Aegislash to Shield Forme.",
    "statChanges": []
  },
  "play-nice": {
    "id": 589,
    "name": "Play Nice",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Lowers the target’s Attack by one stage.",
    "statChanges": [
      {
        "stat": "attack",
        "change": -1
      }
    ],
    "target": "user"
  },
  "confide": {
    "id": 590,
    "name": "Confide",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Lowers the target’s Special Attack by one stage.",
    "statChanges": [
      {
        "stat": "spAtk",
        "change": -1
      }
    ],
    "target": "user"
  },
  "diamond-storm": {
    "id": 591,
    "name": "Diamond Storm",
    "type": "Rock",
    "category": "Physical",
    "power": 100,
    "accuracy": 95,
    "pp": 5,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to raise the user’s Defense by two stages for each target hit."
  },
  "steam-eruption": {
    "id": 592,
    "name": "Steam Eruption",
    "type": "Water",
    "category": "Special",
    "power": 110,
    "accuracy": 95,
    "pp": 5,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to burn the target."
  },
  "hyperspace-hole": {
    "id": 593,
    "name": "Hyperspace Hole",
    "type": "Psychic",
    "category": "Special",
    "power": 80,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": "Ignores and destroys protection effects."
  },
  "water-shuriken": {
    "id": 594,
    "name": "Water Shuriken",
    "type": "Water",
    "category": "Special",
    "power": 15,
    "accuracy": 100,
    "pp": 20,
    "priority": 1,
    "effect": "Hits 2–5 times."
  },
  "mystical-fire": {
    "id": 595,
    "name": "Mystical Fire",
    "type": "Fire",
    "category": "Special",
    "power": 75,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to lower the target’s Special Attack by one stage."
  },
  "spiky-shield": {
    "id": 596,
    "name": "Spiky Shield",
    "type": "Grass",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 4,
    "effect": "Blocks damaging attacks and damages attacking Pokémon for 1/8 their max HP.",
    "statChanges": []
  },
  "aromatic-mist": {
    "id": 597,
    "name": "Aromatic Mist",
    "type": "Fairy",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Raises a selected ally’s Special Defense by one stage.",
    "statChanges": [
      {
        "stat": "spDef",
        "change": 1
      }
    ],
    "target": "user"
  },
  "eerie-impulse": {
    "id": 598,
    "name": "Eerie Impulse",
    "type": "Electric",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "Lowers the target’s Special Attack by two stages.",
    "statChanges": [
      {
        "stat": "spAtk",
        "change": -2
      }
    ],
    "target": "user"
  },
  "venom-drench": {
    "id": 599,
    "name": "Venom Drench",
    "type": "Poison",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Lowers the target’s Attack, Special Attack, and Speed by one stage if it is poisoned.",
    "statChanges": [
      {
        "stat": "attack",
        "change": -1
      },
      {
        "stat": "spAtk",
        "change": -1
      },
      {
        "stat": "speed",
        "change": -1
      }
    ],
    "target": "user"
  },
  "powder": {
    "id": 600,
    "name": "Powder",
    "type": "Bug",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 1,
    "effect": "Explodes if the target uses a fire move this turn, damaging it for 1/4 its max HP and preventing the move.",
    "statChanges": []
  },
  "geomancy": {
    "id": 601,
    "name": "Geomancy",
    "type": "Fairy",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Takes one turn to charge, then raises the user’s Special Attack, Special Defense, and Speed by two stages.",
    "statChanges": [
      {
        "stat": "spAtk",
        "change": 2
      },
      {
        "stat": "spDef",
        "change": 2
      },
      {
        "stat": "speed",
        "change": 2
      }
    ],
    "target": "user"
  },
  "magnetic-flux": {
    "id": 602,
    "name": "Magnetic Flux",
    "type": "Electric",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Raises the Defense and Special Defense of all friendly Pokémon with plus or minus by one stage.",
    "statChanges": [
      {
        "stat": "defense",
        "change": 1
      },
      {
        "stat": "spDef",
        "change": 1
      }
    ],
    "target": "user"
  },
  "happy-hour": {
    "id": 603,
    "name": "Happy Hour",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 30,
    "priority": 0,
    "effect": "Doubles prize money.",
    "statChanges": []
  },
  "electric-terrain": {
    "id": 604,
    "name": "Electric Terrain",
    "type": "Electric",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "For five turns, prevents all Pokémon on the ground from sleeping and strengthens their electric moves to 1.5× their power.",
    "statChanges": []
  },
  "dazzling-gleam": {
    "id": 605,
    "name": "Dazzling Gleam",
    "type": "Fairy",
    "category": "Special",
    "power": 80,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "celebrate": {
    "id": 606,
    "name": "Celebrate",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 40,
    "priority": 0,
    "effect": "Does nothing.",
    "statChanges": []
  },
  "hold-hands": {
    "id": 607,
    "name": "Hold Hands",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 40,
    "priority": 0,
    "effect": "Does nothing.",
    "statChanges": []
  },
  "baby-doll-eyes": {
    "id": 608,
    "name": "Baby-Doll Eyes",
    "type": "Fairy",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 30,
    "priority": 1,
    "effect": "Lowers the target’s Attack by one stage.",
    "statChanges": [
      {
        "stat": "attack",
        "change": -1
      }
    ],
    "target": "user"
  },
  "nuzzle": {
    "id": 609,
    "name": "Nuzzle",
    "type": "Electric",
    "category": "Physical",
    "power": 20,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to paralyze the target."
  },
  "hold-back": {
    "id": 610,
    "name": "Hold Back",
    "type": "Normal",
    "category": "Physical",
    "power": 40,
    "accuracy": 100,
    "pp": 40,
    "priority": 0,
    "effect": "Cannot lower the target’s HP below 1."
  },
  "infestation": {
    "id": 611,
    "name": "Infestation",
    "type": "Bug",
    "category": "Special",
    "power": 20,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Prevents the target from fleeing and inflicts damage for 2-5 turns."
  },
  "power-up-punch": {
    "id": 612,
    "name": "Power-Up Punch",
    "type": "Fighting",
    "category": "Physical",
    "power": 40,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Raises the user’s Attack by one stage after inflicting damage."
  },
  "oblivion-wing": {
    "id": 613,
    "name": "Oblivion Wing",
    "type": "Flying",
    "category": "Special",
    "power": 80,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Drains 75% of the damage inflicted to heal the user."
  },
  "thousand-arrows": {
    "id": 614,
    "name": "Thousand Arrows",
    "type": "Ground",
    "category": "Physical",
    "power": 90,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Grounds the target, and hits even Flying-type or levitating Pokémon."
  },
  "thousand-waves": {
    "id": 615,
    "name": "Thousand Waves",
    "type": "Ground",
    "category": "Physical",
    "power": 90,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Prevents the target from leaving battle."
  },
  "lands-wrath": {
    "id": 616,
    "name": "Land’s Wrath",
    "type": "Ground",
    "category": "Physical",
    "power": 90,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "light-of-ruin": {
    "id": 617,
    "name": "Light of Ruin",
    "type": "Fairy",
    "category": "Special",
    "power": 140,
    "accuracy": 90,
    "pp": 5,
    "priority": 0,
    "effect": "User receives 1/2 the damage inflicted in recoil."
  },
  "origin-pulse": {
    "id": 618,
    "name": "Origin Pulse",
    "type": "Water",
    "category": "Special",
    "power": 110,
    "accuracy": 85,
    "pp": 10,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "precipice-blades": {
    "id": 619,
    "name": "Precipice Blades",
    "type": "Ground",
    "category": "Physical",
    "power": 120,
    "accuracy": 85,
    "pp": 10,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "dragon-ascent": {
    "id": 620,
    "name": "Dragon Ascent",
    "type": "Flying",
    "category": "Physical",
    "power": 120,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": "Lowers the user’s Defense and Special Defense by one stage after inflicting damage."
  },
  "hyperspace-fury": {
    "id": 621,
    "name": "Hyperspace Fury",
    "type": "Dark",
    "category": "Physical",
    "power": 100,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": "Ignores and destroys protection effects."
  },
  "breakneck-blitz--physical": {
    "id": 622,
    "name": "Breakneck Blitz",
    "type": "Normal",
    "category": "Physical",
    "power": 0,
    "accuracy": 100,
    "pp": 1,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "breakneck-blitz--special": {
    "id": 623,
    "name": "Breakneck Blitz",
    "type": "Normal",
    "category": "Special",
    "power": 0,
    "accuracy": 100,
    "pp": 1,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "all-out-pummeling--physical": {
    "id": 624,
    "name": "All-Out Pummeling",
    "type": "Fighting",
    "category": "Physical",
    "power": 0,
    "accuracy": 100,
    "pp": 1,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "all-out-pummeling--special": {
    "id": 625,
    "name": "All-Out Pummeling",
    "type": "Fighting",
    "category": "Special",
    "power": 0,
    "accuracy": 100,
    "pp": 1,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "supersonic-skystrike--physical": {
    "id": 626,
    "name": "Supersonic Skystrike",
    "type": "Flying",
    "category": "Physical",
    "power": 0,
    "accuracy": 100,
    "pp": 1,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "supersonic-skystrike--special": {
    "id": 627,
    "name": "Supersonic Skystrike",
    "type": "Flying",
    "category": "Special",
    "power": 0,
    "accuracy": 100,
    "pp": 1,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "acid-downpour--physical": {
    "id": 628,
    "name": "Acid Downpour",
    "type": "Poison",
    "category": "Physical",
    "power": 0,
    "accuracy": 100,
    "pp": 1,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "acid-downpour--special": {
    "id": 629,
    "name": "Acid Downpour",
    "type": "Poison",
    "category": "Special",
    "power": 0,
    "accuracy": 100,
    "pp": 1,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "tectonic-rage--physical": {
    "id": 630,
    "name": "Tectonic Rage",
    "type": "Ground",
    "category": "Physical",
    "power": 0,
    "accuracy": 100,
    "pp": 1,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "tectonic-rage--special": {
    "id": 631,
    "name": "Tectonic Rage",
    "type": "Ground",
    "category": "Special",
    "power": 0,
    "accuracy": 100,
    "pp": 1,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "continental-crush--physical": {
    "id": 632,
    "name": "Continental Crush",
    "type": "Rock",
    "category": "Physical",
    "power": 0,
    "accuracy": 100,
    "pp": 1,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "continental-crush--special": {
    "id": 633,
    "name": "Continental Crush",
    "type": "Rock",
    "category": "Special",
    "power": 0,
    "accuracy": 100,
    "pp": 1,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "savage-spin-out--physical": {
    "id": 634,
    "name": "Savage Spin-Out",
    "type": "Bug",
    "category": "Physical",
    "power": 0,
    "accuracy": 100,
    "pp": 1,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "savage-spin-out--special": {
    "id": 635,
    "name": "Savage Spin-Out",
    "type": "Bug",
    "category": "Special",
    "power": 0,
    "accuracy": 100,
    "pp": 1,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "never-ending-nightmare--physical": {
    "id": 636,
    "name": "Never-Ending Nightmare",
    "type": "Ghost",
    "category": "Physical",
    "power": 0,
    "accuracy": 100,
    "pp": 1,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "never-ending-nightmare--special": {
    "id": 637,
    "name": "Never-Ending Nightmare",
    "type": "Ghost",
    "category": "Special",
    "power": 0,
    "accuracy": 100,
    "pp": 1,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "corkscrew-crash--physical": {
    "id": 638,
    "name": "Corkscrew Crash",
    "type": "Steel",
    "category": "Physical",
    "power": 0,
    "accuracy": 100,
    "pp": 1,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "corkscrew-crash--special": {
    "id": 639,
    "name": "Corkscrew Crash",
    "type": "Steel",
    "category": "Special",
    "power": 0,
    "accuracy": 100,
    "pp": 1,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "inferno-overdrive--physical": {
    "id": 640,
    "name": "Inferno Overdrive",
    "type": "Fire",
    "category": "Physical",
    "power": 0,
    "accuracy": 100,
    "pp": 1,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "inferno-overdrive--special": {
    "id": 641,
    "name": "Inferno Overdrive",
    "type": "Fire",
    "category": "Special",
    "power": 0,
    "accuracy": 100,
    "pp": 1,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "hydro-vortex--physical": {
    "id": 642,
    "name": "Hydro Vortex",
    "type": "Water",
    "category": "Physical",
    "power": 0,
    "accuracy": 100,
    "pp": 1,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "hydro-vortex--special": {
    "id": 643,
    "name": "Hydro Vortex",
    "type": "Water",
    "category": "Special",
    "power": 0,
    "accuracy": 100,
    "pp": 1,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "bloom-doom--physical": {
    "id": 644,
    "name": "Bloom Doom",
    "type": "Grass",
    "category": "Physical",
    "power": 0,
    "accuracy": 100,
    "pp": 1,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "bloom-doom--special": {
    "id": 645,
    "name": "Bloom Doom",
    "type": "Grass",
    "category": "Special",
    "power": 0,
    "accuracy": 100,
    "pp": 1,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "gigavolt-havoc--physical": {
    "id": 646,
    "name": "Gigavolt Havoc",
    "type": "Electric",
    "category": "Physical",
    "power": 0,
    "accuracy": 100,
    "pp": 1,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "gigavolt-havoc--special": {
    "id": 647,
    "name": "Gigavolt Havoc",
    "type": "Electric",
    "category": "Special",
    "power": 0,
    "accuracy": 100,
    "pp": 1,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "shattered-psyche--physical": {
    "id": 648,
    "name": "Shattered Psyche",
    "type": "Psychic",
    "category": "Physical",
    "power": 0,
    "accuracy": 100,
    "pp": 1,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "shattered-psyche--special": {
    "id": 649,
    "name": "Shattered Psyche",
    "type": "Psychic",
    "category": "Special",
    "power": 0,
    "accuracy": 100,
    "pp": 1,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "subzero-slammer--physical": {
    "id": 650,
    "name": "Subzero Slammer",
    "type": "Ice",
    "category": "Physical",
    "power": 0,
    "accuracy": 100,
    "pp": 1,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "subzero-slammer--special": {
    "id": 651,
    "name": "Subzero Slammer",
    "type": "Ice",
    "category": "Special",
    "power": 0,
    "accuracy": 100,
    "pp": 1,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "devastating-drake--physical": {
    "id": 652,
    "name": "Devastating Drake",
    "type": "Dragon",
    "category": "Physical",
    "power": 0,
    "accuracy": 100,
    "pp": 1,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "devastating-drake--special": {
    "id": 653,
    "name": "Devastating Drake",
    "type": "Dragon",
    "category": "Special",
    "power": 0,
    "accuracy": 100,
    "pp": 1,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "black-hole-eclipse--physical": {
    "id": 654,
    "name": "Black Hole Eclipse",
    "type": "Dark",
    "category": "Physical",
    "power": 0,
    "accuracy": 100,
    "pp": 1,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "black-hole-eclipse--special": {
    "id": 655,
    "name": "Black Hole Eclipse",
    "type": "Dark",
    "category": "Special",
    "power": 0,
    "accuracy": 100,
    "pp": 1,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "twinkle-tackle--physical": {
    "id": 656,
    "name": "Twinkle Tackle",
    "type": "Fairy",
    "category": "Physical",
    "power": 0,
    "accuracy": 100,
    "pp": 1,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "twinkle-tackle--special": {
    "id": 657,
    "name": "Twinkle Tackle",
    "type": "Fairy",
    "category": "Special",
    "power": 0,
    "accuracy": 100,
    "pp": 1,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "catastropika": {
    "id": 658,
    "name": "Catastropika",
    "type": "Electric",
    "category": "Physical",
    "power": 210,
    "accuracy": 100,
    "pp": 1,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "shore-up": {
    "id": 659,
    "name": "Shore Up",
    "type": "Ground",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": "Heals the user for ½ its max HP, or ⅔ during a sandstorm.",
    "statChanges": [],
    "target": "user"
  },
  "first-impression": {
    "id": 660,
    "name": "First Impression",
    "type": "Bug",
    "category": "Physical",
    "power": 90,
    "accuracy": 100,
    "pp": 10,
    "priority": 2,
    "effect": "Can only be used as the first move after the user enters battle."
  },
  "baneful-bunker": {
    "id": 661,
    "name": "Baneful Bunker",
    "type": "Poison",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 4,
    "effect": "Grants the user protection for the rest of the turn and poisons any Pokémon that tries to use a contact move on it.",
    "statChanges": []
  },
  "spirit-shackle": {
    "id": 662,
    "name": "Spirit Shackle",
    "type": "Ghost",
    "category": "Physical",
    "power": 80,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Traps the target."
  },
  "darkest-lariat": {
    "id": 663,
    "name": "Darkest Lariat",
    "type": "Dark",
    "category": "Physical",
    "power": 85,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Ignores the target’s stat modifiers."
  },
  "sparkling-aria": {
    "id": 664,
    "name": "Sparkling Aria",
    "type": "Water",
    "category": "Special",
    "power": 90,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Cures the target of burns."
  },
  "ice-hammer": {
    "id": 665,
    "name": "Ice Hammer",
    "type": "Ice",
    "category": "Physical",
    "power": 100,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "effect": "Lowers user’s Speed by one stage."
  },
  "floral-healing": {
    "id": 666,
    "name": "Floral Healing",
    "type": "Fairy",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Heals the target for ½ its max HP, or ⅔ on Grassy Terrain.",
    "statChanges": [],
    "target": "user"
  },
  "high-horsepower": {
    "id": 667,
    "name": "High Horsepower",
    "type": "Ground",
    "category": "Physical",
    "power": 95,
    "accuracy": 95,
    "pp": 10,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "strength-sap": {
    "id": 668,
    "name": "Strength Sap",
    "type": "Grass",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Heals the user by the target’s current Attack stat and lowers the target’s Attack by one stage.",
    "statChanges": [
      {
        "stat": "attack",
        "change": -1
      }
    ],
    "target": "enemy"
  },
  "solar-blade": {
    "id": 669,
    "name": "Solar Blade",
    "type": "Grass",
    "category": "Physical",
    "power": 125,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Requires a turn to charge before attacking."
  },
  "leafage": {
    "id": 670,
    "name": "Leafage",
    "type": "Grass",
    "category": "Physical",
    "power": 40,
    "accuracy": 100,
    "pp": 40,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "spotlight": {
    "id": 671,
    "name": "Spotlight",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 3,
    "effect": "Forces the target’s opponents to aim at the target for the rest of the turn.",
    "statChanges": []
  },
  "toxic-thread": {
    "id": 672,
    "name": "Toxic Thread",
    "type": "Poison",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Poisons the target and lowers its Speed by one stage.",
    "statChanges": [
      {
        "stat": "speed",
        "change": -1
      }
    ],
    "target": "enemy"
  },
  "laser-focus": {
    "id": 673,
    "name": "Laser Focus",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 30,
    "priority": 0,
    "effect": "Guarantees a critical hit with the user’s next move.",
    "statChanges": []
  },
  "gear-up": {
    "id": 674,
    "name": "Gear Up",
    "type": "Steel",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Raises the Attack and Special Attack of all friendly Pokémon with plus or minus by one stage.",
    "statChanges": [
      {
        "stat": "attack",
        "change": 1
      },
      {
        "stat": "spAtk",
        "change": 1
      }
    ],
    "target": "user"
  },
  "throat-chop": {
    "id": 675,
    "name": "Throat Chop",
    "type": "Dark",
    "category": "Physical",
    "power": 80,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "Prevents the target from using sound-based moves for two turns."
  },
  "pollen-puff": {
    "id": 676,
    "name": "Pollen Puff",
    "type": "Bug",
    "category": "Special",
    "power": 90,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "Damages opponents, but heals allies for 50% of their max HP."
  },
  "anchor-shot": {
    "id": 677,
    "name": "Anchor Shot",
    "type": "Steel",
    "category": "Physical",
    "power": 80,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Traps the target."
  },
  "psychic-terrain": {
    "id": 678,
    "name": "Psychic Terrain",
    "type": "Psychic",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Protects Pokémon on the ground from priority moves and increases the power of their  Psychic moves by 50%.",
    "statChanges": []
  },
  "lunge": {
    "id": 679,
    "name": "Lunge",
    "type": "Bug",
    "category": "Physical",
    "power": 80,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "Lowers the target’s Attack by one stage after inflicting damage."
  },
  "fire-lash": {
    "id": 680,
    "name": "Fire Lash",
    "type": "Fire",
    "category": "Physical",
    "power": 80,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "Lowers the target’s Defense by one stage after inflicting damage."
  },
  "power-trip": {
    "id": 681,
    "name": "Power Trip",
    "type": "Dark",
    "category": "Physical",
    "power": 20,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Power is higher the more the user’s stats have been raised, to a maximum of 31×."
  },
  "burn-up": {
    "id": 682,
    "name": "Burn Up",
    "type": "Fire",
    "category": "Special",
    "power": 130,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": "Removes the user’s fire type after inflicting damage."
  },
  "speed-swap": {
    "id": 683,
    "name": "Speed Swap",
    "type": "Psychic",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Exchanges the user’s Speed with the target’s.",
    "statChanges": []
  },
  "smart-strike": {
    "id": 684,
    "name": "Smart Strike",
    "type": "Steel",
    "category": "Physical",
    "power": 70,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Never misses."
  },
  "purify": {
    "id": 685,
    "name": "Purify",
    "type": "Poison",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Cures the target of a major status ailment and heals the user for 50% of its max HP.",
    "statChanges": []
  },
  "revelation-dance": {
    "id": 686,
    "name": "Revelation Dance",
    "type": "Normal",
    "category": "Special",
    "power": 90,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "Has the same type as the user."
  },
  "core-enforcer": {
    "id": 687,
    "name": "Core Enforcer",
    "type": "Dragon",
    "category": "Special",
    "power": 100,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Nullifies the target’s ability if it moves earlier."
  },
  "trop-kick": {
    "id": 688,
    "name": "Trop Kick",
    "type": "Grass",
    "category": "Physical",
    "power": 70,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "Lowers the target’s Attack by one stage after inflicting damage."
  },
  "instruct": {
    "id": 689,
    "name": "Instruct",
    "type": "Psychic",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "Forces the target to repeat its last used move.",
    "statChanges": []
  },
  "beak-blast": {
    "id": 690,
    "name": "Beak Blast",
    "type": "Flying",
    "category": "Physical",
    "power": 100,
    "accuracy": 100,
    "pp": 15,
    "priority": -3,
    "effect": "Inflicts a burn on any Pokémon that makes contact before the attack."
  },
  "clanging-scales": {
    "id": 691,
    "name": "Clanging Scales",
    "type": "Dragon",
    "category": "Special",
    "power": 110,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": "Lowers the user’s Defense by one stage after inflicting damage."
  },
  "dragon-hammer": {
    "id": 692,
    "name": "Dragon Hammer",
    "type": "Dragon",
    "category": "Physical",
    "power": 90,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "brutal-swing": {
    "id": 693,
    "name": "Brutal Swing",
    "type": "Dark",
    "category": "Physical",
    "power": 60,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "aurora-veil": {
    "id": 694,
    "name": "Aurora Veil",
    "type": "Ice",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Reduces damage five turns, but must be used during hail.",
    "statChanges": []
  },
  "sinister-arrow-raid": {
    "id": 695,
    "name": "Sinister Arrow Raid",
    "type": "Ghost",
    "category": "Physical",
    "power": 180,
    "accuracy": 100,
    "pp": 1,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "malicious-moonsault": {
    "id": 696,
    "name": "Malicious Moonsault",
    "type": "Dark",
    "category": "Physical",
    "power": 180,
    "accuracy": 100,
    "pp": 1,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "oceanic-operetta": {
    "id": 697,
    "name": "Oceanic Operetta",
    "type": "Water",
    "category": "Special",
    "power": 195,
    "accuracy": 100,
    "pp": 1,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "guardian-of-alola": {
    "id": 698,
    "name": "Guardian of Alola",
    "type": "Fairy",
    "category": "Special",
    "power": 0,
    "accuracy": 100,
    "pp": 1,
    "priority": 0,
    "effect": "Damages the target for 75% of its remaining HP."
  },
  "soul-stealing-7-star-strike": {
    "id": 699,
    "name": "Soul-Stealing 7-Star Strike",
    "type": "Ghost",
    "category": "Physical",
    "power": 195,
    "accuracy": 100,
    "pp": 1,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "stoked-sparksurfer": {
    "id": 700,
    "name": "Stoked Sparksurfer",
    "type": "Electric",
    "category": "Special",
    "power": 175,
    "accuracy": 100,
    "pp": 1,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to paralyze the target."
  },
  "pulverizing-pancake": {
    "id": 701,
    "name": "Pulverizing Pancake",
    "type": "Normal",
    "category": "Physical",
    "power": 210,
    "accuracy": 100,
    "pp": 1,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "extreme-evoboost": {
    "id": 702,
    "name": "Extreme Evoboost",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 1,
    "priority": 0,
    "effect": "Raises all of the user’s stats by two stages.",
    "statChanges": [
      {
        "stat": "attack",
        "change": 2
      },
      {
        "stat": "defense",
        "change": 2
      },
      {
        "stat": "spAtk",
        "change": 2
      },
      {
        "stat": "spDef",
        "change": 2
      },
      {
        "stat": "speed",
        "change": 2
      }
    ],
    "target": "user"
  },
  "genesis-supernova": {
    "id": 703,
    "name": "Genesis Supernova",
    "type": "Psychic",
    "category": "Special",
    "power": 185,
    "accuracy": 100,
    "pp": 1,
    "priority": 0,
    "effect": "Changes the terrain to Psychic Terrain after inflicting damage."
  },
  "shell-trap": {
    "id": 704,
    "name": "Shell Trap",
    "type": "Fire",
    "category": "Special",
    "power": 150,
    "accuracy": 100,
    "pp": 5,
    "priority": -3,
    "effect": "Only inflicts damage if the user was hit by a physical move this turn."
  },
  "fleur-cannon": {
    "id": 705,
    "name": "Fleur Cannon",
    "type": "Fairy",
    "category": "Special",
    "power": 130,
    "accuracy": 90,
    "pp": 5,
    "priority": 0,
    "effect": "Lowers the user’s Special Attack by two stages after inflicting damage."
  },
  "psychic-fangs": {
    "id": 706,
    "name": "Psychic Fangs",
    "type": "Psychic",
    "category": "Physical",
    "power": 85,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Destroys Reflect and Light Screen."
  },
  "stomping-tantrum": {
    "id": 707,
    "name": "Stomping Tantrum",
    "type": "Ground",
    "category": "Physical",
    "power": 75,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Has double power if the user’s last move failed."
  },
  "shadow-bone": {
    "id": 708,
    "name": "Shadow Bone",
    "type": "Ghost",
    "category": "Physical",
    "power": 85,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to lower the target’s Defense by one stage."
  },
  "accelerock": {
    "id": 709,
    "name": "Accelerock",
    "type": "Rock",
    "category": "Physical",
    "power": 40,
    "accuracy": 100,
    "pp": 20,
    "priority": 1,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "liquidation": {
    "id": 710,
    "name": "Liquidation",
    "type": "Water",
    "category": "Physical",
    "power": 85,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to lower the target’s Defense by one stage."
  },
  "prismatic-laser": {
    "id": 711,
    "name": "Prismatic Laser",
    "type": "Psychic",
    "category": "Special",
    "power": 160,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "User foregoes its next turn to recharge."
  },
  "spectral-thief": {
    "id": 712,
    "name": "Spectral Thief",
    "type": "Ghost",
    "category": "Physical",
    "power": 90,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Steals the target’s stat increases, then inflicts damage."
  },
  "sunsteel-strike": {
    "id": 713,
    "name": "Sunsteel Strike",
    "type": "Steel",
    "category": "Physical",
    "power": 100,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": "Cannot be disrupted by abilities."
  },
  "moongeist-beam": {
    "id": 714,
    "name": "Moongeist Beam",
    "type": "Ghost",
    "category": "Special",
    "power": 100,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": "Cannot be disrupted by abilities."
  },
  "tearful-look": {
    "id": 715,
    "name": "Tearful Look",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Lowers the target’s Attack and Special Attack by one stage.",
    "statChanges": [
      {
        "stat": "attack",
        "change": -1
      },
      {
        "stat": "spAtk",
        "change": -1
      }
    ],
    "target": "user"
  },
  "zing-zap": {
    "id": 716,
    "name": "Zing Zap",
    "type": "Electric",
    "category": "Physical",
    "power": 80,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to make the target flinch."
  },
  "natures-madness": {
    "id": 717,
    "name": "Nature’s Madness",
    "type": "Fairy",
    "category": "Special",
    "power": 0,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "effect": "Inflicts damage equal to half the target’s HP."
  },
  "multi-attack": {
    "id": 718,
    "name": "Multi-Attack",
    "type": "Normal",
    "category": "Physical",
    "power": 120,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "If the user is holding a appropriate plate or drive, the damage inflicted will match it."
  },
  "10-000-000-volt-thunderbolt": {
    "id": 719,
    "name": "10,000,000 Volt Thunderbolt",
    "type": "Electric",
    "category": "Special",
    "power": 195,
    "accuracy": 100,
    "pp": 1,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "mind-blown": {
    "id": 720,
    "name": "Mind Blown",
    "type": "Fire",
    "category": "Special",
    "power": 150,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": "Inflicts damage, and the user takes damage equal to half of its max HP, rounded up."
  },
  "plasma-fists": {
    "id": 721,
    "name": "Plasma Fists",
    "type": "Electric",
    "category": "Physical",
    "power": 100,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "After inflicting damage, causes all Normal-type moves to become Electric-type for the remainder of the turn."
  },
  "photon-geyser": {
    "id": 722,
    "name": "Photon Geyser",
    "type": "Psychic",
    "category": "Special",
    "power": 100,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "light-that-burns-the-sky": {
    "id": 723,
    "name": "Light That Burns the Sky",
    "type": "Psychic",
    "category": "Special",
    "power": 200,
    "accuracy": 100,
    "pp": 1,
    "priority": 0,
    "effect": "Inflicts damage using either Attack or Special Attack stat, whichever is higher."
  },
  "searing-sunraze-smash": {
    "id": 724,
    "name": "Searing Sunraze Smash",
    "type": "Steel",
    "category": "Physical",
    "power": 200,
    "accuracy": 100,
    "pp": 1,
    "priority": 0,
    "effect": "Cannot be disrupted by abilities."
  },
  "menacing-moonraze-maelstrom": {
    "id": 725,
    "name": "Menacing Moonraze Maelstrom",
    "type": "Ghost",
    "category": "Special",
    "power": 200,
    "accuracy": 100,
    "pp": 1,
    "priority": 0,
    "effect": "Cannot be disrupted by abilities."
  },
  "lets-snuggle-forever": {
    "id": 726,
    "name": "Let’s Snuggle Forever",
    "type": "Fairy",
    "category": "Physical",
    "power": 190,
    "accuracy": 100,
    "pp": 1,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "splintered-stormshards": {
    "id": 727,
    "name": "Splintered Stormshards",
    "type": "Rock",
    "category": "Physical",
    "power": 190,
    "accuracy": 100,
    "pp": 1,
    "priority": 0,
    "effect": "Inflicts damage and removes any terrain present on the battlefield."
  },
  "clangorous-soulblaze": {
    "id": 728,
    "name": "Clangorous Soulblaze",
    "type": "Dragon",
    "category": "Special",
    "power": 185,
    "accuracy": 100,
    "pp": 1,
    "priority": 0,
    "effect": "Inflicts damage to all opposing Pokémon and increases the user’s Attack, Defense, Special Attack, Special Defense, and Speed by one stage each."
  },
  "zippy-zap": {
    "id": 729,
    "name": "Zippy Zap",
    "type": "Electric",
    "category": "Physical",
    "power": 80,
    "accuracy": 100,
    "pp": 10,
    "priority": 2,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "splishy-splash": {
    "id": 730,
    "name": "Splishy Splash",
    "type": "Water",
    "category": "Special",
    "power": 90,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "floaty-fall": {
    "id": 731,
    "name": "Floaty Fall",
    "type": "Flying",
    "category": "Physical",
    "power": 90,
    "accuracy": 95,
    "pp": 15,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "pika-papow": {
    "id": 732,
    "name": "Pika Papow",
    "type": "Electric",
    "category": "Special",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "bouncy-bubble": {
    "id": 733,
    "name": "Bouncy Bubble",
    "type": "Water",
    "category": "Special",
    "power": 60,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "buzzy-buzz": {
    "id": 734,
    "name": "Buzzy Buzz",
    "type": "Electric",
    "category": "Special",
    "power": 60,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "sizzly-slide": {
    "id": 735,
    "name": "Sizzly Slide",
    "type": "Fire",
    "category": "Physical",
    "power": 60,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "glitzy-glow": {
    "id": 736,
    "name": "Glitzy Glow",
    "type": "Psychic",
    "category": "Special",
    "power": 80,
    "accuracy": 95,
    "pp": 15,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "baddy-bad": {
    "id": 737,
    "name": "Baddy Bad",
    "type": "Dark",
    "category": "Special",
    "power": 80,
    "accuracy": 95,
    "pp": 15,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "sappy-seed": {
    "id": 738,
    "name": "Sappy Seed",
    "type": "Grass",
    "category": "Physical",
    "power": 100,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "freezy-frost": {
    "id": 739,
    "name": "Freezy Frost",
    "type": "Ice",
    "category": "Special",
    "power": 100,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "sparkly-swirl": {
    "id": 740,
    "name": "Sparkly Swirl",
    "type": "Fairy",
    "category": "Special",
    "power": 120,
    "accuracy": 85,
    "pp": 5,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "veevee-volley": {
    "id": 741,
    "name": "Veevee Volley",
    "type": "Normal",
    "category": "Physical",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "double-iron-bash": {
    "id": 742,
    "name": "Double Iron Bash",
    "type": "Steel",
    "category": "Physical",
    "power": 60,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": "Hits twice in one turn."
  },
  "max-guard": {
    "id": 743,
    "name": "Max Guard",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 4,
    "effect": "Prevents any moves from hitting the user this turn.",
    "statChanges": []
  },
  "dynamax-cannon": {
    "id": 744,
    "name": "Dynamax Cannon",
    "type": "Dragon",
    "category": "Special",
    "power": 100,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": "Sets Light Screen on the user’s side of the field after inflicting damage."
  },
  "snipe-shot": {
    "id": 745,
    "name": "Snipe Shot",
    "type": "Water",
    "category": "Special",
    "power": 80,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "Sets Reflect on the user’s side of the field after inflicting damage."
  },
  "jaw-lock": {
    "id": 746,
    "name": "Jaw Lock",
    "type": "Dark",
    "category": "Physical",
    "power": 80,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Seeds the target after inflicting damage."
  },
  "stuff-cheeks": {
    "id": 747,
    "name": "Stuff Cheeks",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Cures the entire party of major status effects after inflicting damage.",
    "statChanges": [
      {
        "stat": "defense",
        "change": 2
      }
    ],
    "target": "user"
  },
  "no-retreat": {
    "id": 748,
    "name": "No Retreat",
    "type": "Fighting",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": "Hits twice in one turn, with a $effect_chance% chance to make the target flinch.",
    "statChanges": [
      {
        "stat": "attack",
        "change": 1
      },
      {
        "stat": "defense",
        "change": 1
      },
      {
        "stat": "spAtk",
        "change": 1
      },
      {
        "stat": "spDef",
        "change": 1
      },
      {
        "stat": "speed",
        "change": 1
      }
    ],
    "target": "user"
  },
  "tar-shot": {
    "id": 749,
    "name": "Tar Shot",
    "type": "Rock",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "No effect description.",
    "statChanges": [
      {
        "stat": "speed",
        "change": -1
      }
    ],
    "target": "enemy"
  },
  "magic-powder": {
    "id": 750,
    "name": "Magic Powder",
    "type": "Psychic",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "No effect description.",
    "statChanges": []
  },
  "dragon-darts": {
    "id": 751,
    "name": "Dragon Darts",
    "type": "Dragon",
    "category": "Physical",
    "power": 50,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "No effect description."
  },
  "teatime": {
    "id": 752,
    "name": "Teatime",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "No effect description.",
    "statChanges": []
  },
  "octolock": {
    "id": 753,
    "name": "Octolock",
    "type": "Fighting",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "No effect description.",
    "statChanges": []
  },
  "bolt-beak": {
    "id": 754,
    "name": "Bolt Beak",
    "type": "Electric",
    "category": "Physical",
    "power": 85,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "No effect description."
  },
  "fishious-rend": {
    "id": 755,
    "name": "Fishious Rend",
    "type": "Water",
    "category": "Physical",
    "power": 85,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "No effect description."
  },
  "court-change": {
    "id": 756,
    "name": "Court Change",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "No effect description.",
    "statChanges": []
  },
  "max-flare": {
    "id": 757,
    "name": "Max Flare",
    "type": "Fire",
    "category": "Physical",
    "power": 100,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "max-flutterby": {
    "id": 758,
    "name": "Max Flutterby",
    "type": "Bug",
    "category": "Physical",
    "power": 10,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "max-lightning": {
    "id": 759,
    "name": "Max Lightning",
    "type": "Electric",
    "category": "Physical",
    "power": 10,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "max-strike": {
    "id": 760,
    "name": "Max Strike",
    "type": "Normal",
    "category": "Physical",
    "power": 10,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "max-knuckle": {
    "id": 761,
    "name": "Max Knuckle",
    "type": "Fighting",
    "category": "Physical",
    "power": 10,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "max-phantasm": {
    "id": 762,
    "name": "Max Phantasm",
    "type": "Ghost",
    "category": "Physical",
    "power": 10,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "max-hailstorm": {
    "id": 763,
    "name": "Max Hailstorm",
    "type": "Ice",
    "category": "Physical",
    "power": 10,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "max-ooze": {
    "id": 764,
    "name": "Max Ooze",
    "type": "Poison",
    "category": "Physical",
    "power": 10,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "max-geyser": {
    "id": 765,
    "name": "Max Geyser",
    "type": "Water",
    "category": "Physical",
    "power": 10,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "max-airstream": {
    "id": 766,
    "name": "Max Airstream",
    "type": "Flying",
    "category": "Physical",
    "power": 10,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "max-starfall": {
    "id": 767,
    "name": "Max Starfall",
    "type": "Fairy",
    "category": "Physical",
    "power": 10,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "max-wyrmwind": {
    "id": 768,
    "name": "Max Wyrmwind",
    "type": "Dragon",
    "category": "Physical",
    "power": 10,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "max-mindstorm": {
    "id": 769,
    "name": "Max Mindstorm",
    "type": "Psychic",
    "category": "Physical",
    "power": 10,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "max-rockfall": {
    "id": 770,
    "name": "Max Rockfall",
    "type": "Rock",
    "category": "Physical",
    "power": 10,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "max-quake": {
    "id": 771,
    "name": "Max Quake",
    "type": "Ground",
    "category": "Physical",
    "power": 10,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "max-darkness": {
    "id": 772,
    "name": "Max Darkness",
    "type": "Dark",
    "category": "Physical",
    "power": 10,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "max-overgrowth": {
    "id": 773,
    "name": "Max Overgrowth",
    "type": "Grass",
    "category": "Physical",
    "power": 10,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "max-steelspike": {
    "id": 774,
    "name": "Max Steelspike",
    "type": "Steel",
    "category": "Physical",
    "power": 10,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "clangorous-soul": {
    "id": 775,
    "name": "Clangorous Soul",
    "type": "Dragon",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": "No effect description.",
    "statChanges": [
      {
        "stat": "attack",
        "change": 1
      },
      {
        "stat": "defense",
        "change": 1
      },
      {
        "stat": "spAtk",
        "change": 1
      },
      {
        "stat": "spDef",
        "change": 1
      },
      {
        "stat": "speed",
        "change": 1
      }
    ],
    "target": "user"
  },
  "body-press": {
    "id": 776,
    "name": "Body Press",
    "type": "Fighting",
    "category": "Physical",
    "power": 80,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "No effect description."
  },
  "decorate": {
    "id": 777,
    "name": "Decorate",
    "type": "Fairy",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "No effect description.",
    "statChanges": [
      {
        "stat": "attack",
        "change": 2
      },
      {
        "stat": "spAtk",
        "change": 2
      }
    ],
    "target": "user"
  },
  "drum-beating": {
    "id": 778,
    "name": "Drum Beating",
    "type": "Grass",
    "category": "Physical",
    "power": 80,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to lower the target’s Speed by one stage."
  },
  "snap-trap": {
    "id": 779,
    "name": "Snap Trap",
    "type": "Grass",
    "category": "Physical",
    "power": 35,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "Prevents the target from fleeing and inflicts damage for 2-5 turns."
  },
  "pyro-ball": {
    "id": 780,
    "name": "Pyro Ball",
    "type": "Fire",
    "category": "Physical",
    "power": 120,
    "accuracy": 90,
    "pp": 5,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to burn the target."
  },
  "behemoth-blade": {
    "id": 781,
    "name": "Behemoth Blade",
    "type": "Steel",
    "category": "Physical",
    "power": 100,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": "No effect description."
  },
  "behemoth-bash": {
    "id": 782,
    "name": "Behemoth Bash",
    "type": "Steel",
    "category": "Physical",
    "power": 100,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": "No effect description."
  },
  "aura-wheel": {
    "id": 783,
    "name": "Aura Wheel",
    "type": "Electric",
    "category": "Physical",
    "power": 110,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "No effect description."
  },
  "breaking-swipe": {
    "id": 784,
    "name": "Breaking Swipe",
    "type": "Dragon",
    "category": "Physical",
    "power": 60,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "Lowers the target’s Attack by one stage after inflicting damage."
  },
  "branch-poke": {
    "id": 785,
    "name": "Branch Poke",
    "type": "Grass",
    "category": "Physical",
    "power": 40,
    "accuracy": 100,
    "pp": 40,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "overdrive": {
    "id": 786,
    "name": "Overdrive",
    "type": "Electric",
    "category": "Special",
    "power": 80,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "No effect description."
  },
  "apple-acid": {
    "id": 787,
    "name": "Apple Acid",
    "type": "Grass",
    "category": "Special",
    "power": 80,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "No effect description."
  },
  "grav-apple": {
    "id": 788,
    "name": "Grav Apple",
    "type": "Grass",
    "category": "Physical",
    "power": 80,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Lowers the target’s Defense by one stage after inflicting damage."
  },
  "spirit-break": {
    "id": 789,
    "name": "Spirit Break",
    "type": "Fairy",
    "category": "Physical",
    "power": 75,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to lower the target’s Special Attack by one stage."
  },
  "strange-steam": {
    "id": 790,
    "name": "Strange Steam",
    "type": "Fairy",
    "category": "Special",
    "power": 90,
    "accuracy": 95,
    "pp": 10,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to confuse the target."
  },
  "life-dew": {
    "id": 791,
    "name": "Life Dew",
    "type": "Water",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "No effect description.",
    "statChanges": [],
    "target": "user"
  },
  "obstruct": {
    "id": 792,
    "name": "Obstruct",
    "type": "Dark",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 4,
    "effect": "No effect description.",
    "statChanges": []
  },
  "false-surrender": {
    "id": 793,
    "name": "False Surrender",
    "type": "Dark",
    "category": "Physical",
    "power": 80,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Never misses."
  },
  "meteor-assault": {
    "id": 794,
    "name": "Meteor Assault",
    "type": "Fighting",
    "category": "Physical",
    "power": 150,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": "User foregoes its next turn to recharge."
  },
  "eternabeam": {
    "id": 795,
    "name": "Eternabeam",
    "type": "Dragon",
    "category": "Special",
    "power": 160,
    "accuracy": 90,
    "pp": 5,
    "priority": 0,
    "effect": "User foregoes its next turn to recharge."
  },
  "steel-beam": {
    "id": 796,
    "name": "Steel Beam",
    "type": "Steel",
    "category": "Special",
    "power": 140,
    "accuracy": 95,
    "pp": 5,
    "priority": 0,
    "effect": "Inflicts damage, and the user takes damage equal to half of its max HP, rounded up."
  },
  "expanding-force": {
    "id": 797,
    "name": "Expanding Force",
    "type": "Psychic",
    "category": "Special",
    "power": 80,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "steel-roller": {
    "id": 798,
    "name": "Steel Roller",
    "type": "Steel",
    "category": "Physical",
    "power": 130,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "scale-shot": {
    "id": 799,
    "name": "Scale Shot",
    "type": "Dragon",
    "category": "Physical",
    "power": 25,
    "accuracy": 90,
    "pp": 20,
    "priority": 0,
    "effect": "Boosts the user’s Speed and lowers their Defense by one stage after inflicting damage two to five times in a row."
  },
  "meteor-beam": {
    "id": 800,
    "name": "Meteor Beam",
    "type": "Rock",
    "category": "Special",
    "power": 120,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "shell-side-arm": {
    "id": 801,
    "name": "Shell Side Arm",
    "type": "Poison",
    "category": "Special",
    "power": 90,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "misty-explosion": {
    "id": 802,
    "name": "Misty Explosion",
    "type": "Fairy",
    "category": "Special",
    "power": 100,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "grassy-glide": {
    "id": 803,
    "name": "Grassy Glide",
    "type": "Grass",
    "category": "Physical",
    "power": 55,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "rising-voltage": {
    "id": 804,
    "name": "Rising Voltage",
    "type": "Electric",
    "category": "Special",
    "power": 70,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "terrain-pulse": {
    "id": 805,
    "name": "Terrain Pulse",
    "type": "Normal",
    "category": "Special",
    "power": 50,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "skitter-smack": {
    "id": 806,
    "name": "Skitter Smack",
    "type": "Bug",
    "category": "Physical",
    "power": 70,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "burning-jealousy": {
    "id": 807,
    "name": "Burning Jealousy",
    "type": "Fire",
    "category": "Special",
    "power": 70,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "lash-out": {
    "id": 808,
    "name": "Lash Out",
    "type": "Dark",
    "category": "Physical",
    "power": 75,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "poltergeist": {
    "id": 809,
    "name": "Poltergeist",
    "type": "Ghost",
    "category": "Physical",
    "power": 110,
    "accuracy": 90,
    "pp": 5,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "corrosive-gas": {
    "id": 810,
    "name": "Corrosive Gas",
    "type": "Poison",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 40,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect.",
    "statChanges": []
  },
  "coaching": {
    "id": 811,
    "name": "Coaching",
    "type": "Fighting",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect.",
    "statChanges": [
      {
        "stat": "attack",
        "change": 1
      },
      {
        "stat": "defense",
        "change": 1
      }
    ],
    "target": "user"
  },
  "flip-turn": {
    "id": 812,
    "name": "Flip Turn",
    "type": "Water",
    "category": "Physical",
    "power": 60,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "triple-axel": {
    "id": 813,
    "name": "Triple Axel",
    "type": "Ice",
    "category": "Physical",
    "power": 20,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "dual-wingbeat": {
    "id": 814,
    "name": "Dual Wingbeat",
    "type": "Flying",
    "category": "Physical",
    "power": 40,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "scorching-sands": {
    "id": 815,
    "name": "Scorching Sands",
    "type": "Ground",
    "category": "Special",
    "power": 70,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to burn the target."
  },
  "jungle-healing": {
    "id": 816,
    "name": "Jungle Healing",
    "type": "Grass",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect.",
    "statChanges": []
  },
  "wicked-blow": {
    "id": 817,
    "name": "Wicked Blow",
    "type": "Dark",
    "category": "Physical",
    "power": 75,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "surging-strikes": {
    "id": 818,
    "name": "Surging Strikes",
    "type": "Water",
    "category": "Physical",
    "power": 25,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "thunder-cage": {
    "id": 819,
    "name": "Thunder Cage",
    "type": "Electric",
    "category": "Special",
    "power": 80,
    "accuracy": 90,
    "pp": 15,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "dragon-energy": {
    "id": 820,
    "name": "Dragon Energy",
    "type": "Dragon",
    "category": "Special",
    "power": 150,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "freezing-glare": {
    "id": 821,
    "name": "Freezing Glare",
    "type": "Psychic",
    "category": "Special",
    "power": 90,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "fiery-wrath": {
    "id": 822,
    "name": "Fiery Wrath",
    "type": "Dark",
    "category": "Special",
    "power": 90,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "thunderous-kick": {
    "id": 823,
    "name": "Thunderous Kick",
    "type": "Fighting",
    "category": "Physical",
    "power": 90,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "glacial-lance": {
    "id": 824,
    "name": "Glacial Lance",
    "type": "Ice",
    "category": "Physical",
    "power": 120,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "astral-barrage": {
    "id": 825,
    "name": "Astral Barrage",
    "type": "Ghost",
    "category": "Special",
    "power": 120,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "eerie-spell": {
    "id": 826,
    "name": "Eerie Spell",
    "type": "Psychic",
    "category": "Special",
    "power": 80,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "dire-claw": {
    "id": 827,
    "name": "Dire Claw",
    "type": "Poison",
    "category": "Physical",
    "power": 80,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "No effect description."
  },
  "psyshield-bash": {
    "id": 828,
    "name": "Psyshield Bash",
    "type": "Psychic",
    "category": "Physical",
    "power": 70,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "effect": "No effect description."
  },
  "power-shift": {
    "id": 829,
    "name": "Power Shift",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "No effect description.",
    "statChanges": [],
    "target": "enemy"
  },
  "stone-axe": {
    "id": 830,
    "name": "Stone Axe",
    "type": "Rock",
    "category": "Physical",
    "power": 65,
    "accuracy": 90,
    "pp": 15,
    "priority": 0,
    "effect": "No effect description."
  },
  "springtide-storm": {
    "id": 831,
    "name": "Springtide Storm",
    "type": "Fairy",
    "category": "Special",
    "power": 100,
    "accuracy": 80,
    "pp": 5,
    "priority": 0,
    "effect": "No effect description."
  },
  "mystical-power": {
    "id": 832,
    "name": "Mystical Power",
    "type": "Psychic",
    "category": "Special",
    "power": 70,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "effect": "No effect description."
  },
  "raging-fury": {
    "id": 833,
    "name": "Raging Fury",
    "type": "Fire",
    "category": "Physical",
    "power": 120,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "No effect description."
  },
  "wave-crash": {
    "id": 834,
    "name": "Wave Crash",
    "type": "Water",
    "category": "Physical",
    "power": 120,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "No effect description."
  },
  "chloroblast": {
    "id": 835,
    "name": "Chloroblast",
    "type": "Grass",
    "category": "Special",
    "power": 150,
    "accuracy": 95,
    "pp": 5,
    "priority": 0,
    "effect": "No effect description."
  },
  "mountain-gale": {
    "id": 836,
    "name": "Mountain Gale",
    "type": "Ice",
    "category": "Physical",
    "power": 100,
    "accuracy": 85,
    "pp": 10,
    "priority": 0,
    "effect": "No effect description."
  },
  "victory-dance": {
    "id": 837,
    "name": "Victory Dance",
    "type": "Fighting",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "No effect description.",
    "statChanges": [],
    "target": "enemy"
  },
  "headlong-rush": {
    "id": 838,
    "name": "Headlong Rush",
    "type": "Ground",
    "category": "Physical",
    "power": 120,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": "No effect description."
  },
  "barb-barrage": {
    "id": 839,
    "name": "Barb Barrage",
    "type": "Poison",
    "category": "Physical",
    "power": 60,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "No effect description."
  },
  "esper-wing": {
    "id": 840,
    "name": "Esper Wing",
    "type": "Psychic",
    "category": "Special",
    "power": 80,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "No effect description."
  },
  "bitter-malice": {
    "id": 841,
    "name": "Bitter Malice",
    "type": "Ghost",
    "category": "Special",
    "power": 75,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "No effect description."
  },
  "shelter": {
    "id": 842,
    "name": "Shelter",
    "type": "Steel",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "No effect description.",
    "statChanges": [],
    "target": "enemy"
  },
  "triple-arrows": {
    "id": 843,
    "name": "Triple Arrows",
    "type": "Fighting",
    "category": "Physical",
    "power": 90,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "No effect description."
  },
  "infernal-parade": {
    "id": 844,
    "name": "Infernal Parade",
    "type": "Ghost",
    "category": "Special",
    "power": 60,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "No effect description."
  },
  "ceaseless-edge": {
    "id": 845,
    "name": "Ceaseless Edge",
    "type": "Dark",
    "category": "Physical",
    "power": 65,
    "accuracy": 90,
    "pp": 15,
    "priority": 0,
    "effect": "No effect description."
  },
  "bleakwind-storm": {
    "id": 846,
    "name": "Bleakwind Storm",
    "type": "Flying",
    "category": "Special",
    "power": 100,
    "accuracy": 80,
    "pp": 10,
    "priority": 0,
    "effect": "No effect description."
  },
  "wildbolt-storm": {
    "id": 847,
    "name": "Wildbolt Storm",
    "type": "Electric",
    "category": "Special",
    "power": 100,
    "accuracy": 80,
    "pp": 10,
    "priority": 0,
    "effect": "No effect description."
  },
  "sandsear-storm": {
    "id": 848,
    "name": "Sandsear Storm",
    "type": "Ground",
    "category": "Special",
    "power": 100,
    "accuracy": 80,
    "pp": 10,
    "priority": 0,
    "effect": "No effect description."
  },
  "lunar-blessing": {
    "id": 849,
    "name": "Lunar Blessing",
    "type": "Psychic",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": "No effect description.",
    "statChanges": [],
    "target": "enemy"
  },
  "take-heart": {
    "id": 850,
    "name": "Take Heart",
    "type": "Psychic",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "No effect description.",
    "statChanges": [],
    "target": "enemy"
  },
  "tera-blast": {
    "id": 851,
    "name": "Tera Blast",
    "type": "Normal",
    "category": "Special",
    "power": 80,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "No effect description."
  },
  "silk-trap": {
    "id": 852,
    "name": "Silk Trap",
    "type": "Bug",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 4,
    "effect": "No effect description.",
    "statChanges": [
      {
        "stat": "speed",
        "change": -1
      }
    ],
    "target": "enemy"
  },
  "axe-kick": {
    "id": 853,
    "name": "Axe Kick",
    "type": "Fighting",
    "category": "Physical",
    "power": 120,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "effect": "No effect description."
  },
  "last-respects": {
    "id": 854,
    "name": "Last Respects",
    "type": "Ghost",
    "category": "Physical",
    "power": 50,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "No effect description."
  },
  "lumina-crash": {
    "id": 855,
    "name": "Lumina Crash",
    "type": "Psychic",
    "category": "Special",
    "power": 80,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "No effect description."
  },
  "order-up": {
    "id": 856,
    "name": "Order Up",
    "type": "Dragon",
    "category": "Physical",
    "power": 80,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "No effect description."
  },
  "jet-punch": {
    "id": 857,
    "name": "Jet Punch",
    "type": "Water",
    "category": "Physical",
    "power": 60,
    "accuracy": 100,
    "pp": 15,
    "priority": 1,
    "effect": "No effect description."
  },
  "spicy-extract": {
    "id": 858,
    "name": "Spicy Extract",
    "type": "Grass",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "No effect description.",
    "statChanges": [
      {
        "stat": "attack",
        "change": 2
      },
      {
        "stat": "defense",
        "change": -2
      }
    ],
    "target": "enemy"
  },
  "spin-out": {
    "id": 859,
    "name": "Spin Out",
    "type": "Steel",
    "category": "Physical",
    "power": 100,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": "No effect description."
  },
  "population-bomb": {
    "id": 860,
    "name": "Population Bomb",
    "type": "Normal",
    "category": "Physical",
    "power": 20,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "effect": "No effect description."
  },
  "ice-spinner": {
    "id": 861,
    "name": "Ice Spinner",
    "type": "Ice",
    "category": "Physical",
    "power": 80,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "No effect description."
  },
  "glaive-rush": {
    "id": 862,
    "name": "Glaive Rush",
    "type": "Dragon",
    "category": "Physical",
    "power": 120,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": "No effect description."
  },
  "revival-blessing": {
    "id": 863,
    "name": "Revival Blessing",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 1,
    "priority": 0,
    "effect": "No effect description.",
    "statChanges": [],
    "target": "enemy"
  },
  "salt-cure": {
    "id": 864,
    "name": "Salt Cure",
    "type": "Rock",
    "category": "Physical",
    "power": 40,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "No effect description."
  },
  "triple-dive": {
    "id": 865,
    "name": "Triple Dive",
    "type": "Water",
    "category": "Physical",
    "power": 30,
    "accuracy": 95,
    "pp": 10,
    "priority": 0,
    "effect": "No effect description."
  },
  "mortal-spin": {
    "id": 866,
    "name": "Mortal Spin",
    "type": "Poison",
    "category": "Physical",
    "power": 30,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "No effect description."
  },
  "doodle": {
    "id": 867,
    "name": "Doodle",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "No effect description.",
    "statChanges": [],
    "target": "enemy"
  },
  "fillet-away": {
    "id": 868,
    "name": "Fillet Away",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "No effect description.",
    "statChanges": [
      {
        "stat": "attack",
        "change": 2
      },
      {
        "stat": "spAtk",
        "change": 2
      },
      {
        "stat": "speed",
        "change": 2
      }
    ],
    "target": "enemy"
  },
  "kowtow-cleave": {
    "id": 869,
    "name": "Kowtow Cleave",
    "type": "Dark",
    "category": "Physical",
    "power": 85,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "No effect description."
  },
  "flower-trick": {
    "id": 870,
    "name": "Flower Trick",
    "type": "Grass",
    "category": "Physical",
    "power": 70,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "No effect description."
  },
  "torch-song": {
    "id": 871,
    "name": "Torch Song",
    "type": "Fire",
    "category": "Special",
    "power": 80,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "No effect description."
  },
  "aqua-step": {
    "id": 872,
    "name": "Aqua Step",
    "type": "Water",
    "category": "Physical",
    "power": 80,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "No effect description."
  },
  "raging-bull": {
    "id": 873,
    "name": "Raging Bull",
    "type": "Normal",
    "category": "Physical",
    "power": 90,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "No effect description."
  },
  "make-it-rain": {
    "id": 874,
    "name": "Make It Rain",
    "type": "Steel",
    "category": "Special",
    "power": 120,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": "No effect description."
  },
  "psyblade": {
    "id": 875,
    "name": "Psyblade",
    "type": "Psychic",
    "category": "Physical",
    "power": 80,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "No effect description."
  },
  "hydro-steam": {
    "id": 876,
    "name": "Hydro Steam",
    "type": "Water",
    "category": "Special",
    "power": 80,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "No effect description."
  },
  "ruination": {
    "id": 877,
    "name": "Ruination",
    "type": "Dark",
    "category": "Special",
    "power": 1,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "effect": "No effect description."
  },
  "collision-course": {
    "id": 878,
    "name": "Collision Course",
    "type": "Fighting",
    "category": "Physical",
    "power": 100,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": "No effect description."
  },
  "electro-drift": {
    "id": 879,
    "name": "Electro Drift",
    "type": "Electric",
    "category": "Special",
    "power": 100,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": "No effect description."
  },
  "shed-tail": {
    "id": 880,
    "name": "Shed Tail",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "No effect description.",
    "statChanges": [],
    "target": "enemy"
  },
  "chilly-reception": {
    "id": 881,
    "name": "Chilly Reception",
    "type": "Ice",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "No effect description.",
    "statChanges": [],
    "target": "enemy"
  },
  "tidy-up": {
    "id": 882,
    "name": "Tidy Up",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "No effect description.",
    "statChanges": [
      {
        "stat": "attack",
        "change": 1
      },
      {
        "stat": "speed",
        "change": 1
      }
    ],
    "target": "enemy"
  },
  "snowscape": {
    "id": 883,
    "name": "Snowscape",
    "type": "Ice",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "No effect description.",
    "statChanges": [],
    "target": "enemy"
  },
  "pounce": {
    "id": 884,
    "name": "Pounce",
    "type": "Bug",
    "category": "Physical",
    "power": 50,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "No effect description."
  },
  "trailblaze": {
    "id": 885,
    "name": "Trailblaze",
    "type": "Grass",
    "category": "Physical",
    "power": 50,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "No effect description."
  },
  "chilling-water": {
    "id": 886,
    "name": "Chilling Water",
    "type": "Water",
    "category": "Special",
    "power": 50,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "No effect description."
  },
  "hyper-drill": {
    "id": 887,
    "name": "Hyper Drill",
    "type": "Normal",
    "category": "Physical",
    "power": 100,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": "No effect description."
  },
  "twin-beam": {
    "id": 888,
    "name": "Twin Beam",
    "type": "Psychic",
    "category": "Special",
    "power": 40,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "No effect description."
  },
  "rage-fist": {
    "id": 889,
    "name": "Rage Fist",
    "type": "Ghost",
    "category": "Physical",
    "power": 50,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "No effect description."
  },
  "armor-cannon": {
    "id": 890,
    "name": "Armor Cannon",
    "type": "Fire",
    "category": "Special",
    "power": 120,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": "No effect description."
  },
  "bitter-blade": {
    "id": 891,
    "name": "Bitter Blade",
    "type": "Fire",
    "category": "Physical",
    "power": 90,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "No effect description."
  },
  "double-shock": {
    "id": 892,
    "name": "Double Shock",
    "type": "Electric",
    "category": "Physical",
    "power": 120,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": "No effect description."
  },
  "gigaton-hammer": {
    "id": 893,
    "name": "Gigaton Hammer",
    "type": "Steel",
    "category": "Physical",
    "power": 160,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": "No effect description."
  },
  "comeuppance": {
    "id": 894,
    "name": "Comeuppance",
    "type": "Dark",
    "category": "Physical",
    "power": 1,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "No effect description."
  },
  "aqua-cutter": {
    "id": 895,
    "name": "Aqua Cutter",
    "type": "Water",
    "category": "Physical",
    "power": 70,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "effect": "No effect description."
  },
  "blazing-torque": {
    "id": 896,
    "name": "Blazing Torque",
    "type": "Fire",
    "category": "Physical",
    "power": 80,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "No effect description."
  },
  "wicked-torque": {
    "id": 897,
    "name": "Wicked Torque",
    "type": "Dark",
    "category": "Physical",
    "power": 80,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "No effect description."
  },
  "noxious-torque": {
    "id": 898,
    "name": "Noxious Torque",
    "type": "Poison",
    "category": "Physical",
    "power": 100,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "No effect description."
  },
  "combat-torque": {
    "id": 899,
    "name": "Combat Torque",
    "type": "Fighting",
    "category": "Physical",
    "power": 100,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "No effect description."
  },
  "magical-torque": {
    "id": 900,
    "name": "Magical Torque",
    "type": "Fairy",
    "category": "Physical",
    "power": 100,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "No effect description."
  },
  "blood-moon": {
    "id": 901,
    "name": "Blood Moon",
    "type": "Normal",
    "category": "Special",
    "power": 140,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": "No effect description."
  },
  "matcha-gotcha": {
    "id": 902,
    "name": "Matcha Gotcha",
    "type": "Grass",
    "category": "Special",
    "power": 80,
    "accuracy": 90,
    "pp": 15,
    "priority": 0,
    "effect": "No effect description."
  },
  "syrup-bomb": {
    "id": 903,
    "name": "Syrup Bomb",
    "type": "Grass",
    "category": "Special",
    "power": 60,
    "accuracy": 85,
    "pp": 10,
    "priority": 0,
    "effect": "No effect description."
  },
  "ivy-cudgel": {
    "id": 904,
    "name": "Ivy Cudgel",
    "type": "Grass",
    "category": "Physical",
    "power": 100,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "No effect description."
  },
  "electro-shot": {
    "id": 905,
    "name": "Electro Shot",
    "type": "Electric",
    "category": "Special",
    "power": 130,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "No effect description."
  },
  "tera-starstorm": {
    "id": 906,
    "name": "Tera Starstorm",
    "type": "Normal",
    "category": "Special",
    "power": 120,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": "No effect description."
  },
  "fickle-beam": {
    "id": 907,
    "name": "Fickle Beam",
    "type": "Dragon",
    "category": "Special",
    "power": 80,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": "No effect description."
  },
  "burning-bulwark": {
    "id": 908,
    "name": "Burning Bulwark",
    "type": "Fire",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 4,
    "effect": "No effect description.",
    "statChanges": [],
    "target": "enemy"
  },
  "thunderclap": {
    "id": 909,
    "name": "Thunderclap",
    "type": "Electric",
    "category": "Special",
    "power": 70,
    "accuracy": 100,
    "pp": 5,
    "priority": 1,
    "effect": "No effect description."
  },
  "mighty-cleave": {
    "id": 910,
    "name": "Mighty Cleave",
    "type": "Rock",
    "category": "Physical",
    "power": 95,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": "No effect description."
  },
  "tachyon-cutter": {
    "id": 911,
    "name": "Tachyon Cutter",
    "type": "Steel",
    "category": "Special",
    "power": 50,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "No effect description."
  },
  "hard-press": {
    "id": 912,
    "name": "Hard Press",
    "type": "Steel",
    "category": "Physical",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "No effect description."
  },
  "dragon-cheer": {
    "id": 913,
    "name": "Dragon Cheer",
    "type": "Dragon",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "effect": "No effect description.",
    "statChanges": [],
    "target": "enemy"
  },
  "alluring-voice": {
    "id": 914,
    "name": "Alluring Voice",
    "type": "Fairy",
    "category": "Special",
    "power": 80,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "No effect description."
  },
  "temper-flare": {
    "id": 915,
    "name": "Temper Flare",
    "type": "Fire",
    "category": "Physical",
    "power": 75,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "No effect description."
  },
  "supercell-slam": {
    "id": 916,
    "name": "Supercell Slam",
    "type": "Electric",
    "category": "Physical",
    "power": 100,
    "accuracy": 95,
    "pp": 15,
    "priority": 0,
    "effect": "No effect description."
  },
  "psychic-noise": {
    "id": 917,
    "name": "Psychic Noise",
    "type": "Psychic",
    "category": "Special",
    "power": 75,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "effect": "No effect description."
  },
  "upper-hand": {
    "id": 918,
    "name": "Upper Hand",
    "type": "Fighting",
    "category": "Physical",
    "power": 65,
    "accuracy": 100,
    "pp": 15,
    "priority": 3,
    "effect": "No effect description."
  },
  "malignant-chain": {
    "id": 919,
    "name": "Malignant Chain",
    "type": "Poison",
    "category": "Special",
    "power": 100,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "effect": "No effect description."
  },
  "shadow-rush": {
    "id": 10001,
    "name": "Shadow Rush",
    "type": "Shadow",
    "category": "Physical",
    "power": 55,
    "accuracy": 100,
    "pp": 35,
    "priority": 0,
    "effect": "Has an increased chance for a critical hit in Hyper Mode."
  },
  "shadow-blast": {
    "id": 10002,
    "name": "Shadow Blast",
    "type": "Shadow",
    "category": "Physical",
    "power": 80,
    "accuracy": 100,
    "pp": 35,
    "priority": 0,
    "effect": "Has an increased chance for a critical hit."
  },
  "shadow-blitz": {
    "id": 10003,
    "name": "Shadow Blitz",
    "type": "Shadow",
    "category": "Physical",
    "power": 40,
    "accuracy": 100,
    "pp": 35,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "shadow-bolt": {
    "id": 10004,
    "name": "Shadow Bolt",
    "type": "Shadow",
    "category": "Special",
    "power": 75,
    "accuracy": 100,
    "pp": 35,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to paralyze the target."
  },
  "shadow-break": {
    "id": 10005,
    "name": "Shadow Break",
    "type": "Shadow",
    "category": "Physical",
    "power": 75,
    "accuracy": 100,
    "pp": 35,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "shadow-chill": {
    "id": 10006,
    "name": "Shadow Chill",
    "type": "Shadow",
    "category": "Special",
    "power": 75,
    "accuracy": 100,
    "pp": 35,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to freeze the target."
  },
  "shadow-end": {
    "id": 10007,
    "name": "Shadow End",
    "type": "Shadow",
    "category": "Physical",
    "power": 120,
    "accuracy": 60,
    "pp": 35,
    "priority": 0,
    "effect": "User receives 1/2 its HP in recoil."
  },
  "shadow-fire": {
    "id": 10008,
    "name": "Shadow Fire",
    "type": "Shadow",
    "category": "Special",
    "power": 75,
    "accuracy": 100,
    "pp": 35,
    "priority": 0,
    "effect": "Has a $effect_chance% chance to burn the target."
  },
  "shadow-rave": {
    "id": 10009,
    "name": "Shadow Rave",
    "type": "Shadow",
    "category": "Special",
    "power": 70,
    "accuracy": 100,
    "pp": 35,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "shadow-storm": {
    "id": 10010,
    "name": "Shadow Storm",
    "type": "Shadow",
    "category": "Special",
    "power": 95,
    "accuracy": 100,
    "pp": 35,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "shadow-wave": {
    "id": 10011,
    "name": "Shadow Wave",
    "type": "Shadow",
    "category": "Special",
    "power": 50,
    "accuracy": 100,
    "pp": 35,
    "priority": 0,
    "effect": "Inflicts regular damage with no additional effect."
  },
  "shadow-down": {
    "id": 10012,
    "name": "Shadow Down",
    "type": "Shadow",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 35,
    "priority": 0,
    "effect": "Lowers the target’s Defense by two stages.",
    "statChanges": [],
    "target": "enemy"
  },
  "shadow-half": {
    "id": 10013,
    "name": "Shadow Half",
    "type": "Shadow",
    "category": "Special",
    "power": 0,
    "accuracy": 100,
    "pp": 35,
    "priority": 0,
    "effect": "Halves HP of all Pokémon on the field.  Must recharge"
  },
  "shadow-hold": {
    "id": 10014,
    "name": "Shadow Hold",
    "type": "Shadow",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 35,
    "priority": 0,
    "effect": "Prevents the target from leaving battle.",
    "statChanges": [],
    "target": "enemy"
  },
  "shadow-mist": {
    "id": 10015,
    "name": "Shadow Mist",
    "type": "Shadow",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 35,
    "priority": 0,
    "effect": "Lowers the target’s evasion by two stages.",
    "statChanges": [],
    "target": "enemy"
  },
  "shadow-panic": {
    "id": 10016,
    "name": "Shadow Panic",
    "type": "Shadow",
    "category": "Status",
    "power": 0,
    "accuracy": 90,
    "pp": 35,
    "priority": 0,
    "effect": "Confuses the target.",
    "statChanges": [],
    "target": "enemy"
  },
  "shadow-shed": {
    "id": 10017,
    "name": "Shadow Shed",
    "type": "Shadow",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 35,
    "priority": 0,
    "effect": "Removes Light Screen, Reflect, and Safeguard.",
    "statChanges": [],
    "target": "enemy"
  },
  "shadow-sky": {
    "id": 10018,
    "name": "Shadow Sky",
    "type": "Shadow",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 35,
    "priority": 0,
    "effect": "Changes the weather to Shadow Sky for five turns.",
    "statChanges": [],
    "target": "enemy"
  }
};
