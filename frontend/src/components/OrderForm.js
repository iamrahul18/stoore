import React, { useState } from 'react';
import { ShoppingCart, User, MapPin, Hash } from 'lucide-react';

export function OrderForm({ productId, onComplete }) {
    const [customer_name, setCustomerName] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [address, setAddress] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        setMessage("Processing your order...");
        setMessageType("loading");
        
        const orderData = {
            product_id: productId,
            quantity: Number(quantity),
            customer_name,
            address
        };
        
        try {
            const resp = await onComplete(orderData);
            setMessage(resp.message || 'Order placed successfully!');
            setMessageType("success");
            
            // Reset form
            setCustomerName('');
            setQuantity(1);
            setAddress('');
            
            // Clear message after 3 seconds
            setTimeout(() => {
                setMessage('');
                setMessageType('');
            }, 3000);
        } catch (err) {
            setMessage('Error placing order. Please try again.');
            setMessageType("error");
        }
    }

    if (!productId) return null;

    return (
        <div className="order-form">
            <h4>
                <ShoppingCart size={20} />
                Place Order
            </h4>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>
                        <User size={16} style={{ marginRight: '4px' }} />
                        Customer Name:
                    </label>
                    <input 
                        className="form-input"
                        value={customer_name} 
                        onChange={e => setCustomerName(e.target.value)} 
                        placeholder="Enter customer name"
                        required 
                    />
                </div>
                
                <div className="form-group">
                    <label>
                        <Hash size={16} style={{ marginRight: '4px' }} />
                        Quantity:
                    </label>
                    <input 
                        className="form-input"
                        type="number" 
                        min="1" 
                        value={quantity} 
                        onChange={e => setQuantity(e.target.value)} 
                        placeholder="Enter quantity"
                        required 
                    />
                </div>
                
                <div className="form-group">
                    <label>
                        <MapPin size={16} style={{ marginRight: '4px' }} />
                        Delivery Address:
                    </label>
                    <input 
                        className="form-input"
                        value={address} 
                        onChange={e => setAddress(e.target.value)} 
                        placeholder="Enter delivery address"
                        required 
                    />
                </div>
                
                <button type="submit" className="btn btn-success">
                    <ShoppingCart size={16} />
                    Place Order
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