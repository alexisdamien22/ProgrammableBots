export function toScreen(x, y, tileSize, zoom, offsetX, offsetY) {
    return {
        x: (x - y) * tileSize * zoom + offsetX,
        y: (x + y) * tileSize * zoom / 2 + offsetY
    };
}

export function toGrid(screenX, screenY, tileSize, zoom, offsetX, offsetY) {
    // convert to screen-space relative to camera
    const sx = (screenX - offsetX) / (tileSize * zoom);
    const sy = (screenY - offsetY) / (tileSize * zoom / 2);

    // invert the isometric projection
    const gx = (sy + sx) / 2;
    const gy = (sy - sx) / 2;

    return { x: gx, y: gy };
}


