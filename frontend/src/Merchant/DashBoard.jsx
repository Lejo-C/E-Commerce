import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MerchentNav from "./MerchentNav";
const API_URL = import.meta.env.VITE_API_URL;
const MerchantDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/products/merchantProducts`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        withCredentials: true,
      });
      setProducts(res.data);
    } catch (err) {
      console.error("❌ Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <MerchentNav />

      <div className="container-custom mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 fade-in-scale">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-2">Dashboard</h1>
            <p className="text-slate-500 font-medium">Overview of your store's performance</p>
          </div>
          <button
            onClick={() => navigate("/merchant/add-product")}
            className="mt-6 md:mt-0 px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base bg-emerald-600 text-white rounded-full font-bold shadow-lg shadow-emerald-500/30 hover:bg-emerald-700 hover:shadow-emerald-500/50 transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
          >
            <span className="text-xl">+</span> Add Product
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-12 fade-in-scale" style={{ animationDelay: '0.1s' }}>
          <div className="bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl shadow-soft border border-slate-100 relative overflow-hidden group hover:shadow-md transition-all">
            <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
            <h3 className="text-sm sm:text-base text-slate-500 font-bold mb-2 relative z-10">Total Products</h3>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 relative z-10">{products.length}</p>
          </div>
          <div className="bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl shadow-soft border border-slate-100 relative overflow-hidden group hover:shadow-md transition-all">
            <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
            <h3 className="text-slate-500 font-bold mb-2 relative z-10">Total Stock</h3>
            <p className="text-4xl font-extrabold text-slate-900 relative z-10">
              {products.reduce((acc, curr) => acc + (parseInt(curr.stock) || 0), 0)}
            </p>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-soft border border-slate-100 relative overflow-hidden group hover:shadow-md transition-all">
            <div className="absolute right-0 top-0 w-32 h-32 bg-violet-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
            <h3 className="text-slate-500 font-bold mb-2 relative z-10">Inventory Value</h3>
            <p className="text-4xl font-extrabold text-slate-900 relative z-10">
              ${products.reduce((acc, curr) => acc + ((parseInt(curr.price) || 0) * (parseInt(curr.stock) || 0)), 0).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Products Grid */}
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6">Your Products</h2>
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-soft border border-slate-100">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-bold text-slate-800">No Products Added</h3>
            <p className="text-slate-500 mb-6">Start building your inventory today.</p>
            <button onClick={() => navigate("/merchant/add-product")} className="text-emerald-600 font-bold hover:underline">
              Add your first product
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product, index) => (
              <div
                key={product._id}
                className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 fade-in-scale"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="relative aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-slate-100 mb-3 sm:mb-4 group">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                    Stock: {product.stock}
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 line-clamp-1">{product.name}</h3>
                    <p className="font-bold text-sm sm:text-base text-emerald-600">${product.price}</p>
                  </div>
                  <p className="text-slate-500 text-sm line-clamp-2 mb-4 h-10">{product.description}</p>
                  <button
                    onClick={() => navigate(`/merchant/edit-product/${product._id}`)}
                    className="w-full py-2 rounded-xl bg-slate-50 text-slate-600 text-xs sm:text-sm font-semibold hover:bg-slate-900 hover:text-white transition-colors"
                  >
                    Edit Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MerchantDashboard;
