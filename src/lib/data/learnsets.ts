/**
 * Pokemon Move Learnsets by Generation.
 *
 * Defines which moves each Pokemon can learn through various methods:
 * - Level-up: Learned at specific levels
 * - TM/HM: Learned from Technical/Hidden Machines
 * - Egg: Inherited from parents (Gen 2+)
 * - Tutor: Learned from move tutors (Gen 3+)
 */

export interface LearnsetEntry {
  level?: number[]; // [level, moveId, level, moveId, ...]
  tm?: number[]; // TM/HM move IDs
  egg?: number[]; // Egg move IDs
  tutor?: number[]; // Tutor move IDs
}

export type Learnset = Record<number, LearnsetEntry>;

// Gen 1 TM/HM move IDs
export const TM_MOVES_GEN1 = [
  5,
  13,
  14,
  18,
  25,
  92,
  32,
  34,
  36,
  38, // TM01-10
  61,
  55,
  58,
  59,
  63,
  6,
  66,
  68,
  69,
  99, // TM11-20
  72,
  76,
  82,
  85,
  87,
  89,
  90,
  91,
  94,
  100, // TM21-30
  102,
  104,
  115,
  117,
  118,
  120,
  121,
  126,
  129,
  130, // TM31-40
  135,
  138,
  143,
  156,
  86,
  149,
  153,
  157,
  161,
  164, // TM41-50
  15,
  19,
  57,
  70,
  148, // HM01-05
];

// Gen 1 Learnsets (abbreviated - key Pokemon only for demo)
// Format: species ID -> { level: [lvl, move, lvl, move, ...], tm: [tmMoveIds] }
export const LEARNSETS_GEN1: Learnset = {
  // Bulbasaur
  1: {
    level: [1, 33, 1, 45, 7, 73, 13, 22, 20, 77, 27, 75, 34, 74, 41, 79],
    tm: [3, 6, 8, 9, 10, 20, 21, 22, 31, 32, 33, 34, 44, 50, 15],
  },
  // Ivysaur
  2: {
    level: [1, 33, 1, 45, 1, 73, 7, 73, 13, 22, 22, 77, 30, 75, 38, 74, 46, 79],
    tm: [3, 6, 8, 9, 10, 20, 21, 22, 31, 32, 33, 34, 44, 50, 15],
  },
  // Venusaur
  3: {
    level: [
      1, 33, 1, 45, 1, 73, 1, 22, 7, 73, 13, 22, 22, 77, 30, 75, 43, 74, 55, 79,
    ],
    tm: [3, 6, 8, 9, 10, 15, 20, 21, 22, 31, 32, 33, 34, 44, 50],
  },
  // Charmander
  4: {
    level: [1, 10, 1, 45, 9, 52, 15, 43, 22, 99, 30, 82, 38, 53],
    tm: [
      1, 3, 5, 6, 8, 9, 10, 17, 18, 19, 20, 23, 28, 31, 32, 33, 34, 38, 39, 40,
      44, 50, 15, 70,
    ],
  },
  // Charmeleon
  5: {
    level: [1, 10, 1, 45, 1, 52, 9, 52, 15, 43, 24, 99, 33, 82, 42, 53],
    tm: [
      1, 3, 5, 6, 8, 9, 10, 17, 18, 19, 20, 23, 28, 31, 32, 33, 34, 38, 39, 40,
      44, 50, 15, 70,
    ],
  },
  // Charizard
  6: {
    level: [1, 10, 1, 45, 1, 52, 1, 43, 9, 52, 15, 43, 24, 99, 36, 82, 46, 53],
    tm: [
      1, 3, 5, 6, 8, 9, 10, 15, 17, 18, 19, 20, 23, 26, 27, 28, 31, 32, 33, 34,
      38, 39, 40, 44, 50, 70,
    ],
  },
  // Squirtle
  7: {
    level: [1, 33, 1, 39, 8, 145, 15, 55, 22, 44, 28, 110, 35, 130, 42, 56],
    tm: [
      1, 5, 6, 8, 9, 10, 11, 12, 13, 14, 17, 18, 19, 20, 28, 31, 32, 33, 34, 40,
      44, 50, 15, 57,
    ],
  },
  // Wartortle
  8: {
    level: [
      1, 33, 1, 39, 1, 145, 8, 145, 15, 55, 24, 44, 31, 110, 39, 130, 47, 56,
    ],
    tm: [
      1, 5, 6, 8, 9, 10, 11, 12, 13, 14, 17, 18, 19, 20, 28, 31, 32, 33, 34, 40,
      44, 50, 15, 57,
    ],
  },
  // Blastoise
  9: {
    level: [
      1, 33, 1, 39, 1, 145, 1, 55, 8, 145, 15, 55, 24, 44, 31, 110, 42, 130, 52,
      56,
    ],
    tm: [
      1, 5, 6, 8, 9, 10, 11, 12, 13, 14, 15, 17, 18, 19, 20, 26, 27, 28, 31, 32,
      33, 34, 40, 44, 50, 57,
    ],
  },
  // Pikachu
  25: {
    level: [
      1, 84, 1, 45, 6, 86, 8, 98, 11, 39, 15, 97, 20, 129, 26, 84, 33, 97, 43,
      87,
    ],
    tm: [
      1, 5, 6, 8, 9, 10, 16, 17, 19, 20, 24, 25, 31, 32, 33, 34, 39, 40, 44, 45,
      50, 148,
    ],
  },
  // Raichu
  26: {
    level: [1, 84, 1, 45, 1, 86, 1, 98],
    tm: [
      1, 5, 6, 8, 9, 10, 15, 16, 17, 19, 20, 24, 25, 31, 32, 33, 34, 39, 40, 44,
      45, 50, 148,
    ],
  },
  // Eevee
  133: {
    level: [1, 33, 1, 28, 8, 39, 16, 98, 23, 44, 30, 36, 37, 99],
    tm: [6, 8, 9, 10, 20, 31, 32, 33, 34, 39, 40, 44, 50],
  },
  // Vaporeon
  134: {
    level: [
      1, 33, 1, 28, 1, 55, 8, 39, 16, 98, 23, 44, 30, 54, 36, 114, 42, 56, 47,
      61,
    ],
    tm: [
      6, 8, 9, 10, 11, 12, 13, 14, 15, 20, 31, 32, 33, 34, 39, 40, 44, 50, 57,
    ],
  },
  // Jolteon
  135: {
    level: [
      1, 33, 1, 28, 1, 84, 8, 39, 16, 98, 23, 44, 30, 42, 36, 86, 42, 97, 47,
      87,
    ],
    tm: [6, 8, 9, 10, 15, 20, 24, 25, 31, 32, 33, 34, 39, 40, 44, 45, 50, 148],
  },
  // Flareon
  136: {
    level: [
      1, 33, 1, 28, 1, 52, 8, 39, 16, 98, 23, 44, 30, 44, 36, 43, 42, 53, 47,
      126,
    ],
    tm: [6, 8, 9, 10, 15, 20, 31, 32, 33, 34, 38, 39, 40, 44, 50],
  },
  // Mewtwo
  150: {
    level: [1, 93, 1, 50, 1, 129, 63, 112, 66, 105, 75, 94, 81, 133, 99, 156],
    tm: [
      1, 5, 6, 8, 9, 10, 15, 16, 17, 18, 19, 20, 22, 24, 25, 29, 30, 31, 32, 33,
      34, 35, 36, 38, 40, 44, 46, 50, 148, 70,
    ],
  },
  // Mew
  151: {
    level: [1, 1, 10, 136, 20, 118, 30, 94, 40, 63, 50, 144],
    tm: [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
      22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
      40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 15, 19, 57, 70, 148,
    ],
  },
};

// Gen 2 additions to moves (extend the Gen 1 list)
export const MOVES_GEN2_START = 166;
export const MOVES_GEN2: string[] = [
  "Sketch",
  "Triple Kick",
  "Thief",
  "Spider Web",
  "Mind Reader", // 166-170
  "Nightmare",
  "Flame Wheel",
  "Snore",
  "Curse",
  "Flail", // 171-175
  "Conversion 2",
  "Aeroblast",
  "Cotton Spore",
  "Reversal",
  "Spite", // 176-180
  "Powder Snow",
  "Protect",
  "Mach Punch",
  "Scary Face",
  "Feint Attack", // 181-185
  "Sweet Kiss",
  "Belly Drum",
  "Sludge Bomb",
  "Mud-Slap",
  "Octazooka", // 186-190
  "Spikes",
  "Zap Cannon",
  "Foresight",
  "Destiny Bond",
  "Perish Song", // 191-195
  "Icy Wind",
  "Detect",
  "Bone Rush",
  "Lock-On",
  "Outrage", // 196-200
  "Sandstorm",
  "Giga Drain",
  "Endure",
  "Charm",
  "Rollout", // 201-205
  "False Swipe",
  "Swagger",
  "Milk Drink",
  "Spark",
  "Fury Cutter", // 206-210
  "Steel Wing",
  "Mean Look",
  "Attract",
  "Sleep Talk",
  "Heal Bell", // 211-215
  "Return",
  "Present",
  "Frustration",
  "Safeguard",
  "Pain Split", // 216-220
  "Sacred Fire",
  "Magnitude",
  "Dynamic Punch",
  "Megahorn",
  "Dragon Breath", // 221-225
  "Baton Pass",
  "Encore",
  "Pursuit",
  "Rapid Spin",
  "Sweet Scent", // 226-230
  "Iron Tail",
  "Metal Claw",
  "Vital Throw",
  "Morning Sun",
  "Synthesis", // 231-235
  "Moonlight",
  "Hidden Power",
  "Cross Chop",
  "Twister",
  "Rain Dance", // 236-240
  "Sunny Day",
  "Crunch",
  "Mirror Coat",
  "Psych Up",
  "Extreme Speed", // 241-245
  "Ancient Power",
  "Shadow Ball",
  "Future Sight",
  "Rock Smash",
  "Whirlpool", // 246-250
  "Beat Up", // 251
];

// Gen 3 additions
export const MOVES_GEN3_START = 252;
export const MOVES_GEN3: string[] = [
  "Fake Out",
  "Uproar",
  "Stockpile",
  "Spit Up",
  "Swallow", // 252-256
  "Heat Wave",
  "Hail",
  "Torment",
  "Flatter",
  "Will-O-Wisp", // 257-261
  "Memento",
  "Facade",
  "Focus Punch",
  "Smelling Salts",
  "Follow Me", // 262-266
  "Nature Power",
  "Charge",
  "Taunt",
  "Helping Hand",
  "Trick", // 267-271
  "Role Play",
  "Wish",
  "Assist",
  "Ingrain",
  "Superpower", // 272-276
  "Magic Coat",
  "Recycle",
  "Revenge",
  "Brick Break",
  "Yawn", // 277-281
  "Knock Off",
  "Endeavor",
  "Eruption",
  "Skill Swap",
  "Imprison", // 282-286
  "Refresh",
  "Grudge",
  "Snatch",
  "Secret Power",
  "Dive", // 287-291
  "Arm Thrust",
  "Camouflage",
  "Tail Glow",
  "Luster Purge",
  "Mist Ball", // 292-296
  "Feather Dance",
  "Teeter Dance",
  "Blaze Kick",
  "Mud Sport",
  "Ice Ball", // 297-301
  "Needle Arm",
  "Slack Off",
  "Hyper Voice",
  "Poison Fang",
  "Crush Claw", // 302-306
  "Blast Burn",
  "Hydro Cannon",
  "Meteor Mash",
  "Astonish",
  "Weather Ball", // 307-311
  "Aromatherapy",
  "Fake Tears",
  "Air Cutter",
  "Overheat",
  "Odor Sleuth", // 312-316
  "Rock Tomb",
  "Silver Wind",
  "Metal Sound",
  "Grass Whistle",
  "Tickle", // 317-321
  "Cosmic Power",
  "Water Spout",
  "Signal Beam",
  "Shadow Punch",
  "Extrasensory", // 322-326
  "Sky Uppercut",
  "Sand Tomb",
  "Sheer Cold",
  "Muddy Water",
  "Bullet Seed", // 327-331
  "Aerial Ace",
  "Icicle Spear",
  "Iron Defense",
  "Block",
  "Howl", // 332-336
  "Dragon Claw",
  "Frenzy Plant",
  "Bulk Up",
  "Bounce",
  "Mud Shot", // 337-341
  "Poison Tail",
  "Covet",
  "Volt Tackle",
  "Magical Leaf",
  "Water Sport", // 342-346
  "Calm Mind",
  "Leaf Blade",
  "Dragon Dance",
  "Rock Blast",
  "Shock Wave", // 347-351
  "Water Pulse",
  "Doom Desire",
  "Psycho Boost", // 352-354
];

/**
 * Check if a Pokemon can learn a move in Gen 1.
 */
export function canLearnMoveGen1(species: number, moveId: number): boolean {
  const learnset = LEARNSETS_GEN1[species];
  if (!learnset) return false;

  // Check level-up moves
  if (learnset.level) {
    for (let i = 1; i < learnset.level.length; i += 2) {
      if (learnset.level[i] === moveId) return true;
    }
  }

  // Check TM moves
  if (learnset.tm && learnset.tm.includes(moveId)) return true;

  return false;
}

/**
 * Get all learnable moves for a Pokemon in Gen 1.
 */
export function getLearnableMoves(
  species: number,
  generation: number,
): number[] {
  const moves = new Set<number>();

  if (generation === 1) {
    const learnset = LEARNSETS_GEN1[species];
    if (learnset) {
      // Level-up moves
      if (learnset.level) {
        for (let i = 1; i < learnset.level.length; i += 2) {
          moves.add(learnset.level[i]);
        }
      }
      // TM moves
      if (learnset.tm) {
        learnset.tm.forEach((m) => moves.add(m));
      }
    }
  }

  return Array.from(moves).sort((a, b) => a - b);
}

/**
 * Get level-up moves for a Pokemon at or below a given level.
 */
export function getLevelUpMoves(
  species: number,
  level: number,
  generation: number,
): Array<{ level: number; moveId: number }> {
  const result: Array<{ level: number; moveId: number }> = [];

  if (generation === 1) {
    const learnset = LEARNSETS_GEN1[species];
    if (learnset?.level) {
      for (let i = 0; i < learnset.level.length; i += 2) {
        const lvl = learnset.level[i];
        const moveId = learnset.level[i + 1];
        if (lvl <= level) {
          result.push({ level: lvl, moveId });
        }
      }
    }
  }

  return result;
}

/**
 * Validate that all moves are legal for a Pokemon.
 */
export interface MoveValidationResult {
  valid: boolean;
  illegalMoves: number[];
  reason?: string;
}

export function validateMoves(
  species: number,
  moves: number[],
  level: number,
  generation: number,
): MoveValidationResult {
  const result: MoveValidationResult = {
    valid: true,
    illegalMoves: [],
  };

  // No learnset data for this Pokemon - allow all moves (permissive)
  if (generation === 1 && !LEARNSETS_GEN1[species]) {
    return result;
  }

  const learnableMoves = getLearnableMoves(species, generation);

  for (const moveId of moves) {
    if (moveId === 0) continue; // Empty move slot

    if (!learnableMoves.includes(moveId)) {
      result.valid = false;
      result.illegalMoves.push(moveId);
    }
  }

  if (!result.valid) {
    result.reason = "Some moves cannot be learned by this Pokemon";
  }

  return result;
}

/**
 * Get suggested moves for a Pokemon (commonly used competitive moves).
 */
export function getSuggestedMoves(
  species: number,
  generation: number,
): number[] {
  // Return level-up moves as suggestions
  const levelUpMoves = getLevelUpMoves(species, 100, generation);
  return levelUpMoves.map((m) => m.moveId);
}
