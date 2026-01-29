import { CHUNK_SIZE } from "../world/worldVars.js";
import { Chunks } from "../world/chunks.js";
import { generateChunk } from "../procedural/generateChunk.js";

const chunkQueue = [];
const queuedKeys = new Set();

function distanceToCamera(cx, cy, centerX, centerY) {
	return Math.max(Math.abs(cx - centerX), Math.abs(cy - centerY));
}

/** Enfile les chunks manquants autour de la caméra (priorité par distance). */
export function enqueueMissingChunks(camera, _seed, viewDistance = 5) {
	const centerCx = Math.floor(camera.worldX / CHUNK_SIZE);
	const centerCy = Math.floor(camera.worldY / CHUNK_SIZE);
	const toEnqueue = [];

	for (let cy = centerCy - viewDistance; cy <= centerCy + viewDistance; cy++) {
		for (
			let cx = centerCx - viewDistance;
			cx <= centerCx + viewDistance;
			cx++
		) {
			if (!Chunks.has(cx, cy)) {
				const key = Chunks.key(cx, cy);
				if (!queuedKeys.has(key)) toEnqueue.push({ cx, cy });
			}
		}
	}

	toEnqueue.sort(
		(a, b) =>
			distanceToCamera(a.cx, a.cy, centerCx, centerCy) -
			distanceToCamera(b.cx, b.cy, centerCx, centerCy),
	);

	for (const { cx, cy } of toEnqueue) {
		const key = Chunks.key(cx, cy);
		if (queuedKeys.has(key)) continue;
		queuedKeys.add(key);
		chunkQueue.push({ cx, cy });
	}
}

/** Génère au plus maxPerFrame chunks. Retourne true si au moins un chunk généré. */
export function processChunkQueue(seed, maxPerFrame = 2) {
	let generated = 0;
	while (chunkQueue.length > 0 && generated < maxPerFrame) {
		const { cx, cy } = chunkQueue.shift();
		queuedKeys.delete(Chunks.key(cx, cy));
		const chunk = Chunks.create(cx, cy);
		generateChunk(chunk, seed);
		generated++;
	}
	return generated > 0;
}

/** Génération synchrone de tous les chunks autour de la caméra (init uniquement). */
export function updateChunks(camera, seed, viewDistance = 2) {
	const tileX = Math.floor(camera.worldX / CHUNK_SIZE);
	const tileY = Math.floor(camera.worldY / CHUNK_SIZE);

	for (let cy = tileY - viewDistance; cy <= tileY + viewDistance; cy++) {
		for (let cx = tileX - viewDistance; cx <= tileX + viewDistance; cx++) {
			if (!Chunks.has(cx, cy)) {
				const chunk = Chunks.create(cx, cy);
				generateChunk(chunk, seed);
			}
		}
	}
}