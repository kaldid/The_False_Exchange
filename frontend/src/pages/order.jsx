import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Order() {
  const [security, setSecurity] = useState('');
  const [shares, setShares] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const orderData = {
      security: security.toUpperCase(),
      quantity: Number(shares),
      price: 100,
      orderType: 'BUY'
    };

    try {
      const response = await fetch(`${process.env.BACKEND_URL}/placeOrder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(orderData)
      });

      const data = await response.json();
      if (!response.ok) return alert(data.message || 'Order failed');

      alert('Order placed successfully!');
      setSecurity('');
      setShares('');
    } catch (error) {
      alert('Error placing order: ' + error.message);
    }
  };

  const estimatedCost = shares ? (Number(shares) * 100).toFixed(2) : '0.00';

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Place Order</h2>

      <div className="mb-6 flex rounded-md overflow-hidden border border-gray-300">
        <button className="flex-1 py-2 bg-green-500 text-white font-semibold">Buy</button>
        <button className="flex-1 py-2 bg-gray-200 text-gray-500 cursor-not-allowed" disabled>
          Sell
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="security" className="block text-gray-700 mb-2">Stock Symbol</label>
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
          <label htmlFor="shares" className="block text-gray-700 mb-2">Number of Shares</label>
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

        <div className="mb-6 p-4 bg-gray-100 rounded-md flex justify-between">
          <span>Estimated Cost:</span>
          <span className="font-bold text-black">₹{estimatedCost}</span>
        </div>

        <button
          type="submit"
          className="w-full py-2 mb-4 px-4 rounded-md text-white bg-green-500 hover:bg-green-600 font-semibold"
        >
          BUY {shares || ''} {security || 'Shares'}
        </button>
      </form>

      <button
        onClick={() => navigate('/pending-orders')}
        className="w-full py-2 px-4 rounded-md text-white bg-blue-500 hover:bg-blue-600 font-semibold"
      >
        View Pending Orders
      </button>
    </div>
  );
}

export default Order;
