/**
 * Common Pokemon interface for multi-generation support.
 * Both PK1 and PK2 implement these properties.
 */
export interface IPokemon {
  // Basic info
  species: number;
  speciesName: string;
  nickname: string;
  ot: string;
  tid16: number;

  // Level and stats
  level: number;
  currentHP: number;
  statHPMax: number;
  statATK: number;
  statDEF: number;
  statSPE: number;

  // EVs
  evHP: number;
  evATK: number;
  evDEF: number;
  evSPE: number;
  evSPC: number;

  // DVs/IVs
  dvHP: number;
  dvATK: number;
  dvDEF: number;
  dvSPE: number;
  dvSPC: number;

  // Experience
  exp: number;

  // Status
  isEmpty: boolean;
  isValid: boolean;

  // Methods
  getMove(index: number): number;
  getMoveName(index: number): string;
  getPP(index: number): number;
  getPPUps(index: number): number;
  clone(): IPokemon;
}

/**
 * Common save file interface for multi-generation support.
 */
export interface ISaveFile {
  // Basic info
  trainerName: string;
  tid16: number;
  money: number;
  badges: number;
  badgeCount: number;

  // Play time
  playedHours: number;
  playedMinutes: number;
  playedSeconds: number;
  playTimeString: string;

  // Pokedex
  seenCount: number;
  caughtCount: number;

  // Party and box
  partyCount: number;
  boxCount: number;
  boxSlotCount: number;
  currentBox: number;

  // Pokemon access
  getPartyPokemon(slot: number): IPokemon | null;
  getBoxPokemon(box: number, slot: number): IPokemon | null;

  // Checksum
  checksumValid: boolean;

  // Export
  export(): Uint8Array;
  getSummary(): {
    trainerName: string;
    trainerId: number;
    version: string;
    playTime: string;
    badges: number;
    money: number;
    partyCount: number;
    pokedexSeen: number;
    pokedexCaught: number;
    checksumValid: boolean;
  };
}
