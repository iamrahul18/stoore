import React, { useState, useEffect } from 'react';
import { fetchProducts, fetchProductById, addProduct, createOrder } from './api';
import './App.css';

// Icon components using Unicode symbols
const ShoppingCart = ({ size = 20, className = "" }) => <span className={className} style={{fontSize: size}}>🛒</span>;
const Package = ({ size = 20, className = "" }) => <span className={className} style={{fontSize: size}}>📦</span>;
const Users = ({ size = 20, className = "" }) => <span className={className} style={{fontSize: size}}>👥</span>;
const Plus = ({ size = 20, className = "" }) => <span className={className} style={{fontSize: size}}>➕</span>;
const Edit = ({ size = 20, className = "" }) => <span className={className} style={{fontSize: size}}>✏️</span>;
const Trash2 = ({ size = 20, className = "" }) => <span className={className} style={{fontSize: size}}>🗑️</span>;
const Eye = ({ size = 20, className = "" }) => <span className={className} style={{fontSize: size}}>👁️</span>;
const Search = ({ size = 20, className = "" }) => <span className={className} style={{fontSize: size}}>🔍</span>;
const Heart = ({ size = 20, className = "" }) => <span className={className} style={{fontSize: size}}>❤️</span>;
const ShoppingBag = ({ size = 20, className = "" }) => <span className={className} style={{fontSize: size}}>🛍️</span>;
const Store = ({ size = 20, className = "" }) => <span className={className} style={{fontSize: size}}>🏪</span>;
const User = ({ size = 20, className = "" }) => <span className={className} style={{fontSize: size}}>👤</span>;
const Settings = ({ size = 20, className = "" }) => <span className={className} style={{fontSize: size}}>⚙️</span>;
const ArrowRight = ({ size = 20, className = "" }) => <span className={className} style={{fontSize: size}}>→</span>;

function App() {
    const [currentView, setCurrentView] = useState('landing'); // landing, customer, admin
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showAddProduct, setShowAddProduct] = useState(false);
    const [showOrderForm, setShowOrderForm] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: '',
        price: '',
        description: '',
        category: '',
        stock_quantity: '',
        is_available: true
    });
    const [orderForm, setOrderForm] = useState({
        customer_name: '',
        address: '',
        items: []
    });

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        setLoading(true);
        try {
            const data = await fetchProducts();
            setProducts(data);
        } catch (error) {
            console.error('Error loading products:', error);
            // Fallback to sample data
            setProducts([
                {
                    _id: '1',
                    name: 'Premium Wireless Headphones',
                    price: 299.99,
                    description: 'High-quality wireless headphones with noise cancellation',
                    category: 'Electronics',
                    stock_quantity: 15,
                    is_available: true
                },
                {
                    _id: '2',
                    name: 'Organic Coffee Beans',
                    price: 24.99,
                    description: 'Premium organic coffee beans from Colombia',
                    category: 'Food & Beverage',
                    stock_quantity: 50,
                    is_available: true
                },
                {
                    _id: '3',
                    name: 'Smart Fitness Tracker',
                    price: 199.99,
                    description: 'Track your fitness goals with this advanced wearable',
                    category: 'Electronics',
                    stock_quantity: 8,
                    is_available: true
                }
            ]);
        }
        setLoading(false);
    };

    const addToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(item => item._id === product._id);
            if (existing) {
                return prev.map(item => 
                    item._id === product._id 
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId) => {
        setCart(prev => prev.filter(item => item._id !== productId));
    };

    const updateCartQuantity = (productId, quantity) => {
        if (quantity === 0) {
            removeFromCart(productId);
            return;
        }
        setCart(prev => prev.map(item => 
            item._id === productId ? { ...item, quantity } : item
        ));
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            await addProduct({
                ...newProduct,
                price: Number(newProduct.price),
                stock_quantity: Number(newProduct.stock_quantity)
            });
            setNewProduct({
                name: '',
                price: '',
                description: '',
                category: '',
                stock_quantity: '',
                is_available: true
            });
            setShowAddProduct(false);
            loadProducts();
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };

    const handleCreateOrder = async (e) => {
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
            await createOrder(orderData);
            setOrderForm({ customer_name: '', address: '', items: [] });
            setCart([]);
            setShowOrderForm(false);
            loadProducts();
        } catch (error) {
            console.error('Error creating order:', error);
        }
    };

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const categories = [...new Set(products.map(p => p.category))];

    // Landing Page Component
    const LandingPage = () => (
        <div className="landing-page">
            <div className="landing-hero">
                <div className="landing-content">
                    <div className="landing-logo">
                        <Store size={80} />
                        <h1>StoreHub</h1>
                    </div>
                    <p className="landing-subtitle">
                        Modern Store Management System
                    </p>
                    <p className="landing-description">
                        Manage your products, track orders, and provide excellent customer experience
                        with our comprehensive store management platform.
                    </p>
                    <div className="landing-buttons">
                        <button 
                            className="btn-primary landing-btn"
                            onClick={() => setCurrentView('customer')}
                        >
                            <User size={20} />
                            Customer Store
                            <ArrowRight size={16} />
                        </button>
                        <button 
                            className="btn-secondary landing-btn"
                            onClick={() => setCurrentView('admin')}
                        >
                            <Settings size={20} />
                            Admin Panel
                            <ArrowRight size={16} />
                        </button>
                    </div>
                </div>
                <div className="landing-features">
                    <div className="feature-card">
                        <ShoppingCart size={40} />
                        <h3>Easy Shopping</h3>
                        <p>Browse and purchase products with a seamless shopping experience</p>
                    </div>
                    <div className="feature-card">
                        <Package size={40} />
                        <h3>Product Management</h3>
                        <p>Efficiently manage your inventory and product catalog</p>
                    </div>
                    <div className="feature-card">
                        <Users size={40} />
                        <h3>Order Tracking</h3>
                        <p>Track and manage customer orders in real-time</p>
                    </div>
                </div>
            </div>
        </div>
    );

    // Customer View Component
    const CustomerView = () => (
        <div className="customer-view">
            <div className="customer-hero">
                <div className="hero-content">
                    <h1>Discover Amazing Products</h1>
                    <p>Shop the latest trends with lightning-fast delivery</p>
                    <div className="search-container">
                        <Search className="search-icon" size={20} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="filters-container">
                <button
                    onClick={() => setSelectedCategory('all')}
                    className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
                >
                    All Products
                </button>
                {categories.map(category => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            <div className="products-grid">
                {filteredProducts.map(product => (
                    <div key={product._id} className="product-card">
                        <div className="product-image">
                            <img 
                                src={`https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop&sig=${product._id}`}
                                alt={product.name}
                            />
                            <button className="favorite-btn">
                                <Heart size={20} />
                            </button>
                            <div className="rating-badge">
                                ⭐ {(Math.random() * 2 + 3).toFixed(1)}
                            </div>
                        </div>
                        
                        <div className="product-info">
                            <h3>{product.name}</h3>
                            <p className="product-description">{product.description}</p>
                            
                            <div className="product-footer">
                                <span className="price">${product.price}</span>
                                <span className="stock">Stock: {product.stock_quantity}</span>
                            </div>
                            
                            <button
                                onClick={() => addToCart(product)}
                                disabled={product.stock_quantity === 0}
                                className="add-to-cart-btn"
                            >
                                <ShoppingCart size={20} />
                                {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {cart.length > 0 && (
                <div className="cart-sidebar">
                    <div className="cart-header">
                        <h3>
                            <ShoppingBag />
                            Shopping Cart ({cart.length})
                        </h3>
                    </div>
                    
                    <div className="cart-items">
                        {cart.map(item => (
                            <div key={item._id} className="cart-item">
                                <div className="cart-item-info">
                                    <h4>{item.name}</h4>
                                    <p>${item.price} each</p>
                                </div>
                                <div className="cart-item-controls">
                                    <button
                                        onClick={() => updateCartQuantity(item._id, item.quantity - 1)}
                                        className="quantity-btn"
                                    >
                                        -
                                    </button>
                                    <span>{item.quantity}</span>
                                    <button
                                        onClick={() => updateCartQuantity(item._id, item.quantity + 1)}
                                        className="quantity-btn"
                                    >
                                        +
                                    </button>
                                    <button
                                        onClick={() => removeFromCart(item._id)}
                                        className="remove-btn"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="cart-footer">
                        <div className="cart-total">
                            Total: ${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                        </div>
                        <button 
                            className="checkout-btn"
                            onClick={() => setShowOrderForm(true)}
                        >
                            Checkout
                        </button>
                    </div>
                </div>
            )}

            {showOrderForm && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h2>Complete Your Order</h2>
                            <button 
                                className="close-btn"
                                onClick={() => setShowOrderForm(false)}
                            >
                                ✕
                            </button>
                        </div>
                        <form onSubmit={handleCreateOrder} className="order-form">
                            <div className="form-group">
                                <label>Customer Name</label>
                                <input
                                    type="text"
                                    value={orderForm.customer_name}
                                    onChange={(e) => setOrderForm({...orderForm, customer_name: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Delivery Address</label>
                                <textarea
                                    value={orderForm.address}
                                    onChange={(e) => setOrderForm({...orderForm, address: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="order-summary">
                                <h3>Order Summary</h3>
                                {cart.map(item => (
                                    <div key={item._id} className="order-item">
                                        <span>{item.name} x {item.quantity}</span>
                                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                                <div className="order-total">
                                    <strong>Total: ${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}</strong>
                                </div>
                            </div>
                            <button type="submit" className="btn-primary">
                                Place Order
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );

    // Admin View Component
    const AdminView = () => (
        <div className="admin-view">
            <div className="admin-header">
                <h1>Admin Dashboard</h1>
                <p>Manage your products and orders</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-content">
                        <h3>Total Products</h3>
                        <p>{products.length}</p>
                    </div>
                    <Package size={40} />
                </div>

                <div className="stat-card">
                    <div className="stat-content">
                        <h3>Total Orders</h3>
                        <p>{orders.length}</p>
                    </div>
                    <ShoppingCart size={40} />
                </div>

                <div className="stat-card">
                    <div className="stat-content">
                        <h3>Low Stock</h3>
                        <p>{products.filter(p => p.stock_quantity < 10).length}</p>
                    </div>
                    <Users size={40} />
                </div>
            </div>

            <div className="admin-section">
                <div className="section-header">
                    <h2>Product Management</h2>
                    <button 
                        className="btn-primary"
                        onClick={() => setShowAddProduct(true)}
                    >
                        <Plus size={20} />
                        Add Product
                    </button>
                </div>

                <div className="products-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product._id}>
                                    <td>
                                        <div className="product-cell">
                                            <img 
                                                src={`https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=50&h=50&fit=crop&sig=${product._id}`}
                                                alt={product.name}
                                            />
                                            <div>
                                                <h4>{product.name}</h4>
                                                <p>{product.category}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="price-cell">${product.price}</td>
                                    <td>
                                        <span className={`stock-badge ${product.stock_quantity < 10 ? 'low' : 'good'}`}>
                                            {product.stock_quantity}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`status-badge ${product.is_available ? 'available' : 'unavailable'}`}>
                                            {product.is_available ? 'Available' : 'Unavailable'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="action-btn view">
                                                <Eye size={16} />
                                            </button>
                                            <button className="action-btn edit">
                                                <Edit size={16} />
                                            </button>
                                            <button className="action-btn delete">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showAddProduct && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h2>Add New Product</h2>
                            <button 
                                className="close-btn"
                                onClick={() => setShowAddProduct(false)}
                            >
                                ✕
                            </button>
                        </div>
                        <form onSubmit={handleAddProduct} className="product-form">
                            <div className="form-group">
                                <label>Product Name</label>
                                <input
                                    type="text"
                                    value={newProduct.name}
                                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Price</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={newProduct.price}
                                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    value={newProduct.description}
                                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                                />
                            </div>
                            <div className="form-group">
                                <label>Category</label>
                                <input
                                    type="text"
                                    value={newProduct.category}
                                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                                />
                            </div>
                            <div className="form-group">
                                <label>Stock Quantity</label>
                                <input
                                    type="number"
                                    value={newProduct.stock_quantity}
                                    onChange={(e) => setNewProduct({...newProduct, stock_quantity: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-group checkbox-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={newProduct.is_available}
                                        onChange={(e) => setNewProduct({...newProduct, is_available: e.target.checked})}
                                    />
                                    Available for Sale
                                </label>
                            </div>
                            <button type="submit" className="btn-primary">
                                Add Product
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div className="app">
            {currentView === 'landing' && <LandingPage />}
            
            {currentView !== 'landing' && (
                <>
                    <nav className="navbar">
                        <div className="nav-content">
                            <div className="nav-brand" onClick={() => setCurrentView('landing')}>
                                <Store size={32} />
                                <h1>StoreHub</h1>
                            </div>
                            
                            <div className="nav-buttons">
                                <button
                                    onClick={() => setCurrentView('customer')}
                                    className={`nav-btn ${currentView === 'customer' ? 'active' : ''}`}
                                >
                                    <User size={20} />
                                    Customer
                                </button>
                                <button
                                    onClick={() => setCurrentView('admin')}
                                    className={`nav-btn ${currentView === 'admin' ? 'active' : ''}`}
                                >
                                    <Settings size={20} />
                                    Admin
                                </button>
                            </div>
                        </div>
                    </nav>

                    <main className="main-content">
                        {currentView === 'customer' && <CustomerView />}
                        {currentView === 'admin' && <AdminView />}
                    </main>
                </>
            )}
        </div>
    );
}

export default App;