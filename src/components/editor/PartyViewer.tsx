"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PokemonSlot } from "@/components/pokemon/PokemonSlot";
import { useSaveStore } from "@/stores/saveStore";

export function PartyViewer() {
  const save = useSaveStore((state) => state.save);
  const selectedPartySlot = useSaveStore((state) => state.selectedPartySlot);
  const selectPartySlot = useSaveStore((state) => state.selectPartySlot);

  if (!save) {
    return null;
  }

  // Get party Pokemon
  const party = [];
  for (let i = 0; i < 6; i++) {
    party.push(save.getPartyPokemon(i));
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Party ({save.partyCount}/6)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 flex-wrap">
          {party.map((pokemon, index) => (
            <PokemonSlot
              key={index}
              pokemon={pokemon}
              selected={selectedPartySlot === index}
              onClick={() =>
                selectPartySlot(selectedPartySlot === index ? null : index)
              }
              size="md"
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
