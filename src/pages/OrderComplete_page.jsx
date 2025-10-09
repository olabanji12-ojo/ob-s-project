import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { db } from '../firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

const OrderComplete_page = () => {
  const query = useQuery();
  const orderId = query.get('oid');
  const reference = query.get('ref');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!orderId) return setLoading(false);
      try {
        const snap = await getDoc(doc(db, 'orders', orderId));
        if (snap.exists()) setOrder({ id: snap.id, ...snap.data() });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [orderId]);

  if (!orderId) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">No order ID provided</h1>
          <Link to="/products" className="text-[#F4C430]">Continue Shopping</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-serif font-bold mb-6">Order Status</h1>
        {loading ? (
          <p>Loading...</p>
        ) : order ? (
          <div className="bg-white p-6 rounded shadow">
            <p className="mb-2"><strong>Order ID:</strong> {order.id}</p>
            <p className="mb-2"><strong>Reference:</strong> {reference}</p>
            <p className="mb-2"><strong>Status:</strong> <span className="font-semibold">{order.status}</span></p>
            <p className="mb-4"><strong>Total:</strong> ₦{(order.amount / 100).toLocaleString()}</p>
            <h2 className="text-xl font-bold mb-2">Items</h2>
            <ul className="space-y-2">
              {order.items?.map((it, idx) => (
                <li key={idx} className="flex justify-between border-b pb-2">
                  <span>{it.name} x {it.quantity}</span>
                  <span>₦{(it.price * it.quantity).toLocaleString()}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex gap-4">
              <Link to="/products" className="text-[#F4C430]">Continue Shopping</Link>
              <Link to="/cart_page" className="text-gray-600">View Cart</Link>
            </div>
          </div>
        ) : (
          <p>Order not found. It may still be processing. Please refresh later.</p>
        )}
      </div>
    </section>
  );
};

export default OrderComplete_page;
