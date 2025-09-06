import React from 'react';

export function ProductDetail({ product }) {
    if (!product) return null;
    return (
        <div style={{border: "1px solid #ccc", padding: "1rem", margin: "1rem 0"}}>
            <h3>Product Detail</h3>
            <div><b>Name:</b> {product.name}</div>
            <div><b>Price:</b> ₹{product.price}</div>
            <div><b>Stock:</b> {product.stock_quantity}</div>
            <div><b>Available:</b> {product.is_available ? "Yes" : "No"}</div>
        </div>
    );
}
