import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
    <nav className="sticky top-0 z-20 w-full border-b border-gray-500 bg-white flex justify-end">
      
      <div className="flex items-center font-bold px-4">
        <h1>LOGO</h1>
      </div>
      
      <div className="flex items-center py-4 px-4 mx-auto">
        <input type="text" placeholder="Search" className="w-50px bg-black/10 w-100 h-10 text-center rounded-full "/>
      </div>

      <div className="flex justify-end py-4 px-4">
        <Link to="/" className="px-4 py-2 rounded-full font-bold text-black bg-white/20 backdrop-blur-md border border-white/30 transition hover:bg-black/10 hover:-translate-y-0.5">Home</Link>
        <Link to="/orders" className="px-4 py-2 rounded-full font-bold text-black bg-white/20 backdrop-blur-md border border-white/30 transition hover:bg-black/10 hover:-translate-y-0.5">Orders</Link>
        <Link to="/cart" className="px-4 py-2 rounded-full font-bold text-black bg-white/20 backdrop-blur-md border border-white/30 transition hover:bg-black/10 hover:-translate-y-0.5">Cart</Link>
      </div>
    </nav>
    <footer className="mt-auto mb-8 ml-4">
      <div>
        
      </div>
    </footer>
</div>
    
  );
};

export default Home;
