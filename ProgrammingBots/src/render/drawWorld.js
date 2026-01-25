import { Chunks } from "../world/chunks.js";
import { drawGrid } from "./drawGrid.js";
import { CHUNK_SIZE } from "../world/worldVars.js";
import { toScreen } from "../core/isometricTransformations.js";

export function drawWorld(ctx, tileSize, camera) {
    for (const chunk of Chunks.getAllChunks()) {
        if (!chunkIsVisible(chunk, camera, ctx.canvas, tileSize)) continue;
        drawGrid(ctx, chunk.grid, tileSize, camera, chunk.cx, chunk.cy);
    }
}

export function chunkIsVisible(chunk, camera, canvas, tileSize) {
    const cx = chunk.cx;
    const cy = chunk.cy;

    const corners = [
        { x: cx * CHUNK_SIZE,         y: cy * CHUNK_SIZE },
        { x: (cx + 1) * CHUNK_SIZE,   y: cy * CHUNK_SIZE },
        { x: cx * CHUNK_SIZE,         y: (cy + 1) * CHUNK_SIZE },
        { x: (cx + 1) * CHUNK_SIZE,   y: (cy + 1) * CHUNK_SIZE }
    ];

    const projected = corners.map(p =>
        toScreen(
            p.x,
            p.y,
            tileSize,
            camera.zoom,
            camera.offsetX,
            camera.offsetY
        )
    );

    // Screen-space bounding box
    let minX = Infinity, minY = Infinity;
    let maxX = -Infinity, maxY = -Infinity;

    for (const p of projected) {
        minX = Math.min(minX, p.x);
        minY = Math.min(minY, p.y);
        maxX = Math.max(maxX, p.x);
        maxY = Math.max(maxY, p.y);
    }

    // Visibility test
    return !(
        maxX < 0 ||
        maxY < 0 ||
        minX > canvas.width ||
        minY > canvas.height
    );
}