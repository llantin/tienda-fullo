export const API_BASE_URL = 'https://backend-fullo.onrender.com';

export async function getItems() {
  const res = await fetch(`${API_BASE_URL}/api/items/with-stock`);
  if (!res.ok) throw new Error('Error al obtener items');
  return await res.json();
}

export async function getItemById(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/items/with-stock/${id}`);
    if (res.ok) {
      const data = await res.json();
      return data.item ?? data; // Asegúrate de que "item" esté presente en la respuesta
    } else {
      throw new Error(`Error al obtener producto: ${res.statusText}`);
    }
  } catch (err) {
    console.error('Fallo al obtener item individual:', err);
    // Retorna un valor predeterminado o null en caso de error
    return null;
  }
}
