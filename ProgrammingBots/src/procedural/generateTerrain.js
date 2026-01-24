import { noise } from "./noise.js";
import { addAssetToGrid } from "../core/grid.js";

export function generateTerrain(grid, seed = 1) {
    const scale = 0.08;

    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            const n = noise(x * scale, y * scale, seed);

            let type;
            if (n < 0.35) type = "water";
            else if (n < 0.42) type = "sand";
            else type = "grass";

            addAssetToGrid(grid, {
                type: type,
                origin: { x, y },
                localOffset: { dx: 0, dy: 0 }
            }, x, y);
        }
    }
}