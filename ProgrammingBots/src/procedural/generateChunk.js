import { generateTerrainPerChunk } from "./generateTerrain.js";
import { placeStructures } from "./placeStructures.js";

export function generateChunk(chunk, seed) {
    const { grid, cx, cy } = chunk;

    generateTerrainPerChunk(grid, cx, cy, grid.length, seed);
    // Place trees and structures
    placeStructures(grid, 15, "tree");
}