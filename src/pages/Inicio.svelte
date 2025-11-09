<script>
  import { onMount } from 'svelte';
  import { selectedCategory, searchQuery } from '../stores/selectedCategory.js';
  import { cartOpen } from '../stores/ui.js';
  import { showNotification } from '../stores/cart.js';

  import ProductoCard from './componentes/ProductoCard.svelte';
  import Carrito from './Carrito.svelte';
  import ModalNotifi from './ModalNotifi.svelte';
  import { getItems } from '../lib/api.js';

  let productos = [];
  let filteredProductos = [];
  let loading = true;
  let error = '';
  let carrusel;

  // Mostrar carrito según store global
  $: mostrarCarrito = $cartOpen;

  // Cargar productos desde la API
  async function loadItems() {
    loading = true;
    error = '';
    try {
      const data = await getItems();
      let items = data.items ?? (Array.isArray(data) ? data : []);
      if (!Array.isArray(items)) items = [];

      // Asegurar campos y tipos
      productos = items.map(p => {
        const minStock = p.minimum_stock || 0;
        const maxStock = p.maximum_stock || 0;
        const currentStock = p.current_stock || 0;

        // Determinar si el producto es "Lo más vendido", "Recomendado" o "Agotado"
        const bestSeller = currentStock <= minStock * 0.75; // 25% por debajo del mínimo
        const recommended = currentStock >= maxStock * 1.25; // 25% por encima del máximo
        const outOfStock = currentStock <= 0; // Producto agotado

        return {
          ...p,
          stock: currentStock,
          bestSeller,
          recommended,
          outOfStock,
        };
      });

      // Aplicar filtro si hay categoría seleccionada
      if ($selectedCategory) {
        filteredProductos = productos.filter(p => p.category_id === $selectedCategory.id);
      } else {
        filteredProductos = productos;
      }

      // Filtrar productos según el query reactivo de búsqueda
      const query = $searchQuery.toLowerCase();
      if (query.trim()) {
        filteredProductos = filteredProductos.filter(
          p =>
            p.name.toLowerCase().includes(query) ||
            p.brand.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query)
        );
      }
    } catch (err) {
      console.error('Error cargando productos:', err);
      error = 'No se pudieron cargar los productos.';
      productos = [];
      filteredProductos = [];
    } finally {
      loading = false;
    }
  }

  // Cargar los productos al inicio
  onMount(() => {
    loadItems();
  });

  // Volver a cargar cuando cambie categoría o búsqueda
  $: if ($selectedCategory !== undefined || $searchQuery) {
    loadItems();
  }

  // Función para desplazarse por el carrusel
  function scrollCarrusel(direccion) {
    const ancho = carrusel?.clientWidth ?? 800;
    carrusel.scrollBy({ left: direccion * ancho * 0.8, behavior: 'smooth' });
  }

  // Notificación de agregado al carrito
  function handleAddToCart() {
    showNotification.set(true);
    setTimeout(() => showNotification.set(false), 2000);
  }
</script>

<ModalNotifi />
<section class="bg-gradient-to-r min-h-screen py-28 px-6 text-white">
  <div class="text-center mb-6">
    <h1 class="text-3xl font-bold">Productos</h1>
    {#if $selectedCategory}
      <p class="text-sm text-gray-400">
        Filtrando por: <strong>{$selectedCategory.name}</strong>
      </p>
    {:else if $searchQuery}
      <p class="text-sm text-gray-400">
        Resultados para: <strong>{$searchQuery}</strong>
      </p>
    {:else}
      <p class="text-sm text-gray-400">Mostrando todos los productos</p>
    {/if}
  </div>

  {#if loading}
    <p class="text-center text-gray-300">Cargando productos...</p>
  {:else if error}
    <p class="text-center text-red-400">{error}</p>
  {:else if filteredProductos.length === 0}
    <p class="text-center text-gray-400">No hay productos que coincidan con tu búsqueda.</p>
  {:else}
    <!-- Grid de productos -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
      {#each filteredProductos as producto}
        <ProductoCard
          id={producto.id}
          name={producto.name}
          brand={producto.brand}
          price={producto.price}
          image={producto.image || '/imagenes/pintura.JPG'}
          description={producto.description}
          stock={producto.stock}
          bestSeller={producto.bestSeller} 
          recommended={producto.recommended} 
          outOfStock={producto.outOfStock} 
          on:addToCart={handleAddToCart}
        />
      {/each}
    </div>

    <!-- Carrusel -->
    <section class="max-w-7xl mx-auto mt-12 px-6">
      <h2 class="text-2xl font-bold text-gray-100 mb-4">Otros productos</h2>
      <div class="relative">
        <button
          on:click={() => scrollCarrusel(-1)}
          class="absolute -left-10 top-1/2 transform -translate-y-1/2 bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-full z-10 transition-all duration-300"
        >‹</button>

        <div bind:this={carrusel} class="flex overflow-x-auto space-x-6 pb-4 no-scrollbar">
          {#each filteredProductos.slice(0, 10) as producto}
            <div class="flex-none">
              <ProductoCard
                id={producto.id}
                name={producto.name}
                brand={producto.brand}
                price={producto.price}
                image={producto.image || '/imagenes/productodefecto.JPG'}
                description={producto.description}
                stock={producto.stock}
                tipo="carrusel"
                bestSeller={producto.bestSeller} 
                recommended={producto.recommended} 
                outOfStock={producto.outOfStock} 
                on:addToCart={handleAddToCart}
              />
            </div>
          {/each}
        </div>

        <button
          on:click={() => scrollCarrusel(1)}
          class="absolute -right-10 top-1/2 transform -translate-y-1/2 bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-full z-10 transition-all duration-300"
        >›</button>
      </div>
    </section>
  {/if}
</section>

{#if mostrarCarrito}
  <Carrito on:close={() => cartOpen.set(false)} />
{/if}

<style>
  /* Fondo gradiente con animación */
  .bg-gradient-to-r {
    background: linear-gradient(to right, #01091a, #1f3a68, #01091a);
  }

</style>
