import { useState, useEffect } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;
const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${API_URL}/api/buyProduct/myOrders`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                    withCredentials: true,
                });
                setOrders(res.data);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load orders");
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const groupOrdersByTime = (orders) => {
        if (!orders || orders.length === 0) return [];
        const groups = [];
        let currentGroup = [orders[0]];
        for (let i = 1; i < orders.length; i++) {
            const timeDiff = Math.abs(new Date(orders[i].createdAt) - new Date(orders[i - 1].createdAt));
            if (timeDiff <= 5000) currentGroup.push(orders[i]);
            else {
                groups.push(currentGroup);
                currentGroup = [orders[i]];
            }
        }
        if (currentGroup.length > 0) groups.push(currentGroup);
        return groups;
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case "Confirmed": return "bg-blue-50 text-blue-600 border-blue-100";
            case "Shipped": return "bg-amber-50 text-amber-600 border-amber-100";
            case "Delivered": return "bg-emerald-50 text-emerald-600 border-emerald-100";
            case "Canceled": return "bg-red-50 text-red-600 border-red-100";
            default: return "bg-slate-50 text-slate-600 border-slate-100";
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "Confirmed": return "✓";
            case "Shipped": return "✈️";
            case "Delivered": return "📦";
            case "Canceled": return "✕";
            default: return "•";
        }
    };

    const handleCancelOrder = async (orderId) => {
        if (!window.confirm("Are you sure you want to cancel this order?")) return;

        try {
            await axios.put(`${API_URL}/api/buyProduct/cancelOrder/${orderId}`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                withCredentials: true,
            });

            // Update local state
            setOrders(prevOrders => prevOrders.map(order =>
                order._id === orderId ? { ...order, status: "Canceled" } : order
            ));
        } catch (err) {
            alert(err.response?.data?.message || "Failed to cancel order");
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="text-center p-8 bg-white rounded-3xl shadow-soft">
                <div className="text-4xl mb-4">⚠️</div>
                <h3 className="text-xl font-bold text-slate-800">Something went wrong</h3>
                <p className="text-slate-500 mt-2">{error}</p>
            </div>
        </div>
    );

    const orderGroups = groupOrdersByTime(orders);

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="container-custom mx-auto max-w-5xl">
                <div className="mb-10 fade-in-scale">
                    <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Order History</h1>
                    <p className="text-slate-500 font-medium">Track and manage your recent purchases</p>
                </div>

                {orders.length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-3xl shadow-soft border border-slate-100">
                        <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
                            🛍️
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">No orders yet</h2>
                        <p className="text-slate-500 mb-8">When you place an order, it will appear here.</p>
                        <a href="/home" className="inline-block px-8 py-3 rounded-full bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                            Start Shopping
                        </a>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {orderGroups.map((group, idx) => {
                            const total = group.reduce((sum, item) => sum + item.totalPrice, 0);
                            const date = new Date(group[0].createdAt).toLocaleDateString('en-US', {
                                month: 'long', day: 'numeric', year: 'numeric'
                            });
                            const status = group[0].status || "Confirmed";

                            return (
                                <div key={idx} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300 fade-in-scale" style={{ animationDelay: `${idx * 0.1}s` }}>
                                    {/* Header */}
                                    <div className="bg-slate-50/50 px-8 py-6 border-b border-slate-100 flex flex-wrap gap-6 justify-between items-center">
                                        <div className="flex gap-8">
                                            <div>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Order Placed</p>
                                                <p className="font-semibold text-slate-700">{date}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Amount</p>
                                                <p className="font-bold text-slate-900">${total.toFixed(2)}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Order ID</p>
                                                <p className="font-mono text-sm text-slate-500">#{group[0]._id.slice(-6)}</p>
                                            </div>
                                        </div>

                                        <div className={`px-4 py-2 rounded-full border flex items-center gap-2 text-sm font-bold ${getStatusStyle(status)}`}>
                                            <span>{getStatusIcon(status)}</span>
                                            <span>{status}</span>
                                        </div>
                                    </div>

                                    {/* Items */}
                                    <div className="p-8">
                                        <div className="space-y-8">
                                            {group.map((order) => (
                                                <div key={order._id} className="flex flex-col sm:flex-row gap-6">
                                                    <div className="relative w-full sm:w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                                                        {order.productId?.image ? (
                                                            <img src={order.productId.image} alt={order.productId.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-slate-300 text-2xl">📷</div>
                                                        )}
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="text-lg font-bold text-slate-800 mb-1 truncate">{order.productId?.name || "Product Unavailable"}</h3>
                                                        <p className="text-slate-500 text-sm mb-3 line-clamp-2 max-w-2xl">{order.productId?.description}</p>
                                                        <div className="flex items-center gap-4 text-sm">
                                                            <span className="bg-slate-100 px-3 py-1 rounded-lg font-medium text-slate-600">Qty: {order.quantity}</span>
                                                            <span className="font-bold text-indigo-600">${order.productId?.price}</span>
                                                        </div>
                                                    </div>

                                                    <div className="sm:text-right pt-2 flex flex-col items-end gap-2">
                                                        <button className="text-indigo-600 font-semibold text-sm hover:text-indigo-800 transition-colors">
                                                            Buy Again
                                                        </button>
                                                        {(!order.status || order.status === "Confirmed") && (
                                                            <button
                                                                onClick={() => handleCancelOrder(order._id)}
                                                                className="text-red-500 font-semibold text-sm hover:text-red-700 transition-colors"
                                                            >
                                                                Cancel Order
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Shipping Info */}
                                        {group[0].buyerName && (
                                            <div className="mt-8 pt-6 border-t border-slate-100">
                                                <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                                                    <span className="text-slate-400">📍</span> Shipping Details
                                                </h4>
                                                <div className="grid sm:grid-cols-2 gap-4 text-sm text-slate-600 bg-slate-50 p-4 rounded-2xl">
                                                    <p><span className="font-semibold text-slate-800">To:</span> {group[0].buyerName}</p>
                                                    <p><span className="font-semibold text-slate-800">Email:</span> {group[0].buyerEmail}</p>
                                                    <p className="sm:col-span-2"><span className="font-semibold text-slate-800">Address:</span> {group[0].buyerAddress}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;