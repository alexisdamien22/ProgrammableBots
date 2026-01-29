import { Chunks } from "./chunks.js";
import { inventoryState } from "../ui/inventoryManager.js";
import { saveGameToDB, initDatabase } from "./saveDatabase.js";
import { camera } from "../core/camera.js";

export async function saveWorld(saveName, metadata = {}) {
    const savedChunks = [];

    // Chunks.getAllChunks() returns an iterator
    for (const chunk of Chunks.getAllChunks()) {
        // Only store non-empty tiles to save space
        const compressedGrid = [];
        for (let y = 0; y < chunk.grid.length; y++) {
            for (let x = 0; x < chunk.grid[y].length; x++) {
                const tile = chunk.grid[y][x];
                if (tile && Object.keys(tile).length > 0) {
                    compressedGrid.push({
                        x, y,
                        tile: tile
                    });
                }
            }
        }

        savedChunks.push({
            cx: chunk.cx,
            cy: chunk.cy,
            compressedGrid: compressedGrid
        });
    }

    const saveData = {
        name: saveName,
        timestamp: Date.now(),
        lastPlayed: new Date().toLocaleDateString("fr-FR"),
        seed: Chunks.seed,
        // Save camera both as world/grid coords and exact screen offsets + canvas size
        camera: {
            worldX: camera.worldX,
            worldY: camera.worldY,
            offsetX: camera.offsetX,
            offsetY: camera.offsetY,
            zoom: camera.zoom,
            canvasWidth: (typeof window !== 'undefined') ? window.innerWidth : null,
            canvasHeight: (typeof window !== 'undefined') ? window.innerHeight : null
        },
        chunks: savedChunks,
        inventory: {
            slots: inventoryState.slots,
            itemInHand: inventoryState.itemInHand
        },
        ...metadata
    };

    try {
        await initDatabase();
        await saveGameToDB(saveName, saveData);
        console.log(`World saved as "${saveName}" with ${savedChunks.length} chunks`);
        return saveData;
    } catch (err) {
        console.error("Error saving world:", err);
    }
}
