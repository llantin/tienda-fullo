<script>
  import { showNotification } from '../stores/cart.js';
</script>

<!-- Contenedor general -->
<div class="fixed inset-0 flex items-center justify-center z-50 p-2 pointer-events-none">
{#if $showNotification}
  <div
    class="absolute bg-gradient-to-r bottom-5 from-blue-500 via-indigo-500 to-purple-500
    text-white font-semibold rounded-3xl shadow-xl pointer-events-auto py-3 px-8 text-center animate-pop"
  >
    <p class="text-lg drop-shadow-md">Producto agregado al carrito</p>

    <!-- Sombra animada -->
    <div
      class="absolute inset-0 rounded-3xl border border-white/30 animate-pulse opacity-50"
    ></div>
  </div>
{/if}
</div>

<style>
@keyframes pop {
  0% { transform: scale(0.8) translateY(10px); opacity: 0; }
  50% { transform: scale(1.05) translateY(-5px); opacity: 1; }
  100% { transform: scale(1) translateY(0); opacity: 1; }
}

/* Animación para el pop y flotación */
.animate-pop {
  animation: pop 0.6s ease-out, flotar 3s ease-in-out infinite;
}

/* Efecto de flotación para hacerla más dinámica */
@keyframes flotar {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

/* Estilo general para la notificación */
.bg-gradient-to-r {
  background: linear-gradient(to right, #3b82f6, #6366f1, #8b5cf6);
}

.drop-shadow-md {
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

/* Sombra sutil y bordes redondeados */
.rounded-3xl {
  border-radius: 1.5rem;
}

/* Transición suave en el borde */
.animate-pulse {
  animation: pulse 2s ease-in-out infinite;
}

/* Suavizado de la sombra */
.shadow-xl {
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}
</style>
