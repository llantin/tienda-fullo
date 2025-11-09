<script>
  import { onMount } from 'svelte';
  import { push } from 'svelte-spa-router';
  import { API_BASE_URL } from '../../lib/api.js';
  export let params; // Recibe el parámetro { hash } desde la URL

  let loading = true;
  let error = '';
  let purchaseDetails = null;
  let totalAmount = 0;

  // Función para obtener los detalles de la compra
  async function fetchPurchaseDetails() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/checkout/hash/${params.hash}`);
      
      if (!response.ok) {
        throw new Error('No se pudo obtener los detalles de la compra');
      }

      const data = await response.json();
      if (data.status) {
        purchaseDetails = data; // Guardamos todos los detalles de la compra
        totalAmount = purchaseDetails.receipt_details.reduce((total, item) => total + item.subtotal, 0); // Calculamos el total pagado
      } else {
        throw new Error(data.message || 'Error desconocido');
      }
    } catch (err) {
      error = err.message || 'Error al procesar la compra';
    } finally {
      loading = false;
    }
  }

  // Ejecutamos la función de la API cuando el componente se monta
  onMount(() => {
    fetchPurchaseDetails();
  });
</script>

{#if loading}
  <p class="text-center text-gray-600 mt-10">Cargando detalles de tu compra...</p>
{:else if error}
  <p class="text-center text-red-500 mt-10">{error}</p>
{:else if purchaseDetails}
  {#if purchaseDetails.person && purchaseDetails.receipt} <!-- Comprobamos que 'person' y 'receipt' existen -->
    <section class="bg-gray-100 min-h-screen py-1 px-2">
      <div class="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-4 animate-fadeIn">
        <h2 class="text-3xl font-semibold text-gray-800 mt-10 text-center">Detalles de tu compra</h2>

        <!-- Mostrar los detalles de la persona -->
        <div class="bg-gray-50 p-6 rounded-lg mb-6">
          <h3 class="text-xl font-semibold text-gray-700">Cliente</h3>
          <p><strong>Nombre:</strong> {purchaseDetails.person?.name} {purchaseDetails.person?.last_name}</p>
          <p><strong>Email:</strong> {purchaseDetails.person?.email}</p>
          <p><strong>Teléfono:</strong> {purchaseDetails.person?.phone}</p>
        </div>

        <!-- Mostrar los detalles del recibo -->
        <div class="bg-gray-50 p-6 rounded-lg mb-6">
          <h3 class="text-xl font-semibold text-gray-700">Recibo</h3>
          <p><strong>Código de recibo:</strong> {purchaseDetails.receipt?.receipt_code}</p>
          <p><strong>Descripción:</strong> {purchaseDetails.receipt?.description}</p>
        </div>

        <!-- Mostrar los detalles de los artículos -->
        <div class="bg-gray-50 p-6 rounded-lg mb-6">
          <h3 class="text-xl font-semibold text-gray-700">Artículos</h3>
          <ul class="space-y-2">
            {#each purchaseDetails.receipt_details as item}
              <li class="flex justify-between">
                <span>{item?.item_name} x{item?.quantity}</span>
                <span>S/ {item?.subtotal}</span>
              </li>
            {/each}
          </ul>
        </div>

        <!-- Mostrar el total pagado -->
        <div class="bg-gray-50 p-6 rounded-lg mb-6">
          <h3 class="text-xl font-semibold text-gray-700">Total Pagado</h3>
          <p><strong>Total:</strong> S/ {totalAmount.toFixed(2)}</p>
        </div>

        <!-- Mostrar el tipo de entrega -->
        <div class="bg-gray-50 p-6 rounded-lg mb-6">
          <h3 class="text-xl font-semibold text-gray-700">Tipo de Entrega</h3>
          {#if purchaseDetails.delivery?.tipo_entrega === 'tienda'}
            <p>Recojo en tienda: {purchaseDetails.delivery?.referencia}</p>
          {:else}
            <p>Envío a domicilio: {purchaseDetails.delivery?.direccion}</p>
          {/if}
        </div>

        <!-- Opcional: Botón para regresar al inicio o al carrito -->
        <div class="mt-8 flex justify-center">
          <button
            on:click={() => push('/')}
            class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition-all duration-300"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    </section>
  {/if}
{:else}
  <p class="text-center text-red-500 mt-10">Error: No se encontraron detalles de la compra.</p>
{/if}

<style>
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fadeIn { animation: fadeIn 0.5s ease; }
</style>
