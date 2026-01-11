"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSaveStore } from "@/stores/saveStore";
import { SAV1 } from "@/lib/pkhex-core/saves/SAV1";
import { SAV2 } from "@/lib/pkhex-core/saves/SAV2";
import { SAV3 } from "@/lib/pkhex-core/saves/SAV3";

type SaveFile = SAV1 | SAV2 | SAV3;

export function TrainerEditor() {
  const save = useSaveStore((state) => state.save);
  const generation = useSaveStore((state) => state.generation);
  const setModified = useSaveStore((state) => state.setModified);

  // Local state for editing
  const [trainerName, setTrainerName] = useState("");
  const [trainerId, setTrainerId] = useState(0);
  const [money, setMoney] = useState(0);
  const [hasChanges, setHasChanges] = useState(false);

  // Sync local state with save
  useEffect(() => {
    if (save) {
      setTrainerName(save.trainerName);
      setTrainerId(save.tid16);
      setMoney(save.money);
      setHasChanges(false);
    }
  }, [save]);

  if (!save) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-32 text-muted-foreground">
          Load a save file to edit trainer info
        </CardContent>
      </Card>
    );
  }

  const summary = save.getSummary();

  const handleSave = () => {
    if (!save) return;

    save.trainerName = trainerName;
    save.tid16 = trainerId;
    save.money = money;

    setModified(true);
    setHasChanges(false);
  };

  const maxMoney =
    generation === 1 ? 999999 : generation === 2 ? 999999 : 999999;
  const maxNameLength = generation === 1 ? 7 : generation === 2 ? 7 : 7;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Trainer Info</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline">Gen {generation}</Badge>
            <Badge variant="secondary">{summary.version}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Name */}
        <div className="space-y-2">
          <Label>Trainer Name</Label>
          <Input
            value={trainerName}
            onChange={(e) => {
              setTrainerName(
                e.target.value.toUpperCase().slice(0, maxNameLength),
              );
              setHasChanges(true);
            }}
            maxLength={maxNameLength}
            placeholder="RED"
          />
        </div>

        {/* Trainer ID */}
        <div className="space-y-2">
          <Label>Trainer ID</Label>
          <Input
            type="number"
            min={0}
            max={65535}
            value={trainerId}
            onChange={(e) => {
              setTrainerId(
                Math.min(65535, Math.max(0, parseInt(e.target.value) || 0)),
              );
              setHasChanges(true);
            }}
          />
        </div>

        {/* Secret ID (Gen 3+) */}
        {generation >= 3 && save instanceof SAV3 && (
          <div className="space-y-2">
            <Label>Secret ID</Label>
            <Input
              type="number"
              min={0}
              max={65535}
              value={save.sid16}
              disabled
            />
            <p className="text-xs text-muted-foreground">Read-only for now</p>
          </div>
        )}

        <Separator />

        {/* Money */}
        <div className="space-y-2">
          <Label>Money</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              $
            </span>
            <Input
              type="number"
              min={0}
              max={maxMoney}
              value={money}
              onChange={(e) => {
                setMoney(
                  Math.min(
                    maxMoney,
                    Math.max(0, parseInt(e.target.value) || 0),
                  ),
                );
                setHasChanges(true);
              }}
              className="pl-7"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setMoney(maxMoney);
                setHasChanges(true);
              }}
            >
              Max Money
            </Button>
          </div>
        </div>

        <Separator />

        {/* Read-only info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Play Time:</span>
            <span className="ml-2 font-mono">{summary.playTime}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Badges:</span>
            <span className="ml-2 font-mono">{summary.badges}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Party:</span>
            <span className="ml-2 font-mono">{summary.partyCount}/6</span>
          </div>
          <div>
            <span className="text-muted-foreground">Pokedex:</span>
            <span className="ml-2 font-mono">
              {summary.pokedexCaught}/{summary.pokedexSeen}
            </span>
          </div>
        </div>

        {/* Checksum status */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Checksum:</span>
          <Badge variant={summary.checksumValid ? "default" : "destructive"}>
            {summary.checksumValid ? "Valid" : "Invalid"}
          </Badge>
        </div>

        {/* Save Button */}
        {hasChanges && (
          <>
            <Separator />
            <Button className="w-full" onClick={handleSave}>
              Apply Changes
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
