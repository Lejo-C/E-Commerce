import { useState } from 'react';
import './App.css';
import {Routes, Route} from "react-router-dom";
import LandingPage from "./LandingPage";
import Home from "./Components/Home";
import Orders from "./Components/Orders";
import Cart from "./Components/Cart";
import ProductDetails from './Components/ProductDetails';
import Signup from "./Signup";
import Login from "./Login";
import DashBoard from './Merchant/DashBoard';
function App() {

  return (
    <>
      <div>
          <Routes>
            <Route path="/" element={<LandingPage/>} />
            <Route path="/home" element={<Home/>}/>
            <Route path="/orders" element={<Orders/>}/>
            <Route path="/cart" element={<Cart/>}/>
            <Route path="/product/:id" element={<ProductDetails/>}/>
            <Route path="/signup" element={<Signup/>}/>
            <Route path="/signup" element={<Signup/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/merchant-dashboard" element={<DashBoard/>}/>
          </Routes>
      </div>
    </>
  )
}

export default App
