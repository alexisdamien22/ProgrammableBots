import { toScreen } from "./isometricTransformations.js";
import { toGrid } from "./isometricTransformations.js";

export const camera = {
    zoom: 1,
    offsetX: 0,
    offsetY: 0,
    isDragging: false,
    lastX: 0,
    lastY: 0,
    zoomFactor: 1.1,

    updateWorldPosition(tileSize, canvas) {
        this.worldX =
            (canvas.width / 2 - this.offsetX) / (tileSize * this.zoom);
        this.worldY =
            (canvas.height / 2 - this.offsetY) / (tileSize * this.zoom);
        const cameraPos = toGrid(this.worldX, this.worldY, tileSize, this.zoom, this.offsetX, this.offsetY);
        this.worldX = cameraPos.x;
        this.worldY = cameraPos.y;
    },

    init(canvas, onChange) {
        this.offsetX = canvas.width / 2;
        this.offsetY = canvas.height / 4;
        this.onChange = onChange;

        canvas.addEventListener("wheel", (event) => {
            event.preventDefault();

            const mouseX = event.clientX;
            const mouseY = event.clientY;

            // 1. World position BEFORE zoom (in screen-space world coords)
            const worldBeforeX = (mouseX - this.offsetX) / this.zoom;
            const worldBeforeY = (mouseY - this.offsetY) / this.zoom;

            // 2. Apply zoom
            const oldZoom = this.zoom;
            this.zoom *= event.deltaY < 0 ? this.zoomFactor : 1 / this.zoomFactor;
            this.zoom = Math.max(0.5, Math.min(this.zoom, 5));

            // 3. World position AFTER zoom
            const worldAfterX = (mouseX - this.offsetX) / this.zoom;
            const worldAfterY = (mouseY - this.offsetY) / this.zoom;

            // 4. Adjust offset so the world stays under the mouse
            this.offsetX += (worldAfterX - worldBeforeX) * this.zoom;
            this.offsetY += (worldAfterY - worldBeforeY) * this.zoom;

            this.onChange();
        });

        canvas.addEventListener("mousedown", (event) => {
            this.isDragging = true;
            this.lastX = event.clientX;
            this.lastY = event.clientY;
        });

        canvas.addEventListener("mousemove", (event) => {
            if (!this.isDragging) return;
            this.offsetX += event.clientX - this.lastX;
            this.offsetY += event.clientY - this.lastY;
            this.lastX = event.clientX;
            this.lastY = event.clientY;
            onChange();
        });

        canvas.addEventListener("mouseup", () => this.isDragging = false);
        canvas.addEventListener("mouseleave", () => this.isDragging = false);

        window.addEventListener("resize", () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            onChange();
        });

        this.onChange();
    }
};
