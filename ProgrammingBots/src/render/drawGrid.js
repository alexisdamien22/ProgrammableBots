import { drawTile } from "./drawTile.js";
import { drawAsset } from "./drawAsset.js";
import { toScreen } from "../core/isometricTransformations.js";


export function drawGrid(ctx, grid, tileSize, camera, cx = 0, cy = 0) {
    const chunkSize = grid.length;
    const tilesToDraw = [];
    let emptyCount = 0;
    
    // Collect all visible tiles with their depth value
    for (let y = 0; y < chunkSize; y++) {
        for (let x = 0; x < chunkSize; x++) {
            const cell = grid[y][x];
            if (!cell || cell.length === 0) {
                emptyCount++;
                continue;
            }
            
            const worldX = cx * chunkSize + x;
            const worldY = cy * chunkSize + y;
            
            // Skip if tile is off-screen
            const p = toScreen(worldX, worldY, tileSize, camera.zoom, 
                             camera.offsetX, camera.offsetY);
            if (p.x + tileSize * camera.zoom < 0 || 
                p.x > ctx.canvas.width ||
                p.y + tileSize * camera.zoom < 0 || 
                p.y > ctx.canvas.height) continue;
            
            tilesToDraw.push({ worldX, worldY, cell });
        }
    }
    
    if ((cx >= -2 && cx <= 2 && cy >= -2 && cy <= 2)) {
        console.log(`Chunk (${cx}, ${cy}): ${chunkSize}x${chunkSize} grid, ${emptyCount} empty, ${tilesToDraw.length} visible tiles to draw`);
    }
    
    // Sort by depth: back to front (sum of x+y for isometric order)
    tilesToDraw.sort((a, b) => {
        const depthA = a.worldX + a.worldY;
        const depthB = b.worldX + b.worldY;
        if (depthA !== depthB) return depthA - depthB;
        return a.worldX - b.worldX;  // Secondary sort for consistency
    });
    
    // Draw tiles in sorted order
    for (const tile of tilesToDraw) {
        for (const obj of tile.cell) {
            drawAsset(ctx, obj, tile.worldX, tile.worldY, tileSize, camera);
        }
    }
}