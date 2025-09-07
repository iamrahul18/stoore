import React, { useState } from 'react';
import { Search, Filter, ShoppingCart, Heart, Star, Plus, Minus, X, MapPin, User, CreditCard } from 'lucide-react';

export function CustomerView({ 
    products, 
    cart, 
    onAddToCart, 
    onRemoveFromCart, 
    onUpdateCartQuantity, 
    onClearCart,
    onCreateOrder,
    onNavigate,
    loading 
}) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [showCart, setShowCart] = useState(false);
    const [showCheckout, setShowCheckout] = useState(false);
    const [favorites, setFavorites] = useState(new Set());
    const [orderForm, setOrderForm] = useState({
        customer_name: '',
        address: ''
    });

    const categories = ['all', ...new Set(products.map(p => p.category || 'Uncategorized'))];
    
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || (product.category || 'Uncategorized') === selectedCategory;
        return matchesSearch && matchesCategory && product.is_available;
    });

    const toggleFavorite = (productId) => {
        setFavorites(prev => {
            const newFavorites = new Set(prev);
            if (newFavorites.has(productId)) {
                newFavorites.delete(productId);
            } else {
                newFavorites.add(productId);
            }
            return newFavorites;
        });
    };

    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    const handleCheckout = async (e) => {
        e.preventDefault();
        try {
            const orderData = {
                customer_name: orderForm.customer_name,
                address: orderForm.address,
                items: cart.map(item => ({
                    product_id: item._id,
                    quantity: item.quantity
                }))
            };
            
            await onCreateOrder(orderData);
            onClearCart();
            setShowCheckout(false);
            setShowCart(false);
            setOrderForm({ customer_name: '', address: '' });
            alert('Order placed successfully!');
        } catch (error) {
            console.error('Error placing order:', error);
            alert('Error placing order. Please try again.');
        }
    };

    return (
        <div className="customer-view">
            {/* Navigation */}
            <nav className="customer-nav">
                <div className="nav-container">
                    <div className="nav-brand" onClick={() => onNavigate('landing')}>
                        <div className="brand-icon">🏪</div>
                        <span>StoreHub</span>
                    </div>
                    
                    <div className="nav-search">
                        <Search size={20} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>
                    
                    <div className="nav-actions">
                        <button className="nav-btn" onClick={() => onNavigate('admin')}>
                            Admin
                        </button>
                        <button 
                            className="cart-btn"
                            onClick={() => setShowCart(true)}
                        >
                            <ShoppingCart size={20} />
                            {cartItemCount > 0 && (
                                <span className="cart-badge">{cartItemCount}</span>
                            )}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="customer-hero">
                <div className="hero-content">
                    <h1>Discover Amazing Products</h1>
                    <p>Shop the latest trends with fast delivery and great prices</p>
                </div>
            </div>

            {/* Filters */}
            <div className="filters-section">
                <div className="container">
                    <div className="filters-header">
                        <h3>Categories</h3>
                        <Filter size={20} />
                    </div>
                    <div className="category-filters">
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
                            >
                                {category === 'all' ? 'All Products' : category}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <div className="products-section">
                <div className="container">
                    {loading ? (
                        <div className="loading-state">
                            <div className="spinner"></div>
                            <p>Loading products...</p>
                        </div>
                    ) : (
                        <div className="products-grid">
                            {filteredProducts.map(product => (
                                <div key={product._id} className="product-card">
                                    <div className="product-image">
                                        <img 
                                            src={`https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop&sig=${product._id}`}
                                            alt={product.name}
                                        />
                                        <button 
                                            className={`favorite-btn ${favorites.has(product._id) ? 'active' : ''}`}
                                            onClick={() => toggleFavorite(product._id)}
                                        >
                                            <Heart size={18} fill={favorites.has(product._id) ? 'currentColor' : 'none'} />
                                        </button>
                                        <div className="product-badge">
                                            <Star size={12} />
                                            {(Math.random() * 2 + 3).toFixed(1)}
                                        </div>
                                    </div>
                                    
                                    <div className="product-info">
                                        <h3 className="product-name">{product.name}</h3>
                                        <p className="product-category">{product.category || 'Uncategorized'}</p>
                                        
                                        <div className="product-footer">
                                            <div className="price-section">
                                                <span className="price">₹{product.price}</span>
                                                <span className="stock">Stock: {product.stock_quantity}</span>
                                            </div>
                                            
                                            <button
                                                onClick={() => onAddToCart(product)}
                                                disabled={product.stock_quantity === 0}
                                                className="add-to-cart-btn"
                                            >
                                                <ShoppingCart size={16} />
                                                {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    
                    {!loading && filteredProducts.length === 0 && (
                        <div className="empty-state">
                            <div className="empty-icon">📦</div>
                            <h3>No products found</h3>
                            <p>Try adjusting your search or filter criteria</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Cart Sidebar */}
            {showCart && (
                <div className="cart-overlay" onClick={() => setShowCart(false)}>
                    <div className="cart-sidebar" onClick={(e) => e.stopPropagation()}>
                        <div className="cart-header">
                            <h3>Shopping Cart ({cartItemCount})</h3>
                            <button 
                                className="close-btn"
                                onClick={() => setShowCart(false)}
                            >
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="cart-content">
                            {cart.length === 0 ? (
                                <div className="empty-cart">
                                    <ShoppingCart size={48} />
                                    <p>Your cart is empty</p>
                                    <button 
                                        className="btn-primary"
                                        onClick={() => setShowCart(false)}
                                    >
                                        Continue Shopping
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="cart-items">
                                        {cart.map(item => (
                                            <div key={item._id} className="cart-item">
                                                <img 
                                                    src={`https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop&sig=${item._id}`}
                                                    alt={item.name}
                                                    className="cart-item-image"
                                                />
                                                <div className="cart-item-details">
                                                    <h4>{item.name}</h4>
                                                    <p>₹{item.price} each</p>
                                                </div>
                                                <div className="cart-item-controls">
                                                    <button
                                                        onClick={() => onUpdateCartQuantity(item._id, item.quantity - 1)}
                                                        className="quantity-btn"
                                                    >
                                                        <Minus size={12} />
                                                    </button>
                                                    <span className="quantity">{item.quantity}</span>
                                                    <button
                                                        onClick={() => onUpdateCartQuantity(item._id, item.quantity + 1)}
                                                        className="quantity-btn"
                                                    >
                                                        <Plus size={12} />
                                                    </button>
                                                    <button
                                                        onClick={() => onRemoveFromCart(item._id)}
                                                        className="remove-btn"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <div className="cart-footer">
                                        <div className="cart-total">
                                            <strong>Total: ₹{cartTotal.toFixed(2)}</strong>
                                        </div>
                                        <button 
                                            className="checkout-btn"
                                            onClick={() => setShowCheckout(true)}
                                        >
                                            <CreditCard size={16} />
                                            Proceed to Checkout
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Checkout Modal */}
            {showCheckout && (
                <div className="modal-overlay">
                    <div className="modal checkout-modal">
                        <div className="modal-header">
                            <h2>Complete Your Order</h2>
                            <button 
                                className="close-btn"
                                onClick={() => setShowCheckout(false)}
                            >
                                <X size={20} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleCheckout} className="checkout-form">
                            <div className="form-section">
                                <h3>
                                    <User size={20} />
                                    Customer Information
                                </h3>
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <input
                                        type="text"
                                        value={orderForm.customer_name}
                                        onChange={(e) => setOrderForm({...orderForm, customer_name: e.target.value})}
                                        placeholder="Enter your full name"
                                        required
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label>
                                        <MapPin size={16} />
                                        Delivery Address
                                    </label>
                                    <textarea
                                        value={orderForm.address}
                                        onChange={(e) => setOrderForm({...orderForm, address: e.target.value})}
                                        placeholder="Enter your complete delivery address"
                                        rows="3"
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div className="form-section">
                                <h3>Order Summary</h3>
                                <div className="order-items">
                                    {cart.map(item => (
                                        <div key={item._id} className="order-item">
                                            <span>{item.name} × {item.quantity}</span>
                                            <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="order-total">
                                    <strong>Total: ₹{cartTotal.toFixed(2)}</strong>
                                </div>
                            </div>
                            
                            <div className="form-actions">
                                <button 
                                    type="button" 
                                    className="btn-secondary"
                                    onClick={() => setShowCheckout(false)}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary">
                                    <CreditCard size={16} />
                                    Place Order
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}