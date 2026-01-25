import { toScreen } from "../core/isometricTransformations.js";

export function drawTile(ctx, x, y, tileSize, camera) {
    const p = toScreen(x, y, tileSize, camera.zoom, camera.offsetX, camera.offsetY);

    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(p.x + tileSize * camera.zoom, p.y + tileSize * camera.zoom / 2);
    ctx.lineTo(p.x, p.y + tileSize * camera.zoom);
    ctx.lineTo(p.x - tileSize * camera.zoom, p.y + tileSize * camera.zoom / 2);
    ctx.closePath();

    ctx.strokeStyle = "rgba(255,255,255,0.1)";
    ctx.stroke();
}//to have assets