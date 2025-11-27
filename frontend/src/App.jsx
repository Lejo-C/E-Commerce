import { useState } from 'react';
import './App.css';
import {Routes, Route} from "react-router-dom";
import Home from "./Components/Home";
import Orders from "./Components/Orders";
import Cart from "./Components/Cart"; 
function App() {

  return (
    <>
      <div>
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/orders" element={<Orders/>}/>
            <Route path="/cart" element={<Cart/>}/>
          </Routes>
      </div>
    </>
  )
}

export default App
