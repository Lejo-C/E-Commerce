import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;
const Home = ({ searchQuery }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // ✅ Corrected route name to match backend
        const res = await axios.get(`${API_URL}/api/products/getProduct`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          withCredentials: true,
        });
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery?.toLowerCase() || "")
  );

  // Skeleton Loader
  const ProductSkeleton = () => (
    <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm animate-pulse">
      <div className="aspect-square rounded-2xl bg-slate-200 mb-4"></div>
      <div className="flex justify-between items-start mb-2">
        <div className="h-6 bg-slate-200 rounded w-2/3"></div>
        <div className="h-6 bg-slate-200 rounded w-1/6"></div>
      </div>
      <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
      <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-slate-200"></div>
        <div className="h-3 bg-slate-200 rounded w-1/4"></div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 pb-20 pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white mb-12 h-96 rounded-[2.5rem] shadow-sm animate-pulse mb-12"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-12 sm:pb-20 selection:bg-indigo-100 selection:text-indigo-700">
      {/* Hero Section */}
      <div className="relative bg-white mb-12 sm:mb-16 pt-12 sm:pt-16 pb-16 sm:pb-20 rounded-b-[2rem] sm:rounded-b-[3rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0 bg-[radial-gradient(#e0e7ff_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.4]"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-violet-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute top-32 -left-24 w-72 h-72 bg-teal-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse" style={{ animationDelay: "2s" }}></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white border border-indigo-100 shadow-sm text-indigo-600 text-sm font-bold mb-8 tracking-wide uppercase">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></span>
            New Collection 2025
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black mb-6 sm:mb-8 tracking-tighter text-slate-900 leading-[1.1]">
            Discover Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 animate-gradient-x">
              Next Obsession
            </span>
          </h1>
          <p className="text-base sm:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium px-4">
            Explore our curated selection of premium products designed to elevate your lifestyle with style and substance.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 sm:py-24 bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-sm border border-slate-100 text-center mx-4 sm:mx-0">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-indigo-50 rounded-full flex items-center justify-center text-3xl sm:text-4xl mb-6 text-indigo-500">
              🔍
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2 px-4">No Products Found</h2>
            <p className="text-slate-500 max-w-md mx-auto">
              We couldn't find any matches for "{searchQuery}". Try adjusting your search terms or browse our full collection.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8 px-2">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">Featured Items</h2>
              <span className="text-sm font-medium text-slate-400">{filteredProducts.length} results</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-8">
              {filteredProducts.map((product) => (
                <div
                  key={product._id}
                  role="button"
                  tabIndex={0}
                  className="group bg-white rounded-[1.5rem] sm:rounded-[2rem] p-3 sm:p-4 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 transform hover:-translate-y-2 border border-slate-100 relative overflow-hidden"
                  onClick={() => navigate(`/product/${product._id}`)}
                  onKeyDown={(e) => e.key === "Enter" && navigate(`/product/${product._id}`)}
                >
                  {/* Image */}
                  <div className="relative aspect-square rounded-[1rem] sm:rounded-[1.5rem] overflow-hidden bg-slate-50 mb-4 sm:mb-5">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
                    <button className="absolute bottom-4 right-4 w-12 h-12 flex items-center justify-center bg-white/90 backdrop-blur-md text-slate-900 rounded-full shadow-lg translate-y-14 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-indigo-600 hover:text-white z-10">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  </div>

                  {/* Info */}
                  <div className="px-2">
                    <div className="flex justify-between items-center gap-4 mb-3">
                      <h3 className="font-bold text-base sm:text-lg text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">
                        {product.name}
                      </h3>
                      <span className="shrink-0 font-bold text-indigo-700 bg-indigo-50 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm border border-indigo-100">
                        ${product.price}
                      </span>
                    </div>

                    <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-4">
                      {product.description}
                    </p>

                    <div className="flex items-center gap-2 pt-4 border-t border-slate-50">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                      </span>
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        In Stock
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;

