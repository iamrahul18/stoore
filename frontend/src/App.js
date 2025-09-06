import React, { useState, useEffect } from 'react';
import { fetchProducts, fetchProductById, addProduct, createOrder } from './api';
import { ProductList } from './components/ProductList';
import { ProductDetail } from './components/ProductDetail';
import { OrderForm } from './components/OrderForm';

function App() {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({name: "", price: "", stock_quantity: "", is_available: true});
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [productDetail, setProductDetail] = useState(null);

    useEffect(() => {
        fetchProducts().then(setProducts);
    }, []);

    async function handleSelect(id) {
        setSelectedProduct(id);
        const res = await fetchProductById(id);
        setProductDetail(res[1] ? res[1] : res);
    }

    async function handleAddProduct(e) {
        e.preventDefault();
        await addProduct({
            name: newProduct.name,
            price: Number(newProduct.price),
            stock_quantity: Number(newProduct.stock_quantity),
            is_available: Boolean(newProduct.is_available)
        });
        setNewProduct({name: "", price: "", stock_quantity: "", is_available: true});
        fetchProducts().then(setProducts);
    }

    async function handleCreateOrder(orderData) {
        const resp = await createOrder(orderData);
        fetchProducts().then(setProducts);
        return resp;
    }

    return (
        <div style={{padding: "2rem"}}>
            <h1>Store Management Demo</h1>
            <ProductList products={products} onSelect={handleSelect} />

            <form onSubmit={handleAddProduct} style={{marginBottom: "2rem"}}>
                <h2>Add Product</h2>
                <input placeholder="Name" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} required />
                <input placeholder="Price" type="number" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} required />
                <input placeholder="Stock" type="number" value={newProduct.stock_quantity} onChange={e => setNewProduct({...newProduct, stock_quantity: e.target.value})} required />
                <label>
                    Available:
                    <input type="checkbox" checked={newProduct.is_available} onChange={e => setNewProduct({...newProduct, is_available: e.target.checked})} />
                </label>
                <button type="submit">Add</button>
            </form>

            <ProductDetail product={productDetail} />
            <OrderForm productId={selectedProduct} onComplete={handleCreateOrder} />
        </div>
    );
}

export default App;
