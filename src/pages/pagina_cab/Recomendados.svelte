<script>
    import { onMount } from 'svelte';
    import { searchQuery } from '../../stores/selectedCategory.js';  // Asegúrate de tener el store searchQuery
    import ProductoCard from '../componentes/ProductoCard.svelte';
    import { getItems } from '../../lib/api.js';
  
    let productos = [];
    let filteredProductos = [];
    let loading = true;
    let error = '';
  
    // Cargar productos desde la API al inicio
    onMount(async () => {
      try {
        const data = await getItems();
  
        // Verificar si los productos existen en la respuesta
        if (data?.items && Array.isArray(data.items)) {
          let items = data.items;
  
          // Filtrar productos donde current_stock esté a un 25% por encima del maximum_stock
          productos = items.filter(p => {
            const maxStock = p.maximum_stock || 0;
            const currentStock = p.current_stock || 0;
            return currentStock >= maxStock * 1.25; // 25% por encima del máximo stock
          });
  
          // Inicializar filteredProductos con todos los productos al principio
          filteredProductos = productos;
        } else {
          throw new Error('No se pudieron cargar los productos.');
        }
      } catch (err) {
        error = 'No se pudieron cargar los productos.';
        console.error(err);
      } finally {
        loading = false;
      }
    });
  
    // Hacer la búsqueda reactiva
    $: {
      const query = $searchQuery.toLowerCase().trim();
  
      // Filtrar los productos en base a la búsqueda
      if (query) {
        filteredProductos = productos.filter(p =>
          p.name.toLowerCase().includes(query) ||
          p.brand.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
        );
      } else {
        filteredProductos = productos; // Si no hay búsqueda, mostrar todos los productos
      }
    }
  </script>
  
  <section class="bg-gradient-to-r min-h-screen py-28 px-6 text-white">
    <div class="text-center mb-6">
      <h1 class="text-3xl font-bold">Productos Recomendados</h1>
    </div>
  
    {#if loading}
      <p class="text-center text-gray-300">Cargando productos...</p>
    {:else if error}
      <p class="text-center text-red-400">{error}</p>
    {:else if filteredProductos.length === 0}
      <p class="text-center text-gray-400">No hay productos recomendados.</p>
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
            stock={producto.current_stock}
            recommended={true}
          />
        {/each}
      </div>
    {/if}
  </section>
  <style>
    /* Fondo gradiente con animación */
    .bg-gradient-to-r {
      background: linear-gradient(to right, #01091a, #1f3a68, #01091a);
    }
  
  </style>
  