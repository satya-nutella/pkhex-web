/**
 * Pokemon Stat Calculator.
 *
 * Formulas differ by generation:
 * - Gen 1-2: DV system (0-15), EVs (0-65535), no natures
 * - Gen 3+: IV system (0-31), EVs (0-255, 510 total), natures affect stats
 */

import { getBaseStats, BaseStats } from "../../data/personal";
import { getNatureStatModifier, StatType } from "../../data/natures";

/**
 * Calculate HP stat for Gen 1-2 (DV system)
 */
export function calculateHPGen12(
  base: number,
  dv: number,
  ev: number,
  level: number,
): number {
  // HP = floor(((Base + DV) * 2 + floor(sqrt(EV) / 4)) * Level / 100) + Level + 10
  const evContrib = Math.floor(Math.sqrt(ev) / 4);
  return Math.floor((((base + dv) * 2 + evContrib) * level) / 100) + level + 10;
}

/**
 * Calculate other stats for Gen 1-2 (DV system)
 */
export function calculateStatGen12(
  base: number,
  dv: number,
  ev: number,
  level: number,
): number {
  // Stat = floor(((Base + DV) * 2 + floor(sqrt(EV) / 4)) * Level / 100) + 5
  const evContrib = Math.floor(Math.sqrt(ev) / 4);
  return Math.floor((((base + dv) * 2 + evContrib) * level) / 100) + 5;
}

/**
 * Calculate HP stat for Gen 3+ (IV system)
 */
export function calculateHPGen3(
  base: number,
  iv: number,
  ev: number,
  level: number,
): number {
  // HP = floor((2 * Base + IV + floor(EV / 4)) * Level / 100) + Level + 10
  // Special case: Shedinja always has 1 HP
  const evContrib = Math.floor(ev / 4);
  return Math.floor(((2 * base + iv + evContrib) * level) / 100) + level + 10;
}

/**
 * Calculate other stats for Gen 3+ (IV system)
 */
export function calculateStatGen3(
  base: number,
  iv: number,
  ev: number,
  level: number,
  natureModifier: number = 1.0,
): number {
  // Stat = floor((floor((2 * Base + IV + floor(EV / 4)) * Level / 100) + 5) * Nature)
  const evContrib = Math.floor(ev / 4);
  const raw = Math.floor(((2 * base + iv + evContrib) * level) / 100) + 5;
  return Math.floor(raw * natureModifier);
}

/**
 * Calculate all stats for Gen 1-2
 */
export function calculateAllStatsGen12(
  species: number,
  level: number,
  dvs: { hp: number; atk: number; def: number; spe: number; spc: number },
  evs: { hp: number; atk: number; def: number; spe: number; spc: number },
): { hp: number; atk: number; def: number; spe: number; spc: number } {
  const base = getBaseStats(species, 1);

  return {
    hp: calculateHPGen12(base.hp, dvs.hp, evs.hp, level),
    atk: calculateStatGen12(base.atk, dvs.atk, evs.atk, level),
    def: calculateStatGen12(base.def, dvs.def, evs.def, level),
    spe: calculateStatGen12(base.spe, dvs.spe, evs.spe, level),
    spc: calculateStatGen12(base.spa, dvs.spc, evs.spc, level), // Gen 1-2 use combined Special
  };
}

/**
 * Calculate all stats for Gen 3+
 */
export function calculateAllStatsGen3(
  species: number,
  level: number,
  ivs: {
    hp: number;
    atk: number;
    def: number;
    spe: number;
    spa: number;
    spd: number;
  },
  evs: {
    hp: number;
    atk: number;
    def: number;
    spe: number;
    spa: number;
    spd: number;
  },
  natureId: number,
): {
  hp: number;
  atk: number;
  def: number;
  spe: number;
  spa: number;
  spd: number;
} {
  const base = getBaseStats(species, 3);

  return {
    hp: calculateHPGen3(base.hp, ivs.hp, evs.hp, level),
    atk: calculateStatGen3(
      base.atk,
      ivs.atk,
      evs.atk,
      level,
      getNatureStatModifier(natureId, "ATK"),
    ),
    def: calculateStatGen3(
      base.def,
      ivs.def,
      evs.def,
      level,
      getNatureStatModifier(natureId, "DEF"),
    ),
    spe: calculateStatGen3(
      base.spe,
      ivs.spe,
      evs.spe,
      level,
      getNatureStatModifier(natureId, "SPE"),
    ),
    spa: calculateStatGen3(
      base.spa,
      ivs.spa,
      evs.spa,
      level,
      getNatureStatModifier(natureId, "SPA"),
    ),
    spd: calculateStatGen3(
      base.spd,
      ivs.spd,
      evs.spd,
      level,
      getNatureStatModifier(natureId, "SPD"),
    ),
  };
}

/**
 * Calculate HP DV from other DVs (Gen 1-2)
 * HP DV = ((ATK DV & 1) << 3) | ((DEF DV & 1) << 2) | ((SPE DV & 1) << 1) | (SPC DV & 1)
 */
export function calculateHPDV(
  atkDV: number,
  defDV: number,
  speDV: number,
  spcDV: number,
): number {
  return (
    ((atkDV & 1) << 3) | ((defDV & 1) << 2) | ((speDV & 1) << 1) | (spcDV & 1)
  );
}

/**
 * Reverse calculate IVs from known stats (approximate)
 * This is useful for determining IVs when you know the final stats
 */
export function reverseCalculateIVGen3(
  base: number,
  stat: number,
  ev: number,
  level: number,
  natureModifier: number,
  isHP: boolean,
): number {
  // Work backwards from the formula
  if (isHP) {
    // HP = floor((2 * Base + IV + floor(EV / 4)) * Level / 100) + Level + 10
    // IV = ((HP - Level - 10) * 100 / Level) - 2 * Base - floor(EV / 4)
    const evContrib = Math.floor(ev / 4);
    const iv = Math.round(
      ((stat - level - 10) * 100) / level - 2 * base - evContrib,
    );
    return Math.max(0, Math.min(31, iv));
  } else {
    // Stat = floor((floor((2 * Base + IV + floor(EV / 4)) * Level / 100) + 5) * Nature)
    // This is harder to reverse because of the floor operations
    const evContrib = Math.floor(ev / 4);
    const beforeNature = stat / natureModifier;
    const iv = Math.round(
      ((beforeNature - 5) * 100) / level - 2 * base - evContrib,
    );
    return Math.max(0, Math.min(31, iv));
  }
}

/**
 * Calculate experience needed for a level
 * Different Pokemon have different growth rates
 */
export type GrowthRate =
  | "erratic"
  | "fast"
  | "medium-fast"
  | "medium-slow"
  | "slow"
  | "fluctuating";

export function getExpForLevel(level: number, growthRate: GrowthRate): number {
  switch (growthRate) {
    case "fast":
      return Math.floor((4 * Math.pow(level, 3)) / 5);
    case "medium-fast":
      return Math.pow(level, 3);
    case "medium-slow":
      return Math.floor(
        (6 * Math.pow(level, 3)) / 5 -
          15 * Math.pow(level, 2) +
          100 * level -
          140,
      );
    case "slow":
      return Math.floor((5 * Math.pow(level, 3)) / 4);
    case "erratic":
      if (level <= 50)
        return Math.floor((Math.pow(level, 3) * (100 - level)) / 50);
      if (level <= 68)
        return Math.floor((Math.pow(level, 3) * (150 - level)) / 100);
      if (level <= 98)
        return Math.floor(
          (Math.pow(level, 3) * ((1911 - 10 * level) / 3)) / 500,
        );
      return Math.floor((Math.pow(level, 3) * (160 - level)) / 100);
    case "fluctuating":
      if (level <= 15)
        return Math.floor((Math.pow(level, 3) * ((level + 1) / 3 + 24)) / 50);
      if (level <= 36)
        return Math.floor((Math.pow(level, 3) * (level + 14)) / 50);
      return Math.floor((Math.pow(level, 3) * (level / 2 + 32)) / 50);
    default:
      return Math.pow(level, 3);
  }
}

/**
 * Calculate level from experience
 */
export function getLevelFromExp(exp: number, growthRate: GrowthRate): number {
  for (let level = 100; level >= 1; level--) {
    if (exp >= getExpForLevel(level, growthRate)) {
      return level;
    }
  }
  return 1;
}
