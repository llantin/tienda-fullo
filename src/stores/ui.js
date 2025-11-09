// src/stores/ui.js
import { writable } from 'svelte/store';

// controla si el drawer del carrito está abierto
export const cartOpen = writable(false);
