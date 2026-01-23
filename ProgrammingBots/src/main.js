//import './style.css'

const canvas = document.getElementById("grid");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let tileSize = 20;          // taille de base d'une tuile
let zoom = 1;               // zoom actuel
let offsetX = canvas.width / 2;  // position caméra
let offsetY = 100;

let isDragging = false;
let lastX = 0;
let lastY = 0;

// Projection isométrique
function iso(x, y) {
    return {
        x: (x - y) * tileSize * zoom + offsetX,
        y: (x + y) * tileSize * zoom / 2 + offsetY
    };
}

function screenToIso(screenX, screenY) {
    const x = (screenX - offsetX) / zoom;
    const y = (screenY - offsetY) / zoom;

    const isoX = Math.floor((y / tileSize) + (x / (2 * tileSize)));
    const isoY = Math.floor((y / tileSize) - (x / (2 * tileSize)));

    return { x: isoX, y: isoY };
}

canvas.addEventListener("click", event => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const tile = screenToIso(mouseX, mouseY);

    console.log("Tu as cliqué la case :", tile.x, tile.y);
});

// Dessine une tuile losange
function drawTile(x, y) {
    const p = iso(x, y);

    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(p.x + tileSize * zoom, p.y + (tileSize * zoom) / 2);
    ctx.lineTo(p.x, p.y + tileSize * zoom);
    ctx.lineTo(p.x - tileSize * zoom, p.y + (tileSize * zoom) / 2);
    ctx.closePath();

    ctx.strokeStyle = "rgba(0,0,0,1)";
    ctx.stroke();
}

// Dessine la grille 500×500
function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let x = 0; x < 500; x++) {
        for (let y = 0; y < 500; y++) {
            drawTile(x, y);
        }
    }
}

drawGrid();

// Zoom molette
canvas.addEventListener("wheel", (event) => {
    event.preventDefault();

    const zoomFactor = 1.1;
    if (event.deltaY < 0) zoom *= zoomFactor;
    else zoom /= zoomFactor;

    zoom = Math.max(0.1, Math.min(zoom, 5)); // limites

    drawGrid();
});

// Drag pour déplacer la caméra
canvas.addEventListener("mousedown", event => {
    isDragging = true;
    lastX = event.clientX;
    lastY = event.clientY;
});

canvas.addEventListener("mousemove", event => {
    if (!isDragging) return;

    offsetX += event.clientX - lastX;
    offsetY += event.clientY - lastY;

    lastX = event.clientX;
    lastY = event.clientY;

    drawGrid();
});

canvas.addEventListener("mouseup", () => isDragging = false);
canvas.addEventListener("mouseleave", () => isDragging = false);