import { Chunks } from "./chunks.js";

export function loadWorld(saveName) {
    const json = localStorage.getItem(`saves:${saveName}`);
    if (!json) {
        console.warn("Save not found:", saveName);
        return;
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
        chunk.grid = data.grid;
    }

    console.log(`World loaded from "${saveName}" with ${saveData.chunks.length} chunks`);
}
