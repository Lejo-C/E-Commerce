import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;
const ProductDetails = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/products/getProduct/${id}`, {
          withCredentials: true,
        });
        setProduct(res.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const addToCart = async (product, quantity = 1) => {
    try {
      await axios.post(
        `${API_URL}/api/cart/addCart`,
        {
          productId: product._id,
          quantity,
          name: product.name,
          price: product.price,
          image: product.image,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );
      alert("Added to cart successfully!");
    } catch (err) {
      console.error("❌ Error adding to cart:", err);
    }
  };

  const handleBuyNow = async () => {
    await addToCart(product, 1);
    navigate("/cart");
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
      <h2 className="text-2xl font-bold text-slate-800">Product Not Found</h2>
      <button onClick={() => navigate("/home")} className="text-indigo-600 font-semibold hover:underline">
        Back to Home
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="container-custom mx-auto max-w-6xl">
        <button
          onClick={() => navigate("/home")}
          className="mb-8 flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-medium group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Collection
        </button>

        <div className="bg-white rounded-[1.5rem] sm:rounded-[2rem] shadow-soft overflow-hidden border border-slate-100 fade-in-scale">
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Image Section */}
            <div className="relative bg-slate-100 aspect-square lg:aspect-auto h-full min-h-[300px] sm:min-h-[400px] lg:min-h-[500px] group overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>

            {/* Details Section */}
            <div className="p-6 sm:p-8 lg:p-16 flex flex-col justify-center relative">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <svg className="w-64 h-64 text-indigo-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>

              <div className="relative z-10">
                <span className="inline-block px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-6">
                  Premium Selection
                </span>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 leading-tight">
                  {product.name}
                </h1>

                <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                  <p className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                    ${product.price}
                  </p>
                  {product.stock > 0 ? (
                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span> In Stock
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-bold">
                      Out of Stock
                    </span>
                  )}
                </div>

                <div className="prose prose-slate mb-10 text-slate-600 leading-relaxed">
                  <p>{product.description}</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <button
                    onClick={() => addToCart(product, 1)}
                    disabled={product.stock <= 0}
                    className="flex-1 py-3 sm:py-4 px-6 sm:px-8 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={handleBuyNow}
                    disabled={product.stock <= 0}
                    className="flex-1 py-3 sm:py-4 px-6 sm:px-8 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg btn-gradient shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Buy Now
                  </button>
                </div>

                <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm text-slate-400 font-medium">
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Secure Checkout
                  </span>
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    Free Returns
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;