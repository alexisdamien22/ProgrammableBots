import { Noise } from "./noise.js";
import { addAssetToGrid } from "../core/grid.js";

export function generateTerrainPerChunk(grid, cx, cy, chunkSize, seed = 1) {
    const temperatureNoise = new Noise(seed);
    const humidityNoise = new Noise(seed+50);
    const terrainNoise = new Noise(seed + 100); // détails sol
    const waterNoise   = new Noise(seed + 200); // lacs/rivières pour plaine/forêt
    const acidNoise   = new Noise(seed + 300);  // lacs d'acide

    const biomeScale = 0.1;
    const terrainScale = 0.01;    // détails du sol
    const waterScale   = 0.09;    // détails des lacs/rivières
    const acidScale  = 0.2;       // détails des lacs d'acide
    const waterThreshold = -0.2;  // seuil pour eau
    const acidThreshold  = -0.2;   // seuil pour acid
    const temperatureScale = 0.04;  // grandes zones
    const humidityScale  = 0.07;  // plus de variation   

    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            const wx = cx * chunkSize + x; // world X
        const wy = cy * chunkSize + y; // world Y

            const temperature = temperatureNoise.perlin(wx * temperatureScale * biomeScale, wy * temperatureScale  * biomeScale);
            const humidity = humidityNoise.perlin(wx * humidityScale  * biomeScale, wy * humidityScale  * biomeScale);

            let biome;
            if (temperature < 0.4 && humidity < 0.01) biome = "plain";
            else if (temperature < 0.4 && humidity >= 0.01) biome = "forest";
            else biome = "acid";

            // bruit pour le sol
            const t = terrainNoise.perlin(wx * terrainScale, wy * terrainScale);

            let type;

            if (biome === "plain" || biome === "forest") {
                // Lacs/rivières partagés
                const w = waterNoise.perlin(wx * waterScale, wy * waterScale);
                if (w < waterThreshold) {
                    type = biome === "plain" ? "water_blue" : "water_red";
                } else {
                    type = biome === "plain" ? "grass_blue" : "grass_red";
                }
            } else if (biome === "acid") {
                const a = acidNoise.perlin(wx * acidScale, wy * acidScale);
                if (a < acidThreshold) type = "acid_lake";
                else type = "acid_ground";
            }

            addAssetToGrid(grid, {
                type,
                origin: { x: wx, y: wy },
                localOffset: { dx: 0, dy: 0 }
            }, x, y);
        }
    }
}