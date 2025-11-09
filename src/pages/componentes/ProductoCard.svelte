<script>
  import { createEventDispatcher } from 'svelte';
  import { get } from 'svelte/store';
  import { addToCart, cart } from '../../stores/cart.js';
  import { API_BASE_URL } from '../../lib/api.js';

  const dispatch = createEventDispatcher();

  export let id;
  export let name = '';
  export let brand = '';
  export let price = 0;
  export let image = '';
  export let description = '';
  export let stock = null; // número o null si no se controla stock
  export let bestSeller = false;
  export let recommended = false;
  export let outOfStock = false;
  export let tipo = 'normal'; // normal o carrusel

  // Cantidad actualmente en carrito
  $: currentQtyInCart = (get(cart).find(i => i.id === id)?.quantity) ?? 0;

  // URL completa de la imagen con fallback
  $: imageUrl = image ? `${API_BASE_URL}/${image}` : '/imagenes/productodefecto.JPG';

  function handleImageError(e) {
    e.target.src = '/imagenes/productodefecto.JPG';
  }

  // Función para ir al detalle del producto
  function goToProductPage() {
    window.location.href = `/#/producto/${id}`;
    window.location.reload();
  }

  // Agregar al carrito
  function handleAdd() {
    if (stock !== null) {
      const available = Number(stock) - Number(currentQtyInCart);
      if (available <= 0) {
        alert(`Lo siento — ya no hay más unidades disponibles de "${name}".`);
        return;
      }
    }

    addToCart({
      id,
      name,
      brand,
      price,
      image,
      stock,
      quantity: 1
    });

    dispatch('addToCart', { id, name });
  }
</script>

<div class={`card bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden relative group ${tipo === 'carrusel' ? 'w-60' : ''}`}>
  <!-- Imagen -->
  <div class="relative">
    <img
      src={imageUrl}
      alt={name}
      on:error={handleImageError}
      class={`w-full ${tipo === 'carrusel' ? 'h-40' : 'h-48'} object-cover transition-transform duration-300 ease-in-out transform group-hover:scale-105`}
    />

    <!-- Botón "Ver más" solo sobre la imagen -->
    <button
      class="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-xl"
      on:click|stopPropagation={goToProductPage}
      aria-label="Ver más detalles del producto"
    >
      <span class="bg-indigo-600 px-4 py-2 rounded-lg text-white font-semibold hover:bg-indigo-500 transition">
        Ver más
      </span>
    </button>

    <!-- Badge Agotado -->
    {#if stock !== null && Number(stock) <= 0}
      <div class="absolute top-2 right-2 p-1 bg-red-600 text-white text-xs font-semibold rounded-full">
        Agotado
      </div>
    {/if}

    <!-- Badge Más Vendido -->
    {#if bestSeller}
      <div class="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold py-1 px-3 rounded-full">
        Más Vendido
      </div>
    {/if}

    <!-- Badge Recomendado -->
    {#if recommended}
      <div class="absolute top-0 left-2 bg-green-600 text-white text-xs font-bold py-1 px-3 rounded-full">
        Recomendado
      </div>
    {/if}
  </div>

  <!-- Detalles -->
  <div class="p-4 space-y-3">
    <h3 class="font-semibold text-lg text-gray-800 line-clamp-2">{name}</h3>
    <p class="text-sm text-gray-500">{brand}</p>

    <div class="flex items-center justify-between mt-2">
      <span class="text-xl font-bold text-indigo-600">S/ {price}</span>
      {#if stock !== null}
        <span class="text-xs text-gray-600">Stock: {stock}</span>
      {/if}
    </div>

    <button
      class="w-full mt-3 py-2 rounded-lg bg-indigo-600 text-white font-medium focus:outline-none focus:ring-4 focus:ring-indigo-300 disabled:opacity-60 transition-all duration-200 ease-in-out transform hover:scale-105"
      on:click={handleAdd}
      disabled={stock !== null ? (Number(stock) <= 0 || Number(currentQtyInCart) >= Number(stock)) : false}
      aria-label={stock !== null && Number(stock) <= 0 ? 'Producto agotado' : 'Agregar al carrito'}
    >
      {#if stock !== null && Number(stock) <= 0}
        Agotado
      {:else if stock !== null && Number(currentQtyInCart) >= Number(stock)}
        Límite alcanzado
      {:else}
        Agregar al carrito
      {/if}
    </button>
  </div>
</div>

<style>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
