/**
 * Generation 1 Save File handler.
 *
 * SAV1 Format:
 * - Size: 32KB (0x8000 bytes)
 * - Supports Red, Blue, Yellow (RBY)
 * - Japanese and International versions have different offsets
 */

import {
  readUInt8,
  readUInt16BE,
  writeUInt8,
  writeUInt16BE,
  getFlag,
  setFlag,
  readBCD,
  writeBCD,
} from "../../utils/binary";
import {
  getString1,
  setString1,
  getStringLength1,
  TERMINATOR_CODE,
} from "../../utils/strings";
import {
  checksumRBY,
  setChecksum1,
  verifyChecksum1,
} from "../../utils/checksum";
import { GameVersion } from "../game/GameVersion";
import { PK1, SIZE_1STORED, SIZE_1PARTY } from "../pkm/PK1";

// Save file size
export const SIZE_G1RAW = 0x8000; // 32KB

// Memory offsets for International (US/EU) saves
const OFFSETS_INT = {
  OT: 0x2598,
  DexCaught: 0x25a3,
  DexSeen: 0x25b6,
  Items: 0x25c9,
  Money: 0x25f3,
  Rival: 0x25f6,
  Options: 0x2601,
  Badges: 0x2602,
  TID16: 0x2605,
  PikaFriendship: 0x271c,
  PikaBeachScore: 0x2741,
  PrinterBrightness: 0x2744,
  PCItems: 0x27e6,
  CurrentBoxIndex: 0x284c,
  HallOfFameCount: 0x284e,
  Coin: 0x2850,
  ObjectSpawnFlags: 0x2852,
  EventWork: 0x289c,
  Starter: 0x29c3,
  EventFlag: 0x29f3,
  PlayTime: 0x2ced,
  Daycare: 0x2cf4,
  Party: 0x2f2c,
  CurrentBox: 0x30c0,
  ChecksumOfs: 0x3523,
};

// Memory offsets for Japanese saves
const OFFSETS_JPN = {
  OT: 0x2598,
  DexCaught: 0x259e,
  DexSeen: 0x25b1,
  Items: 0x25c4,
  Money: 0x25ee,
  Rival: 0x25f1,
  Options: 0x25f7,
  Badges: 0x25f8,
  TID16: 0x25fb,
  PikaFriendship: 0x2712,
  PikaBeachScore: 0x2737,
  PrinterBrightness: 0x273a,
  PCItems: 0x27dc,
  CurrentBoxIndex: 0x2842,
  HallOfFameCount: 0x2844,
  Coin: 0x2846,
  ObjectSpawnFlags: 0x2848,
  EventWork: 0x2892,
  Starter: 0x29b9,
  EventFlag: 0x29e9,
  PlayTime: 0x2ca0,
  Daycare: 0x2ca7,
  Party: 0x2ed5,
  CurrentBox: 0x302d,
  ChecksumOfs: 0x3594,
};

/**
 * Gen 1 Save File class.
 */
export class SAV1 {
  /** Raw save file data */
  readonly data: Uint8Array;

  /** Whether this is a Japanese save */
  readonly japanese: boolean;

  /** Game version (RB or Y) */
  version: GameVersion;

  /** Memory offsets for this save type */
  private readonly offsets: typeof OFFSETS_INT;

  constructor(
    data: Uint8Array,
    japanese: boolean = false,
    version: GameVersion = GameVersion.RBY,
  ) {
    if (data.length !== SIZE_G1RAW) {
      throw new Error(
        `Invalid save file size: ${data.length} bytes (expected ${SIZE_G1RAW})`,
      );
    }

    this.data = new Uint8Array(data);
    this.japanese = japanese;
    this.offsets = japanese ? OFFSETS_JPN : OFFSETS_INT;
    this.version = version;

    // Try to detect if this is Yellow based on starter/Pikachu friendship
    this.detectVersion();
  }

  /**
   * Detect whether this is Pokemon Yellow based on save data.
   */
  private detectVersion(): void {
    if (this.version !== GameVersion.RBY) {
      return; // Already set
    }

    const starter = this.data[this.offsets.Starter];
    const pikaFriendship = this.data[this.offsets.PikaFriendship];

    if (starter !== 0) {
      // Pikachu internal ID is 0x54
      this.version = starter === 0x54 ? GameVersion.YW : GameVersion.RB;
    } else if (pikaFriendship !== 0) {
      // Yellow has Pikachu friendship, RB doesn't
      this.version = GameVersion.YW;
    } else {
      this.version = GameVersion.RB;
    }
  }

  // ========== Save File Properties ==========

  /** String length for this save type */
  get stringLength(): number {
    return getStringLength1(this.japanese);
  }

  /** Maximum trainer name length */
  get maxTrainerNameLength(): number {
    return this.japanese ? 5 : 7;
  }

  /** Maximum nickname length */
  get maxNicknameLength(): number {
    return this.japanese ? 5 : 10;
  }

  /** Number of boxes */
  get boxCount(): number {
    return this.japanese ? 8 : 12;
  }

  /** Pokemon per box */
  get boxSlotCount(): number {
    return this.japanese ? 30 : 20;
  }

  /** Total storage slots */
  get totalSlots(): number {
    return this.boxCount * this.boxSlotCount;
  }

  // ========== Checksum ==========

  /** Verify save file checksum */
  get checksumValid(): boolean {
    return verifyChecksum1(
      this.data,
      this.offsets.ChecksumOfs,
      this.offsets.OT,
    );
  }

  /** Recalculate and set checksum */
  setChecksum(): void {
    setChecksum1(this.data, this.offsets.ChecksumOfs, this.offsets.OT);
  }

  // ========== Trainer Info ==========

  /** Trainer name */
  get trainerName(): string {
    return getString1(
      this.data,
      this.offsets.OT,
      this.maxTrainerNameLength + 1,
      this.japanese,
    );
  }
  set trainerName(value: string) {
    setString1(
      this.data,
      this.offsets.OT,
      value,
      this.maxTrainerNameLength,
      this.japanese,
      0,
    );
  }

  /** Trainer ID (16-bit) */
  get tid16(): number {
    return readUInt16BE(this.data, this.offsets.TID16);
  }
  set tid16(value: number) {
    writeUInt16BE(this.data, this.offsets.TID16, value);
  }

  /** Rival name */
  get rivalName(): string {
    return getString1(
      this.data,
      this.offsets.Rival,
      this.maxTrainerNameLength + 1,
      this.japanese,
    );
  }
  set rivalName(value: string) {
    setString1(
      this.data,
      this.offsets.Rival,
      value,
      this.maxTrainerNameLength,
      this.japanese,
    );
  }

  /** Money (stored as BCD) */
  get money(): number {
    return readBCD(this.data, this.offsets.Money, 3);
  }
  set money(value: number) {
    writeBCD(
      this.data,
      this.offsets.Money,
      3,
      Math.min(999999, Math.max(0, value)),
    );
  }

  /** Casino coins (stored as BCD) */
  get coins(): number {
    return readBCD(this.data, this.offsets.Coin, 2);
  }
  set coins(value: number) {
    writeBCD(
      this.data,
      this.offsets.Coin,
      2,
      Math.min(9999, Math.max(0, value)),
    );
  }

  /** Badges bitmap */
  get badges(): number {
    return this.data[this.offsets.Badges];
  }
  set badges(value: number) {
    this.data[this.offsets.Badges] = value & 0xff;
  }

  /** Get individual badge */
  getBadge(index: number): boolean {
    return (this.badges & (1 << index)) !== 0;
  }

  /** Set individual badge */
  setBadge(index: number, value: boolean): void {
    if (value) {
      this.badges |= 1 << index;
    } else {
      this.badges &= ~(1 << index);
    }
  }

  /** Number of badges obtained */
  get badgeCount(): number {
    let count = 0;
    let badges = this.badges;
    while (badges) {
      count += badges & 1;
      badges >>= 1;
    }
    return count;
  }

  // ========== Play Time ==========

  /** Hours played */
  get playedHours(): number {
    return this.data[this.offsets.PlayTime];
  }
  set playedHours(value: number) {
    if (value >= 255) {
      this.data[this.offsets.PlayTime] = 255;
      this.playedMaximum = true;
    } else {
      this.data[this.offsets.PlayTime] = value;
    }
  }

  /** Whether max play time reached */
  get playedMaximum(): boolean {
    return this.data[this.offsets.PlayTime + 1] !== 0;
  }
  set playedMaximum(value: boolean) {
    this.data[this.offsets.PlayTime + 1] = value ? 1 : 0;
  }

  /** Minutes played */
  get playedMinutes(): number {
    return this.data[this.offsets.PlayTime + 2];
  }
  set playedMinutes(value: number) {
    this.data[this.offsets.PlayTime + 2] = Math.min(59, value);
  }

  /** Seconds played */
  get playedSeconds(): number {
    return this.data[this.offsets.PlayTime + 3];
  }
  set playedSeconds(value: number) {
    this.data[this.offsets.PlayTime + 3] = Math.min(59, value);
  }

  /** Formatted play time string */
  get playTimeString(): string {
    return `${this.playedHours}:${this.playedMinutes.toString().padStart(2, "0")}:${this.playedSeconds.toString().padStart(2, "0")}`;
  }

  // ========== Options ==========

  /** Raw options byte */
  get options(): number {
    return this.data[this.offsets.Options];
  }
  set options(value: number) {
    this.data[this.offsets.Options] = value;
  }

  /** Battle effects enabled */
  get battleEffects(): boolean {
    return (this.options & 0x80) === 0;
  }
  set battleEffects(value: boolean) {
    this.options = (this.options & 0x7f) | (value ? 0 : 0x80);
  }

  /** Battle style - Switch mode */
  get battleStyleSwitch(): boolean {
    return (this.options & 0x40) === 0;
  }
  set battleStyleSwitch(value: boolean) {
    this.options = (this.options & 0xbf) | (value ? 0 : 0x40);
  }

  /** Sound setting (0=Mono, 1=Earphone1, 2=Earphone2, 3=Earphone3) */
  get sound(): number {
    return (this.options >> 4) & 0x03;
  }
  set sound(value: number) {
    this.options = (this.options & 0xcf) | ((value & 0x03) << 4);
  }

  /** Text speed (1=Fast, 3=Medium, 5=Slow) */
  get textSpeed(): number {
    return this.options & 0x07;
  }
  set textSpeed(value: number) {
    this.options = (this.options & 0xf8) | (value & 0x07);
  }

  // ========== Pokedex ==========

  /** Check if species is seen */
  getSeen(species: number): boolean {
    if (species < 1 || species > 151) return false;
    const bit = species - 1;
    const byteOffset = this.offsets.DexSeen + (bit >> 3);
    return getFlag(this.data, byteOffset, bit & 7);
  }

  /** Set species as seen */
  setSeen(species: number, seen: boolean): void {
    if (species < 1 || species > 151) return;
    const bit = species - 1;
    const byteOffset = this.offsets.DexSeen + (bit >> 3);
    setFlag(this.data, byteOffset, bit & 7, seen);
  }

  /** Check if species is caught */
  getCaught(species: number): boolean {
    if (species < 1 || species > 151) return false;
    const bit = species - 1;
    const byteOffset = this.offsets.DexCaught + (bit >> 3);
    return getFlag(this.data, byteOffset, bit & 7);
  }

  /** Set species as caught */
  setCaught(species: number, caught: boolean): void {
    if (species < 1 || species > 151) return;
    const bit = species - 1;
    const byteOffset = this.offsets.DexCaught + (bit >> 3);
    setFlag(this.data, byteOffset, bit & 7, caught);
    // Also mark as seen if caught
    if (caught) {
      this.setSeen(species, true);
    }
  }

  /** Count of seen Pokemon */
  get seenCount(): number {
    let count = 0;
    for (let i = 1; i <= 151; i++) {
      if (this.getSeen(i)) count++;
    }
    return count;
  }

  /** Count of caught Pokemon */
  get caughtCount(): number {
    let count = 0;
    for (let i = 1; i <= 151; i++) {
      if (this.getCaught(i)) count++;
    }
    return count;
  }

  // ========== Party Pokemon ==========

  /** Number of Pokemon in party */
  get partyCount(): number {
    return this.data[this.offsets.Party];
  }
  set partyCount(value: number) {
    this.data[this.offsets.Party] = Math.min(6, Math.max(0, value));
  }

  /**
   * Get party Pokemon at slot (0-5).
   * Note: Gen 1 stores party data in a special list format.
   */
  getPartyPokemon(slot: number): PK1 | null {
    if (slot < 0 || slot >= this.partyCount) {
      return null;
    }

    // Party list format:
    // [0] = count
    // [1-7] = species list (6 pokemon + terminator 0xFF)
    // [8+] = Pokemon data blocks
    // After pokemon data: OT names, then nicknames

    const partyBase = this.offsets.Party;
    const listOffset = partyBase + 1; // Species list starts at +1

    // Check if slot has a Pokemon
    const speciesInternal = this.data[listOffset + slot];
    if (speciesInternal === 0 || speciesInternal === 0xff) {
      return null;
    }

    // Calculate offsets
    // Party data starts after species list (8 bytes: 1 count + 6 species + 1 terminator)
    const dataOffset = partyBase + 8 + slot * SIZE_1PARTY;

    // OT names start after all pokemon data
    const otOffset = partyBase + 8 + 6 * SIZE_1PARTY + slot * this.stringLength;

    // Nicknames start after all OT names
    const nickOffset =
      partyBase +
      8 +
      6 * SIZE_1PARTY +
      6 * this.stringLength +
      slot * this.stringLength;

    // Create PK1 and copy data
    const pk = new PK1(undefined, this.japanese);
    pk.data.set(this.data.slice(dataOffset, dataOffset + SIZE_1PARTY));
    pk.otData.set(this.data.slice(otOffset, otOffset + this.stringLength));
    pk.nicknameData.set(
      this.data.slice(nickOffset, nickOffset + this.stringLength),
    );

    return pk;
  }

  /**
   * Set party Pokemon at slot (0-5).
   */
  setPartyPokemon(slot: number, pk: PK1 | null): void {
    if (slot < 0 || slot >= 6) {
      return;
    }

    const partyBase = this.offsets.Party;
    const listOffset = partyBase + 1;
    const dataOffset = partyBase + 8 + slot * SIZE_1PARTY;
    const otOffset = partyBase + 8 + 6 * SIZE_1PARTY + slot * this.stringLength;
    const nickOffset =
      partyBase +
      8 +
      6 * SIZE_1PARTY +
      6 * this.stringLength +
      slot * this.stringLength;

    if (pk === null || pk.isEmpty) {
      // Clear slot
      this.data[listOffset + slot] = 0xff;
      this.data.fill(0, dataOffset, dataOffset + SIZE_1PARTY);
      this.data.fill(TERMINATOR_CODE, otOffset, otOffset + this.stringLength);
      this.data.fill(
        TERMINATOR_CODE,
        nickOffset,
        nickOffset + this.stringLength,
      );

      // Update party count
      this.updatePartyCount();
      return;
    }

    // Set species in list
    this.data[listOffset + slot] = pk.speciesInternal;

    // Copy pokemon data
    this.data.set(pk.getPartyData(), dataOffset);

    // Copy OT name
    this.data.set(pk.otData.slice(0, this.stringLength), otOffset);

    // Copy nickname
    this.data.set(pk.nicknameData.slice(0, this.stringLength), nickOffset);

    // Update party count
    this.updatePartyCount();

    // Update pokedex
    this.setCaught(pk.species, true);
  }

  /** Update party count based on non-empty slots */
  private updatePartyCount(): void {
    const partyBase = this.offsets.Party;
    const listOffset = partyBase + 1;

    let count = 0;
    for (let i = 0; i < 6; i++) {
      const species = this.data[listOffset + i];
      if (species !== 0 && species !== 0xff) {
        count = i + 1;
      }
    }
    this.partyCount = count;

    // Set terminator
    this.data[listOffset + count] = 0xff;
  }

  /** Get all party Pokemon */
  getParty(): (PK1 | null)[] {
    const party: (PK1 | null)[] = [];
    for (let i = 0; i < 6; i++) {
      party.push(this.getPartyPokemon(i));
    }
    return party;
  }

  // ========== Box Pokemon ==========

  /** Current active box index (0-based) */
  get currentBox(): number {
    return this.data[this.offsets.CurrentBoxIndex] & 0x7f;
  }
  set currentBox(value: number) {
    const oldValue = this.data[this.offsets.CurrentBoxIndex];
    this.data[this.offsets.CurrentBoxIndex] =
      (oldValue & 0x80) | (value & 0x7f);
  }

  /** Whether boxes have been initialized */
  get boxesInitialized(): boolean {
    return (this.data[this.offsets.CurrentBoxIndex] & 0x80) !== 0;
  }
  set boxesInitialized(value: boolean) {
    if (value) {
      this.data[this.offsets.CurrentBoxIndex] |= 0x80;
    } else {
      this.data[this.offsets.CurrentBoxIndex] &= 0x7f;
    }
  }

  /**
   * Get raw offset for a box's data in the save file.
   * Boxes 1-6 are at 0x4000, boxes 7-12 are at 0x6000.
   */
  private getBoxRawOffset(box: number): number {
    // Box list size varies by language
    const boxListSize = this.calculateBoxListSize();

    if (box < this.boxCount / 2) {
      return 0x4000 + box * boxListSize;
    }
    return 0x6000 + (box - this.boxCount / 2) * boxListSize;
  }

  /** Calculate size of a box list structure */
  private calculateBoxListSize(): number {
    // Format: [count][species list][pokemon data][ot names][nicknames]
    // = 1 + (slots + 1) + (slots * stored size) + (slots * string length * 2)
    const slots = this.boxSlotCount;
    return (
      1 + (slots + 1) + slots * SIZE_1STORED + slots * this.stringLength * 2
    );
  }

  /**
   * Get box Pokemon at slot.
   * Note: Current box is stored at a different location than other boxes.
   */
  getBoxPokemon(box: number, slot: number): PK1 | null {
    if (
      box < 0 ||
      box >= this.boxCount ||
      slot < 0 ||
      slot >= this.boxSlotCount
    ) {
      return null;
    }

    // Determine base offset
    let baseOffset: number;
    if (box === this.currentBox) {
      baseOffset = this.offsets.CurrentBox;
    } else {
      baseOffset = this.getBoxRawOffset(box);
    }

    const listOffset = baseOffset + 1;
    const dataOffset = baseOffset + 1 + this.boxSlotCount + 1;
    const otOffset = dataOffset + this.boxSlotCount * SIZE_1STORED;
    const nickOffset = otOffset + this.boxSlotCount * this.stringLength;

    // Check if slot has a Pokemon
    const speciesInternal = this.data[listOffset + slot];
    if (speciesInternal === 0 || speciesInternal === 0xff) {
      return null;
    }

    // Create PK1 and copy data
    const pk = new PK1(undefined, this.japanese);

    // Copy stored data (33 bytes)
    const pkDataOffset = dataOffset + slot * SIZE_1STORED;
    pk.data.set(this.data.slice(pkDataOffset, pkDataOffset + SIZE_1STORED));

    // Copy OT and nickname
    const pkOtOffset = otOffset + slot * this.stringLength;
    const pkNickOffset = nickOffset + slot * this.stringLength;
    pk.otData.set(this.data.slice(pkOtOffset, pkOtOffset + this.stringLength));
    pk.nicknameData.set(
      this.data.slice(pkNickOffset, pkNickOffset + this.stringLength),
    );

    // Calculate stats since box format doesn't store them
    pk.level = pk.levelBox;
    pk.calculateStats();

    return pk;
  }

  /**
   * Set box Pokemon at slot.
   */
  setBoxPokemon(box: number, slot: number, pk: PK1 | null): void {
    if (
      box < 0 ||
      box >= this.boxCount ||
      slot < 0 ||
      slot >= this.boxSlotCount
    ) {
      return;
    }

    // Determine base offset
    let baseOffset: number;
    if (box === this.currentBox) {
      baseOffset = this.offsets.CurrentBox;
    } else {
      baseOffset = this.getBoxRawOffset(box);
    }

    const listOffset = baseOffset + 1;
    const dataOffset = baseOffset + 1 + this.boxSlotCount + 1;
    const otOffset = dataOffset + this.boxSlotCount * SIZE_1STORED;
    const nickOffset = otOffset + this.boxSlotCount * this.stringLength;

    // Update species list
    if (pk === null || pk.species === 0) {
      this.data[listOffset + slot] = 0xff;
      // Zero out the stored data
      const pkDataOffset = dataOffset + slot * SIZE_1STORED;
      this.data.fill(0, pkDataOffset, pkDataOffset + SIZE_1STORED);
      // Zero out OT and nickname
      const pkOtOffset = otOffset + slot * this.stringLength;
      const pkNickOffset = nickOffset + slot * this.stringLength;
      this.data.fill(0, pkOtOffset, pkOtOffset + this.stringLength);
      this.data.fill(0, pkNickOffset, pkNickOffset + this.stringLength);
    } else {
      // Set species in list
      this.data[listOffset + slot] = pk.speciesInternal;
      // Copy stored data (33 bytes)
      const pkDataOffset = dataOffset + slot * SIZE_1STORED;
      this.data.set(pk.data.slice(0, SIZE_1STORED), pkDataOffset);
      // Copy OT and nickname
      const pkOtOffset = otOffset + slot * this.stringLength;
      const pkNickOffset = nickOffset + slot * this.stringLength;
      this.data.set(pk.otData.slice(0, this.stringLength), pkOtOffset);
      this.data.set(pk.nicknameData.slice(0, this.stringLength), pkNickOffset);
    }

    // Update box Pokemon count
    let count = 0;
    for (let i = 0; i < this.boxSlotCount; i++) {
      if (
        this.data[listOffset + i] !== 0xff &&
        this.data[listOffset + i] !== 0
      ) {
        count++;
      }
    }
    this.data[baseOffset] = count;
  }

  // ========== Pikachu (Yellow only) ==========

  /** Pikachu friendship (Yellow only) */
  get pikaFriendship(): number {
    return this.data[this.offsets.PikaFriendship];
  }
  set pikaFriendship(value: number) {
    this.data[this.offsets.PikaFriendship] = Math.min(255, Math.max(0, value));
  }

  // ========== Export ==========

  /**
   * Get the save file data with updated checksum.
   */
  export(): Uint8Array {
    this.setChecksum();
    return new Uint8Array(this.data);
  }

  /**
   * Create a summary of the save file.
   */
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
  } {
    return {
      trainerName: this.trainerName,
      trainerId: this.tid16,
      version: this.version === GameVersion.YW ? "Yellow" : "Red/Blue",
      playTime: this.playTimeString,
      badges: this.badgeCount,
      money: this.money,
      partyCount: this.partyCount,
      pokedexSeen: this.seenCount,
      pokedexCaught: this.caughtCount,
      checksumValid: this.checksumValid,
    };
  }
}

// ========== Save Detection ==========

/**
 * Detect if data is a valid Gen 1 save file.
 */
export function isGen1Save(data: Uint8Array): boolean {
  return data.length === SIZE_G1RAW;
}

/**
 * Detect if a Gen 1 save is Japanese.
 */
export function isGen1Japanese(data: Uint8Array): boolean {
  if (data.length !== SIZE_G1RAW) {
    return false;
  }

  // Check checksums for both Japanese and International formats
  const checksumValidInt = verifyChecksum1(
    data,
    OFFSETS_INT.ChecksumOfs,
    OFFSETS_INT.OT,
  );
  const checksumValidJpn = verifyChecksum1(
    data,
    OFFSETS_JPN.ChecksumOfs,
    OFFSETS_JPN.OT,
  );

  // If only Japanese checksum is valid, it's Japanese
  if (checksumValidJpn && !checksumValidInt) {
    return true;
  }

  // If only International checksum is valid, it's International
  if (checksumValidInt && !checksumValidJpn) {
    return false;
  }

  // If both or neither are valid, try to detect by party count location
  // Japanese party count is at a different offset
  const intPartyCount = data[OFFSETS_INT.Party];
  const jpnPartyCount = data[OFFSETS_JPN.Party];

  // Valid party count is 0-6
  if (intPartyCount <= 6 && jpnPartyCount > 6) {
    return false;
  }
  if (jpnPartyCount <= 6 && intPartyCount > 6) {
    return true;
  }

  // Default to International
  return false;
}

/**
 * Detect if a Gen 1 save is Pokemon Yellow.
 */
export function isGen1Yellow(data: Uint8Array, japanese: boolean): boolean {
  const offsets = japanese ? OFFSETS_JPN : OFFSETS_INT;
  const starter = data[offsets.Starter];
  const pikaFriendship = data[offsets.PikaFriendship];

  if (starter !== 0) {
    return starter === 0x54; // Pikachu internal ID
  }
  return pikaFriendship !== 0;
}

/**
 * Load a Gen 1 save file from data.
 */
export function loadSAV1(data: Uint8Array): SAV1 | null {
  if (!isGen1Save(data)) {
    return null;
  }

  const japanese = isGen1Japanese(data);
  const version = isGen1Yellow(data, japanese)
    ? GameVersion.YW
    : GameVersion.RB;

  return new SAV1(data, japanese, version);
}
