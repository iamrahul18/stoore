import React, { useState } from 'react';
import { Plus, Package, DollarSign, Hash, ToggleLeft, ToggleRight } from 'lucide-react';

export function AddProductForm({ onSubmit }) {
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        stock_quantity: "",
        is_available: true
    });
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        setMessage("Adding product...");
        setMessageType("loading");
        
        try {
            await onSubmit({
                name: formData.name,
                price: Number(formData.price),
                stock_quantity: Number(formData.stock_quantity),
                is_available: Boolean(formData.is_available)
            });
            
            setMessage("Product added successfully!");
            setMessageType("success");
            
            // Reset form
            setFormData({
                name: "",
                price: "",
                stock_quantity: "",
                is_available: true
            });
            
            // Clear message after 3 seconds
            setTimeout(() => {
                setMessage('');
                setMessageType('');
            }, 3000);
        } catch (err) {
            setMessage('Error adding product. Please try again.');
            setMessageType("error");
        }
    }

    return (
        <div className="form-container">
            <h2>
                <Plus size={24} />
                Add New Product
            </h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>
                        <Package size={16} style={{ marginRight: '4px' }} />
                        Product Name:
                    </label>
                    <input 
                        className="form-input"
                        placeholder="Enter product name" 
                        value={formData.name} 
                        onChange={e => setFormData({...formData, name: e.target.value})} 
                        required 
                    />
                </div>
                
                <div className="form-group">
                    <label>
                        <DollarSign size={16} style={{ marginRight: '4px' }} />
                        Price (₹):
                    </label>
                    <input 
                        className="form-input"
                        placeholder="Enter price" 
                        type="number" 
                        step="0.01"
                        min="0"
                        value={formData.price} 
                        onChange={e => setFormData({...formData, price: e.target.value})} 
                        required 
                    />
                </div>
                
                <div className="form-group">
                    <label>
                        <Hash size={16} style={{ marginRight: '4px' }} />
                        Stock Quantity:
                    </label>
                    <input 
                        className="form-input"
                        placeholder="Enter stock quantity" 
                        type="number" 
                        min="0"
                        value={formData.stock_quantity} 
                        onChange={e => setFormData({...formData, stock_quantity: e.target.value})} 
                        required 
                    />
                </div>
                
                <div className="form-group">
                    <div className="checkbox-group">
                        {formData.is_available ? (
                            <ToggleRight 
                                size={20} 
                                color="#28a745" 
                                style={{ cursor: 'pointer' }}
                                onClick={() => setFormData({...formData, is_available: !formData.is_available})}
                            />
                        ) : (
                            <ToggleLeft 
                                size={20} 
                                color="#6c757d" 
                                style={{ cursor: 'pointer' }}
                                onClick={() => setFormData({...formData, is_available: !formData.is_available})}
                            />
                        )}
                        <label style={{ cursor: 'pointer' }} onClick={() => setFormData({...formData, is_available: !formData.is_available})}>
                            Available for Sale
                        </label>
                    </div>
                </div>
                
                <button type="submit" className="btn btn-primary">
                    <Plus size={16} />
                    Add Product
                </button>
                
                {message && (
                    <div className={`message ${messageType}`}>
                        {message}
                    </div>
                )}
            </form>
        </div>
    );
}