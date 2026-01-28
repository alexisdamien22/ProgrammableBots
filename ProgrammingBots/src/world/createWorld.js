import { Chunks } from "./chunks.js";
import { saveWorld } from "./saveWorld.js";
import { loadWorld } from "./loadWorld.js";
import { generateChunk } from "../procedural/generateChunk.js";
import { initDatabase } from "./saveDatabase.js";

export async function createWorld(saveName, seed) {
    // 1. Reset chunks map
    Chunks.chunks = new Map();

    // 2. Store seed (if your engine uses it)
    Chunks.seed = seed;

    // 3. Generate initial chunks (5×5 area around 0,0)
    const radius = 2;

    for (let cx = -radius; cx <= radius; cx++) {
        for (let cy = -radius; cy <= radius; cy++) {
            const chunk = Chunks.create(cx, cy);
            generateChunk(chunk, seed);
        }
    }

    // 4. Save initial world state to IndexedDB
    await initDatabase();
    await saveWorld(saveName);

    console.log(`World "${saveName}" created with seed ${seed}`);
}