import { toScreen } from "../core/iso.js";
import { assets } from "../core/assets.js";

export function drawAsset(ctx, obj, x, y, tileSize, camera) {
    const asset = assets.get(obj.type);
    
    if (!asset) {
        console.warn("Missing asset:", obj.type);
        return;
    }

    if (obj.localOffset.dx !== 0 || obj.localOffset.dy !== 0) return;

    const p = toScreen(x, y, tileSize, camera.zoom, camera.offsetX, camera.offsetY);

    ctx.drawImage(
        asset.img,
        p.x - asset.w * tileSize * camera.zoom,
        p.y - asset.h * tileSize * camera.zoom / 2,
        asset.w * tileSize * 2 * camera.zoom,
        asset.h * tileSize * 2 * camera.zoom
    );
}