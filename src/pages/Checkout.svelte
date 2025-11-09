<script>
  import { cart } from '../stores/cart.js';
  import { push } from 'svelte-spa-router';
  import { API_BASE_URL } from '../lib/api.js';

  // Calcular total dinámico
  $: total = $cart.reduce((acc, p) => acc + p.price * p.quantity, 0).toFixed(2);

  // Cambiar cantidad de un producto
  function changeQty(id, delta) {
    cart.update(items =>
      items.map(p => {
        if (p.id === id) {
          const newQty = p.quantity + delta;
          return { ...p, quantity: newQty > 0 ? newQty : 1 };
        }
        return p;
      })
    );
  }

  // Eliminar producto
  function removeItem(id) {
    cart.update(items => items.filter(p => p.id !== id));
  }

  // Continuar con la compra (ir al siguiente paso)
  function continuarCompra() {
    if ($cart.length === 0) {
      alert('Tu carrito está vacío 😢');
      return;
    }
    push('/paycheckout');
  }

  function volverAlCarrito() {
    push('/');
  }

  // fallback para imágenes
  function handleImageError(e) {
    e.target.src = '/imagenes/productodefecto.JPG';
  }
</script>

<!-- 🧾 ESTRUCTURA VISUAL -->
<div class="min-h-screen bg-gray-50 py-10 px-4 flex justify-center">
  <div class="w-full max-w-4xl bg-white shadow-xl rounded-2xl overflow-hidden">
    <div class="p-8 md:p-10">
      <h2 class="text-3xl font-bold text-gray-900 mb-8 text-center">🛍️ Resumen de tu pedido</h2>

      {#if $cart.length === 0}
        <p class="text-gray-500 text-center mt-20">Tu carrito está vacío 😢</p>
      {:else}
        <div class="divide-y divide-gray-200">
          {#each $cart as item (item.id)}
            <div class="flex flex-col sm:flex-row items-center justify-between py-5">
              <div class="flex items-center gap-4 flex-1">
                <img
                  src={item.image ? `${API_BASE_URL}/storage/${item.image}` : "/imagenes/productodefecto.JPG"}
                  alt={item.name}
                  on:error={handleImageError}
                  class="w-20 h-20 object-cover border border-gray-200 rounded-md"
                />
                <div class="flex-1">
                  <h3 class="text-sm sm:text-base font-semibold text-gray-900 line-clamp-2">
                    {item.name}
                  </h3>
                  <p class="text-xs text-gray-500">{item.brand}</p>
                  <p class="text-sm font-medium text-indigo-600 mt-1">S/ {item.price}</p>
                </div>
              </div>

              <div class="flex items-center justify-between sm:justify-end w-full sm:w-auto mt-3 sm:mt-0 gap-4">
                <div class="flex items-center gap-2">
                  <button
                    class="bg-gray-200 px-2 rounded hover:bg-gray-300"
                    on:click={() => changeQty(item.id, -1)}
                  >
                    -
                  </button>
                  <span class="min-w-[24px] text-center">{item.quantity}</span>
                  <button
                    class="bg-gray-200 px-2 rounded hover:bg-gray-300"
                    on:click={() => changeQty(item.id, 1)}
                  >
                    +
                  </button>
                </div>

                <p class="font-semibold text-gray-800">
                  S/ {(item.price * item.quantity).toFixed(2)}
                </p>

                <button
                  class="text-red-500 hover:text-red-700 text-sm"
                  on:click={() => removeItem(item.id)}
                >
                  Quitar
                </button>
              </div>
            </div>
          {/each}
        </div>

        <!-- 🧾 Totales -->
        <div class="mt-10 border-t border-gray-200 pt-6 space-y-2">
          <div class="flex justify-between text-gray-700">
            <span>Subtotal</span>
            <span>S/ {total}</span>
          </div>
          <div class="flex justify-between text-gray-700">
            <span>Envío</span>
            <span class="text-green-600 font-medium">Gratis</span>
          </div>
          <div class="flex justify-between text-lg font-semibold mt-3 border-t border-gray-200 pt-3">
            <span>Total</span>
            <span class="text-indigo-600">S/ {total}</span>
          </div>
        </div>

        <!-- 🧭 Botones -->
        <div class="mt-10 flex flex-col sm:flex-row gap-3">
          <button
            on:click={volverAlCarrito}
            class="flex-1 border border-gray-300 text-gray-700 rounded-lg py-3 font-medium hover:bg-gray-100 transition"
          >
            ← Seguir comprando
          </button>
          <button
            on:click={continuarCompra}
            class="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-3 font-semibold shadow-md transition transform active:scale-95"
          >
            Continuar compra →
          </button>
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  .max-w-4xl {
    animation: fadeIn 0.4s ease-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* Scroll personalizado */
  .divide-y::-webkit-scrollbar {
    width: 6px;
  }
  .divide-y::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 6px;
  }
</style>
