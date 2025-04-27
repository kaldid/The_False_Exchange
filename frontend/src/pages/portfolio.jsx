import React from 'react';

function Portfolio({ navigateTo }) {
  // Sample data
  const stocks = [
    { symbol: "AAPL", name: "Apple Inc.", shares: 10, price: 170.50, change: 1.5 },
    { symbol: "GOOGL", name: "Alphabet Inc.", shares: 5, price: 163.74, change: -0.8 },
    { symbol: "MSFT", name: "Microsoft Corp.", shares: 15, price: 417.15, change: 2.3 },
    { symbol: "AMZN", name: "Amazon.com Inc.", shares: 8, price: 182.41, change: 0.4 }
  ];

  const totalValue = stocks.reduce((sum, stock) => sum + (stock.shares * stock.price), 0);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Your Portfolio</h2>
        <div className="text-right">
          <div className="text-sm text-gray-500">Total Value</div>
          <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Shares</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {stocks.map((stock, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap font-medium text-green-600">{stock.symbol}</td>
                <td className="px-6 py-4 whitespace-nowrap">{stock.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right">{stock.shares}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right">₹{stock.price.toFixed(2)}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-right ₹{stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stock.change > 0 ? '+' : ''}{stock.change}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                  ₹{(stock.shares * stock.price).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => navigateTo('order')}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
        >
          Place New Order
        </button>
      </div>
    </div>
  );
}

export default Portfolio;
