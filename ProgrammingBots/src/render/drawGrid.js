import { drawTile } from "./drawTile.js";
import { drawAsset } from "./drawAsset.js";
import { toScreen } from "../core/isometricTransformations.js";


export function drawGrid(ctx, grid, tileSize, camera, cx = 0, cy = 0) {
    const chunkSize = grid.length;

    for (let y = 0; y < chunkSize; y++) {
        for (let x = 0; x < grid[y].length; x++) {

            const worldX = cx * chunkSize + x;
            const worldY = cy * chunkSize + y;

            const cell = grid[y][x];
            if (!cell || cell.length === 0) continue;

            for (const obj of cell) {
                drawAsset(ctx, obj, worldX, worldY, tileSize, camera);
            }
        }
    }
}