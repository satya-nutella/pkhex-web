/**
 * Generation 2 Pokemon data structure.
 *
 * PK2 Format:
 * - SIZE_STORED: 32 bytes (box storage)
 * - SIZE_PARTY: 48 bytes (party format includes calculated stats)
 *
 * Data uses big-endian byte order.
 * No encryption - data is stored raw.
 */

import {
  readUInt8,
  readUInt16BE,
  readUInt24BE,
  writeUInt8,
  writeUInt16BE,
  writeUInt24BE,
} from "../../utils/binary";
import { getString1, setString1, getStringLength1 } from "../../utils/strings";
import { getSpeciesName, MAX_SPECIES_ID_2 } from "../../data/species";
import { getMoveName, getBasePP } from "../../data/moves";
import { getLevelFromExp } from "../../data/experience";
import { GameVersion } from "../game/GameVersion";

export const SIZE_2STORED = 32;
export const SIZE_2PARTY = 48;

/**
 * Gen 2 Pokemon class.
 */
export class PK2 {
  /** Raw binary data */
  readonly data: Uint8Array;

  /** Original Trainer name (stored separately in Gen 2) */
  readonly otData: Uint8Array;

  /** Nickname (stored separately in Gen 2) */
  readonly nicknameData: Uint8Array;

  /** Whether this is from a Japanese save */
  readonly japanese: boolean;

  /** Whether this is from Crystal (has caught data) */
  readonly isCrystal: boolean;

  constructor(
    data?: Uint8Array,
    japanese: boolean = false,
    isCrystal: boolean = false,
  ) {
    this.japanese = japanese;
    this.isCrystal = isCrystal;
    const stringLength = getStringLength1(japanese);

    if (data) {
      // Ensure we have party-sized data
      this.data = new Uint8Array(SIZE_2PARTY);
      this.data.set(data.slice(0, Math.min(data.length, SIZE_2PARTY)));
    } else {
      this.data = new Uint8Array(SIZE_2PARTY);
    }

    this.otData = new Uint8Array(stringLength);
    this.otData.fill(0x50); // Terminator

    this.nicknameData = new Uint8Array(stringLength);
    this.nicknameData.fill(0x50); // Terminator
  }

  // ========== Basic Properties ==========

  /** Species (direct storage in Gen 2, 0-251) */
  get species(): number {
    return this.data[0x00];
  }
  set species(value: number) {
    this.data[0x00] = Math.min(MAX_SPECIES_ID_2, Math.max(0, value));
  }

  /** Species name */
  get speciesName(): string {
    return getSpeciesName(this.species);
  }

  /** Held item */
  get heldItem(): number {
    return this.data[0x01];
  }
  set heldItem(value: number) {
    this.data[0x01] = value & 0xff;
  }

  // ========== Moves ==========

  get move1(): number {
    return this.data[0x02];
  }
  set move1(value: number) {
    this.data[0x02] = value;
  }

  get move2(): number {
    return this.data[0x03];
  }
  set move2(value: number) {
    this.data[0x03] = value;
  }

  get move3(): number {
    return this.data[0x04];
  }
  set move3(value: number) {
    this.data[0x04] = value;
  }

  get move4(): number {
    return this.data[0x05];
  }
  set move4(value: number) {
    this.data[0x05] = value;
  }

  /** Get move at index (0-3) */
  getMove(index: number): number {
    switch (index) {
      case 0:
        return this.move1;
      case 1:
        return this.move2;
      case 2:
        return this.move3;
      case 3:
        return this.move4;
      default:
        return 0;
    }
  }

  /** Set move at index (0-3) */
  setMove(index: number, value: number): void {
    switch (index) {
      case 0:
        this.move1 = value;
        break;
      case 1:
        this.move2 = value;
        break;
      case 2:
        this.move3 = value;
        break;
      case 3:
        this.move4 = value;
        break;
    }
  }

  /** Get move name at index */
  getMoveName(index: number): string {
    return getMoveName(this.getMove(index));
  }

  // ========== Trainer ID ==========

  /** Trainer ID (16-bit) */
  get tid16(): number {
    return readUInt16BE(this.data, 0x06);
  }
  set tid16(value: number) {
    writeUInt16BE(this.data, 0x06, value);
  }

  // ========== Experience ==========

  /** Experience points (24-bit, stored as upper bits of 32-bit) */
  get exp(): number {
    return (readUInt16BE(this.data, 0x08) << 8) | this.data[0x0a];
  }
  set exp(value: number) {
    const clamped = Math.min(0xffffff, Math.max(0, value));
    this.data[0x08] = (clamped >> 16) & 0xff;
    this.data[0x09] = (clamped >> 8) & 0xff;
    this.data[0x0a] = clamped & 0xff;
  }

  // ========== EVs (Effort Values) ==========

  get evHP(): number {
    return readUInt16BE(this.data, 0x0b);
  }
  set evHP(value: number) {
    writeUInt16BE(this.data, 0x0b, Math.min(65535, Math.max(0, value)));
  }

  get evATK(): number {
    return readUInt16BE(this.data, 0x0d);
  }
  set evATK(value: number) {
    writeUInt16BE(this.data, 0x0d, Math.min(65535, Math.max(0, value)));
  }

  get evDEF(): number {
    return readUInt16BE(this.data, 0x0f);
  }
  set evDEF(value: number) {
    writeUInt16BE(this.data, 0x0f, Math.min(65535, Math.max(0, value)));
  }

  get evSPE(): number {
    return readUInt16BE(this.data, 0x11);
  }
  set evSPE(value: number) {
    writeUInt16BE(this.data, 0x11, Math.min(65535, Math.max(0, value)));
  }

  /** Special EV (Gen 2 uses same EV for SpA and SpD) */
  get evSPC(): number {
    return readUInt16BE(this.data, 0x13);
  }
  set evSPC(value: number) {
    writeUInt16BE(this.data, 0x13, Math.min(65535, Math.max(0, value)));
  }

  // ========== DVs (IVs in Gen 1-2 terminology) ==========

  /** Raw DV16 value containing all DVs packed */
  get dv16(): number {
    return readUInt16BE(this.data, 0x15);
  }
  set dv16(value: number) {
    writeUInt16BE(this.data, 0x15, value);
  }

  /** Attack DV (0-15) */
  get dvATK(): number {
    return (this.dv16 >> 12) & 0x0f;
  }
  set dvATK(value: number) {
    this.dv16 = (this.dv16 & 0x0fff) | ((value & 0x0f) << 12);
  }

  /** Defense DV (0-15) */
  get dvDEF(): number {
    return (this.dv16 >> 8) & 0x0f;
  }
  set dvDEF(value: number) {
    this.dv16 = (this.dv16 & 0xf0ff) | ((value & 0x0f) << 8);
  }

  /** Speed DV (0-15) */
  get dvSPE(): number {
    return (this.dv16 >> 4) & 0x0f;
  }
  set dvSPE(value: number) {
    this.dv16 = (this.dv16 & 0xff0f) | ((value & 0x0f) << 4);
  }

  /** Special DV (0-15) */
  get dvSPC(): number {
    return this.dv16 & 0x0f;
  }
  set dvSPC(value: number) {
    this.dv16 = (this.dv16 & 0xfff0) | (value & 0x0f);
  }

  /** HP DV is calculated from other DVs */
  get dvHP(): number {
    return (
      ((this.dvATK & 1) << 3) |
      ((this.dvDEF & 1) << 2) |
      ((this.dvSPE & 1) << 1) |
      (this.dvSPC & 1)
    );
  }

  // ========== PP (Power Points) ==========

  get move1PP(): number {
    return this.data[0x17] & 0x3f;
  }
  set move1PP(value: number) {
    this.data[0x17] = (this.data[0x17] & 0xc0) | Math.min(63, value);
  }

  get move2PP(): number {
    return this.data[0x18] & 0x3f;
  }
  set move2PP(value: number) {
    this.data[0x18] = (this.data[0x18] & 0xc0) | Math.min(63, value);
  }

  get move3PP(): number {
    return this.data[0x19] & 0x3f;
  }
  set move3PP(value: number) {
    this.data[0x19] = (this.data[0x19] & 0xc0) | Math.min(63, value);
  }

  get move4PP(): number {
    return this.data[0x1a] & 0x3f;
  }
  set move4PP(value: number) {
    this.data[0x1a] = (this.data[0x1a] & 0xc0) | Math.min(63, value);
  }

  /** Get PP at index (0-3) */
  getPP(index: number): number {
    switch (index) {
      case 0:
        return this.move1PP;
      case 1:
        return this.move2PP;
      case 2:
        return this.move3PP;
      case 3:
        return this.move4PP;
      default:
        return 0;
    }
  }

  /** Set PP at index (0-3) */
  setPP(index: number, value: number): void {
    switch (index) {
      case 0:
        this.move1PP = value;
        break;
      case 1:
        this.move2PP = value;
        break;
      case 2:
        this.move3PP = value;
        break;
      case 3:
        this.move4PP = value;
        break;
    }
  }

  // ========== PP Ups ==========

  get move1PPUps(): number {
    return (this.data[0x17] >> 6) & 0x03;
  }
  set move1PPUps(value: number) {
    this.data[0x17] = (this.data[0x17] & 0x3f) | ((value & 0x03) << 6);
  }

  get move2PPUps(): number {
    return (this.data[0x18] >> 6) & 0x03;
  }
  set move2PPUps(value: number) {
    this.data[0x18] = (this.data[0x18] & 0x3f) | ((value & 0x03) << 6);
  }

  get move3PPUps(): number {
    return (this.data[0x19] >> 6) & 0x03;
  }
  set move3PPUps(value: number) {
    this.data[0x19] = (this.data[0x19] & 0x3f) | ((value & 0x03) << 6);
  }

  get move4PPUps(): number {
    return (this.data[0x1a] >> 6) & 0x03;
  }
  set move4PPUps(value: number) {
    this.data[0x1a] = (this.data[0x1a] & 0x3f) | ((value & 0x03) << 6);
  }

  /** Get PP Ups at index */
  getPPUps(index: number): number {
    switch (index) {
      case 0:
        return this.move1PPUps;
      case 1:
        return this.move2PPUps;
      case 2:
        return this.move3PPUps;
      case 3:
        return this.move4PPUps;
      default:
        return 0;
    }
  }

  // ========== Friendship & Pokerus ==========

  /** Friendship/Happiness value (0-255) */
  get friendship(): number {
    return this.data[0x1b];
  }
  set friendship(value: number) {
    this.data[0x1b] = Math.min(255, Math.max(0, value));
  }

  /** Pokerus state (strain + days) */
  get pokerus(): number {
    return this.data[0x1c];
  }
  set pokerus(value: number) {
    this.data[0x1c] = value;
  }

  /** Pokerus strain (0-15) */
  get pokerusStrain(): number {
    return (this.pokerus >> 4) & 0x0f;
  }

  /** Pokerus days remaining (0-15) */
  get pokerusDays(): number {
    return this.pokerus & 0x0f;
  }

  /** Whether Pokemon has or had Pokerus */
  get hasPokerus(): boolean {
    return this.pokerus !== 0;
  }

  // ========== Caught Data (Crystal Only) ==========

  /** Raw caught data (Crystal only) */
  get caughtData(): number {
    return readUInt16BE(this.data, 0x1d);
  }
  set caughtData(value: number) {
    writeUInt16BE(this.data, 0x1d, value);
  }

  /** Met time of day (0=Morning, 1=Day, 2=Night) - Crystal only */
  get metTimeOfDay(): number {
    return (this.caughtData >> 14) & 0x03;
  }

  /** Met level (0-63) - Crystal only */
  get metLevel(): number {
    return (this.caughtData >> 8) & 0x3f;
  }

  /** Original trainer gender (0=Male, 1=Female) - Crystal only */
  get otGender(): number {
    return (this.caughtData >> 7) & 0x01;
  }

  /** Met location (0-127) - Crystal only */
  get metLocation(): number {
    return this.caughtData & 0x7f;
  }

  // ========== Party Data (offsets 0x1F-0x2F) ==========

  /** Level (stored data at 0x1F) */
  get levelStored(): number {
    return this.data[0x1f];
  }
  set levelStored(value: number) {
    this.data[0x1f] = value;
  }

  /** Status condition (party data) */
  get statusCondition(): number {
    return this.data[0x20];
  }
  set statusCondition(value: number) {
    this.data[0x20] = value;
  }

  /** Current HP */
  get currentHP(): number {
    return readUInt16BE(this.data, 0x22);
  }
  set currentHP(value: number) {
    writeUInt16BE(this.data, 0x22, value);
  }

  /** Max HP stat */
  get statHPMax(): number {
    return readUInt16BE(this.data, 0x24);
  }
  set statHPMax(value: number) {
    writeUInt16BE(this.data, 0x24, value);
  }

  /** Attack stat */
  get statATK(): number {
    return readUInt16BE(this.data, 0x26);
  }
  set statATK(value: number) {
    writeUInt16BE(this.data, 0x26, value);
  }

  /** Defense stat */
  get statDEF(): number {
    return readUInt16BE(this.data, 0x28);
  }
  set statDEF(value: number) {
    writeUInt16BE(this.data, 0x28, value);
  }

  /** Speed stat */
  get statSPE(): number {
    return readUInt16BE(this.data, 0x2a);
  }
  set statSPE(value: number) {
    writeUInt16BE(this.data, 0x2a, value);
  }

  /** Special Attack stat (Gen 2 split from Special) */
  get statSPA(): number {
    return readUInt16BE(this.data, 0x2c);
  }
  set statSPA(value: number) {
    writeUInt16BE(this.data, 0x2c, value);
  }

  /** Special Defense stat (Gen 2 split from Special) */
  get statSPD(): number {
    return readUInt16BE(this.data, 0x2e);
  }
  set statSPD(value: number) {
    writeUInt16BE(this.data, 0x2e, value);
  }

  // ========== String Properties ==========

  /** Original Trainer name */
  get ot(): string {
    return getString1(this.otData, 0, this.otData.length, this.japanese);
  }
  set ot(value: string) {
    const maxLength = this.japanese ? 5 : 7;
    setString1(this.otData, 0, value, maxLength, this.japanese);
  }

  /** Nickname */
  get nickname(): string {
    return getString1(
      this.nicknameData,
      0,
      this.nicknameData.length,
      this.japanese,
    );
  }
  set nickname(value: string) {
    const maxLength = this.japanese ? 5 : 10;
    setString1(this.nicknameData, 0, value, maxLength, this.japanese);
  }

  /** Check if Pokemon has a custom nickname */
  get isNicknamed(): boolean {
    return this.nickname.toUpperCase() !== this.speciesName.toUpperCase();
  }

  // ========== Derived Properties ==========

  /**
   * Current level.
   * Uses stored level if valid, otherwise calculates from EXP.
   */
  get level(): number {
    if (this.levelStored > 0 && this.levelStored <= 100) {
      return this.levelStored;
    }
    // Calculate from experience
    return getLevelFromExp(this.exp, this.species);
  }
  set level(value: number) {
    this.levelStored = value;
  }

  /**
   * Alias for level (compatibility with PK1).
   * Always calculates from experience for accuracy.
   */
  get currentLevel(): number {
    const stored = this.levelStored;
    if (stored > 0 && stored <= 100) return stored;
    return getLevelFromExp(this.exp, this.species);
  }

  /** Special stat alias for Gen 1 compatibility (returns SpA) */
  get statSPC(): number {
    return this.statSPA;
  }
  set statSPC(value: number) {
    this.statSPA = value;
  }

  /** Check if Pokemon data is valid */
  get isValid(): boolean {
    return this.species > 0 && this.species <= MAX_SPECIES_ID_2;
  }

  /** Check if this slot is empty */
  get isEmpty(): boolean {
    return this.species === 0;
  }

  /** Game version */
  get version(): GameVersion {
    return GameVersion.GSC;
  }

  /** Whether Pokemon is shiny (determined by DVs in Gen 2) */
  get isShiny(): boolean {
    // Shiny if ATK DV bit 1 is set, and DEF/SPE/SPC DVs are all 10
    return (this.dv16 & 0x2fff) === 0x2aaa;
  }

  /** Set/unset shiny status by modifying DVs */
  set isShiny(value: boolean) {
    if (value) {
      // Set DVs to shiny values
      this.dvATK = (this.dvATK & 0x0d) | 0x02; // Keep bits 0, 2, 3; set bit 1
      this.dvDEF = 10;
      this.dvSPE = 10;
      this.dvSPC = 10;
    } else {
      // Remove shiny by changing DEF DV
      if (this.isShiny) {
        this.dvDEF = (this.dvDEF + 1) & 0x0f;
      }
    }
  }

  // ========== Stat Calculation ==========

  /**
   * Calculate a stat value using Gen 2 formula.
   */
  calculateStat(
    baseStat: number,
    dv: number,
    ev: number,
    level: number,
    isHP: boolean,
  ): number {
    const evBonus = Math.floor(Math.ceil(Math.sqrt(ev)) / 4);
    const base = Math.floor((((baseStat + dv) * 2 + evBonus) * level) / 100);

    if (isHP) {
      return base + level + 10;
    }
    return base + 5;
  }

  /**
   * Recalculate all stats based on current data.
   * Note: Gen 2 uses the same formula as Gen 1 but with split Special.
   */
  calculateStats(): void {
    const level = this.level;
    // For now, just ensure current HP doesn't exceed max HP
    // Full implementation would need base stats data for Gen 2
    if (this.currentHP > this.statHPMax && this.statHPMax > 0) {
      this.currentHP = this.statHPMax;
    }
  }

  /**
   * Heal Pokemon to full HP and restore all PP.
   */
  heal(): void {
    this.currentHP = this.statHPMax;
    this.statusCondition = 0;

    // Restore PP for each move
    for (let i = 0; i < 4; i++) {
      const move = this.getMove(i);
      if (move > 0) {
        const basePP = getBasePP(move);
        const ppUps = this.getPPUps(i);
        const maxPP = basePP + Math.floor((basePP * ppUps) / 5);
        this.setPP(i, maxPP);
      }
    }
  }

  // ========== Serialization ==========

  /**
   * Get stored (box) format data.
   */
  getStoredData(): Uint8Array {
    return this.data.slice(0, SIZE_2STORED);
  }

  /**
   * Get party format data.
   */
  getPartyData(): Uint8Array {
    return this.data.slice(0, SIZE_2PARTY);
  }

  /**
   * Clone this Pokemon.
   */
  clone(): PK2 {
    const pk = new PK2(this.data.slice(), this.japanese, this.isCrystal);
    pk.otData.set(this.otData);
    pk.nicknameData.set(this.nicknameData);
    return pk;
  }
}
