"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSaveStore } from "@/stores/saveStore";
import { PokemonSlot, DragData } from "@/components/pokemon/PokemonSlot";
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  Clipboard,
  Trash2,
  Plus,
} from "lucide-react";
import { SPECIES_EN, MAX_SPECIES_ID_3 } from "@/lib/data/species";

export function BoxViewer() {
  const save = useSaveStore((state) => state.save);
  const generation = useSaveStore((state) => state.generation);
  const selectedBox = useSaveStore((state) => state.selectedBox);
  const selectedSlot = useSaveStore((state) => state.selectedSlot);
  const selectBox = useSaveStore((state) => state.selectBox);
  const selectBoxSlot = useSaveStore((state) => state.selectBoxSlot);
  const clipboard = useSaveStore((state) => state.clipboard);
  const copyPokemon = useSaveStore((state) => state.copyPokemon);
  const pastePokemon = useSaveStore((state) => state.pastePokemon);
  const deletePokemon = useSaveStore((state) => state.deletePokemon);
  const selectedPokemon = useSaveStore((state) => state.selectedPokemon);
  const swapPokemon = useSaveStore((state) => state.swapPokemon);
  const addNewPokemon = useSaveStore((state) => state.addNewPokemon);

  // Add Pokemon dialog state
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newSpecies, setNewSpecies] = useState<string>("");
  const [newLevel, setNewLevel] = useState<number>(5);
  const [, forceUpdate] = useState({});

  if (!save) {
    return null;
  }

  const boxCount = save.boxCount;
  const slotCount = save.boxSlotCount;

  // Get Pokemon for current box
  const boxPokemon = [];
  for (let i = 0; i < slotCount; i++) {
    boxPokemon.push(save.getBoxPokemon(selectedBox, i));
  }

  // Calculate grid columns based on slot count
  // Int: 20 Pokemon = 5x4 grid, JPN: 30 Pokemon = 5x6 grid
  const cols = slotCount === 30 ? 6 : 5;

  const handlePrevBox = () => {
    const newBox = selectedBox === 0 ? boxCount - 1 : selectedBox - 1;
    selectBox(newBox);
  };

  const handleNextBox = () => {
    const newBox = selectedBox === boxCount - 1 ? 0 : selectedBox + 1;
    selectBox(newBox);
  };

  const handleSlotClick = (slot: number) => {
    if (selectedSlot === slot) {
      selectBoxSlot(null); // Deselect
    } else {
      selectBoxSlot(slot);
    }
  };

  const handleDrop = (toSlot: number) => (fromData: DragData) => {
    // Don't swap with self
    if (fromData.box === selectedBox && fromData.slot === toSlot) return;
    swapPokemon(fromData.box, fromData.slot, selectedBox, toSlot);
  };

  const handleAddPokemon = () => {
    if (!newSpecies) return;
    const speciesId = parseInt(newSpecies);
    if (isNaN(speciesId) || speciesId <= 0) return;

    const success = addNewPokemon(speciesId, newLevel);
    if (success) {
      setAddDialogOpen(false);
      setNewSpecies("");
      setNewLevel(5);
      forceUpdate({});
    }
  };

  // Get species list based on generation
  const maxSpecies =
    generation === 1 ? 151 : generation === 2 ? 251 : MAX_SPECIES_ID_3;
  const speciesList = SPECIES_EN.slice(1, maxSpecies + 1).map((name, i) => ({
    id: i + 1,
    name,
  }));

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrevBox}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <CardTitle className="text-base">
            Box {selectedBox + 1} / {boxCount}
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNextBox}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Box slots grid */}
        <div
          className="grid gap-1"
          style={{
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          }}
        >
          {boxPokemon.map((pk, i) => (
            <PokemonSlot
              key={i}
              pokemon={pk}
              selected={selectedSlot === i}
              onClick={() => handleSlotClick(i)}
              size="sm"
              draggable={true}
              dragData={{ box: selectedBox, slot: i }}
              onDrop={handleDrop(i)}
            />
          ))}
        </div>

        {/* Clipboard actions */}
        {selectedSlot !== null && (
          <div className="flex gap-2 justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={copyPokemon}
              disabled={!selectedPokemon}
              title="Copy Pokemon"
            >
              <Copy className="h-4 w-4 mr-1" />
              Copy
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={pastePokemon}
              disabled={!clipboard}
              title="Paste Pokemon"
            >
              <Clipboard className="h-4 w-4 mr-1" />
              Paste
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={deletePokemon}
              disabled={!selectedPokemon}
              title="Delete Pokemon"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        )}

        {/* Clipboard indicator */}
        {clipboard && (
          <div className="text-xs text-center text-muted-foreground">
            Clipboard: {clipboard.nickname || clipboard.speciesName}
          </div>
        )}

        {/* Add Pokemon button */}
        {generation === 3 && (
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="w-full">
                <Plus className="h-4 w-4 mr-1" />
                Add Pokemon
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Pokemon</DialogTitle>
                <DialogDescription>
                  Create a new Pokemon and add it to the current box.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="species">Species</Label>
                  <Select value={newSpecies} onValueChange={setNewSpecies}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a species..." />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {speciesList.map((s) => (
                        <SelectItem key={s.id} value={s.id.toString()}>
                          #{s.id.toString().padStart(3, "0")} {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="level">Level</Label>
                  <Input
                    id="level"
                    type="number"
                    min={1}
                    max={100}
                    value={newLevel}
                    onChange={(e) => setNewLevel(parseInt(e.target.value) || 5)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddPokemon} disabled={!newSpecies}>
                  Add Pokemon
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Box navigation buttons */}
        <div className="flex flex-wrap gap-1 justify-center">
          {Array.from({ length: boxCount }, (_, i) => (
            <Button
              key={i}
              variant={selectedBox === i ? "default" : "outline"}
              size="sm"
              className="w-8 h-8 p-0 text-xs"
              onClick={() => selectBox(i)}
            >
              {i + 1}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
