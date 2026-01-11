"use client";

import React, { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { PokemonSprite } from "./PokemonSprite";
import { getSpeciesName } from "@/lib/data/species";
import {
  getEvolutionChain,
  getEvolutionsFrom,
  getEvolutionDescription,
} from "@/lib/data/evolutions";
import { ArrowRight, ArrowDown } from "lucide-react";

interface EvolutionChainViewerProps {
  species: number;
  generation: number;
  compact?: boolean;
}

export function EvolutionChainViewer({
  species,
  generation,
  compact = false,
}: EvolutionChainViewerProps) {
  // Get the evolution chain
  const chain = useMemo(() => {
    return getEvolutionChain(species, generation);
  }, [species, generation]);

  if (chain.length <= 1) {
    return (
      <div className="text-sm text-muted-foreground">
        This Pokemon does not evolve.
      </div>
    );
  }

  if (compact) {
    // Horizontal compact view
    return (
      <div className="flex items-center gap-1 flex-wrap">
        {chain.map((sp, i) => (
          <div key={sp} className="flex items-center gap-1">
            <div
              className={`flex flex-col items-center ${
                sp === species ? "ring-2 ring-primary rounded-lg p-1" : ""
              }`}
            >
              <PokemonSprite species={sp} size="sm" />
              <span className="text-xs">{getSpeciesName(sp)}</span>
            </div>
            {i < chain.length - 1 && (
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        ))}
      </div>
    );
  }

  // Build tree structure for split evolutions
  const renderEvolutionNode = (
    currentSpecies: number,
    depth: number = 0,
  ): React.ReactNode => {
    const evolutions = getEvolutionsFrom(currentSpecies, generation);
    const isCurrentPokemon = currentSpecies === species;

    return (
      <div key={currentSpecies} className="flex flex-col items-center">
        <div
          className={`flex flex-col items-center p-2 rounded-lg ${
            isCurrentPokemon ? "ring-2 ring-primary bg-primary/10" : ""
          }`}
        >
          <PokemonSprite species={currentSpecies} size="md" />
          <span className="text-sm font-medium mt-1">
            {getSpeciesName(currentSpecies)}
          </span>
          <span className="text-xs text-muted-foreground">
            #{currentSpecies.toString().padStart(3, "0")}
          </span>
        </div>

        {evolutions.length > 0 && (
          <>
            <ArrowDown className="h-4 w-4 text-muted-foreground my-1" />
            <div
              className={`flex gap-4 ${evolutions.length > 1 ? "border-t pt-2" : ""}`}
            >
              {evolutions.map((evo) => (
                <div key={evo.to} className="flex flex-col items-center">
                  <Badge variant="outline" className="text-xs mb-1">
                    {getEvolutionDescription(evo)}
                  </Badge>
                  {renderEvolutionNode(evo.to, depth + 1)}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  // Find base form
  let base = chain[0];

  return <div className="flex justify-center">{renderEvolutionNode(base)}</div>;
}
