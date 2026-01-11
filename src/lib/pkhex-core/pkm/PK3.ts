/**
 * Generation 3 Pokemon data structure.
 *
 * PK3 Format:
 * - SIZE_STORED: 80 bytes (box storage)
 * - SIZE_PARTY: 100 bytes (party format includes calculated stats)
 *
 * Data uses little-endian byte order.
 * 4-block shuffling encryption with XOR using PID^OID as key.
 */

import {
  readUInt8,
  readUInt16LE,
  readUInt32LE,
  writeUInt8,
  writeUInt16LE,
  writeUInt32LE,
} from "../../utils/binary";
import {
  getSpeciesName,
  MAX_SPECIES_ID_3,
  getSpeciesNational3,
  getSpeciesInternal3,
} from "../../data/species";
import { getMoveName, getBasePP } from "../../data/moves";
import { getLevelFromExp, getExpForLevel } from "../../data/experience";
import { GameVersion } from "../game/GameVersion";

export const SIZE_3STORED = 80; // 0x50
export const SIZE_3PARTY = 100; // 0x64
const SIZE_3_HEADER = 32; // 0x20
const SIZE_3_BLOCK = 12; // 0x0C
const BLOCK_COUNT = 4;

// 24 block shuffle permutations
const BLOCK_POSITION = [
  0, 1, 2, 3, 0, 1, 3, 2, 0, 2, 1, 3, 0, 3, 1, 2, 0, 2, 3, 1, 0, 3, 2, 1, 1, 0,
  2, 3, 1, 0, 3, 2, 2, 0, 1, 3, 3, 0, 1, 2, 2, 0, 3, 1, 3, 0, 2, 1, 1, 2, 0, 3,
  1, 3, 0, 2, 2, 1, 0, 3, 3, 1, 0, 2, 2, 3, 0, 1, 3, 2, 0, 1, 1, 2, 3, 0, 1, 3,
  2, 0, 2, 1, 3, 0, 3, 1, 2, 0, 2, 3, 1, 0, 3, 2, 1, 0,
];

// Inverse permutations for encryption
const BLOCK_POSITION_INVERT = [
  0, 1, 2, 4, 3, 5, 6, 7, 12, 18, 13, 19, 8, 10, 14, 20, 16, 22, 9, 11, 15, 21,
  17, 23,
];

// Gen 3 string encoding (simple ASCII subset for international)
function getString3(data: Uint8Array, offset: number, length: number): string {
  let result = "";
  for (let i = 0; i < length; i++) {
    const byte = data[offset + i];
    if (byte === 0xff || byte === 0x00) break;
    // Simple mapping for common characters
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
        data[offset + i] = 0xad; // '.'
      }
    } else {
      data[offset + i] = 0xff; // Terminator
    }
  }
}

/**
 * XOR encrypt/decrypt blocks with seed (PID ^ OID)
 */
function cryptArray3(data: Uint8Array, seed: number): void {
  for (let i = SIZE_3_HEADER; i < SIZE_3STORED; i += 4) {
    const value = readUInt32LE(data, i);
    // JavaScript handles 32-bit XOR correctly with >>> 0 to ensure unsigned
    const encrypted = (value ^ seed) >>> 0;
    writeUInt32LE(data, i, encrypted);
  }
}

/**
 * Shuffle 4 blocks based on permutation index.
 * This is the same function for both encrypt and decrypt - only the sv value differs.
 */
function shuffleArray3(data: Uint8Array, sv: number): Uint8Array {
  const result = new Uint8Array(data.length);

  // Copy header (0x00-0x1F)
  result.set(data.slice(0, SIZE_3_HEADER));

  // Copy party stats if present (0x50+)
  if (data.length > SIZE_3STORED) {
    result.set(data.slice(SIZE_3STORED), SIZE_3STORED);
  }

  const index = sv * BLOCK_COUNT;

  // Shuffle blocks (0x20-0x4F)
  // For each destination block position, copy from the source block indicated by BLOCK_POSITION
  for (let block = 0; block < BLOCK_COUNT; block++) {
    const srcBlock = BLOCK_POSITION[index + block];
    const srcOffset = SIZE_3_HEADER + SIZE_3_BLOCK * srcBlock;
    const dstOffset = SIZE_3_HEADER + SIZE_3_BLOCK * block;

    result.set(data.slice(srcOffset, srcOffset + SIZE_3_BLOCK), dstOffset);
  }

  return result;
}

/**
 * Decrypt Gen3 Pokemon data
 */
export function decryptPK3(ekm: Uint8Array): Uint8Array {
  const data = new Uint8Array(ekm);

  // Read PID and OID
  const pid = readUInt32LE(data, 0);
  const oid = readUInt32LE(data, 4);
  const seed = (pid ^ oid) >>> 0;

  // Decrypt blocks with XOR
  cryptArray3(data, seed);

  // Unshuffle blocks (sv = PID % 24)
  const sv = pid % 24;
  return shuffleArray3(data, sv);
}

/**
 * Encrypt Gen3 Pokemon data
 */
export function encryptPK3(pk: Uint8Array): Uint8Array {
  const data = new Uint8Array(pk);

  // Read PID and OID
  const pid = readUInt32LE(data, 0);
  const oid = readUInt32LE(data, 4);
  const seed = (pid ^ oid) >>> 0;

  // Shuffle blocks using INVERSE shuffle value
  const sv = pid % 24;
  const shuffled = shuffleArray3(data, BLOCK_POSITION_INVERT[sv]);

  // Encrypt blocks with XOR
  cryptArray3(shuffled, seed);

  return shuffled;
}

/**
 * Gen 3 Pokemon class.
 */
export class PK3 {
  /** Decrypted raw binary data */
  readonly data: Uint8Array;

  constructor(encryptedData?: Uint8Array) {
    if (encryptedData) {
      // Decrypt if needed (check if data looks encrypted)
      this.data = decryptPK3(encryptedData);
    } else {
      this.data = new Uint8Array(SIZE_3PARTY);
    }
  }

  // ========== Header Properties (0x00-0x1F) ==========

  /** Pokemon ID */
  get pid(): number {
    return readUInt32LE(this.data, 0x00);
  }
  set pid(value: number) {
    writeUInt32LE(this.data, 0x00, value);
  }

  /** Original ID (TID | SID) */
  get oid(): number {
    return readUInt32LE(this.data, 0x04);
  }

  /** Trainer ID (16-bit) */
  get tid16(): number {
    return readUInt16LE(this.data, 0x04);
  }
  set tid16(value: number) {
    writeUInt16LE(this.data, 0x04, value);
  }

  /** Secret ID (16-bit) */
  get sid16(): number {
    return readUInt16LE(this.data, 0x06);
  }
  set sid16(value: number) {
    writeUInt16LE(this.data, 0x06, value);
  }

  /** Nickname (10 characters max) */
  get nickname(): string {
    return getString3(this.data, 0x08, 10);
  }
  set nickname(value: string) {
    setString3(this.data, 0x08, value, 10);
  }

  /** Language */
  get language(): number {
    return this.data[0x12];
  }
  set language(value: number) {
    this.data[0x12] = value;
  }

  /** Original Trainer name (7 characters max) */
  get ot(): string {
    return getString3(this.data, 0x14, 7);
  }
  set ot(value: string) {
    setString3(this.data, 0x14, value, 7);
  }

  /** Checksum */
  get checksum(): number {
    return readUInt16LE(this.data, 0x1c);
  }
  set checksum(value: number) {
    writeUInt16LE(this.data, 0x1c, value);
  }

  /**
   * Calculate checksum from data blocks (0x20-0x4F).
   * The checksum is the 16-bit sum of all 16-bit words in the 48-byte data section.
   */
  calculateChecksum(): number {
    let sum = 0;
    for (let i = 0x20; i < 0x50; i += 2) {
      sum += readUInt16LE(this.data, i);
    }
    return sum & 0xffff;
  }

  /**
   * Update the stored checksum to match current data.
   */
  refreshChecksum(): void {
    this.checksum = this.calculateChecksum();
  }

  // ========== Block A Properties (0x20-0x2B) ==========

  /** Species (National Dex number) */
  get species(): number {
    // Gen 3 stores internal species ID, convert to National Dex
    const internal = readUInt16LE(this.data, 0x20);
    return getSpeciesNational3(internal);
  }
  set species(value: number) {
    // Convert National Dex to Gen 3 internal ID
    const internal = getSpeciesInternal3(
      Math.min(MAX_SPECIES_ID_3, Math.max(0, value)),
    );
    writeUInt16LE(this.data, 0x20, internal);
  }

  /** Species name */
  get speciesName(): string {
    return getSpeciesName(this.species);
  }

  /** Held item */
  get heldItem(): number {
    return readUInt16LE(this.data, 0x22);
  }
  set heldItem(value: number) {
    writeUInt16LE(this.data, 0x22, value);
  }

  /** Experience */
  get exp(): number {
    return readUInt32LE(this.data, 0x24);
  }
  set exp(value: number) {
    writeUInt32LE(this.data, 0x24, Math.min(0xffffffff, Math.max(0, value)));
  }

  /** PP Ups byte */
  get ppUpsByte(): number {
    return this.data[0x28];
  }
  set ppUpsByte(value: number) {
    this.data[0x28] = value;
  }

  /** Friendship */
  get friendship(): number {
    return this.data[0x29];
  }
  set friendship(value: number) {
    this.data[0x29] = Math.min(255, Math.max(0, value));
  }

  // ========== Block B Properties (0x2C-0x37) ==========

  get move1(): number {
    return readUInt16LE(this.data, 0x2c);
  }
  set move1(value: number) {
    writeUInt16LE(this.data, 0x2c, value);
  }

  get move2(): number {
    return readUInt16LE(this.data, 0x2e);
  }
  set move2(value: number) {
    writeUInt16LE(this.data, 0x2e, value);
  }

  get move3(): number {
    return readUInt16LE(this.data, 0x30);
  }
  set move3(value: number) {
    writeUInt16LE(this.data, 0x30, value);
  }

  get move4(): number {
    return readUInt16LE(this.data, 0x32);
  }
  set move4(value: number) {
    writeUInt16LE(this.data, 0x32, value);
  }

  get move1PP(): number {
    return this.data[0x34];
  }
  set move1PP(value: number) {
    this.data[0x34] = Math.min(63, value);
  }

  get move2PP(): number {
    return this.data[0x35];
  }
  set move2PP(value: number) {
    this.data[0x35] = Math.min(63, value);
  }

  get move3PP(): number {
    return this.data[0x36];
  }
  set move3PP(value: number) {
    this.data[0x36] = Math.min(63, value);
  }

  get move4PP(): number {
    return this.data[0x37];
  }
  set move4PP(value: number) {
    this.data[0x37] = Math.min(63, value);
  }

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

  getMoveName(index: number): string {
    return getMoveName(this.getMove(index));
  }

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

  getPPUps(index: number): number {
    return (this.ppUpsByte >> (index * 2)) & 3;
  }

  // ========== Block C Properties (0x38-0x43) - EVs ==========

  get evHP(): number {
    return this.data[0x38];
  }
  set evHP(value: number) {
    this.data[0x38] = Math.min(255, Math.max(0, value));
  }

  get evATK(): number {
    return this.data[0x39];
  }
  set evATK(value: number) {
    this.data[0x39] = Math.min(255, Math.max(0, value));
  }

  get evDEF(): number {
    return this.data[0x3a];
  }
  set evDEF(value: number) {
    this.data[0x3a] = Math.min(255, Math.max(0, value));
  }

  get evSPE(): number {
    return this.data[0x3b];
  }
  set evSPE(value: number) {
    this.data[0x3b] = Math.min(255, Math.max(0, value));
  }

  get evSPA(): number {
    return this.data[0x3c];
  }
  set evSPA(value: number) {
    this.data[0x3c] = Math.min(255, Math.max(0, value));
  }

  get evSPD(): number {
    return this.data[0x3d];
  }
  set evSPD(value: number) {
    this.data[0x3d] = Math.min(255, Math.max(0, value));
  }

  // Alias for compatibility
  get evSPC(): number {
    return this.evSPA;
  }
  set evSPC(value: number) {
    this.evSPA = value;
  }

  // ========== Block D Properties (0x44-0x4F) ==========

  /** Pokerus state */
  get pokerus(): number {
    return this.data[0x44];
  }
  set pokerus(value: number) {
    this.data[0x44] = value;
  }

  /** Met location */
  get metLocation(): number {
    return this.data[0x45];
  }
  set metLocation(value: number) {
    this.data[0x45] = value;
  }

  /** Origins byte (met level, version, ball, OT gender) */
  get origins(): number {
    return readUInt16LE(this.data, 0x46);
  }
  set origins(value: number) {
    writeUInt16LE(this.data, 0x46, value);
  }

  get metLevel(): number {
    return this.origins & 0x7f;
  }
  set metLevel(value: number) {
    this.origins = (this.origins & ~0x7f) | (value & 0x7f);
  }

  get version(): GameVersion {
    const v = (this.origins >> 7) & 0xf;
    // Map Gen 3 version codes
    switch (v) {
      case 1:
        return GameVersion.S;
      case 2:
        return GameVersion.R;
      case 3:
        return GameVersion.E;
      case 4:
        return GameVersion.FR;
      case 5:
        return GameVersion.LG;
      default:
        return GameVersion.RSE;
    }
  }

  get ball(): number {
    return (this.origins >> 11) & 0xf;
  }
  set ball(value: number) {
    this.origins = (this.origins & ~0x7800) | ((value & 0xf) << 11);
  }

  get otGender(): number {
    return (this.origins >> 15) & 1;
  }
  set otGender(value: number) {
    this.origins = (this.origins & ~(1 << 15)) | ((value & 1) << 15);
  }

  /** IV32 packed value */
  get iv32(): number {
    return readUInt32LE(this.data, 0x48);
  }
  set iv32(value: number) {
    writeUInt32LE(this.data, 0x48, value);
  }

  get ivHP(): number {
    return (this.iv32 >> 0) & 0x1f;
  }
  set ivHP(value: number) {
    this.iv32 = (this.iv32 & ~(0x1f << 0)) | ((value & 0x1f) << 0);
  }

  get ivATK(): number {
    return (this.iv32 >> 5) & 0x1f;
  }
  set ivATK(value: number) {
    this.iv32 = (this.iv32 & ~(0x1f << 5)) | ((value & 0x1f) << 5);
  }

  get ivDEF(): number {
    return (this.iv32 >> 10) & 0x1f;
  }
  set ivDEF(value: number) {
    this.iv32 = (this.iv32 & ~(0x1f << 10)) | ((value & 0x1f) << 10);
  }

  get ivSPE(): number {
    return (this.iv32 >> 15) & 0x1f;
  }
  set ivSPE(value: number) {
    this.iv32 = (this.iv32 & ~(0x1f << 15)) | ((value & 0x1f) << 15);
  }

  get ivSPA(): number {
    return (this.iv32 >> 20) & 0x1f;
  }
  set ivSPA(value: number) {
    this.iv32 = (this.iv32 & ~(0x1f << 20)) | ((value & 0x1f) << 20);
  }

  get ivSPD(): number {
    return (this.iv32 >> 25) & 0x1f;
  }
  set ivSPD(value: number) {
    this.iv32 = (this.iv32 & ~(0x1f << 25)) | ((value & 0x1f) << 25);
  }

  // Aliases for compatibility with Gen 1-2 interface
  get dvHP(): number {
    return this.ivHP;
  }
  get dvATK(): number {
    return this.ivATK;
  }
  get dvDEF(): number {
    return this.ivDEF;
  }
  get dvSPE(): number {
    return this.ivSPE;
  }
  get dvSPC(): number {
    return this.ivSPA;
  }

  get isEgg(): boolean {
    return ((this.iv32 >> 30) & 1) === 1;
  }

  get abilityBit(): boolean {
    return ((this.iv32 >> 31) & 1) === 1;
  }

  /** Ribbons */
  get ribbons(): number {
    return readUInt32LE(this.data, 0x4c);
  }
  set ribbons(value: number) {
    writeUInt32LE(this.data, 0x4c, value);
  }

  // ========== Party Data (0x50-0x63) ==========

  get statusCondition(): number {
    return readUInt32LE(this.data, 0x50);
  }
  set statusCondition(value: number) {
    writeUInt32LE(this.data, 0x50, value);
  }

  /**
   * Level - calculated from EXP for stored format (80 bytes),
   * read directly for party format (100 bytes).
   */
  get level(): number {
    // For stored format (80 bytes), offset 0x54 doesn't exist
    // Must calculate from experience
    if (this.data.length <= SIZE_3STORED) {
      return getLevelFromExp(this.exp, this.species);
    }
    // For party format, read from offset 0x54
    return this.data[0x54];
  }
  set level(value: number) {
    if (this.data.length > SIZE_3STORED) {
      this.data[0x54] = Math.min(100, Math.max(1, value));
    }
  }

  /**
   * Current level - always calculated from experience for accuracy.
   */
  get currentLevel(): number {
    return getLevelFromExp(this.exp, this.species);
  }

  get currentHP(): number {
    return readUInt16LE(this.data, 0x56);
  }
  set currentHP(value: number) {
    writeUInt16LE(this.data, 0x56, value);
  }

  get statHPMax(): number {
    return readUInt16LE(this.data, 0x58);
  }
  set statHPMax(value: number) {
    writeUInt16LE(this.data, 0x58, value);
  }

  get statATK(): number {
    return readUInt16LE(this.data, 0x5a);
  }
  set statATK(value: number) {
    writeUInt16LE(this.data, 0x5a, value);
  }

  get statDEF(): number {
    return readUInt16LE(this.data, 0x5c);
  }
  set statDEF(value: number) {
    writeUInt16LE(this.data, 0x5c, value);
  }

  get statSPE(): number {
    return readUInt16LE(this.data, 0x5e);
  }
  set statSPE(value: number) {
    writeUInt16LE(this.data, 0x5e, value);
  }

  get statSPA(): number {
    return readUInt16LE(this.data, 0x60);
  }
  set statSPA(value: number) {
    writeUInt16LE(this.data, 0x60, value);
  }

  get statSPD(): number {
    return readUInt16LE(this.data, 0x62);
  }
  set statSPD(value: number) {
    writeUInt16LE(this.data, 0x62, value);
  }

  // Alias for Gen 1-2 compatibility
  get statSPC(): number {
    return this.statSPA;
  }
  set statSPC(value: number) {
    this.statSPA = value;
  }

  // ========== PID-Based Properties ==========

  /** Nature (0-24) - derived from PID */
  get nature(): number {
    return this.pid % 25;
  }

  /**
   * Set nature by modifying the PID.
   * Adjusts the low bits of PID to achieve desired nature.
   * Note: This may affect other PID-derived traits slightly.
   */
  set nature(value: number) {
    const desiredNature = Math.min(24, Math.max(0, value));
    const currentNature = this.pid % 25;
    if (currentNature === desiredNature) return;

    // Calculate new PID with desired nature
    // new_pid = old_pid - (old_pid % 25) + desired_nature
    let newPid = this.pid - currentNature + desiredNature;

    // Handle potential underflow
    if (newPid < 0) {
      newPid += 25;
    }

    // Ensure 32-bit unsigned
    this.pid = newPid >>> 0;
  }

  /** Whether Pokemon is shiny */
  get isShiny(): boolean {
    const xor = (this.pid ^ this.oid) >>> 0;
    const high = xor >>> 16;
    const low = xor & 0xffff;
    return (high ^ low) < 8;
  }

  /**
   * Set shiny status by modifying the PID.
   * Warning: This changes the PID significantly and affects nature!
   */
  set isShiny(value: boolean) {
    if (value === this.isShiny) return;

    if (value) {
      // Make shiny: find a PID where (PID ^ TID ^ SID) < 8
      // XOR the high 16 bits of PID with TID^SID to get close
      const tidXorSid = this.tid16 ^ this.sid16;
      const lowPid = this.pid & 0xffff;
      // For shiny: (high ^ low ^ tid ^ sid) < 8
      // Set high = low ^ tid ^ sid to make XOR result = 0
      const newHigh = lowPid ^ tidXorSid;
      this.pid = ((newHigh << 16) | lowPid) >>> 0;
    } else {
      // Make not shiny: add 8 to the high 16 bits
      const xor = (this.pid ^ this.oid) >>> 0;
      const high = xor >>> 16;
      const low = xor & 0xffff;
      if ((high ^ low) < 8) {
        // Currently shiny, modify to not be
        const pidHigh = (this.pid >>> 16) + 8;
        this.pid = ((pidHigh << 16) | (this.pid & 0xffff)) >>> 0;
      }
    }
  }

  // ========== Derived Properties ==========

  get isEmpty(): boolean {
    return this.species === 0;
  }

  get isValid(): boolean {
    return this.species > 0 && this.species <= MAX_SPECIES_ID_3;
  }

  get isNicknamed(): boolean {
    return this.nickname.toUpperCase() !== this.speciesName.toUpperCase();
  }

  // ========== Methods ==========

  calculateStats(): void {
    // Simplified - just ensure HP doesn't exceed max
    if (this.currentHP > this.statHPMax && this.statHPMax > 0) {
      this.currentHP = this.statHPMax;
    }
  }

  heal(): void {
    this.currentHP = this.statHPMax;
    this.statusCondition = 0;

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

  /** Get encrypted data for storage - refreshes checksum first */
  getEncryptedData(): Uint8Array {
    this.refreshChecksum();
    return encryptPK3(this.data);
  }

  /** Get decrypted stored data */
  getStoredData(): Uint8Array {
    return this.data.slice(0, SIZE_3STORED);
  }

  /** Get decrypted party data */
  getPartyData(): Uint8Array {
    return this.data.slice(0, SIZE_3PARTY);
  }

  /** Clone this Pokemon */
  clone(): PK3 {
    const pk = new PK3();
    pk.data.set(this.data);
    return pk;
  }

  /**
   * Create a new Pokemon with specified parameters
   */
  static create(options: {
    species: number;
    level: number;
    otName: string;
    tid: number;
    sid: number;
    nickname?: string;
    moves?: number[];
  }): PK3 {
    const pk = new PK3();

    // Generate random PID
    const pid = Math.floor(Math.random() * 0xffffffff);
    pk.pid = pid;

    // Set trainer info
    pk.tid16 = options.tid & 0xffff;
    pk.sid16 = options.sid & 0xffff;
    pk.ot = options.otName;

    // Set species
    pk.species = options.species;

    // Set nickname (or species name if not provided)
    if (options.nickname) {
      pk.nickname = options.nickname;
    } else {
      pk.nickname = getSpeciesName(options.species).toUpperCase();
    }

    // Set experience based on level and species growth rate
    pk.exp = getExpForLevel(options.level, options.species);

    // Set language (English = 2)
    pk.language = 2;

    // Set friendship
    pk.friendship = 70;

    // Set moves - default to Pound (ID 1) if none provided
    const moves =
      options.moves && options.moves.length > 0 ? options.moves : [1]; // Pound
    for (let i = 0; i < 4; i++) {
      const moveId = moves[i] || 0;
      pk.setMove(i, moveId);
      if (moveId > 0) {
        pk.setPP(i, getBasePP(moveId));
      }
    }

    // Set random IVs (0-31 each)
    const ivHP = Math.floor(Math.random() * 32);
    const ivATK = Math.floor(Math.random() * 32);
    const ivDEF = Math.floor(Math.random() * 32);
    const ivSPE = Math.floor(Math.random() * 32);
    const ivSPA = Math.floor(Math.random() * 32);
    const ivSPD = Math.floor(Math.random() * 32);
    pk.iv32 =
      ivHP |
      (ivATK << 5) |
      (ivDEF << 10) |
      (ivSPE << 15) |
      (ivSPA << 20) |
      (ivSPD << 25);

    // Set FlagHasSpecies at byte 0x13 (bit 1)
    pk.data[0x13] = 0x02;

    // Set origins (met level, game version, ball)
    // Format: bits 0-6 = met level, bits 7-10 = version, bits 11-14 = ball, bit 15 = OT gender
    // Version 3 = Emerald, Ball 4 = Poke Ball
    pk.origins = (options.level & 0x7f) | (3 << 7) | (4 << 11); // Emerald version, Poke Ball

    // Calculate basic stats
    // These would be recalculated by game, but set some reasonable values
    const baseHP = 50 + options.level; // Simplified
    pk.statHPMax = baseHP;
    pk.currentHP = baseHP;
    pk.statATK = 50 + Math.floor(options.level / 2);
    pk.statDEF = 50 + Math.floor(options.level / 2);
    pk.statSPE = 50 + Math.floor(options.level / 2);
    pk.statSPA = 50 + Math.floor(options.level / 2);
    pk.statSPD = 50 + Math.floor(options.level / 2);

    // Calculate checksum
    pk.refreshChecksum();

    return pk;
  }
}
