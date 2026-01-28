// Fonction pour créer l'élément visuel d'un item
export function createItemElement(itemName) {
  const img = document.createElement("img");
  img.classList.add("item");
  // On pointe vers ton dossier public
  img.src = `assets/items/${itemName}.png`;
  img.draggable = false; // Car on utilise ton système de clic
  return img;
}