import React from 'react';
import { Info, DollarSign, Package, CheckCircle, XCircle } from 'lucide-react';

export function ProductDetail({ product }) {
    if (!product) return null;

    return (
        <div className="product-detail">
            <h3>
                <Info size={20} />
                Product Details
            </h3>
            <div className="detail-grid">
                <div className="detail-item">
                    <span className="detail-label">Name:</span>
                    <span className="detail-value">{product.name}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">
                        <DollarSign size={16} style={{ marginRight: '4px' }} />
                        Price:
                    </span>
                    <span className="detail-value price-value">₹{product.price}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">
                        <Package size={16} style={{ marginRight: '4px' }} />
                        Stock:
                    </span>
                    <span className="detail-value">{product.stock_quantity} units</span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Availability:</span>
                    <span className={`availability-badge ${product.is_available ? 'available' : 'unavailable'}`}>
                        {product.is_available ? (
                            <>
                                <CheckCircle size={12} style={{ marginRight: '4px' }} />
                                Available
                            </>
                        ) : (
                            <>
                                <XCircle size={12} style={{ marginRight: '4px' }} />
                                Unavailable
                            </>
                        )}
                    </span>
                </div>
            </div>
        </div>
    );
}