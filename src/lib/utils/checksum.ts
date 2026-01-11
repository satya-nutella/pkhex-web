/**
 * Checksum calculation utilities for Pokemon save files.
 */

/**
 * Calculate Gen 1/2 RBY-style checksum.
 * Sum all bytes and return the inverted result (one's complement).
 */
export function checksumRBY(
  data: Uint8Array,
  start: number,
  end: number,
): number {
  let sum = 0;
  for (let i = start; i < end; i++) {
    sum = (sum + data[i]) & 0xff;
  }
  return ~sum & 0xff;
}

/**
 * Calculate 16-bit sum checksum (used in Gen 3+).
 * Sum all 16-bit words.
 */
export function checksum16(
  data: Uint8Array,
  start: number,
  length: number,
): number {
  let sum = 0;
  for (let i = 0; i < length; i += 2) {
    sum = (sum + (data[start + i] | (data[start + i + 1] << 8))) & 0xffff;
  }
  return sum;
}

/**
 * CRC16 CCITT checksum (used in some Gen 1 operations).
 */
export function crc16CCITT(
  data: Uint8Array,
  start: number = 0,
  length?: number,
): number {
  const len = length ?? data.length - start;
  let crc = 0xffff;

  for (let i = 0; i < len; i++) {
    crc ^= data[start + i] << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xffff;
      } else {
        crc = (crc << 1) & 0xffff;
      }
    }
  }

  return crc;
}

/**
 * Verify Gen 1 save file checksum.
 */
export function verifyChecksum1(
  data: Uint8Array,
  checksumOffset: number,
  start: number,
): boolean {
  const calculated = checksumRBY(data, start, checksumOffset);
  const stored = data[checksumOffset];
  return calculated === stored;
}

/**
 * Set Gen 1 save file checksum.
 */
export function setChecksum1(
  data: Uint8Array,
  checksumOffset: number,
  start: number,
): void {
  data[checksumOffset] = checksumRBY(data, start, checksumOffset);
}
