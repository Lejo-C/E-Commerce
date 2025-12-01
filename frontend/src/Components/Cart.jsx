import { useState, useEffect } from "react";
import axios from "axios";

const Cart = () => {
  const [cart, setCart] = useState(null);

  // Fetch cart on mount
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/cart/getCart", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        });
        setCart(res.data);
      } catch (err) {
        console.error("❌ Error fetching cart:", err.response?.data || err.message);
      }
    };

    fetchCart();
  }, []);

  // Increase quantity
  const increaseQuantity = async (productId) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/cart/addCart",
        { productId, quantity: 1 },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );
      setCart(res.data);
    } catch (err) {
      console.error("❌ Error increasing quantity:", err.response?.data || err.message);
    }
  };

  // Decrease quantity
  const decreaseQuantity = async (productId) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/cart/addCart",
        { productId, quantity: -1 },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );
      setCart(res.data);
    } catch (err) {
      console.error("❌ Error decreasing quantity:", err.response?.data || err.message);
    }
  };

  // Remove product
  const removeFromCart = async (productId) => {
    try {
      const res = await axios.delete("http://localhost:5000/api/cart/removeFromCart", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
        data: { productId }, // axios DELETE requires `data` for body
      });
      setCart(res.data);
    } catch (err) {
      console.error("❌ Error removing product:", err.response?.data || err.message);
    }
  };

  if (!cart) return <p>Loading cart...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🛒 Your Cart</h1>
      {cart.products.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul className="space-y-4">
          {cart.products.map((item) => (
            <li
              key={item._id || item.productId._id || item.productId} 
              className="flex items-center justify-between border p-4 rounded-lg"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.image || item.productId.image}
                  alt={item.name || item.productId.name}
                  className="w-20 h-20 object-cover rounded"
                />
                <div>
                  <h2 className="font-semibold">
                    {item.name || item.productId.name}
                  </h2>
                  <p>Quantity: {item.quantity}</p>
                  <p className="text-green-600 font-bold">
                    ${item.price || item.productId.price}
                  </p>
                </div>
              </div>
              <div>
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded"
                  onClick={() => increaseQuantity(item.productId._id || item.productId)}
                >
                  +
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded ml-2"
                  onClick={() => removeFromCart(item.productId._id || item.productId)}
                >
                  Remove
                </button>
                <button
                  className={`px-4 py-2 rounded ml-2 text-white ${item.quantity <= 1 ? "bg-gray-400 cursor-not-allowed" : "bg-green-500"}`}
                  onClick={() => decreaseQuantity(item.productId._id || item.productId)}
                  disabled={item.quantity <= 1} 
                >
                  -
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Cart;
