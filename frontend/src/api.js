// src/api.js
const API_BASE = "https://alqycoxzai.execute-api.eu-north-1.amazonaws.com/live"; // Update with your API Gateway endpoint

export async function fetchProducts() {
    const resp = await fetch(`${API_BASE}/products`);
    return await resp.json();
}

export async function fetchProductById(id) {
    const resp = await fetch(`${API_BASE}/products/${id}`);
    return await resp.json();
}

export async function addProduct(product) {
    const resp = await fetch(`${API_BASE}/admin/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product)
    });
    return await resp.json();
}

export async function createOrder(orderData) {
    const resp = await fetch(`${API_BASE}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData)
    });
    return await resp.json();
}
