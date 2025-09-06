import React from 'react';

export function ProductList({ products, onSelect }) {
    return (
        <div>
            <h2>All Products</h2>
            <ul>
                {products.map(p => (
                    <li key={p._id}>
                        <button onClick={() => onSelect(p._id)}>
                            {p.name} (Stock: {p.stock_quantity})
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
