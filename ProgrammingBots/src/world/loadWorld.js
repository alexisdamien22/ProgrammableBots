import { Chunks } from "./chunks.js";

export function loadWorld(saveName) {
    const json = localStorage.getItem(`saves:${saveName}`);
    if (!json) {
        console.warn("Save not found:", saveName);
        return;
    }

    const saveData = JSON.parse(json);

    Chunks.clearAll();

    for (const data of saveData.chunks) {
        const chunk = Chunks.create(data.cx, data.cy);
        chunk.grid = data.grid;
    }

    console.log(`World loaded from "${saveName}" with ${saveData.chunks.length} chunks`);
}