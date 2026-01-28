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

    let fpsElement = document.getElementById("fps");

    let then = Date.now() / 1000;

    await loadAssets();

    // Initialize camera offsets first
    camera.offsetX = canvas.width / 2;
    camera.offsetY = canvas.height / 2;
    
    console.log(`Camera offsets set to: (${camera.offsetX}, ${camera.offsetY})`);
    
    camera.updateWorldPosition(tileSize, canvas);
    console.log(`Camera world position after init: (${camera.worldX}, ${camera.worldY})`);
    
    updateChunks(camera, SEED, 2);
    
    const chunk = Chunks.get(0, 0);
    console.log(`Chunk (0,0) exists: ${!!chunk}`);
    console.log(`Total chunks after init: ${Array.from(Chunks.getAllChunks()).length}`);
    
    if (chunk) {
        addAssetToGrid(chunk.grid, {
            type: "spaceShuttle",
            origin: { x: 0, y: 0 },
            localOffset: { dx: 0, dy: 0 }
        }, 8, 8);
    }
    return { ctx, canvas, camera, then, fpsElement };
}

export const GameState = {
    currentPage: "GamePage",
    lastChunkX: null,
    lastChunkY: null,
    needsRedraw: true,
    inventoryOpen: false,
    escMenuOpen: false
};


export function frame(SEED, ctx, canvas, camera, tileSize, then, fpsElement) {
    let now = Date.now() / 1000;  // get time in seconds

    // compute time since last frame
    let elapsedTime = now - then;
    then = now;

    // compute fps
    let fps = 1 / elapsedTime;
    fpsElement.innerText = fps.toFixed(2);

    camera.updateWorldPosition(tileSize, canvas);

    const cx = Math.floor(camera.worldX / CHUNK_SIZE);
    const cy = Math.floor(camera.worldY / CHUNK_SIZE);

    if (cx !== GameState.lastChunkX || cy !== GameState.lastChunkY) {
        updateChunks(camera, SEED, 5);
        GameState.lastChunkX = cx;
        GameState.lastChunkY = cy;
        GameState.needsRedraw = true;  // Add this flag
    }

    if (GameState.needsRedraw) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawWorld(ctx, tileSize, camera);
        GameState.needsRedraw = false;
    }

    requestAnimationFrame(() => frame(SEED, ctx, canvas, camera, tileSize, then, fpsElement));
}