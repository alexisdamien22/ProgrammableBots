import { Chunks } from "../world/chunks.js";
import { drawGrid } from "./drawGrid.js";
import { CHUNK_SIZE } from "../world/worldVars.js";
import { toScreen } from "../core/isometricTransformations.js";

export function drawWorld(ctx, tileSize, camera) {
    const chunks = Array.from(Chunks.getAllChunks());
    console.log(`Drawing world with ${chunks.length} chunks`);
    
    // Sort chunks for proper isometric depth: back to front (top-left to bottom-right)
    chunks.sort((a, b) => {
        const depthA = a.cx + a.cy;
        const depthB = b.cx + b.cy;
        if (depthA !== depthB) return depthA - depthB;
        return a.cx - b.cx;  // Secondary sort by cx for consistency
    });
    
    let drawnChunks = 0;
    for (const chunk of chunks) {
        if (!chunkIsVisible(chunk, camera, ctx.canvas, tileSize)) continue;
        drawnChunks++;
        drawGrid(ctx, chunk.grid, tileSize, camera, chunk.cx, chunk.cy);
    }
    
    console.log(`Drew ${drawnChunks} visible chunks`);
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

    // Add large padding for isometric visibility
    const padding = CHUNK_SIZE * tileSize * 2;
    
    const visible = !(
        maxX < -padding ||
        maxY < -padding ||
        minX > canvas.width + padding ||
        minY > canvas.height + padding
    );
    
    if (visible && (cx >= -2 && cx <= 2 && cy >= -2 && cy <= 2)) {
        console.log(`Chunk (${cx}, ${cy}) visible: bbox (${minX.toFixed(0)}, ${minY.toFixed(0)}) to (${maxX.toFixed(0)}, ${maxY.toFixed(0)})`);
    }
    
    return visible;
}