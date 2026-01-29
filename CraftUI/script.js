// --- NOTRE STOCK (Noms complets restaurés) ---
const inventaire = {
  avitrineBrut: 0,
  helioniteBrut: 0,
  noxaliteBrut: 0,
  ferBrut: 0,
  cuivreBrut: 0,
  avitrine: 0,
  helionite: 0,
  noxalite: 0,
  LingotdeFer: 0,
  LingotdeCuivre: 0,
  CartoucheVide: 0,
  Filtre: 0,
  MicroMoteur: 0,
  Fourneau: 0,
  BacdeStockage: 0,
  PanneauSolaire: 0,
  StationdeRecharge: 0,
  Chenilles: 0,
  Helice: 0,
  BrasForeuse: 0,
  MasqueaGaz: 0,
  ModuleStockage: 0,
  ModuleMinage: 0,
  ModuleVitesse: 0,
  ModuleBatterie: 0,
  KitMedical: 0,
};

// --- NOS RECETTES ---
const recettes = [
  {
    id: "CartoucheVide",
    nom: "Cartouche Vide",
    niv: 2,
    prix: { LingotdeFer: 2, LingotdeCuivre: 1 },
    img: "cartouchevide.png",
  },
  {
    id: "Filtre",
    nom: "Filtre",
    niv: 2,
    prix: { helionite: 2, noxalite: 1 },
    img: "filtre.png",
  },
  {
    id: "MicroMoteur",
    nom: "Micro-Moteur",
    niv: 2,
    prix: { LingotdeFer: 1, LingotdeCuivre: 2, avitrine: 1 },
    img: "micro-moteur.png",
  },
  {
    id: "Fourneau",
    nom: "Fourneau",
    niv: 3,
    prix: { LingotdeFer: 4 },
    img: "fourneauallume.png",
  },
  {
    id: "BacdeStockage",
    nom: "Bac de Stockage",
    niv: 3,
    prix: { LingotdeFer: 3, noxalite: 2 },
    img: "stockage.png",
  },
  {
    id: "PanneauSolaire",
    nom: "Panneau Solaire",
    niv: 3,
    prix: { LingotdeCuivre: 2, helionite: 3 },
    img: "panneausolaire.png",
  },
  {
    id: "StationdeRecharge",
    nom: "Station de Recharge",
    niv: 3,
    prix: { LingotdeFer: 4, LingotdeCuivre: 2 },
    img: "Stationderecharge.png",
  },
  {
    id: "Chenilles",
    nom: "Chenilles",
    niv: 3,
    prix: { MicroMoteur: 2, LingotdeFer: 1 },
    img: "chenille.png",
  },
  {
    id: "Helice",
    nom: "Hélice",
    niv: 3,
    prix: { MicroMoteur: 2, LingotdeCuivre: 1 },
    img: "hélice.png",
  },
  {
    id: "BrasForeuse",
    nom: "Bras Foreuse",
    niv: 3,
    prix: { MicroMoteur: 1, noxalite: 4 },
    img: "brasforeuse.png",
  },
  {
    id: "MasqueaGaz",
    nom: "Masque à Gaz",
    niv: 3,
    prix: { Filtre: 1, LingotdeCuivre: 2 },
    img: "masqueagaz.png",
  },
  {
    id: "ModuleStockage",
    nom: "Module Stockage",
    niv: 3,
    prix: { CartoucheVide: 1, noxalite: 4 },
    img: "cartouche3.png",
  },
  {
    id: "ModuleMinage",
    nom: "Module Minage",
    niv: 3,
    prix: { CartoucheVide: 1, LingotdeCuivre: 4, noxalite: 2 },
    img: "cartouche4.png",
  },
  {
    id: "ModuleVitesse",
    nom: "Module Vitesse",
    niv: 3,
    prix: { CartoucheVide: 1, helionite: 4 },
    img: "cartouche2.png",
  },
  {
    id: "ModuleBatterie",
    nom: "Module Batterie",
    niv: 3,
    prix: { CartoucheVide: 1, avitrine: 4 },
    img: "cartouche1.png",
  },
  {
    id: "KitMedical",
    nom: "KIT MÉDICAL",
    niv: 4,
    prix: { CartoucheVide: 2, Filtre: 2, avitrine: 4 },
    img: "kitmedical.png",
  },
];

function fabriquer(idDemande) {
  const recette = recettes.find((r) => r.id === idDemande);
  if (!recette) return;

  // Vérification des ressources
  let assezDeRessources = true;
  for (let ingredient in recette.prix) {
    if ((inventaire[ingredient] || 0) < recette.prix[ingredient]) {
      assezDeRessources = false;
      break;
    }
  }

  // Action
  if (assezDeRessources) {
    for (let ingredient in recette.prix) {
      inventaire[ingredient] -= recette.prix[ingredient];
    }
    inventaire[idDemande]++;
    log(`+1 ${recette.nom} assemblé`, "success");
    majUI();
  } else {
    log(`Ressources insuffisantes pour ${recette.nom}`, "error");
  }
}

function majUI() {
  const conteneur = document.getElementById("inventory-list");
  conteneur.innerHTML = "";
  for (let objetID in inventaire) {
    if (inventaire[objetID] > 0) {
      conteneur.innerHTML += `<div class="inv-item"><span>${objetID}</span> <strong>${inventaire[objetID]}</strong></div>`;
    }
  }
}

function log(msg, type) {
  const l = document.getElementById("logs");
  l.innerHTML = `<div class="${type}"> > ${msg}</div>` + l.innerHTML;
}

function init() {
  recettes.forEach((r) => {
    const grid = document.getElementById("grid-level-" + r.niv);
    let texteCout = "";
    for (let ing in r.prix) {
      texteCout += `${r.prix[ing]} ${ing}<br>`;
    }

    grid.innerHTML += `
      <div class="craft-tile" onclick="fabriquer('${r.id}')">
        <div class="img-container">
          <img src="images/${r.img}" alt="${r.nom}" onerror="this.src='https://via.placeholder.com/60?text=OBJET'">
        </div>
        <div class="tooltip">
          <strong>${r.nom}</strong><br>
          <span class="cost">${texteCout}</span>
        </div>
      </div>`;
  });
  majUI();
}

init();
