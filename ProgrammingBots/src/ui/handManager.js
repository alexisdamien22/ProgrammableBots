const handElement = document.getElementById("hand-item");

export function initHandTracking() {
  window.addEventListener("mousemove", (e) => {
    if (handElement.style.display === "block") {
      handElement.style.left = `${e.clientX - 30}px`;
      handElement.style.top = `${e.clientY - 30}px`;
    }
  });
}

export function updateHandVisual(itemData) {
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
