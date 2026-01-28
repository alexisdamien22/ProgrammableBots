import { loadWorld } from "./world/loadWorld.js";
import { saveWorld } from "./world/saveWorld.js";
import { createWorld } from "./world/createWorld.js";
import { tileSize } from "./world/worldVars.js"
import { camera } from "./core/camera.js";
import { init } from "./mainLoop.js";
import { frame } from "./mainLoop.js";
import { GameState } from "./mainLoop.js";

//for every page to load
function loadPage(pageFn) {
    const app = document.getElementById("app");
    app.innerHTML = "";
    app.appendChild(pageFn());
}

const SaveManager = {
    loadSaves() {
        return JSON.parse(localStorage.getItem("saves") || "[]");
    },

    saveAll(saves) {
        localStorage.setItem("saves", JSON.stringify(saves));
    },

    addSave(name, seed) {
        const saves = this.loadSaves();
        saves.push({
            name,
            seed,
            lastPlayed: new Date().toLocaleDateString("fr-FR")
        });
        this.saveAll(saves);
    }
};

// --- PAGES ---
function createCreatePage() {
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

  root.querySelector("#createForm").addEventListener("submit", (event) => {
    event.preventDefault();

        createWorld(saveName, seed);
        loadPage(createGamePage);

        const { ctx, canvas, camera, then, fpsElement } = await init(seed);

        camera.init(canvas, () => {
            GameState.needsRedraw = true;
        });

        frame(seed, ctx, canvas, camera, tileSize, then, fpsElement);
    });

    return root;
}

function createEscMenu() {
    const root = document.createElement("section");
    root.classList.add("escMenu");

    root.innerHTML = `
      <div class="esc">
        <button id="backToGameButton" class="greyButton">Retour au Jeu</button>
        <button id="settingButton" class="greyButton">
          <a href="settings.html">Paramètres</a>
        </button>
        <button id="backToMenuButton" class="backToMenuButton">
          <a href="index.html">Retourner au menu et sauvegarder</a>
        </button>
      </div>
  `;
    return root;
}

function createMainMenu() {
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
    const root = document.createElement("section");
    root.classList.add("savesMenu");
    const saves = SaveManager.loadSaves();

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
    suppBtn.addEventListener("click", () => {
        const selected = root.querySelector(".saveCardActive");
        if (selected) {
            const index = selected.dataset.index;
            const saves = SaveManager.loadSaves();
            saves.splice(index, 1);
            SaveManager.saveAll(saves);

            loadPage(createSavesPage);
        }
    });

    // --- Bouton Modifier ---
    modifBtn.addEventListener("click", () => {
        alert("La modification n'est pas encore implémentée");
    });

    // --- Bouton Jouer ---
    playBtn.addEventListener("click", () => {
        const selected = root.querySelector(".saveCardActive");
        if (selected) {
            alert("Chargement de la partie...");
        }
    });

    return root;
}

function createSettingsPage() {
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
    const root = document.createElement("section");
    root.classList.add("gamePage");
    root.innerHTML = `
        <div class="fps">fps: <span id="fps"></span></div>
        <canvas id="grid" width="window.innerWidth" height="window.innerHeight"></canvas>
        <script type="module" src="/src/main.js"></script>
  `;
    return root;
}

// function createInventoryUI() {
//   const root = document.getElementById("app");

//   // 1. On injecte la structure HTML
//   root.innerHTML = `
//     <div class="inventory-overlay">
//       <div class="inventory-panel">
//         <h2 class="inventory-title">Inventaire</h2>
//         <div class="inventory-grid" id="inventoryGrid"></div>
//       </div>
//       <div id="hand-item"></div>
//     </div>
//   `;

//   const gridContainer = root.querySelector("#inventoryGrid");

//   // 2. Initialisation du suivi de souris (main)
//   initHandTracking();

//   // 3. Génération dynamique des slots
//   inventoryState.slots.forEach((item, index) => {
//     const slot = document.createElement("div");
//     slot.classList.add("slot");
//     slot.dataset.index = index;

//     // Affiche l'item s'il y en a un au départ
//     renderSlotContent(slot, item);

//     // Event de clic pour prendre/poser
//     slot.addEventListener("click", () => {
//       const { newSlotItem, newHandItem } = swapItemWithHand(index);

//       renderSlotContent(slot, newSlotItem);
//       updateHandVisual(newHandItem);
//     });

//     gridContainer.appendChild(slot);
//   });

//   // Optionnel : Fermer l'inventaire avec la touche 'E' ou 'Echap'
//   const handleKeyDown = (e) => {
//     if (e.key.toLowerCase() === "e" || e.key === "Escape") {
//       // Logique pour retourner au jeu (ex: loadPage(mainLoop))
//       document.removeEventListener("keydown", handleKeyDown);
//     }
//   };
//   document.addEventListener("keydown", handleKeyDown);

//   return root;
// }

// const inventoryContainer = document.querySelector(".inventory-grid");
// initInventory(inventoryContainer);

// initHandTracking();

// setItemInSlot(0, { id: "ironOre", name: "Iron Ore" });
// setItemInSlot(1, { id: "copperIngot", name: "Copper Ingot" });

// const gridContainer = document.querySelector(".inventory-grid");
// if (gridContainer) {
//   initInventoryUI(gridContainer);
// }

loadPage(createMainMenu);
