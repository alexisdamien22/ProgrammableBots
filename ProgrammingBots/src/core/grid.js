export function createGrid(w, h) {
    const grid = [];
    for (let x = 0; x < w; x++) {
        grid[x] = [];
        for (let y = 0; y < h; y++) {
            grid[x][y] = [];
        }
    }
    return grid;
}

export function addAssetToGrid(grid, asset, x, y) {
    grid[x][y].push(asset);
}

export function forEachTile(grid, callback) {
    for (let x = 0; x < grid.length; x++) {
        for (let y = 0; y < grid[0].length; y++) {
            callback(x, y, grid[x][y]);
        }
    }
}
