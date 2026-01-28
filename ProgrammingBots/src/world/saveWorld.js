import { Chunks } from "./chunks.js";

export function saveWorld(saveName) {
    const savedChunks = [];

    // Chunks.getAllChunks() returns an iterator
    for (const chunk of Chunks.getAllChunks()) {
        savedChunks.push({
            cx: chunk.cx,
            cy: chunk.cy,
            grid: chunk.grid
        });
    }

    const saveData = {
        timestamp: Date.now(),
        seed: Chunks.seed,
        chunks: savedChunks
    };

    try {
        localStorage.setItem(`saves:${saveName}`, JSON.stringify(saveData));
        console.log(`World saved as "${saveName}" with ${savedChunks.length} chunks`);
    } catch (err) {
        console.error("Error saving world:", err);
    }
}