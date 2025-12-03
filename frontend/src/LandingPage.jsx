import { Link } from "react-router-dom";

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute -top-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-gradient-to-br from-indigo-200/40 to-violet-200/40 blur-3xl animate-float"></div>
                <div className="absolute top-[40%] -left-[20%] w-[60%] h-[60%] rounded-full bg-teal-200/30 blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
            </div>
            <div className="mt-10"></div>
            {/* Navigation */}
            <nav className="container-custom mx-auto py-6 flex justify-between items-center relative z-10 gap-229 sticky index-20">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        L
                    </div>
                    
                </div>
                <div className="space-x-4">
                    <Link to="/login" className="font-bold text-slate-600 hover:text-indigo-600 transition-colors">
                        Login
                    </Link>
                    <Link to="/signup" className="px-6 py-2.5 bg-slate-900 text-white rounded-full font-bold hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                        Sign Up
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="flex-1 flex items-center justify-center px-4 relative z-10">
                <div className="text-center max-w-5xl mx-auto fade-in-scale">
                    <span className="inline-block py-1 px-4 rounded-full bg-indigo-100 text-indigo-600 text-sm font-bold mb-8 tracking-wide uppercase shadow-sm">
                        Future of Shopping
                    </span>

                    <h1 className="text-6xl sm:text-7xl lg:text-8xl font-extrabold mb-8 leading-tight text-slate-900 tracking-tight">
                        Experience <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-teal-500">
                            Limitless Luxury
                        </span>
                    </h1>

                    <p className="text-xl sm:text-2xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
                        Discover a curated marketplace where premium quality meets modern design. Elevate your lifestyle with just a click.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                        <Link
                            to="/signup"
                            className="px-10 py-5 rounded-full btn-gradient text-white text-lg font-bold shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 transform hover:-translate-y-1 transition-all duration-300 min-w-[200px]"
                        >
                            Start Shopping
                        </Link>
                        <Link
                            to="/login"
                            className="px-10 py-5 rounded-full bg-white text-slate-900 text-lg font-bold border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 min-w-[200px]"
                        >
                            Merchant Login
                        </Link>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 text-left">
                        <div className="bg-white/60 backdrop-blur-md p-8 rounded-3xl border border-white/50 shadow-sm hover:shadow-md transition-all duration-300">
                            <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-2xl mb-4">💎</div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Premium Quality</h3>
                            <p className="text-slate-600">Hand-picked items that meet our rigorous standards of excellence.</p>
                        </div>
                        <div className="bg-white/60 backdrop-blur-md p-8 rounded-3xl border border-white/50 shadow-sm hover:shadow-md transition-all duration-300">
                            <div className="w-12 h-12 bg-teal-100 rounded-2xl flex items-center justify-center text-2xl mb-4">🚀</div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Fast Shipping</h3>
                            <p className="text-slate-600">Lightning fast delivery with real-time tracking to your doorstep.</p>
                        </div>
                        <div className="bg-white/60 backdrop-blur-md p-8 rounded-3xl border border-white/50 shadow-sm hover:shadow-md transition-all duration-300">
                            <div className="w-12 h-12 bg-violet-100 rounded-2xl flex items-center justify-center text-2xl mb-4">🛡️</div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Secure Payments</h3>
                            <p className="text-slate-600">Bank-grade encryption ensures your transactions are always safe.</p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="py-8 text-center text-slate-400 text-sm relative z-10">
                <p> Crafted with ❤️ by Lejo.</p>
            </footer>
        </div>
    );
};

export default LandingPage;