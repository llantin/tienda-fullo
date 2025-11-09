<!-- src/App.svelte -->
<script>
  import Router from 'svelte-spa-router';

  import Cabecera from './pages/componentes/cabecera.svelte';
  import Footer from './pages/componentes/Footer.svelte';
  import ModalNotifi from './pages/ModalNotifi.svelte';
  import Carrito from './pages/Carrito.svelte';

  import Inicio from './pages/Inicio.svelte';
  import DetalleProducto from './pages/DetalleProducto.svelte';
  import Checkout from './pages/Checkout.svelte';
  import CheckoutMultiStep from './pages/compra_F/CheckoutMultiStep.svelte';
  import SuccessPurchase from './pages/compra_F/SuccessPurchase.svelte';

  import LoMsVendido from './pages/pagina_cab/LoMásVendido.svelte';
  import Recomendados from './pages/pagina_cab/Recomendados.svelte';
  import Ayuda from './pages/pagina_cab/Ayuda.svelte';

  import { cartOpen } from './stores/ui.js';

  const routes = {
    '/': Inicio,
    '/mas-vendidos': LoMsVendido,
    '/recomendados': Recomendados,
    '/ayuda': Ayuda,
    '/producto/:id': DetalleProducto,
    '/checkout': Checkout,
    '/Paycheckout': CheckoutMultiStep,
    '/checkout/success/:hash': SuccessPurchase
  };

  // Debug: ver cambios en el store
  $: console.log('%c[App] cartOpen ->', 'color: magenta; font-weight:bold;', $cartOpen);
</script>

<ModalNotifi />

<!-- Cabecera: ya NO necesita on:toggleCheckout -->
<div class="fixed top-0 z-50 bg-white shadow-md w-full">
  <Cabecera />
</div>

<main class="pt-20">
  <Router {routes} />
</main>

<!-- Mostrar carrito cuando $cartOpen = true -->
{#if $cartOpen}
  <Carrito />
{/if}

<Footer />
