import { useLocation, useParams } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const OrderDetails = () => {
  const { productId } = useParams();
  const location = useLocation();
  const product = location.state?.product;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [quantity, setQuantity] = useState(1); // 👈 track quantity

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1)); // 👈 prevent going below 1
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/buyProduct/buyProduct",
        {
          productId,
          quantity,
          name: product.name,
          price: product.price,
          image: product.image,
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
      console.log("✅ Order placed:", res.data);
      alert("Order placed successfully!");
    } catch (err) {
      console.error("❌ Error placing order:", err.response?.data || err.message);
    }
  };

  if (!product) return <p>No product selected.</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h1 className="text-2xl font-bold mb-4">Order Details</h1>

      {/* Product Info */}
      <div className="flex items-center gap-4 mb-6">
        <img src={product.image} alt={product.name} className="w-32 h-32 object-cover rounded" />
        <div>
          <h2 className="text-lg font-semibold">{product.name}</h2>
          <p className="text-green-600 font-bold">${product.price}</p>
          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={decreaseQuantity}
              className={`px-3 py-1 rounded text-white ${
                quantity === 1 ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"
              }`}
              disabled={quantity === 1}
            >
              -
            </button>
            <span className="px-4 py-1 border rounded">{quantity}</span>
            <button
              onClick={increaseQuantity}
              className="px-3 py-1 rounded bg-green-500 hover:bg-green-600 text-white"
            >
              +
            </button>
          </div>
          <p className="mt-2 text-gray-700">
            Total: <span className="font-bold text-green-600">${product.price * quantity}</span>
          </p>
        </div>
      </div>

      {/* User Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
        <textarea
          name="address"
          placeholder="Shipping Address"
          value={formData.address}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />

        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow"
        >
          Confirm Order
        </button>
      </form>
    </div>
  );
};

export default OrderDetails;
