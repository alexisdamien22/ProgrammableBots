import { Chunks } from "./chunks.js";
import { createGrid } from "../core/grid.js";
import { CHUNK_SIZE } from "./worldVars.js";
import { inventoryState, setItemInSlot } from "../ui/inventoryManager.js";

export function loadWorld(saveName) {
    const json = localStorage.getItem(`saves:${saveName}`);
    if (!json) {
        console.warn("Save not found:", saveName);
        return null;
    }

    const saveData = JSON.parse(json);

    // Reset chunk map (replacement for clearAll)
    Chunks.chunks = new Map();

    // Restore seed if needed
    if (saveData.seed !== undefined) {
        Chunks.seed = saveData.seed;
    }

    // Recreate chunks
    for (const data of saveData.chunks) {
        const chunk = Chunks.create(data.cx, data.cy);
        
        // Decompress grid from compressedGrid if it exists
        if (data.compressedGrid) {
            // Start with empty grid
            chunk.grid = createGrid(CHUNK_SIZE, CHUNK_SIZE);
            
            // Place non-empty tiles
            for (const { x, y, tile } of data.compressedGrid) {
                chunk.grid[y][x] = tile;
            }
        } else {
            // Legacy: handle old full grid saves
            chunk.grid = data.grid;
        }
    }

    // Restore inventory
    if (saveData.inventory) {
        inventoryState.slots = saveData.inventory.slots;
        inventoryState.itemInHand = saveData.inventory.itemInHand;
    }

    console.log(`World loaded from "${saveName}" with ${saveData.chunks.length} chunks`);
    return saveData;
}

