/**
 * Pokemon Item data for Gen 2 and Gen 3.
 * Item IDs map directly to array indices.
 */

// Gen 2 Items (Gold/Silver/Crystal)
export const ITEMS_GEN2: string[] = [
  "---", // 0 - None
  "Master Ball", // 1
  "Ultra Ball", // 2
  "Brightpowder", // 3
  "Great Ball", // 4
  "Poké Ball", // 5
  "Bicycle", // 6 (Key Item)
  "Moon Stone", // 7
  "Antidote", // 8
  "Burn Heal", // 9
  "Ice Heal", // 10
  "Awakening", // 11
  "Parlyz Heal", // 12
  "Full Restore", // 13
  "Max Potion", // 14
  "Hyper Potion", // 15
  "Super Potion", // 16
  "Potion", // 17
  "Escape Rope", // 18
  "Repel", // 19
  "Max Elixer", // 20
  "Fire Stone", // 21
  "Thunder Stone", // 22
  "Water Stone", // 23
  "HP Up", // 24
  "Protein", // 25
  "Iron", // 26
  "Carbos", // 27
  "Lucky Punch", // 28
  "Calcium", // 29
  "Rare Candy", // 30
  "X Accuracy", // 31
  "Leaf Stone", // 32
  "Metal Powder", // 33
  "Nugget", // 34
  "Poké Doll", // 35
  "Full Heal", // 36
  "Revive", // 37
  "Max Revive", // 38
  "Guard Spec.", // 39
  "Super Repel", // 40
  "Max Repel", // 41
  "Dire Hit", // 42
  "Fresh Water", // 43
  "Soda Pop", // 44
  "Lemonade", // 45
  "X Attack", // 46
  "X Defend", // 47
  "X Speed", // 48
  "X Special", // 49
  "Coin Case", // 50 (Key Item)
  "Itemfinder", // 51 (Key Item)
  "PP Up", // 52
  "Ether", // 53
  "Max Ether", // 54
  "Elixer", // 55
  "Red Scale", // 56 (Key Item)
  "Secretpotion", // 57 (Key Item)
  "S.S. Ticket", // 58 (Key Item)
  "Mystery Egg", // 59 (Key Item)
  "Clear Bell", // 60 (Key Item)
  "Silver Wing", // 61 (Key Item)
  "Moomoo Milk", // 62
  "Quick Claw", // 63
  "Psncureberry", // 64
  "Gold Leaf", // 65
  "Soft Sand", // 66
  "Sharp Beak", // 67
  "Przcureberry", // 68
  "Burnt Berry", // 69
  "Ice Berry", // 70
  "Poison Barb", // 71
  "King's Rock", // 72
  "Bitter Berry", // 73
  "Mint Berry", // 74
  "Red Apricorn", // 75
  "Tinymushroom", // 76
  "Big Mushroom", // 77
  "Silverpowder", // 78
  "Blue Apricorn", // 79
  "Amulet Coin", // 80
  "Ylw Apricorn", // 81
  "Grn Apricorn", // 82
  "Cleanse Tag", // 83
  "Mystic Water", // 84
  "Twistedspoon", // 85
  "Wht Apricorn", // 86
  "Blackbelt", // 87
  "Blk Apricorn", // 88
  "Pnk Apricorn", // 89
  "Blackglasses", // 90
  "Slowpoketail", // 91
  "Pink Bow", // 92
  "Stick", // 93
  "Smoke Ball", // 94
  "Nevermeltice", // 95
  "Magnet", // 96
  "Miracleberry", // 97
  "Pearl", // 98
  "Big Pearl", // 99
  "Everstone", // 100
  "Spell Tag", // 101
  "Ragecandybar", // 102 (Key Item)
  "GS Ball", // 103 (Key Item)
  "Blue Card", // 104 (Key Item)
  "Miracle Seed", // 105
  "Thick Club", // 106
  "Focus Band", // 107
  "Energypowder", // 108
  "Energy Root", // 109
  "Heal Powder", // 110
  "Revival Herb", // 111
  "Hard Stone", // 112
  "Lucky Egg", // 113
  "Card Key", // 114 (Key Item)
  "Machine Part", // 115 (Key Item)
  "Egg Ticket", // 116 (Key Item)
  "Lost Item", // 117 (Key Item)
  "Stardust", // 118
  "Star Piece", // 119
  "Basement Key", // 120 (Key Item)
  "Pass", // 121 (Key Item)
  "Charcoal", // 122
  "Berry Juice", // 123
  "Scope Lens", // 124
  "Metal Coat", // 125
  "Dragon Fang", // 126
  "Leftovers", // 127
  "Mystery Berry", // 128 (later became Enigma Berry)
  "Dragon Scale", // 129
  "Berserk Gene", // 130
  "Sacred Ash", // 131
  "Heavy Ball", // 132
  "Flower Mail", // 133
  "Level Ball", // 134
  "Lure Ball", // 135
  "Fast Ball", // 136
  "Light Ball", // 137
  "Friend Ball", // 138
  "Moon Ball", // 139
  "Love Ball", // 140
  "Normal Box", // 141 (Key Item)
  "Gorgeous Box", // 142 (Key Item)
  "Sun Stone", // 143
  "Polkadot Bow", // 144
  "Up-Grade", // 145
  "Berry", // 146
  "Gold Berry", // 147
  "Squirtbottle", // 148 (Key Item)
  "Park Ball", // 149
  "Rainbow Wing", // 150 (Key Item)
  "Brick Piece", // 151 (Key Item)
];

// Gen 3 Items (Ruby/Sapphire/Emerald/FireRed/LeafGreen)
// Proper sparse array - indices match game item IDs
export const ITEMS_GEN3: string[] = [];

// Initialize array with "---" for all indices up to max item ID
const MAX_GEN3_ITEM_ID = 377;
for (let i = 0; i <= MAX_GEN3_ITEM_ID; i++) {
  ITEMS_GEN3[i] = "---";
}

// Populate with actual item names (from PKHeX text_ItemsG3_en.txt)
const GEN3_ITEM_DATA: [number, string][] = [
  [0, "(None)"],
  [1, "Master Ball"],
  [2, "Ultra Ball"],
  [3, "Great Ball"],
  [4, "Poké Ball"],
  [5, "Safari Ball"],
  [6, "Net Ball"],
  [7, "Dive Ball"],
  [8, "Nest Ball"],
  [9, "Repeat Ball"],
  [10, "Timer Ball"],
  [11, "Luxury Ball"],
  [12, "Premier Ball"],
  [13, "Potion"],
  [14, "Antidote"],
  [15, "Burn Heal"],
  [16, "Ice Heal"],
  [17, "Awakening"],
  [18, "Parlyz Heal"],
  [19, "Full Restore"],
  [20, "Max Potion"],
  [21, "Hyper Potion"],
  [22, "Super Potion"],
  [23, "Full Heal"],
  [24, "Revive"],
  [25, "Max Revive"],
  [26, "Fresh Water"],
  [27, "Soda Pop"],
  [28, "Lemonade"],
  [29, "Moomoo Milk"],
  [30, "EnergyPowder"],
  [31, "Energy Root"],
  [32, "Heal Powder"],
  [33, "Revival Herb"],
  [34, "Ether"],
  [35, "Max Ether"],
  [36, "Elixir"],
  [37, "Max Elixir"],
  [38, "Lava Cookie"],
  [39, "Blue Flute"],
  [40, "Yellow Flute"],
  [41, "Red Flute"],
  [42, "Black Flute"],
  [43, "White Flute"],
  [44, "Berry Juice"],
  [45, "Sacred Ash"],
  [46, "Shoal Salt"],
  [47, "Shoal Shell"],
  [48, "Red Shard"],
  [49, "Blue Shard"],
  [50, "Yellow Shard"],
  [51, "Green Shard"],
  // 52-62 are unused
  [63, "HP Up"],
  [64, "Protein"],
  [65, "Iron"],
  [66, "Carbos"],
  [67, "Calcium"],
  [68, "Rare Candy"],
  [69, "PP Up"],
  [70, "Zinc"],
  [71, "PP Max"],
  // 72 unused
  [73, "Guard Spec."],
  [74, "Dire Hit"],
  [75, "X Attack"],
  [76, "X Defend"],
  [77, "X Speed"],
  [78, "X Accuracy"],
  [79, "X Special"],
  [80, "Poké Doll"],
  [81, "Fluffy Tail"],
  // 82 unused
  [83, "Super Repel"],
  [84, "Max Repel"],
  [85, "Escape Rope"],
  [86, "Repel"],
  // 87-92 unused
  [93, "Sun Stone"],
  [94, "Moon Stone"],
  [95, "Fire Stone"],
  [96, "Thunder Stone"],
  [97, "Water Stone"],
  [98, "Leaf Stone"],
  // 99-102 unused
  [103, "TinyMushroom"],
  [104, "Big Mushroom"],
  // 105 unused
  [106, "Pearl"],
  [107, "Big Pearl"],
  [108, "Stardust"],
  [109, "Star Piece"],
  [110, "Nugget"],
  [111, "Heart Scale"],
  // 112-120 unused
  [121, "Orange Mail"],
  [122, "Harbor Mail"],
  [123, "Glitter Mail"],
  [124, "Mech Mail"],
  [125, "Wood Mail"],
  [126, "Wave Mail"],
  [127, "Bead Mail"],
  [128, "Shadow Mail"],
  [129, "Tropic Mail"],
  [130, "Dream Mail"],
  [131, "Fab Mail"],
  [132, "Retro Mail"],
  [133, "Cheri Berry"],
  [134, "Chesto Berry"],
  [135, "Pecha Berry"],
  [136, "Rawst Berry"],
  [137, "Aspear Berry"],
  [138, "Leppa Berry"],
  [139, "Oran Berry"],
  [140, "Persim Berry"],
  [141, "Lum Berry"],
  [142, "Sitrus Berry"],
  [143, "Figy Berry"],
  [144, "Wiki Berry"],
  [145, "Mago Berry"],
  [146, "Aguav Berry"],
  [147, "Iapapa Berry"],
  [148, "Razz Berry"],
  [149, "Bluk Berry"],
  [150, "Nanab Berry"],
  [151, "Wepear Berry"],
  [152, "Pinap Berry"],
  [153, "Pomeg Berry"],
  [154, "Kelpsy Berry"],
  [155, "Qualot Berry"],
  [156, "Hondew Berry"],
  [157, "Grepa Berry"],
  [158, "Tamato Berry"],
  [159, "Cornn Berry"],
  [160, "Magost Berry"],
  [161, "Rabuta Berry"],
  [162, "Nomel Berry"],
  [163, "Spelon Berry"],
  [164, "Pamtre Berry"],
  [165, "Watmel Berry"],
  [166, "Durin Berry"],
  [167, "Belue Berry"],
  [168, "Liechi Berry"],
  [169, "Ganlon Berry"],
  [170, "Salac Berry"],
  [171, "Petaya Berry"],
  [172, "Apicot Berry"],
  [173, "Lansat Berry"],
  [174, "Starf Berry"],
  [175, "Enigma Berry"],
  // 176-178 unused
  [179, "BrightPowder"],
  [180, "White Herb"],
  [181, "Macho Brace"],
  [182, "Exp. Share"],
  [183, "Quick Claw"],
  [184, "Soothe Bell"],
  [185, "Mental Herb"],
  [186, "Choice Band"],
  [187, "King's Rock"],
  [188, "SilverPowder"],
  [189, "Amulet Coin"],
  [190, "Cleanse Tag"],
  [191, "Soul Dew"],
  [192, "DeepSeaTooth"],
  [193, "DeepSeaScale"],
  [194, "Smoke Ball"],
  [195, "Everstone"],
  [196, "Focus Band"],
  [197, "Lucky Egg"],
  [198, "Scope Lens"],
  [199, "Metal Coat"],
  [200, "Leftovers"],
  [201, "Dragon Scale"],
  [202, "Light Ball"],
  [203, "Soft Sand"],
  [204, "Hard Stone"],
  [205, "Miracle Seed"],
  [206, "BlackGlasses"],
  [207, "Black Belt"],
  [208, "Magnet"],
  [209, "Mystic Water"],
  [210, "Sharp Beak"],
  [211, "Poison Barb"],
  [212, "NeverMeltIce"],
  [213, "Spell Tag"],
  [214, "TwistedSpoon"],
  [215, "Charcoal"],
  [216, "Dragon Fang"],
  [217, "Silk Scarf"],
  [218, "Up-Grade"],
  [219, "Shell Bell"],
  [220, "Sea Incense"],
  [221, "Lax Incense"],
  [222, "Lucky Punch"],
  [223, "Metal Powder"],
  [224, "Thick Club"],
  [225, "Stick"],
  // 226-253 unused
  [254, "Red Scarf"],
  [255, "Blue Scarf"],
  [256, "Pink Scarf"],
  [257, "Green Scarf"],
  [258, "Yellow Scarf"],
  // Key Items (259+)
  [259, "Mach Bike"],
  [260, "Coin Case"],
  [261, "Itemfinder"],
  [262, "Old Rod"],
  [263, "Good Rod"],
  [264, "Super Rod"],
  [265, "S.S. Ticket"],
  [266, "Contest Pass"],
  // 267 unused
  [268, "Wailmer Pail"],
  [269, "Devon Goods"],
  [270, "Soot Sack"],
  [271, "Basement Key"],
  [272, "Acro Bike"],
  [273, "Pokéblock Case"],
  [274, "Letter"],
  [275, "Eon Ticket"],
  [276, "Red Orb"],
  [277, "Blue Orb"],
  [278, "Scanner"],
  [279, "Go-Goggles"],
  [280, "Meteorite"],
  [281, "Rm. 1 Key"],
  [282, "Rm. 2 Key"],
  [283, "Rm. 4 Key"],
  [284, "Rm. 6 Key"],
  [285, "Storage Key"],
  [286, "Root Fossil"],
  [287, "Claw Fossil"],
  [288, "Devon Scope"],
  // TMs & HMs (289-346)
  [289, "TM01"],
  [290, "TM02"],
  [291, "TM03"],
  [292, "TM04"],
  [293, "TM05"],
  [294, "TM06"],
  [295, "TM07"],
  [296, "TM08"],
  [297, "TM09"],
  [298, "TM10"],
  [299, "TM11"],
  [300, "TM12"],
  [301, "TM13"],
  [302, "TM14"],
  [303, "TM15"],
  [304, "TM16"],
  [305, "TM17"],
  [306, "TM18"],
  [307, "TM19"],
  [308, "TM20"],
  [309, "TM21"],
  [310, "TM22"],
  [311, "TM23"],
  [312, "TM24"],
  [313, "TM25"],
  [314, "TM26"],
  [315, "TM27"],
  [316, "TM28"],
  [317, "TM29"],
  [318, "TM30"],
  [319, "TM31"],
  [320, "TM32"],
  [321, "TM33"],
  [322, "TM34"],
  [323, "TM35"],
  [324, "TM36"],
  [325, "TM37"],
  [326, "TM38"],
  [327, "TM39"],
  [328, "TM40"],
  [329, "TM41"],
  [330, "TM42"],
  [331, "TM43"],
  [332, "TM44"],
  [333, "TM45"],
  [334, "TM46"],
  [335, "TM47"],
  [336, "TM48"],
  [337, "TM49"],
  [338, "TM50"],
  [339, "HM01"],
  [340, "HM02"],
  [341, "HM03"],
  [342, "HM04"],
  [343, "HM05"],
  [344, "HM06"],
  [345, "HM07"],
  [346, "HM08"],
  // FRLG Key Items (349+)
  [349, "Oak's Parcel"],
  [350, "Poké Flute"],
  [351, "Secret Key"],
  [352, "Bike Voucher"],
  [353, "Gold Teeth"],
  [354, "Old Amber"],
  [355, "Card Key"],
  [356, "Lift Key"],
  [357, "Helix Fossil"],
  [358, "Dome Fossil"],
  [359, "Silph Scope"],
  [360, "Bicycle"],
  [361, "Town Map"],
  [362, "Vs. Seeker"],
  [363, "Fame Checker"],
  [364, "TM Case"],
  [365, "Berry Pouch"],
  [366, "Teachy TV"],
  [367, "Tri-Pass"],
  [368, "Rainbow Pass"],
  [369, "Tea"],
  [370, "MysticTicket"],
  [371, "AuroraTicket"],
  [372, "Powder Jar"],
  [373, "Ruby"],
  [374, "Sapphire"],
  [375, "Magma Emblem"],
  [376, "Old Sea Map"],
];

// Populate the array
for (const [id, name] of GEN3_ITEM_DATA) {
  ITEMS_GEN3[id] = name;
}

// Gen 3 item categories for pocket filtering (from ItemStorage3RS.cs)
export const GEN3_ITEMS_GENERAL: number[] = [
  13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
  32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50,
  51, 63, 64, 65, 66, 67, 68, 69, 70, 71, 73, 74, 75, 76, 77, 78, 79, 80, 81,
  83, 84, 85, 86, 93, 94, 95, 96, 97, 98, 103, 104, 106, 107, 108, 109, 110,
  111, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 179, 180,
  181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195,
  196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210,
  211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225,
  254, 255, 256, 257, 258,
];

export const GEN3_ITEMS_KEY: number[] = [
  259, 260, 261, 262, 263, 264, 265, 266, 268, 269, 270, 271, 272, 273, 274,
  275, 276, 277, 278, 279, 280, 281, 282, 283, 284, 285, 286, 287, 288,
  // FRLG key items
  349, 350, 351, 352, 353, 354, 355, 356, 357, 358, 359, 360, 361, 362, 363,
  364, 365, 366, 367, 368, 369, 370, 371, 372, 373, 374, 375, 376,
];

export const GEN3_ITEMS_BALLS: number[] = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
];

export const GEN3_ITEMS_TMS_HMS: number[] = [
  289, 290, 291, 292, 293, 294, 295, 296, 297, 298, 299, 300, 301, 302, 303,
  304, 305, 306, 307, 308, 309, 310, 311, 312, 313, 314, 315, 316, 317, 318,
  319, 320, 321, 322, 323, 324, 325, 326, 327, 328, 329, 330, 331, 332, 333,
  334, 335, 336, 337, 338, 339, 340, 341, 342, 343, 344, 345, 346,
];

export const GEN3_ITEMS_BERRIES: number[] = [
  133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147,
  148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162,
  163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175,
];

export const MAX_ITEM_ID_2 = 151;
export const MAX_ITEM_ID_3 = 376; // Full RSE/FRLG item range

/**
 * Get item name by ID for a specific generation
 */
export function getItemName(itemId: number, generation: number = 3): string {
  if (itemId === 0) return "---";

  if (generation === 2) {
    if (itemId < 0 || itemId >= ITEMS_GEN2.length) return "---";
    return ITEMS_GEN2[itemId];
  }

  // Gen 3
  if (itemId < 0 || itemId >= ITEMS_GEN3.length) return `Item ${itemId}`;
  const name = ITEMS_GEN3[itemId];
  return name && name !== "---" ? name : `Item ${itemId}`;
}

/**
 * Check if item is a held item (not a key item or TM/HM)
 */
export function isHoldableItem(
  itemId: number,
  generation: number = 3
): boolean {
  if (itemId === 0) return false;

  // This would need more complete data to be accurate
  // For now, just check it's within valid range
  if (generation === 2) {
    return itemId > 0 && itemId <= MAX_ITEM_ID_2;
  }

  return itemId > 0 && itemId <= MAX_ITEM_ID_3;
}

/**
 * Get all items for a generation as array of names
 */
export function getItemListNames(generation: number): string[] {
  if (generation === 2) return ITEMS_GEN2;
  return ITEMS_GEN3;
}

/**
 * Get all items for a generation with id and name
 */
export function getItemList(
  generation: number
): Array<{ id: number; name: string }> {
  const items = generation === 2 ? ITEMS_GEN2 : ITEMS_GEN3;
  return items
    .map((name, id) => ({ id, name }))
    .filter(
      (item) => item.name && item.name !== "---" && item.name !== "(None)"
    );
}

/**
 * Get items valid for a specific Gen 3 pocket type
 */
export function getGen3ItemsForPocket(
  pocketType: "items" | "key" | "balls" | "tm" | "berries" | "pc"
): Array<{ id: number; name: string }> {
  let validIds: number[];

  switch (pocketType) {
    case "items":
      validIds = GEN3_ITEMS_GENERAL;
      break;
    case "key":
      validIds = GEN3_ITEMS_KEY;
      break;
    case "balls":
      validIds = GEN3_ITEMS_BALLS;
      break;
    case "tm":
      validIds = GEN3_ITEMS_TMS_HMS;
      break;
    case "berries":
      validIds = GEN3_ITEMS_BERRIES;
      break;
    case "pc":
      // PC can hold all items
      validIds = [
        ...GEN3_ITEMS_GENERAL,
        ...GEN3_ITEMS_KEY,
        ...GEN3_ITEMS_BALLS,
        ...GEN3_ITEMS_TMS_HMS,
        ...GEN3_ITEMS_BERRIES,
      ];
      break;
    default:
      validIds = [];
  }

  return validIds
    .map((id) => ({ id, name: ITEMS_GEN3[id] }))
    .filter((item) => item.name && item.name !== "---")
    .sort((a, b) => a.name.localeCompare(b.name));
}
