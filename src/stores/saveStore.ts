import { create } from "zustand";
import { SAV1, loadSAV1, isGen1Save } from "@/lib/pkhex-core/saves/SAV1";
import { SAV2, loadSAV2, isGen2Save } from "@/lib/pkhex-core/saves/SAV2";
import { SAV3, loadSAV3, isGen3Save } from "@/lib/pkhex-core/saves/SAV3";
import { PK1 } from "@/lib/pkhex-core/pkm/PK1";
import { PK2 } from "@/lib/pkhex-core/pkm/PK2";
import { PK3 } from "@/lib/pkhex-core/pkm/PK3";
import { IPokemon } from "@/types/pokemon";

// Union types for multi-generation support
type SaveFile = SAV1 | SAV2 | SAV3;
type Pokemon = PK1 | PK2 | PK3;

interface SaveState {
  // Save file data
  save: SaveFile | null;
  fileName: string | null;
  isModified: boolean;
  generation: number;

  // Selection state
  selectedBox: number;
  selectedSlot: number | null;
  selectedPartySlot: number | null;
  selectedPokemon: Pokemon | null;

  // Clipboard for copy/paste
  clipboard: Pokemon | null;

  // Actions
  loadSave: (data: Uint8Array, fileName: string) => boolean;
  closeSave: () => void;
  setModified: (modified: boolean) => void;

  // Selection actions
  selectBox: (box: number) => void;
  selectBoxSlot: (slot: number | null) => void;
  selectPartySlot: (slot: number | null) => void;

  // Pokemon actions
  updateSelectedPokemon: (pk: Pokemon) => void;
  updateBoxPokemon: (box: number, slot: number, pk: Pokemon | null) => void;

  // Clipboard actions
  copyPokemon: () => void;
  pastePokemon: () => void;
  deletePokemon: () => void;

  // Move/Swap actions
  swapPokemon: (
    fromBox: number,
    fromSlot: number,
    toBox: number,
    toSlot: number,
  ) => void;

  // Add Pokemon
  addNewPokemon: (
    species: number,
    level: number,
    targetBox?: number,
  ) => boolean;

  // Export
  exportSave: () => Uint8Array | null;
}

export const useSaveStore = create<SaveState>((set, get) => ({
  // Initial state
  save: null,
  fileName: null,
  isModified: false,
  generation: 0,
  selectedBox: 0,
  selectedSlot: null,
  selectedPartySlot: null,
  selectedPokemon: null,
  clipboard: null,

  // Load a save file
  loadSave: (data: Uint8Array, fileName: string) => {
    // Try Gen 1 first
    if (isGen1Save(data)) {
      const save = loadSAV1(data);
      if (save) {
        set({
          save,
          fileName,
          isModified: false,
          generation: 1,
          selectedBox: save.currentBox,
          selectedSlot: null,
          selectedPartySlot: null,
          selectedPokemon: null,
        });
        return true;
      }
    }

    // Try Gen 2
    if (isGen2Save(data)) {
      const save = loadSAV2(data);
      if (save) {
        set({
          save,
          fileName,
          isModified: false,
          generation: 2,
          selectedBox: save.currentBox,
          selectedSlot: null,
          selectedPartySlot: null,
          selectedPokemon: null,
        });
        return true;
      }
    }

    // Try Gen 3
    if (isGen3Save(data)) {
      const save = loadSAV3(data);
      if (save) {
        set({
          save,
          fileName,
          isModified: false,
          generation: 3,
          selectedBox: save.currentBox,
          selectedSlot: null,
          selectedPartySlot: null,
          selectedPokemon: null,
        });
        return true;
      }
    }

    return false;
  },

  // Close current save
  closeSave: () => {
    set({
      save: null,
      fileName: null,
      isModified: false,
      generation: 0,
      selectedBox: 0,
      selectedSlot: null,
      selectedPartySlot: null,
      selectedPokemon: null,
    });
  },

  // Set modified flag
  setModified: (modified: boolean) => {
    set({ isModified: modified });
  },

  // Select a box
  selectBox: (box: number) => {
    const { save } = get();
    if (!save || box < 0 || box >= save.boxCount) return;

    set({
      selectedBox: box,
      selectedSlot: null,
      selectedPartySlot: null,
      selectedPokemon: null,
    });
  },

  // Select a box slot
  selectBoxSlot: (slot: number | null) => {
    const { save, selectedBox, generation } = get();
    if (!save) return;

    if (slot === null) {
      set({
        selectedSlot: null,
        selectedPartySlot: null,
        selectedPokemon: null,
      });
      return;
    }

    const pk = save.getBoxPokemon(selectedBox, slot);
    set({
      selectedSlot: slot,
      selectedPartySlot: null,
      selectedPokemon: pk,
    });
  },

  // Select a party slot
  selectPartySlot: (slot: number | null) => {
    const { save, generation } = get();
    if (!save) return;

    if (slot === null) {
      set({
        selectedSlot: null,
        selectedPartySlot: null,
        selectedPokemon: null,
      });
      return;
    }

    const pk = save.getPartyPokemon(slot);
    set({
      selectedSlot: null,
      selectedPartySlot: slot,
      selectedPokemon: pk,
    });
  },

  // Update the selected Pokemon
  updateSelectedPokemon: (pk: Pokemon) => {
    const { save, selectedSlot, selectedPartySlot, selectedBox, generation } =
      get();
    if (!save) return;

    if (selectedPartySlot !== null) {
      // Update party Pokemon
      if (generation === 1 && save instanceof SAV1 && pk instanceof PK1) {
        save.setPartyPokemon(selectedPartySlot, pk);
      } else if (
        generation === 2 &&
        save instanceof SAV2 &&
        pk instanceof PK2
      ) {
        save.setPartyPokemon(selectedPartySlot, pk);
      } else if (
        generation === 3 &&
        save instanceof SAV3 &&
        pk instanceof PK3
      ) {
        save.setPartyPokemon(selectedPartySlot, pk);
      }
    } else if (selectedSlot !== null) {
      // Update box Pokemon - THIS WAS MISSING!
      if (generation === 1 && save instanceof SAV1 && pk instanceof PK1) {
        save.setBoxPokemon(selectedBox, selectedSlot, pk);
      } else if (
        generation === 2 &&
        save instanceof SAV2 &&
        pk instanceof PK2
      ) {
        save.setBoxPokemon(selectedBox, selectedSlot, pk);
      } else if (
        generation === 3 &&
        save instanceof SAV3 &&
        pk instanceof PK3
      ) {
        save.setBoxPokemon(selectedBox, selectedSlot, pk);
      }
    }

    set({
      selectedPokemon: pk.clone() as Pokemon,
      isModified: true,
    });
  },

  // Update box Pokemon
  updateBoxPokemon: (box: number, slot: number, pk: Pokemon | null) => {
    const { save, generation, selectedBox, selectedSlot } = get();
    if (!save) return;

    // Note: Box editing requires setBoxPokemon method on save files
    // This is a placeholder - full implementation needs save file updates
    set({ isModified: true });

    // Refresh selected if we're editing the selected slot
    if (box === selectedBox && slot === selectedSlot) {
      set({ selectedPokemon: (pk?.clone() as Pokemon) || null });
    }
  },

  // Copy selected Pokemon to clipboard
  copyPokemon: () => {
    const { selectedPokemon } = get();
    if (!selectedPokemon) return;
    set({ clipboard: selectedPokemon.clone() as Pokemon });
  },

  // Paste Pokemon from clipboard to selected slot
  pastePokemon: () => {
    const {
      save,
      clipboard,
      selectedSlot,
      selectedPartySlot,
      selectedBox,
      generation,
    } = get();
    if (!save || !clipboard) return;

    const pkClone = clipboard.clone() as Pokemon;

    if (selectedPartySlot !== null) {
      // Paste to party
      if (generation === 1 && save instanceof SAV1 && pkClone instanceof PK1) {
        save.setPartyPokemon(selectedPartySlot, pkClone);
      } else if (
        generation === 2 &&
        save instanceof SAV2 &&
        pkClone instanceof PK2
      ) {
        save.setPartyPokemon(selectedPartySlot, pkClone);
      } else if (
        generation === 3 &&
        save instanceof SAV3 &&
        pkClone instanceof PK3
      ) {
        save.setPartyPokemon(selectedPartySlot, pkClone);
      }
      set({ selectedPokemon: pkClone, isModified: true });
    } else if (selectedSlot !== null) {
      // Paste to box
      if (generation === 1 && save instanceof SAV1 && pkClone instanceof PK1) {
        save.setBoxPokemon(selectedBox, selectedSlot, pkClone);
      } else if (
        generation === 2 &&
        save instanceof SAV2 &&
        pkClone instanceof PK2
      ) {
        save.setBoxPokemon(selectedBox, selectedSlot, pkClone);
      } else if (
        generation === 3 &&
        save instanceof SAV3 &&
        pkClone instanceof PK3
      ) {
        save.setBoxPokemon(selectedBox, selectedSlot, pkClone);
      }
      set({ selectedPokemon: pkClone, isModified: true });
    }
  },

  // Delete selected Pokemon
  deletePokemon: () => {
    const { save, selectedSlot, selectedPartySlot, selectedBox, generation } =
      get();
    if (!save) return;

    // Note: Deleting from party is complex (need to shift Pokemon)
    // This is simplified - would need full implementation
    if (selectedPartySlot !== null) {
      // Can't easily delete from party without shifting
      return;
    }

    // Delete from box
    if (selectedSlot !== null) {
      if (generation === 1 && save instanceof SAV1) {
        save.setBoxPokemon(selectedBox, selectedSlot, null);
      } else if (generation === 2 && save instanceof SAV2) {
        save.setBoxPokemon(selectedBox, selectedSlot, null);
      } else if (generation === 3 && save instanceof SAV3) {
        save.setBoxPokemon(selectedBox, selectedSlot, null);
      }
    }

    set({ selectedPokemon: null, isModified: true });
  },

  // Swap two Pokemon
  swapPokemon: (
    fromBox: number,
    fromSlot: number,
    toBox: number,
    toSlot: number,
  ) => {
    const { save, generation, selectedBox, selectedSlot } = get();
    if (!save) return;

    // Get both Pokemon
    const pkFrom = save.getBoxPokemon(fromBox, fromSlot);
    const pkTo = save.getBoxPokemon(toBox, toSlot);

    // Perform the swap
    if (generation === 1 && save instanceof SAV1) {
      save.setBoxPokemon(toBox, toSlot, pkFrom as PK1 | null);
      save.setBoxPokemon(fromBox, fromSlot, pkTo as PK1 | null);
    } else if (generation === 2 && save instanceof SAV2) {
      save.setBoxPokemon(toBox, toSlot, pkFrom as PK2 | null);
      save.setBoxPokemon(fromBox, fromSlot, pkTo as PK2 | null);
    } else if (generation === 3 && save instanceof SAV3) {
      save.setBoxPokemon(toBox, toSlot, pkFrom as PK3 | null);
      save.setBoxPokemon(fromBox, fromSlot, pkTo as PK3 | null);
    }

    // Update selected Pokemon if the selected slot was involved
    if (selectedBox === toBox && selectedSlot === toSlot) {
      set({ selectedPokemon: (pkFrom?.clone() as Pokemon) || null });
    } else if (selectedBox === fromBox && selectedSlot === fromSlot) {
      set({ selectedPokemon: (pkTo?.clone() as Pokemon) || null });
    }

    set({ isModified: true });
  },

  // Add a new Pokemon to box or party
  addNewPokemon: (species: number, level: number, targetBox?: number) => {
    const { save, generation, selectedBox } = get();
    if (!save) return false;

    // Only Gen 3 supported for now
    if (generation !== 3 || !(save instanceof SAV3)) return false;

    // Create the new Pokemon
    const newPk = PK3.create({
      species,
      level,
      otName: save.trainerName,
      tid: save.tid16,
      sid: save.sid16,
    });

    const box = targetBox ?? selectedBox;

    // Find an empty slot in the target box
    for (let slot = 0; slot < save.boxSlotCount; slot++) {
      const existing = save.getBoxPokemon(box, slot);
      if (!existing) {
        // Found empty slot
        save.setBoxPokemon(box, slot, newPk);
        set({ isModified: true });
        return true;
      }
    }

    // No empty slot found
    return false;
  },

  // Export save file
  exportSave: () => {
    const { save } = get();
    if (!save) return null;
    return save.export();
  },
}));
