import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;
const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/cart/getCart`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          withCredentials: true,
        });
        setCartItems(res.data.products || []);
      } catch (err) {
        console.error("❌ Error fetching cart:", err);
      }
    };
    fetchCart();
  }, []);

  const updateQuantity = async (item, change) => {
    const newQuantity = item.quantity + change;
    if (newQuantity < 1) return;

    try {
      const productId = typeof item.productId === 'object' ? item.productId._id : item.productId;
      await axios.put(
        `${API_URL}/api/cart/updateCart/${productId}`,
        { quantity: newQuantity },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }, withCredentials: true }
      );
      setCartItems(prev => prev.map(p => {
        const pId = typeof p.productId === 'object' ? p.productId._id : p.productId;
        return pId === productId ? { ...p, quantity: newQuantity } : p;
      }));
    } catch (err) {
      console.error("❌ Error updating quantity:", err);
    }
  };

  const removeItem = async (item) => {
    try {
      const productId = typeof item.productId === 'object' ? item.productId._id : item.productId;
      await axios.delete(
        `${API_URL}/api/cart/removeCart/${productId}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }, withCredentials: true }
      );
      setCartItems(prev => prev.filter(p => {
        const pId = typeof p.productId === 'object' ? p.productId._id : p.productId;
        return pId !== productId;
      }));
    } catch (err) {
      console.error("❌ Error removing item:", err);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="container-custom mx-auto max-w-6xl">
        <div className="mb-10 fade-in-scale">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Shopping Cart</h1>
          <p className="text-slate-500 font-medium">
            You have <span className="text-indigo-600 font-bold">{cartItems.length} items</span> in your cart
          </p>
        </div>

        {cartItems.length > 0 ? (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-6">
              {cartItems.map((item, index) => (
                <div
                  key={item._id}
                  className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-6 items-center hover:shadow-md transition-shadow duration-300 fade-in-scale"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-32 h-32 object-cover rounded-2xl shadow-sm bg-slate-100"
                  />

                  <div className="flex-1 w-full text-center sm:text-left">
                    <h3 className="text-xl font-bold text-slate-800 mb-1">{item.name}</h3>
                    <p className="text-2xl font-bold text-indigo-600 mb-4">${item.price}</p>

                    <div className="flex items-center justify-center sm:justify-start gap-4">
                      <div className="flex items-center bg-slate-100 rounded-xl p-1">
                        <button
                          onClick={() => updateQuantity(item, -1)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-slate-600 shadow-sm hover:text-indigo-600 transition-colors"
                        >
                          -
                        </button>
                        <span className="w-10 text-center font-bold text-slate-700">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item, 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-slate-600 shadow-sm hover:text-indigo-600 transition-colors"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item)}
                        className="text-red-500 hover:bg-red-50 p-2 rounded-xl transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="text-right hidden sm:block">
                    <p className="text-sm text-slate-400 mb-1">Subtotal</p>
                    <p className="text-xl font-bold text-slate-800">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl p-8 shadow-soft sticky top-24 border border-slate-100">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Order Summary</h2>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-semibold">${calculateTotal()}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Shipping</span>
                    <span className="text-teal-500 font-bold">Free</span>
                  </div>
                  <div className="h-px bg-slate-100 my-4"></div>
                  <div className="flex justify-between text-2xl font-bold text-slate-900">
                    <span>Total</span>
                    <span>${calculateTotal()}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/order/all", { state: { cartItems } })}
                  className="w-full py-4 rounded-2xl btn-gradient font-bold text-lg shadow-lg hover:shadow-indigo-500/30 transform transition-all duration-300"
                >
                  Checkout Now
                </button>

                <div className="mt-6 flex items-center justify-center gap-2 text-slate-400 text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Secure Encrypted Checkout</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-3xl shadow-soft">
            <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
              🛒
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Your Cart is Empty</h2>
            <p className="text-slate-500 mb-8">Looks like you haven't added anything yet.</p>
            <button
              onClick={() => navigate('/home')}
              className="px-8 py-3 rounded-full bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors"
            >
              Start Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
