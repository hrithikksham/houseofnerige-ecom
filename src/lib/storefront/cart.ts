export type CartItem = {
  productId: string;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  image: string | null;
};

const CART_STORAGE_KEY = "nerige-cart";

function isBrowser() {
  return typeof window !== "undefined";
}

export function getCart(): CartItem[] {
  if (!isBrowser()) {
    return [];
  }

  try {
    const storedCart = localStorage.getItem(
      CART_STORAGE_KEY
    );

    if (!storedCart) {
      return [];
    }

    const cart = JSON.parse(storedCart);

    return Array.isArray(cart) ? cart : [];
  } catch {
    return [];
  }
}

export function saveCart(cart: CartItem[]) {
  if (!isBrowser()) {
    return;
  }

  localStorage.setItem(
    CART_STORAGE_KEY,
    JSON.stringify(cart)
  );

  window.dispatchEvent(
    new Event("nerige-cart-updated")
  );
}

export function getCartItemCount() {
  return getCart().reduce(
    (total, item) => total + item.quantity,
    0
  );
}

export function addToCart(
  item: CartItem,
  maxQuantity: number
) {
  const cart = getCart();

  const existingItemIndex = cart.findIndex(
    (cartItem) =>
      cartItem.productId === item.productId
  );

  if (existingItemIndex >= 0) {
    cart[existingItemIndex] = {
      ...cart[existingItemIndex],
      quantity: Math.min(
        cart[existingItemIndex].quantity +
          item.quantity,
        maxQuantity
      ),
    };
  } else {
    cart.push({
      ...item,
      quantity: Math.min(
        item.quantity,
        maxQuantity
      ),
    });
  }

  saveCart(cart);

  return cart;
}

export function updateCartItemQuantity(
  productId: string,
  quantity: number
) {
  const cart = getCart();

  const updatedCart = cart
    .map((item) =>
      item.productId === productId
        ? {
            ...item,
            quantity,
          }
        : item
    )
    .filter((item) => item.quantity > 0);

  saveCart(updatedCart);

  return updatedCart;
}

export function removeFromCart(
  productId: string
) {
  const updatedCart = getCart().filter(
    (item) => item.productId !== productId
  );

  saveCart(updatedCart);

  return updatedCart;
}

export function clearCart() {
  if (!isBrowser()) {
    return;
  }

  localStorage.removeItem(CART_STORAGE_KEY);

  window.dispatchEvent(
    new Event("nerige-cart-updated")
  );
}