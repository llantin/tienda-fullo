<script>
    import { createEventDispatcher, onMount } from 'svelte';
    import L from 'leaflet';
  
    const dispatch = createEventDispatcher();
  
    export let buyer;
  
    let tipo_entrega = 'delivery';
    let direccion = '';
    let referencia = '';
    let lat = -12.0464; // default Lima
    let lng = -77.0428;
    let fecha_programada = null;
  
    let mapaVisible = false;
    let map, marker;
  
    // Coordenadas de la tienda
    const tiendaLat = -12.0464;
    const tiendaLng = -77.0428;
  
    function mapAction(node) {
      map = L.map(node).setView([lat, lng], 16);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map);
  
      marker = L.marker([lat, lng], { draggable: tipo_entrega === 'delivery' }).addTo(map);
  
      if (tipo_entrega === 'delivery') {
        marker.on('dragend', () => {
          const p = marker.getLatLng();
          lat = p.lat;
          lng = p.lng;
        });
  
        map.on('click', (e) => {
          marker.setLatLng(e.latlng);
          lat = e.latlng.lat;
          lng = e.latlng.lng;
        });
      }
  
      setTimeout(() => map.invalidateSize(), 100);
  
      return {
        destroy() {
          map.remove();
        },
      };
    }
  
    function mostrarMapa() {
      if (direccion.trim()) {
        lat = -12.0464; // Si quieres, puedes geocodificar aquí
        lng = -77.0428;
        mapaVisible = true;
      } else {
        alert('Por favor, ingresa una dirección primero.');
      }
    }
  
    // Mostrar mapa fijo si es tienda
    $: if (tipo_entrega === 'tienda') {
      mapaVisible = true;
      lat = tiendaLat;
      lng = tiendaLng;
    } else if (tipo_entrega === 'delivery' && !direccion.trim()) {
      mapaVisible = false;
    }
  
    function confirmDelivery() {
      if (tipo_entrega === 'delivery' && !direccion.trim()) {
        alert('Ingresa dirección de entrega');
        return;
      }
  
      dispatch('next', {
        tipo_entrega,
        direccion: tipo_entrega === 'delivery' ? direccion : null,
        referencia,
        latitud: lat,
        longitud: lng,
        fecha_programada,
      });
    }
  
    function goBack() {
      dispatch('back');
    }
  </script>
  
  <style>
    #map {
      height: 300px;
      width: 100%;
      border-radius: 0.5rem;
      margin-top: 1rem;
    }
  </style>
  
  <div class="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md space-y-6">
    <h3 class="text-xl font-semibold text-gray-800 mb-4">2) Información de entrega</h3>
  
    <div class="space-y-2">
      <label class="inline-flex items-center space-x-2">
        <input type="radio" bind:group={tipo_entrega} value="delivery" class="form-radio text-blue-600" />
        <span>Envío a domicilio</span>
      </label>
      <label class="inline-flex items-center space-x-2">
        <input type="radio" bind:group={tipo_entrega} value="tienda" class="form-radio text-blue-600" />
        <span>Recoger en tienda (14:00 - 18:00)</span>
      </label>
    </div>
  
    {#if tipo_entrega === 'delivery'}
      <input
        type="text"
        placeholder="Dirección"
        bind:value={direccion}
        class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        autocomplete="off"
      />
      <input
        type="text"
        placeholder="Referencia (opcional)"
        bind:value={referencia}
        class="w-full border border-gray-300 rounded px-3 py-2 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        autocomplete="off"
      />
<!--   
      <button
        on:click={mostrarMapa}
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition mt-3"
        disabled={!direccion.trim()}
      >
        Ver ubicación en mapa
      </button> -->
    {:else}
      <div class="bg-gray-100 rounded p-4 text-gray-700">
        <p><strong>Dirección tienda:</strong> Av. Tu Tienda 123</p>
        <p><strong>Horario de recogida:</strong> 14:00 - 18:00</p>
      </div>
    {/if}
  
    {#if mapaVisible}
      <div id="map" use:mapAction></div>
    {/if}
  
    <div class="flex justify-between mt-6">
      <button on:click={goBack} class="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded transition">
        Volver
      </button>
      <button on:click={confirmDelivery} class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
        Continuar
      </button>
    </div>
  </div>
  
  <link
    rel="stylesheet"
    href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
    integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
    crossorigin=""
  />
  