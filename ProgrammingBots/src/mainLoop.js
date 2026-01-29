import { camera } from "./core/camera.js";
import { loadAssets } from "./loader/loadAssets.js";
import {
	updateChunks,
	enqueueMissingChunks,
	processChunkQueue,
} from "./core/chunkLoader.js";
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

    camera.updateWorldPosition(tileSize, canvas);
    updateChunks(camera, SEED, 2);
    const chunk = Chunks.get(0, 0);
    addAssetToGrid(
		chunk.grid,
		{
			type: "spaceShuttle",
			origin: { x: 0, y: 0 },
			localOffset: { dx: 0, dy: 0 },
		},
		0,
		0,
	);
    return { ctx, canvas, camera, then, fpsElement };
}

export const GameState = {
    currentPage: "GamePage",
    lastChunkX: null,
    lastChunkY: null,
    needsRedraw: true,
    lastFpsUpdate: 0,
    inventoryOpen: false,
    escMenuOpen: false,
    currentSaveName: null
};


export function frame(SEED, ctx, canvas, camera, tileSize, then, fpsElement) {
    let now = Date.now() / 1000;  // get time in seconds

    // compute time since last frame
    let elapsedTime = now - then;
    then = now;

    // compute fps
    let fps = 1 / elapsedTime;
    const nowMs = Date.now();
	if (nowMs - GameState.lastFpsUpdate > 250) {
		fpsElement.innerText = fps.toFixed(1);
		GameState.lastFpsUpdate = nowMs;
	}

    camera.updateWorldPosition(tileSize, canvas);

    const cx = Math.floor(camera.worldX / CHUNK_SIZE);
    const cy = Math.floor(camera.worldY / CHUNK_SIZE);

    if (cx !== GameState.lastChunkX || cy !== GameState.lastChunkY) {
        enqueueMissingChunks(camera, SEED, 7);
        GameState.lastChunkX = cx;
        GameState.lastChunkY = cy;
        GameState.needsRedraw = true;  // Add this flag
    }

    if (processChunkQueue(SEED, 2)) GameState.needsRedraw = true;
	Chunks.unloadChunksOutsideRange(cx, cy, 7);

    if (GameState.needsRedraw) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawWorld(ctx, tileSize, camera);
        GameState.needsRedraw = false;
    }

    // schedule next frame and store handle so it can be cancelled when restarting
    if (typeof window !== 'undefined') {
        if (frame._handle) cancelAnimationFrame(frame._handle);
        frame._handle = requestAnimationFrame(() => frame(SEED, ctx, canvas, camera, tileSize, then, fpsElement));
    }
}

export function stopFrame() {
    if (frame._handle) {
        cancelAnimationFrame(frame._handle);
        frame._handle = null;
    }
}