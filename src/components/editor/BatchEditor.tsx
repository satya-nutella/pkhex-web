"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { useSaveStore } from "@/stores/saveStore";
import { SAV1 } from "@/lib/pkhex-core/saves/SAV1";
import { SAV2 } from "@/lib/pkhex-core/saves/SAV2";
import { SAV3 } from "@/lib/pkhex-core/saves/SAV3";
import { PK1 } from "@/lib/pkhex-core/pkm/PK1";
import { PK2 } from "@/lib/pkhex-core/pkm/PK2";
import { PK3 } from "@/lib/pkhex-core/pkm/PK3";
import { Wand2 } from "lucide-react";

type BatchOperation =
  | "set_level"
  | "max_evs"
  | "max_dvs_ivs"
  | "full_pp"
  | "set_shiny"
  | "set_friendship"
  | "heal_all";

interface BatchConfig {
  level?: number;
  maxEVs?: boolean;
  maxDVsIVs?: boolean;
  fullPP?: boolean;
  setShiny?: boolean;
  setFriendship?: number;
  healAll?: boolean;
}

export function BatchEditor() {
  const save = useSaveStore((state) => state.save);
  const generation = useSaveStore((state) => state.generation);
  const selectedBox = useSaveStore((state) => state.selectedBox);
  const setModified = useSaveStore((state) => state.setModified);

  const [open, setOpen] = useState(false);
  const [scope, setScope] = useState<"box" | "all">("box");
  const [config, setConfig] = useState<BatchConfig>({});
  const [operations, setOperations] = useState<Set<BatchOperation>>(new Set());

  if (!save || generation === 0) {
    return null;
  }

  const toggleOperation = (op: BatchOperation) => {
    const newOps = new Set(operations);
    if (newOps.has(op)) {
      newOps.delete(op);
    } else {
      newOps.add(op);
    }
    setOperations(newOps);
  };

  const applyToBox = (box: number) => {
    const slotCount = save.boxSlotCount;
    let modified = false;

    for (let slot = 0; slot < slotCount; slot++) {
      const pk = save.getBoxPokemon(box, slot);
      if (!pk || pk.isEmpty) continue;

      let pkMod = false;

      // Apply operations
      if (operations.has("set_level") && config.level) {
        pk.level = config.level;
        pkMod = true;
      }

      if (operations.has("max_evs")) {
        if (pk instanceof PK1) {
          pk.evHP = 65535;
          pk.evATK = 65535;
          pk.evDEF = 65535;
          pk.evSPE = 65535;
          pk.evSPC = 65535;
        } else if (pk instanceof PK2) {
          pk.evHP = 65535;
          pk.evATK = 65535;
          pk.evDEF = 65535;
          pk.evSPE = 65535;
          pk.evSPC = 65535;
        } else if (pk instanceof PK3) {
          // Gen 3 has 510 total limit, distribute 252/252/4
          pk.evHP = 252;
          pk.evATK = 252;
          pk.evDEF = 4;
          pk.evSPA = 0;
          pk.evSPD = 0;
          pk.evSPE = 0;
        }
        pkMod = true;
      }

      if (operations.has("max_dvs_ivs")) {
        if (pk instanceof PK1) {
          pk.dvATK = 15;
          pk.dvDEF = 15;
          pk.dvSPE = 15;
          pk.dvSPC = 15;
        } else if (pk instanceof PK2) {
          pk.dvATK = 15;
          pk.dvDEF = 15;
          pk.dvSPE = 15;
          pk.dvSPC = 15;
        } else if (pk instanceof PK3) {
          // All IVs at 31 = 0x1F1F1F1F1F1F in binary packed as (HP<<0)|(ATK<<5)|(DEF<<10)|(SPE<<15)|(SPA<<20)|(SPD<<25)
          pk.iv32 = 0x3fffffff; // All 31s
        }
        pkMod = true;
      }

      if (operations.has("full_pp")) {
        for (let i = 0; i < 4; i++) {
          const move = pk.getMove(i);
          if (move > 0) {
            // Get base PP and calculate max with PP Ups
            const ppUps = pk.getPPUps(i);
            const basePP = pk.getPP(i);
            // Approximate max PP (would need actual move data)
            pk.setPP(i, basePP > 0 ? 64 : 0);
          }
        }
        pkMod = true;
      }

      if (
        operations.has("set_friendship") &&
        config.setFriendship !== undefined
      ) {
        if (pk instanceof PK2 || pk instanceof PK3) {
          pk.friendship = config.setFriendship;
          pkMod = true;
        }
      }

      if (operations.has("heal_all")) {
        pk.currentHP = pk.statHPMax;
        pk.statusCondition = 0;
        pkMod = true;
      }

      // Save back if modified
      if (pkMod) {
        if ("calculateStats" in pk) {
          pk.calculateStats();
        }
        if (save instanceof SAV1 && pk instanceof PK1) {
          save.setBoxPokemon(box, slot, pk);
        } else if (save instanceof SAV2 && pk instanceof PK2) {
          save.setBoxPokemon(box, slot, pk);
        } else if (save instanceof SAV3 && pk instanceof PK3) {
          save.setBoxPokemon(box, slot, pk);
        }
        modified = true;
      }
    }

    return modified;
  };

  const handleApply = () => {
    if (operations.size === 0) return;

    let modified = false;

    if (scope === "box") {
      modified = applyToBox(selectedBox);
    } else {
      // Apply to all boxes
      for (let box = 0; box < save.boxCount; box++) {
        if (applyToBox(box)) {
          modified = true;
        }
      }
    }

    if (modified) {
      setModified(true);
    }

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          <Wand2 className="h-4 w-4" />
          Batch Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Batch Edit Pokemon</DialogTitle>
          <DialogDescription>
            Apply changes to multiple Pokemon at once
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Scope selection */}
          <div className="space-y-2">
            <Label>Apply to</Label>
            <Select
              value={scope}
              onValueChange={(v: "box" | "all") => setScope(v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="box">
                  Current Box ({selectedBox + 1})
                </SelectItem>
                <SelectItem value="all">All Boxes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Operations */}
          <div className="space-y-3">
            <Label>Operations</Label>

            {/* Set Level */}
            <div className="flex items-center gap-2">
              <Checkbox
                id="set_level"
                checked={operations.has("set_level")}
                onCheckedChange={() => toggleOperation("set_level")}
              />
              <Label htmlFor="set_level" className="flex-1">
                Set Level
              </Label>
              {operations.has("set_level") && (
                <Input
                  type="number"
                  min={1}
                  max={100}
                  value={config.level || 100}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      level: parseInt(e.target.value) || 100,
                    })
                  }
                  className="w-20 h-8"
                />
              )}
            </div>

            {/* Max DVs/IVs */}
            <div className="flex items-center gap-2">
              <Checkbox
                id="max_dvs_ivs"
                checked={operations.has("max_dvs_ivs")}
                onCheckedChange={() => toggleOperation("max_dvs_ivs")}
              />
              <Label htmlFor="max_dvs_ivs">
                Max {generation <= 2 ? "DVs (15)" : "IVs (31)"}
              </Label>
            </div>

            {/* Max EVs */}
            <div className="flex items-center gap-2">
              <Checkbox
                id="max_evs"
                checked={operations.has("max_evs")}
                onCheckedChange={() => toggleOperation("max_evs")}
              />
              <Label htmlFor="max_evs">
                Max EVs {generation <= 2 ? "(65535)" : "(252/252/4)"}
              </Label>
            </div>

            {/* Full PP */}
            <div className="flex items-center gap-2">
              <Checkbox
                id="full_pp"
                checked={operations.has("full_pp")}
                onCheckedChange={() => toggleOperation("full_pp")}
              />
              <Label htmlFor="full_pp">Restore PP</Label>
            </div>

            {/* Heal All */}
            <div className="flex items-center gap-2">
              <Checkbox
                id="heal_all"
                checked={operations.has("heal_all")}
                onCheckedChange={() => toggleOperation("heal_all")}
              />
              <Label htmlFor="heal_all">
                Heal All (Full HP + Clear Status)
              </Label>
            </div>

            {/* Set Friendship (Gen 2-3) */}
            {generation >= 2 && (
              <div className="flex items-center gap-2">
                <Checkbox
                  id="set_friendship"
                  checked={operations.has("set_friendship")}
                  onCheckedChange={() => toggleOperation("set_friendship")}
                />
                <Label htmlFor="set_friendship" className="flex-1">
                  Set Friendship
                </Label>
                {operations.has("set_friendship") && (
                  <Input
                    type="number"
                    min={0}
                    max={255}
                    value={config.setFriendship ?? 255}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        setFriendship: parseInt(e.target.value) || 255,
                      })
                    }
                    className="w-20 h-8"
                  />
                )}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleApply} disabled={operations.size === 0}>
            Apply to {scope === "box" ? "Box" : "All Boxes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
