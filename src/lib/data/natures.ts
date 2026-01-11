/**
 * Pokemon Nature data (Gen 3+).
 *
 * Each nature has a stat that is increased (+10%) and one that is decreased (-10%).
 * Neutral natures (Hardy, Docile, Serious, Bashful, Quirky) have no effect.
 */

export interface Nature {
  id: number;
  name: string;
  increasedStat: StatType | null; // null for neutral
  decreasedStat: StatType | null; // null for neutral
}

export type StatType = "ATK" | "DEF" | "SPE" | "SPA" | "SPD";

export const NATURES: Nature[] = [
  { id: 0, name: "Hardy", increasedStat: null, decreasedStat: null },
  { id: 1, name: "Lonely", increasedStat: "ATK", decreasedStat: "DEF" },
  { id: 2, name: "Brave", increasedStat: "ATK", decreasedStat: "SPE" },
  { id: 3, name: "Adamant", increasedStat: "ATK", decreasedStat: "SPA" },
  { id: 4, name: "Naughty", increasedStat: "ATK", decreasedStat: "SPD" },
  { id: 5, name: "Bold", increasedStat: "DEF", decreasedStat: "ATK" },
  { id: 6, name: "Docile", increasedStat: null, decreasedStat: null },
  { id: 7, name: "Relaxed", increasedStat: "DEF", decreasedStat: "SPE" },
  { id: 8, name: "Impish", increasedStat: "DEF", decreasedStat: "SPA" },
  { id: 9, name: "Lax", increasedStat: "DEF", decreasedStat: "SPD" },
  { id: 10, name: "Timid", increasedStat: "SPE", decreasedStat: "ATK" },
  { id: 11, name: "Hasty", increasedStat: "SPE", decreasedStat: "DEF" },
  { id: 12, name: "Serious", increasedStat: null, decreasedStat: null },
  { id: 13, name: "Jolly", increasedStat: "SPE", decreasedStat: "SPA" },
  { id: 14, name: "Naive", increasedStat: "SPE", decreasedStat: "SPD" },
  { id: 15, name: "Modest", increasedStat: "SPA", decreasedStat: "ATK" },
  { id: 16, name: "Mild", increasedStat: "SPA", decreasedStat: "DEF" },
  { id: 17, name: "Quiet", increasedStat: "SPA", decreasedStat: "SPE" },
  { id: 18, name: "Bashful", increasedStat: null, decreasedStat: null },
  { id: 19, name: "Rash", increasedStat: "SPA", decreasedStat: "SPD" },
  { id: 20, name: "Calm", increasedStat: "SPD", decreasedStat: "ATK" },
  { id: 21, name: "Gentle", increasedStat: "SPD", decreasedStat: "DEF" },
  { id: 22, name: "Sassy", increasedStat: "SPD", decreasedStat: "SPE" },
  { id: 23, name: "Careful", increasedStat: "SPD", decreasedStat: "SPA" },
  { id: 24, name: "Quirky", increasedStat: null, decreasedStat: null },
];

/**
 * Get nature by ID
 */
export function getNature(id: number): Nature {
  if (id < 0 || id >= NATURES.length) {
    return NATURES[0];
  }
  return NATURES[id];
}

/**
 * Get nature name by ID
 */
export function getNatureName(id: number): string {
  return getNature(id).name;
}

/**
 * Get stat modifier for a nature and stat
 * Returns 1.1 for increased, 0.9 for decreased, 1.0 for neutral
 */
export function getNatureStatModifier(
  natureId: number,
  stat: StatType,
): number {
  const nature = getNature(natureId);
  if (nature.increasedStat === stat) return 1.1;
  if (nature.decreasedStat === stat) return 0.9;
  return 1.0;
}

/**
 * Get nature description
 */
export function getNatureDescription(id: number): string {
  const nature = getNature(id);
  if (!nature.increasedStat) {
    return `${nature.name} (Neutral)`;
  }
  return `${nature.name} (+${nature.increasedStat}, -${nature.decreasedStat})`;
}

/**
 * Find natures that boost a specific stat
 */
export function getNaturesWithIncreasedStat(stat: StatType): Nature[] {
  return NATURES.filter((n) => n.increasedStat === stat);
}

/**
 * Find natures that lower a specific stat
 */
export function getNaturesWithDecreasedStat(stat: StatType): Nature[] {
  return NATURES.filter((n) => n.decreasedStat === stat);
}
