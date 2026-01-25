import { createGrid } from "../core/grid.js";
import { CHUNK_SIZE } from "./worldVars.js";

export class Chunks {
    static chunks = new Map();

    static key(cx, cy) {
        return `${cx},${cy}`;
    }

    static has(cx, cy) {
        return Chunks.chunks.has(Chunks.key(cx, cy));
    }

    static get(cx, cy) {
        return Chunks.chunks.get(Chunks.key(cx, cy));
    }

    static create(cx, cy) {
        const grid = createGrid(CHUNK_SIZE, CHUNK_SIZE);
        const chunk = { cx, cy, grid };
        Chunks.chunks.set(Chunks.key(cx, cy), chunk);
        return chunk;
    }

    static getAllChunks() {
        return Chunks.chunks.values();
    }
}
