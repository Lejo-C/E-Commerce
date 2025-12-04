import { useState, useEffect } from "react";
import axios from "axios";
import MerchentNav from "./MerchentNav";
const API_URL = import.meta.env.VITE_API_URL;
const MerchantOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/products/merchantOrders`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        });
        setOrders(res.data);
      } catch (err) {
        console.error("❌ Error fetching orders:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(
        `${API_URL}/api/buyProduct/updateOrderStatus/${orderId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      console.error("❌ Error updating status:", err.response?.data || err.message);
      alert("Failed to update status");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Confirmed": return "bg-blue-100 text-blue-700 border-blue-200";
      case "Shipped": return "bg-amber-100 text-amber-700 border-amber-200";
      case "Delivered": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "Canceled": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <MerchentNav />

      <div className="container-custom mx-auto max-w-7xl px-4">
        <div className="mb-8 fade-in-scale">
          <h1 className="text-3xl font-extrabold text-slate-900">Order Management</h1>
          <p className="text-slate-500">Track and update customer orders</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-soft">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-bold text-slate-800">No Orders Yet</h2>
            <p className="text-slate-500">Orders will appear here once customers make a purchase.</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-soft border border-slate-100 overflow-hidden fade-in-scale">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-bold">
                    <th className="p-6">Product</th>
                    <th className="p-6">Customer</th>
                    <th className="p-6">Details</th>
                    <th className="p-6">Total</th>
                    <th className="p-6">Status</th>
                    <th className="p-6">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <img
                            src={order.productId?.image}
                            alt={order.productId?.name}
                            className="w-12 h-12 rounded-xl object-cover bg-slate-100"
                          />
                          <div>
                            <p className="font-bold text-slate-900">{order.productId?.name}</p>
                            <p className="text-xs text-slate-500">ID: {order._id.slice(-6)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <p className="font-semibold text-slate-800">{order.buyerName}</p>
                        <p className="text-sm text-slate-500">{order.buyerEmail}</p>
                      </td>
                      <td className="p-6">
                        <p className="text-sm font-medium text-slate-700">Qty: {order.quantity}</p>
                        <p className="text-xs text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </td>
                      <td className="p-6">
                        <p className="font-bold text-emerald-600">${order.totalPrice}</p>
                      </td>
                      <td className="p-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                          {order.status || "Confirmed"}
                        </span>
                      </td>
                      <td className="p-6">
                        <select
                          value={order.status || "Confirmed"}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 cursor-pointer hover:border-emerald-500 transition-colors"
                          disabled={order.status === "Canceled"}
                        >
                          <option value="Confirmed">Confirmed</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Canceled" disabled>Canceled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MerchantOrders;
