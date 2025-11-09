<script>
  import { onMount } from 'svelte';
  import { selectedCategory, searchQuery } from '../../stores/selectedCategory.js'; // Asegúrate de tener el store searchQuery
  import { cartOpen } from '../../stores/ui.js';
  import { cart } from '../../stores/cart.js';
  import { API_BASE_URL } from '../../lib/api.js';
  import { fly } from 'svelte/transition';

  let categories = [];
  let showCategories = false;
  let loadingCategories = false;
  let errorCategories = null;
  let search = '';  // Esta variable mantiene el valor del input de búsqueda
  let closeTimeout;

  let lastScrollY = 0; // Variable para almacenar la última posición del scroll
  let hideHeader = false; // Variable para manejar la visibilidad de la cabecera

  $: totalItems = $cart.reduce((acc, item) => acc + (item.quantity || 0), 0);

  // Detectar el scroll
  onMount(() => {
    window.addEventListener('scroll', handleScroll);
  });

  // Función para manejar el scroll
  function handleScroll() {
    if (window.scrollY > lastScrollY) {
      hideHeader = true;  // Si estamos bajando, ocultamos la cabecera
    } else {
      hideHeader = false; // Si estamos subiendo, mostramos la cabecera
    }
    lastScrollY = window.scrollY;
  }

  // Cargar categorías
  onMount(async () => {
    try {
      loadingCategories = true;
      const res = await fetch(`${API_BASE_URL}/api/categories`);
      const data = await res.json();
      categories = data.categories ?? [];
    } catch (err) {
      errorCategories = 'Error al cargar categorías';
      console.error(err);
    } finally {
      loadingCategories = false;
    }
  });

  // Abrir o cerrar el carrito
  function abrirCheckout() {
    cartOpen.update(v => !v);
  }

  // Función de búsqueda que actualiza la store de searchQuery
  function handleSearch(e) {
    e.preventDefault();
    if (search.trim()) {
      // Cuando el usuario escribe, actualizamos la store searchQuery
      searchQuery.set(search.trim());
    } else {
      // Si el campo de búsqueda está vacío, limpiamos la búsqueda
      searchQuery.set('');
    }
  }

  // Función para limpiar la búsqueda
  function clearSearch() {
    search = ''; // Limpiar el valor del campo de búsqueda
    searchQuery.set(''); // Limpiar la store searchQuery
  }

  // Mostrar/Ocultar menú de categorías
  function openCategories() {
    clearTimeout(closeTimeout);
    showCategories = true;
  }

  function scheduleCloseCategories(delay = 200) {
    clearTimeout(closeTimeout);
    closeTimeout = setTimeout(() => (showCategories = false), delay);
  }

  // Seleccionar categoría
  function seleccionarCategoria(cat) {
    selectedCategory.set(cat);
    showCategories = false;
    window.location.hash = '/';
  }

  function mostrarTodas() {
    selectedCategory.set(null);
    showCategories = false;
    window.location.hash = '/';
  }
</script>

<!-- 🌟 CABECERA CON EFECTO DE DESAPARICIÓN Y APARICIÓN -->
<div class={`fixed top-0 w-full bg-white/90 backdrop-blur-md shadow-md z-50 border-b border-gray-200 transition-all duration-300 ease-in-out ${hideHeader ? 'transform -translate-y-full' : ''}`}>
  <div class="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">

    <!-- 🧩 Logo -->
    <a href="/" class="flex items-center gap-2">
      <img src="/imagenes/logo.png" alt="Logo tienda" class="w-[9rem] cursor-pointer" />
    </a>

    <!-- 🔍 Buscador -->
    <form on:submit={handleSearch} class="relative flex w-full max-w-lg mx-4">
      <input
        type="text"
        bind:value={search}
        placeholder="Buscar productos..."
        class="w-full px-5 py-2 rounded-full bg-gray-100 text-black border border-gray-300 focus:ring-2 focus:ring-black outline-none transition-all duration-300"
      />
      <!-- Botón de limpiar búsqueda -->
      {#if search.trim()}
        <button type="button" on:click={clearSearch} class="absolute right-1 top-1 bottom-1 px-4 text-gray-500">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      {/if}
      <button
        type="submit"
        class="absolute right-1 top-1 bottom-1 px-4 bg-black text-white rounded-full font-semibold hover:brightness-110 active:scale-95 transition-all duration-200 flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
      </button>
    </form>

    <!-- 🛒 Carrito -->
    <button
      on:click={abrirCheckout}
      class="relative flex items-center justify-center px-4 py-2 bg-black text-white font-semibold rounded-full shadow-md hover:scale-105 transition-all duration-300"
      aria-label="Abrir carrito"
    >
      <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <path d="M3 3h2l.4 2M7 13h10l4-8H5.4" stroke-linecap="round" stroke-linejoin="round"></path>
        <circle cx="9" cy="19" r="1" fill="currentColor"></circle>
        <circle cx="20" cy="19" r="1" fill="currentColor"></circle>
      </svg>

      {#if totalItems > 0}
        <span class="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
          {totalItems}
        </span>
      {/if}
    </button>
  </div>

  <!-- 🧭 Menú inferior -->
  <nav class="bg-gray-900 text-gray-100 shadow-inner">
    <div class="max-w-7xl mx-auto flex justify-center items-center space-x-12 px-10 py-3 relative">

      <!-- Categorías desplegable -->
      <div
        class="relative font-medium rounded-2xl p-1 cursor-pointer"
        on:mouseenter={openCategories}
        on:mouseleave={() => scheduleCloseCategories(150)}
      >
        <span
          class="cursor-pointer hover:text-yellow-300 transition-colors duration-300 font-semibold tracking-wide"
          on:click={mostrarTodas}
        >
          Categorías
        </span>

        {#if showCategories}
          <div
            transition:fly|local={{ y: 6, duration: 200 }}
            class="absolute left-0 top-full mt-2 w-64 bg-white text-gray-800 shadow-2xl rounded-xl z-50 border border-gray-200 overflow-hidden"
            on:mouseenter={openCategories}
            on:mouseleave={() => scheduleCloseCategories(150)}
          >
            {#if loadingCategories}
              <div class="p-3 text-gray-500 text-sm">Cargando...</div>
            {:else if errorCategories}
              <div class="p-3 text-red-500 text-sm">{errorCategories}</div>
            {:else if categories.length === 0}
              <div class="p-3 text-gray-500 text-sm">Sin categorías</div>
            {:else}
              <div class="divide-y divide-gray-100">
                {#each categories as cat}
                  <div
                    class="p-3 hover:bg-gray-100 rounded-md cursor-pointer transition-all duration-200 hover:translate-x-1"
                    on:click={() => seleccionarCategoria(cat)}
                  >
                    <span class="font-medium">{cat.name}</span>
                  </div>
                {/each}
              </div>
            {/if}
          </div>
        {/if}
      </div>

      <!-- Enlaces simples -->
      {#each [
        { name: 'Lo más vendido', href: '#/mas-vendidos' },
        { name: 'Recomendados', href: '#/recomendados' },
        { name: 'Ayuda', href: '#/ayuda' }
      ] as link}
        <a
          href={link.href}
          class="relative font-medium tracking-wide hover:text-yellow-300 transition-colors duration-300
                 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-yellow-300 after:transition-all after:duration-300"
        >
          {link.name}
        </a>
      {/each}
    </div>
  </nav>
</div>

<style>
  .animate-pulse {
    animation: pulse 1.5s infinite;
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.1); opacity: 0.8; }
  }

  /* Transición suave para la cabecera */
  .transition-all {
    transition: transform 0.3s ease-in-out;
  }

  /* Estilo cuando la cabecera está oculta */
  .transform.-translate-y-full {
    transform: translateY(-100%);
  }
</style>
