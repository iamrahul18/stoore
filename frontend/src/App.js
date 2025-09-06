import React, { useState, useEffect } from 'react';
import { fetchProducts, fetchProductById, addProduct, createOrder } from './api';
import { ProductList } from './components/ProductList';
import { ProductDetail } from './components/ProductDetail';
import { OrderForm } from './components/OrderForm';
import { AddProductForm } from './components/AddProductForm';
import { Header } from './components/Header';
import { ShoppingBag, Package, Plus } from 'lucide-react';
import './App.css';

function App() {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({name: "", price: "", stock_quantity: "", is_available: true});
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [productDetail, setProductDetail] = useState(null);
    const [activeTab, setActiveTab] = useState('products');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts().then(data => {
            setProducts(data);
            setLoading(false);
        });
    }, []);

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

    return (
        <div className="app">
            <Header />
            
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