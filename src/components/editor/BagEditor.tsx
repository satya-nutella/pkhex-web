"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSaveStore } from "@/stores/saveStore";
import { SAV3, ItemPocketType } from "@/lib/pkhex-core/saves/SAV3";
import { getItemName, getGen3ItemsForPocket } from "@/lib/data/items";
import { Plus, Minus, Trash2 } from "lucide-react";

interface BagItem {
  itemId: number;
  count: number;
  name: string;
}

const POCKET_NAMES: Record<ItemPocketType, string> = {
  [ItemPocketType.Items]: "Items",
  [ItemPocketType.KeyItems]: "Key Items",
  [ItemPocketType.Balls]: "Poké Balls",
  [ItemPocketType.TMsHMs]: "TMs & HMs",
  [ItemPocketType.Berries]: "Berries",
  [ItemPocketType.PCItems]: "PC Storage",
};

export function BagEditor() {
  const save = useSaveStore((state) => state.save);
  const generation = useSaveStore((state) => state.generation);
  const setModified = useSaveStore((state) => state.setModified);
  const [selectedPocket, setSelectedPocket] = useState<ItemPocketType>(
    ItemPocketType.Items,
  );
  const [selectedItemToAdd, setSelectedItemToAdd] = useState<string>("");
  const [quantityToAdd, setQuantityToAdd] = useState<number>(1);
  const [updateTrigger, forceUpdate] = useState({});

  // Only works with Gen 3
  if (!save || generation !== 3 || !(save instanceof SAV3)) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Bag editor is only available for Gen 3 saves
        </CardContent>
      </Card>
    );
  }

  const sav3 = save as SAV3;

  // Get items for selected pocket
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const pocketItems = useMemo((): BagItem[] => {
    const items = sav3.getItems(selectedPocket);
    return items.map((item) => ({
      ...item,
      name: getItemName(item.itemId, 3),
    }));
  }, [sav3, selectedPocket, updateTrigger]);

  // Get available items for adding (Gen 3) - filtered by pocket type
  const availableItems = useMemo(() => {
    return getGen3ItemsForPocket(selectedPocket);
  }, [selectedPocket]);

  const handleAddItem = () => {
    if (!selectedItemToAdd) return;
    const itemId = parseInt(selectedItemToAdd);
    if (isNaN(itemId) || itemId <= 0) return;

    sav3.addItem(selectedPocket, itemId, quantityToAdd);
    setModified(true);
    forceUpdate({});
  };

  const handleChangeQuantity = (itemId: number, delta: number) => {
    const items = sav3.getItems(selectedPocket);
    const item = items.find((i) => i.itemId === itemId);
    if (!item) return;

    const newCount = Math.max(1, item.count + delta);
    const pocket = sav3.itemPockets.find((p) => p.type === selectedPocket);
    if (!pocket) return;

    item.count = Math.min(newCount, pocket.maxCount);
    sav3.setItems(selectedPocket, items);
    setModified(true);
    forceUpdate({});
  };

  const handleRemoveItem = (itemId: number) => {
    const items = sav3
      .getItems(selectedPocket)
      .filter((i) => i.itemId !== itemId);
    sav3.setItems(selectedPocket, items);
    setModified(true);
    forceUpdate({});
  };

  const pocketTabs = Object.entries(POCKET_NAMES).map(([type, name]) => ({
    type: type as ItemPocketType,
    name,
  }));

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Bag / Inventory</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-3 overflow-hidden">
        {/* Pocket tabs */}
        <Tabs
          value={selectedPocket}
          onValueChange={(v) => {
            setSelectedPocket(v as ItemPocketType);
            setSelectedItemToAdd(""); // Reset item selection when pocket changes
          }}
        >
          <TabsList className="grid grid-cols-3 h-auto">
            {pocketTabs.slice(0, 3).map(({ type, name }) => (
              <TabsTrigger key={type} value={type} className="text-xs px-2">
                {name}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsList className="grid grid-cols-3 h-auto mt-1">
            {pocketTabs.slice(3).map(({ type, name }) => (
              <TabsTrigger key={type} value={type} className="text-xs px-2">
                {name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Items list */}
        <ScrollArea className="flex-1 border rounded-md">
          <div className="p-2 space-y-1">
            {pocketItems.length === 0 ? (
              <div className="text-center text-muted-foreground text-sm py-4">
                No items in this pocket
              </div>
            ) : (
              pocketItems.map((item) => (
                <div
                  key={item.itemId}
                  className="flex items-center gap-2 p-2 rounded hover:bg-muted/50"
                >
                  <div className="flex-1 min-w-0">
                    <span className="text-sm truncate">{item.name}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    x{item.count}
                  </Badge>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleChangeQuantity(item.itemId, -1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleChangeQuantity(item.itemId, 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-destructive"
                      onClick={() => handleRemoveItem(item.itemId)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        {/* Add item section */}
        <div className="border rounded-md p-3 space-y-2">
          <Label className="text-xs font-medium">Add Item</Label>
          <div className="flex gap-2">
            <Select
              value={selectedItemToAdd}
              onValueChange={setSelectedItemToAdd}
            >
              <SelectTrigger className="flex-1 h-8 text-xs">
                <SelectValue placeholder="Select item..." />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {availableItems.map((item) => (
                  <SelectItem
                    key={item.id}
                    value={item.id.toString()}
                    className="text-xs"
                  >
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              min={1}
              max={999}
              value={quantityToAdd}
              onChange={(e) => setQuantityToAdd(parseInt(e.target.value) || 1)}
              className="w-16 h-8 text-xs"
            />
            <Button size="sm" className="h-8" onClick={handleAddItem}>
              <Plus className="h-3 w-3 mr-1" />
              Add
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
