<script>
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
  
    let document_type = 'DNI';
    let document_number = '';
    let email = '';
    let phone = '';
    let loading = false;
    let errors = {};
  
    function validarDocumento(tipo, numero) {
      if (tipo === 'DNI') return /^[0-9]{8}$/.test(numero);
      if (tipo === 'RUC') return /^[0-9]{11}$/.test(numero);
      return false;
    }
  
    function continuar() {
      errors = {}; // resetear errores
  
      if (!document_number) errors.document_number = `Número de ${document_type} requerido`;
      else if (!validarDocumento(document_type, document_number))
        errors.document_number = `Número de ${document_type} inválido`;
  
      if (!email) errors.email = 'Correo electrónico requerido';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        errors.email = 'Correo electrónico inválido';
  
      if (Object.keys(errors).length > 0) return;
  
      dispatch('next', {
        document_type,
        document_number,
        email,
        phone
      });
    }
  </script>
  
  <div class="bg-white shadow-lg rounded-xl p-6 max-w-md mx-auto">
    <h3 class="text-2xl font-semibold text-gray-800 mb-4 text-center">1) Datos del comprador</h3>
  
    <div class="space-y-4">
  
      <!-- Tipo de documento -->
      <div class="flex flex-col">
        <label class="text-gray-700 font-medium mb-1">Tipo de documento</label>
        <select bind:value={document_type} class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="DNI">DNI</option>
          <option value="RUC">RUC</option>
        </select>
      </div>
  
      <!-- Número de documento -->
      <div class="flex flex-col">
        <label class="text-gray-700 font-medium mb-1">Número de {document_type}</label>
        <input
          type="text"
          placeholder="Ej: 12345678"
          bind:value={document_number}
          class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {#if errors.document_number}
          <span class="text-red-500 text-sm mt-1">{errors.document_number}</span>
        {/if}
      </div>
  
      <!-- Correo electrónico -->
      <div class="flex flex-col">
        <label class="text-gray-700 font-medium mb-1">Correo electrónico</label>
        <input
          type="email"
          placeholder="ejemplo@correo.com"
          bind:value={email}
          class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {#if errors.email}
          <span class="text-red-500 text-sm mt-1">{errors.email}</span>
        {/if}
      </div>
  
      <!-- Teléfono opcional -->
      <div class="flex flex-col">
        <label class="text-gray-700 font-medium mb-1">Teléfono (opcional)</label>
        <input
          type="text"
          placeholder="Ej: 987654321"
          bind:value={phone}
          class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
  
      <!-- Botón continuar -->
      <button
        on:click={continuar}
        disabled={loading}
        class="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        {loading ? 'Procesando...' : 'Continuar'}
      </button>
    </div>
  </div>
  