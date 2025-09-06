import React, { useState } from 'react';

export function OrderForm({ productId, onComplete }) {
    const [customer_name, setCustomerName] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [address, setAddress] = useState('');
    const [message, setMessage] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        setMessage("Sending...");
        const orderData = {
            product_id: productId,
            quantity: Number(quantity),
            customer_name,
            address
        };
        try {
            const resp = await onComplete(orderData);
            setMessage(resp.message ? resp.message : 'Order placed!');
        } catch (err) {
            setMessage('Error placing order.');
        }
    }

    if (!productId) return null;

    return (
        <form onSubmit={handleSubmit} style={{margin: "1rem 0"}}>
            <h4>Place Order for this Product</h4>
            <div>
                <label>Customer Name:
                    <input value={customer_name} onChange={e => setCustomerName(e.target.value)} required />
                </label>
            </div>
            <div>
                <label>Quantity:
                    <input type="number" min="1" value={quantity} onChange={e => setQuantity(e.target.value)} required />
                </label>
            </div>
            <div>
                <label>Address:
                    <input value={address} onChange={e => setAddress(e.target.value)} required />
                </label>
            </div>
            <button type="submit">Place Order</button>
            <div>{message}</div>
        </form>
    );
}
