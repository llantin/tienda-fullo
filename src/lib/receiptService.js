import { API_BASE_URL } from './api.js';

// src/lib/receiptService.js
export async function createReceipt(receiptData) {
    const res = await fetch(`${API_BASE_URL}/api/receipts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(receiptData),
    });
  
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      console.error('❌ Error al crear comprobante:', error);
      throw new Error(error.message || 'Error al registrar venta');
    }
  
    return await res.json();
  }
  