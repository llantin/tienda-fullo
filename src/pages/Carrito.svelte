<script>
  import { cart, removeFromCart, updateQuantity, clearCart } from '../stores/cart.js';
  import { cartOpen } from '../stores/ui.js';
  import { API_BASE_URL } from '../lib/api.js';

  $: console.log('%c[Carrito] visible ->', 'color: orange; font-weight:bold;', $cartOpen);

  function closeDrawer() {
    console.log('%c[Carrito] closeDrawer -> set false', 'color: orange;');
    cartOpen.set(false);
  }

  function vaciar() {
    clearCart();
  }

  function paycheckout() {
    // redirigir a checkout
    window.location.hash = '/checkout';
    closeDrawer();
  }

  function changeQty(id, delta) {
    cart.update(items => {
      return items.map(p => {
        if (p.id === id) {
          const newQty = p.quantity + delta;
          const max = p.stock ?? Infinity;
          if (newQty > max) p.quantity = max;
          else if (newQty <= 0) p.quantity = 1;
          else p.quantity = newQty;
        }
        return p;
      });
    });
  }

  function eliminar(id) {
    removeFromCart(id);
  }

  // total dinámico
  $: total = $cart.reduce((acc, p) => acc + p.price * p.quantity, 0).toFixed(2);

  // fallback para imágenes
  function handleImageError(e) {
    e.target.src = '/imagenes/productodefecto.JPG';
  }
</script>

{#if $cartOpen}
  <div class="fixed inset-0 z-50 bg-black/40 flex justify-end" on:click={closeDrawer}>
    <div class="w-full max-w-lg bg-white h-full p-6 rounded-l-lg shadow-lg transition-all transform duration-300 ease-in-out" on:click|stopPropagation>
      <!-- Encabezado del carrito -->
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-semibold">Tu carrito</h2>
        <button on:click={closeDrawer} class="text-2xl text-gray-600 hover:text-gray-900">✕</button>
      </div>

      {#if $cart.length === 0}
        <p class="text-center text-gray-500 text-lg">Tu carrito está vacío</p>
      {:else}
        <!-- Lista de productos en el carrito -->
        <ul>
          {#each $cart as item}
            <li class="flex items-center justify-between py-3 border-b border-gray-200">
              <div class="flex items-center gap-3">
                <img
                  src={item.image ? `${API_BASE_URL}/${item.image}` : '/imagenes/productodefecto.JPG'}
                  alt={item.name}
                  on:error={handleImageError}
                  class="w-16 h-16 object-cover rounded-lg"
                />
                <div>
                  <div class="font-semibold text-gray-900">{item.name}</div>
                  <div class="text-sm text-gray-500">S/ {item.price} • Stock: {item.stock ?? '—'}</div>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <button on:click={() => changeQty(item.id, -1)} class="px-2 py-1 bg-gray-200 rounded-full text-lg hover:bg-gray-300 transition-colors">-</button>
                <span class="text-lg font-semibold">{item.quantity}</span>
                <button on:click={() => changeQty(item.id, 1)} class="px-2 py-1 bg-gray-200 rounded-full text-lg hover:bg-gray-300 transition-colors">+</button>
                <button on:click={() => eliminar(item.id)} class="ml-2 text-red-500 hover:text-red-600 transition-colors">Eliminar</button>
              </div>
            </li>
          {/each}
        </ul>

        <!-- Total y botones de acción -->
        <div class="mt-6">
          <div class="flex justify-between font-semibold text-xl mb-4">
            <div>Total</div>
            <div>S/ {total}</div>
          </div>
          <div class="flex gap-4">
            <button class="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg shadow-md transition-all transform hover:scale-105" on:click={paycheckout}>
              Ir al checkout
            </button>
            <button class="flex-1 border border-gray-300 py-2 rounded-lg text-gray-600 hover:text-gray-900 transition-colors" on:click={vaciar}>
              Vaciar carrito
            </button>
          </div>
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  /* Estilo general del carrito */
  .transition-all {
    transition: all 0.3s ease-in-out;
  }

  /* Estilo del cierre del carrito */
  button:hover {
    cursor: pointer;
  }

  /* Fondo del carrito */
  .bg-white {
    background-color: #ffffff;
  }

  /* Estilo de los botones */
  button {
    transition: background-color 0.3s ease, transform 0.2s ease;
  }

  /* Estilo del botón de eliminar */
  .text-red-500:hover {
    color: #f56565;
  }

  /* Estilo del botón de aumentar/disminuir cantidad */
  .bg-gray-200:hover {
    background-color: #e2e8f0;
  }

  /* Estilo de los detalles de los productos */
  .font-semibold {
    font-weight: 600;
  }

  .text-lg {
    font-size: 1.125rem;
  }

  /* Estilo para pantallas pequeñas */
  @media (max-width: 768px) {
    .w-full {
      width: 100%;
    }

    .text-xl {
      font-size: 1.25rem;
    }
  }
</style>
