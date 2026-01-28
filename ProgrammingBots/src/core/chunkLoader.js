import { CHUNK_SIZE } from "../world/worldVars.js";
import { Chunks } from "../world/chunks.js";
import { generateChunk } from "../procedural/generateChunk.js";

export function updateChunks(camera, seed, viewDistance = 2) {
    const tileX = Math.floor(camera.worldX / CHUNK_SIZE);
    const tileY = Math.floor(camera.worldY / CHUNK_SIZE);

    console.log(`Camera at world: (${camera.worldX.toFixed(2)}, ${camera.worldY.toFixed(2)}), chunk: (${tileX}, ${tileY})`);

    for (let cy = tileY - viewDistance; cy <= tileY + viewDistance; cy++) {
        for (let cx = tileX - viewDistance; cx <= tileX + viewDistance; cx++) {
            if (!Chunks.has(cx, cy)) {
                console.log(`Generating chunk (${cx}, ${cy})`);
                const chunk = Chunks.create(cx, cy);
                generateChunk(chunk, seed);
            }
        }
    }
    
    console.log(`Total chunks: ${Array.from(Chunks.getAllChunks()).length}`);
}