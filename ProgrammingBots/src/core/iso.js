export function toScreen(x, y, tileSize, zoom, offsetX, offsetY) {
    return {
        x: (x - y) * tileSize * zoom + offsetX,
        y: (x + y) * tileSize * zoom / 2 + offsetY
    };
}

export function toGrid(screenX, screenY, tileSize, zoom, offsetX, offsetY) {
    const x = (screenX - offsetX) / zoom;
    const y = (screenY - offsetY) / zoom;

    const gx = Math.floor((y / tileSize) + (x / (2 * tileSize)));
    const gy = Math.floor((y / tileSize) - (x / (2 * tileSize)));

    return { x: gx, y: gy };
}
