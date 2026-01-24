export function noise(x, y, seed = 1) {
    const n = x * 374761393 + y * 668265263 + seed * 31;
    return (Math.sin(n) + 1) * 0.5;
}