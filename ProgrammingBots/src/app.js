import { loadWorld } from "./world/loadWorld.js";
import { saveWorld } from "./world/saveWorld.js";

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
      lastPlayed: new Date().toLocaleDateString("fr-FR"),
    });
    this.saveAll(saves);
  },
};

// --- PAGES ---
function createCreatePage() {
  const root = document.createElement("div");

  root.innerHTML = `
    <section class="ceateMenu">
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
    </section>
  `;

  root.querySelector(".cancelButton").addEventListener("click", () => {
    loadPage(createSavesPage);
  });

  root.querySelector(".genSettings").addEventListener("click", () => {
    alert("Les paramètres avancés ne sont pas encore disponibles");
  });

  root.querySelector("#createForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const name = root.querySelector("#saveName").value;
    const seed = root.querySelector("#seed").value;

    if (!name) return alert("Entre un nom de sauvegarde");

    SaveManager.addSave(name, seed);
    loadPage(createSavesPage);
  });

  return root;
}

function createEscMenu() {
  const root = document.getElementById("app");
  root.innerHTML = `
    <section class="escMenu">
      <div class="esc">
        <button id="backToGameButton" class="greyButton">Retour au Jeu</button>
        <button id="settingButton" class="greyButton">
          <a href="settings.html">Paramètres</a>
        </button>
        <button id="backToMenuButton" class="backToMenuButton">
          <a href="index.html">Retourner au menu et sauvegarder</a>
        </button>
      </div>
    </section>
  `;
  return root;
}

function createMainMenu() {
  const root = document.getElementById("app");

  root.innerHTML = `
    <section class="mainMenu">
      <img src="assets/ui/logo.png" alt="logo" class="logo" />
      <div class="menu">
        <button id="soloButton" class="greyButton">Solo</button>
        <button id="multiButton" class="greyButton">Multijoueur</button>
        <button id="settingButton" class="greyButton">Paramètres</button>
        <button id="quitButton" class="quitButton">Quitter</button>
      </div>
    </section>
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
  const root = document.getElementById("app");
  const saves = SaveManager.loadSaves();

  root.innerHTML = `
    <section class="savesMenu">
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
    </section>
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
      root.querySelectorAll(".saveCard").forEach((c) => {
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
  const root = document.getElementById("app");

  root.innerHTML = `
    <section class="settingMenu">
      <button class="backButton">Retour</button>
    </section>
  `;

  root.querySelector(".backButton").addEventListener("click", () => {
    loadPage(createMainMenu);
  });

  return root;
}

function createGamePage() {
  const root = document.getElementById("app");
  root.innerHTML = `
    <section class="gamePage">
        <div class="fps">fps: <span id="fps"></span></div>
        <canvas id="grid" width="window.innerWidth" height="window.innerHeight"></canvas>
        <script type="module" src="/src/main.js"></script>
    </section>
  `;
  return root;
}

loadPage(createMainMenu);
