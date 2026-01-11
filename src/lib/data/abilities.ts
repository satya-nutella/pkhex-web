/**
 * Pokemon Ability data (Gen 3+).
 *
 * Gen 3 has 77 abilities (1-76, plus 0 for none).
 */

export const ABILITIES_EN: string[] = [
  "---", // 0 - None
  "Stench", // 1
  "Drizzle", // 2
  "Speed Boost", // 3
  "Battle Armor", // 4
  "Sturdy", // 5
  "Damp", // 6
  "Limber", // 7
  "Sand Veil", // 8
  "Static", // 9
  "Volt Absorb", // 10
  "Water Absorb", // 11
  "Oblivious", // 12
  "Cloud Nine", // 13
  "Compound Eyes", // 14
  "Insomnia", // 15
  "Color Change", // 16
  "Immunity", // 17
  "Flash Fire", // 18
  "Shield Dust", // 19
  "Own Tempo", // 20
  "Suction Cups", // 21
  "Intimidate", // 22
  "Shadow Tag", // 23
  "Rough Skin", // 24
  "Wonder Guard", // 25
  "Levitate", // 26
  "Effect Spore", // 27
  "Synchronize", // 28
  "Clear Body", // 29
  "Natural Cure", // 30
  "Lightning Rod", // 31
  "Serene Grace", // 32
  "Swift Swim", // 33
  "Chlorophyll", // 34
  "Illuminate", // 35
  "Trace", // 36
  "Huge Power", // 37
  "Poison Point", // 38
  "Inner Focus", // 39
  "Magma Armor", // 40
  "Water Veil", // 41
  "Magnet Pull", // 42
  "Soundproof", // 43
  "Rain Dish", // 44
  "Sand Stream", // 45
  "Pressure", // 46
  "Thick Fat", // 47
  "Early Bird", // 48
  "Flame Body", // 49
  "Run Away", // 50
  "Keen Eye", // 51
  "Hyper Cutter", // 52
  "Pickup", // 53
  "Truant", // 54
  "Hustle", // 55
  "Cute Charm", // 56
  "Plus", // 57
  "Minus", // 58
  "Forecast", // 59
  "Sticky Hold", // 60
  "Shed Skin", // 61
  "Guts", // 62
  "Marvel Scale", // 63
  "Liquid Ooze", // 64
  "Overgrow", // 65
  "Blaze", // 66
  "Torrent", // 67
  "Swarm", // 68
  "Rock Head", // 69
  "Drought", // 70
  "Arena Trap", // 71
  "Vital Spirit", // 72
  "White Smoke", // 73
  "Pure Power", // 74
  "Shell Armor", // 75
  "Air Lock", // 76
];

export const MAX_ABILITY_ID_3 = 76;

/**
 * Get ability name by ID
 */
export function getAbilityName(abilityId: number): string {
  if (abilityId < 0 || abilityId >= ABILITIES_EN.length) {
    return "---";
  }
  return ABILITIES_EN[abilityId];
}

/**
 * Check if ability ID is valid
 */
export function isValidAbility(
  abilityId: number,
  generation: number = 3,
): boolean {
  if (generation < 3) return false;
  return abilityId >= 1 && abilityId <= MAX_ABILITY_ID_3;
}

/**
 * Get ability description (placeholder - would need full database)
 */
export function getAbilityDescription(abilityId: number): string {
  // This would need a full description database
  return `Ability #${abilityId}`;
}
