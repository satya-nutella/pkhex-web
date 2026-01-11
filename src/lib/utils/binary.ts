/**
 * Binary utility functions for reading and writing data from Uint8Array buffers.
 * Pokemon Gen 1-2 uses big-endian for most values, Gen 3+ uses little-endian.
 */

// Read functions - Big Endian (Gen 1-2)
export function readUInt8(data: Uint8Array, offset: number): number {
  return data[offset];
}

export function readUInt16BE(data: Uint8Array, offset: number): number {
  return (data[offset] << 8) | data[offset + 1];
}

export function readUInt24BE(data: Uint8Array, offset: number): number {
  return (data[offset] << 16) | (data[offset + 1] << 8) | data[offset + 2];
}

export function readUInt32BE(data: Uint8Array, offset: number): number {
  return (
    (((data[offset] << 24) >>> 0) |
      (data[offset + 1] << 16) |
      (data[offset + 2] << 8) |
      data[offset + 3]) >>>
    0
  );
}

// Read functions - Little Endian (Gen 3+)
export function readUInt16LE(data: Uint8Array, offset: number): number {
  return data[offset] | (data[offset + 1] << 8);
}

export function readUInt32LE(data: Uint8Array, offset: number): number {
  return (
    (data[offset] |
      (data[offset + 1] << 8) |
      (data[offset + 2] << 16) |
      ((data[offset + 3] << 24) >>> 0)) >>>
    0
  );
}

// Write functions - Big Endian (Gen 1-2)
export function writeUInt8(
  data: Uint8Array,
  offset: number,
  value: number,
): void {
  data[offset] = value & 0xff;
}

export function writeUInt16BE(
  data: Uint8Array,
  offset: number,
  value: number,
): void {
  data[offset] = (value >> 8) & 0xff;
  data[offset + 1] = value & 0xff;
}

export function writeUInt24BE(
  data: Uint8Array,
  offset: number,
  value: number,
): void {
  data[offset] = (value >> 16) & 0xff;
  data[offset + 1] = (value >> 8) & 0xff;
  data[offset + 2] = value & 0xff;
}

export function writeUInt32BE(
  data: Uint8Array,
  offset: number,
  value: number,
): void {
  data[offset] = (value >> 24) & 0xff;
  data[offset + 1] = (value >> 16) & 0xff;
  data[offset + 2] = (value >> 8) & 0xff;
  data[offset + 3] = value & 0xff;
}

// Write functions - Little Endian (Gen 3+)
export function writeUInt16LE(
  data: Uint8Array,
  offset: number,
  value: number,
): void {
  data[offset] = value & 0xff;
  data[offset + 1] = (value >> 8) & 0xff;
}

export function writeUInt32LE(
  data: Uint8Array,
  offset: number,
  value: number,
): void {
  data[offset] = value & 0xff;
  data[offset + 1] = (value >> 8) & 0xff;
  data[offset + 2] = (value >> 16) & 0xff;
  data[offset + 3] = (value >> 24) & 0xff;
}

// Bit manipulation
export function getFlag(
  data: Uint8Array,
  offset: number,
  bit: number,
): boolean {
  return (data[offset] & (1 << bit)) !== 0;
}

export function setFlag(
  data: Uint8Array,
  offset: number,
  bit: number,
  value: boolean,
): void {
  if (value) {
    data[offset] |= 1 << bit;
  } else {
    data[offset] &= ~(1 << bit);
  }
}

// BCD (Binary Coded Decimal) - used for money in Gen 1-2
export function readBCD(
  data: Uint8Array,
  offset: number,
  length: number,
): number {
  let result = 0;
  for (let i = 0; i < length; i++) {
    const byte = data[offset + i];
    const high = (byte >> 4) & 0x0f;
    const low = byte & 0x0f;
    result = result * 100 + high * 10 + low;
  }
  return result;
}

export function writeBCD(
  data: Uint8Array,
  offset: number,
  length: number,
  value: number,
): void {
  for (let i = length - 1; i >= 0; i--) {
    const low = value % 10;
    value = Math.floor(value / 10);
    const high = value % 10;
    value = Math.floor(value / 10);
    data[offset + i] = (high << 4) | low;
  }
}

// Array utilities
export function copyBytes(
  src: Uint8Array,
  srcOffset: number,
  dest: Uint8Array,
  destOffset: number,
  length: number,
): void {
  for (let i = 0; i < length; i++) {
    dest[destOffset + i] = src[srcOffset + i];
  }
}

export function fillBytes(
  data: Uint8Array,
  offset: number,
  length: number,
  value: number,
): void {
  for (let i = 0; i < length; i++) {
    data[offset + i] = value;
  }
}

export function compareBytes(
  a: Uint8Array,
  aOffset: number,
  b: Uint8Array,
  bOffset: number,
  length: number,
): boolean {
  for (let i = 0; i < length; i++) {
    if (a[aOffset + i] !== b[bOffset + i]) {
      return false;
    }
  }
  return true;
}
