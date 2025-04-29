import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

function AmendCancelOrder({ navigateTo }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [amendData, setAmendData] = useState({}); // { orderId: { shares, price } }

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('token');
                const decoded = jwtDecode(token);
                const userId = decoded.userId || decoded.id;
                const response = await fetch(`http://localhost:8000/getOrders?userId=${userId}`, {
                    credentials: 'include',
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.message || 'Failed to fetch orders');
                setOrders(data.orders || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const handleAmendChange = (orderId, field, value) => {
        setAmendData(prev => ({
            ...prev,
            [orderId]: {
                ...prev[orderId],
                [field]: value,
            }
        }));
    };

    const handleAmend = async (order) => {
        const { shares, price } = amendData[order._id] || {};
        if (!shares || !price) {
            alert('Please enter new shares and price.');
            return;
        }
        try {
            const response = await fetch('http://localhost:8000/amendOrder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    orderId: order._id,
                    newQuantity: Number(shares),
                    newPrice: Number(price)
                })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to amend order');
            alert('Order amended successfully!');
            window.location.reload(); // or refetch orders
        } catch (err) {
            alert('Error amending order: ' + err.message);
        }
    };

    const handleCancel = async (orderId) => {
        try {
            const response = await fetch('http://localhost:8000/cancelOrder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ orderId })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to cancel order');
            alert('Order cancelled successfully!');
            window.location.reload(); // or refetch orders
        } catch (err) {
            alert('Error cancelling order: ' + err.message);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    // Filter pending orders
    const pendingOrders = orders.filter(order => order.status === 'PENDING' || order.status === 'PARTIALLY_EXECUTED');

    if (orders.length === 0 || pendingOrders.length === 0) {
        return (
            <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md text-center">
                <h2 className="text-2xl font-bold mb-6">All Orders Executed</h2>
                <p className="mb-4">All your orders have been executed.</p>
                <button
                    onClick={() => navigateTo('portfolio')}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
                >
                    Go to Portfolio
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Pending Orders</h2>
            <table className="min-w-full divide-y divide-gray-200 mb-6">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Shares</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Price</th>
                        <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {pendingOrders.map(order => (
                        <tr key={order._id} className="hover:bg-gray-50">
                            <td className="px-4 py-2">{order.security}</td>
                            <td className="px-4 py-2 text-right">
                                <input
                                    type="number"
                                    min="1"
                                    value={amendData[order._id]?.shares || order.quantity}
                                    onChange={e => handleAmendChange(order._id, 'shares', e.target.value)}
                                    className="w-16 px-1 py-1 border border-gray-300 rounded"
                                />
                            </td>
                            <td className="px-4 py-2 text-right">
                                <input
                                    type="number"
                                    min="1"
                                    value={amendData[order._id]?.price || order.price}
                                    onChange={e => handleAmendChange(order._id, 'price', e.target.value)}
                                    className="w-20 px-1 py-1 border border-gray-300 rounded"
                                />
                            </td>
                            <td className="px-4 py-2 text-center space-x-2">
                                <button
                                    onClick={() => handleAmend(order)}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                                >
                                    Amend
                                </button>
                                <button
                                    onClick={() => handleCancel(order._id)}
                                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                                >
                                    Cancel
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="text-center">
                <button
                    onClick={() => navigateTo('portfolio')}
                    className="text-green-600 hover:underline font-medium"
                >
                    Check Portfolio for executed orders
                </button>
            </div>
        </div>
    );
}

export default AmendCancelOrder;

