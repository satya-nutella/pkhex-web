"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { IPokemon } from "@/types/pokemon";
import { PokemonSprite } from "./PokemonSprite";

export interface DragData {
  box: number;
  slot: number;
  isParty?: boolean;
}

interface PokemonSlotProps {
  pokemon: IPokemon | null;
  selected?: boolean;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
  // Drag/drop props
  draggable?: boolean;
  dragData?: DragData;
  onDrop?: (fromData: DragData) => void;
}

export function PokemonSlot({
  pokemon,
  selected = false,
  onClick,
  size = "md",
  draggable = false,
  dragData,
  onDrop,
}: PokemonSlotProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-20 h-20",
  };

  const isEmpty = !pokemon || pokemon.isEmpty || !pokemon.isValid;

  const handleDragStart = (e: React.DragEvent) => {
    if (!draggable || !dragData) return;
    e.dataTransfer.setData("application/json", JSON.stringify(dragData));
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    if (!onDrop) return;

    try {
      const fromData = JSON.parse(
        e.dataTransfer.getData("application/json"),
      ) as DragData;
      onDrop(fromData);
    } catch {
      // Invalid drag data
    }
  };

  return (
    <button
      onClick={onClick}
      draggable={draggable && !isEmpty}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "rounded-lg border-2 flex flex-col items-center justify-center transition-all",
        sizeClasses[size],
        selected
          ? "border-primary bg-primary/10"
          : "border-border hover:border-primary/50",
        isEmpty ? "bg-muted/50" : "bg-card",
        isDragOver && "border-primary bg-primary/20",
        draggable && !isEmpty && "cursor-grab active:cursor-grabbing",
      )}
    >
      {!isEmpty && pokemon && (
        <>
          <PokemonSprite
            species={pokemon.species}
            size={size === "lg" ? "md" : "sm"}
          />
          {size !== "sm" && (
            <div className="text-xs truncate w-full text-center px-1">
              {pokemon.nickname || pokemon.speciesName}
            </div>
          )}
        </>
      )}
      {isEmpty && <div className="text-muted-foreground text-xs">Empty</div>}
    </button>
  );
}
