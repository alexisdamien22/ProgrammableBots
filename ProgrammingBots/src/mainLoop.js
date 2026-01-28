import { camera } from "./core/camera.js";
import { loadAssets } from "./loader/loadAssets.js";
import { updateChunks } from "./core/chunkLoader.js";
import { drawWorld } from "./render/drawWorld.js";
import { CHUNK_SIZE } from "./world/worldVars.js";
import { Chunks } from "./world/chunks.js";
import { addAssetToGrid } from "./core/grid.js";

export async function init(SEED) {
    const canvas = document.getElementById("grid");
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const tileSize = 20;

    await loadAssets();

    camera.updateWorldPosition(tileSize, canvas);
    updateChunks(camera, SEED, 5);
    const chunk = Chunks.get(0, 0);
    addAssetToGrid(chunk.grid, {
        type: "spaceShuttle",
        origin: { x: 0, y: 0 },
        localOffset: { dx: 0, dy: 0 }
    }, 0, 0);
    return { ctx, canvas, camera };
}
export function frame(SEED, ctx, canvas, camera) {
    camera.updateWorldPosition(tileSize, canvas);

    const cx = Math.floor(camera.worldX / CHUNK_SIZE);
    const cy = Math.floor(camera.worldY / CHUNK_SIZE);

    if (cx !== lastChunkX || cy !== lastChunkY) {
        updateChunks(camera, SEED, 5);
        lastChunkX = cx;
        lastChunkY = cy;
    }

    if (needsRedraw) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawWorld(ctx, tileSize, camera);
        needsRedraw = false;
    }

    requestAnimationFrame(frame);
}