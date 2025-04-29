import React, { useEffect, useState } from 'react';

function PendingOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await fetch('http://localhost:8000/getorders', {
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      } else {
        alert(data.message || 'Failed to fetch orders');
      }
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Pending Orders</h2>

      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-600">No pending or partially executed orders.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {orders.map((order) => (
            <li key={order._id} className="py-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{order.security}</p>
                  <p className="text-sm text-gray-500">
                    Qty: {order.quantity} | Executed: {order.executedQuantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm">Price: ₹{order.price}</p>
                  <p className={`text-xs font-medium ${order.status === 'PARTIALLY_EXECUTED' ? 'text-yellow-600' : 'text-blue-600'}`}>
                    {order.status}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PendingOrders;
