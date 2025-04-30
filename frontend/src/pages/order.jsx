import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const backendURL = process.env.REACT_APP_BACKEND_URL;

const initialStocks = [
  { symbol: 'RELIANCE', name: 'Reliance Industries Limited' },
  { symbol: 'TCS', name: 'Tata Consultancy Services' },
  { symbol: 'INFY', name: 'Infosys Ltd' },
  { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd' },
  { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd' },
  { symbol: 'SBIN', name: 'State Bank of India' },
];

function Order() {
  const [security, setSecurity] = useState('');
  const [shares, setShares] = useState('');
  const [stockPrices, setStockPrices] = useState({});
  const [estimatedCost, setEstimatedCost] = useState(0);
  const [selectedPrice, setSelectedPrice] = useState(0);
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
      const response = await fetch(`${backendURL}/placeOrder`, {
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

  const fetchStockPrice = async (symbol) => {
    try {
      const response = await fetch(`https://stock.indianapi.in/stock?name=${symbol}`, {
        headers: {
          'X-Api-Key': process.env.REACT_APP_STOCK_API_KEY
        }
      }

      );
      console.log("req made")
      const data = await response.json();
      const price = data.currentPrice?.NSE || data.currentPrice?.BSE || 'N/A';

      setStockPrices((prev) => ({ ...prev, [symbol]: price }));
    } catch (err) {
      console.error(`Error fetching price for ${symbol}:`, err);
    }
  };

  const selectStock = async (symbol) => {
    await fetchStockPrice(symbol); // Refresh price when selecting
    const stockPrice = stockPrices[symbol] || 0;
    setSecurity(symbol);
    setSelectedPrice(stockPrice);
    setShares('1');
    setEstimatedCost(stockPrice);
  };


  useEffect(() => {
    initialStocks.forEach((stock) => fetchStockPrice(stock.symbol));
  }, []);

  // const estimatedCost = shares ? (Number(shares) * 100).toFixed(2) : '0.00';

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4">
      {/* Order Form */}
      <div className="max-w-md bg-white p-8 rounded-lg shadow-md w-full">
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
              onChange={(e) => {
                const qty = e.target.value;
                setShares(qty);
                setEstimatedCost((qty && selectedPrice) ? (qty * selectedPrice).toFixed(2) : 0);
              }}
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

      {/* Stock Index Sidebar */}
      <div className="w-full lg:w-1/2 bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Stock Index</h3>
        <ul className="space-y-4">
          {initialStocks.map((stock) => (
            <li
              key={stock.symbol}
              className="flex justify-between items-center border-b pb-2 hover:bg-gray-50 p-2 rounded"
            >
              <div>
                <div className="font-bold">{stock.symbol}</div>
                <div className="text-sm text-gray-600">{stock.name}</div>
                <div className="text-black mt-1">
                  Price: ₹{stockPrices[stock.symbol] !== undefined ? stockPrices[stock.symbol] : '---'}
                </div>
              </div>
              <button
                onClick={() => selectStock(stock.symbol)}
                className="ml-4 text-sm px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              >
                BUY
              </button>
            </li>
          ))}

        </ul>
      </div>
    </div>
  );
}

export default Order;
