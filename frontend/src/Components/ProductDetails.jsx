import {useState, useEffect} from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Nav from "./Nav";

const ProductDetails = () => {
    const [product, setProduct] = useState([null]);
    const id = useParams().id;

    useEffect(()=>{
        axios.get(`http://localhost:5000/api/products/getProduct/${id}`, {withCredentials:true})
        .then(res=>{
            console.log(res.data)
            setProduct(res.data)
        })
        .catch(error=>console.log(error.message))
    },[id]);

    if(!product){
        return <p>Loading...</p>
    }

    return (
        <div>
 
  <div className="max-w-5xl mx-auto px-6 py-10">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Image */}
      <div>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-96 object-cover rounded-lg shadow-md"
        />
      </div>

      {/* Details */}
      <div>
        <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
        <p className="text-gray-600 mb-6">{product.description}</p>
        <p className="text-2xl font-semibold text-green-600 mb-2">₹{product.price}</p>
        <p className="text-sm text-gray-500 mb-6">Stock: {product.stock}</p>

        <div className="flex gap-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow">
            Add to Cart
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  </div>
</div>

    );
};

export default ProductDetails;