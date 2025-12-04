import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;
const OrderDetails = () => {
  const { productId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product;
  const cartItems = location.state?.cartItems;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculateTotal = () => {
    if (cartItems) {
      return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
    }
    return product ? product.price : 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (cartItems) {
        const res = await axios.post(
          `${API_URL}/api/buyProduct/buyAll`,
          {
            items: cartItems.map((item) => ({
              productId: typeof item.productId === 'object' ? item.productId._id : item.productId,
              quantity: item.quantity,
            })),
            buyerName: formData.name,
            buyerEmail: formData.email,
            buyerPhone: formData.phone,
            buyerAddress: formData.address,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            withCredentials: true,
          }
        );

        await axios.delete(
          `${API_URL}/api/cart/clearCart`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            withCredentials: true,
          }
        );

        alert(`Order placed successfully! ${res.data.count} items ordered.`);
        navigate("/home");
      } else {
        await axios.post(
          `${API_URL}/api/buyProduct/buyProduct`,
          {
            productId,
            quantity: 1,
            buyerName: formData.name,
            buyerEmail: formData.email,
            buyerPhone: formData.phone,
            buyerAddress: formData.address,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            withCredentials: true,
          }
        );
        alert("Order placed successfully!");
        navigate("/");
      }
    } catch (err) {
      console.error("❌ Error placing order:", err);
      alert("Failed to place order. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="container-custom mx-auto max-w-5xl">
        <div className="text-center mb-12 fade-in-scale">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Secure Checkout</h1>
          <p className="text-slate-500">Complete your purchase safely and securely</p>
        </div>

        <div className="grid md:grid-cols-12 gap-8">
          {/* Order Summary */}
          <div className="md:col-span-5 order-2 md:order-1">
            <div className="bg-white rounded-3xl p-8 shadow-soft border border-slate-100 sticky top-24">
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <span>🛒</span> Order Summary
              </h2>

              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                {cartItems ? (
                  cartItems.map((item) => (
                    <div key={item._id} className="flex gap-4 items-center p-3 rounded-xl hover:bg-slate-50 transition-colors">
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg bg-slate-200" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-800 text-sm truncate">{item.name}</h3>
                        <p className="text-slate-500 text-xs">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-bold text-indigo-600">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))
                ) : product ? (
                  <div className="flex gap-4 items-center p-3 rounded-xl bg-slate-50">
                    <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-lg bg-slate-200" />
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-800">{product.name}</h3>
                      <p className="text-slate-500 text-sm">Qty: 1</p>
                    </div>
                    <p className="font-bold text-indigo-600">${product.price}</p>
                  </div>
                ) : (
                  <p className="text-slate-500 text-center py-4">No items found.</p>
                )}
              </div>

              <div className="border-t border-slate-100 pt-6 space-y-3">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>${calculateTotal()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span className="text-teal-600 font-bold">FREE</span>
                </div>
                <div className="h-px bg-slate-100 my-2"></div>
                <div className="flex justify-between text-2xl font-bold text-slate-900">
                  <span>Total</span>
                  <span>${calculateTotal()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Form */}
          <div className="md:col-span-7 order-1 md:order-2">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <h2 className="text-2xl font-bold text-slate-900 mb-8">Shipping Details</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-5 py-3 bg-slate-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-0 transition-all font-medium outline-none"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-5 py-3 bg-slate-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-0 transition-all font-medium outline-none"
                      placeholder="+1 (555) 000-0000"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-5 py-3 bg-slate-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-0 transition-all font-medium outline-none"
                    placeholder="john@example.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Shipping Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-5 py-3 bg-slate-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-0 transition-all font-medium outline-none h-32 resize-none"
                    placeholder="123 Main St, City, Country"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl btn-gradient font-bold text-lg shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transform hover:-translate-y-1 transition-all duration-300 mt-4"
                >
                  Confirm Order & Pay
                </button>

                <div className="flex items-center justify-center gap-4 pt-4 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                  {/* Placeholder for payment icons */}
                  <div className="h-8 w-12 bg-slate-200 rounded"></div>
                  <div className="h-8 w-12 bg-slate-200 rounded"></div>
                  <div className="h-8 w-12 bg-slate-200 rounded"></div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
