import './styles/style.css';
import { camera } from "./core/camera.js";
import { createGrid } from "./core/grid.js";
import { assets } from "./core/assets.js";
import { drawGrid } from "./render/drawGrid.js";
import { loadAssets } from "./loader/loadAssets.js";
import { generateMap } from "./procedural/generateMap.js";

const canvas = document.getElementById("grid");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const tileSize = 20;
const grid = createGrid(500, 500);

camera.init(canvas, () => drawGrid(ctx, grid, tileSize, camera));

await loadAssets();
generateMap(grid);
drawGrid(ctx, grid, tileSize, camera); // dessine