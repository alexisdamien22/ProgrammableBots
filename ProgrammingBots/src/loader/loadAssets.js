import { assets } from "../core/assets.js";

export async function loadAssets() {
    const metaFiles = [
        "./assets/meta/tiles.json",
        "./assets/meta/objects.json",
        "./assets/meta/units.json"
    ];

    for (const file of metaFiles) {
        try {
            const res = await fetch(file);
            if (!res.ok) {
                console.warn("Impossible de charger :", file);
                continue;
            }

            const data = await res.json();

            for (const name in data) {
                const a = data[name];
                assets.load(name, "./assets/" + a.src, a.w, a.h);
            }

        } catch (err) {
            console.error("Erreur lors du chargement de", file, err);
        }
    }
}