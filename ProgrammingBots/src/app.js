import { loadWorld } from "./world/loadWorld.js";
import { saveWorld } from "./world/saveWorld.js";
import { createWorld } from "./world/createWorld.js";
import { tileSize } from "./world/worldVars.js"
import { camera } from "./core/camera.js";
import { init } from "./mainLoop.js";
import { frame } from "./mainLoop.js";
import { GameState } from "./mainLoop.js";
import { initHandTracking } from "./ui/handManager.js";
import { inventoryState } from "./ui/inventoryManager.js";
import { renderSlotContent } from "./ui/inventoryUI.js";
import { initDatabase, saveGameToDB, loadGameFromDB, listAllSaves, deleteGameFromDB } from "./world/saveDatabase.js";

//for every page to load
function loadPage(pageFn) {
    const app = document.getElementById("app");
    app.innerHTML = "";
    app.appendChild(pageFn());
}

const SaveManager = {
    async loadSaves() {
        return await listAllSaves();
    },

    async addSave(name, seed) {
        const saveData = JSON.parse(localStorage.getItem(`saves:${name}`));
        if (saveData) {
            await saveGameToDB(name, saveData);
            localStorage.removeItem(`saves:${name}`);
        }
    },

    async removeSave(name) {
        await deleteGameFromDB(name);
    },

    async updateLastPlayed(name) {
        const saveData = await loadGameFromDB(name);
        if (saveData) {
            saveData.lastPlayed = new Date().toLocaleDateString("fr-FR");
            await saveGameToDB(name, saveData);
        }
    },

    async getSave(name) {
        const key = `saves:${name}`;
        console.log("Looking for save with key:", key);
        
        // First try IndexedDB
        const dbData = await loadGameFromDB(name);
        if (dbData) {
            console.log("Save found in IndexedDB");
            return dbData;
        }
        
        // Fall back to localStorage (for migration)
        const data = localStorage.getItem(key);
        console.log("Raw data from localStorage:", data ? "exists" : "not found");
        if (data) {
            return JSON.parse(data);
        }
        return null;
    }
};

// --- PAGES ---
function createCreatePage() {
    GameState.currentPage = "CreatePage";
    const root = document.createElement("section");
    root.classList.add("ceateMenu");

    root.innerHTML = `
      <p>Création</p>
      <div class="createParam">
        <form id="createForm">
          <input type="text" id="saveName" class="saveName" placeholder="Nom de la sauvegarde..." />
          <div class="seedSetting">
            <p>Seed du monde</p>
            <input type="number" id="seed" class="seed" placeholder="653356" />
          </div>
          <button class="genSettings" type="button">Paramètres de Génération du monde</button>
          <div class="submit">
            <button class="cancelButton" type="button">Annuler</button>
            <button type="submit" class="submitButton">Créer</button>
          </div>
        </form>
      </div>
  `;

    root.querySelector(".cancelButton").addEventListener("click", () => {
        loadPage(createSavesPage);
    });

    root.querySelector(".genSettings").addEventListener("click", () => {
        alert("Les paramètres avancés ne sont pas encore disponibles");
    });

    root.querySelector("#createForm").addEventListener("submit", async event => {
        event.preventDefault();

        const saveName = document.querySelector("#saveName").value;
        const seedInput = document.querySelector("#seed").value;

        const seed = seedInput ? Number(seedInput) : Date.now();

        // Create world (saves to IndexedDB)
        await createWorld(saveName, seed);
        GameState.currentSaveName = saveName;
        loadPage(createGamePage);

        const { ctx, canvas, camera, then, fpsElement } = await init(seed);

        camera.init(canvas, () => {
            GameState.needsRedraw = true;
        });

        frame(seed, ctx, canvas, camera, tileSize, then, fpsElement);
    });

    return root;
}

function createMainMenu() {
    GameState.currentPage = "MainMenu";
    const root = document.createElement("section");
    root.classList.add("mainMenu");

    root.innerHTML = `
      <img src="assets/ui/logo.png" alt="logo" class="logo" />
      <div class="menu">
        <button id="soloButton" class="greyButton">Solo</button>
        <button id="multiButton" class="greyButton">Multijoueur</button>
        <button id="settingButton" class="greyButton">Paramètres</button>
        <button id="quitButton" class="quitButton">Quitter</button>
      </div>
  `;

    root.querySelector("#soloButton").addEventListener("click", () => {
        loadPage(createSavesPage);
    });

    root.querySelector("#settingButton").addEventListener("click", () => {
        loadPage(createSettingsPage);
    });

    root.querySelector("#multiButton").addEventListener("click", () => {
        alert("Le multijoueur n'est pas encore disponible");
    });

    root.querySelector("#quitButton").addEventListener("click", () => {
        alert("Impossible de quitter depuis un navigateur");
    });

    return root;
}

function createSavesPage() {
    GameState.currentPage = "SavesPage";
    const root = document.createElement("section");
    root.classList.add("savesMenu");

    root.innerHTML = `
      <div class="head">
        <p>Sauvegardes</p>
        <div class="headButtons">
          <button class="createButton">Créer</button>
          <button class="backButton">Retour</button>
        </div>
      </div>

      <div class="saves"></div>

      <div class="custom">
        <button class="suppButton">Supprimer</button>
        <button class="modifButton">Modifier</button>
        <button class="playButton">Jouer</button>
      </div>
  `;

    const container = root.querySelector(".saves");
    const custom = root.querySelector(".custom");

    const suppBtn = root.querySelector(".suppButton");
    const modifBtn = root.querySelector(".modifButton");
    const playBtn = root.querySelector(".playButton");

    // Load saves asynchronously
    SaveManager.loadSaves().then(saves => {
        // --- Génération dynamique des saves ---
        saves.forEach((save, index) => {
            const card = document.createElement("div");
            card.className = "saveCard";
            card.dataset.index = index;

            card.innerHTML = `
        <p>${save.name}</p>
        <p class="saveLastPlayed">Dernière partie : ${save.lastPlayed}</p>
      `;

            // --- Event Listener : sélection d'une save ---
            card.addEventListener("click", () => {
                // Retirer l'ancienne sélection
                root.querySelectorAll(".saveCard").forEach(c => {
                    c.classList.remove("saveCardActive");
                });

                // Ajouter la nouvelle sélection
                card.classList.add("saveCardActive");

                // Activer les boutons
                suppBtn.classList.add("suppButtonActive");
                modifBtn.classList.add("modifButtonActive");
                playBtn.classList.add("playButtonActive");

                // Activer les effets hover/active
                custom.classList.add("customActive");
            });

            container.appendChild(card);
        });

        // --- Bouton Créer ---
        root.querySelector(".createButton").addEventListener("click", () => {
            loadPage(createCreatePage);
        });

        // --- Bouton Retour ---
        root.querySelector(".backButton").addEventListener("click", () => {
            loadPage(createMainMenu);
        });

        // --- Bouton Supprimer ---
        suppBtn.addEventListener("click", async () => {
            const selected = root.querySelector(".saveCardActive");
            if (selected) {
                const saveName = saves[selected.dataset.index].name;
                if (confirm(`Êtes-vous sûr de vouloir supprimer "${saveName}" ?`)) {
                    await SaveManager.removeSave(saveName);
                    loadPage(createSavesPage);
                }
            }
        });

        // --- Bouton Modifier ---
        modifBtn.addEventListener("click", () => {
            alert("La modification n'est pas encore implémentée");
        });

        // --- Bouton Jouer ---
        playBtn.addEventListener("click", async () => {
            const selected = root.querySelector(".saveCardActive");
            console.log("Play button clicked, selected:", selected);
            
            if (!selected) {
                alert("Veuillez sélectionner une sauvegarde");
                return;
            }
            
            const saveName = saves[selected.dataset.index].name;
            console.log("Save name:", saveName);
            
            const saveData = await SaveManager.getSave(saveName);
            console.log("Save data:", saveData);
            
            if (!saveData) {
                alert("Impossible de charger la sauvegarde");
                return;
            }
            
            try {
                await SaveManager.updateLastPlayed(saveName);
                GameState.currentSaveName = saveName;
                loadWorld(saveName);
                loadPage(createGamePage);

                const { ctx, canvas, camera, then, fpsElement } = await init(saveData.seed);

                camera.init(canvas, () => {
                    GameState.needsRedraw = true;
                });

                frame(saveData.seed, ctx, canvas, camera, tileSize, then, fpsElement);
            } catch (err) {
                console.error("Error loading game:", err);
                alert("Erreur lors du chargement du jeu: " + err.message);
            }
        });
    });

    return root;
}

function createSettingsPage() {
    GameState.currentPage = "SettingsPage";
    const root = document.createElement("section");
    root.classList.add("settingMenu");

    root.innerHTML = `
      <button class="backButton">Retour</button>
  `;

    root.querySelector(".backButton").addEventListener("click", () => {
        loadPage(createMainMenu);
    });

    return root;
}

function createGamePage() {
    GameState.currentPage = "GamePage";
    const root = document.createElement("section");
    root.classList.add("gamePage");
    root.innerHTML = `
        <div class="fps">fps: <span id="fps"></span></div>
        <canvas id="grid" width="window.innerWidth" height="window.innerHeight"></canvas>
        <script type="module" src="/src/main.js"></script>
  `;
    return root;
}

function createInventoryUI() {
    const root = document.getElementById("GameMenus");

    // Inject HTML
    root.innerHTML = `
        <div class="inventory-overlay">
            <div class="inventory-panel">
                <h2 class="inventory-title">Inventaire</h2>
                <div class="inventory-grid" id="inventoryGrid"></div>
            </div>
            <div id="hand-item"></div>
        </div>
    `;

    const gridContainer = root.querySelector("#inventoryGrid");

    // Generate slots
    inventoryState.slots.forEach((item, index) => {
        const slot = document.createElement("div");
        slot.classList.add("slot");
        slot.dataset.index = index;

        renderSlotContent(slot, item);

        slot.addEventListener("click", () => {
            const { newSlotItem, newHandItem } = swapItemWithHand(index);
            renderSlotContent(slot, newSlotItem);
            updateHandVisual(newHandItem);
        });

        gridContainer.appendChild(slot);
    });
}

function closeInventoryUI() {
    const root = document.getElementById("GameMenus");
    if (!root) return;

    // Remove inventory UI
    root.innerHTML = "";

    // Reset inventory state
    GameState.inventoryOpen = false;

    // Hide hand item safely
    const hand = document.getElementById("hand-item");
    if (hand) {
        hand.innerHTML = "";
        hand.style.display = "none";
    }
}

function openEscMenu() {
    const root = document.getElementById("GameMenus");
    if (!root) return;

    // Inject HTML
    root.innerHTML = `
      <div class="esc">
        <button id="backToGameButton" class="greyButton">Retour au Jeu</button>
        <button id="settingButton" class="greyButton">Paramètres</button>
        <button id="backToMenuButton" class="backToMenuButton">Retourner au menu et sauvegarder</button>
      </div>
    `;

    console.log("Esc menu opened");

    // Button event
    root.querySelector("#backToGameButton").addEventListener("click",() => {
        GameState.escMenuOpen = false;
        closeEscMenu();
    });

    root.querySelector("#settingButton").addEventListener("click",() => {
        alert("Les paramètres avancés ne sont pas encore disponibles");
    });

    root.querySelector("#backToMenuButton").addEventListener("click", async () => {
        if (GameState.currentSaveName) {
            await saveWorld(GameState.currentSaveName);
            console.log(`Game saved: ${GameState.currentSaveName}`);
        }
        GameState.escMenuOpen = false;
        GameState.currentSaveName = null;
        loadPage(createMainMenu);
    });


    // Optional: click outside panel closes menu
    root.addEventListener("click", (event) => {
        if (event.target.id === "GameMenus") {
            GameState.escMenuOpen = false;
            closeEscMenu();
        }
    });
}

function closeEscMenu() {
    const root = document.getElementById("GameMenus");
    if (!root) return;

    // Clear HTML
    root.innerHTML = "";
}

function toggleInventory() {
    if (!GameState.inventoryOpen) {
        createInventoryUI();
        initHandTracking();
        GameState.inventoryOpen = true;
    } else {
        closeInventoryUI();
        GameState.inventoryOpen = false;
    }
}

function toggleEscMenu() {
    if (!GameState.escMenuOpen) {
        openEscMenu();
        GameState.escMenuOpen = true;
    } else {
        closeEscMenu();
        GameState.escMenuOpen = false;
    }
}

document.addEventListener("keydown", (event) => {
    if (GameState.currentPage !== "GamePage") return;

    if (event.key.toLowerCase() === "e") {
        toggleInventory();
        return;
    }

    if (event.key === "Escape") {
        if (GameState.inventoryOpen) toggleInventory();
        else toggleEscMenu();
    }
});

loadPage(createMainMenu);
