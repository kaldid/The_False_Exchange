import React, { useState } from 'react';
import { jwtDecode } from 'jwt-decode'

function Order() {
  const [security, setSecurity] = useState('');
  const [shares, setShares] = useState('');
  // Initialize with BUY and keep it that way
  const [orderType, setOrderType] = useState('BUY');
  
  const handleSubmit = async (e) => {
    console.log("Submitted")
    e.preventDefault();
    
    // Always use BUY for orderType regardless of state
    const orderData = {
        security,
        quantity: Number(shares),
        price: 1000,
        orderType: "BUY",  // Hardcoded to always be "BUY"
    };
    console.log(orderData)
    
    try {
        console.log("Sending order:", JSON.stringify(orderData));
        const response = await fetch('http://localhost:8000/placeOrder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(orderData)
        });
        const data = await response.json();
        if (!response.ok) {
            alert(data.message || 'Order failed');
            return;
        }
        alert('Order placed successfully!');
        // Reset form
        setSecurity('');
        setShares('');
    } catch (error) {
        alert('Error placing order: ' + error.message);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Place Order</h2>
      <div className="mb-6 flex rounded-md overflow-hidden border border-gray-300">
        <button
          type="button"
          className="flex-1 py-2 text-center bg-green-500 text-white"
          // No need to change orderType as we only support BUY
        >
          Buy
        </button>
        <button
          type="button"
          className="flex-1 py-2 text-center bg-gray-100 cursor-not-allowed opacity-50"
          // Disabled for now
          disabled
        >
          Sell (Coming Soon)
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="security">Stock Name</label>
          <input
            id="security"
            type="text"
            value={security}
            onChange={(e) => setSecurity(e.target.value.toUpperCase())}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="e.g. AAPL"
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 mb-2" htmlFor="shares">Number of Shares</label>
          <input
            id="shares"
            type="number"
            value={shares}
            onChange={(e) => setShares(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="e.g. 10"
            min="1"
            required
          />
        </div>
        <div className="mb-6 p-4 bg-gray-50 rounded-md">
          <div className="flex justify-between">
            <span>Estimated Cost:</span>
            <span className="font-bold">₹{shares ? (Number(shares) * 100).toFixed(2) : '0.00'}</span>
          </div>
        </div>
        
        <button
          type="submit"
          className="w-full py-2 px-4 rounded-md text-white bg-green-500 hover:bg-green-600"
        >
          BUY {shares || ''} {security || 'Shares'}  {/* Hardcoded to BUY */}
        </button>
      </form>
    </div>
  );
}
export default Order;
