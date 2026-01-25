import "./styles/style.css";
import { camera } from "./core/camera.js";
import { loadAssets } from "./loader/loadAssets.js";
import { updateChunks } from "./core/chunkLoader.js";
import { drawWorld } from "./render/drawWorld.js";
import { CHUNK_SIZE } from "./world/worldVars.js";

const canvas = document.getElementById("grid");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const tileSize = 20;
const SEED = 12345;

await loadAssets();

let needsRedraw = true;
let lastChunkX = null;
let lastChunkY = null;

function frame() {
    camera.updateWorldPosition(tileSize, canvas);
    console.log(
        "FPS OK | camera",
        camera.worldX.toFixed(2),
        camera.worldY.toFixed(2)
    );

    const cx = Math.floor(camera.worldX / CHUNK_SIZE);
    const cy = Math.floor(camera.worldY / CHUNK_SIZE);

    if (cx !== lastChunkX || cy !== lastChunkY) {
        updateChunks(camera, SEED, 5);
        lastChunkX = cx;
        lastChunkY = cy;
    }

    if (needsRedraw) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawWorld(ctx, tileSize, camera);
        needsRedraw = false;
    }

    requestAnimationFrame(frame);
}

camera.init(canvas, () => {
    needsRedraw = true;
});

frame();