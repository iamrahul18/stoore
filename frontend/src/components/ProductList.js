import React from 'react';
import { Package, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

export function ProductList({ products, onSelect, loading }) {
    if (loading) {
        return (
            <div className="product-list">
                <div className="loading">
                    <div className="spinner"></div>
                </div>
            </div>
        );
    }

    const getStockStatus = (stock) => {
        if (stock === 0) return { class: 'stock-out', text: 'Out of Stock', icon: AlertTriangle };
        if (stock < 10) return { class: 'stock-low', text: `${stock} left`, icon: TrendingDown };
        return { class: 'stock-good', text: `${stock} in stock`, icon: TrendingUp };
    };

    return (
        <div className="product-list">
            <h2>
                <Package size={24} />
                All Products ({products.length})
            </h2>
            <div className="product-grid">
                {products.map(product => {
                    const stockStatus = getStockStatus(product.stock_quantity);
                    const StockIcon = stockStatus.icon;
                    
                    return (
                        <div 
                            key={product._id}
                            className="product-card"
                            onClick={() => onSelect(product._id)}
                        >
                            <div className="product-name">{product.name}</div>
                            <div className="product-info">
                                <span className="price">₹{product.price}</span>
                                <span className={`stock-badge ${stockStatus.class}`}>
                                    <StockIcon size={12} style={{ marginRight: '4px' }} />
                                    {stockStatus.text}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
            {products.length === 0 && (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                    <Package size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                    <p>No products available. Add some products to get started!</p>
                </div>
            )}
        </div>
    );
}