import {useState, useEffect} from "react";
import axios from "axios";
const Cart = () => {
    const [cart, setCart] = useState(null);

    useEffect(()=>{
        axios.get("http://localhost:5000/api/cart/getCart", {withCredentials:true})
        .then(res=>{
            console.log(res.data);
            setCart(res.data);
        })
        .catch(error=>console.log(error.message));
    })

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
            {cart ? (
                <div>
                    {cart.products.map(items=>(
                        <div key= {items.productId._id} className="border-b py-4">
                            <h2 className="text-xl font-semibold">{items.productId.name}</h2>
                            <button>+</button>
                            <p>Quantity: {items.quantity}</p>
                            <button>-</button>
                            <p>Price: ${items.productId.price}</p>
                            <button>Remove</button>
                        </div>
                    ))}
                </div>
            ) : (
                <p>Your cart is empty.</p>
            )}
        </div>
    );
};

export default Cart;