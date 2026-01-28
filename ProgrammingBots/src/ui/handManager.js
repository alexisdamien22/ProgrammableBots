let handElement = null;
let trackingInitialized = false;

export function initHandTracking() {
  // Prevent double listeners
  if (trackingInitialized) return;
  trackingInitialized = true;

  handElement = document.getElementById("hand-item");

  if (!handElement) {
    console.warn("hand-item not found (inventory not open yet)");
    return;
  }

  window.addEventListener("mousemove", (e) => {
    if (!handElement || handElement.style.display !== "block") return;

    handElement.style.left = `${e.clientX - 30}px`;
    handElement.style.top = `${e.clientY - 30}px`;
  });
}

export function updateHandVisual(itemData) {
  if (!handElement) return;

  handElement.innerHTML = "";

  if (itemData) {
    handElement.style.display = "block";

    const img = document.createElement("img");
    img.src = `assets/items/${itemData.id}.png`;
    img.classList.add("item-image");

    handElement.appendChild(img);
  } else {
    handElement.style.display = "none";
  }
}
