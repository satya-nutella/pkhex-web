/**
 * Pokemon Met Location data for Gen 3 (RSE/FRLG)
 * Index = location ID
 */

export const LOCATIONS_GEN3: string[] = [
  "", // 0 - None
  "Littleroot Town",
  "Oldale Town",
  "Dewford Town",
  "Lavaridge Town",
  "Fallarbor Town",
  "Verdanturf Town",
  "Pacifidlog Town",
  "Petalburg City",
  "Slateport City",
  "Mauville City", // 10
  "Rustboro City",
  "Fortree City",
  "Lilycove City",
  "Mossdeep City",
  "Sootopolis City",
  "Ever Grande City",
  "Route 101",
  "Route 102",
  "Route 103",
  "Route 104", // 20
  "Route 105",
  "Route 106",
  "Route 107",
  "Route 108",
  "Route 109",
  "Route 110",
  "Route 111",
  "Route 112",
  "Route 113",
  "Route 114", // 30
  "Route 115",
  "Route 116",
  "Route 117",
  "Route 118",
  "Route 119",
  "Route 120",
  "Route 121",
  "Route 122",
  "Route 123",
  "Route 124", // 40
  "Route 125",
  "Route 126",
  "Route 127",
  "Route 128",
  "Route 129",
  "Route 130",
  "Route 131",
  "Route 132",
  "Route 133",
  "Route 134", // 50
  "Underwater (Route 124)",
  "Underwater (Route 126)",
  "Underwater (Route 127)",
  "Underwater (Route 128)",
  "Underwater (Sootopolis City)",
  "Granite Cave",
  "Mt. Chimney",
  "Safari Zone (RSE)",
  "Battle Frontier",
  "Petalburg Woods", // 60
  "Rusturf Tunnel",
  "Abandoned Ship",
  "New Mauville",
  "Meteor Falls",
  "Meteor Falls",
  "Mt. Pyre",
  "Hideout",
  "Shoal Cave",
  "Seafloor Cavern",
  "Underwater (Seafloor Cavern)", // 70
  "Victory Road (RSE)",
  "Mirage Island",
  "Cave of Origin",
  "Southern Island",
  "Fiery Path",
  "Fiery Path",
  "Jagged Pass",
  "Jagged Pass",
  "Sealed Chamber",
  "Underwater (Route 134)", // 80
  "Scorched Slab",
  "Island Cave",
  "Desert Ruins",
  "Ancient Tomb",
  "Inside of Truck",
  "Sky Pillar",
  "Secret Base",
  "Ferry",
  "Pallet Town",
  "Viridian City", // 90
  "Pewter City",
  "Cerulean City",
  "Lavender Town",
  "Vermilion City",
  "Celadon City",
  "Fuchsia City",
  "Cinnabar Island",
  "Indigo Plateau",
  "Saffron City",
  "Route 4 (Pokemon Center)", // 100
  "Route 10 (Pokemon Center)",
  "Route 1",
  "Route 2",
  "Route 3",
  "Route 4",
  "Route 5",
  "Route 6",
  "Route 7",
  "Route 8",
  "Route 9", // 110
  "Route 10",
  "Route 11",
  "Route 12",
  "Route 13",
  "Route 14",
  "Route 15",
  "Route 16",
  "Route 17",
  "Route 18",
  "Route 19", // 120
  "Route 20",
  "Route 21",
  "Route 22",
  "Route 23",
  "Route 24",
  "Route 25",
  "Viridian Forest",
  "Mt. Moon",
  "S.S. Anne",
  "Underground Path (5-6)", // 130
  "Underground Path (7-8)",
  "Diglett's Cave",
  "Victory Road (Kanto)",
  "Rocket Hideout",
  "Silph Co.",
  "Pokemon Mansion",
  "Safari Zone (Kanto)",
  "Pokemon League",
  "Rock Tunnel",
  "Seafoam Islands", // 140
  "Pokemon Tower",
  "Cerulean Cave",
  "Power Plant",
  "One Island",
  "Two Island",
  "Three Island",
  "Four Island",
  "Five Island",
  "Seven Island",
  "Six Island", // 150
  "Kindle Road",
  "Treasure Beach",
  "Cape Brink",
  "Bond Bridge",
  "Three Isle Port",
  "Sevii Isle 6",
  "Sevii Isle 7",
  "Sevii Isle 8",
  "Sevii Isle 9",
  "Resort Gorgeous", // 160
  "Water Labyrinth",
  "Five Isle Meadow",
  "Memorial Pillar",
  "Outcast Island",
  "Green Path",
  "Water Path",
  "Ruin Valley",
  "Trainer Tower (exterior)",
  "Canyon Entrance",
  "Sevault Canyon", // 170
  "Tanoby Ruins",
  "Sevii Isle 22",
  "Sevii Isle 23",
  "Sevii Isle 24",
  "Navel Rock (FRLG)",
  "Mt. Ember",
  "Berry Forest",
  "Icefall Cave",
  "Rocket Warehouse",
  "Trainer Tower", // 180
  "Dotted Hole",
  "Lost Cave",
  "Pattern Bush",
  "Altering Cave (FRLG)",
  "Tanoby Chambers",
  "Three Isle Path",
  "Tanoby Key",
  "Birth Island (FRLG)",
  "Monean Chamber",
  "Liptoo Chamber", // 190
  "Weepth Chamber",
  "Dilford Chamber",
  "Scufib Chamber",
  "Rixy Chamber",
  "Viapois Chamber",
  "Ember Spa",
  "Special Area",
  "Aqua Hideout",
  "Magma Hideout",
  "Mirage Tower", // 200
  "Birth Island (E)",
  "Faraway Island",
  "Artisan Cave",
  "Marine Cave",
  "Underwater (Marine Cave)",
  "Terra Cave",
  "Underwater (Route 105)",
  "Underwater (Route 125)",
  "Underwater (Route 129)",
  "Desert Underpass", // 210
  "Altering Cave (E)",
  "Navel Rock (E)",
  "Trainer Hill",
];

// Fill remaining slots up to 255
for (let i = LOCATIONS_GEN3.length; i < 254; i++) {
  LOCATIONS_GEN3.push("");
}
LOCATIONS_GEN3.push("Gift Egg"); // 254
LOCATIONS_GEN3.push("In-game Trade"); // 255

/**
 * Get location name by ID
 */
export function getLocationName(id: number, generation: number): string {
  if (generation === 3) {
    if (id >= 0 && id < LOCATIONS_GEN3.length) {
      return LOCATIONS_GEN3[id] || `Location ${id}`;
    }
  }
  return `Location ${id}`;
}

/**
 * Get list of valid locations for a generation
 */
export function getLocationList(
  generation: number,
): Array<{ id: number; name: string }> {
  if (generation === 3) {
    return LOCATIONS_GEN3.map((name, id) => ({
      id,
      name: name || `Location ${id}`,
    })).filter(
      (loc) => loc.name && loc.name !== `Location ${loc.id}` && loc.id > 0,
    );
  }
  return [];
}
