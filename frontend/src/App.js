import React, { useState, useEffect } from 'react';
import { fetchProducts, fetchProductById, addProduct, createOrder } from './api';
import { ProductList } from './components/ProductList';
import { ProductDetail } from './components/ProductDetail';
import { OrderForm } from './components/OrderForm';
import { AddProductForm } from './components/AddProductForm';
import { Header } from './components/Header';
import { CustomerView } from './components/CustomerView';
import { AdminDashboard } from './components/AdminDashboard';
import { LandingPage } from './components/LandingPage';
import { ShoppingBag, Package, Plus, User, Settings } from 'lucide-react';
import './App.css';

function App() {
    const [currentView, setCurrentView] = useState('landing'); // landing, customer, admin, products
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({name: "", price: "", stock_quantity: "", is_available: true});
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [productDetail, setProductDetail] = useState(null);
    const [activeTab, setActiveTab] = useState('products');
    const [loading, setLoading] = useState(false);
    const [cart, setCart] = useState([]);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        if (currentView === 'products' || currentView === 'admin' || currentView === 'customer') {
            loadProducts();
        }
    }, [currentView]);

    const loadProducts = async () => {
        setLoading(true);
        try {
            const data = await fetchProducts();
            setProducts(data);
        } catch (error) {
            console.error('Error loading products:', error);
        }
        setLoading(false);
    };

    async function handleSelect(id) {
        setSelectedProduct(id);
        const res = await fetchProductById(id);
        setProductDetail(res[1] ? res[1] : res);
    }

    async function handleAddProduct(productData) {
        await addProduct(productData);
        setNewProduct({name: "", price: "", stock_quantity: "", is_available: true});
        const updatedProducts = await fetchProducts();
        setProducts(updatedProducts);
    }

    async function handleCreateOrder(orderData) {
        const resp = await createOrder(orderData);
        const updatedProducts = await fetchProducts();
        setProducts(updatedProducts);
        return resp;
    }

    const addToCart = (product, quantity = 1) => {
        setCart(prev => {
            const existing = prev.find(item => item._id === product._id);
            if (existing) {
                return prev.map(item => 
                    item._id === product._id 
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prev, { ...product, quantity }];
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

    const clearCart = () => {
        setCart([]);
    };

    if (currentView === 'landing') {
        return <LandingPage onNavigate={setCurrentView} />;
    }

    if (currentView === 'customer') {
        return (
            <CustomerView 
                products={products}
                cart={cart}
                onAddToCart={addToCart}
                onRemoveFromCart={removeFromCart}
                onUpdateCartQuantity={updateCartQuantity}
                onClearCart={clearCart}
                onCreateOrder={handleCreateOrder}
                onNavigate={setCurrentView}
                loading={loading}
            />
        );
    }

    if (currentView === 'admin') {
        return (
            <AdminDashboard 
                products={products}
                orders={orders}
                onAddProduct={handleAddProduct}
                onNavigate={setCurrentView}
                loading={loading}
            />
        );
    }

    return (
        <div className="app">
            <Header onNavigate={setCurrentView} currentView={currentView} />
            
            <div className="container">
                <div className="tab-navigation">
                    <button 
                        className={`tab-button ${activeTab === 'products' ? 'active' : ''}`}
                        onClick={() => setActiveTab('products')}
                    >
                        <Package size={20} />
                        Products
                    </button>
                    <button 
                        className={`tab-button ${activeTab === 'add-product' ? 'active' : ''}`}
                        onClick={() => setActiveTab('add-product')}
                    >
                        <Plus size={20} />
                        Add Product
                    </button>
                    <button 
                        className={`tab-button ${activeTab === 'orders' ? 'active' : ''}`}
                        onClick={() => setActiveTab('orders')}
                    >
                        <ShoppingBag size={20} />
                        Orders
                    </button>
                </div>

                <div className="content">
                    {activeTab === 'products' && (
                        <div className="products-section">
                            <ProductList 
                                products={products} 
                                onSelect={handleSelect} 
                                loading={loading}
                            />
                            {productDetail && (
                                <div className="product-details-section">
                                    <ProductDetail product={productDetail} />
                                    <OrderForm 
                                        productId={selectedProduct} 
                                        onComplete={handleCreateOrder} 
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'add-product' && (
                        <AddProductForm onSubmit={handleAddProduct} />
                    )}

                    {activeTab === 'orders' && (
                        <div className="orders-section">
                            <h2>Order Management</h2>
                            <p className="coming-soon">Order history and management features coming soon!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;