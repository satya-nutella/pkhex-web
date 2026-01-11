/**
 * Generation 1 Pokemon data structure.
 *
 * PK1 Format:
 * - SIZE_STORED: 33 bytes (box storage)
 * - SIZE_PARTY: 44 bytes (party format includes calculated stats)
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
import {
  getSpeciesNational1,
  getSpeciesInternal1,
  getSpeciesName,
} from "../../data/species";
import { getMoveName, getBasePP } from "../../data/moves";
import { getBaseStats1 } from "../../data/types";
import { getLevelFromExp } from "../../data/experience";
import { GameVersion } from "../game/GameVersion";

export const SIZE_1STORED = 33;
export const SIZE_1PARTY = 44;

/**
 * Gen 1 Pokemon class.
 */
export class PK1 {
  /** Raw binary data */
  readonly data: Uint8Array;

  /** Original Trainer name (stored separately in Gen 1) */
  readonly otData: Uint8Array;

  /** Nickname (stored separately in Gen 1) */
  readonly nicknameData: Uint8Array;

  /** Whether this is from a Japanese save */
  readonly japanese: boolean;

  constructor(data?: Uint8Array, japanese: boolean = false) {
    this.japanese = japanese;
    const stringLength = getStringLength1(japanese);

    if (data) {
      // Ensure we have party-sized data
      this.data = new Uint8Array(SIZE_1PARTY);
      this.data.set(data.slice(0, Math.min(data.length, SIZE_1PARTY)));
    } else {
      this.data = new Uint8Array(SIZE_1PARTY);
    }

    this.otData = new Uint8Array(stringLength);
    this.otData.fill(0x50); // Terminator

    this.nicknameData = new Uint8Array(stringLength);
    this.nicknameData.fill(0x50); // Terminator
  }

  // ========== Basic Properties ==========

  /** Internal species ID (Gen 1 uses different IDs than national dex) */
  get speciesInternal(): number {
    return this.data[0];
  }
  set speciesInternal(value: number) {
    this.data[0] = value;
  }

  /** National Pokedex species number */
  get species(): number {
    return getSpeciesNational1(this.speciesInternal);
  }
  set species(value: number) {
    this.speciesInternal = getSpeciesInternal1(value);
  }

  /** Species name */
  get speciesName(): string {
    return getSpeciesName(this.species);
  }

  /** Current HP */
  get currentHP(): number {
    return readUInt16BE(this.data, 0x01);
  }
  set currentHP(value: number) {
    writeUInt16BE(this.data, 0x01, value);
  }

  /** Level (stored in box data at offset 3) */
  get levelBox(): number {
    return this.data[0x03];
  }
  set levelBox(value: number) {
    this.data[0x03] = value;
  }

  /** Status condition */
  get statusCondition(): number {
    return this.data[0x04];
  }
  set statusCondition(value: number) {
    this.data[0x04] = value;
  }

  /** Type 1 */
  get type1(): number {
    return this.data[0x05];
  }
  set type1(value: number) {
    this.data[0x05] = value;
  }

  /** Type 2 */
  get type2(): number {
    return this.data[0x06];
  }
  set type2(value: number) {
    this.data[0x06] = value;
  }

  /** Catch Rate (used as held item in Gen 2 transfer) */
  get catchRate(): number {
    return this.data[0x07];
  }
  set catchRate(value: number) {
    this.data[0x07] = value;
  }

  // ========== Moves ==========

  get move1(): number {
    return this.data[0x08];
  }
  set move1(value: number) {
    this.data[0x08] = value;
  }

  get move2(): number {
    return this.data[0x09];
  }
  set move2(value: number) {
    this.data[0x09] = value;
  }

  get move3(): number {
    return this.data[0x0a];
  }
  set move3(value: number) {
    this.data[0x0a] = value;
  }

  get move4(): number {
    return this.data[0x0b];
  }
  set move4(value: number) {
    this.data[0x0b] = value;
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
    return readUInt16BE(this.data, 0x0c);
  }
  set tid16(value: number) {
    writeUInt16BE(this.data, 0x0c, value);
  }

  // ========== Experience ==========

  /** Experience points (24-bit) */
  get exp(): number {
    return readUInt24BE(this.data, 0x0e);
  }
  set exp(value: number) {
    writeUInt24BE(this.data, 0x0e, value);
  }

  // ========== EVs (Effort Values) ==========

  get evHP(): number {
    return readUInt16BE(this.data, 0x11);
  }
  set evHP(value: number) {
    writeUInt16BE(this.data, 0x11, Math.min(65535, Math.max(0, value)));
  }

  get evATK(): number {
    return readUInt16BE(this.data, 0x13);
  }
  set evATK(value: number) {
    writeUInt16BE(this.data, 0x13, Math.min(65535, Math.max(0, value)));
  }

  get evDEF(): number {
    return readUInt16BE(this.data, 0x15);
  }
  set evDEF(value: number) {
    writeUInt16BE(this.data, 0x15, Math.min(65535, Math.max(0, value)));
  }

  get evSPE(): number {
    return readUInt16BE(this.data, 0x17);
  }
  set evSPE(value: number) {
    writeUInt16BE(this.data, 0x17, Math.min(65535, Math.max(0, value)));
  }

  /** Special EV (Gen 1 doesn't split Special) */
  get evSPC(): number {
    return readUInt16BE(this.data, 0x19);
  }
  set evSPC(value: number) {
    writeUInt16BE(this.data, 0x19, Math.min(65535, Math.max(0, value)));
  }

  // ========== DVs (IVs in Gen 1-2 terminology) ==========

  /** Raw DV16 value containing all DVs packed */
  get dv16(): number {
    return readUInt16BE(this.data, 0x1b);
  }
  set dv16(value: number) {
    writeUInt16BE(this.data, 0x1b, value);
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
    return this.data[0x1d] & 0x3f;
  }
  set move1PP(value: number) {
    this.data[0x1d] = (this.data[0x1d] & 0xc0) | Math.min(63, value);
  }

  get move2PP(): number {
    return this.data[0x1e] & 0x3f;
  }
  set move2PP(value: number) {
    this.data[0x1e] = (this.data[0x1e] & 0xc0) | Math.min(63, value);
  }

  get move3PP(): number {
    return this.data[0x1f] & 0x3f;
  }
  set move3PP(value: number) {
    this.data[0x1f] = (this.data[0x1f] & 0xc0) | Math.min(63, value);
  }

  get move4PP(): number {
    return this.data[0x20] & 0x3f;
  }
  set move4PP(value: number) {
    this.data[0x20] = (this.data[0x20] & 0xc0) | Math.min(63, value);
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
    return (this.data[0x1d] >> 6) & 0x03;
  }
  set move1PPUps(value: number) {
    this.data[0x1d] = (this.data[0x1d] & 0x3f) | ((value & 0x03) << 6);
  }

  get move2PPUps(): number {
    return (this.data[0x1e] >> 6) & 0x03;
  }
  set move2PPUps(value: number) {
    this.data[0x1e] = (this.data[0x1e] & 0x3f) | ((value & 0x03) << 6);
  }

  get move3PPUps(): number {
    return (this.data[0x1f] >> 6) & 0x03;
  }
  set move3PPUps(value: number) {
    this.data[0x1f] = (this.data[0x1f] & 0x3f) | ((value & 0x03) << 6);
  }

  get move4PPUps(): number {
    return (this.data[0x20] >> 6) & 0x03;
  }
  set move4PPUps(value: number) {
    this.data[0x20] = (this.data[0x20] & 0x3f) | ((value & 0x03) << 6);
  }

  // ========== Party Data (offsets 0x21-0x2B) ==========

  /** Level (party data) */
  get level(): number {
    return this.data[0x21];
  }
  set level(value: number) {
    this.data[0x21] = value;
    this.levelBox = value;
  }

  /** Max HP stat */
  get statHPMax(): number {
    return readUInt16BE(this.data, 0x22);
  }
  set statHPMax(value: number) {
    writeUInt16BE(this.data, 0x22, value);
  }

  /** Attack stat */
  get statATK(): number {
    return readUInt16BE(this.data, 0x24);
  }
  set statATK(value: number) {
    writeUInt16BE(this.data, 0x24, value);
  }

  /** Defense stat */
  get statDEF(): number {
    return readUInt16BE(this.data, 0x26);
  }
  set statDEF(value: number) {
    writeUInt16BE(this.data, 0x26, value);
  }

  /** Speed stat */
  get statSPE(): number {
    return readUInt16BE(this.data, 0x28);
  }
  set statSPE(value: number) {
    writeUInt16BE(this.data, 0x28, value);
  }

  /** Special stat (Gen 1 doesn't split Sp.Atk/Sp.Def) */
  get statSPC(): number {
    return readUInt16BE(this.data, 0x2a);
  }
  set statSPC(value: number) {
    writeUInt16BE(this.data, 0x2a, value);
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
   * Calculate current level.
   * Uses party level if valid, otherwise box level, otherwise calculates from EXP.
   */
  get currentLevel(): number {
    // Use party level if valid
    if (this.level > 0 && this.level <= 100) return this.level;
    // Use box level if valid
    if (this.levelBox > 0 && this.levelBox <= 100) return this.levelBox;
    // Calculate from experience
    return getLevelFromExp(this.exp, this.species);
  }

  /** Check if Pokemon data is valid */
  get isValid(): boolean {
    return this.species > 0 && this.species <= 151;
  }

  /** Check if this slot is empty */
  get isEmpty(): boolean {
    return this.speciesInternal === 0 || this.species === 0;
  }

  /** Game version (Gen 1 doesn't store this, assume RBY) */
  get version(): GameVersion {
    return GameVersion.RBY;
  }

  // ========== Stat Calculation ==========

  /**
   * Calculate a stat value using Gen 1 formula.
   */
  calculateStat(
    baseStat: number,
    dv: number,
    ev: number,
    level: number,
    isHP: boolean,
  ): number {
    // Gen 1 stat formula:
    // HP: ((Base + DV) * 2 + ceil(sqrt(EV)) / 4) * Level / 100 + Level + 10
    // Other: ((Base + DV) * 2 + ceil(sqrt(EV)) / 4) * Level / 100 + 5

    const evBonus = Math.floor(Math.ceil(Math.sqrt(ev)) / 4);
    const base = Math.floor((((baseStat + dv) * 2 + evBonus) * level) / 100);

    if (isHP) {
      return base + level + 10;
    }
    return base + 5;
  }

  /**
   * Recalculate all stats based on current data.
   */
  calculateStats(): void {
    const baseStats = getBaseStats1(this.species);
    const level = this.currentLevel;

    this.statHPMax = this.calculateStat(
      baseStats[0],
      this.dvHP,
      this.evHP,
      level,
      true,
    );
    this.statATK = this.calculateStat(
      baseStats[1],
      this.dvATK,
      this.evATK,
      level,
      false,
    );
    this.statDEF = this.calculateStat(
      baseStats[2],
      this.dvDEF,
      this.evDEF,
      level,
      false,
    );
    this.statSPE = this.calculateStat(
      baseStats[3],
      this.dvSPE,
      this.evSPE,
      level,
      false,
    );
    this.statSPC = this.calculateStat(
      baseStats[4],
      this.dvSPC,
      this.evSPC,
      level,
      false,
    );

    // Set current HP to max HP if not set
    if (this.currentHP === 0 || this.currentHP > this.statHPMax) {
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

  // ========== Serialization ==========

  /**
   * Get stored (box) format data.
   */
  getStoredData(): Uint8Array {
    return this.data.slice(0, SIZE_1STORED);
  }

  /**
   * Get party format data.
   */
  getPartyData(): Uint8Array {
    return this.data.slice(0, SIZE_1PARTY);
  }

  /**
   * Clone this Pokemon.
   */
  clone(): PK1 {
    const pk = new PK1(this.data.slice(), this.japanese);
    pk.otData.set(this.otData);
    pk.nicknameData.set(this.nicknameData);
    return pk;
  }
}
