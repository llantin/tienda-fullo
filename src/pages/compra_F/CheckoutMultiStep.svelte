<script>
  import Step1Buyer from "./Step1Buyer.svelte";
  import Step2Delivery from "./Step2Delivery.svelte";
  import Step3Payment from "./Step3Payment.svelte";
  import { cart } from "../../stores/cart.js";
  import { get } from "svelte/store";
  import { push } from "svelte-spa-router";
  import { API_BASE_URL } from "../../lib/api.js";

  let step = 1;
  let buyer = null;
  let delivery = null;
  let pago = null;
  let processing = false;

  function next(data) {
    if (step === 1) buyer = data;
    if (step === 2) delivery = data;
    step = Math.min(3, step + 1);
  }

  function back() {
    step = Math.max(1, step - 1);
  }

  async function finishCheckout(paymentData) {
    pago = paymentData;
    const articulos = get(cart).map((i) => ({
      item_id: i.id,
      quantity: i.quantity,
      price: i.price,
      unit: i.unit || "UND",
      name: i.name,
    }));

    const payload = {
      document_type: buyer.document_type,
      document_number: buyer.document_number,
      email: buyer.email,
      phone: buyer.phone,
      tipo_entrega: delivery.tipo_entrega,
      direccion: delivery.direccion,
      referencia: delivery.referencia,
      latitud: delivery.latitud,
      longitud: delivery.longitud,
      receipt_code: "CC-" + Math.floor(Math.random() * 99999),
      description: buyer.document_type === "RUC" ? "Factura" : "Boleta",
      user_id: 2,
      type: "Venta",
      articulos,
    };

    processing = true;

    try {
      const res = await fetch(`${API_BASE_URL}/api/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok) {
        // Laravel devuelve status 422 con los errores de validación
        let mensaje = "Error al procesar el pago: ";
        mensaje += json.message ?? "Ocurrió un error.";

        if (json.errors) {
          const detalles = Object.values(json.errors).flat().join("\n");
          mensaje += "\n" + detalles;
        }

        throw new Error(mensaje);
      }

      // ✅ Si todo fue bien
      cart.set([]);

      const hashOrden = json.data?.delivery?.hashOrden;
      if (hashOrden) {
        push(`/checkout/success/${hashOrden}`);
      } else {
        alert("Error: No se ha recibido un hashOrden válido.");
      }
    } catch (err) {
      alert(err.message ?? "Ocurrió un error inesperado.");
    } finally {
      processing = false;
    }
  }
</script>

<!-- Contenedor principal -->
<div
  class="min-h-screen bg-gray-50 flex items-center justify-center py-10 px-4"
>
  <div class="w-full max-w-3xl bg-white shadow-xl rounded-xl p-8 space-y-6">
    <!-- Título -->
    <h1 class="text-2xl font-bold text-gray-800 text-center">Checkout</h1>

    <!-- Progress Steps -->
    <div class="flex justify-between items-center mb-6">
      <div class="flex-1 text-center">
        <div
          class={`w-10 h-10 mx-auto rounded-full flex items-center justify-center ${step >= 1 ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-500"}`}
        >
          1
        </div>
        <div class="mt-2 text-sm font-medium text-gray-700">Datos</div>
      </div>
      <div class="flex-1 text-center">
        <div
          class={`w-10 h-10 mx-auto rounded-full flex items-center justify-center ${step >= 2 ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-500"}`}
        >
          2
        </div>
        <div class="mt-2 text-sm font-medium text-gray-700">Entrega</div>
      </div>
      <div class="flex-1 text-center">
        <div
          class={`w-10 h-10 mx-auto rounded-full flex items-center justify-center ${step >= 3 ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-500"}`}
        >
          3
        </div>
        <div class="mt-2 text-sm font-medium text-gray-700">Pago</div>
      </div>
    </div>

    <!-- Step Content -->
    <div class="space-y-6">
      {#if step === 1}
        <Step1Buyer on:next={(e) => next(e.detail)} />
      {:else if step === 2}
        <Step2Delivery {buyer} on:back={back} on:next={(e) => next(e.detail)} />
      {:else}
        <Step3Payment
          {buyer}
          {delivery}
          on:back={back}
          on:finish={(e) => finishCheckout(e.detail)}
        />
      {/if}
    </div>

    <!-- Processing Overlay -->
    {#if processing}
      <div
        class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
      >
        <div
          class="bg-white p-6 rounded-lg flex flex-col items-center shadow-lg"
        >
          <svg
            class="animate-spin h-10 w-10 text-blue-500 mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            ></path>
          </svg>
          <span class="text-blue-600 font-semibold"
            >Procesando tu pedido...</span
          >
        </div>
      </div>
    {/if}
  </div>
</div>
