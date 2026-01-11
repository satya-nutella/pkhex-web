"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSaveStore } from "@/stores/saveStore";
import { getTypeName } from "@/lib/data/types";
import {
  SPECIES_EN,
  MAX_SPECIES_ID_1,
  MAX_SPECIES_ID_2,
  MAX_SPECIES_ID_3,
} from "@/lib/data/species";
import { MOVES_EN, getBasePP } from "@/lib/data/moves";
import { getNatureDescription, NATURES } from "@/lib/data/natures";
import { getItemName, getItemList } from "@/lib/data/items";
import {
  validateMoves,
  getLearnableMoves,
  LEARNSETS_GEN1,
} from "@/lib/data/learnsets";
import { LOCATIONS_GEN3, getLocationName } from "@/lib/data/locations";
import { PokemonSprite } from "@/components/pokemon/PokemonSprite";
import { EvolutionChainViewer } from "@/components/pokemon/EvolutionChainViewer";
import { LegalityBadge } from "@/components/common/LegalityBadge";
import { PK1 } from "@/lib/pkhex-core/pkm/PK1";
import { PK2 } from "@/lib/pkhex-core/pkm/PK2";
import { PK3 } from "@/lib/pkhex-core/pkm/PK3";

// Gen 3 Poke Ball names
const BALL_NAMES = [
  "None", // 0
  "Master Ball", // 1
  "Ultra Ball", // 2
  "Great Ball", // 3
  "Poke Ball", // 4
  "Safari Ball", // 5
  "Net Ball", // 6
  "Dive Ball", // 7
  "Nest Ball", // 8
  "Repeat Ball", // 9
  "Timer Ball", // 10
  "Luxury Ball", // 11
  "Premier Ball", // 12
];

// Union type for Pokemon
type Pokemon = PK1 | PK2 | PK3;

export function PokemonEditor() {
  const selectedPokemon = useSaveStore((state) => state.selectedPokemon);
  const selectedPartySlot = useSaveStore((state) => state.selectedPartySlot);
  const selectedSlot = useSaveStore((state) => state.selectedSlot);
  const generation = useSaveStore((state) => state.generation);
  const updateSelectedPokemon = useSaveStore(
    (state) => state.updateSelectedPokemon,
  );

  // Local state for editing
  const [editPk, setEditPk] = useState<Pokemon | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Sync local state with selected Pokemon
  useEffect(() => {
    if (selectedPokemon) {
      setEditPk(selectedPokemon.clone() as Pokemon);
      setHasChanges(false);
    } else {
      setEditPk(null);
    }
  }, [selectedPokemon]);

  if (!editPk) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-64 text-muted-foreground">
          Select a Pokemon to view and edit
        </CardContent>
      </Card>
    );
  }

  // Editable for both party and box Pokemon in any generation
  const isEditable = selectedPartySlot !== null || selectedSlot !== null;

  // Get max species for current generation
  const maxSpecies =
    generation === 1
      ? MAX_SPECIES_ID_1
      : generation === 2
        ? MAX_SPECIES_ID_2
        : MAX_SPECIES_ID_3;

  // Generic field update that works for all generations
  const updateField = (updater: (clone: Pokemon) => void) => {
    if (!editPk) return;
    const clone = editPk.clone() as Pokemon;
    updater(clone);
    if ("calculateStats" in clone) {
      clone.calculateStats();
    }
    setEditPk(clone);
    setHasChanges(true);
  };

  const updateMove = (index: number, moveId: number) => {
    updateField((clone) => {
      clone.setMove(index, moveId);
      if (moveId > 0) {
        clone.setPP(index, getBasePP(moveId));
      } else {
        clone.setPP(index, 0);
      }
    });
  };

  const handleSave = () => {
    if (!editPk || !isEditable) return;
    updateSelectedPokemon(editPk);
    setHasChanges(false);
  };

  const handleHeal = () => {
    updateField((clone) => {
      clone.heal();
    });
  };

  const handleMaxDVs = () => {
    updateField((clone) => {
      if (clone instanceof PK1 || clone instanceof PK2) {
        clone.dvATK = 15;
        clone.dvDEF = 15;
        clone.dvSPE = 15;
        clone.dvSPC = 15;
      }
    });
  };

  const handleMaxIVs = () => {
    updateField((clone) => {
      if (clone instanceof PK3) {
        // Set all IVs to 31 via iv32
        clone.iv32 = (clone.iv32 & 0xc0000000) | 0x3fffffff;
      }
    });
  };

  const handleMaxEVs = () => {
    updateField((clone) => {
      if (clone instanceof PK1 || clone instanceof PK2) {
        clone.evHP = 65535;
        clone.evATK = 65535;
        clone.evDEF = 65535;
        clone.evSPE = 65535;
        clone.evSPC = 65535;
      } else if (clone instanceof PK3) {
        // Gen 3 has 510 total EV cap, 255 per stat
        clone.evHP = 252;
        clone.evATK = 252;
        clone.evDEF = 6;
        clone.evSPA = 0;
        clone.evSPD = 0;
        clone.evSPE = 0;
      }
    });
  };

  // Determine if Pokemon is shiny
  const isShiny =
    editPk instanceof PK2
      ? editPk.isShiny
      : editPk instanceof PK3
        ? editPk.isShiny
        : false;

  return (
    <Card className="h-full overflow-auto">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <PokemonSprite species={editPk.species} shiny={isShiny} size="md" />
            {editPk.nickname || editPk.speciesName}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              #{editPk.species.toString().padStart(3, "0")}
            </Badge>
            <LegalityBadge pokemon={editPk} showDetails />
            {isShiny && <Badge variant="secondary">Shiny</Badge>}
            {!isEditable && <Badge variant="secondary">View Only</Badge>}
          </div>
        </div>
        {editPk instanceof PK1 && (
          <div className="flex gap-2 mt-1">
            <Badge>{getTypeName(editPk.type1)}</Badge>
            {editPk.type1 !== editPk.type2 && (
              <Badge>{getTypeName(editPk.type2)}</Badge>
            )}
          </div>
        )}
        {editPk instanceof PK3 && (
          <div className="flex gap-2 mt-1">
            <Badge variant="outline">
              {getNatureDescription(editPk.nature)}
            </Badge>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="main" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="main">Main</TabsTrigger>
            <TabsTrigger value="stats">Stats</TabsTrigger>
            <TabsTrigger value="moves">Moves</TabsTrigger>
            <TabsTrigger value="met">Met/OT</TabsTrigger>
          </TabsList>

          {/* Main Tab */}
          <TabsContent value="main" className="space-y-4 mt-4">
            {/* Species */}
            <div className="space-y-2">
              <Label>Species</Label>
              <Select
                value={editPk.species.toString()}
                onValueChange={(v) =>
                  updateField((clone) => {
                    clone.species = parseInt(v);
                  })
                }
                disabled={!isEditable}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {SPECIES_EN.slice(1, maxSpecies + 1).map((name, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                      #{(i + 1).toString().padStart(3, "0")} {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Nickname */}
            <div className="space-y-2">
              <Label>Nickname</Label>
              <Input
                value={editPk.nickname}
                onChange={(e) =>
                  updateField((clone) => {
                    clone.nickname = e.target.value.toUpperCase().slice(0, 10);
                  })
                }
                disabled={!isEditable}
                maxLength={10}
                placeholder={editPk.speciesName}
              />
            </div>

            {/* Level */}
            <div className="space-y-2">
              <Label>Level</Label>
              <Input
                type="number"
                min={1}
                max={100}
                value={editPk.currentLevel}
                onChange={(e) => {
                  const level = Math.min(
                    100,
                    Math.max(1, parseInt(e.target.value) || 1),
                  );
                  updateField((clone) => {
                    clone.level = level;
                  });
                }}
                disabled={!isEditable}
              />
            </div>

            {/* HP */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Current HP</Label>
                <Input
                  type="number"
                  min={0}
                  max={editPk.statHPMax}
                  value={editPk.currentHP}
                  onChange={(e) =>
                    updateField((clone) => {
                      clone.currentHP = Math.min(
                        clone.statHPMax,
                        Math.max(0, parseInt(e.target.value) || 0),
                      );
                    })
                  }
                  disabled={!isEditable}
                />
              </div>
              <div className="space-y-2">
                <Label>Max HP</Label>
                <Input value={editPk.statHPMax} disabled />
              </div>
            </div>

            {/* Held Item (Gen 2+) */}
            {(editPk instanceof PK2 || editPk instanceof PK3) && (
              <div className="space-y-2">
                <Label>Held Item</Label>
                <Select
                  value={editPk.heldItem.toString()}
                  onValueChange={(v) =>
                    updateField((clone) => {
                      if (clone instanceof PK2 || clone instanceof PK3) {
                        clone.heldItem = parseInt(v);
                      }
                    })
                  }
                  disabled={!isEditable}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select item">
                      {getItemName(editPk.heldItem, generation)}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    <SelectItem value="0">---</SelectItem>
                    {getItemList(generation).map((item) => (
                      <SelectItem key={item.id} value={item.id.toString()}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Friendship (Gen 2+) */}
            {(editPk instanceof PK2 || editPk instanceof PK3) && (
              <div className="space-y-2">
                <Label>Friendship</Label>
                <Input
                  type="number"
                  min={0}
                  max={255}
                  value={editPk.friendship}
                  onChange={(e) =>
                    updateField((clone) => {
                      if (clone instanceof PK2 || clone instanceof PK3) {
                        clone.friendship = Math.min(
                          255,
                          Math.max(0, parseInt(e.target.value) || 0),
                        );
                      }
                    })
                  }
                  disabled={!isEditable}
                />
              </div>
            )}

            {/* Experience */}
            <div className="space-y-2">
              <Label>Experience</Label>
              <Input
                type="number"
                min={0}
                max={16777215}
                value={editPk.exp}
                onChange={(e) =>
                  updateField((clone) => {
                    clone.exp = Math.min(
                      16777215,
                      Math.max(0, parseInt(e.target.value) || 0),
                    );
                  })
                }
                disabled={!isEditable}
              />
            </div>

            {/* Evolution Chain */}
            <Separator />
            <div className="space-y-2">
              <Label>Evolution Chain</Label>
              <EvolutionChainViewer
                species={editPk.species}
                generation={generation}
                compact={true}
              />
            </div>
          </TabsContent>

          {/* Stats Tab */}
          <TabsContent value="stats" className="space-y-4 mt-4">
            {/* Quick Actions */}
            {isEditable && (
              <div className="flex gap-2 flex-wrap">
                {generation <= 2 && (
                  <Button variant="outline" size="sm" onClick={handleMaxDVs}>
                    Max DVs
                  </Button>
                )}
                {generation === 3 && (
                  <Button variant="outline" size="sm" onClick={handleMaxIVs}>
                    Max IVs
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={handleMaxEVs}>
                  Max EVs
                </Button>
                <Button variant="outline" size="sm" onClick={handleHeal}>
                  Heal
                </Button>
              </div>
            )}

            {/* Gen 1-2 Stats (DV system) */}
            {(editPk instanceof PK1 || editPk instanceof PK2) && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Stats Overview (DVs)
                </Label>
                <div className="grid grid-cols-4 gap-2 text-xs text-center font-medium text-muted-foreground">
                  <div>Stat</div>
                  <div>Value</div>
                  <div>DV</div>
                  <div>EV</div>
                </div>
                <StatEditRowDV
                  label="HP"
                  value={editPk.statHPMax}
                  dv={editPk.dvHP}
                  ev={editPk.evHP}
                  onEvChange={(v) =>
                    updateField((clone) => {
                      clone.evHP = v;
                    })
                  }
                  dvEditable={false}
                  disabled={!isEditable}
                />
                <StatEditRowDV
                  label="ATK"
                  value={editPk.statATK}
                  dv={editPk.dvATK}
                  ev={editPk.evATK}
                  onDvChange={(v) =>
                    updateField((clone) => {
                      if (clone instanceof PK1 || clone instanceof PK2)
                        clone.dvATK = v;
                    })
                  }
                  onEvChange={(v) =>
                    updateField((clone) => {
                      clone.evATK = v;
                    })
                  }
                  disabled={!isEditable}
                />
                <StatEditRowDV
                  label="DEF"
                  value={editPk.statDEF}
                  dv={editPk.dvDEF}
                  ev={editPk.evDEF}
                  onDvChange={(v) =>
                    updateField((clone) => {
                      if (clone instanceof PK1 || clone instanceof PK2)
                        clone.dvDEF = v;
                    })
                  }
                  onEvChange={(v) =>
                    updateField((clone) => {
                      clone.evDEF = v;
                    })
                  }
                  disabled={!isEditable}
                />
                <StatEditRowDV
                  label="SPE"
                  value={editPk.statSPE}
                  dv={editPk.dvSPE}
                  ev={editPk.evSPE}
                  onDvChange={(v) =>
                    updateField((clone) => {
                      if (clone instanceof PK1 || clone instanceof PK2)
                        clone.dvSPE = v;
                    })
                  }
                  onEvChange={(v) =>
                    updateField((clone) => {
                      clone.evSPE = v;
                    })
                  }
                  disabled={!isEditable}
                />
                <StatEditRowDV
                  label="SPC"
                  value={editPk.statSPC}
                  dv={editPk.dvSPC}
                  ev={editPk.evSPC}
                  onDvChange={(v) =>
                    updateField((clone) => {
                      if (clone instanceof PK1 || clone instanceof PK2)
                        clone.dvSPC = v;
                    })
                  }
                  onEvChange={(v) =>
                    updateField((clone) => {
                      clone.evSPC = v;
                    })
                  }
                  disabled={!isEditable}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  HP DV is calculated from other DVs. DVs range 0-15, EVs range
                  0-65535.
                </p>
              </div>
            )}

            {/* Gen 3 Stats (IV system) */}
            {editPk instanceof PK3 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Stats Overview (IVs)
                </Label>
                <div className="grid grid-cols-4 gap-2 text-xs text-center font-medium text-muted-foreground">
                  <div>Stat</div>
                  <div>Value</div>
                  <div>IV</div>
                  <div>EV</div>
                </div>
                <StatEditRowIV
                  label="HP"
                  value={editPk.statHPMax}
                  iv={editPk.ivHP}
                  ev={editPk.evHP}
                  onIvChange={(v) =>
                    updateField((clone) => {
                      if (clone instanceof PK3) clone.ivHP = v;
                    })
                  }
                  onEvChange={(v) =>
                    updateField((clone) => {
                      if (clone instanceof PK3) clone.evHP = v;
                    })
                  }
                  disabled={!isEditable}
                />
                <StatEditRowIV
                  label="ATK"
                  value={editPk.statATK}
                  iv={editPk.ivATK}
                  ev={editPk.evATK}
                  onIvChange={(v) =>
                    updateField((clone) => {
                      if (clone instanceof PK3) clone.ivATK = v;
                    })
                  }
                  onEvChange={(v) =>
                    updateField((clone) => {
                      if (clone instanceof PK3) clone.evATK = v;
                    })
                  }
                  disabled={!isEditable}
                />
                <StatEditRowIV
                  label="DEF"
                  value={editPk.statDEF}
                  iv={editPk.ivDEF}
                  ev={editPk.evDEF}
                  onIvChange={(v) =>
                    updateField((clone) => {
                      if (clone instanceof PK3) clone.ivDEF = v;
                    })
                  }
                  onEvChange={(v) =>
                    updateField((clone) => {
                      if (clone instanceof PK3) clone.evDEF = v;
                    })
                  }
                  disabled={!isEditable}
                />
                <StatEditRowIV
                  label="SPA"
                  value={editPk.statSPA}
                  iv={editPk.ivSPA}
                  ev={editPk.evSPA}
                  onIvChange={(v) =>
                    updateField((clone) => {
                      if (clone instanceof PK3) clone.ivSPA = v;
                    })
                  }
                  onEvChange={(v) =>
                    updateField((clone) => {
                      if (clone instanceof PK3) clone.evSPA = v;
                    })
                  }
                  disabled={!isEditable}
                />
                <StatEditRowIV
                  label="SPD"
                  value={editPk.statSPD}
                  iv={editPk.ivSPD}
                  ev={editPk.evSPD}
                  onIvChange={(v) =>
                    updateField((clone) => {
                      if (clone instanceof PK3) clone.ivSPD = v;
                    })
                  }
                  onEvChange={(v) =>
                    updateField((clone) => {
                      if (clone instanceof PK3) clone.evSPD = v;
                    })
                  }
                  disabled={!isEditable}
                />
                <StatEditRowIV
                  label="SPE"
                  value={editPk.statSPE}
                  iv={editPk.ivSPE}
                  ev={editPk.evSPE}
                  onIvChange={(v) =>
                    updateField((clone) => {
                      if (clone instanceof PK3) clone.ivSPE = v;
                    })
                  }
                  onEvChange={(v) =>
                    updateField((clone) => {
                      if (clone instanceof PK3) clone.evSPE = v;
                    })
                  }
                  disabled={!isEditable}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  IVs range 0-31, EVs range 0-255 (510 total max).
                </p>
              </div>
            )}
          </TabsContent>

          {/* Moves Tab */}
          <TabsContent value="moves" className="space-y-4 mt-4">
            {(() => {
              // Get current moves for validation
              const moves = [
                editPk.getMove(0),
                editPk.getMove(1),
                editPk.getMove(2),
                editPk.getMove(3),
              ];
              const validation = validateMoves(
                editPk.species,
                moves,
                editPk.level,
                generation,
              );
              const learnableMoves =
                generation === 1 && LEARNSETS_GEN1[editPk.species]
                  ? getLearnableMoves(editPk.species, generation)
                  : [];

              return (
                <>
                  {!validation.valid && (
                    <div className="p-2 bg-destructive/10 rounded border border-destructive/30">
                      <span className="text-sm text-destructive">
                        Some moves cannot be legally learned by this Pokemon
                      </span>
                    </div>
                  )}
                  {[0, 1, 2, 3].map((i) => (
                    <MoveEditRow
                      key={i}
                      index={i}
                      moveId={editPk.getMove(i)}
                      pp={editPk.getPP(i)}
                      ppUps={editPk.getPPUps(i)}
                      onMoveChange={(id) => updateMove(i, id)}
                      onPpChange={(pp) =>
                        updateField((clone) => {
                          clone.setPP(i, pp);
                        })
                      }
                      disabled={!isEditable}
                      isIllegal={validation.illegalMoves.includes(
                        editPk.getMove(i),
                      )}
                      learnableMoves={learnableMoves}
                    />
                  ))}
                </>
              );
            })()}
          </TabsContent>

          {/* Met/OT Tab */}
          <TabsContent value="met" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Original Trainer</Label>
              <Input
                value={editPk.ot}
                onChange={(e) =>
                  updateField((clone) => {
                    clone.ot = e.target.value.toUpperCase().slice(0, 7);
                  })
                }
                disabled={!isEditable}
                maxLength={7}
              />
            </div>
            <div className="space-y-2">
              <Label>Trainer ID</Label>
              <Input
                type="number"
                min={0}
                max={65535}
                value={editPk.tid16}
                onChange={(e) =>
                  updateField((clone) => {
                    clone.tid16 = Math.min(
                      65535,
                      Math.max(0, parseInt(e.target.value) || 0),
                    );
                  })
                }
                disabled={!isEditable}
              />
            </div>

            {/* Secret ID (Gen 3) */}
            {editPk instanceof PK3 && (
              <div className="space-y-2">
                <Label>Secret ID</Label>
                <Input
                  type="number"
                  min={0}
                  max={65535}
                  value={editPk.sid16}
                  onChange={(e) =>
                    updateField((clone) => {
                      if (clone instanceof PK3) {
                        clone.sid16 = Math.min(
                          65535,
                          Math.max(0, parseInt(e.target.value) || 0),
                        );
                      }
                    })
                  }
                  disabled={!isEditable}
                />
              </div>
            )}

            {/* PID (Gen 3) */}
            {editPk instanceof PK3 && (
              <div className="space-y-2">
                <Label>Personality ID (PID)</Label>
                <Input
                  value={editPk.pid.toString(16).toUpperCase().padStart(8, "0")}
                  onChange={(e) =>
                    updateField((clone) => {
                      if (clone instanceof PK3) {
                        const pid = parseInt(e.target.value, 16);
                        if (!isNaN(pid)) {
                          clone.pid = pid >>> 0; // Ensure unsigned 32-bit
                        }
                      }
                    })
                  }
                  disabled={!isEditable}
                  maxLength={8}
                />
                <p className="text-xs text-muted-foreground">
                  Determines nature, ability, gender, shininess
                </p>
              </div>
            )}

            {/* Met Level (Gen 3) */}
            {editPk instanceof PK3 && (
              <div className="space-y-2">
                <Label>Met Level</Label>
                <Input
                  type="number"
                  min={1}
                  max={100}
                  value={editPk.metLevel}
                  onChange={(e) =>
                    updateField((clone) => {
                      if (clone instanceof PK3) {
                        clone.metLevel = Math.min(
                          100,
                          Math.max(0, parseInt(e.target.value) || 0),
                        );
                      }
                    })
                  }
                  disabled={!isEditable}
                />
              </div>
            )}

            {/* Met Location (Gen 3) */}
            {editPk instanceof PK3 && (
              <div className="space-y-2">
                <Label>Met Location</Label>
                <Select
                  value={editPk.metLocation.toString()}
                  onValueChange={(v) =>
                    updateField((clone) => {
                      if (clone instanceof PK3) {
                        clone.metLocation = parseInt(v);
                      }
                    })
                  }
                  disabled={!isEditable}
                >
                  <SelectTrigger>
                    <SelectValue>
                      {getLocationName(editPk.metLocation, 3)}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {LOCATIONS_GEN3.map(
                      (name, id) =>
                        name && (
                          <SelectItem key={id} value={id.toString()}>
                            {name}
                          </SelectItem>
                        ),
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Nature (Gen 3) */}
            {editPk instanceof PK3 && (
              <div className="space-y-2">
                <Label>Nature</Label>
                <Select
                  value={editPk.nature.toString()}
                  onValueChange={(v) =>
                    updateField((clone) => {
                      if (clone instanceof PK3) {
                        clone.nature = parseInt(v);
                      }
                    })
                  }
                  disabled={!isEditable}
                >
                  <SelectTrigger>
                    <SelectValue>
                      {NATURES[editPk.nature]?.name ||
                        `Nature ${editPk.nature}`}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {NATURES.map((nature, i) => (
                      <SelectItem key={i} value={i.toString()}>
                        {nature.name}{" "}
                        {nature.increasedStat &&
                          `(+${nature.increasedStat}, -${nature.decreasedStat})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Ball (Gen 3) */}
            {editPk instanceof PK3 && (
              <div className="space-y-2">
                <Label>Ball</Label>
                <Select
                  value={editPk.ball.toString()}
                  onValueChange={(v) =>
                    updateField((clone) => {
                      if (clone instanceof PK3) {
                        clone.ball = parseInt(v);
                      }
                    })
                  }
                  disabled={!isEditable}
                >
                  <SelectTrigger>
                    <SelectValue>
                      {BALL_NAMES[editPk.ball] || `Ball ${editPk.ball}`}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {BALL_NAMES.map((name, i) => (
                      <SelectItem key={i} value={i.toString()}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Shiny Toggle (Gen 3) */}
            {editPk instanceof PK3 && (
              <div className="space-y-2">
                <Separator />
                <div className="flex items-center justify-between">
                  <Label>Shiny Status</Label>
                  <Button
                    variant={editPk.isShiny ? "default" : "outline"}
                    size="sm"
                    onClick={() =>
                      updateField((clone) => {
                        if (clone instanceof PK3) {
                          clone.isShiny = !clone.isShiny;
                        }
                      })
                    }
                    disabled={!isEditable}
                  >
                    {editPk.isShiny ? "Shiny" : "Not Shiny"}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Toggling shiny modifies PID and may change nature
                </p>
              </div>
            )}

            {/* Shiny info for Gen 2 */}
            {editPk instanceof PK2 && (
              <div className="space-y-2">
                <Separator />
                <div className="flex items-center justify-between">
                  <Label>Shiny Status</Label>
                  <Badge variant={editPk.isShiny ? "default" : "secondary"}>
                    {editPk.isShiny ? "Shiny" : "Not Shiny"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Shininess is determined by DVs in Gen 2
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        {isEditable && hasChanges && (
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

function StatEditRowDV({
  label,
  value,
  dv,
  ev,
  onDvChange,
  onEvChange,
  dvEditable = true,
  disabled = false,
}: {
  label: string;
  value: number;
  dv: number;
  ev: number;
  onDvChange?: (v: number) => void;
  onEvChange: (v: number) => void;
  dvEditable?: boolean;
  disabled?: boolean;
}) {
  return (
    <div className="grid grid-cols-4 gap-2 items-center">
      <div className="text-sm font-medium">{label}</div>
      <div className="text-sm font-mono text-center">{value}</div>
      <Input
        type="number"
        min={0}
        max={15}
        value={dv}
        onChange={(e) =>
          onDvChange?.(Math.min(15, Math.max(0, parseInt(e.target.value) || 0)))
        }
        disabled={disabled || !dvEditable}
        className="h-8 text-center text-sm"
      />
      <Input
        type="number"
        min={0}
        max={65535}
        value={ev}
        onChange={(e) =>
          onEvChange(
            Math.min(65535, Math.max(0, parseInt(e.target.value) || 0)),
          )
        }
        disabled={disabled}
        className="h-8 text-center text-sm"
      />
    </div>
  );
}

function StatEditRowIV({
  label,
  value,
  iv,
  ev,
  onIvChange,
  onEvChange,
  disabled = false,
}: {
  label: string;
  value: number;
  iv: number;
  ev: number;
  onIvChange?: (v: number) => void;
  onEvChange?: (v: number) => void;
  disabled?: boolean;
}) {
  return (
    <div className="grid grid-cols-4 gap-2 items-center">
      <div className="text-sm font-medium">{label}</div>
      <div className="text-sm font-mono text-center">{value}</div>
      <Input
        type="number"
        min={0}
        max={31}
        value={iv}
        onChange={(e) =>
          onIvChange?.(Math.min(31, Math.max(0, parseInt(e.target.value) || 0)))
        }
        disabled={disabled}
        className="h-8 text-center text-sm"
      />
      <Input
        type="number"
        min={0}
        max={255}
        value={ev}
        onChange={(e) =>
          onEvChange?.(
            Math.min(255, Math.max(0, parseInt(e.target.value) || 0)),
          )
        }
        disabled={disabled}
        className="h-8 text-center text-sm"
      />
    </div>
  );
}

function MoveEditRow({
  index,
  moveId,
  pp,
  ppUps,
  onMoveChange,
  onPpChange,
  disabled = false,
  isIllegal = false,
  learnableMoves,
}: {
  index: number;
  moveId: number;
  pp: number;
  ppUps: number;
  onMoveChange: (id: number) => void;
  onPpChange: (pp: number) => void;
  disabled?: boolean;
  isIllegal?: boolean;
  learnableMoves?: number[];
}) {
  const basePP = moveId > 0 ? getBasePP(moveId) : 0;
  const maxPP = basePP + Math.floor((basePP * ppUps) / 5);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label className={`w-16 ${isIllegal ? "text-destructive" : ""}`}>
          Move {index + 1}
          {isIllegal && <span className="ml-1 text-xs">!</span>}
        </Label>
        <Select
          value={moveId.toString()}
          onValueChange={(v) => onMoveChange(parseInt(v))}
          disabled={disabled}
        >
          <SelectTrigger
            className={`flex-1 ${isIllegal ? "border-destructive" : ""}`}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="max-h-60">
            <SelectItem value="0">---</SelectItem>
            {learnableMoves && learnableMoves.length > 0 ? (
              <>
                <div className="px-2 py-1 text-xs font-medium text-muted-foreground">
                  Learnable
                </div>
                {learnableMoves.map((id) => (
                  <SelectItem key={id} value={id.toString()}>
                    {MOVES_EN[id] || `Move ${id}`}
                  </SelectItem>
                ))}
                <Separator className="my-1" />
                <div className="px-2 py-1 text-xs font-medium text-muted-foreground">
                  All Moves
                </div>
                {MOVES_EN.slice(1).map((name, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                    {name}
                  </SelectItem>
                ))}
              </>
            ) : (
              MOVES_EN.slice(1).map((name, i) => (
                <SelectItem key={i + 1} value={(i + 1).toString()}>
                  {name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>
      {moveId > 0 && (
        <div className="flex items-center gap-2 ml-16">
          <Label className="text-xs text-muted-foreground">PP:</Label>
          <Input
            type="number"
            min={0}
            max={maxPP}
            value={pp}
            onChange={(e) =>
              onPpChange(
                Math.min(maxPP, Math.max(0, parseInt(e.target.value) || 0)),
              )
            }
            disabled={disabled}
            className="w-16 h-7 text-sm"
          />
          <span className="text-xs text-muted-foreground">/ {maxPP}</span>
          {isIllegal && (
            <Badge variant="destructive" className="text-xs">
              Illegal
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
