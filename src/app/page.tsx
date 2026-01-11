"use client";

import { FileDropzone } from "@/components/common/FileDropzone";
import { SaveEditor } from "@/components/editor/SaveEditor";
import { useSaveStore } from "@/stores/saveStore";
import { Button } from "@/components/ui/button";

export default function Home() {
  const save = useSaveStore((state) => state.save);
  const loadSave = useSaveStore((state) => state.loadSave);

  const handleFileLoad = (data: Uint8Array, fileName: string) => {
    const success = loadSave(data, fileName);
    if (!success) {
      alert(
        "Failed to load save file. Make sure it's a valid Gen 1-2 save file (.sav)",
      );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎮</span>
              <div>
                <h1 className="text-xl font-bold">PKHeX Web</h1>
                <p className="text-sm text-muted-foreground">
                  Pokemon Save File Editor
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <a
                  href="https://github.com/kwsch/PKHeX"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Original PKHeX
                </a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {!save ? (
          <div className="max-w-xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold mb-2">
                Welcome to PKHeX Web
              </h2>
              <p className="text-muted-foreground">
                A web-based Pokemon save file editor. Load your save file to get
                started.
              </p>
            </div>

            <FileDropzone onFileLoad={handleFileLoad} />

            <div className="mt-8 text-center text-sm text-muted-foreground">
              <p className="font-medium mb-2">Supported Games:</p>
              <div className="flex flex-wrap justify-center gap-2">
                <span className="px-2 py-1 bg-muted rounded">Pokemon Red</span>
                <span className="px-2 py-1 bg-muted rounded">Pokemon Blue</span>
                <span className="px-2 py-1 bg-muted rounded">
                  Pokemon Yellow
                </span>
                <span className="px-2 py-1 bg-muted rounded">Pokemon Gold</span>
                <span className="px-2 py-1 bg-muted rounded">
                  Pokemon Silver
                </span>
                <span className="px-2 py-1 bg-muted rounded">
                  Pokemon Crystal
                </span>
              </div>
              <p className="mt-4 text-xs">
                More games coming soon: Ruby, Sapphire, Emerald, FireRed,
                LeafGreen
              </p>
            </div>
          </div>
        ) : (
          <SaveEditor />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p>
              PKHeX Web - Based on{" "}
              <a
                href="https://github.com/kwsch/PKHeX"
                className="underline hover:text-foreground"
                target="_blank"
                rel="noopener noreferrer"
              >
                PKHeX
              </a>
            </p>
            <p>
              All Pokemon data belongs to Nintendo/Game Freak/The Pokemon
              Company
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
