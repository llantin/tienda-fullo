// src/stores/selectedCategory.js
import { writable } from 'svelte/store';

export const selectedCategory = writable(null);
export const searchQuery = writable('');
