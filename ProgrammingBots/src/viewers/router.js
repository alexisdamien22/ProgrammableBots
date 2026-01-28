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
          <button class="genSettings">Paramètres de Génération du monde</button>
          <div class="submit">
            <button class="cancelButton"><a href="saves.html">Annuler</a></button>
            <button type="submit" class="submitButton">Créer</button>
          </div>
        </form>
      </div>
    </section>
  `;

    const form = root.querySelector("#createForm");

    form.addEventListener("submit", e => {
        e.preventDefault();

        const name = root.querySelector("#saveName").value;
        const seed = root.querySelector("#seed").value;

        SaveManager.addSave(name, seed);

        // Redirection interne
        loadPage(createSavesPage);
    });

    return root;
}


function createEscMenu() {
    const root = document.createElement("div");
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
    const root = document.createElement("div");
    root.innerHTML = `
    <section class="mainMenu">
      <img src="assets/logo.png" alt="logo" class="logo" />
      <div class="menu">
        <button id="soloButton" class="greyButton">
          <a href="saves.html">Solo</a>
        </button>
        <button id="multiButton" class="greyButton">Multijoueur</button>
        <button id="settingButton" class="greyButton">
          <a href="settings.html">Paramètres</a>
        </button>
        <button id="quitButton" class="quitButton">Quitter</button>
      </div>
    </section>
  `;
    return root;
}

function createSavesPage() {
    const root = document.createElement("div");

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

    saves.forEach(save => {
        const card = document.createElement("div");
        card.className = "saveCard";
        card.innerHTML = `
      <p>${save.name}</p>
      <p>Dernière partie : ${save.lastPlayed}</p>
    `;
        container.appendChild(card);
    });

    root.querySelector(".createButton").addEventListener("click", () => {
        loadPage(createCreatePage);
    });

    root.querySelector(".backButton").addEventListener("click", () => {
        loadPage(createMainMenu);
    });

    return root;
}

function createSettingsPage() {
    const root = document.createElement("div");
    root.innerHTML = `
    <section class="settingMenu">
      <div></div>
      <button><a href="index.html">Retour</a></button>
    </section>
  `;
    return root;
}

function createGamePage() {
    const root = document.createElement("div");
    root.innerHTML = `
    <section class="gamePage">
        <div class="fps">fps: <span id="fps"></span></div>
        <canvas id="grid" width="window.innerWidth" height="window.innerHeight"></canvas>
        <script type="module" src="/src/main.js"></script>
    </section>
  `;
    return root;
}
