import { Noise } from "./noise.js";
import { addAssetToGrid } from "../core/grid.js";

export function generateTerrainPerChunk(grid, cx, cy, chunkSize, seed = 1) {
    const temperatureNoise = new Noise(seed);
    const humidityNoise = new Noise(seed + 50);
    const waterNoise = new Noise(seed + 200); // lacs/rivières pour plaine/forêt
    const acidNoise = new Noise(seed + 300);  // lacs d'acide
    const copperNoise = new Noise(seed + 400); // minerais de "copper"
    const ironNoise = new Noise(seed + 500); // minerais d'"iron"
    const rareOreNoise = new Noise(seed + 600); // génération de minerais rares
    const forestNoise = new Noise(seed + 700); // génération de minerais rares

    const ironScale = 0.1;
    const forestScale = 0.2;
    const copperScale = 0.05;
    const rareOreScale = 0.05;
    const ironThreshold = -0.5;
    const copperThreshold = -0.5;
    const rareOreThreshold = -0.72;
    const forestThreshold = 0.3;
    const biomeScale = 0.1;
    const waterScale = 0.05;    // détails des lacs/rivières
    const acidScale = 0.2;       // détails des lacs d'acide
    const waterThreshold = -0.4;  // seuil pour eau
    const acidThreshold = -0.2;   // seuil pour acid
    const temperatureScale = 0.04;  // grandes zones
    const humidityScale = 0.07;  // plus de variation   

    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            const wx = cx * chunkSize + x; // world X
            const wy = cy * chunkSize + y; // world Y

            const temperature = temperatureNoise.perlin(wx * temperatureScale * biomeScale, wy * temperatureScale * biomeScale);
            const humidity = humidityNoise.perlin(wx * humidityScale * biomeScale, wy * humidityScale * biomeScale);

            let biome;
            if (temperature < 0.4 && humidity < 0.01) biome = "plain";
            else if (temperature < 0.4 && humidity >= 0.01) biome = "forest";
            else biome = "acid";

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

            const tileType = type;

            addAssetToGrid(grid, {
                type,
                origin: { x: wx, y: wy },
                localOffset: { dx: 0, dy: 0 }
            }, x, y);

            if (tileType === "acid_ground" || tileType === "grass_blue" || tileType === "grass_red") {
                const copper = copperNoise.perlin(wx * copperScale, wy * copperScale);
                const iron = ironNoise.perlin(wx * ironScale, wy * ironScale);

                if (biome === "acid") {
                    const rareOre = rareOreNoise.perlin(wx * rareOreScale, wy * rareOreScale);
                    if (rareOre < rareOreThreshold) {
                        type = "helionite";
                    }
                } else if (biome === "forest") {
                    const rareOre = rareOreNoise.perlin(wx * rareOreScale, wy * rareOreScale);
                    if (rareOre < rareOreThreshold) {
                        type = "noxalite";
                    }
                }

                if (iron < ironThreshold) {
                    type = "iron";
                }
                else if (copper < copperThreshold) {
                    type = "copper";
                }

                addAssetToGrid(grid, {
                    type,
                    origin: { x: wx, y: wy },
                    localOffset: { dx: 0, dy: 0 }
                }, x, y);
            }

            if (tileType === "grass_red") {
                const forest = forestNoise.perlin(wx * forestScale, wy * forestScale);
                const typeOfTree = forestNoise.random2D(wx * forestScale, wy * forestScale, seed + 700);

                if (forest < forestThreshold) {
                    if (typeOfTree < -0.8) {
                        type = "tree_1_1";
                    } else if (typeOfTree < -0.7) {
                        type = "tree_1_2";
                    } else if (typeOfTree < -0.1) {
                        type = "tree_2_1";
                    } else if (typeOfTree < 0.1) {
                        type = "tree_2_2";
                    } else if (typeOfTree < 0.3) {
                        type = "tree_3_1";
                    } else if (typeOfTree < 0.7) {
                        type = "tree_3_2";
                    } else {
                        type = null
                    }
                }

                if (type !== null) {
                    addAssetToGrid(grid, {
                        type,
                        origin: { x: wx, y: wy },
                        localOffset: { dx: 0, dy: 0 }
                    }, x, y);
                }
            }
        }
    }
}