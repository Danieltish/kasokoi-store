"use client";

import {
  createContext,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export type CartItem = {
  slug: string;
  name: string;
  brand: string;
  priceKes: number;
  image: string | null;
  stock: number;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotalKes: number;
  hydrated: boolean;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (slug: string) => void;
  setQuantity: (slug: string, quantity: number) => void;
  clear: () => void;
};

const STORAGE_KEY = "kasokoi-cart-v1";

const EMPTY: CartItem[] = [];
const listeners = new Set<() => void>();

let items: CartItem[] = EMPTY;
let initialized = false;

const CartContext = createContext<CartContextValue | null>(null);

function isCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== "object") {
    return false;
  }

  const item = value as Partial<CartItem>;

  return (
    typeof item.slug === "string" &&
    typeof item.name === "string" &&
    typeof item.brand === "string" &&
    typeof item.priceKes === "number" &&
    typeof item.stock === "number" &&
    typeof item.quantity === "number" &&
    item.quantity > 0
  );
}

function clampQuantity(quantity: number, stock: number) {
  const limit = Math.max(1, stock);

  return Math.min(Math.max(1, Math.floor(quantity)), limit);
}

function readStorage(): CartItem[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return EMPTY;
    }

    const parsed: unknown = JSON.parse(raw);

    return Array.isArray(parsed) ? parsed.filter(isCartItem) : EMPTY;
  } catch {
    return EMPTY;
  }
}

function ensureInitialized() {
  if (!initialized && typeof window !== "undefined") {
    items = readStorage();
    initialized = true;
  }
}

function emit() {
  for (const listener of listeners) {
    listener();
  }
}

function commit(next: CartItem[]) {
  items = next;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Ignore storage quota errors.
  }

  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  ensureInitialized();

  return items;
}

function getServerSnapshot() {
  return EMPTY;
}

function getClientHydrated() {
  return true;
}

function getServerHydrated() {
  return false;
}

function addItem(item: Omit<CartItem, "quantity">, quantity = 1) {
  ensureInitialized();

  const existing = items.find((entry) => entry.slug === item.slug);

  if (existing) {
    commit(
      items.map((entry) =>
        entry.slug === item.slug
          ? {
              ...entry,
              stock: item.stock,
              quantity: clampQuantity(entry.quantity + quantity, item.stock),
            }
          : entry,
      ),
    );

    return;
  }

  commit([...items, { ...item, quantity: clampQuantity(quantity, item.stock) }]);
}

function removeItem(slug: string) {
  ensureInitialized();
  commit(items.filter((entry) => entry.slug !== slug));
}

function setQuantity(slug: string, quantity: number) {
  ensureInitialized();
  commit(
    items.map((entry) =>
      entry.slug === slug
        ? { ...entry, quantity: clampQuantity(quantity, entry.stock) }
        : entry,
    ),
  );
}

function clear() {
  ensureInitialized();
  commit(EMPTY);
}

export function CartProvider({ children }: { children: ReactNode }) {
  const cartItems = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const hydrated = useSyncExternalStore(
    subscribe,
    getClientHydrated,
    getServerHydrated,
  );

  const value = useMemo<CartContextValue>(() => {
    const count = cartItems.reduce((total, item) => total + item.quantity, 0);
    const subtotalKes = cartItems.reduce(
      (total, item) => total + item.priceKes * item.quantity,
      0,
    );

    return {
      items: cartItems,
      count,
      subtotalKes,
      hydrated,
      addItem,
      removeItem,
      setQuantity,
      clear,
    };
  }, [cartItems, hydrated]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}
