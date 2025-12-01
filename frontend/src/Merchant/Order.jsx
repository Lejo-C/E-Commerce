import { useState, useEffect } from "react";
import axios from "axios";
import MerchentNav from "./MerchentNav";

const MerchantOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products/merchantOrders", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // merchant JWT
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

  return (
    <div className="min-h-screen bg-gray-100 p-8">
        <nav>
            <MerchentNav />
        </nav>
      <h1 className="text-3xl font-bold mb-6">📦 Orders</h1>

      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-600">No orders yet.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="px-4 py-2 border">Product</th>
                <th className="px-4 py-2 border">Buyer</th>
                <th className="px-4 py-2 border">Quantity</th>
                <th className="px-4 py-2 border">Total Price</th>
                <th className="px-4 py-2 border">Address</th>
                <th className="px-4 py-2 border">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">
                    <div>
                      <p className="font-semibold">{order.productId?.name}</p>
                      <p className="text-sm text-gray-500">${order.productId?.price}</p>
                    </div>
                  </td>
                  <td className="px-4 py-2 border">
                    <div>
                      <p className="font-semibold">{order.userId?.name}</p>
                      <p className="text-sm text-gray-500">{order.userId?.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-2 border">{order.quantity}</td>
                  <td className="px-4 py-2 border text-green-600 font-bold">
                    ${order.totalPrice}
                  </td>
                  <td className="px-4 py-2 border">{order.buyerAddress}</td>
                  <td className="px-4 py-2 border">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MerchantOrders;
