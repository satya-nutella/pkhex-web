"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSaveStore } from "@/stores/saveStore";
import { SaveInfo } from "./SaveInfo";
import { TrainerEditor } from "./TrainerEditor";
import { PartyViewer } from "./PartyViewer";
import { BoxViewer } from "./BoxViewer";
import { PokemonEditor } from "./PokemonEditor";
import { PokedexEditor } from "./PokedexEditor";
import { BatchEditor } from "./BatchEditor";
import { BagEditor } from "./BagEditor";

export function SaveEditor() {
  const save = useSaveStore((state) => state.save);
  const fileName = useSaveStore((state) => state.fileName);
  const isModified = useSaveStore((state) => state.isModified);
  const closeSave = useSaveStore((state) => state.closeSave);
  const exportSave = useSaveStore((state) => state.exportSave);

  if (!save) {
    return null;
  }

  const handleExport = () => {
    const data = exportSave();
    if (!data) return;

    // Create download link
    const blob = new Blob([new Uint8Array(data)], {
      type: "application/octet-stream",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName || "save.sav";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Header with actions */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Save Editor</h2>
        <div className="flex gap-2">
          <BatchEditor />
          <Button variant="outline" onClick={closeSave}>
            Close
          </Button>
          <Button onClick={handleExport} disabled={!isModified}>
            Export Save
          </Button>
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left column - Trainer and Party */}
        <div className="space-y-4">
          <Tabs defaultValue="summary" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="trainer">Trainer</TabsTrigger>
              <TabsTrigger value="pokedex">Pokedex</TabsTrigger>
              <TabsTrigger value="bag">Bag</TabsTrigger>
            </TabsList>
            <TabsContent value="summary">
              <SaveInfo />
            </TabsContent>
            <TabsContent value="trainer">
              <TrainerEditor />
            </TabsContent>
            <TabsContent value="pokedex" className="h-[400px]">
              <PokedexEditor />
            </TabsContent>
            <TabsContent value="bag" className="h-[400px]">
              <BagEditor />
            </TabsContent>
          </Tabs>
          <PartyViewer />
        </div>

        {/* Middle column - Box Viewer */}
        <div>
          <BoxViewer />
        </div>

        {/* Right column - Pokemon Editor */}
        <div>
          <PokemonEditor />
        </div>
      </div>
    </div>
  );
}
