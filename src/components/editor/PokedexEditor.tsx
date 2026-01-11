"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSaveStore } from "@/stores/saveStore";
import { PokemonSprite } from "@/components/pokemon/PokemonSprite";
import { getSpeciesName } from "@/lib/data/species";
import { SAV1 } from "@/lib/pkhex-core/saves/SAV1";
import { SAV2 } from "@/lib/pkhex-core/saves/SAV2";
import { SAV3 } from "@/lib/pkhex-core/saves/SAV3";
import { Check, Eye, Search, CheckSquare, Square } from "lucide-react";

interface PokedexEntry {
  species: number;
  name: string;
  seen: boolean;
  caught: boolean;
}

export function PokedexEditor() {
  const save = useSaveStore((state) => state.save);
  const generation = useSaveStore((state) => state.generation);
  const setModified = useSaveStore((state) => state.setModified);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "seen" | "caught" | "missing">(
    "all",
  );
  const [, forceUpdate] = useState({});

  // Get max species based on generation
  const maxSpecies = useMemo(() => {
    if (generation === 1) return 151;
    if (generation === 2) return 251;
    if (generation === 3) return 386;
    return 0;
  }, [generation]);

  // Build Pokedex entries
  const entries = useMemo<PokedexEntry[]>(() => {
    if (!save || generation === 0) return [];

    const result: PokedexEntry[] = [];
    for (let i = 1; i <= maxSpecies; i++) {
      let seen = false;
      let caught = false;

      if (save instanceof SAV1) {
        seen = save.getSeen(i);
        caught = save.getCaught(i);
      } else if (save instanceof SAV2) {
        seen = save.getSeen(i);
        caught = save.getCaught(i);
      } else if (save instanceof SAV3) {
        seen = save.getSeen(i);
        caught = save.getCaught(i);
      }

      result.push({
        species: i,
        name: getSpeciesName(i),
        seen,
        caught,
      });
    }
    return result;
  }, [save, generation, maxSpecies]);

  // Filter entries
  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      // Search filter
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        if (
          !entry.name.toLowerCase().includes(search) &&
          !entry.species.toString().includes(search)
        ) {
          return false;
        }
      }

      // Status filter
      switch (filter) {
        case "seen":
          return entry.seen && !entry.caught;
        case "caught":
          return entry.caught;
        case "missing":
          return !entry.seen;
        default:
          return true;
      }
    });
  }, [entries, searchTerm, filter]);

  // Stats
  const stats = useMemo(() => {
    const seen = entries.filter((e) => e.seen).length;
    const caught = entries.filter((e) => e.caught).length;
    return { seen, caught, total: maxSpecies };
  }, [entries, maxSpecies]);

  // Toggle seen status
  const toggleSeen = (species: number) => {
    if (!save) return;

    if (save instanceof SAV1) {
      const current = save.getSeen(species);
      save.setSeen(species, !current);
      // If un-seeing, also un-catch
      if (current && save.getCaught(species)) {
        save.setCaught(species, false);
      }
    } else if (save instanceof SAV2) {
      const current = save.getSeen(species);
      save.setSeen(species, !current);
      if (current && save.getCaught(species)) {
        save.setCaught(species, false);
      }
    } else if (save instanceof SAV3) {
      const current = save.getSeen(species);
      save.setSeen(species, !current);
      if (current && save.getCaught(species)) {
        save.setCaught(species, false);
      }
    }

    setModified(true);
    forceUpdate({});
  };

  // Toggle caught status
  const toggleCaught = (species: number) => {
    if (!save) return;

    if (save instanceof SAV1) {
      const current = save.getCaught(species);
      save.setCaught(species, !current);
    } else if (save instanceof SAV2) {
      const current = save.getCaught(species);
      save.setCaught(species, !current);
    } else if (save instanceof SAV3) {
      const current = save.getCaught(species);
      save.setCaught(species, !current);
    }

    setModified(true);
    forceUpdate({});
  };

  // Bulk operations
  const setAllSeen = () => {
    if (!save) return;
    for (let i = 1; i <= maxSpecies; i++) {
      if (save instanceof SAV1) save.setSeen(i, true);
      else if (save instanceof SAV2) save.setSeen(i, true);
      else if (save instanceof SAV3) save.setSeen(i, true);
    }
    setModified(true);
    forceUpdate({});
  };

  const setAllCaught = () => {
    if (!save) return;
    for (let i = 1; i <= maxSpecies; i++) {
      if (save instanceof SAV1) save.setCaught(i, true);
      else if (save instanceof SAV2) save.setCaught(i, true);
      else if (save instanceof SAV3) save.setCaught(i, true);
    }
    setModified(true);
    forceUpdate({});
  };

  const clearAll = () => {
    if (!save) return;
    for (let i = 1; i <= maxSpecies; i++) {
      if (save instanceof SAV1) {
        save.setSeen(i, false);
        save.setCaught(i, false);
      } else if (save instanceof SAV2) {
        save.setSeen(i, false);
        save.setCaught(i, false);
      } else if (save instanceof SAV3) {
        save.setSeen(i, false);
        save.setCaught(i, false);
      }
    }
    setModified(true);
    forceUpdate({});
  };

  if (!save || generation === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Load a save file to view the Pokedex
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Pokedex</CardTitle>
          <div className="flex gap-2 text-sm">
            <Badge variant="outline">
              <Eye className="h-3 w-3 mr-1" />
              {stats.seen}
            </Badge>
            <Badge variant="default">
              <Check className="h-3 w-3 mr-1" />
              {stats.caught}
            </Badge>
            <Badge variant="secondary">/ {stats.total}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-3 overflow-hidden">
        {/* Search and filters */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search Pokemon..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 h-9"
            />
          </div>
        </div>

        {/* Filter buttons */}
        <div className="flex gap-1 flex-wrap">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            All
          </Button>
          <Button
            variant={filter === "seen" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("seen")}
          >
            Seen Only
          </Button>
          <Button
            variant={filter === "caught" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("caught")}
          >
            Caught
          </Button>
          <Button
            variant={filter === "missing" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("missing")}
          >
            Missing
          </Button>
        </div>

        {/* Bulk actions */}
        <div className="flex gap-1">
          <Button variant="outline" size="sm" onClick={setAllSeen}>
            <Eye className="h-3 w-3 mr-1" />
            See All
          </Button>
          <Button variant="outline" size="sm" onClick={setAllCaught}>
            <Check className="h-3 w-3 mr-1" />
            Catch All
          </Button>
          <Button variant="outline" size="sm" onClick={clearAll}>
            Clear All
          </Button>
        </div>

        {/* Pokemon list */}
        <ScrollArea className="flex-1">
          <div className="space-y-1">
            {filteredEntries.map((entry) => (
              <div
                key={entry.species}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50"
              >
                <PokemonSprite species={entry.species} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-8">
                      #{entry.species.toString().padStart(3, "0")}
                    </span>
                    <span className="text-sm font-medium truncate">
                      {entry.name}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-7 w-7 p-0 ${entry.seen ? "text-blue-500" : "text-muted-foreground"}`}
                    onClick={() => toggleSeen(entry.species)}
                    title={entry.seen ? "Mark as not seen" : "Mark as seen"}
                  >
                    {entry.seen ? (
                      <CheckSquare className="h-4 w-4" />
                    ) : (
                      <Square className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-7 w-7 p-0 ${entry.caught ? "text-green-500" : "text-muted-foreground"}`}
                    onClick={() => toggleCaught(entry.species)}
                    title={
                      entry.caught ? "Mark as not caught" : "Mark as caught"
                    }
                  >
                    {entry.caught ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
            {filteredEntries.length === 0 && (
              <div className="py-8 text-center text-muted-foreground text-sm">
                No Pokemon match your search
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
