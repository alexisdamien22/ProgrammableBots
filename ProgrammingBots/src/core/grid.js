export function createGrid(w, h) {
    const grid = [];

    for (let y = 0; y < h; y++) {
        grid[y] = [];
        for (let x = 0; x < w; x++) {
            grid[y][x] = [];
        }
    }

    return grid;
}

export function addAssetToGrid(grid, asset, x, y) {
    grid[y][x].push(asset);
}

export function forEachTile(grid, callback) {
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            callback(x, y, grid[y][x]);
        }
    }
}
