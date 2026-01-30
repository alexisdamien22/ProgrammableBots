import { toScreen } from "./isometricTransformations.js";
import { toGrid } from "./isometricTransformations.js";
import { Chunks } from "../world/chunks.js";
import { tileSize } from "../world/worldVars.js";

export const camera = {
    zoom: 1,
    offsetX: 0,
    offsetY: 0,
    isDragging: false,
    lastX: 0,
    lastY: 0,
    zoomFactor: 1.1,

    updateWorldPosition(tileSize, canvas) {
        const screenCenterX = canvas.width / 2;
        const screenCenterY = canvas.height / 2;

        const worldX = (screenCenterX - this.offsetX) / (tileSize * this.zoom);
        const worldY = (screenCenterY - this.offsetY) / (tileSize * this.zoom);

        const cameraPos = toGrid(worldX, worldY, tileSize, this.zoom, this.offsetX, this.offsetY);
        this.worldX = cameraPos.x;
        this.worldY = cameraPos.y;
    },

    init(canvas, onChange) {
        // store onChange callback
        this.onChange = onChange;

        // detach previous handlers if attached
        if (this._attachedCanvas) {
            try {
                this._attachedCanvas.removeEventListener("wheel", this._wheelHandler);
                this._attachedCanvas.removeEventListener("mousedown", this._mouseDownHandler);
                this._attachedCanvas.removeEventListener("mousemove", this._mouseMoveHandler);
                this._attachedCanvas.removeEventListener("mouseup", this._mouseUpHandler);
                this._attachedCanvas.removeEventListener("mouseleave", this._mouseLeaveHandler);
                window.removeEventListener("resize", this._resizeHandler);
            } catch (e) {
                // ignore
            }
        }

        // bound handlers
        this._wheelHandler = (event) => {
            event.preventDefault();

            const mouseX = event.clientX;
            const mouseY = event.clientY;

            const worldBeforeX = (mouseX - this.offsetX) / this.zoom;
            const worldBeforeY = (mouseY - this.offsetY) / this.zoom;

            this.zoom *= event.deltaY < 0 ? this.zoomFactor : 1 / this.zoomFactor;
            this.zoom = Math.max(0.5, Math.min(this.zoom, 5));

            const worldAfterX = (mouseX - this.offsetX) / this.zoom;
            const worldAfterY = (mouseY - this.offsetY) / this.zoom;

            this.offsetX += (worldAfterX - worldBeforeX) * this.zoom;
            this.offsetY += (worldAfterY - worldBeforeY) * this.zoom;

            if (this.onChange) this.onChange();
        };

        this._mouseDownHandler = (event) => {
            if (event.button !== 0) return; // only left button
            this.isDragging = true;
            this.lastX = event.clientX;
            this.lastY = event.clientY;
        };

        this._mouseMoveHandler = (event) => {
            if (!this.isDragging) return;
            this.offsetX += event.clientX - this.lastX;
            this.offsetY += event.clientY - this.lastY;
            this.lastX = event.clientX;
            this.lastY = event.clientY;
            if (this.onChange) this.onChange();
        };

        this._mouseUpHandler = () => {
            this.isDragging = false;
        };

        this._mouseLeaveHandler = () => {
            this.isDragging = false;
        };

        this._resizeHandler = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            if (this.onChange) this.onChange();
        };

        // attach
        this._attachedCanvas = canvas;

        if (!this.offsetX) this.offsetX = canvas.width / 2;
        if (!this.offsetY) this.offsetY = canvas.height / 2;

        canvas.addEventListener("wheel", this._wheelHandler);
        canvas.addEventListener("mousedown", this._mouseDownHandler);
        canvas.addEventListener("mousemove", this._mouseMoveHandler);
        canvas.addEventListener("mouseup", this._mouseUpHandler);
        canvas.addEventListener("mouseleave", this._mouseLeaveHandler);


        window.addEventListener("resize", this._resizeHandler);

        if (this.onChange) this.onChange();
    }
};
