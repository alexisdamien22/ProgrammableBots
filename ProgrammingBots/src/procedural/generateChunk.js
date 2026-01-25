import { generateTerrainPerChunk } from "./generateTerrain.js";
import { placeStructures } from "./placeStructures.js";

export function generateChunk(chunk, seed) {
    const { grid, cx, cy } = chunk;

    generateTerrainPerChunk(grid, cx, cy, grid.length, seed);
    placeStructures(grid, cx, cy, grid.length);
}