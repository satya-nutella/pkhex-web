/**
 * Pokemon Evolution Data.
 *
 * Defines evolution chains and methods for Gen 1-3 Pokemon.
 */

export type EvolutionMethod =
  | "level" // Level up at or above specified level
  | "item" // Use evolution stone
  | "trade" // Trade
  | "trade_item" // Trade while holding item
  | "friendship" // High friendship (Gen 2+)
  | "time" // Time of day (Gen 2+)
  | "happiness_day" // Friendship + daytime
  | "happiness_night" // Friendship + nighttime
  | "beauty" // High beauty stat (Gen 3)
  | "special"; // Special condition

export interface Evolution {
  from: number; // From species
  to: number; // To species
  method: EvolutionMethod;
  level?: number; // Level required (for level method)
  item?: string; // Item name (for item/trade_item methods)
}

// Gen 1 evolutions
export const EVOLUTIONS_GEN1: Evolution[] = [
  // Bulbasaur line
  { from: 1, to: 2, method: "level", level: 16 },
  { from: 2, to: 3, method: "level", level: 32 },
  // Charmander line
  { from: 4, to: 5, method: "level", level: 16 },
  { from: 5, to: 6, method: "level", level: 36 },
  // Squirtle line
  { from: 7, to: 8, method: "level", level: 16 },
  { from: 8, to: 9, method: "level", level: 36 },
  // Caterpie line
  { from: 10, to: 11, method: "level", level: 7 },
  { from: 11, to: 12, method: "level", level: 10 },
  // Weedle line
  { from: 13, to: 14, method: "level", level: 7 },
  { from: 14, to: 15, method: "level", level: 10 },
  // Pidgey line
  { from: 16, to: 17, method: "level", level: 18 },
  { from: 17, to: 18, method: "level", level: 36 },
  // Rattata line
  { from: 19, to: 20, method: "level", level: 20 },
  // Spearow line
  { from: 21, to: 22, method: "level", level: 20 },
  // Ekans line
  { from: 23, to: 24, method: "level", level: 22 },
  // Pikachu line
  { from: 25, to: 26, method: "item", item: "Thunder Stone" },
  // Sandshrew line
  { from: 27, to: 28, method: "level", level: 22 },
  // Nidoran line
  { from: 29, to: 30, method: "level", level: 16 },
  { from: 30, to: 31, method: "item", item: "Moon Stone" },
  { from: 32, to: 33, method: "level", level: 16 },
  { from: 33, to: 34, method: "item", item: "Moon Stone" },
  // Clefairy line
  { from: 35, to: 36, method: "item", item: "Moon Stone" },
  // Vulpix line
  { from: 37, to: 38, method: "item", item: "Fire Stone" },
  // Jigglypuff line
  { from: 39, to: 40, method: "item", item: "Moon Stone" },
  // Zubat line
  { from: 41, to: 42, method: "level", level: 22 },
  // Oddish line
  { from: 43, to: 44, method: "level", level: 21 },
  { from: 44, to: 45, method: "item", item: "Leaf Stone" },
  // Paras line
  { from: 46, to: 47, method: "level", level: 24 },
  // Venonat line
  { from: 48, to: 49, method: "level", level: 31 },
  // Diglett line
  { from: 50, to: 51, method: "level", level: 26 },
  // Meowth line
  { from: 52, to: 53, method: "level", level: 28 },
  // Psyduck line
  { from: 54, to: 55, method: "level", level: 33 },
  // Mankey line
  { from: 56, to: 57, method: "level", level: 28 },
  // Growlithe line
  { from: 58, to: 59, method: "item", item: "Fire Stone" },
  // Poliwag line
  { from: 60, to: 61, method: "level", level: 25 },
  { from: 61, to: 62, method: "item", item: "Water Stone" },
  // Abra line
  { from: 63, to: 64, method: "level", level: 16 },
  { from: 64, to: 65, method: "trade" },
  // Machop line
  { from: 66, to: 67, method: "level", level: 28 },
  { from: 67, to: 68, method: "trade" },
  // Bellsprout line
  { from: 69, to: 70, method: "level", level: 21 },
  { from: 70, to: 71, method: "item", item: "Leaf Stone" },
  // Tentacool line
  { from: 72, to: 73, method: "level", level: 30 },
  // Geodude line
  { from: 74, to: 75, method: "level", level: 25 },
  { from: 75, to: 76, method: "trade" },
  // Ponyta line
  { from: 77, to: 78, method: "level", level: 40 },
  // Slowpoke line
  { from: 79, to: 80, method: "level", level: 37 },
  // Magnemite line
  { from: 81, to: 82, method: "level", level: 30 },
  // Doduo line
  { from: 84, to: 85, method: "level", level: 31 },
  // Seel line
  { from: 86, to: 87, method: "level", level: 34 },
  // Grimer line
  { from: 88, to: 89, method: "level", level: 38 },
  // Shellder line
  { from: 90, to: 91, method: "item", item: "Water Stone" },
  // Gastly line
  { from: 92, to: 93, method: "level", level: 25 },
  { from: 93, to: 94, method: "trade" },
  // Drowzee line
  { from: 96, to: 97, method: "level", level: 26 },
  // Krabby line
  { from: 98, to: 99, method: "level", level: 28 },
  // Voltorb line
  { from: 100, to: 101, method: "level", level: 30 },
  // Exeggcute line
  { from: 102, to: 103, method: "item", item: "Leaf Stone" },
  // Cubone line
  { from: 104, to: 105, method: "level", level: 28 },
  // Koffing line
  { from: 109, to: 110, method: "level", level: 35 },
  // Rhyhorn line
  { from: 111, to: 112, method: "level", level: 42 },
  // Horsea line
  { from: 116, to: 117, method: "level", level: 32 },
  // Goldeen line
  { from: 118, to: 119, method: "level", level: 33 },
  // Staryu line
  { from: 120, to: 121, method: "item", item: "Water Stone" },
  // Magikarp line
  { from: 129, to: 130, method: "level", level: 20 },
  // Eevee line
  { from: 133, to: 134, method: "item", item: "Water Stone" },
  { from: 133, to: 135, method: "item", item: "Thunder Stone" },
  { from: 133, to: 136, method: "item", item: "Fire Stone" },
  // Omanyte line
  { from: 138, to: 139, method: "level", level: 40 },
  // Kabuto line
  { from: 140, to: 141, method: "level", level: 40 },
  // Dratini line
  { from: 147, to: 148, method: "level", level: 30 },
  { from: 148, to: 149, method: "level", level: 55 },
];

// Gen 2 additions (includes Gen 1 pre-evolutions and evolutions)
export const EVOLUTIONS_GEN2: Evolution[] = [
  ...EVOLUTIONS_GEN1,
  // Pichu -> Pikachu
  { from: 172, to: 25, method: "friendship" },
  // Cleffa -> Clefairy
  { from: 173, to: 35, method: "friendship" },
  // Igglybuff -> Jigglypuff
  { from: 174, to: 39, method: "friendship" },
  // Togepi -> Togetic
  { from: 175, to: 176, method: "friendship" },
  // Eevee -> Espeon/Umbreon
  { from: 133, to: 196, method: "happiness_day" },
  { from: 133, to: 197, method: "happiness_night" },
  // Golbat -> Crobat
  { from: 42, to: 169, method: "friendship" },
  // Bellossom (Gloom)
  { from: 44, to: 182, method: "item", item: "Sun Stone" },
  // Politoed (Poliwhirl)
  { from: 61, to: 186, method: "trade_item", item: "King's Rock" },
  // Slowking (Slowpoke)
  { from: 79, to: 199, method: "trade_item", item: "King's Rock" },
  // Steelix (Onix)
  { from: 95, to: 208, method: "trade_item", item: "Metal Coat" },
  // Scizor (Scyther)
  { from: 123, to: 212, method: "trade_item", item: "Metal Coat" },
  // Kingdra (Seadra)
  { from: 117, to: 230, method: "trade_item", item: "Dragon Scale" },
  // Porygon2 (Porygon)
  { from: 137, to: 233, method: "trade_item", item: "Up-Grade" },
  // Tyrogue evolutions
  { from: 236, to: 106, method: "level", level: 20 }, // ATK > DEF
  { from: 236, to: 107, method: "level", level: 20 }, // ATK < DEF
  { from: 236, to: 237, method: "level", level: 20 }, // ATK = DEF
  // Gen 2 base evolutions
  { from: 152, to: 153, method: "level", level: 16 },
  { from: 153, to: 154, method: "level", level: 32 },
  { from: 155, to: 156, method: "level", level: 14 },
  { from: 156, to: 157, method: "level", level: 36 },
  { from: 158, to: 159, method: "level", level: 18 },
  { from: 159, to: 160, method: "level", level: 30 },
  { from: 161, to: 162, method: "level", level: 15 },
  { from: 163, to: 164, method: "level", level: 20 },
  { from: 165, to: 166, method: "level", level: 18 },
  { from: 167, to: 168, method: "level", level: 22 },
  { from: 170, to: 171, method: "level", level: 27 },
  { from: 177, to: 178, method: "level", level: 25 },
  { from: 179, to: 180, method: "level", level: 15 },
  { from: 180, to: 181, method: "level", level: 30 },
  { from: 183, to: 184, method: "level", level: 18 },
  { from: 187, to: 188, method: "level", level: 18 },
  { from: 188, to: 189, method: "level", level: 27 },
  { from: 191, to: 192, method: "item", item: "Sun Stone" },
  { from: 194, to: 195, method: "level", level: 20 },
  { from: 204, to: 205, method: "level", level: 31 },
  { from: 209, to: 210, method: "level", level: 23 },
  { from: 218, to: 219, method: "level", level: 38 },
  { from: 220, to: 221, method: "level", level: 33 },
  { from: 223, to: 224, method: "level", level: 25 },
  { from: 228, to: 229, method: "level", level: 24 },
  { from: 231, to: 232, method: "level", level: 25 },
  { from: 246, to: 247, method: "level", level: 30 },
  { from: 247, to: 248, method: "level", level: 55 },
];

// Gen 3 additions
export const EVOLUTIONS_GEN3: Evolution[] = [
  ...EVOLUTIONS_GEN2,
  // Treecko line
  { from: 252, to: 253, method: "level", level: 16 },
  { from: 253, to: 254, method: "level", level: 36 },
  // Torchic line
  { from: 255, to: 256, method: "level", level: 16 },
  { from: 256, to: 257, method: "level", level: 36 },
  // Mudkip line
  { from: 258, to: 259, method: "level", level: 16 },
  { from: 259, to: 260, method: "level", level: 36 },
  // Poochyena line
  { from: 261, to: 262, method: "level", level: 18 },
  // Zigzagoon line
  { from: 263, to: 264, method: "level", level: 20 },
  // Wurmple split evolution
  { from: 265, to: 266, method: "level", level: 7 },
  { from: 265, to: 268, method: "level", level: 7 },
  { from: 266, to: 267, method: "level", level: 10 },
  { from: 268, to: 269, method: "level", level: 10 },
  // Lotad line
  { from: 270, to: 271, method: "level", level: 14 },
  { from: 271, to: 272, method: "item", item: "Water Stone" },
  // Seedot line
  { from: 273, to: 274, method: "level", level: 14 },
  { from: 274, to: 275, method: "item", item: "Leaf Stone" },
  // Taillow line
  { from: 276, to: 277, method: "level", level: 22 },
  // Wingull line
  { from: 278, to: 279, method: "level", level: 25 },
  // Ralts line
  { from: 280, to: 281, method: "level", level: 20 },
  { from: 281, to: 282, method: "level", level: 30 },
  // Surskit line
  { from: 283, to: 284, method: "level", level: 22 },
  // Shroomish line
  { from: 285, to: 286, method: "level", level: 23 },
  // Slakoth line
  { from: 287, to: 288, method: "level", level: 18 },
  { from: 288, to: 289, method: "level", level: 36 },
  // Nincada line (special split evolution)
  { from: 290, to: 291, method: "level", level: 20 },
  { from: 290, to: 292, method: "special" }, // Shedinja
  // Whismur line
  { from: 293, to: 294, method: "level", level: 20 },
  { from: 294, to: 295, method: "level", level: 40 },
  // Makuhita line
  { from: 296, to: 297, method: "level", level: 24 },
  // Azurill
  { from: 298, to: 183, method: "friendship" },
  // Nosepass
  // Skitty line
  { from: 300, to: 301, method: "item", item: "Moon Stone" },
  // Aron line
  { from: 304, to: 305, method: "level", level: 32 },
  { from: 305, to: 306, method: "level", level: 42 },
  // Meditite line
  { from: 307, to: 308, method: "level", level: 37 },
  // Electrike line
  { from: 309, to: 310, method: "level", level: 26 },
  // Gulpin line
  { from: 316, to: 317, method: "level", level: 26 },
  // Carvanha line
  { from: 318, to: 319, method: "level", level: 30 },
  // Wailmer line
  { from: 320, to: 321, method: "level", level: 40 },
  // Numel line
  { from: 322, to: 323, method: "level", level: 33 },
  // Spoink line
  { from: 325, to: 326, method: "level", level: 32 },
  // Trapinch line
  { from: 328, to: 329, method: "level", level: 35 },
  { from: 329, to: 330, method: "level", level: 45 },
  // Cacnea line
  { from: 331, to: 332, method: "level", level: 32 },
  // Swablu line
  { from: 333, to: 334, method: "level", level: 35 },
  // Barboach line
  { from: 339, to: 340, method: "level", level: 30 },
  // Corphish line
  { from: 341, to: 342, method: "level", level: 30 },
  // Baltoy line
  { from: 343, to: 344, method: "level", level: 36 },
  // Lileep line
  { from: 345, to: 346, method: "level", level: 40 },
  // Anorith line
  { from: 347, to: 348, method: "level", level: 40 },
  // Feebas -> Milotic
  { from: 349, to: 350, method: "beauty" },
  // Shuppet line
  { from: 353, to: 354, method: "level", level: 37 },
  // Duskull line
  { from: 355, to: 356, method: "level", level: 37 },
  // Wynaut
  { from: 360, to: 202, method: "level", level: 15 },
  // Snorunt line
  { from: 361, to: 362, method: "level", level: 42 },
  // Spheal line
  { from: 363, to: 364, method: "level", level: 32 },
  { from: 364, to: 365, method: "level", level: 44 },
  // Clamperl split evolution
  { from: 366, to: 367, method: "trade_item", item: "Deep Sea Tooth" },
  { from: 366, to: 368, method: "trade_item", item: "Deep Sea Scale" },
  // Bagon line
  { from: 371, to: 372, method: "level", level: 30 },
  { from: 372, to: 373, method: "level", level: 50 },
  // Beldum line
  { from: 374, to: 375, method: "level", level: 20 },
  { from: 375, to: 376, method: "level", level: 45 },
];

/**
 * Get evolution data for a generation.
 */
export function getEvolutions(generation: number): Evolution[] {
  if (generation === 1) return EVOLUTIONS_GEN1;
  if (generation === 2) return EVOLUTIONS_GEN2;
  return EVOLUTIONS_GEN3;
}

/**
 * Get all evolutions from a species.
 */
export function getEvolutionsFrom(
  species: number,
  generation: number,
): Evolution[] {
  const evolutions = getEvolutions(generation);
  return evolutions.filter((e) => e.from === species);
}

/**
 * Get evolution to a species.
 */
export function getEvolutionTo(
  species: number,
  generation: number,
): Evolution | null {
  const evolutions = getEvolutions(generation);
  return evolutions.find((e) => e.to === species) || null;
}

/**
 * Get the full evolution chain for a species.
 * Returns array of species IDs in order (base -> final)
 */
export function getEvolutionChain(
  species: number,
  generation: number,
): number[] {
  const evolutions = getEvolutions(generation);
  const chain: number[] = [];

  // Find the base form first
  let base = species;
  let prev = evolutions.find((e) => e.to === base);
  while (prev) {
    base = prev.from;
    prev = evolutions.find((e) => e.to === base);
  }

  // Build chain from base
  const visited = new Set<number>();
  const queue = [base];

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (visited.has(current)) continue;
    visited.add(current);
    chain.push(current);

    // Add evolutions
    const nextEvos = evolutions.filter((e) => e.from === current);
    for (const evo of nextEvos) {
      if (!visited.has(evo.to)) {
        queue.push(evo.to);
      }
    }
  }

  return chain;
}

/**
 * Get evolution description text.
 */
export function getEvolutionDescription(evo: Evolution): string {
  switch (evo.method) {
    case "level":
      return `Level ${evo.level}`;
    case "item":
      return evo.item || "Evolution Stone";
    case "trade":
      return "Trade";
    case "trade_item":
      return `Trade with ${evo.item}`;
    case "friendship":
      return "Friendship";
    case "happiness_day":
      return "Friendship (Day)";
    case "happiness_night":
      return "Friendship (Night)";
    case "beauty":
      return "Max Beauty";
    case "special":
      return "Special";
    default:
      return "???";
  }
}
