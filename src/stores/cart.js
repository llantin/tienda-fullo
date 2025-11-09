import { writable } from 'svelte/store';

// --------------------
// Carrito persistente
// --------------------
const storedCart = typeof localStorage !== 'undefined'
  ? JSON.parse(localStorage.getItem('cart') || '[]')
  : [];

export const cart = writable(storedCart);

// Guardar automáticamente en localStorage cuando cambie el carrito
cart.subscribe((value) => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('cart', JSON.stringify(value));
  }
});

// Escuchar cambios en otras pestañas
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === 'cart') {
      cart.set(JSON.parse(event.newValue || '[]'));
    }
  });
}

// --------------------
// Notificación de carrito
// --------------------
export const showNotification = writable(false);

// --------------------
// Funciones para manipular el carrito
// --------------------

// Agregar producto al carrito
export function addToCart(producto) {
  cart.update(items => {
    const index = items.findIndex(item => item.id === producto.id);

    if (index !== -1) {
      const existing = items[index];
      const max = existing.stock ?? Infinity;
      const newQty = existing.quantity + (producto.quantity ?? 1);

      if (newQty > max) {
        alert(`Solo hay ${max} unidades disponibles de "${existing.name}".`);
        existing.quantity = max;
      } else {
        existing.quantity = newQty;
      }

      return [...items];
    } else {
      return [...items, { ...producto, quantity: producto.quantity ?? 1 }];
    }
  });

  // Mostrar notificación temporal
  showNotification.set(true);
  setTimeout(() => showNotification.set(false), 2000);
}

// Eliminar producto del carrito
export function removeFromCart(productId) {
  cart.update(items => items.filter(item => item.id !== productId));
}

// Actualizar cantidad de un producto
export function updateQuantity(productId, quantity) {
  cart.update(items => {
    const index = items.findIndex(item => item.id === productId);
    if (index !== -1) {
      const max = items[index].stock ?? Infinity;
      if (quantity > max) {
        alert(`Solo hay ${max} unidades disponibles de "${items[index].name}".`);
        items[index].quantity = max;
      } else if (quantity <= 0) {
        items.splice(index, 1);
      } else {
        items[index].quantity = quantity;
      }
    }
    return [...items];
  });
}

// Vaciar carrito
export function clearCart() {
  cart.set([]);
}
