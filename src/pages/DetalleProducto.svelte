<script>
  import { onMount } from "svelte";
  import { getItems, API_BASE_URL } from "../lib/api.js";
  import ProductoCard from "./componentes/ProductoCard.svelte";
  import { addToCart } from "../stores/cart.js"; // <-- Importar store
  export let params; // { id } desde la ruta /producto/:id

  let producto = null;
  let productos = [];
  let relacionados = [];
  let loading = true;
  let error = "";
  let carrusel;

  function volver() {
    window.history.back();
  }

  function agregarAlCarrito() {
    if (producto) {
      addToCart({ ...producto, quantity: 1 }); // <-- Se agrega al carrito y dispara notificación
    }
  }

  function scrollCarrusel(direccion) {
    const ancho = carrusel?.clientWidth ?? 800;
    carrusel.scrollBy({ left: direccion * ancho * 0.8, behavior: "smooth" });
  }

  // Manejo de error de imagen
  function handleImageError(e) {
    e.target.src = "/imagenes/productodefecto.JPG";
  }

  onMount(async () => {
    try {
      const data = await getItems();
      productos = data.items ?? (Array.isArray(data) ? data : []);

      // Encontrar el producto específico
      producto = productos.find((p) => p.id == params.id);
      if (!producto) {
        throw new Error("Producto no encontrado");
      }

      // Filtrar productos relacionados
      relacionados = productos
        .filter((p) => p.category_id === producto.category_id && p.id !== producto.id)
        .slice(0, 8);

      if (relacionados.length === 0) {
        relacionados = productos.filter((p) => p.id !== producto.id).slice(0, 8);
      }
    } catch (err) {
      console.error("❌ Error cargando producto:", err);
      error = err.message || "Error al cargar el producto";
    } finally {
      loading = false;
    }
  });
</script>

{#if loading}
  <p class="text-center text-gray-600 mt-10">Cargando producto...</p>
{:else if error}
  <p class="text-center text-red-500 mt-10">{error}</p>
{:else if producto}
  <section class="bg-gray-100 min-h-screen py-10 px-6">
    <div class="w-[80vw] mx-auto bg-white rounded-2xl shadow-md overflow-hidden flex flex-col md:flex-row animate-fadeIn">
      <div class="md:w-1/2 bg-gray-50  items-center justify-center p-6 inline-block">
        <img
          src={producto.image ? `${API_BASE_URL}/${producto.image}` : "/imagenes/productodefecto.JPG"}
          alt={producto.name}
          on:error={handleImageError}
          class="w-full max-w-md object-contain rounded-lg transition-transform duration-500 hover:scale-105"
          aria-label={`Imagen del producto ${producto.name}`}
        />
      </div>

      <div class="md:w-1/2 p-8 flex flex-col justify-between">
        <div>
          <button
            on:click={volver}
            class="text-sm text-blue-600 hover:text-blue-800 mb-4 flex items-center gap-1"
          >
            ⬅ Volver
          </button>

          <h2 class="text-2xl font-bold text-gray-800 mb-2">{producto.name}</h2>
          <p class="text-sm text-gray-500 mb-4">
            Marca: <span class="font-medium text-gray-700">{producto.brand}</span>
          </p>
          <p class="text-gray-600 leading-relaxed mb-6">{producto.description}</p>

          <div class="mb-6">
            <span class="text-3xl font-extrabold text-blue-700">S/ {producto.price}</span>
          </div>

          {#if producto.current_stock > 0}
            <p class="text-lg font-semibold text-green-600">¡En stock! ({producto.current_stock} unidades disponibles)</p>
          {:else}
            <p class="text-lg font-semibold text-red-600">Agotado</p>
          {/if}

          <button
            on:click={agregarAlCarrito}
            class="w-full md:w-auto bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold shadow transition-all duration-300 mt-3"
            disabled={producto.current_stock <= 0}
          >
            {#if producto.current_stock <= 0}
              Agotado
            {:else}
              Agregar al carrito
            {/if}
          </button>
        </div>

        <div class="mt-10">
          <h3 class="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">
            Características principales
          </h3>
          <ul class="list-disc list-inside text-gray-600 space-y-1 text-sm">
            <li>ID del producto: {producto.id}</li>
            <li>Modelo: {producto.model}</li>
            <li>Presentación: {producto.presentation}</li>
            <li>Unidad de medida: {producto.unit_measurement}</li>
            <li>Stock disponible: {producto.current_stock}</li>
            <li>Precio: S/ {producto.price}</li>
            <li>Descripción corta: {producto.description}</li>
          </ul>
        </div>
      </div>
    </div>

    {#if relacionados.length > 0}
      <section class="max-w-6xl mx-auto mt-16 px-4">
        <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center md:text-left">
          Productos relacionados
        </h2>

        <div class="relative">
          <button
            on:click={() => scrollCarrusel(-1)}
            class="absolute left-0 top-1/2 -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full shadow-md z-10 hover:bg-gray-700"
          >
            ‹
          </button>

          <div
            bind:this={carrusel}
            class="flex overflow-x-auto scroll-smooth space-x-6 pb-4 no-scrollbar"
          >
            {#each relacionados as p}
              <div class="flex-none w-64">
                <ProductoCard
                  id={p.id}
                  name={p.name}
                  brand={p.brand}
                  price={p.price}
                  image={p.image}
                  description={p.description}
                  tipo="carrusel"
                  bestSeller={p.current_stock <= p.minimum_stock * 0.75} 
                  recommended={p.current_stock >= p.maximum_stock * 1.25} 
                  stock={p.current_stock}
                />
              </div>
            {/each}
          </div>

          <button
            on:click={() => scrollCarrusel(1)}
            class="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full shadow-md z-10 hover:bg-gray-700"
          >
            ›
          </button>
        </div>
      </section>
    {/if}
  </section>
{/if}

<style>
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fadeIn { animation: fadeIn 0.5s ease; }
  .no-scrollbar::-webkit-scrollbar { display: none; }
  .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
