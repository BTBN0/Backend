import { useEffect, useState } from 'react';
import { getUserOrders, processPayment } from '../services/api';

function parseJwt(token) {
  try { return JSON.parse(atob(token.split('.')[1])); } catch { return null; }
}

function formatDate(str) {
  return new Date(str).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');
  const token = localStorage.getItem('token');
  const userId = parseJwt(token)?.userId;

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const fetchOrders = async () => {
    if (!userId) return;
    try {
      const { data } = await getUserOrders(userId);
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, [userId]);

  const handlePay = async (order) => {
    try {
      await processPayment({ orderId: order.id, userId: order.userId, amount: order.total });
      showToast('Payment successful');
      fetchOrders();
    } catch (err) {
      showToast(err.response?.data?.error || 'Payment failed');
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>My Orders</h2>
        <p>{orders.length} order{orders.length !== 1 ? 's' : ''} in your history</p>
      </div>

      {loading ? (
        <div className="loading"><div className="spinner" />Loading</div>
      ) : orders.length === 0 ? (
        <div className="empty-orders">
          <h3>No orders yet</h3>
          <p>Your purchases will appear here</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order.id} className="order-card">
              <div>
                <div className="order-num">Order #{order.id}</div>
                <div className="order-meta">
                  {order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''} · {formatDate(order.createdAt)}
                </div>
              </div>
              <span className={`order-status status-${order.status}`}>{order.status}</span>
              <div className="order-total">${Number(order.total).toFixed(2)}</div>
              {order.status === 'PENDING' ? (
                <button className="btn-pay" onClick={() => handlePay(order)}>Pay Now</button>
              ) : (
                <div style={{ width: 90 }} />
              )}
            </div>
          ))}
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
