export const inventoryState = {
  slots: new Array(32).fill(null),
  itemInHand: null,
};

export function setItemInSlot(index, itemData) {
  if (index >= 0 && index < inventoryState.slots.length) {
    inventoryState.slots[index] = itemData;
  }
}

export function swapItemWithHand(index) {
  const itemInSlot = inventoryState.slots[index];
  const itemInHand = inventoryState.itemInHand;

  inventoryState.slots[index] = itemInHand;
  inventoryState.itemInHand = itemInSlot;

  return {
    newSlotItem: inventoryState.slots[index],
    newHandItem: inventoryState.itemInHand,
  };
}
