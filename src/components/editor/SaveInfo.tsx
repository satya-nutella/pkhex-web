"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSaveStore } from "@/stores/saveStore";

export function SaveInfo() {
  const save = useSaveStore((state) => state.save);
  const fileName = useSaveStore((state) => state.fileName);
  const isModified = useSaveStore((state) => state.isModified);

  if (!save) {
    return null;
  }

  const summary = save.getSummary();

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Save Info</CardTitle>
          <div className="flex gap-2">
            <Badge variant={summary.checksumValid ? "default" : "destructive"}>
              {summary.checksumValid ? "Valid" : "Invalid Checksum"}
            </Badge>
            {isModified && <Badge variant="secondary">Modified</Badge>}
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-3">
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div className="text-muted-foreground">File</div>
          <div className="font-mono truncate">{fileName}</div>

          <div className="text-muted-foreground">Trainer</div>
          <div>{summary.trainerName}</div>

          <div className="text-muted-foreground">ID</div>
          <div className="font-mono">
            {summary.trainerId.toString().padStart(5, "0")}
          </div>

          <div className="text-muted-foreground">Version</div>
          <div>{summary.version}</div>

          <div className="text-muted-foreground">Play Time</div>
          <div>{summary.playTime}</div>

          <div className="text-muted-foreground">Badges</div>
          <div>{summary.badges} / 8</div>

          <div className="text-muted-foreground">Money</div>
          <div>₽{summary.money.toLocaleString()}</div>

          <div className="text-muted-foreground">Pokedex</div>
          <div>
            {summary.pokedexCaught} caught / {summary.pokedexSeen} seen
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
