import { addAssetToGrid } from "../core/grid.js";
import { assets } from "../core/assets.js";

export async function loadMap(path, grid) {
    const res = await fetch(path);
    const data = await res.json();

    for (const obj of data.objects) {
        const asset = assets.get(obj.type);
        if (!asset) continue;

        for (let dx = 0; dx < asset.w; dx++) {
            for (let dy = 0; dy < asset.h; dy++) {
                addAssetToGrid(grid, {
                    type: obj.type,
                    origin: { x: obj.x, y: obj.y },
                    localOffset: { dx, dy }
                }, obj.x + dx, obj.y + dy);
            }
        }
    }
}
