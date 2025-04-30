import React, { useEffect, useState } from 'react';

export default function PendingOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [editData, setEditData] = useState({ quantity: '', price: '' });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('http://localhost:8000/getorders', {
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      } else {
        alert(data.message || 'Failed to fetch orders');
      }
    } catch (err) {
      alert('Error fetching orders: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAmend = async (orderId) => {
    try {
      const res = await fetch('http://localhost:8000/amendOrder', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          newQuantity: Number(editData.quantity),
          newPrice: Number(editData.price),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        fetchOrders();
        setEditingOrderId(null);
      } else {
        alert(data.message || 'Amend failed');
      }
    } catch (error) {
      alert('Error amending order: ' + error.message);
    }
  };

  const handleCancel = async (orderId,executedQuantity,security,price,orderType,quantity) => {
    try {
      const res = await fetch('http://localhost:8000/cancelOrder', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId,executedQuantity,security,price,orderType,quantity}),
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        fetchOrders();
      } else {
        alert(data.message || 'Cancel failed');
      }
    } catch (error) {
      alert('Error cancelling order: ' + error.message);
    }
  };

  if (loading) return <p className="text-center p-4">Loading orders...</p>;

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Pending Orders</h2>
      {orders.length === 0 ? (
        <p className="text-center text-gray-600">No pending or partially executed orders.</p>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li key={order._id} className="border p-4 rounded-md shadow-sm">
              <p><strong>Stock:</strong> {order.security}</p>
              <p><strong>Status:</strong> {order.status}</p>
              <p><strong>Quantity:</strong> {order.quantity}</p>
              <p><strong>Executed:</strong> {order.executedQuantity}</p>
              <p><strong>Price:</strong> ₹{order.price}</p>

              {order.status === 'PARTIALLY_EXECUTED' && editingOrderId !== order._id && (
                <div className="mt-4 flex gap-3">
                  <button
                    className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                    onClick={() => {
                      setEditingOrderId(order._id);
                      setEditData({
                        quantity: order.quantity,
                        price: order.price,
                      });
                    }}
                  >
                    Amend
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                    onClick={() => handleCancel(order._id,order.executedQuantity,order.security,order.price,order.orderType,order.quantity)}
                  >
                    Cancel
                  </button>
                </div>
              )}

              {editingOrderId === order._id && (
                <div className="mt-4 space-y-2">
                  <input
                    type="number"
                    value={editData.quantity}
                    onChange={(e) => setEditData({ ...editData, quantity: e.target.value })}
                    className="border px-2 py-1 rounded w-full"
                    placeholder="New Quantity"
                    min={order.executedQuantity}
                  />
                  <input
                    type="number"
                    value={editData.price}
                    onChange={(e) => setEditData({ ...editData, price: e.target.value })}
                    className="border px-2 py-1 rounded w-full"
                    placeholder="New Price"
                  />
                  <div className="flex gap-2">
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      onClick={() => handleAmend(order._id)}
                    >
                      Submit
                    </button>
                    <button
                      className="bg-gray-300 text-black px-3 py-1 rounded hover:bg-gray-400"
                      onClick={() => setEditingOrderId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
