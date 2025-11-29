import { Link } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";

const Home = ({ searchQuery }) => {
  const [products, setProducts] = useState([]);

  const filteredProducts = products.filter(p =>
    (p.name ?? "").toLowerCase().includes((searchQuery ?? "").toLowerCase())
  );

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products/getProduct", { withCredentials: true })
      .then(res => {
        console.log(res.data);
        setProducts(res.data);
      })
      .catch(error => console.log(error.message));
  }, []);

  return (
    <div className="flex flex-col min-h-screen mt-10">
      <div className="grid grid-cols-4 gap-5 ml-10 mr-10">
        {filteredProducts.map(product => (
          <Link
            to={`/product/${product._id}`}
            key={product._id}
            className="max-w-sm rounded overflow-hidden shadow-lg bg-white p-4 hover:scale-105 transition"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-40 object-cover"
            />
            <h1 className="text-lg font-bold mt-2">{product.name}</h1>
            <p className="text-gray-600">{product.description}</p>
            <p className="text-green-600 font-semibold">${product.price}</p>
            <p className="text-sm text-gray-500">Stock: {product.stock}</p>
            <div className="flex gap-4 mt-5">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow">
                Add to Cart
              </button>
              <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow">
                Buy Now
              </button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
