import { useState } from 'react';
import './App.css';
import { Routes, Route } from "react-router-dom";
import LandingPage from "./LandingPage";
import Home from "./Components/Home";
import Orders from "./Components/Orders";
import Cart from "./Components/Cart";
import ProductDetails from './Components/ProductDetails';
import Signup from "./Signup";
import Login from "./Login";
import DashBoard from './Merchant/DashBoard';
import Nav from "./Components/Nav";
import BuyProducts from './Components/BuyProducts';
import OrderDetails from './Components/OrderDetails';
import MerchantOrders from './Merchant/Order';
import ProductForm from './Merchant/ProductForm';

function App() {

  const [searchQuery, setSearchQuery] = useState("");
  const hideNav = ["/", "/login", "/signup", "/merchant-dashboard", "/merchant/orders", "/merchant/add-product"].includes(window.location.pathname) || window.location.pathname.startsWith("/merchant/edit-product");

  return (
    <>
      <div>
        {!hideNav && <Nav setSearchQuery={setSearchQuery} />}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<Home searchQuery={searchQuery} />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/merchant-dashboard" element={<DashBoard />} />
          <Route path="/buy-products" element={<BuyProducts />} />
          <Route path="/order/:productId" element={<OrderDetails />} />
          <Route path="/merchant/orders" element={<MerchantOrders />} />
          <Route path="/merchant/add-product" element={<ProductForm />} />
          <Route path="/merchant/edit-product/:id" element={<ProductForm />} />
        </Routes>
      </div>
    </>
  )
}

export default App
