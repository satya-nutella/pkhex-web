/**
 * Game version identifiers for Pokemon games.
 */
export enum GameVersion {
  Invalid = 0,

  // Gen 1
  RD = 1, // Red
  GN = 2, // Green (Japan only)
  BU = 3, // Blue
  YW = 4, // Yellow

  // Gen 2
  GD = 5, // Gold
  SI = 6, // Silver
  C = 7, // Crystal

  // Gen 3
  R = 8, // Ruby
  S = 9, // Sapphire
  E = 10, // Emerald
  FR = 11, // FireRed
  LG = 12, // LeafGreen
  CXD = 13, // Colosseum/XD

  // Gen 4
  D = 14, // Diamond
  P = 15, // Pearl
  Pt = 16, // Platinum
  HG = 17, // HeartGold
  SS = 18, // SoulSilver

  // Gen 5
  W = 19, // White
  B = 20, // Black
  W2 = 21, // White 2
  B2 = 22, // Black 2

  // Gen 6
  X = 23,
  Y = 24,
  AS = 25, // Alpha Sapphire
  OR = 26, // Omega Ruby

  // Gen 7
  SN = 27, // Sun
  MN = 28, // Moon
  US = 29, // Ultra Sun
  UM = 30, // Ultra Moon
  GP = 31, // Let's Go Pikachu
  GE = 32, // Let's Go Eevee
  GO = 33, // Pokemon GO

  // Gen 8
  SW = 34, // Sword
  SH = 35, // Shield
  BD = 36, // Brilliant Diamond
  SP = 37, // Shining Pearl
  PLA = 38, // Pokemon Legends Arceus

  // Gen 9
  SL = 39, // Scarlet
  VL = 40, // Violet

  // Combined versions
  RB = 100, // Red/Blue
  RBY = 101, // Red/Blue/Yellow
  GS = 102, // Gold/Silver
  GSC = 103, // Gold/Silver/Crystal
  RS = 104, // Ruby/Sapphire
  RSE = 105, // Ruby/Sapphire/Emerald
  FRLG = 106, // FireRed/LeafGreen
  DP = 107, // Diamond/Pearl
  HGSS = 108, // HeartGold/SoulSilver
  BW = 109, // Black/White
  B2W2 = 110, // Black 2/White 2
  XY = 111, // X/Y
  ORAS = 112, // Omega Ruby/Alpha Sapphire
  SM = 113, // Sun/Moon
  USUM = 114, // Ultra Sun/Ultra Moon
  SWSH = 115, // Sword/Shield
  BDSP = 116, // Brilliant Diamond/Shining Pearl
  SV = 117, // Scarlet/Violet
}

/**
 * Get generation number from game version.
 */
export function getGeneration(version: GameVersion): number {
  switch (version) {
    case GameVersion.RD:
    case GameVersion.GN:
    case GameVersion.BU:
    case GameVersion.YW:
    case GameVersion.RB:
    case GameVersion.RBY:
      return 1;

    case GameVersion.GD:
    case GameVersion.SI:
    case GameVersion.C:
    case GameVersion.GS:
    case GameVersion.GSC:
      return 2;

    case GameVersion.R:
    case GameVersion.S:
    case GameVersion.E:
    case GameVersion.FR:
    case GameVersion.LG:
    case GameVersion.CXD:
    case GameVersion.RS:
    case GameVersion.RSE:
    case GameVersion.FRLG:
      return 3;

    case GameVersion.D:
    case GameVersion.P:
    case GameVersion.Pt:
    case GameVersion.HG:
    case GameVersion.SS:
    case GameVersion.DP:
    case GameVersion.HGSS:
      return 4;

    case GameVersion.W:
    case GameVersion.B:
    case GameVersion.W2:
    case GameVersion.B2:
    case GameVersion.BW:
    case GameVersion.B2W2:
      return 5;

    case GameVersion.X:
    case GameVersion.Y:
    case GameVersion.AS:
    case GameVersion.OR:
    case GameVersion.XY:
    case GameVersion.ORAS:
      return 6;

    case GameVersion.SN:
    case GameVersion.MN:
    case GameVersion.US:
    case GameVersion.UM:
    case GameVersion.GP:
    case GameVersion.GE:
    case GameVersion.SM:
    case GameVersion.USUM:
      return 7;

    case GameVersion.SW:
    case GameVersion.SH:
    case GameVersion.BD:
    case GameVersion.SP:
    case GameVersion.PLA:
    case GameVersion.SWSH:
    case GameVersion.BDSP:
      return 8;

    case GameVersion.SL:
    case GameVersion.VL:
      return 9;

    default:
      return 0;
  }
}

/**
 * Get the display name for a game version.
 */
export function getGameVersionName(version: GameVersion): string {
  switch (version) {
    case GameVersion.RD:
      return "Red";
    case GameVersion.GN:
      return "Green";
    case GameVersion.BU:
      return "Blue";
    case GameVersion.YW:
      return "Yellow";
    case GameVersion.RB:
      return "Red/Blue";
    case GameVersion.RBY:
      return "Red/Blue/Yellow";
    case GameVersion.GD:
      return "Gold";
    case GameVersion.SI:
      return "Silver";
    case GameVersion.C:
      return "Crystal";
    case GameVersion.GS:
      return "Gold/Silver";
    case GameVersion.GSC:
      return "Gold/Silver/Crystal";
    case GameVersion.R:
      return "Ruby";
    case GameVersion.S:
      return "Sapphire";
    case GameVersion.E:
      return "Emerald";
    case GameVersion.FR:
      return "FireRed";
    case GameVersion.LG:
      return "LeafGreen";
    case GameVersion.RS:
      return "Ruby/Sapphire";
    case GameVersion.RSE:
      return "Ruby/Sapphire/Emerald";
    case GameVersion.FRLG:
      return "FireRed/LeafGreen";
    default:
      return "Unknown";
  }
}
