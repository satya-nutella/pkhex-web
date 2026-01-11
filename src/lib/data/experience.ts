/**
 * Experience and level calculations.
 *
 * Growth rates:
 * 0 = Medium Fast (n³)
 * 1 = Erratic
 * 2 = Fluctuating
 * 3 = Medium Slow
 * 4 = Fast (0.8×n³)
 * 5 = Slow (1.25×n³)
 */

export const MAX_LEVEL = 100;
export const MIN_LEVEL = 1;

// Experience tables for each growth rate (index = level - 1)
const GROWTH_0_MEDIUM_FAST: readonly number[] = [
  0, 8, 27, 64, 125, 216, 343, 512, 729, 1000, 1331, 1728, 2197, 2744, 3375,
  4096, 4913, 5832, 6859, 8000, 9261, 10648, 12167, 13824, 15625, 17576, 19683,
  21952, 24389, 27000, 29791, 32768, 35937, 39304, 42875, 46656, 50653, 54872,
  59319, 64000, 68921, 74088, 79507, 85184, 91125, 97336, 103823, 110592,
  117649, 125000, 132651, 140608, 148877, 157464, 166375, 175616, 185193,
  195112, 205379, 216000, 226981, 238328, 250047, 262144, 274625, 287496,
  300763, 314432, 328509, 343000, 357911, 373248, 389017, 405224, 421875,
  438976, 456533, 474552, 493039, 512000, 531441, 551368, 571787, 592704,
  614125, 636056, 658503, 681472, 704969, 729000, 753571, 778688, 804357,
  830584, 857375, 884736, 912673, 941192, 970299, 1000000,
];

const GROWTH_1_ERRATIC: readonly number[] = [
  0, 15, 52, 122, 237, 406, 637, 942, 1326, 1800, 2369, 3041, 3822, 4719, 5737,
  6881, 8155, 9564, 11111, 12800, 14632, 16610, 18737, 21012, 23437, 26012,
  28737, 31610, 34632, 37800, 41111, 44564, 48155, 51881, 55737, 59719, 63822,
  68041, 72369, 76800, 81326, 85942, 90637, 95406, 100237, 105122, 110052,
  115015, 120001, 125000, 131324, 137795, 144410, 151165, 158056, 165079,
  172229, 179503, 186894, 194400, 202013, 209728, 217540, 225443, 233431,
  241496, 249633, 257834, 267406, 276458, 286328, 296358, 305767, 316074,
  326531, 336255, 346965, 357812, 367807, 378880, 390077, 400293, 411686,
  423190, 433572, 445239, 457001, 467489, 479378, 491346, 501878, 513934,
  526049, 536557, 548720, 560922, 571333, 583539, 591882, 600000,
];

const GROWTH_2_FLUCTUATING: readonly number[] = [
  0, 4, 13, 32, 65, 112, 178, 276, 393, 540, 745, 967, 1230, 1591, 1957, 2457,
  3046, 3732, 4526, 5440, 6482, 7666, 9003, 10506, 12187, 14060, 16140, 18439,
  20974, 23760, 26811, 30146, 33780, 37731, 42017, 46656, 50653, 55969, 60505,
  66560, 71677, 78533, 84277, 91998, 98415, 107069, 114205, 123863, 131766,
  142500, 151222, 163105, 172697, 185807, 196322, 210739, 222231, 238036,
  250562, 267840, 281456, 300293, 315059, 335544, 351520, 373744, 390991,
  415050, 433631, 459620, 479600, 507617, 529063, 559209, 582187, 614566,
  639146, 673863, 700115, 737280, 765275, 804997, 834809, 877201, 908905,
  954084, 987754, 1035837, 1071552, 1122660, 1160499, 1214753, 1254796, 1312322,
  1354652, 1415577, 1460276, 1524731, 1571884, 1640000,
];

const GROWTH_3_MEDIUM_SLOW: readonly number[] = [
  0, 9, 57, 96, 135, 179, 236, 314, 419, 560, 742, 973, 1261, 1612, 2035, 2535,
  3120, 3798, 4575, 5460, 6458, 7577, 8825, 10208, 11735, 13411, 15244, 17242,
  19411, 21760, 24294, 27021, 29949, 33084, 36435, 40007, 43808, 47846, 52127,
  56660, 61450, 66505, 71833, 77440, 83335, 89523, 96012, 102810, 109923,
  117360, 125126, 133229, 141677, 150476, 159635, 169159, 179056, 189334,
  199999, 211060, 222522, 234393, 246681, 259392, 272535, 286115, 300140,
  314618, 329555, 344960, 360838, 377197, 394045, 411388, 429235, 447591,
  466464, 485862, 505791, 526260, 547274, 568841, 590969, 613664, 636935,
  660787, 685228, 710266, 735907, 762160, 789030, 816525, 844653, 873420,
  902835, 932903, 963632, 995030, 1027103, 1059860,
];

const GROWTH_4_FAST: readonly number[] = [
  0, 6, 21, 51, 100, 172, 274, 409, 583, 800, 1064, 1382, 1757, 2195, 2700,
  3276, 3930, 4665, 5487, 6400, 7408, 8518, 9733, 11059, 12500, 14060, 15746,
  17561, 19511, 21600, 23832, 26214, 28749, 31443, 34300, 37324, 40522, 43897,
  47455, 51200, 55136, 59270, 63605, 68147, 72900, 77868, 83058, 88473, 94119,
  100000, 106120, 112486, 119101, 125971, 133100, 140492, 148154, 156089,
  164303, 172800, 181584, 190662, 200037, 209715, 219700, 229996, 240610,
  251545, 262807, 274400, 286328, 298598, 311213, 324179, 337500, 351180,
  365226, 379641, 394431, 409600, 425152, 441094, 457429, 474163, 491300,
  508844, 526802, 545177, 563975, 583200, 602856, 622950, 643485, 664467,
  685900, 707788, 730138, 752953, 776239, 800000,
];

const GROWTH_5_SLOW: readonly number[] = [
  0, 10, 33, 80, 156, 270, 428, 640, 911, 1250, 1663, 2160, 2746, 3430, 4218,
  5120, 6141, 7290, 8573, 10000, 11576, 13310, 15208, 17280, 19531, 21970,
  24603, 27440, 30486, 33750, 37238, 40960, 44921, 49130, 53593, 58320, 63316,
  68590, 74148, 80000, 86151, 92610, 99383, 106480, 113906, 121670, 129778,
  138240, 147061, 156250, 165813, 175760, 186096, 196830, 207968, 219520,
  231491, 243890, 256723, 270000, 283726, 297910, 312558, 327680, 343281,
  359370, 375953, 393040, 410636, 428750, 447388, 466560, 486271, 506530,
  527343, 548720, 570666, 593190, 616298, 640000, 664301, 689210, 714733,
  740880, 767656, 795070, 823128, 851840, 881211, 911250, 941963, 973360,
  1005446, 1038230, 1071718, 1105920, 1140841, 1176490, 1212873, 1250000,
];

const EXPERIENCE_TABLES: readonly (readonly number[])[] = [
  GROWTH_0_MEDIUM_FAST,
  GROWTH_1_ERRATIC,
  GROWTH_2_FLUCTUATING,
  GROWTH_3_MEDIUM_SLOW,
  GROWTH_4_FAST,
  GROWTH_5_SLOW,
];

/**
 * Growth rate for each species (Gen 3, National Dex order).
 * 0=Medium Fast, 1=Erratic, 2=Fluctuating, 3=Medium Slow, 4=Fast, 5=Slow
 */
const SPECIES_GROWTH_RATE: readonly number[] = [
  0, // 0 - None
  3, // 1 - Bulbasaur
  3, // 2 - Ivysaur
  3, // 3 - Venusaur
  3, // 4 - Charmander
  3, // 5 - Charmeleon
  3, // 6 - Charizard
  3, // 7 - Squirtle
  3, // 8 - Wartortle
  3, // 9 - Blastoise
  0, // 10 - Caterpie
  0, // 11 - Metapod
  0, // 12 - Butterfree
  0, // 13 - Weedle
  0, // 14 - Kakuna
  0, // 15 - Beedrill
  3, // 16 - Pidgey
  3, // 17 - Pidgeotto
  3, // 18 - Pidgeot
  0, // 19 - Rattata
  0, // 20 - Raticate
  0, // 21 - Spearow
  0, // 22 - Fearow
  0, // 23 - Ekans
  0, // 24 - Arbok
  0, // 25 - Pikachu
  0, // 26 - Raichu
  0, // 27 - Sandshrew
  0, // 28 - Sandslash
  3, // 29 - Nidoran♀
  3, // 30 - Nidorina
  3, // 31 - Nidoqueen
  3, // 32 - Nidoran♂
  3, // 33 - Nidorino
  3, // 34 - Nidoking
  4, // 35 - Clefairy
  4, // 36 - Clefable
  0, // 37 - Vulpix
  0, // 38 - Ninetales
  4, // 39 - Jigglypuff
  4, // 40 - Wigglytuff
  0, // 41 - Zubat
  0, // 42 - Golbat
  3, // 43 - Oddish
  3, // 44 - Gloom
  3, // 45 - Vileplume
  0, // 46 - Paras
  0, // 47 - Parasect
  0, // 48 - Venonat
  0, // 49 - Venomoth
  0, // 50 - Diglett
  0, // 51 - Dugtrio
  0, // 52 - Meowth
  0, // 53 - Persian
  0, // 54 - Psyduck
  0, // 55 - Golduck
  0, // 56 - Mankey
  0, // 57 - Primeape
  5, // 58 - Growlithe
  5, // 59 - Arcanine
  3, // 60 - Poliwag
  3, // 61 - Poliwhirl
  3, // 62 - Poliwrath
  3, // 63 - Abra
  3, // 64 - Kadabra
  3, // 65 - Alakazam
  3, // 66 - Machop
  3, // 67 - Machoke
  3, // 68 - Machamp
  3, // 69 - Bellsprout
  3, // 70 - Weepinbell
  3, // 71 - Victreebel
  5, // 72 - Tentacool
  5, // 73 - Tentacruel
  3, // 74 - Geodude
  3, // 75 - Graveler
  3, // 76 - Golem
  0, // 77 - Ponyta
  0, // 78 - Rapidash
  0, // 79 - Slowpoke
  0, // 80 - Slowbro
  0, // 81 - Magnemite
  0, // 82 - Magneton
  0, // 83 - Farfetch'd
  0, // 84 - Doduo
  0, // 85 - Dodrio
  0, // 86 - Seel
  0, // 87 - Dewgong
  0, // 88 - Grimer
  0, // 89 - Muk
  5, // 90 - Shellder
  5, // 91 - Cloyster
  3, // 92 - Gastly
  3, // 93 - Haunter
  3, // 94 - Gengar
  0, // 95 - Onix
  0, // 96 - Drowzee
  0, // 97 - Hypno
  0, // 98 - Krabby
  0, // 99 - Kingler
  0, // 100 - Voltorb
  0, // 101 - Electrode
  5, // 102 - Exeggcute
  5, // 103 - Exeggutor
  0, // 104 - Cubone
  0, // 105 - Marowak
  0, // 106 - Hitmonlee
  0, // 107 - Hitmonchan
  0, // 108 - Lickitung
  0, // 109 - Koffing
  0, // 110 - Weezing
  5, // 111 - Rhyhorn
  5, // 112 - Rhydon
  4, // 113 - Chansey
  0, // 114 - Tangela
  0, // 115 - Kangaskhan
  0, // 116 - Horsea
  0, // 117 - Seadra
  0, // 118 - Goldeen
  0, // 119 - Seaking
  5, // 120 - Staryu
  5, // 121 - Starmie
  0, // 122 - Mr. Mime
  0, // 123 - Scyther
  0, // 124 - Jynx
  0, // 125 - Electabuzz
  0, // 126 - Magmar
  5, // 127 - Pinsir
  5, // 128 - Tauros
  5, // 129 - Magikarp
  5, // 130 - Gyarados
  5, // 131 - Lapras
  0, // 132 - Ditto
  0, // 133 - Eevee
  0, // 134 - Vaporeon
  0, // 135 - Jolteon
  0, // 136 - Flareon
  0, // 137 - Porygon
  0, // 138 - Omanyte
  0, // 139 - Omastar
  0, // 140 - Kabuto
  0, // 141 - Kabutops
  5, // 142 - Aerodactyl
  5, // 143 - Snorlax
  5, // 144 - Articuno
  5, // 145 - Zapdos
  5, // 146 - Moltres
  5, // 147 - Dratini
  5, // 148 - Dragonair
  5, // 149 - Dragonite
  5, // 150 - Mewtwo
  3, // 151 - Mew
  // Gen 2
  3, // 152 - Chikorita
  3, // 153 - Bayleef
  3, // 154 - Meganium
  3, // 155 - Cyndaquil
  3, // 156 - Quilava
  3, // 157 - Typhlosion
  3, // 158 - Totodile
  3, // 159 - Croconaw
  3, // 160 - Feraligatr
  0, // 161 - Sentret
  0, // 162 - Furret
  0, // 163 - Hoothoot
  0, // 164 - Noctowl
  4, // 165 - Ledyba
  4, // 166 - Ledian
  4, // 167 - Spinarak
  4, // 168 - Ariados
  0, // 169 - Crobat
  5, // 170 - Chinchou
  5, // 171 - Lanturn
  0, // 172 - Pichu
  4, // 173 - Cleffa
  4, // 174 - Igglybuff
  4, // 175 - Togepi
  4, // 176 - Togetic
  0, // 177 - Natu
  0, // 178 - Xatu
  3, // 179 - Mareep
  3, // 180 - Flaaffy
  3, // 181 - Ampharos
  3, // 182 - Bellossom
  4, // 183 - Marill
  4, // 184 - Azumarill
  0, // 185 - Sudowoodo
  3, // 186 - Politoed
  3, // 187 - Hoppip
  3, // 188 - Skiploom
  3, // 189 - Jumpluff
  0, // 190 - Aipom
  3, // 191 - Sunkern
  3, // 192 - Sunflora
  0, // 193 - Yanma
  0, // 194 - Wooper
  0, // 195 - Quagsire
  0, // 196 - Espeon
  0, // 197 - Umbreon
  3, // 198 - Murkrow
  0, // 199 - Slowking
  0, // 200 - Misdreavus
  0, // 201 - Unown
  0, // 202 - Wobbuffet
  0, // 203 - Girafarig
  0, // 204 - Pineco
  0, // 205 - Forretress
  0, // 206 - Dunsparce
  0, // 207 - Gligar
  0, // 208 - Steelix
  4, // 209 - Snubbull
  4, // 210 - Granbull
  0, // 211 - Qwilfish
  0, // 212 - Scizor
  3, // 213 - Shuckle
  5, // 214 - Heracross
  3, // 215 - Sneasel
  0, // 216 - Teddiursa
  0, // 217 - Ursaring
  0, // 218 - Slugma
  0, // 219 - Magcargo
  5, // 220 - Swinub
  5, // 221 - Piloswine
  4, // 222 - Corsola
  0, // 223 - Remoraid
  0, // 224 - Octillery
  4, // 225 - Delibird
  5, // 226 - Mantine
  5, // 227 - Skarmory
  3, // 228 - Houndour
  3, // 229 - Houndoom
  0, // 230 - Kingdra
  0, // 231 - Phanpy
  0, // 232 - Donphan
  0, // 233 - Porygon2
  5, // 234 - Stantler
  0, // 235 - Smeargle
  0, // 236 - Tyrogue
  0, // 237 - Hitmontop
  0, // 238 - Smoochum
  0, // 239 - Elekid
  0, // 240 - Magby
  5, // 241 - Miltank
  4, // 242 - Blissey
  5, // 243 - Raikou
  5, // 244 - Entei
  5, // 245 - Suicune
  5, // 246 - Larvitar
  5, // 247 - Pupitar
  5, // 248 - Tyranitar
  5, // 249 - Lugia
  5, // 250 - Ho-Oh
  3, // 251 - Celebi
  // Gen 3
  3, // 252 - Treecko
  3, // 253 - Grovyle
  3, // 254 - Sceptile
  3, // 255 - Torchic
  3, // 256 - Combusken
  3, // 257 - Blaziken
  3, // 258 - Mudkip
  3, // 259 - Marshtomp
  3, // 260 - Swampert
  3, // 261 - Poochyena
  3, // 262 - Mightyena
  0, // 263 - Zigzagoon
  0, // 264 - Linoone
  0, // 265 - Wurmple
  0, // 266 - Silcoon
  0, // 267 - Beautifly
  0, // 268 - Cascoon
  0, // 269 - Dustox
  3, // 270 - Lotad
  3, // 271 - Lombre
  3, // 272 - Ludicolo
  3, // 273 - Seedot
  3, // 274 - Nuzleaf
  3, // 275 - Shiftry
  0, // 276 - Taillow
  0, // 277 - Swellow
  1, // 278 - Wingull
  0, // 279 - Pelipper
  5, // 280 - Ralts
  5, // 281 - Kirlia
  5, // 282 - Gardevoir
  0, // 283 - Surskit
  0, // 284 - Masquerain
  2, // 285 - Shroomish
  2, // 286 - Breloom
  4, // 287 - Slakoth
  5, // 288 - Vigoroth
  5, // 289 - Slaking
  0, // 290 - Nincada
  1, // 291 - Ninjask
  1, // 292 - Shedinja
  2, // 293 - Whismur
  3, // 294 - Loudred
  3, // 295 - Exploud
  2, // 296 - Makuhita
  2, // 297 - Hariyama
  2, // 298 - Azurill
  0, // 299 - Nosepass
  1, // 300 - Skitty
  4, // 301 - Delcatty
  3, // 302 - Sableye
  1, // 303 - Mawile
  3, // 304 - Aron
  3, // 305 - Lairon
  3, // 306 - Aggron
  0, // 307 - Meditite
  0, // 308 - Medicham
  0, // 309 - Electrike
  5, // 310 - Manectric
  5, // 311 - Plusle
  5, // 312 - Minun
  0, // 313 - Volbeat
  2, // 314 - Illumise
  0, // 315 - Roselia
  2, // 316 - Gulpin
  2, // 317 - Swalot
  5, // 318 - Carvanha
  5, // 319 - Sharpedo
  5, // 320 - Wailmer
  2, // 321 - Wailord
  0, // 322 - Numel
  0, // 323 - Camerupt
  0, // 324 - Torkoal
  4, // 325 - Spoink
  4, // 326 - Grumpig
  4, // 327 - Spinda
  3, // 328 - Trapinch
  3, // 329 - Vibrava
  3, // 330 - Flygon
  0, // 331 - Cacnea
  3, // 332 - Cacturne
  1, // 333 - Swablu
  1, // 334 - Altaria
  1, // 335 - Zangoose
  2, // 336 - Seviper
  0, // 337 - Lunatone
  4, // 338 - Solrock
  2, // 339 - Barboach
  2, // 340 - Whiscash
  2, // 341 - Corphish
  2, // 342 - Crawdaunt
  0, // 343 - Baltoy
  0, // 344 - Claydol
  1, // 345 - Lileep
  1, // 346 - Cradily
  1, // 347 - Anorith
  1, // 348 - Armaldo
  1, // 349 - Feebas
  1, // 350 - Milotic
  0, // 351 - Castform
  0, // 352 - Kecleon
  0, // 353 - Shuppet
  4, // 354 - Banette
  0, // 355 - Duskull
  4, // 356 - Dusclops
  4, // 357 - Tropius
  4, // 358 - Chimecho
  4, // 359 - Absol
  0, // 360 - Wynaut
  0, // 361 - Snorunt
  0, // 362 - Glalie
  5, // 363 - Spheal
  3, // 364 - Sealeo
  3, // 365 - Walrein
  2, // 366 - Clamperl
  1, // 367 - Huntail
  1, // 368 - Gorebyss
  4, // 369 - Relicanth
  4, // 370 - Luvdisc
  5, // 371 - Bagon
  5, // 372 - Shelgon
  5, // 373 - Salamence
  5, // 374 - Beldum
  5, // 375 - Metang
  5, // 376 - Metagross
  5, // 377 - Regirock
  5, // 378 - Regice
  5, // 379 - Registeel
  5, // 380 - Latias
  5, // 381 - Latios
  5, // 382 - Kyogre
  5, // 383 - Groudon
  5, // 384 - Rayquaza
  5, // 385 - Jirachi
  5, // 386 - Deoxys
];

/**
 * Get the experience table for a given growth rate.
 */
function getExperienceTable(growth: number): readonly number[] {
  if (growth < 0 || growth > 5) return EXPERIENCE_TABLES[0]; // Default to Medium Fast
  return EXPERIENCE_TABLES[growth];
}

/**
 * Get growth rate for a species.
 */
export function getGrowthRate(species: number): number {
  if (species < 0 || species >= SPECIES_GROWTH_RATE.length) return 0;
  return SPECIES_GROWTH_RATE[species];
}

/**
 * Calculate level from experience points.
 */
export function getLevelFromExp(exp: number, species: number): number {
  const growth = getGrowthRate(species);
  const table = getExperienceTable(growth);

  // If exp >= max, return 100
  if (exp >= table[MAX_LEVEL - 1]) return MAX_LEVEL;

  // Find level (table index = level - 1)
  for (let level = MIN_LEVEL; level <= MAX_LEVEL; level++) {
    if (exp < table[level - 1]) {
      return Math.max(MIN_LEVEL, level - 1);
    }
  }

  return MAX_LEVEL;
}

/**
 * Calculate level from experience points using a growth rate directly.
 */
export function getLevelFromExpAndGrowth(exp: number, growth: number): number {
  const table = getExperienceTable(growth);

  // If exp >= max, return 100
  if (exp >= table[MAX_LEVEL - 1]) return MAX_LEVEL;

  // Find level (table index = level - 1)
  for (let level = MIN_LEVEL; level <= MAX_LEVEL; level++) {
    if (exp < table[level - 1]) {
      return Math.max(MIN_LEVEL, level - 1);
    }
  }

  return MAX_LEVEL;
}

/**
 * Get experience required for a given level.
 */
export function getExpForLevel(level: number, species: number): number {
  if (level <= MIN_LEVEL) return 0;
  if (level > MAX_LEVEL) level = MAX_LEVEL;

  const growth = getGrowthRate(species);
  const table = getExperienceTable(growth);
  return table[level - 1];
}

/**
 * Get experience required for a given level using growth rate directly.
 */
export function getExpForLevelAndGrowth(level: number, growth: number): number {
  if (level <= MIN_LEVEL) return 0;
  if (level > MAX_LEVEL) level = MAX_LEVEL;

  const table = getExperienceTable(growth);
  return table[level - 1];
}
