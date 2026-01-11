/**
 * Generation 3 Save File structure.
 *
 * SAV3 Format:
 * - File size: 128KB (0x20000)
 * - Two save slots (A/B) at 0x0000 and 0xE000
 * - Each slot has 14 sectors of 4KB (0x1000) each
 * - Sectors are SHUFFLED - must read by sector ID, not position!
 * - Section-based structure with checksums
 *
 * Variants with DIFFERENT offsets:
 * - SAV3RS: Ruby/Sapphire (no security key)
 * - SAV3E: Emerald (security key at Small[0xAC])
 * - SAV3FRLG: FireRed/LeafGreen (security key at Small[0xF20], different party offsets!)
 */

import {
  readUInt8,
  readUInt16LE,
  readUInt32LE,
  writeUInt8,
  writeUInt16LE,
  writeUInt32LE,
} from "../../utils/binary";
import { PK3, SIZE_3STORED, SIZE_3PARTY } from "../pkm/PK3";
import { GameVersion } from "../game/GameVersion";

// Save file constants
export const SIZE_SAV3 = 0x20000; // 128KB
const SIZE_SECTOR = 0x1000; // 4KB per sector
const SIZE_SECTOR_USED = 0x0f80; // Actual usable data per sector
const SIZE_MAIN = 0xe000; // 56KB per save slot (14 sectors)
const SECTOR_COUNT = 14;

// Footer offsets within each sector (relative to sector start)
const OFS_SECTOR_ID = 0x0ff4;
const OFS_CHECKSUM = 0x0ff6;
const OFS_SIGNATURE = 0x0ff8;
const OFS_SAVE_COUNTER = 0x0ffc;

// Sector ID ranges
const SECTOR_ID_SMALL = 0; // Trainer info, Pokedex
const SECTOR_ID_LARGE_START = 1; // Party, items, events (sectors 1-4)
const SECTOR_ID_LARGE_END = 4;
const SECTOR_ID_STORAGE_START = 5; // PC boxes (sectors 5-13)
const SECTOR_ID_STORAGE_END = 13;

// Buffer sizes
const SIZE_SMALL = SIZE_SECTOR_USED; // 0xF80
const SIZE_LARGE = 4 * SIZE_SECTOR_USED; // 0x3E00
const SIZE_STORAGE = 9 * SIZE_SECTOR_USED; // 0x8B80

// Box storage constants
const BOX_SLOT_SIZE = SIZE_3STORED; // 80 bytes
const POKEMON_PER_BOX = 30;
const BOX_COUNT = 14;
// PC storage structure in Storage buffer:
// - Bytes 0-3: Current box (4 bytes)
// - Bytes 4+: Box Pokemon data (14 boxes * 30 slots * 80 bytes = 33600 bytes)
// - After that: Box names (14 * 9 bytes = 126 bytes) + wallpapers (14 bytes)
const PC_DATA_OFFSET = 4; // Box data starts at offset 4

// Item pocket types
export enum ItemPocketType {
  PCItems = "pc",
  Items = "items",
  KeyItems = "key",
  Balls = "balls",
  TMsHMs = "tm",
  Berries = "berries",
}

// Item pocket configuration
interface ItemPocket {
  type: ItemPocketType;
  offset: number;
  size: number; // Number of slots
  maxCount: number;
  encrypted: boolean; // PC items aren't encrypted
}

// Game-specific offsets
interface GameOffsets {
  // Large buffer offsets
  partyCountOffset: number;
  partyDataOffset: number;
  moneyOffset: number;
  coinsOffset: number;
  // Small buffer offsets
  trainerNameOffset: number;
  trainerIdOffset: number;
  trainerGenderOffset: number;
  playTimeOffset: number;
  securityKeyOffset: number; // 0 means no security key (RS)
  // Pokedex offsets in Small buffer
  pokedexSeenOffset: number;
  pokedexCaughtOffset: number;
  // Item pocket offsets in Large buffer
  itemPockets: ItemPocket[];
}

const OFFSETS_RS: GameOffsets = {
  partyCountOffset: 0x234,
  partyDataOffset: 0x238,
  moneyOffset: 0x0490,
  coinsOffset: 0x0494,
  trainerNameOffset: 0x00,
  trainerIdOffset: 0x0a,
  trainerGenderOffset: 0x08,
  playTimeOffset: 0x0e,
  securityKeyOffset: 0, // RS doesn't use security key
  pokedexSeenOffset: 0x28,
  pokedexCaughtOffset: 0x44,
  itemPockets: [
    {
      type: ItemPocketType.PCItems,
      offset: 0x0498,
      size: 50,
      maxCount: 999,
      encrypted: false,
    },
    {
      type: ItemPocketType.Items,
      offset: 0x0560,
      size: 30,
      maxCount: 99,
      encrypted: true,
    },
    {
      type: ItemPocketType.KeyItems,
      offset: 0x05b0,
      size: 30,
      maxCount: 1,
      encrypted: true,
    },
    {
      type: ItemPocketType.Balls,
      offset: 0x0600,
      size: 16,
      maxCount: 99,
      encrypted: true,
    },
    {
      type: ItemPocketType.TMsHMs,
      offset: 0x0640,
      size: 64,
      maxCount: 99,
      encrypted: true,
    },
    {
      type: ItemPocketType.Berries,
      offset: 0x0740,
      size: 46,
      maxCount: 999,
      encrypted: true,
    },
  ],
};

const OFFSETS_E: GameOffsets = {
  partyCountOffset: 0x234,
  partyDataOffset: 0x238,
  moneyOffset: 0x0490,
  coinsOffset: 0x0494,
  trainerNameOffset: 0x00,
  trainerIdOffset: 0x0a,
  trainerGenderOffset: 0x08,
  playTimeOffset: 0x0e,
  securityKeyOffset: 0xac, // Emerald security key location
  pokedexSeenOffset: 0x28,
  pokedexCaughtOffset: 0x44,
  itemPockets: [
    {
      type: ItemPocketType.PCItems,
      offset: 0x0498,
      size: 50,
      maxCount: 999,
      encrypted: false,
    },
    {
      type: ItemPocketType.Items,
      offset: 0x0560,
      size: 30,
      maxCount: 99,
      encrypted: true,
    },
    {
      type: ItemPocketType.KeyItems,
      offset: 0x05d8,
      size: 30,
      maxCount: 1,
      encrypted: true,
    },
    {
      type: ItemPocketType.Balls,
      offset: 0x0650,
      size: 16,
      maxCount: 99,
      encrypted: true,
    },
    {
      type: ItemPocketType.TMsHMs,
      offset: 0x0690,
      size: 64,
      maxCount: 99,
      encrypted: true,
    },
    {
      type: ItemPocketType.Berries,
      offset: 0x0790,
      size: 46,
      maxCount: 999,
      encrypted: true,
    },
  ],
};

const OFFSETS_FRLG: GameOffsets = {
  partyCountOffset: 0x034, // DIFFERENT from RS/E!
  partyDataOffset: 0x038, // DIFFERENT from RS/E!
  moneyOffset: 0x0290, // DIFFERENT from RS/E!
  coinsOffset: 0x0294,
  trainerNameOffset: 0x00,
  trainerIdOffset: 0x0a,
  trainerGenderOffset: 0x08,
  playTimeOffset: 0x0e,
  securityKeyOffset: 0xf20, // FRLG security key location (in Small buffer)
  pokedexSeenOffset: 0x28,
  pokedexCaughtOffset: 0x44,
  itemPockets: [
    {
      type: ItemPocketType.PCItems,
      offset: 0x0298,
      size: 50,
      maxCount: 999,
      encrypted: false,
    },
    {
      type: ItemPocketType.Items,
      offset: 0x0310,
      size: 42,
      maxCount: 999,
      encrypted: true,
    },
    {
      type: ItemPocketType.KeyItems,
      offset: 0x03b8,
      size: 30,
      maxCount: 1,
      encrypted: true,
    },
    {
      type: ItemPocketType.Balls,
      offset: 0x0430,
      size: 13,
      maxCount: 999,
      encrypted: true,
    },
    {
      type: ItemPocketType.TMsHMs,
      offset: 0x0464,
      size: 58,
      maxCount: 999,
      encrypted: true,
    },
    {
      type: ItemPocketType.Berries,
      offset: 0x054c,
      size: 43,
      maxCount: 999,
      encrypted: true,
    },
  ],
};

// Gen 3 string encoding
function getString3(data: Uint8Array, offset: number, length: number): string {
  let result = "";
  for (let i = 0; i < length; i++) {
    const byte = data[offset + i];
    if (byte === 0xff || byte === 0x00) break;
    if (byte >= 0xbb && byte <= 0xd4) {
      result += String.fromCharCode(byte - 0xbb + "A".charCodeAt(0));
    } else if (byte >= 0xd5 && byte <= 0xee) {
      result += String.fromCharCode(byte - 0xd5 + "a".charCodeAt(0));
    } else if (byte >= 0xa1 && byte <= 0xaa) {
      result += String.fromCharCode(byte - 0xa1 + "0".charCodeAt(0));
    } else if (byte === 0xab) {
      result += "!";
    } else if (byte === 0xac) {
      result += "?";
    } else if (byte === 0xad) {
      result += ".";
    } else if (byte === 0xae) {
      result += "-";
    } else if (byte === 0x00) {
      result += " ";
    } else {
      result += "?";
    }
  }
  return result;
}

function setString3(
  data: Uint8Array,
  offset: number,
  value: string,
  maxLength: number,
): void {
  for (let i = 0; i < maxLength; i++) {
    if (i < value.length) {
      const char = value[i];
      const code = char.charCodeAt(0);
      if (code >= "A".charCodeAt(0) && code <= "Z".charCodeAt(0)) {
        data[offset + i] = code - "A".charCodeAt(0) + 0xbb;
      } else if (code >= "a".charCodeAt(0) && code <= "z".charCodeAt(0)) {
        data[offset + i] = code - "a".charCodeAt(0) + 0xd5;
      } else if (code >= "0".charCodeAt(0) && code <= "9".charCodeAt(0)) {
        data[offset + i] = code - "0".charCodeAt(0) + 0xa1;
      } else if (char === " ") {
        data[offset + i] = 0x00;
      } else {
        data[offset + i] = 0xad;
      }
    } else {
      data[offset + i] = 0xff;
    }
  }
}

/**
 * Calculate sector checksum (16-bit from 32-bit sum)
 */
function calculateChecksum(
  data: Uint8Array,
  offset: number,
  length: number,
): number {
  let sum = 0;
  for (let i = 0; i < length; i += 4) {
    sum = (sum + readUInt32LE(data, offset + i)) >>> 0;
  }
  return ((sum >>> 16) + (sum & 0xffff)) & 0xffff;
}

/**
 * Check if all 14 sectors are present in a slot
 */
function areAllSectorsPresent(data: Uint8Array, slotOffset: number): boolean {
  const found = new Set<number>();
  for (let i = 0; i < SECTOR_COUNT; i++) {
    const sectorOffset = slotOffset + i * SIZE_SECTOR;
    const sectorId = readUInt16LE(data, sectorOffset + OFS_SECTOR_ID);
    if (sectorId >= 0 && sectorId < SECTOR_COUNT) {
      found.add(sectorId);
    }
  }
  return found.size === SECTOR_COUNT;
}

/**
 * Get the active save slot (0 or 1) based on save counter
 */
function getActiveSlot(data: Uint8Array): number {
  const slot0Valid = areAllSectorsPresent(data, 0);
  const slot1Valid = areAllSectorsPresent(data, SIZE_MAIN);

  if (slot0Valid && !slot1Valid) return 0;
  if (slot1Valid && !slot0Valid) return 1;
  if (!slot0Valid && !slot1Valid) return 0; // Default to slot 0

  // Both valid - compare save counters from sector 0 of each slot
  // Need to find sector with ID 0 in each slot
  let counter0 = 0;
  let counter1 = 0;

  for (let i = 0; i < SECTOR_COUNT; i++) {
    const id0 = readUInt16LE(data, i * SIZE_SECTOR + OFS_SECTOR_ID);
    if (id0 === 0) {
      counter0 = readUInt32LE(data, i * SIZE_SECTOR + OFS_SAVE_COUNTER);
      break;
    }
  }

  for (let i = 0; i < SECTOR_COUNT; i++) {
    const id1 = readUInt16LE(data, SIZE_MAIN + i * SIZE_SECTOR + OFS_SECTOR_ID);
    if (id1 === 0) {
      counter1 = readUInt32LE(
        data,
        SIZE_MAIN + i * SIZE_SECTOR + OFS_SAVE_COUNTER,
      );
      break;
    }
  }

  return counter1 > counter0 ? 1 : 0;
}

/**
 * Detect game version from save data
 */
function detectGameVersion(small: Uint8Array, large: Uint8Array): GameVersion {
  // Check FRLG first - it has security key at 0xF20 in Small buffer
  // and different party offset structure

  // Read potential security keys
  const secKeyE = readUInt32LE(small, 0xac); // Emerald location
  const secKeyFRLG = readUInt32LE(small, 0xf20); // FRLG location

  // FRLG detection: Check if party count at FRLG offset (0x034) makes sense
  const partyCountFRLG = readUInt32LE(large, 0x034);
  const partyCountRSE = readUInt32LE(large, 0x234);

  // If FRLG party count is valid (0-6) and RSE party count is not, it's FRLG
  if (partyCountFRLG >= 0 && partyCountFRLG <= 6) {
    // Check if first party Pokemon at FRLG offset looks valid
    const speciesFRLG = readUInt16LE(large, 0x038 + 0x20); // After decryption would be here

    // Additional FRLG check: security key at 0xF20 is often non-zero
    if (secKeyFRLG !== 0 || partyCountRSE > 6 || partyCountRSE < 0) {
      return GameVersion.FRLG;
    }
  }

  // Now distinguish between RS and Emerald
  // Emerald has security key at 0xAC, RS doesn't use it (usually 0)
  // But we need a more reliable check

  // Check if money makes sense with/without security key
  const rawMoney = readUInt32LE(large, 0x0490);
  const moneyWithKey = (rawMoney ^ secKeyE) >>> 0;

  // If raw money is way too high but XOR'd money is reasonable, it's Emerald
  if (rawMoney > 999999 && moneyWithKey <= 999999) {
    return GameVersion.E;
  }

  // If raw money is reasonable, could be RS or Emerald with 0 key
  // Default to Emerald as it's more common
  if (secKeyE !== 0) {
    return GameVersion.E;
  }

  // Check for RS-specific patterns
  // RS has smaller event flags section
  return GameVersion.E; // Default to Emerald for now
}

/**
 * Generation 3 Save File class
 */
export class SAV3 {
  readonly data: Uint8Array;
  readonly version: GameVersion;
  readonly offsets: GameOffsets;
  readonly activeSlot: number;

  // Buffers for organized data (read from shuffled sectors)
  readonly small: Uint8Array; // Sector 0: Trainer info, Pokedex
  readonly large: Uint8Array; // Sectors 1-4: Party, items, events
  readonly storage: Uint8Array; // Sectors 5-13: PC boxes

  constructor(data: Uint8Array, version?: GameVersion) {
    this.data = new Uint8Array(data);
    this.activeSlot = getActiveSlot(data);

    // Initialize buffers
    this.small = new Uint8Array(SIZE_SMALL);
    this.large = new Uint8Array(SIZE_LARGE);
    this.storage = new Uint8Array(SIZE_STORAGE);

    // Read sectors into proper buffers (handles shuffling!)
    this.readSectors();

    // Detect version if not provided
    this.version = version ?? detectGameVersion(this.small, this.large);

    // Set game-specific offsets
    switch (this.version) {
      case GameVersion.R:
      case GameVersion.S:
      case GameVersion.RS:
        this.offsets = OFFSETS_RS;
        break;
      case GameVersion.FR:
      case GameVersion.LG:
      case GameVersion.FRLG:
        this.offsets = OFFSETS_FRLG;
        break;
      case GameVersion.E:
      default:
        this.offsets = OFFSETS_E;
        break;
    }
  }

  /**
   * Read sectors from save data into organized buffers.
   * This handles the sector shuffling - sectors can be in ANY order!
   */
  private readSectors(): void {
    const slotOffset = this.activeSlot * SIZE_MAIN;

    for (let i = 0; i < SECTOR_COUNT; i++) {
      const sectorOffset = slotOffset + i * SIZE_SECTOR;
      const sectorId = readUInt16LE(this.data, sectorOffset + OFS_SECTOR_ID);

      // Get source data (first 0xF80 bytes of sector)
      const srcData = this.data.slice(
        sectorOffset,
        sectorOffset + SIZE_SECTOR_USED,
      );

      // Route to correct buffer based on sector ID
      if (sectorId === SECTOR_ID_SMALL) {
        // Sector 0 -> Small buffer
        this.small.set(srcData);
      } else if (
        sectorId >= SECTOR_ID_LARGE_START &&
        sectorId <= SECTOR_ID_LARGE_END
      ) {
        // Sectors 1-4 -> Large buffer
        const bufferOffset =
          (sectorId - SECTOR_ID_LARGE_START) * SIZE_SECTOR_USED;
        this.large.set(srcData, bufferOffset);
      } else if (
        sectorId >= SECTOR_ID_STORAGE_START &&
        sectorId <= SECTOR_ID_STORAGE_END
      ) {
        // Sectors 5-13 -> Storage buffer
        const bufferOffset =
          (sectorId - SECTOR_ID_STORAGE_START) * SIZE_SECTOR_USED;
        this.storage.set(srcData, bufferOffset);
      }
    }
  }

  /**
   * Write buffers back to sector data (reverse of readSectors)
   */
  private writeSectors(): void {
    const slotOffset = this.activeSlot * SIZE_MAIN;

    for (let i = 0; i < SECTOR_COUNT; i++) {
      const sectorOffset = slotOffset + i * SIZE_SECTOR;
      const sectorId = readUInt16LE(this.data, sectorOffset + OFS_SECTOR_ID);

      let srcData: Uint8Array | null = null;

      if (sectorId === SECTOR_ID_SMALL) {
        srcData = this.small;
      } else if (
        sectorId >= SECTOR_ID_LARGE_START &&
        sectorId <= SECTOR_ID_LARGE_END
      ) {
        const bufferOffset =
          (sectorId - SECTOR_ID_LARGE_START) * SIZE_SECTOR_USED;
        srcData = this.large.slice(
          bufferOffset,
          bufferOffset + SIZE_SECTOR_USED,
        );
      } else if (
        sectorId >= SECTOR_ID_STORAGE_START &&
        sectorId <= SECTOR_ID_STORAGE_END
      ) {
        const bufferOffset =
          (sectorId - SECTOR_ID_STORAGE_START) * SIZE_SECTOR_USED;
        srcData = this.storage.slice(
          bufferOffset,
          bufferOffset + SIZE_SECTOR_USED,
        );
      }

      if (srcData) {
        this.data.set(srcData, sectorOffset);
        // Update checksum
        const checksum = calculateChecksum(
          this.data,
          sectorOffset,
          SIZE_SECTOR_USED,
        );
        writeUInt16LE(this.data, sectorOffset + OFS_CHECKSUM, checksum);
      }
    }
  }

  // ========== Security Key ==========

  get securityKey(): number {
    if (this.offsets.securityKeyOffset === 0) return 0; // RS has no security key
    return readUInt32LE(this.small, this.offsets.securityKeyOffset);
  }

  // ========== Trainer Info ==========

  get trainerName(): string {
    return getString3(this.small, this.offsets.trainerNameOffset, 7);
  }

  set trainerName(value: string) {
    setString3(this.small, this.offsets.trainerNameOffset, value, 7);
  }

  get tid16(): number {
    return readUInt16LE(this.small, this.offsets.trainerIdOffset);
  }

  set tid16(value: number) {
    writeUInt16LE(this.small, this.offsets.trainerIdOffset, value);
  }

  get sid16(): number {
    return readUInt16LE(this.small, this.offsets.trainerIdOffset + 2);
  }

  set sid16(value: number) {
    writeUInt16LE(this.small, this.offsets.trainerIdOffset + 2, value);
  }

  get trainerGender(): number {
    return this.small[this.offsets.trainerGenderOffset];
  }

  get money(): number {
    const raw = readUInt32LE(this.large, this.offsets.moneyOffset);
    // Apply security key XOR for Emerald/FRLG
    return ((raw ^ this.securityKey) >>> 0) & 0xffffff; // Max 999999
  }

  set money(value: number) {
    const clamped = Math.min(999999, Math.max(0, value));
    const encrypted = (clamped ^ this.securityKey) >>> 0;
    writeUInt32LE(this.large, this.offsets.moneyOffset, encrypted);
  }

  get playTimeHours(): number {
    return readUInt16LE(this.small, this.offsets.playTimeOffset);
  }

  get playTimeMinutes(): number {
    return this.small[this.offsets.playTimeOffset + 2];
  }

  get playTimeSeconds(): number {
    return this.small[this.offsets.playTimeOffset + 3];
  }

  // ========== Pokedex ==========

  private getPokedexBit(baseOffset: number, species: number): boolean {
    if (species < 1 || species > 386) return false;
    const index = species - 1;
    const byteIndex = Math.floor(index / 8);
    const bitIndex = index % 8;
    return (this.small[baseOffset + byteIndex] & (1 << bitIndex)) !== 0;
  }

  private setPokedexBit(
    baseOffset: number,
    species: number,
    value: boolean,
  ): void {
    if (species < 1 || species > 386) return;
    const index = species - 1;
    const byteIndex = Math.floor(index / 8);
    const bitIndex = index % 8;

    if (value) {
      this.small[baseOffset + byteIndex] |= 1 << bitIndex;
    } else {
      this.small[baseOffset + byteIndex] &= ~(1 << bitIndex);
    }
  }

  getSeen(species: number): boolean {
    return this.getPokedexBit(this.offsets.pokedexSeenOffset, species);
  }

  setSeen(species: number, seen: boolean): void {
    this.setPokedexBit(this.offsets.pokedexSeenOffset, species, seen);
    if (!seen && this.getCaught(species)) {
      this.setCaught(species, false);
    }
  }

  getCaught(species: number): boolean {
    return this.getPokedexBit(this.offsets.pokedexCaughtOffset, species);
  }

  setCaught(species: number, caught: boolean): void {
    this.setPokedexBit(this.offsets.pokedexCaughtOffset, species, caught);
    if (caught && !this.getSeen(species)) {
      this.setSeen(species, true);
    }
  }

  get seenCount(): number {
    let count = 0;
    for (let i = 1; i <= 386; i++) {
      if (this.getSeen(i)) count++;
    }
    return count;
  }

  get caughtCount(): number {
    let count = 0;
    for (let i = 1; i <= 386; i++) {
      if (this.getCaught(i)) count++;
    }
    return count;
  }

  // ========== Party Pokemon ==========

  get partyCount(): number {
    const count = readUInt32LE(this.large, this.offsets.partyCountOffset);
    return Math.min(6, Math.max(0, count));
  }

  getPartyPokemon(slot: number): PK3 | null {
    if (slot < 0 || slot >= 6 || slot >= this.partyCount) return null;

    const offset = this.offsets.partyDataOffset + slot * SIZE_3PARTY;
    const pkData = this.large.slice(offset, offset + SIZE_3PARTY);

    // Check if Pokemon is present using PKHeX method:
    // For GBA Pokemon, check FlagHasSpecies bit at 0x13 in header (not encrypted)
    const flagByte = pkData[0x13];
    if ((flagByte & 0xfb) !== 2) {
      return null;
    }

    const pk = new PK3(pkData);
    if (pk.species === 0 || pk.species > 386) return null;

    return pk;
  }

  setPartyPokemon(slot: number, pk: PK3 | null): void {
    if (slot < 0 || slot >= 6) return;

    const offset = this.offsets.partyDataOffset + slot * SIZE_3PARTY;

    if (pk) {
      const encrypted = pk.getEncryptedData();
      this.large.set(encrypted.slice(0, SIZE_3PARTY), offset);
    } else {
      // Clear slot
      for (let i = 0; i < SIZE_3PARTY; i++) {
        this.large[offset + i] = 0;
      }
    }
  }

  // ========== Box Pokemon ==========

  get boxCount(): number {
    return BOX_COUNT;
  }

  get boxSlotCount(): number {
    return POKEMON_PER_BOX;
  }

  get currentBox(): number {
    return readUInt32LE(this.storage, 0) & 0x1f;
  }

  set currentBox(value: number) {
    const current = readUInt32LE(this.storage, 0);
    writeUInt32LE(this.storage, 0, (current & ~0x1f) | (value & 0x1f));
  }

  /**
   * Get offset for a box Pokemon within the storage buffer
   * Formula from PKHeX: Box + 4 + (SIZE_STORED * box * COUNT_SLOTSPERBOX)
   */
  private getBoxPokemonOffset(box: number, slot: number): number {
    if (box < 0 || box >= BOX_COUNT || slot < 0 || slot >= POKEMON_PER_BOX) {
      return -1;
    }
    // Box data starts at offset 4 in storage buffer
    // Each box is 30 slots * 80 bytes = 2400 bytes
    return (
      PC_DATA_OFFSET +
      box * POKEMON_PER_BOX * BOX_SLOT_SIZE +
      slot * BOX_SLOT_SIZE
    );
  }

  getBoxPokemon(box: number, slot: number): PK3 | null {
    const offset = this.getBoxPokemonOffset(box, slot);
    if (offset < 0 || offset + BOX_SLOT_SIZE > this.storage.length) return null;

    const pkData = this.storage.slice(offset, offset + BOX_SLOT_SIZE);

    // Check if Pokemon is present using PKHeX method:
    // For GBA Pokemon, check FlagHasSpecies bit at 0x13 in header (not encrypted)
    // (data[0x13] & 0xFB) == 2 means the FlagHasSpecies (bit 1) is set
    const flagByte = pkData[0x13];
    if ((flagByte & 0xfb) !== 2) {
      // No valid Pokemon here - either empty or bad data
      return null;
    }

    const pk = new PK3(pkData);
    if (pk.species === 0 || pk.species > 386) return null;

    return pk;
  }

  setBoxPokemon(box: number, slot: number, pk: PK3 | null): void {
    const offset = this.getBoxPokemonOffset(box, slot);
    if (offset < 0 || offset + BOX_SLOT_SIZE > this.storage.length) return;

    if (pk) {
      const encrypted = pk.getEncryptedData();
      this.storage.set(encrypted.slice(0, BOX_SLOT_SIZE), offset);
    } else {
      // Clear slot
      for (let i = 0; i < BOX_SLOT_SIZE; i++) {
        this.storage[offset + i] = 0;
      }
    }
  }

  // ========== Checksum Management ==========

  validateChecksums(): boolean {
    const slotOffset = this.activeSlot * SIZE_MAIN;

    for (let i = 0; i < SECTOR_COUNT; i++) {
      const sectorOffset = slotOffset + i * SIZE_SECTOR;
      const stored = readUInt16LE(this.data, sectorOffset + OFS_CHECKSUM);
      const calculated = calculateChecksum(
        this.data,
        sectorOffset,
        SIZE_SECTOR_USED,
      );

      if (stored !== calculated) {
        return false;
      }
    }

    return true;
  }

  // ========== Inventory ==========

  /** Get all item pockets */
  get itemPockets(): ItemPocket[] {
    return this.offsets.itemPockets;
  }

  /** Get items from a pocket */
  getItems(
    pocketType: ItemPocketType,
  ): Array<{ itemId: number; count: number }> {
    const pocket = this.offsets.itemPockets.find((p) => p.type === pocketType);
    if (!pocket) return [];

    const items: Array<{ itemId: number; count: number }> = [];
    const key = pocket.encrypted ? this.securityKey & 0xffff : 0;

    for (let i = 0; i < pocket.size; i++) {
      const offset = pocket.offset + i * 4;
      const itemId = readUInt16LE(this.large, offset);
      const rawCount = readUInt16LE(this.large, offset + 2);
      const count = rawCount ^ key;

      if (itemId !== 0) {
        items.push({ itemId, count });
      }
    }

    return items;
  }

  /** Set items in a pocket */
  setItems(
    pocketType: ItemPocketType,
    items: Array<{ itemId: number; count: number }>,
  ): void {
    const pocket = this.offsets.itemPockets.find((p) => p.type === pocketType);
    if (!pocket) return;

    const key = pocket.encrypted ? this.securityKey & 0xffff : 0;

    // Clear existing items
    for (let i = 0; i < pocket.size; i++) {
      const offset = pocket.offset + i * 4;
      writeUInt16LE(this.large, offset, 0);
      writeUInt16LE(this.large, offset + 2, 0);
    }

    // Write new items
    for (let i = 0; i < Math.min(items.length, pocket.size); i++) {
      const offset = pocket.offset + i * 4;
      const item = items[i];
      const clampedCount = Math.min(item.count, pocket.maxCount);

      writeUInt16LE(this.large, offset, item.itemId);
      writeUInt16LE(this.large, offset + 2, clampedCount ^ key);
    }
  }

  /** Add an item to a pocket (stacks if exists) */
  addItem(
    pocketType: ItemPocketType,
    itemId: number,
    count: number = 1,
  ): boolean {
    const pocket = this.offsets.itemPockets.find((p) => p.type === pocketType);
    if (!pocket) return false;

    const items = this.getItems(pocketType);

    // Check if item already exists
    const existingIndex = items.findIndex((item) => item.itemId === itemId);
    if (existingIndex >= 0) {
      // Stack with existing
      items[existingIndex].count = Math.min(
        items[existingIndex].count + count,
        pocket.maxCount,
      );
    } else {
      // Check if there's room
      if (items.length >= pocket.size) return false;
      items.push({ itemId, count: Math.min(count, pocket.maxCount) });
    }

    this.setItems(pocketType, items);
    return true;
  }

  /** Remove an item from a pocket */
  removeItem(
    pocketType: ItemPocketType,
    itemId: number,
    count: number = 1,
  ): boolean {
    const items = this.getItems(pocketType);
    const index = items.findIndex((item) => item.itemId === itemId);
    if (index < 0) return false;

    items[index].count -= count;
    if (items[index].count <= 0) {
      items.splice(index, 1);
    }

    this.setItems(pocketType, items);
    return true;
  }

  // ========== Export ==========

  export(): Uint8Array {
    // Write buffers back to sectors
    this.writeSectors();
    return new Uint8Array(this.data);
  }

  // ========== Summary ==========

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
    let versionStr = "Ruby/Sapphire";
    switch (this.version) {
      case GameVersion.R:
        versionStr = "Ruby";
        break;
      case GameVersion.S:
        versionStr = "Sapphire";
        break;
      case GameVersion.E:
        versionStr = "Emerald";
        break;
      case GameVersion.FR:
        versionStr = "FireRed";
        break;
      case GameVersion.LG:
        versionStr = "LeafGreen";
        break;
      case GameVersion.FRLG:
        versionStr = "FireRed/LeafGreen";
        break;
    }

    const hours = this.playTimeHours;
    const minutes = this.playTimeMinutes;
    const seconds = this.playTimeSeconds;
    const playTimeStr = `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

    return {
      trainerName: this.trainerName,
      trainerId: this.tid16,
      version: versionStr,
      playTime: playTimeStr,
      badges: 0, // TODO: Implement badge reading
      money: this.money,
      partyCount: this.partyCount,
      pokedexSeen: this.seenCount,
      pokedexCaught: this.caughtCount,
      checksumValid: this.validateChecksums(),
    };
  }
}

/**
 * Check if data is a Gen 3 save file
 */
export function isGen3Save(data: Uint8Array): boolean {
  if (data.length !== SIZE_SAV3) return false;

  // Check for valid signature in at least one slot
  // Signature is at 0xFF8 within each sector
  for (let slot = 0; slot < 2; slot++) {
    const slotOffset = slot * SIZE_MAIN;
    for (let sector = 0; sector < SECTOR_COUNT; sector++) {
      const sectorOffset = slotOffset + sector * SIZE_SECTOR;
      const sig = readUInt32LE(data, sectorOffset + OFS_SIGNATURE);
      if (sig === 0x08012025 || sig === 0x01012025) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Load a Gen 3 save file
 */
export function loadSAV3(data: Uint8Array): SAV3 | null {
  if (!isGen3Save(data)) return null;
  return new SAV3(data);
}
