import { Link } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
const Home = ({ searchQuery }) => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  // Filter products by search query
  const filteredProducts = products.filter(p =>
    (p.name ?? "").toLowerCase().includes((searchQuery ?? "").toLowerCase())
  );

  // Fetch products on mount
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products/getProduct", { withCredentials: true })
      .then(res => {
        console.log("✅ Products fetched:", res.data);
        setProducts(res.data);
      })
      .catch(error => console.error("❌ Error fetching products:", error.message));
  }, []);

  // Add to Cart function
  const addToCart = async (product, quantity = 1) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/cart/addCart",
        {
          productId: product._id,
          quantity,
          name: product.name,
          price: product.price,
          image: product.image,
        }, // ✅ send full product details
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // if using JWT
          },
          withCredentials: true, // if using cookies
        }
      );

      console.log("✅ Cart updated:", res.data);
      // Optionally update cart state here
    } catch (err) {
      console.error("❌ Error adding to cart:", err.response?.data || err.message);
    }
  };

   const handleBuyNow = (product) => {
    navigate(`/order/${product._id}`, { state: { product } });
  };
  return (
    <div className="flex flex-col min-h-screen mt-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {filteredProducts.map(product => (
          <div
            className="max-w-sm rounded-md overflow-hidden shadow-lg bg-white p-4 hover:scale-105 transition border border-gray-500"
            key={product._id}
          >
            <Link to={`/product/${product._id}`}>
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-40 object-cover"
              />
              <h1 className="text-lg font-bold mt-2">{product.name}</h1>
              <p className="text-gray-600">{product.description}</p>
              <p className="text-green-600 font-semibold">${product.price}</p>
              <p className="text-sm text-gray-500">Stock: {product.stock}</p>
            </Link>

            <div className="flex gap-4 mt-5">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow"
                onClick={() => addToCart(product, 1)} // ✅ pass product object
              >
                Add to Cart
              </button>
              <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow" onClick={() => handleBuyNow(product)}>
                Buy Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
