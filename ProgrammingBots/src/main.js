import './assets/styles/style.css'
import { camera } from "./core/camera.js";
import { createGrid } from "./core/grid.js";
import { assets } from "./core/assets.js";
import { drawGrid } from "./render/drawGrid.js";
import { loadMap } from "./loader/mapLoader.js";
import { loadAssets } from "./loader/loadAssets.js";

const canvas = document.getElementById("grid");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const tileSize = 20;
const grid = createGrid(500, 500);

camera.init(canvas, () => drawGrid(ctx, grid, tileSize, camera));

assets.load("grass", "assets/tiles/grass.png", 1, 1);
assets.load("house", "assets/objects/house.png", 3, 2);

await loadAssets(); // charge tiles.json
await loadMap("./maps/map1.json", grid); // place les objets
drawGrid(ctx, grid, tileSize, camera); // dessine