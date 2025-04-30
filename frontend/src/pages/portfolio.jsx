import React, { useState, useEffect } from 'react';

const backendURL = process.env.REACT_APP_BACKEND_URL

function Portfolio({ navigateTo }) {
    const [holdings, setHoldings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchPortfolio = async () => {
            try {
                const response = await fetch(`${backendURL}/getportfolio`, {
                    credentials: "include", // Send cookies for authentication
                });
                // console.log(response);
                if (!response.ok) throw new Error("Failed to fetch portfolio");
                const data = await response.json();
                setHoldings(data.portfolio.holdings);

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchPortfolio();
    }, []);

    // Calculate total value using averagePrice from backend
    const totalValue = holdings.reduce(
        (sum, holding) => sum + (holding.quantity * holding.averagePrice),
        0
    );

    if (loading) return <div>Loading...</div>;
    // if (error) return <div className="text-red-500">{error}</div>;
    // if (error) return <div className="text-red-500">{error}</div>;
    if (holdings.length === 0) {
        return (
            <div className="max-w-4xl mx-auto text-center mt-10">
                <h2 className="text-xl font-semibold">Your portfolio is empty.</h2>
                <p className="text-gray-600 mt-2">You haven't added any stocks yet.</p>
                <button
                    onClick={() => navigateTo('order')}
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                >
                    Place Your First Order
                </button>
            </div>
        );
    }
    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Your Portfolio</h2>
                <div className="text-right">
                    <div className="text-sm text-gray-500">Total Value</div>
                    <div className="text-2xl font-bold">
                        ₹{totalValue.toFixed(2)}
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Company
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Shares
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Price
                            </th>
                            {/* 
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Change
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Value
                            </th>
                            */}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {holdings.map((holding, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {holding.security}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    {holding.quantity}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    ₹{holding.averagePrice.toFixed(2)}
                                </td>
                                {/* 
                                <td className={`px-6 py-4 whitespace-nowrap text-right ${holding.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {holding.change > 0 ? '+' : ''}{holding.change}%
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                                    ₹{(holding.shares * holding.price).toFixed(2)}
                                </td>
                                */}
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

