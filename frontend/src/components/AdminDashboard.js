import React, { useState } from 'react';
import { Package, ShoppingCart, TrendingUp, Users, Plus, Edit, Trash2, Eye, Search, Filter, X } from 'lucide-react';

export function AdminDashboard({ products, orders, onAddProduct, onNavigate, loading }) {
    const [showAddProduct, setShowAddProduct] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [newProduct, setNewProduct] = useState({
        name: '',
        price: '',
        description: '',
        category: '',
        stock_quantity: '',
        is_available: true
    });

    const categories = ['all', ...new Set(products.map(p => p.category || 'Uncategorized'))];
    
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || (product.category || 'Uncategorized') === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const stats = {
        totalProducts: products.length,
        totalOrders: orders.length,
        lowStock: products.filter(p => p.stock_quantity < 10).length,
        outOfStock: products.filter(p => p.stock_quantity === 0).length,
        totalValue: products.reduce((sum, p) => sum + (p.price * p.stock_quantity), 0)
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            await onAddProduct({
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
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };

    return (
        <div className="admin-dashboard">
            {/* Navigation */}
            <nav className="admin-nav">
                <div className="nav-container">
                    <div className="nav-brand" onClick={() => onNavigate('landing')}>
                        <div className="brand-icon">🏪</div>
                        <span>StoreHub Admin</span>
                    </div>
                    
                    <div className="nav-actions">
                        <button className="nav-btn" onClick={() => onNavigate('customer')}>
                            Customer View
                        </button>
                    </div>
                </div>
            </nav>

            <div className="admin-content">
                <div className="container">
                    {/* Header */}
                    <div className="admin-header">
                        <div>
                            <h1>Dashboard</h1>
                            <p>Manage your store operations and inventory</p>
                        </div>
                        <button 
                            className="btn-primary"
                            onClick={() => setShowAddProduct(true)}
                        >
                            <Plus size={20} />
                            Add Product
                        </button>
                    </div>

                    {/* Stats Grid */}
                    <div className="stats-grid">
                        <div className="stat-card primary">
                            <div className="stat-icon">
                                <Package size={24} />
                            </div>
                            <div className="stat-content">
                                <h3>Total Products</h3>
                                <p className="stat-number">{stats.totalProducts}</p>
                                <span className="stat-change">+12% from last month</span>
                            </div>
                        </div>

                        <div className="stat-card success">
                            <div className="stat-icon">
                                <ShoppingCart size={24} />
                            </div>
                            <div className="stat-content">
                                <h3>Total Orders</h3>
                                <p className="stat-number">{stats.totalOrders}</p>
                                <span className="stat-change">+8% from last month</span>
                            </div>
                        </div>

                        <div className="stat-card warning">
                            <div className="stat-icon">
                                <TrendingUp size={24} />
                            </div>
                            <div className="stat-content">
                                <h3>Low Stock Items</h3>
                                <p className="stat-number">{stats.lowStock}</p>
                                <span className="stat-change">Needs attention</span>
                            </div>
                        </div>

                        <div className="stat-card info">
                            <div className="stat-icon">
                                <Users size={24} />
                            </div>
                            <div className="stat-content">
                                <h3>Inventory Value</h3>
                                <p className="stat-number">₹{stats.totalValue.toLocaleString()}</p>
                                <span className="stat-change">Total stock value</span>
                            </div>
                        </div>
                    </div>

                    {/* Products Section */}
                    <div className="products-section">
                        <div className="section-header">
                            <h2>Product Management</h2>
                            <div className="section-controls">
                                <div className="search-box">
                                    <Search size={16} />
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="category-filter"
                                >
                                    {categories.map(category => (
                                        <option key={category} value={category}>
                                            {category === 'all' ? 'All Categories' : category}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {loading ? (
                            <div className="loading-state">
                                <div className="spinner"></div>
                                <p>Loading products...</p>
                            </div>
                        ) : (
                            <div className="products-table-container">
                                <table className="products-table">
                                    <thead>
                                        <tr>
                                            <th>Product</th>
                                            <th>Category</th>
                                            <th>Price</th>
                                            <th>Stock</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredProducts.map(product => (
                                            <tr key={product._id}>
                                                <td>
                                                    <div className="product-cell">
                                                        <img 
                                                            src={`https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&fit=crop&sig=${product._id}`}
                                                            alt={product.name}
                                                            className="product-thumbnail"
                                                        />
                                                        <div>
                                                            <h4>{product.name}</h4>
                                                            <p>{product.description?.substring(0, 50)}...</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="category-badge">
                                                        {product.category || 'Uncategorized'}
                                                    </span>
                                                </td>
                                                <td className="price-cell">₹{product.price}</td>
                                                <td>
                                                    <span className={`stock-badge ${
                                                        product.stock_quantity === 0 ? 'out-of-stock' :
                                                        product.stock_quantity < 10 ? 'low-stock' : 'in-stock'
                                                    }`}>
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
                                                        <button className="action-btn view" title="View">
                                                            <Eye size={16} />
                                                        </button>
                                                        <button className="action-btn edit" title="Edit">
                                                            <Edit size={16} />
                                                        </button>
                                                        <button className="action-btn delete" title="Delete">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                
                                {filteredProducts.length === 0 && (
                                    <div className="empty-state">
                                        <Package size={48} />
                                        <h3>No products found</h3>
                                        <p>Try adjusting your search or add some products</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Add Product Modal */}
            {showAddProduct && (
                <div className="modal-overlay">
                    <div className="modal add-product-modal">
                        <div className="modal-header">
                            <h2>Add New Product</h2>
                            <button 
                                className="close-btn"
                                onClick={() => setShowAddProduct(false)}
                            >
                                <X size={20} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleAddProduct} className="product-form">
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Product Name</label>
                                    <input
                                        type="text"
                                        value={newProduct.name}
                                        onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                                        placeholder="Enter product name"
                                        required
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label>Category</label>
                                    <input
                                        type="text"
                                        value={newProduct.category}
                                        onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                                        placeholder="Enter category"
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label>Price (₹)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={newProduct.price}
                                        onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                                        placeholder="0.00"
                                        required
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label>Stock Quantity</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={newProduct.stock_quantity}
                                        onChange={(e) => setNewProduct({...newProduct, stock_quantity: e.target.value})}
                                        placeholder="0"
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    value={newProduct.description}
                                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                                    placeholder="Enter product description"
                                    rows="3"
                                />
                            </div>
                            
                            <div className="form-group checkbox-group">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={newProduct.is_available}
                                        onChange={(e) => setNewProduct({...newProduct, is_available: e.target.checked})}
                                    />
                                    <span className="checkmark"></span>
                                    Available for Sale
                                </label>
                            </div>
                            
                            <div className="form-actions">
                                <button 
                                    type="button" 
                                    className="btn-secondary"
                                    onClick={() => setShowAddProduct(false)}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary">
                                    <Plus size={16} />
                                    Add Product
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}