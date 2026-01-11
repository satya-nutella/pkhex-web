/**
 * Legality Analysis - Basic validation for Pokemon data.
 *
 * This module performs validation checks on Pokemon to determine
 * if their data is legal (legitimate) or not.
 */

import { PK1 } from "../pkm/PK1";
import { PK2 } from "../pkm/PK2";
import { PK3 } from "../pkm/PK3";
import {
  MAX_SPECIES_ID_1,
  MAX_SPECIES_ID_2,
  MAX_SPECIES_ID_3,
} from "../../data/species";
import { isValidMove, getMaxMoveId } from "../../data/moves";

// Union type for Pokemon
type Pokemon = PK1 | PK2 | PK3;

/**
 * Severity levels for legality issues
 */
export enum Severity {
  Valid = 0, // No issue
  Fishy = 1, // Unusual but possible
  Invalid = 2, // Definitely wrong
}

/**
 * A single legality check result
 */
export interface CheckResult {
  identifier: string; // Check identifier
  comment: string; // Human-readable description
  severity: Severity; // Issue severity
}

/**
 * Complete legality analysis result
 */
export interface LegalityResult {
  valid: boolean;
  generation: number;
  species: number;
  speciesName: string;
  checks: CheckResult[];
}

/**
 * Perform legality analysis on a Pokemon
 */
export function analyzeLegality(pk: Pokemon): LegalityResult {
  const checks: CheckResult[] = [];

  // Determine generation
  let generation = 1;
  if (pk instanceof PK2) generation = 2;
  else if (pk instanceof PK3) generation = 3;

  // Run all checks
  checks.push(...checkSpecies(pk, generation));
  checks.push(...checkLevel(pk));
  checks.push(...checkMoves(pk, generation));
  checks.push(...checkStats(pk, generation));

  if (pk instanceof PK1) {
    checks.push(...checkGen1Specific(pk));
  } else if (pk instanceof PK2) {
    checks.push(...checkGen2Specific(pk));
  } else if (pk instanceof PK3) {
    checks.push(...checkGen3Specific(pk));
  }

  // Determine overall validity
  const hasInvalid = checks.some((c) => c.severity === Severity.Invalid);

  return {
    valid: !hasInvalid,
    generation,
    species: pk.species,
    speciesName: pk.speciesName,
    checks,
  };
}

/**
 * Check if species is valid for the generation
 */
function checkSpecies(pk: Pokemon, generation: number): CheckResult[] {
  const results: CheckResult[] = [];
  const species = pk.species;

  let maxSpecies = MAX_SPECIES_ID_1;
  if (generation === 2) maxSpecies = MAX_SPECIES_ID_2;
  else if (generation === 3) maxSpecies = MAX_SPECIES_ID_3;

  if (species <= 0) {
    results.push({
      identifier: "Species_Invalid",
      comment: "Species ID is 0 or negative",
      severity: Severity.Invalid,
    });
  } else if (species > maxSpecies) {
    results.push({
      identifier: "Species_OutOfRange",
      comment: `Species ${species} exceeds Gen ${generation} maximum (${maxSpecies})`,
      severity: Severity.Invalid,
    });
  } else {
    results.push({
      identifier: "Species_Valid",
      comment: `Species ${pk.speciesName} is valid`,
      severity: Severity.Valid,
    });
  }

  return results;
}

/**
 * Check if level is valid
 */
function checkLevel(pk: Pokemon): CheckResult[] {
  const results: CheckResult[] = [];
  const level = pk.level;

  if (level < 1) {
    results.push({
      identifier: "Level_TooLow",
      comment: "Level cannot be less than 1",
      severity: Severity.Invalid,
    });
  } else if (level > 100) {
    results.push({
      identifier: "Level_TooHigh",
      comment: "Level cannot exceed 100",
      severity: Severity.Invalid,
    });
  } else {
    results.push({
      identifier: "Level_Valid",
      comment: `Level ${level} is valid`,
      severity: Severity.Valid,
    });
  }

  return results;
}

/**
 * Check if moves are valid for the generation
 */
function checkMoves(pk: Pokemon, generation: number): CheckResult[] {
  const results: CheckResult[] = [];
  let maxMove = 165; // Gen 1

  if (generation === 2) maxMove = 251;
  else if (generation >= 3) maxMove = 354;

  const moves = [pk.getMove(0), pk.getMove(1), pk.getMove(2), pk.getMove(3)];
  const nonZeroMoves = moves.filter((m) => m > 0);

  if (nonZeroMoves.length === 0) {
    results.push({
      identifier: "Moves_Empty",
      comment: "Pokemon has no moves",
      severity: Severity.Invalid,
    });
    return results;
  }

  // Check each move
  for (let i = 0; i < 4; i++) {
    const move = moves[i];
    if (move === 0) continue;

    if (move > maxMove) {
      results.push({
        identifier: `Move${i + 1}_OutOfRange`,
        comment: `Move ${i + 1} (ID: ${move}) exceeds Gen ${generation} maximum`,
        severity: Severity.Invalid,
      });
    } else if (!isValidMove(move)) {
      results.push({
        identifier: `Move${i + 1}_Invalid`,
        comment: `Move ${i + 1} is not a valid move`,
        severity: Severity.Invalid,
      });
    }
  }

  // Check for duplicate moves
  const seenMoves = new Set<number>();
  for (const move of nonZeroMoves) {
    if (seenMoves.has(move)) {
      results.push({
        identifier: "Moves_Duplicate",
        comment: "Pokemon has duplicate moves",
        severity: Severity.Fishy,
      });
      break;
    }
    seenMoves.add(move);
  }

  if (results.length === 0) {
    results.push({
      identifier: "Moves_Valid",
      comment: "All moves are valid",
      severity: Severity.Valid,
    });
  }

  return results;
}

/**
 * Check if stats/DVs/EVs are within valid ranges
 */
function checkStats(pk: Pokemon, generation: number): CheckResult[] {
  const results: CheckResult[] = [];

  if (generation <= 2) {
    // Gen 1-2: DVs (0-15), EVs (0-65535)
    const dvMax = 15;
    const evMax = 65535;

    const dvs = [pk.dvATK, pk.dvDEF, pk.dvSPE, pk.dvSPC];
    const evs = [pk.evHP, pk.evATK, pk.evDEF, pk.evSPE, pk.evSPC];

    for (let i = 0; i < dvs.length; i++) {
      if (dvs[i] > dvMax) {
        results.push({
          identifier: "DV_OutOfRange",
          comment: `DV value ${dvs[i]} exceeds maximum (${dvMax})`,
          severity: Severity.Invalid,
        });
        break;
      }
    }

    for (let i = 0; i < evs.length; i++) {
      if (evs[i] > evMax) {
        results.push({
          identifier: "EV_OutOfRange",
          comment: `EV value ${evs[i]} exceeds maximum (${evMax})`,
          severity: Severity.Invalid,
        });
        break;
      }
    }
  } else {
    // Gen 3+: IVs (0-31), EVs (0-255, total 510)
    const pk3 = pk as PK3;
    const ivMax = 31;
    const evMax = 255;
    const evTotalMax = 510;

    const ivs = [
      pk3.ivHP,
      pk3.ivATK,
      pk3.ivDEF,
      pk3.ivSPA,
      pk3.ivSPD,
      pk3.ivSPE,
    ];
    const evs = [
      pk3.evHP,
      pk3.evATK,
      pk3.evDEF,
      pk3.evSPA,
      pk3.evSPD,
      pk3.evSPE,
    ];

    for (const iv of ivs) {
      if (iv > ivMax) {
        results.push({
          identifier: "IV_OutOfRange",
          comment: `IV value ${iv} exceeds maximum (${ivMax})`,
          severity: Severity.Invalid,
        });
        break;
      }
    }

    const evTotal = evs.reduce((sum, ev) => sum + ev, 0);
    if (evTotal > evTotalMax) {
      results.push({
        identifier: "EV_TotalExceeded",
        comment: `Total EVs (${evTotal}) exceed maximum (${evTotalMax})`,
        severity: Severity.Invalid,
      });
    }

    for (const ev of evs) {
      if (ev > evMax) {
        results.push({
          identifier: "EV_OutOfRange",
          comment: `EV value ${ev} exceeds maximum (${evMax})`,
          severity: Severity.Invalid,
        });
        break;
      }
    }
  }

  if (results.length === 0) {
    results.push({
      identifier: "Stats_Valid",
      comment: "All stat values are within valid ranges",
      severity: Severity.Valid,
    });
  }

  return results;
}

/**
 * Gen 1 specific checks
 */
function checkGen1Specific(pk: PK1): CheckResult[] {
  const results: CheckResult[] = [];

  // Check HP doesn't exceed max
  if (pk.currentHP > pk.statHPMax) {
    results.push({
      identifier: "HP_ExceedsMax",
      comment: `Current HP (${pk.currentHP}) exceeds Max HP (${pk.statHPMax})`,
      severity: Severity.Invalid,
    });
  }

  // Check experience is reasonable for level
  const exp = pk.exp;
  if (exp > 16777215) {
    results.push({
      identifier: "Exp_OutOfRange",
      comment: "Experience exceeds maximum (16777215)",
      severity: Severity.Invalid,
    });
  }

  return results;
}

/**
 * Gen 2 specific checks
 */
function checkGen2Specific(pk: PK2): CheckResult[] {
  const results: CheckResult[] = [];

  // Check friendship
  if (pk.friendship > 255) {
    results.push({
      identifier: "Friendship_OutOfRange",
      comment: "Friendship exceeds maximum (255)",
      severity: Severity.Invalid,
    });
  }

  // Check held item validity (basic check)
  const item = pk.heldItem;
  if (item > 255) {
    results.push({
      identifier: "Item_OutOfRange",
      comment: "Held item ID exceeds maximum",
      severity: Severity.Invalid,
    });
  }

  return results;
}

/**
 * Gen 3 specific checks
 */
function checkGen3Specific(pk: PK3): CheckResult[] {
  const results: CheckResult[] = [];

  // Check nature is valid (0-24)
  if (pk.nature > 24) {
    results.push({
      identifier: "Nature_Invalid",
      comment: `Nature ${pk.nature} is not valid (0-24)`,
      severity: Severity.Invalid,
    });
  }

  // Check friendship
  if (pk.friendship > 255) {
    results.push({
      identifier: "Friendship_OutOfRange",
      comment: "Friendship exceeds maximum (255)",
      severity: Severity.Invalid,
    });
  }

  return results;
}

/**
 * Get a simple validity badge for display
 */
export function getValidityBadge(result: LegalityResult): {
  text: string;
  color: string;
} {
  if (result.valid) {
    return { text: "Legal", color: "green" };
  }

  const hasInvalid = result.checks.some((c) => c.severity === Severity.Invalid);
  if (hasInvalid) {
    return { text: "Illegal", color: "red" };
  }

  return { text: "Fishy", color: "yellow" };
}
