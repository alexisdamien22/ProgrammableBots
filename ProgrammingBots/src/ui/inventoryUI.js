import { inventoryState, swapItemWithHand } from "./inventoryManager.js";
import { updateHandVisual } from "./handManager.js";

export function initInventoryUI(container) {
  container.innerHTML = ""; // Nettoyage

  inventoryState.slots.forEach((item, index) => {
    const slot = document.createElement("div");
    slot.classList.add("slot");
    slot.dataset.index = index;

    // Si un item existe déjà au chargement (ex: save game)
    renderSlotContent(slot, item);

    slot.addEventListener("click", () => {
      const { newSlotItem, newHandItem } = swapItemWithHand(index);

      // Mise à jour visuelle du slot et de la main
      renderSlotContent(slot, newSlotItem);
      updateHandVisual(newHandItem);
    });

    container.appendChild(slot);
  });
}

function renderSlotContent(slotElement, itemData) {
  slotElement.innerHTML = "";
  if (itemData) {
    const img = document.createElement("img");
    img.src = `assets/items/${itemData.id}.png`;
    img.classList.add("item-image");
    slotElement.appendChild(img);
  }
}
