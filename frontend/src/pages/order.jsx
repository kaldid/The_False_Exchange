import React, { useState } from 'react';

function Order() {
  const [symbol, setSymbol] = useState('');
  const [shares, setShares] = useState('');
  const [orderType, setOrderType] = useState('buy');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Order placed: ${orderType} ${shares} shares of ${symbol}`);
    // Reset form
    setSymbol('');
    setShares('');
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Place Order</h2>

      <div className="mb-6 flex rounded-md overflow-hidden border border-gray-300">
        <button
          type="button"
          className={`flex-1 py-2 text-center ${orderType === 'buy' ? 'bg-green-500 text-white' : 'bg-gray-100'}`}
          onClick={() => setOrderType('buy')}
        >
          Buy
        </button>
        <button
          type="button"
          className={`flex-1 py-2 text-center ${orderType === 'sell' ? 'bg-red-500 text-white' : 'bg-gray-100'}`}
          onClick={() => setOrderType('sell')}
        >
          Sell
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="symbol">Stock Symbol</label>
          <input
            id="symbol"
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
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
            <span className="font-bold">${shares ? (Number(shares) * 100).toFixed(2) : '0.00'}</span>
          </div>
        </div>
        
        <button
          type="submit"
          className={`w-full py-2 px-4 rounded-md text-white ₹{
            orderType === 'buy' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
          }`}
        >
          {orderType === 'buy' ? 'Buy' : 'Sell'} {shares || ''} {symbol || 'Shares'}
        </button>
      </form>
    </div>
  );
}

export default Order;
