/**
 * Pokemon type data.
 */

// Pokemon types (Gen 1 uses different internal IDs than later gens)
export enum PokemonType {
  Normal = 0,
  Fighting = 1,
  Flying = 2,
  Poison = 3,
  Ground = 4,
  Rock = 5,
  Bug = 7, // Note: 6 is skipped in Gen 1
  Ghost = 8,
  // 9-19 unused in Gen 1
  Fire = 20,
  Water = 21,
  Grass = 22,
  Electric = 23,
  Psychic = 24,
  Ice = 25,
  Dragon = 26,
}

// Type names
export const TYPE_NAMES: Record<number, string> = {
  [PokemonType.Normal]: "Normal",
  [PokemonType.Fighting]: "Fighting",
  [PokemonType.Flying]: "Flying",
  [PokemonType.Poison]: "Poison",
  [PokemonType.Ground]: "Ground",
  [PokemonType.Rock]: "Rock",
  [PokemonType.Bug]: "Bug",
  [PokemonType.Ghost]: "Ghost",
  [PokemonType.Fire]: "Fire",
  [PokemonType.Water]: "Water",
  [PokemonType.Grass]: "Grass",
  [PokemonType.Electric]: "Electric",
  [PokemonType.Psychic]: "Psychic",
  [PokemonType.Ice]: "Ice",
  [PokemonType.Dragon]: "Dragon",
};

/**
 * Get type name from type ID.
 */
export function getTypeName(typeId: number): string {
  return TYPE_NAMES[typeId] ?? "Unknown";
}

// Gen 1 base stats for each species
// Format: [HP, Attack, Defense, Speed, Special]
export const BASE_STATS_1: number[][] = [
  [0, 0, 0, 0, 0], // 0 - None
  [45, 49, 49, 45, 65], // 1 - Bulbasaur
  [60, 62, 63, 60, 80], // 2 - Ivysaur
  [80, 82, 83, 80, 100], // 3 - Venusaur
  [39, 52, 43, 65, 50], // 4 - Charmander
  [58, 64, 58, 80, 65], // 5 - Charmeleon
  [78, 84, 78, 100, 85], // 6 - Charizard
  [44, 48, 65, 43, 50], // 7 - Squirtle
  [59, 63, 80, 58, 65], // 8 - Wartortle
  [79, 83, 100, 78, 85], // 9 - Blastoise
  [45, 30, 35, 45, 20], // 10 - Caterpie
  [50, 20, 55, 30, 25], // 11 - Metapod
  [60, 45, 50, 70, 80], // 12 - Butterfree
  [40, 35, 30, 50, 20], // 13 - Weedle
  [45, 25, 50, 35, 25], // 14 - Kakuna
  [65, 80, 40, 75, 45], // 15 - Beedrill
  [40, 45, 40, 56, 35], // 16 - Pidgey
  [63, 60, 55, 71, 50], // 17 - Pidgeotto
  [83, 80, 75, 91, 70], // 18 - Pidgeot
  [30, 56, 35, 72, 25], // 19 - Rattata
  [55, 81, 60, 97, 50], // 20 - Raticate
  [40, 60, 30, 70, 31], // 21 - Spearow
  [65, 90, 65, 100, 61], // 22 - Fearow
  [35, 60, 44, 55, 40], // 23 - Ekans
  [60, 85, 69, 80, 65], // 24 - Arbok
  [35, 55, 30, 90, 50], // 25 - Pikachu
  [60, 90, 55, 100, 90], // 26 - Raichu
  [50, 75, 85, 40, 30], // 27 - Sandshrew
  [75, 100, 110, 65, 55], // 28 - Sandslash
  [55, 47, 52, 41, 40], // 29 - Nidoran♀
  [70, 62, 67, 56, 55], // 30 - Nidorina
  [90, 82, 87, 76, 75], // 31 - Nidoqueen
  [46, 57, 40, 50, 40], // 32 - Nidoran♂
  [61, 72, 57, 65, 55], // 33 - Nidorino
  [81, 92, 77, 85, 75], // 34 - Nidoking
  [70, 45, 48, 35, 60], // 35 - Clefairy
  [95, 70, 73, 60, 85], // 36 - Clefable
  [38, 41, 40, 65, 65], // 37 - Vulpix
  [73, 76, 75, 100, 100], // 38 - Ninetales
  [115, 45, 20, 20, 25], // 39 - Jigglypuff
  [140, 70, 45, 45, 50], // 40 - Wigglytuff
  [40, 45, 35, 55, 40], // 41 - Zubat
  [75, 80, 70, 90, 75], // 42 - Golbat
  [45, 50, 55, 30, 75], // 43 - Oddish
  [60, 65, 70, 40, 85], // 44 - Gloom
  [75, 80, 85, 50, 100], // 45 - Vileplume
  [35, 70, 55, 25, 55], // 46 - Paras
  [60, 95, 80, 30, 80], // 47 - Parasect
  [60, 55, 50, 45, 40], // 48 - Venonat
  [70, 65, 60, 90, 90], // 49 - Venomoth
  [10, 55, 25, 95, 45], // 50 - Diglett
  [35, 80, 50, 120, 70], // 51 - Dugtrio
  [40, 45, 35, 90, 40], // 52 - Meowth
  [65, 70, 60, 115, 65], // 53 - Persian
  [50, 52, 48, 55, 50], // 54 - Psyduck
  [80, 82, 78, 85, 80], // 55 - Golduck
  [40, 80, 35, 70, 35], // 56 - Mankey
  [65, 105, 60, 95, 60], // 57 - Primeape
  [55, 70, 45, 60, 50], // 58 - Growlithe
  [90, 110, 80, 95, 80], // 59 - Arcanine
  [40, 50, 40, 90, 40], // 60 - Poliwag
  [65, 65, 65, 90, 50], // 61 - Poliwhirl
  [90, 85, 95, 70, 70], // 62 - Poliwrath
  [25, 20, 15, 90, 105], // 63 - Abra
  [40, 35, 30, 105, 120], // 64 - Kadabra
  [55, 50, 45, 120, 135], // 65 - Alakazam
  [70, 80, 50, 35, 35], // 66 - Machop
  [80, 100, 70, 45, 50], // 67 - Machoke
  [90, 130, 80, 55, 65], // 68 - Machamp
  [50, 75, 35, 40, 70], // 69 - Bellsprout
  [65, 90, 50, 55, 85], // 70 - Weepinbell
  [80, 105, 65, 70, 100], // 71 - Victreebel
  [40, 40, 35, 70, 100], // 72 - Tentacool
  [80, 70, 65, 100, 120], // 73 - Tentacruel
  [40, 80, 100, 20, 30], // 74 - Geodude
  [55, 95, 115, 35, 45], // 75 - Graveler
  [80, 110, 130, 45, 55], // 76 - Golem
  [50, 85, 55, 90, 65], // 77 - Ponyta
  [65, 100, 70, 105, 80], // 78 - Rapidash
  [90, 65, 65, 15, 40], // 79 - Slowpoke
  [95, 75, 110, 30, 80], // 80 - Slowbro
  [25, 35, 70, 45, 95], // 81 - Magnemite
  [50, 60, 95, 70, 120], // 82 - Magneton
  [52, 65, 55, 60, 58], // 83 - Farfetch'd
  [35, 85, 45, 75, 35], // 84 - Doduo
  [60, 110, 70, 100, 60], // 85 - Dodrio
  [65, 45, 55, 45, 70], // 86 - Seel
  [90, 70, 80, 70, 95], // 87 - Dewgong
  [80, 80, 50, 25, 40], // 88 - Grimer
  [105, 105, 75, 50, 65], // 89 - Muk
  [30, 65, 100, 40, 45], // 90 - Shellder
  [50, 95, 180, 70, 85], // 91 - Cloyster
  [30, 35, 30, 80, 100], // 92 - Gastly
  [45, 50, 45, 95, 115], // 93 - Haunter
  [60, 65, 60, 110, 130], // 94 - Gengar
  [35, 45, 160, 70, 30], // 95 - Onix
  [60, 48, 45, 42, 90], // 96 - Drowzee
  [85, 73, 70, 67, 115], // 97 - Hypno
  [30, 105, 90, 50, 25], // 98 - Krabby
  [55, 130, 115, 75, 50], // 99 - Kingler
  [40, 30, 50, 100, 55], // 100 - Voltorb
  [60, 50, 70, 140, 80], // 101 - Electrode
  [60, 40, 80, 40, 60], // 102 - Exeggcute
  [95, 95, 85, 55, 125], // 103 - Exeggutor
  [50, 50, 95, 35, 40], // 104 - Cubone
  [60, 80, 110, 45, 50], // 105 - Marowak
  [50, 120, 53, 87, 35], // 106 - Hitmonlee
  [50, 105, 79, 76, 35], // 107 - Hitmonchan
  [90, 55, 75, 30, 60], // 108 - Lickitung
  [40, 65, 95, 35, 60], // 109 - Koffing
  [65, 90, 120, 60, 85], // 110 - Weezing
  [80, 85, 95, 25, 30], // 111 - Rhyhorn
  [105, 130, 120, 40, 45], // 112 - Rhydon
  [250, 5, 5, 50, 105], // 113 - Chansey
  [65, 55, 115, 60, 100], // 114 - Tangela
  [105, 95, 80, 90, 40], // 115 - Kangaskhan
  [30, 40, 70, 60, 70], // 116 - Horsea
  [55, 65, 95, 85, 95], // 117 - Seadra
  [45, 67, 60, 63, 50], // 118 - Goldeen
  [80, 92, 65, 68, 80], // 119 - Seaking
  [30, 45, 55, 85, 70], // 120 - Staryu
  [60, 75, 85, 115, 100], // 121 - Starmie
  [40, 45, 65, 90, 100], // 122 - Mr. Mime
  [70, 110, 80, 105, 55], // 123 - Scyther
  [65, 50, 35, 95, 95], // 124 - Jynx
  [65, 83, 57, 105, 85], // 125 - Electabuzz
  [65, 95, 57, 93, 85], // 126 - Magmar
  [65, 125, 100, 85, 55], // 127 - Pinsir
  [75, 100, 95, 110, 70], // 128 - Tauros
  [20, 10, 55, 80, 20], // 129 - Magikarp
  [95, 125, 79, 81, 100], // 130 - Gyarados
  [130, 85, 80, 60, 95], // 131 - Lapras
  [48, 48, 48, 48, 48], // 132 - Ditto
  [55, 55, 50, 55, 65], // 133 - Eevee
  [130, 65, 60, 65, 110], // 134 - Vaporeon
  [65, 65, 60, 130, 110], // 135 - Jolteon
  [65, 130, 60, 65, 110], // 136 - Flareon
  [65, 60, 70, 40, 75], // 137 - Porygon
  [35, 40, 100, 35, 90], // 138 - Omanyte
  [70, 60, 125, 55, 115], // 139 - Omastar
  [30, 80, 90, 55, 45], // 140 - Kabuto
  [60, 115, 105, 80, 70], // 141 - Kabutops
  [80, 105, 65, 130, 60], // 142 - Aerodactyl
  [160, 110, 65, 30, 65], // 143 - Snorlax
  [90, 85, 100, 85, 125], // 144 - Articuno
  [90, 90, 85, 100, 125], // 145 - Zapdos
  [90, 100, 90, 90, 125], // 146 - Moltres
  [41, 64, 45, 50, 50], // 147 - Dratini
  [61, 84, 65, 70, 70], // 148 - Dragonair
  [91, 134, 95, 80, 100], // 149 - Dragonite
  [106, 110, 90, 130, 154], // 150 - Mewtwo
  [100, 100, 100, 100, 100], // 151 - Mew
];

/**
 * Get base stats for a species.
 */
export function getBaseStats1(species: number): number[] {
  if (species < 0 || species >= BASE_STATS_1.length) {
    return [0, 0, 0, 0, 0];
  }
  return BASE_STATS_1[species];
}
