import { assets } from "../core/assets.js";

function canPlace(grid, x, y, asset) {
    for (let dx = 0; dx < asset.w; dx++) {
        for (let dy = 0; dy < asset.h; dy++) {
            if (!grid[y + dy] || !grid[y + dy][x + dx]) return false;
            if (grid[y + dy][x + dx].type !== "grass_red" || grid[y + dy][x + dx].type !== "grass_blue") return false;
        }
    }
    return true;
}

export function placeStructures(grid, count = 20) {
    const house = assets.get("house");
    if (!house) return;

    for (let i = 0; i < count; i++) {
        const x = Math.floor(Math.random() * (grid[0].length - house.w));
        const y = Math.floor(Math.random() * (grid.length - house.h));

        if (!canPlace(grid, x, y, house)) continue;

        for (let dx = 0; dx < house.w; dx++) {
            for (let dy = 0; dy < house.h; dy++) {
                addAssetToGrid(grid, {
                    type: type,
                    origin: { x, y },
                    localOffset: { dx: 0, dy: 0 }
                }, x + dx, y + dy);
            }
        }
    }
}