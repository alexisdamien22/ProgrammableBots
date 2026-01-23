import { drawTile } from "./drawTile.js";
import { drawAsset } from "./drawAsset.js";

export function drawGrid(ctx, grid, tileSize, camera) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    for (let x = 0; x < grid.length; x++) {
        for (let y = 0; y < grid[0].length; y++) {

            drawTile(ctx, x, y, tileSize, camera);

            for (const obj of grid[x][y]) {
                drawAsset(ctx, obj, x, y, tileSize, camera);
            }
        }
    }
}