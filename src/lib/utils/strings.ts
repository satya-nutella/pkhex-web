/**
 * String converter for Generation 1 Pokemon games.
 * Gen 1 uses a custom character encoding, not ASCII or Unicode.
 */

export const TERMINATOR_CODE = 0x50;
export const TERMINATOR_ZERO = 0x00;
export const TRADE_OT_CODE = 0x5d;
export const SPACE_CODE = 0x7f;

// English character table (index = byte value, value = character)
// NUL represents invalid/terminator characters
const TABLE_EN: string[] = [
  // 0x00-0x0F
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  // 0x10-0x1F
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  // 0x20-0x2F
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  // 0x30-0x3F
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  // 0x40-0x4F
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  // 0x50-0x5F (0x50 is terminator, 0x5D is trade OT code)
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "*",
  "\0",
  "\0",
  // 0x60-0x6F
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  // 0x70-0x7F
  "@",
  "#",
  '"',
  '"',
  "\0",
  "…",
  "\0",
  "\0",
  "\0",
  "┌",
  "─",
  "┐",
  "│",
  "└",
  "┘",
  " ",
  // 0x80-0x8F (uppercase letters)
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  // 0x90-0x9F
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
  "(",
  ")",
  ":",
  ";",
  "[",
  "]",
  // 0xA0-0xAF (lowercase letters)
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  // 0xB0-0xBF
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
  "à",
  "è",
  "é",
  "ù",
  "À",
  "Á",
  // 0xC0-0xCF
  "Ä",
  "Ö",
  "Ü",
  "ä",
  "ö",
  "ü",
  "È",
  "É",
  "Ì",
  "Í",
  "Ñ",
  "Ò",
  "Ó",
  "Ù",
  "Ú",
  "á",
  // 0xD0-0xDF
  "\u00EC",
  "\u00ED",
  "\u00F1",
  "\u00F2",
  "\u00F3",
  "\u00FA",
  "\u00BA",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\u2190",
  "'",
  // 0xE0-0xEF
  "\u2019",
  "{",
  "}",
  "-",
  "\0",
  "\0",
  "?",
  "!",
  "\u2024",
  "&",
  "%",
  "\u2192",
  "\u25B7",
  "\u25B6",
  "\u25BC",
  "\u2642",
  // 0xF0-0xFF
  "\u00A5",
  "\u00D7",
  ".",
  "/",
  ",",
  "\u2640",
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
];

// Reverse lookup table for encoding
const CHAR_TO_BYTE_EN: Map<string, number> = new Map();
for (let i = 0; i < TABLE_EN.length; i++) {
  const char = TABLE_EN[i];
  if (char !== "\0" && !CHAR_TO_BYTE_EN.has(char)) {
    CHAR_TO_BYTE_EN.set(char, i);
  }
}
// Add special mappings
CHAR_TO_BYTE_EN.set("'", 0xdf); // apostrophe
CHAR_TO_BYTE_EN.set("'", 0xe0); // right single quote

// Japanese character table
const TABLE_JP: string[] = [
  // 0x00-0x0F
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "ガ",
  "ギ",
  "グ",
  "ゲ",
  "ゴ",
  "ザ",
  "ジ",
  "ズ",
  "ゼ",
  "ゾ",
  "ダ",
  // 0x10-0x1F
  "ヂ",
  "ヅ",
  "デ",
  "ド",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "バ",
  "ビ",
  "ブ",
  "ボ",
  "\0",
  "\0",
  "\0",
  // 0x20-0x2F
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "が",
  "ぎ",
  "ぐ",
  "げ",
  "ご",
  "ざ",
  "じ",
  "ず",
  "ぜ",
  "ぞ",
  // 0x30-0x3F
  "だ",
  "ぢ",
  "づ",
  "で",
  "ど",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "ば",
  "び",
  "ぶ",
  "ベ",
  "ぼ",
  "\0",
  // 0x40-0x4F
  "パ",
  "ピ",
  "プ",
  "ポ",
  "ぱ",
  "ぴ",
  "ぷ",
  "ペ",
  "ぽ",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  // 0x50-0x5F
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "*",
  "\0",
  "\0",
  // 0x60-0x6F
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "ぃ",
  "ぅ",
  // 0x70-0x7F
  "「",
  "」",
  "『",
  "』",
  "・",
  "⋯",
  "ぁ",
  "ぇ",
  "ぉ",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "\0",
  "　",
  // 0x80-0x8F
  "ア",
  "イ",
  "ウ",
  "エ",
  "オ",
  "カ",
  "キ",
  "ク",
  "ケ",
  "コ",
  "サ",
  "シ",
  "ス",
  "セ",
  "ソ",
  "タ",
  // 0x90-0x9F
  "チ",
  "ツ",
  "テ",
  "ト",
  "ナ",
  "ニ",
  "ヌ",
  "ネ",
  "ノ",
  "ハ",
  "ヒ",
  "フ",
  "ホ",
  "マ",
  "ミ",
  "ム",
  // 0xA0-0xAF
  "メ",
  "モ",
  "ヤ",
  "ユ",
  "ヨ",
  "ラ",
  "ル",
  "レ",
  "ロ",
  "ワ",
  "ヲ",
  "ン",
  "ッ",
  "ャ",
  "ュ",
  "ョ",
  // 0xB0-0xBF
  "ィ",
  "あ",
  "い",
  "う",
  "え",
  "お",
  "か",
  "き",
  "く",
  "け",
  "こ",
  "さ",
  "し",
  "す",
  "せ",
  "そ",
  // 0xC0-0xCF
  "た",
  "ち",
  "つ",
  "て",
  "と",
  "な",
  "に",
  "ぬ",
  "ね",
  "の",
  "は",
  "ひ",
  "ふ",
  "ヘ",
  "ほ",
  "ま",
  // 0xD0-0xDF
  "み",
  "む",
  "め",
  "も",
  "や",
  "ゆ",
  "よ",
  "ら",
  "リ",
  "る",
  "れ",
  "ろ",
  "わ",
  "を",
  "ん",
  "っ",
  // 0xE0-0xEF
  "ゃ",
  "ゅ",
  "ょ",
  "ー",
  "ﾟ",
  "ﾞ",
  "？",
  "！",
  "。",
  "ァ",
  "ゥ",
  "ェ",
  "\0",
  "\0",
  "\0",
  "♂",
  // 0xF0-0xFF
  "¥",
  "×",
  "．",
  "／",
  "ォ",
  "♀",
  "０",
  "１",
  "２",
  "３",
  "４",
  "５",
  "６",
  "７",
  "８",
  "９",
];

// Reverse lookup table for Japanese encoding
const CHAR_TO_BYTE_JP: Map<string, number> = new Map();
for (let i = 0; i < TABLE_JP.length; i++) {
  const char = TABLE_JP[i];
  if (char !== "\0" && !CHAR_TO_BYTE_JP.has(char)) {
    CHAR_TO_BYTE_JP.set(char, i);
  }
}

/**
 * Decode Gen 1 encoded bytes to a string.
 */
export function getString1(
  data: Uint8Array,
  offset: number,
  length: number,
  japanese: boolean,
): string {
  const table = japanese ? TABLE_JP : TABLE_EN;
  let result = "";

  for (let i = 0; i < length; i++) {
    const byte = data[offset + i];

    // Check for terminator
    if (byte === TERMINATOR_CODE || byte === TERMINATOR_ZERO) {
      break;
    }

    // Check for trade OT code
    if (byte === TRADE_OT_CODE) {
      return "*";
    }

    const char = table[byte];
    if (char === "\0") {
      break; // Invalid character, stop
    }

    result += char;
  }

  return result;
}

/**
 * Encode a string to Gen 1 format.
 */
export function setString1(
  data: Uint8Array,
  offset: number,
  value: string,
  maxLength: number,
  japanese: boolean,
  padChar: number = TERMINATOR_CODE,
): number {
  const charMap = japanese ? CHAR_TO_BYTE_JP : CHAR_TO_BYTE_EN;

  // Fill with pad character first
  for (let i = 0; i < maxLength + 1; i++) {
    data[offset + i] = padChar;
  }

  if (value.length === 0) {
    return 0;
  }

  // Handle trade OT code
  if (value === "*") {
    data[offset] = TRADE_OT_CODE;
    data[offset + 1] = TERMINATOR_CODE;
    return 2;
  }

  const writeLength = Math.min(value.length, maxLength);
  let i = 0;

  for (; i < writeLength; i++) {
    const char = value[i];
    const byte = charMap.get(char);

    if (byte === undefined) {
      // Character not found, try lowercase/uppercase conversion
      const altChar =
        char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase();
      const altByte = charMap.get(altChar);
      if (altByte !== undefined) {
        data[offset + i] = altByte;
      } else {
        // Skip invalid characters
        break;
      }
    } else {
      data[offset + i] = byte;
    }
  }

  // Add terminator
  if (i < maxLength + 1) {
    data[offset + i] = TERMINATOR_CODE;
  }

  return i + 1;
}

/**
 * Get max string length based on language.
 */
export function getStringLength1(japanese: boolean): number {
  return japanese ? 6 : 11;
}

export function getMaxTrainerNameLength1(japanese: boolean): number {
  return japanese ? 5 : 7;
}

export function getMaxNicknameLength1(japanese: boolean): number {
  return japanese ? 5 : 10;
}
