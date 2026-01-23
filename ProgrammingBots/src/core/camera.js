export const camera = {
    zoom: 1,
    offsetX: 0,
    offsetY: 0,
    isDragging: false,
    lastX: 0,
    lastY: 0,
    zoomFactor: 1.1,

    init(canvas, onChange) {
        this.offsetX = canvas.width / 2;
        this.offsetY = canvas.height / 4;

        canvas.addEventListener("wheel", e => {
            e.preventDefault();
            this.zoom *= e.deltaY < 0 ? this.zoomFactor : 1 / this.zoomFactor;
            this.zoom = Math.max(0.1, Math.min(this.zoom, 5));
            onChange();
        });

        canvas.addEventListener("mousedown", e => {
            this.isDragging = true;
            this.lastX = e.clientX;
            this.lastY = e.clientY;
        });

        canvas.addEventListener("mousemove", e => {
            if (!this.isDragging) return;
            this.offsetX += e.clientX - this.lastX;
            this.offsetY += e.clientY - this.lastY;
            this.lastX = e.clientX;
            this.lastY = e.clientY;
            onChange();
        });

        canvas.addEventListener("mouseup", () => this.isDragging = false);
        canvas.addEventListener("mouseleave", () => this.isDragging = false);

        window.addEventListener("resize", () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            onChange();
        });
    }
};
