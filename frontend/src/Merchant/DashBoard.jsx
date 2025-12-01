import { useState, useEffect } from "react";
import axios from "axios";
import MerchentNav from "./MerchentNav";
const MerchantDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    image: "",
  });

  // Fetch products added by the merchant
  useEffect(() => {
  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products/getProduct", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      });

      // ✅ Filter products by merchantId matching logged-in user
      const merchantId = localStorage.getItem("merchantId"); // store this at login
      const merchantProducts = res.data.filter(p => p.merchantId === merchantId);

      setProducts(merchantProducts);
    } catch (err) {
      console.error("❌ Error fetching products:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchProducts();
}, []);

  // Handle input change
  const handleChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  // Submit new product
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/products/addProduct",
        newProduct,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );
      console.log("✅ Product added:", res.data);
      setShowModal(false);
      setNewProduct({ name: "", description: "", price: "", stock: "", image: "" });
      fetchProducts(); // refresh product list
    } catch (err) {
      console.error("❌ Error adding product:", err.response?.data || err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
        <nav>
            <MerchentNav />
        </nav>
      <h1 className="text-3xl font-bold mb-6">📊 Merchant Dashboard</h1>

      {/* Products Section */}
      <section className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Products</h2>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
            onClick={() => setShowModal(true)}
          >
            + Add Product
          </button>
        </div>

        {loading ? (
          <p>Loading products...</p>
        ) : products.length === 0 ? (
          <p className="text-gray-600">No products added yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-lg shadow-md p-4 border hover:shadow-lg transition"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded-md"
                />
                <h3 className="text-lg font-bold mt-2">{product.name}</h3>
                <p className="text-gray-600">{product.description}</p>
                <p className="text-green-600 font-semibold mt-1">${product.price}</p>
                <p className="text-sm text-gray-500">Stock: {product.stock}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Add Product Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Product</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Product Name"
                value={newProduct.name}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              />
              <textarea
                name="description"
                placeholder="Description"
                value={newProduct.description}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              />
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={newProduct.price}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              />
              <input
                type="number"
                name="stock"
                placeholder="Stock"
                value={newProduct.stock}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              />
              <input
                type="text"
                name="image"
                placeholder="Image URL"
                value={newProduct.image}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />

              <div className="flex justify-end gap-4 mt-4">
                <button
                  type="button"
                  className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default MerchantDashboard;
