<script>
    import { onMount } from 'svelte';
  
    let contactoEmail = 'soporte@tienda.com';
    let telefono = '+123 456 7890';
    let direccion = 'Av. Principal 123, Ciudad, País';
  
    let nombre = '';
    let email = '';
    let mensaje = '';
  
    let successMessage = '';
    let errorMessage = '';
  
    // Simulación del envío de un mensaje
    function enviarMensaje() {
      if (nombre && email && mensaje) {
        successMessage = '¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.';
        errorMessage = '';
        nombre = '';
        email = '';
        mensaje = '';
      } else {
        successMessage = '';
        errorMessage = 'Por favor, complete todos los campos.';
      }
    }
  
    // Opcional: cargar información o inicializar algo al montar el componente
    onMount(() => {
      // Cargar información si es necesario
    });
  </script>
  
  <section class="bg-gray-900 min-h-screen py-20 px-6 text-white">
    <!-- Título -->
    <div class="text-center mb-12">
      <h1 class="text-3xl font-bold">Centro de Ayuda</h1>
      <p class="text-sm text-gray-400">Encuentra respuestas a tus preguntas y detalles de contacto</p>
    </div>
  
    <!-- Sección de Información de Contacto -->
    <div class="max-w-7xl mx-auto mb-12 p-6 bg-gray-800 rounded-xl shadow-lg">
      <h2 class="text-2xl font-semibold mb-4">Contáctanos</h2>
      <p class="text-lg mb-4">Si necesitas ayuda, no dudes en ponerte en contacto con nosotros a través de los siguientes medios:</p>
      
      <div class="space-y-4">
        <div class="flex items-center space-x-3">
          <svg class="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M3 6h18M3 14h18M3 18h18"></path>
          </svg>
          <span>{contactoEmail}</span>
        </div>
  
        <div class="flex items-center space-x-3">
          <svg class="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M20 9V7a2 2 0 0 0-2-2h-4V3a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2H6a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2z"></path>
          </svg>
          <span>{telefono}</span>
        </div>
  
        <div class="flex items-center space-x-3">
          <svg class="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 12h-6v6h6v-6zm-8 0H5v6h6v-6zM12 5v6h6V5h-6zM5 5v6h6V5H5z"></path>
          </svg>
          <span>{direccion}</span>
        </div>
      </div>
    </div>
  
    <!-- Sección del Libro de Reclamaciones -->
    <div class="max-w-7xl mx-auto mb-12 p-6 bg-gray-800 rounded-xl shadow-lg">
      <h2 class="text-2xl font-semibold mb-4">Libro de Reclamaciones</h2>
      <p class="text-lg mb-4">Si tienes algún inconveniente con tu compra o servicio, puedes dejar tu queja o sugerencia aquí:</p>
      <a href="mailto:soporte@tienda.com?subject=Reclamación" class="text-yellow-400 hover:text-yellow-500 underline">Enviar una reclamación</a>
    </div>
  
    <!-- Sección de Preguntas Frecuentes -->
    <div class="max-w-7xl mx-auto mb-12 p-6 bg-gray-800 rounded-xl shadow-lg">
      <h2 class="text-2xl font-semibold mb-4">Preguntas Frecuentes</h2>
      
      <div class="space-y-6">
        <div>
          <h3 class="text-lg font-medium">¿Cómo realizo un pedido?</h3>
          <p class="text-sm text-gray-400">Puedes agregar productos a tu carrito y proceder con el pago usando tarjetas de crédito o débito. Si necesitas ayuda, puedes contactarnos.</p>
        </div>
  
        <div>
          <h3 class="text-lg font-medium">¿Cuánto tarda el envío?</h3>
          <p class="text-sm text-gray-400">Los tiempos de envío dependen de tu ubicación, pero normalmente nuestros pedidos llegan entre 2 y 5 días hábiles.</p>
        </div>
  
        <div>
          <h3 class="text-lg font-medium">¿Puedo devolver un producto?</h3>
          <p class="text-sm text-gray-400">Sí, aceptamos devoluciones dentro de los 30 días posteriores a la compra. Asegúrate de que el producto esté en su estado original.</p>
        </div>
      </div>
    </div>
  
    <!-- Formulario de Contacto -->
    <div class="max-w-7xl mx-auto p-6 bg-gray-800 rounded-xl shadow-lg">
      <h2 class="text-2xl font-semibold mb-4">Envíanos un mensaje</h2>
  
      <div class="space-y-4">
        {#if successMessage}
          <div class="p-4 bg-green-500 text-white rounded-md">{successMessage}</div>
        {/if}
        {#if errorMessage}
          <div class="p-4 bg-red-500 text-white rounded-md">{errorMessage}</div>
        {/if}
  
        <div>
          <label for="nombre" class="block text-sm font-medium">Nombre</label>
          <input type="text" id="nombre" bind:value={nombre} class="w-full px-4 py-2 mt-2 bg-gray-700 text-white rounded-md" required />
        </div>
  
        <div>
          <label for="email" class="block text-sm font-medium">Email</label>
          <input type="email" id="email" bind:value={email} class="w-full px-4 py-2 mt-2 bg-gray-700 text-white rounded-md" required />
        </div>
  
        <div>
          <label for="mensaje" class="block text-sm font-medium">Mensaje</label>
          <textarea id="mensaje" bind:value={mensaje} class="w-full px-4 py-2 mt-2 bg-gray-700 text-white rounded-md" required></textarea>
        </div>
  
        <button type="button" on:click={enviarMensaje} class="mt-4 w-full bg-yellow-500 text-black px-6 py-3 rounded-md hover:bg-yellow-400 transition-all duration-200">Enviar</button>
      </div>
    </div>
  </section>
  
  <style>
    .animate-pulse {
      animation: pulse 1.5s infinite;
    }
  
    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.1); opacity: 0.8; }
    }
  
    .transition-all {
      transition: transform 0.3s ease-in-out;
    }
  
    .transform.-translate-y-full {
      transform: translateY(-100%);
    }
  </style>
  