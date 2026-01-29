import { drawAsset } from "./drawAsset.js";
import { toScreen } from "../core/isometricTransformations.js";

const CULL_MARGIN = 80;

export function drawGrid(
	ctx,
	grid,
	tileSize,
	camera,
	cx = 0,
	cy = 0,
	options = {},
) {
	const chunkSize = grid.length;
	const canvas = ctx.canvas;
	const skipCulling = options.skipCulling === true;
	const margin = skipCulling ? 0 : CULL_MARGIN + tileSize * 2 * camera.zoom;

	for (let y = 0; y < chunkSize; y++) {
		for (let x = 0; x < grid[y].length; x++) {
			const worldX = cx * chunkSize + x;
			const worldY = cy * chunkSize + y;

			if (!skipCulling) {
				const p = toScreen(
					worldX,
					worldY,
					tileSize,
					camera.zoom,
					camera.offsetX,
					camera.offsetY,
				);
				if (
					p.x < -margin ||
					p.x > canvas.width + margin ||
					p.y < -margin ||
					p.y > canvas.height + margin
				)
					continue;
			}

			const cell = grid[y][x];
			if (!cell || cell.length === 0) continue;

			for (const obj of cell) {
				drawAsset(ctx, obj, worldX, worldY, tileSize, camera);
			}
		}
	}
}