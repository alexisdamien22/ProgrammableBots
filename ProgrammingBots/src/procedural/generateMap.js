import { generateTerrain } from "./generateTerrain.js";
import { placeStructures } from "./placeStructures.js";

export function generateMap(grid, seed = 1) {
    generateTerrain(grid, seed);
    placeStructures(grid, 25);
}