import { useState, useEffect } from "react";
const API_URL = import.meta.env.VITE_API_URL;
const BuyProducts = () => {

    const [buy, setBuy] = useState(null);

    useEffect(() => {
        const fetchBuy = async () => {      
            try {
                const res = await axios.get(`${API_URL}/api/buyProduct/buyProduct`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    withCredentials: true,
                });
                setBuy(res.data);
            } catch (err) {
                console.error("❌ Error fetching buy:", err.response?.data || err.message);
            }
        };

        fetchBuy();
    }, []);
    return (
        <div className="p-6 space-y-4">
            {buy.map((item) => (
                <div key={item._id}>
                    <h2>{item.name}</h2>
                    <p>{item.description}</p>
                    <p>{item.price}</p>
                    <img src={item.image} alt={item.name} />
                </div>
            ))}
        </div>
    );
};

export default BuyProducts;