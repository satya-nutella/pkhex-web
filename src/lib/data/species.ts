/**
 * Pokemon species names and data.
 */

// Gen 1 species names (national dex order, index = national dex number)
export const SPECIES_EN: string[] = [
  "---", // 0 - None/Egg
  "Bulbasaur",
  "Ivysaur",
  "Venusaur",
  "Charmander",
  "Charmeleon",
  "Charizard",
  "Squirtle",
  "Wartortle",
  "Blastoise",
  "Caterpie",
  "Metapod",
  "Butterfree",
  "Weedle",
  "Kakuna",
  "Beedrill",
  "Pidgey",
  "Pidgeotto",
  "Pidgeot",
  "Rattata",
  "Raticate",
  "Spearow",
  "Fearow",
  "Ekans",
  "Arbok",
  "Pikachu",
  "Raichu",
  "Sandshrew",
  "Sandslash",
  "Nidoran♀",
  "Nidorina",
  "Nidoqueen",
  "Nidoran♂",
  "Nidorino",
  "Nidoking",
  "Clefairy",
  "Clefable",
  "Vulpix",
  "Ninetales",
  "Jigglypuff",
  "Wigglytuff",
  "Zubat",
  "Golbat",
  "Oddish",
  "Gloom",
  "Vileplume",
  "Paras",
  "Parasect",
  "Venonat",
  "Venomoth",
  "Diglett",
  "Dugtrio",
  "Meowth",
  "Persian",
  "Psyduck",
  "Golduck",
  "Mankey",
  "Primeape",
  "Growlithe",
  "Arcanine",
  "Poliwag",
  "Poliwhirl",
  "Poliwrath",
  "Abra",
  "Kadabra",
  "Alakazam",
  "Machop",
  "Machoke",
  "Machamp",
  "Bellsprout",
  "Weepinbell",
  "Victreebel",
  "Tentacool",
  "Tentacruel",
  "Geodude",
  "Graveler",
  "Golem",
  "Ponyta",
  "Rapidash",
  "Slowpoke",
  "Slowbro",
  "Magnemite",
  "Magneton",
  "Farfetch'd",
  "Doduo",
  "Dodrio",
  "Seel",
  "Dewgong",
  "Grimer",
  "Muk",
  "Shellder",
  "Cloyster",
  "Gastly",
  "Haunter",
  "Gengar",
  "Onix",
  "Drowzee",
  "Hypno",
  "Krabby",
  "Kingler",
  "Voltorb",
  "Electrode",
  "Exeggcute",
  "Exeggutor",
  "Cubone",
  "Marowak",
  "Hitmonlee",
  "Hitmonchan",
  "Lickitung",
  "Koffing",
  "Weezing",
  "Rhyhorn",
  "Rhydon",
  "Chansey",
  "Tangela",
  "Kangaskhan",
  "Horsea",
  "Seadra",
  "Goldeen",
  "Seaking",
  "Staryu",
  "Starmie",
  "Mr. Mime",
  "Scyther",
  "Jynx",
  "Electabuzz",
  "Magmar",
  "Pinsir",
  "Tauros",
  "Magikarp",
  "Gyarados",
  "Lapras",
  "Ditto",
  "Eevee",
  "Vaporeon",
  "Jolteon",
  "Flareon",
  "Porygon",
  "Omanyte",
  "Omastar",
  "Kabuto",
  "Kabutops",
  "Aerodactyl",
  "Snorlax",
  "Articuno",
  "Zapdos",
  "Moltres",
  "Dratini",
  "Dragonair",
  "Dragonite",
  "Mewtwo",
  "Mew",
  // Gen 2 (152-251)
  "Chikorita",
  "Bayleef",
  "Meganium",
  "Cyndaquil",
  "Quilava",
  "Typhlosion",
  "Totodile",
  "Croconaw",
  "Feraligatr",
  "Sentret",
  "Furret",
  "Hoothoot",
  "Noctowl",
  "Ledyba",
  "Ledian",
  "Spinarak",
  "Ariados",
  "Crobat",
  "Chinchou",
  "Lanturn",
  "Pichu",
  "Cleffa",
  "Igglybuff",
  "Togepi",
  "Togetic",
  "Natu",
  "Xatu",
  "Mareep",
  "Flaaffy",
  "Ampharos",
  "Bellossom",
  "Marill",
  "Azumarill",
  "Sudowoodo",
  "Politoed",
  "Hoppip",
  "Skiploom",
  "Jumpluff",
  "Aipom",
  "Sunkern",
  "Sunflora",
  "Yanma",
  "Wooper",
  "Quagsire",
  "Espeon",
  "Umbreon",
  "Murkrow",
  "Slowking",
  "Misdreavus",
  "Unown",
  "Wobbuffet",
  "Girafarig",
  "Pineco",
  "Forretress",
  "Dunsparce",
  "Gligar",
  "Steelix",
  "Snubbull",
  "Granbull",
  "Qwilfish",
  "Scizor",
  "Shuckle",
  "Heracross",
  "Sneasel",
  "Teddiursa",
  "Ursaring",
  "Slugma",
  "Magcargo",
  "Swinub",
  "Piloswine",
  "Corsola",
  "Remoraid",
  "Octillery",
  "Delibird",
  "Mantine",
  "Skarmory",
  "Houndour",
  "Houndoom",
  "Kingdra",
  "Phanpy",
  "Donphan",
  "Porygon2",
  "Stantler",
  "Smeargle",
  "Tyrogue",
  "Hitmontop",
  "Smoochum",
  "Elekid",
  "Magby",
  "Miltank",
  "Blissey",
  "Raikou",
  "Entei",
  "Suicune",
  "Larvitar",
  "Pupitar",
  "Tyranitar",
  "Lugia",
  "Ho-Oh",
  "Celebi",
  // Gen 3 (252-386)
  "Treecko",
  "Grovyle",
  "Sceptile",
  "Torchic",
  "Combusken",
  "Blaziken",
  "Mudkip",
  "Marshtomp",
  "Swampert",
  "Poochyena",
  "Mightyena",
  "Zigzagoon",
  "Linoone",
  "Wurmple",
  "Silcoon",
  "Beautifly",
  "Cascoon",
  "Dustox",
  "Lotad",
  "Lombre",
  "Ludicolo",
  "Seedot",
  "Nuzleaf",
  "Shiftry",
  "Taillow",
  "Swellow",
  "Wingull",
  "Pelipper",
  "Ralts",
  "Kirlia",
  "Gardevoir",
  "Surskit",
  "Masquerain",
  "Shroomish",
  "Breloom",
  "Slakoth",
  "Vigoroth",
  "Slaking",
  "Nincada",
  "Ninjask",
  "Shedinja",
  "Whismur",
  "Loudred",
  "Exploud",
  "Makuhita",
  "Hariyama",
  "Azurill",
  "Nosepass",
  "Skitty",
  "Delcatty",
  "Sableye",
  "Mawile",
  "Aron",
  "Lairon",
  "Aggron",
  "Meditite",
  "Medicham",
  "Electrike",
  "Manectric",
  "Plusle",
  "Minun",
  "Volbeat",
  "Illumise",
  "Roselia",
  "Gulpin",
  "Swalot",
  "Carvanha",
  "Sharpedo",
  "Wailmer",
  "Wailord",
  "Numel",
  "Camerupt",
  "Torkoal",
  "Spoink",
  "Grumpig",
  "Spinda",
  "Trapinch",
  "Vibrava",
  "Flygon",
  "Cacnea",
  "Cacturne",
  "Swablu",
  "Altaria",
  "Zangoose",
  "Seviper",
  "Lunatone",
  "Solrock",
  "Barboach",
  "Whiscash",
  "Corphish",
  "Crawdaunt",
  "Baltoy",
  "Claydol",
  "Lileep",
  "Cradily",
  "Anorith",
  "Armaldo",
  "Feebas",
  "Milotic",
  "Castform",
  "Kecleon",
  "Shuppet",
  "Banette",
  "Duskull",
  "Dusclops",
  "Tropius",
  "Chimecho",
  "Absol",
  "Wynaut",
  "Snorunt",
  "Glalie",
  "Spheal",
  "Sealeo",
  "Walrein",
  "Clamperl",
  "Huntail",
  "Gorebyss",
  "Relicanth",
  "Luvdisc",
  "Bagon",
  "Shelgon",
  "Salamence",
  "Beldum",
  "Metang",
  "Metagross",
  "Regirock",
  "Regice",
  "Registeel",
  "Latias",
  "Latios",
  "Kyogre",
  "Groudon",
  "Rayquaza",
  "Jirachi",
  "Deoxys",
];

// Gen 1 internal species ID to national dex conversion
// Gen 1 uses different internal IDs than national dex numbers
const INTERNAL_TO_NATIONAL_1: number[] = [
  0, // 0x00 - None
  112,
  115,
  32,
  35,
  21,
  100,
  34,
  80,
  2,
  103, // 0x01-0x0A
  108,
  102,
  88,
  94,
  29,
  31,
  104,
  111,
  131,
  59, // 0x0B-0x14
  151,
  130,
  90,
  72,
  92,
  123,
  120,
  9,
  127,
  114, // 0x15-0x1E
  0,
  0,
  58,
  95,
  22,
  16,
  79,
  64,
  75,
  113, // 0x1F-0x28
  67,
  122,
  106,
  107,
  24,
  47,
  54,
  96,
  76,
  0, // 0x29-0x32
  126,
  0,
  125,
  82,
  109,
  0,
  56,
  86,
  50,
  128, // 0x33-0x3C
  0,
  0,
  0,
  83,
  48,
  149,
  0,
  0,
  0,
  84, // 0x3D-0x46
  60,
  124,
  146,
  144,
  145,
  132,
  52,
  98,
  0,
  0, // 0x47-0x50
  0,
  37,
  38,
  25,
  26,
  0,
  0,
  0,
  0,
  147, // 0x51-0x5A
  148,
  140,
  141,
  116,
  117,
  0,
  0,
  27,
  28,
  138, // 0x5B-0x64
  139,
  39,
  40,
  133,
  136,
  135,
  134,
  66,
  41,
  23, // 0x65-0x6E
  46,
  61,
  62,
  13,
  14,
  15,
  0,
  85,
  57,
  51, // 0x6F-0x78
  49,
  87,
  0,
  0,
  10,
  11,
  12,
  68,
  0,
  55, // 0x79-0x82
  97,
  42,
  150,
  143,
  129,
  0,
  0,
  89,
  0,
  99, // 0x83-0x8C
  91,
  0,
  101,
  36,
  110,
  53,
  105,
  0,
  93,
  63, // 0x8D-0x96
  65,
  17,
  18,
  121,
  1,
  3,
  73,
  0,
  118,
  119, // 0x97-0xA0
  0,
  0,
  0,
  0,
  77,
  78,
  19,
  20,
  33,
  30, // 0xA1-0xAA
  74,
  137,
  142,
  0,
  81,
  0,
  0,
  4,
  7,
  5, // 0xAB-0xB4
  8,
  6,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  43, // 0xB5-0xBE
  44,
  45,
  69,
  70,
  71, // 0xBF-0xC3
];

// National dex to Gen 1 internal ID conversion
const NATIONAL_TO_INTERNAL_1: number[] = new Array(152).fill(0);
for (let i = 0; i < INTERNAL_TO_NATIONAL_1.length; i++) {
  const national = INTERNAL_TO_NATIONAL_1[i];
  if (national > 0 && national <= 151) {
    NATIONAL_TO_INTERNAL_1[national] = i;
  }
}

/**
 * Convert Gen 1 internal species ID to national dex number.
 */
export function getSpeciesNational1(internal: number): number {
  if (internal >= INTERNAL_TO_NATIONAL_1.length) {
    return 0;
  }
  return INTERNAL_TO_NATIONAL_1[internal];
}

/**
 * Convert national dex number to Gen 1 internal species ID.
 */
export function getSpeciesInternal1(national: number): number {
  if (national >= NATIONAL_TO_INTERNAL_1.length) {
    return 0;
  }
  return NATIONAL_TO_INTERNAL_1[national];
}

/**
 * Get species name by national dex number.
 */
export function getSpeciesName(
  species: number,
  language: string = "en",
): string {
  if (species < 0 || species >= SPECIES_EN.length) {
    return "---";
  }
  return SPECIES_EN[species];
}

/**
 * Max species ID for each generation.
 */
export const MAX_SPECIES_ID_1 = 151;
export const MAX_SPECIES_ID_2 = 251;
export const MAX_SPECIES_ID_3 = 386;

// ========== Gen 3 Species Conversion ==========
// Gen 3 uses internal species IDs that differ from National Dex for Hoenn Pokemon (252+)
// The mapping is NOT a simple offset - each species has a different delta!
// These tables are directly from PKHeX SpeciesConverter.cs

const FIRST_UNALIGNED_NATIONAL_3 = 252; // First Hoenn Pokemon (Treecko)
const FIRST_UNALIGNED_INTERNAL_3 = 277; // First internal Gen 3 offset

/**
 * Delta values to add to National Dex ID (starting at 252) to get Gen 3 Internal ID.
 * Table3NationalToInternal from PKHeX
 */
const TABLE3_NATIONAL_TO_INTERNAL: number[] = [
  25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25,
  25, 25, 25, 25, 25, 28, 28, 31, 31, 112, 112, 112, 28, 28, 21, 21, 77, 77, 77,
  11, 11, 11, 77, 77, 77, 39, 39, 52, 21, 15, 15, 20, 52, 78, 78, 78, 49, 49,
  28, 28, 42, 42, 73, 73, 48, 51, 51, 12, 12, -7, -7, 17, 17, -3, 26, 26, -19,
  4, 4, 4, 13, 13, 25, 25, 45, 43, 11, 11, -16, -16, -15, -15, -25, -25, 43, 43,
  43, 43, -21, -21, 34, -35, 24, 24, 6, 6, 12, 53, 17, 0, -15, -15, -22, -22,
  -22, 7, 7, 7, 12, -45, 24, 24, 24, 24, 24, 24, 24, 24, 24, 27, 27, 22, 22, 22,
  24, 24,
];

/**
 * Delta values to add to Gen 3 Internal ID (starting at 277) to get National Dex ID.
 * Table3InternalToNational from PKHeX
 */
const TABLE3_INTERNAL_TO_NATIONAL: number[] = [
  -25, -25, -25, -25, -25, -25, -25, -25, -25, -25, -25, -25, -25, -25, -25,
  -25, -25, -25, -25, -25, -25, -25, -25, -25, -11, -11, -11, -28, -28, -21,
  -21, 19, -31, -31, -28, -28, 7, 7, -15, -15, 35, 25, 25, -21, 3, -20, 16, 16,
  45, 15, 15, 21, 21, -12, -12, -4, -4, -4, -39, -39, -28, -28, -17, -17, 22,
  22, 22, -13, -13, 15, 15, -11, -11, -52, -26, -26, -42, -42, -52, -49, -49,
  -25, -25, 0, -6, -6, -48, -77, -77, -77, -51, -51, -12, -77, -77, -77, -7, -7,
  -7, -17, -24, -24, -43, -45, -12, -78, -78, -78, -34, -73, -73, -43, -43, -43,
  -43, -112, -112, -112, -24, -24, -24, -24, -24, -24, -24, -24, -24, -22, -22,
  -22, -27, -27, -24, -24, -53,
];

/**
 * Convert Gen 3 internal species ID to National Dex number.
 * Gen 3 uses complex internal IDs with non-linear mapping.
 */
export function getSpeciesNational3(internal: number): number {
  // Gen 1-2 species (0-251) use direct mapping
  if (internal < FIRST_UNALIGNED_NATIONAL_3) {
    return internal;
  }

  // Calculate index into delta table
  const shift = internal - FIRST_UNALIGNED_INTERNAL_3;

  // Out of range
  if (shift < 0 || shift >= TABLE3_INTERNAL_TO_NATIONAL.length) {
    return 0;
  }

  // Apply delta to get National Dex number
  return internal + TABLE3_INTERNAL_TO_NATIONAL[shift];
}

/**
 * Convert National Dex number to Gen 3 internal species ID.
 */
export function getSpeciesInternal3(national: number): number {
  // Gen 1-2 species (0-251) use direct mapping
  if (national < FIRST_UNALIGNED_NATIONAL_3) {
    return national;
  }

  // Calculate index into delta table
  const shift = national - FIRST_UNALIGNED_NATIONAL_3;

  // Out of range
  if (shift < 0 || shift >= TABLE3_NATIONAL_TO_INTERNAL.length) {
    return national;
  }

  // Apply delta to get Internal ID
  return national + TABLE3_NATIONAL_TO_INTERNAL[shift];
}
