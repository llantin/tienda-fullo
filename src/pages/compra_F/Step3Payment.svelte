<script>
    import { createEventDispatcher } from 'svelte';
    import { cart } from '../../stores/cart.js';
    import { get } from 'svelte/store';
  
    const dispatch = createEventDispatcher();
  
    export let buyer;
    export let delivery;
  
    let gateway = 'paypal'; // opciones: paypal, stripe, card
    let cardNumber = '';
    let cardName = '';
    let expiry = '';
    let cvc = '';
  
    function goBack() {
      dispatch('back');
    }
  
    function simulatePayment() {
      if (!gateway) {
        alert('Selecciona una pasarela');
        return;
      }
      // validaciones simples
      if (gateway === 'card' && (!cardNumber || !cardName)) {
        alert('Completa los datos de tarjeta (simulado)');
        return;
      }
  
      // simulamos pago OK
      const pagoData = {
        gateway,
        status: 'paid',
        transaction_id: 'SIM-' + Math.floor(Math.random() * 1000000),
        paid_at: new Date().toISOString(),
      };
  
      dispatch('finish', pagoData);

      
    }
  </script>
  
  <div class="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md space-y-6">
    <h3 class="text-2xl font-semibold text-gray-800 mb-4">3) Pago</h3>
  
    <!-- Resumen del carrito -->
    <div class="bg-gray-50 p-4 rounded-lg shadow-inner space-y-2">
      <h4 class="text-lg font-medium text-gray-700 mb-2">Resumen del pedido</h4>
      {#each $cart as i}
        <div class="flex justify-between border-b border-gray-200 py-1">
          <span>{i.name} x{i.quantity}</span>
          <span>S/ {(i.price * i.quantity).toFixed(2)}</span>
        </div>
      {/each}
      <div class="flex justify-between font-semibold mt-2 text-gray-800">
        <span>Total:</span>
        <span>S/ {$cart.reduce((a,b)=>a+b.price*b.quantity,0).toFixed(2)}</span>
      </div>
    </div>
  
    <!-- Selección de pasarela -->
    <div class="space-y-2">
      <h4 class="text-lg font-medium text-gray-700 mb-2">Selecciona pasarela</h4>
      <div class="flex flex-col space-y-2">
        <label class="inline-flex items-center space-x-2">
          <input type="radio" bind:group={gateway} value="paypal" class="form-radio text-blue-600" />
          <span>PayPal</span>
        </label>
        <label class="inline-flex items-center space-x-2">
          <input type="radio" bind:group={gateway} value="stripe" class="form-radio text-blue-600" />
          <span>Stripe</span>
        </label>
        <label class="inline-flex items-center space-x-2">
          <input type="radio" bind:group={gateway} value="card" class="form-radio text-blue-600" />
          <span>Tarjeta</span>
        </label>
      </div>
  
      {#if gateway === 'card'}
        <div class="mt-3 space-y-2">
          <input
            type="text"
            placeholder="Número de tarjeta"
            bind:value={cardNumber}
            class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Nombre en tarjeta"
            bind:value={cardName}
            class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div class="flex space-x-2">
            <input
              type="text"
              placeholder="MM/AA"
              bind:value={expiry}
              class="w-1/2 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="CVC"
              bind:value={cvc}
              class="w-1/2 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      {/if}
    </div>
  
    <!-- Botones de acción -->
    <div class="flex justify-between mt-4">
      <button
        on:click={goBack}
        class="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded transition"
      >
        Volver
      </button>
      <button
        on:click={simulatePayment}
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Pagar (simulado)
      </button>
    </div>
  </div>
  