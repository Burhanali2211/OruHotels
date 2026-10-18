import { writable, derived } from 'svelte/store';

// App configuration (Ordering enabled for rich interactivity)
export const APP_CONFIG = {
  isOrderingEnabled: true
};

// Cart store: { [cartKey]: { key, dish, quantity, size, option, unitPrice } }
export const cart = writable({});

// Active Placed Order: null or { orderCode, items, subtotal, taxes, grandTotal, kitchenNotes, placedAt, status }
export const activeOrder = writable(null);

// UI State
export const isDrawerOpen = writable(false);
export const isReceiptOpen = writable(false);
export const isQuickMenuOpen = writable(false);
export const selectedDish = writable(null);
export const dietFilter = writable('all'); // 'all', 'veg', 'nonveg'
export const quickFilter = writable('all'); // 'all', 'must-try', 'top-rated'
export const viewMode = writable('cards'); // 'cards' (rich visual) or 'compact' (fast scan)
export const activeCategory = writable('all');
export const searchQuery = writable('');

// Toast notification store
export const toast = writable({ visible: false, message: '', icon: 'check' });

let toastTimeout;
export function showToast(message, icon = 'check') {
  clearTimeout(toastTimeout);
  toast.set({ visible: true, message, icon });
  toastTimeout = setTimeout(() => {
    toast.set({ visible: false, message: '', icon: 'check' });
  }, 2600);
}

// Derived Cart Summary
export const cartSummary = derived(cart, ($cart) => {
  const entries = Object.values($cart);
  const totalItems = entries.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = entries.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  const taxes = Math.round(subtotal * 0.05); // 5% GST
  const grandTotal = subtotal + taxes;
  return {
    entries,
    totalItems,
    subtotal,
    taxes,
    grandTotal
  };
});

// Cart helper methods with Size & Preparation Options
export function addToCart(dish, quantity = 1, size = 'Regular', option = '') {
  // Determine unit price based on selected size
  let unitPrice = dish.price;
  if (dish.sizes && dish.sizes[size]) {
    unitPrice = dish.sizes[size];
  }

  const sizeKey = size || 'Standard';
  const optKey = option || '';
  const key = `${dish.id}__${sizeKey}${optKey ? '__' + optKey : ''}`;

  cart.update(current => {
    if (current[key]) {
      current[key].quantity += quantity;
    } else {
      current[key] = {
        key,
        dish,
        quantity,
        size: dish.sizes ? size : null,
        option: option || null,
        unitPrice
      };
    }
    return { ...current };
  });

  const sizeLabel = dish.sizes ? ` (${size})` : (option ? ` (${option})` : '');
  showToast(`Added ${quantity}× ${dish.name}${sizeLabel} to order`);
}

export function updateQuantity(key, delta) {
  cart.update(current => {
    if (!current[key]) return current;
    current[key].quantity += delta;
    if (current[key].quantity <= 0) {
      delete current[key];
    }
    return { ...current };
  });
}

export function removeItem(key) {
  cart.update(current => {
    delete current[key];
    return { ...current };
  });
}

export function clearCart() {
  cart.set({});
}
