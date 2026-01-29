import { CHUNK_SIZE } from "../world/worldVars.js";
import { drawGrid } from "./drawGrid.js";
import { toScreen } from "../core/isometricTransformations.js";

const CACHE_SCALE = 0.5;
const CACHE_LOGICAL_W = CHUNK_SIZE * 2; // in tileSize units
const CACHE_LOGICAL_H = CHUNK_SIZE;

/** Remplit chunk.cachedCanvas (et .cacheW, .cacheH) si pas déjà fait. */
export function ensureChunkCached(chunk, tileSize) {
	if (chunk.cachedCanvas) return;

	const w = Math.max(1, Math.floor(CACHE_LOGICAL_W * tileSize * CACHE_SCALE));
	const h = Math.max(1, Math.floor(CACHE_LOGICAL_H * tileSize * CACHE_SCALE));
	const off = document.createElement("canvas");
	off.width = w;
	off.height = h;
	const offCtx = off.getContext("2d");
	// Décaler pour que le contenu (x in [-32*tileSize, 32*tileSize]) soit dans [0, w]
	offCtx.translate(CHUNK_SIZE * tileSize * CACHE_SCALE, 0);
	offCtx.scale(CACHE_SCALE, CACHE_SCALE);

	const virtualCamera = {
		zoom: 1,
		offsetX: (chunk.cy - chunk.cx) * CHUNK_SIZE * tileSize,
		offsetY: (-(chunk.cx + chunk.cy) * CHUNK_SIZE * tileSize) / 2,
	};
	drawGrid(offCtx, chunk.grid, tileSize, virtualCamera, chunk.cx, chunk.cy, {
		skipCulling: true,
	});

	chunk.cachedCanvas = off;
	chunk.cacheW = CACHE_LOGICAL_W * tileSize;
	chunk.cacheH = CACHE_LOGICAL_H * tileSize;
}

/** Dessine le cache d’un chunk à l’écran. */
export function drawChunkCache(ctx, chunk, tileSize, camera) {
	const screen = toScreen(
		chunk.cx * CHUNK_SIZE,
		chunk.cy * CHUNK_SIZE,
		tileSize,
		camera.zoom,
		camera.offsetX,
		camera.offsetY,
	);
	const w = chunk.cacheW * camera.zoom;
	const h = chunk.cacheH * camera.zoom;
	// Origine du chunk dans le cache = moitié largeur (translate CHUNK_SIZE*tileSize)
	const ox = (chunk.cacheW * camera.zoom) / 2;
	ctx.drawImage(
		chunk.cachedCanvas,
		0,
		0,
		chunk.cachedCanvas.width,
		chunk.cachedCanvas.height,
		screen.x - ox,
		screen.y,
		w,
		h,
	);
}