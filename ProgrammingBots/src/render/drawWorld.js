import { Chunks } from "../world/chunks.js";
import { CHUNK_SIZE } from "../world/worldVars.js";
import { toScreen } from "../core/isometricTransformations.js";
import { ensureChunkCached, drawChunkCache } from "./chunkCache.js";

const DRAW_VIEW_DISTANCE = 6;
const VIS_MARGIN = 64;

export function drawWorld(ctx, tileSize, camera) {
	const centerCx = Math.floor(camera.worldX / CHUNK_SIZE);
	const centerCy = Math.floor(camera.worldY / CHUNK_SIZE);
	const chunksToDraw = Chunks.getChunksInRange(
		centerCx,
		centerCy,
		DRAW_VIEW_DISTANCE,
	);

	for (const chunk of chunksToDraw) {
		if (!chunkIsVisible(chunk, camera, ctx.canvas, tileSize)) continue;
		ensureChunkCached(chunk, tileSize);
		drawChunkCache(ctx, chunk, tileSize, camera);
	}
}

/** Test rapide : centre du chunk + marge (1 toScreen au lieu de 4). */
export function chunkIsVisible(chunk, camera, canvas, tileSize) {
	const cx = chunk.cx;
	const cy = chunk.cy;
	const centerX = (cx + 0.5) * CHUNK_SIZE;
	const centerY = (cy + 0.5) * CHUNK_SIZE;
	const p = toScreen(
		centerX,
		centerY,
		tileSize,
		camera.zoom,
		camera.offsetX,
		camera.offsetY,
	);
	const m = VIS_MARGIN + CHUNK_SIZE * tileSize * camera.zoom;
	return !(
		p.x < -m ||
		p.x > canvas.width + m ||
		p.y < -m ||
		p.y > canvas.height + m
	);
}