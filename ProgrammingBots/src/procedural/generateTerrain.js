import { Noise } from "./noise.js";
import { addAssetToGrid } from "../core/grid.js";

export function generateTerrain(grid, seed = 1) {
    const biomeNoise = new Noise(seed);
    const terrainNoise = new Noise(seed + 100); // détails sol
    const waterNoise   = new Noise(seed + 200); // lacs/rivières pour plaine/forêt

    const biomeScale   = 0.01;   // taille des biomes
    const terrainScale = 0.01;    // détails du sol
    const waterScale   = 0.09;    // détails des lacs/rivières
    const waterThreshold = -0.2;  // seuil pour eau
    const acidThreshold  = 0.15;  // seuil pour acid

    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {

            const b = biomeNoise.perlin(x * biomeScale, y * biomeScale);

            let biome;
            if (b < 0.33) biome = "plain";
            else if (b < 0.66) biome = "forest";
            else biome = "acid";

            // bruit pour le sol
            const t = terrainNoise.perlin(x * terrainScale, y * terrainScale);

            let type;

            if (biome === "plain" || biome === "forest") {
                // Lacs/rivières partagés
                const w = waterNoise.perlin(x * waterScale, y * waterScale);
                if (w < waterThreshold) {
                    type = biome === "plain" ? "water_blue" : "water_red";
                } else {
                    type = biome === "plain" ? "grass_blue" : "grass_red";
                }
            } else if (biome === "acid") {
                // zone acide a ses propres lacs
                if (t < acidThreshold) type = "acid_lake";
                else type = "acid_ground";
            }

            addAssetToGrid(grid, {
                type,
                origin: { x, y },
                localOffset: { dx: 0, dy: 0 }
            }, x, y);
        }
    }
}