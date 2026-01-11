/**
 * Generation 2 Save File handler.
 *
 * SAV2 Format:
 * - Size: 32KB (0x8000 bytes) for International/Korean, 64KB (0x10000) for Japanese
 * - Supports Gold, Silver, Crystal (GSC)
 * - Japanese and International versions have different offsets
 */

import {
  readUInt8,
  readUInt16BE,
  writeUInt8,
  writeUInt16BE,
  readBCD,
  writeBCD,
  getFlag,
  setFlag,
} from "../../utils/binary";
import {
  getString1,
  setString1,
  getStringLength1,
  TERMINATOR_CODE,
} from "../../utils/strings";
import { GameVersion } from "../game/GameVersion";
import { PK2, SIZE_2STORED, SIZE_2PARTY } from "../pkm/PK2";

// Save file sizes
export const SIZE_G2RAW_INT = 0x8000; // 32KB International
export const SIZE_G2RAW_JPN = 0x10000; // 64KB Japanese

// Pokemon counts
const PARTY_SIZE = 6;
const BOX_COUNT_INT = 14;
const BOX_COUNT_JPN = 9;
const BOX_SLOTS_INT = 20;
const BOX_SLOTS_JPN = 30;

// Offsets for Gold/Silver International
const OFFSETS_GS_INT = {
  OT: 0x200b,
  TID16: 0x2009,
  Rival: 0x2021,
  PlayTime: 0x2053,
  Money: 0x23db,
  Badges: 0x23e4,
  DexCaught: 0x2a4c,
  DexSeen: 0x2a6c,
  Party: 0x288a,
  CurrentBoxIndex: 0x2724,
  CurrentBox: 0x2d6c,
  ChecksumOfs: 0x2d69,
  ChecksumOfs2: 0x7e6d,
};

// Offsets for Gold/Silver Japanese
const OFFSETS_GS_JPN = {
  OT: 0x200b,
  TID16: 0x2009,
  Rival: 0x2017,
  PlayTime: 0x2034,
  Money: 0x23bc,
  Badges: 0x23c5,
  DexCaught: 0x2a27,
  DexSeen: 0x2a47,
  Party: 0x283e,
  CurrentBoxIndex: 0x2700,
  CurrentBox: 0x2d10,
  ChecksumOfs: 0x2d0d,
  ChecksumOfs2: 0x7f0d,
};

// Offsets for Crystal International
const OFFSETS_C_INT = {
  OT: 0x200b,
  TID16: 0x2009,
  Rival: 0x2021,
  PlayTime: 0x2054,
  Money: 0x23dc,
  Badges: 0x23e5,
  DexCaught: 0x2a56,
  DexSeen: 0x2a76,
  Party: 0x2865,
  CurrentBoxIndex: 0x2700,
  CurrentBox: 0x2d10,
  ChecksumOfs: 0x2d0d,
  ChecksumOfs2: 0x1f0d,
  Gender: 0x3e3d,
};

// Offsets for Crystal Japanese
const OFFSETS_C_JPN = {
  OT: 0x200b,
  TID16: 0x2009,
  Rival: 0x2017,
  PlayTime: 0x2035,
  Money: 0x23bd,
  Badges: 0x23c6,
  DexCaught: 0x2a31,
  DexSeen: 0x2a51,
  Party: 0x281a,
  CurrentBoxIndex: 0x26e2,
  CurrentBox: 0x2d10,
  ChecksumOfs: 0x2d0d,
  ChecksumOfs2: 0x7f0d,
  Gender: 0x8000,
};

type SAV2Offsets = typeof OFFSETS_GS_INT;

/**
 * Gen 2 Save File class.
 */
export class SAV2 {
  /** Raw save file data */
  readonly data: Uint8Array;

  /** Whether this is a Japanese save */
  readonly japanese: boolean;

  /** Whether this is Crystal (vs Gold/Silver) */
  readonly isCrystal: boolean;

  /** Game version */
  version: GameVersion;

  /** Memory offsets for this save type */
  private readonly offsets: SAV2Offsets;

  constructor(
    data: Uint8Array,
    japanese: boolean = false,
    isCrystal: boolean = false,
    version: GameVersion = GameVersion.GSC,
  ) {
    this.data = new Uint8Array(data);
    this.japanese = japanese;
    this.isCrystal = isCrystal;
    this.version = version;

    // Select appropriate offsets
    if (isCrystal) {
      this.offsets = japanese ? OFFSETS_C_JPN : OFFSETS_C_INT;
    } else {
      this.offsets = japanese ? OFFSETS_GS_JPN : OFFSETS_GS_INT;
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
    return this.japanese ? BOX_COUNT_JPN : BOX_COUNT_INT;
  }

  /** Pokemon per box */
  get boxSlotCount(): number {
    return this.japanese ? BOX_SLOTS_JPN : BOX_SLOTS_INT;
  }

  // ========== Checksum ==========

  /** Calculate checksum for the save */
  calculateChecksum(): number {
    let sum = 0;
    const end = this.offsets.ChecksumOfs;
    for (let i = 0x2009; i < end; i++) {
      sum = (sum + this.data[i]) & 0xffff;
    }
    return sum;
  }

  /** Verify save file checksum */
  get checksumValid(): boolean {
    const stored = readUInt16BE(this.data, this.offsets.ChecksumOfs);
    const calculated = this.calculateChecksum();
    return stored === calculated;
  }

  /** Set checksum */
  setChecksum(): void {
    const checksum = this.calculateChecksum();
    writeUInt16BE(this.data, this.offsets.ChecksumOfs, checksum);
    // Also write to backup location
    writeUInt16BE(this.data, this.offsets.ChecksumOfs2, checksum);
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

  /** Money (stored as 3-byte big-endian) */
  get money(): number {
    return (
      (this.data[this.offsets.Money] << 16) |
      (this.data[this.offsets.Money + 1] << 8) |
      this.data[this.offsets.Money + 2]
    );
  }
  set money(value: number) {
    const clamped = Math.min(999999, Math.max(0, value));
    this.data[this.offsets.Money] = (clamped >> 16) & 0xff;
    this.data[this.offsets.Money + 1] = (clamped >> 8) & 0xff;
    this.data[this.offsets.Money + 2] = clamped & 0xff;
  }

  /** Badges bitmap */
  get badges(): number {
    return this.data[this.offsets.Badges];
  }
  set badges(value: number) {
    this.data[this.offsets.Badges] = value & 0xff;
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
    this.data[this.offsets.PlayTime] = Math.min(255, value);
  }

  /** Minutes played */
  get playedMinutes(): number {
    return this.data[this.offsets.PlayTime + 1];
  }
  set playedMinutes(value: number) {
    this.data[this.offsets.PlayTime + 1] = Math.min(59, value);
  }

  /** Seconds played */
  get playedSeconds(): number {
    return this.data[this.offsets.PlayTime + 2];
  }
  set playedSeconds(value: number) {
    this.data[this.offsets.PlayTime + 2] = Math.min(59, value);
  }

  /** Formatted play time string */
  get playTimeString(): string {
    return `${this.playedHours}:${this.playedMinutes.toString().padStart(2, "0")}:${this.playedSeconds.toString().padStart(2, "0")}`;
  }

  // ========== Pokedex ==========

  /** Check if species is seen */
  getSeen(species: number): boolean {
    if (species < 1 || species > 251) return false;
    const bit = species - 1;
    const byteOffset = this.offsets.DexSeen + (bit >> 3);
    return getFlag(this.data, byteOffset, bit & 7);
  }

  /** Set species as seen */
  setSeen(species: number, seen: boolean): void {
    if (species < 1 || species > 251) return;
    const bit = species - 1;
    const byteOffset = this.offsets.DexSeen + (bit >> 3);
    setFlag(this.data, byteOffset, bit & 7, seen);
  }

  /** Check if species is caught */
  getCaught(species: number): boolean {
    if (species < 1 || species > 251) return false;
    const bit = species - 1;
    const byteOffset = this.offsets.DexCaught + (bit >> 3);
    return getFlag(this.data, byteOffset, bit & 7);
  }

  /** Set species as caught */
  setCaught(species: number, caught: boolean): void {
    if (species < 1 || species > 251) return;
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
    for (let i = 1; i <= 251; i++) {
      if (this.getSeen(i)) count++;
    }
    return count;
  }

  /** Count of caught Pokemon */
  get caughtCount(): number {
    let count = 0;
    for (let i = 1; i <= 251; i++) {
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
   */
  getPartyPokemon(slot: number): PK2 | null {
    if (slot < 0 || slot >= this.partyCount) {
      return null;
    }

    const partyBase = this.offsets.Party;
    const listOffset = partyBase + 1;

    // Check if slot has a Pokemon
    const species = this.data[listOffset + slot];
    if (species === 0 || species === 0xff) {
      return null;
    }

    // Calculate offsets
    // Party data starts after species list (8 bytes: 1 count + 6 species + 1 terminator)
    const dataOffset = partyBase + 8 + slot * SIZE_2PARTY;

    // OT names start after all pokemon data
    const otOffset = partyBase + 8 + 6 * SIZE_2PARTY + slot * this.stringLength;

    // Nicknames start after all OT names
    const nickOffset =
      partyBase +
      8 +
      6 * SIZE_2PARTY +
      6 * this.stringLength +
      slot * this.stringLength;

    // Create PK2 and copy data
    const pk = new PK2(undefined, this.japanese, this.isCrystal);
    pk.data.set(this.data.slice(dataOffset, dataOffset + SIZE_2PARTY));
    pk.otData.set(this.data.slice(otOffset, otOffset + this.stringLength));
    pk.nicknameData.set(
      this.data.slice(nickOffset, nickOffset + this.stringLength),
    );

    return pk;
  }

  /**
   * Set party Pokemon at slot (0-5).
   */
  setPartyPokemon(slot: number, pk: PK2 | null): void {
    if (slot < 0 || slot >= 6) {
      return;
    }

    const partyBase = this.offsets.Party;
    const listOffset = partyBase + 1;
    const dataOffset = partyBase + 8 + slot * SIZE_2PARTY;
    const otOffset = partyBase + 8 + 6 * SIZE_2PARTY + slot * this.stringLength;
    const nickOffset =
      partyBase +
      8 +
      6 * SIZE_2PARTY +
      6 * this.stringLength +
      slot * this.stringLength;

    if (pk === null || pk.isEmpty) {
      // Clear slot
      this.data[listOffset + slot] = 0xff;
      this.data.fill(0, dataOffset, dataOffset + SIZE_2PARTY);
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
    this.data[listOffset + slot] = pk.species;

    // Copy pokemon data
    this.data.set(pk.getPartyData(), dataOffset);

    // Copy OT name
    this.data.set(pk.otData.slice(0, this.stringLength), otOffset);

    // Copy nickname
    this.data.set(pk.nicknameData.slice(0, this.stringLength), nickOffset);

    // Update party count
    this.updatePartyCount();
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
  getParty(): (PK2 | null)[] {
    const party: (PK2 | null)[] = [];
    for (let i = 0; i < 6; i++) {
      party.push(this.getPartyPokemon(i));
    }
    return party;
  }

  // ========== Box Pokemon ==========

  /** Current active box index (0-based) */
  get currentBox(): number {
    return this.data[this.offsets.CurrentBoxIndex] & 0x0f;
  }
  set currentBox(value: number) {
    this.data[this.offsets.CurrentBoxIndex] =
      (this.data[this.offsets.CurrentBoxIndex] & 0xf0) | (value & 0x0f);
  }

  /**
   * Get box Pokemon at slot.
   */
  getBoxPokemon(box: number, slot: number): PK2 | null {
    if (
      box < 0 ||
      box >= this.boxCount ||
      slot < 0 ||
      slot >= this.boxSlotCount
    ) {
      return null;
    }

    // For current box, use the active box location
    if (box === this.currentBox) {
      return this.getCurrentBoxPokemon(slot);
    }

    // For other boxes, they're stored in banks
    // This is simplified - full implementation would need bank switching
    return null; // Boxes other than current not fully implemented
  }

  /**
   * Get Pokemon from current box.
   */
  private getCurrentBoxPokemon(slot: number): PK2 | null {
    const boxBase = this.offsets.CurrentBox;
    const count = this.data[boxBase];

    if (slot >= count) {
      return null;
    }

    const listOffset = boxBase + 1;
    const species = this.data[listOffset + slot];
    if (species === 0 || species === 0xff) {
      return null;
    }

    // Calculate offsets for current box format
    const dataOffset =
      boxBase + 1 + this.boxSlotCount + 1 + slot * SIZE_2STORED;
    const otOffset =
      dataOffset +
      this.boxSlotCount * SIZE_2STORED -
      slot * SIZE_2STORED +
      slot * this.stringLength;
    const nickOffset = otOffset + this.boxSlotCount * this.stringLength;

    // Create PK2 from stored data (32 bytes)
    const pk = new PK2(undefined, this.japanese, this.isCrystal);
    pk.data.set(this.data.slice(dataOffset, dataOffset + SIZE_2STORED));

    // Note: OT and nickname offsets are complex in Gen 2 boxes
    // This is a simplified implementation

    return pk;
  }

  /**
   * Set box Pokemon at slot.
   */
  setBoxPokemon(box: number, slot: number, pk: PK2 | null): void {
    if (
      box < 0 ||
      box >= this.boxCount ||
      slot < 0 ||
      slot >= this.boxSlotCount
    ) {
      return;
    }

    // Only current box is supported for now
    if (box !== this.currentBox) {
      return;
    }

    this.setCurrentBoxPokemon(slot, pk);
  }

  /**
   * Set Pokemon in current box.
   */
  private setCurrentBoxPokemon(slot: number, pk: PK2 | null): void {
    const boxBase = this.offsets.CurrentBox;
    const listOffset = boxBase + 1;
    const dataOffset =
      boxBase + 1 + this.boxSlotCount + 1 + slot * SIZE_2STORED;

    if (pk === null || pk.species === 0) {
      // Clear the slot
      this.data[listOffset + slot] = 0xff;
      this.data.fill(0, dataOffset, dataOffset + SIZE_2STORED);
    } else {
      // Set the slot
      this.data[listOffset + slot] = pk.species;
      this.data.set(pk.data.slice(0, SIZE_2STORED), dataOffset);
    }

    // Update box count
    let count = 0;
    for (let i = 0; i < this.boxSlotCount; i++) {
      const species = this.data[listOffset + i];
      if (species !== 0 && species !== 0xff) {
        count++;
      }
    }
    this.data[boxBase] = count;
    // Set terminator
    this.data[listOffset + count] = 0xff;
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
    let versionStr = "Gold/Silver";
    if (this.isCrystal) {
      versionStr = "Crystal";
    }
    if (this.japanese) {
      versionStr += " (JPN)";
    }

    return {
      trainerName: this.trainerName,
      trainerId: this.tid16,
      version: versionStr,
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
 * Detect if data is a valid Gen 2 save file.
 */
export function isGen2Save(data: Uint8Array): boolean {
  return data.length === SIZE_G2RAW_INT || data.length === SIZE_G2RAW_JPN;
}

/**
 * Check if a pokemon list at an offset is valid.
 */
function isValidPokeList(
  data: Uint8Array,
  offset: number,
  maxCount: number,
): boolean {
  if (offset + maxCount + 2 > data.length) return false;

  const count = data[offset];
  if (count > maxCount) return false;

  // Check terminator
  const terminator = data[offset + 1 + count];
  return terminator === 0xff;
}

/**
 * Detect Gen 2 save version (GS vs Crystal, Japanese vs International).
 */
export function detectGen2Version(data: Uint8Array): {
  japanese: boolean;
  isCrystal: boolean;
  version: GameVersion;
} | null {
  if (!isGen2Save(data)) {
    return null;
  }

  const isJapanese = data.length === SIZE_G2RAW_JPN;

  // Try to detect Crystal vs GS by checking party offsets
  if (isJapanese) {
    // Japanese Crystal has party at 0x281a
    if (isValidPokeList(data, 0x281a, 6)) {
      return { japanese: true, isCrystal: true, version: GameVersion.C };
    }
    // Japanese GS has party at 0x283e
    if (isValidPokeList(data, 0x283e, 6)) {
      return { japanese: true, isCrystal: false, version: GameVersion.GS };
    }
  } else {
    // International Crystal has party at 0x2865
    if (isValidPokeList(data, 0x2865, 6)) {
      return { japanese: false, isCrystal: true, version: GameVersion.C };
    }
    // International GS has party at 0x288a
    if (isValidPokeList(data, 0x288a, 6)) {
      return { japanese: false, isCrystal: false, version: GameVersion.GS };
    }
  }

  // Default to GS
  return {
    japanese: isJapanese,
    isCrystal: false,
    version: GameVersion.GS,
  };
}

/**
 * Load a Gen 2 save file from data.
 */
export function loadSAV2(data: Uint8Array): SAV2 | null {
  const detection = detectGen2Version(data);
  if (!detection) {
    return null;
  }

  return new SAV2(
    data,
    detection.japanese,
    detection.isCrystal,
    detection.version,
  );
}
