import { Chunks } from "./chunks.js";
import { saveWorld } from "./saveWorld.js";
import { loadWorld } from "./loadWorld.js";

export function createWorld(saveName, seed) {
    // 1. Reset chunks map
    Chunks.chunks = new Map();

    // 2. Store seed (if your engine uses it)
    Chunks.seed = seed;

    // 3. Generate initial chunks (5×5 area around 0,0)
    const radius = 2;

    for (let cx = -radius; cx <= radius; cx++) {
        for (let cy = -radius; cy <= radius; cy++) {
            Chunks.create(cx, cy);
        }
    }

    // 4. Save world
    saveWorld(saveName);

    // 5. Load world into engine
    loadWorld(saveName);

    console.log(`World "${saveName}" created with seed ${seed}`);
}