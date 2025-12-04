import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { TbLogout2 } from "react-icons/tb";
const API_URL = import.meta.env.VITE_API_URL;

const Nav = ({ setSearchQuery }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  return (
    <nav className="sticky top-2 sm:top-4 z-50 px-2 sm:px-6 mb-6 sm:mb-8">
      <div className="container-custom mx-auto">
        <div className="glass rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between shadow-soft">
          {/* Logo */}
          <Link to="/home" className="flex items-center gap-2 group">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
              L
            </div>

          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full group">
              <input
                type="text"
                placeholder="Search for products..."
                className="w-full px-6 py-3 bg-slate-100 border-none rounded-full focus:ring-2 focus:ring-indigo-500/50 focus:bg-white transition-all duration-300 font-medium text-slate-700 shadow-inner"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-1 sm:gap-2">
            <Link
              to="/home"
              className={`hidden sm:block px-4 sm:px-5 py-2 sm:py-2.5 rounded-full font-semibold transition-all duration-300 text-sm ${isActive('/home')
                ? 'bg-slate-900 text-white shadow-lg transform scale-105'
                : 'text-slate-600 hover:bg-slate-100 hover:text-indigo-600'
                }`}
            >
              Home
            </Link>
            <Link
              to="/orders"
              className={`hidden sm:block px-4 sm:px-5 py-2 sm:py-2.5 rounded-full font-semibold transition-all duration-300 text-sm ${isActive('/orders')
                ? 'bg-slate-900 text-white shadow-lg transform scale-105'
                : 'text-slate-600 hover:bg-slate-100 hover:text-indigo-600'
                }`}
            >
              Orders
            </Link>
            <Link
              to="/cart"
              className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-full font-semibold flex items-center gap-1 sm:gap-2 transition-all duration-300 text-sm ${isActive('/cart')
                ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-glow transform scale-105'
                : 'bg-slate-100 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600'
                }`}
            >
              <span className="hidden sm:inline">Cart</span>
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </Link>
            <button onClick={handleLogout} className="px-3 sm:px-5 py-2 sm:py-2.5 rounded-full font-bold text-red-600 text-sm">
              <TbLogout2 />
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden mt-4">
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-6 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
    </nav>
  );
};

export default Nav;