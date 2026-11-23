export interface CartItem {
  _id: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
}

const CART_KEY = "pizzahub_cart";

export function getCartItems(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCartItems(items: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("cart-updated"));
}

export function addToCartStorage(newItem: Omit<CartItem, "quantity">, quantity = 1) {
  const current = getCartItems();
  const existingIndex = current.findIndex((i) => i._id === newItem._id);

  if (existingIndex > -1) {
    current[existingIndex].quantity += quantity;
  } else {
    current.push({ ...newItem, quantity });
  }

  saveCartItems(current);
  return current;
}

export function removeFromCartStorage(id: string) {
  const updated = getCartItems().filter((i) => i._id !== id);
  saveCartItems(updated);
  return updated;
}

export function getCartTotalCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}


