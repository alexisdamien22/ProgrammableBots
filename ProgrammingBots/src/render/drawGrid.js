import { drawTile } from "./drawTile.js";
import { drawAsset } from "./drawAsset.js";
import { toScreen } from "../core/isometricTransformations.js";


export function drawGrids(ctx, grid, tileSize, camera) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {

            drawTile(ctx, x, y, tileSize, camera);

            for (const obj of grid[y][x]) {
                drawAsset(ctx, obj, x, y, tileSize, camera);
            }
        }
    }
}

export function drawGrid(ctx, grid, tileSize, camera) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const rows = grid.length;
    const cols = grid[0].length;
    const zoom = camera.zoom;
    const offsetX = camera.offsetX;
    const offsetY = camera.offsetY;
    const halfTile = tileSize / 2;

    const buffer = 4; // extra tiles to draw beyond visible edges

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            // Compute isometric screen position
            const p = toScreen(x, y, tileSize, zoom, offsetX, offsetY);

            // Cull tiles outside the canvas + buffer
            if (p.x + tileSize < -buffer * tileSize || p.x - tileSize > ctx.canvas.width + buffer * tileSize)
                continue;
            if (p.y + tileSize < -buffer * tileSize || p.y - tileSize > ctx.canvas.height + buffer * tileSize)
                continue;

            // Draw the base tile
            drawTile(ctx, x, y, tileSize, camera);

            // Draw all assets in this tile
            for (const obj of grid[y][x]) {
                drawAsset(ctx, obj, x, y, tileSize, camera);
            }
        }
    }
}