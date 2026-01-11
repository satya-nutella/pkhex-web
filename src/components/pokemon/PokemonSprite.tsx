"use client";

import { useState } from "react";

interface PokemonSpriteProps {
  species: number; // National dex number (1-151 for Gen 1)
  shiny?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

// Maximum valid species ID (Gen 9 max, but PokeAPI goes up to ~1025)
const MAX_VALID_SPECIES = 1025;

/**
 * Pokemon sprite component using PokeAPI sprites.
 * Falls back to a placeholder if the sprite fails to load.
 */
export function PokemonSprite({
  species,
  shiny = false,
  size = "md",
  className = "",
}: PokemonSpriteProps) {
  const [hasError, setHasError] = useState(false);

  // Size mappings
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-24 h-24",
  };

  // PokeAPI sprite URLs
  // https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{id}.png
  // https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/{id}.png
  const getSpriteUrl = (speciesId: number, isShiny: boolean): string => {
    if (speciesId <= 0 || speciesId > MAX_VALID_SPECIES) return "";
    const base =
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon";
    return isShiny
      ? `${base}/shiny/${speciesId}.png`
      : `${base}/${speciesId}.png`;
  };

  if (species <= 0 || species > MAX_VALID_SPECIES || hasError) {
    // Placeholder for empty slot or failed load
    return (
      <div
        className={`${sizeClasses[size]} ${className} bg-muted rounded-md flex items-center justify-center text-muted-foreground`}
      >
        <span className="text-xs">?</span>
      </div>
    );
  }

  return (
    <img
      src={getSpriteUrl(species, shiny)}
      alt={`Pokemon #${species}`}
      className={`${sizeClasses[size]} ${className} object-contain pixelated`}
      onError={() => setHasError(true)}
      loading="lazy"
    />
  );
}

/**
 * Get the sprite URL for a Pokemon (for use outside the component).
 */
export function getPokemonSpriteUrl(
  species: number,
  shiny: boolean = false,
): string {
  if (species <= 0) return "";
  const base =
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon";
  return shiny ? `${base}/shiny/${species}.png` : `${base}/${species}.png`;
}
