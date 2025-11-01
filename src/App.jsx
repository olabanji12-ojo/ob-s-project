import React, { useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home_page from './pages/Home_page'
import Product_page from './pages/Product_page'
import Product_id_page from './pages/Product_id_page'
import Read_story from './pages/Read_story'
import Cart_page from './pages/Cart_page'
import Checkout_page from './pages/Checkout_page'
import Login_page from './pages/Login_page'
import Signup_page from './pages/Signup_page'
import OrderComplete_page from './pages/OrderComplete_page'
import { Routes, Route, Outlet } from "react-router-dom";
import Payment_success from './components/Payment_success'
import Payment_failed from './components/Payment_failed'
import Art_pages from './pages/Art_pages'

import AOS from 'aos';
import 'aos/dist/aos.css';


const Layout = () => {
  return (
    <>
      <Navbar />
      <main>
        <Outlet /> {/* All nested routes will render here */}
      </main>
      <Footer />
    </>
  );
};

const App = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-in-out', // Smooth easing for a natural feel
      anchorPlacement: 'top-bottom', // Trigger animations when the top of the element hits the bottom of the viewport
      offset: 100, // Start animation 100px before the element is in view
    });
  }, []);
  return (
    <div className="bg-[#FAF8F5] text-[#3E3E3E] min-h-screen">
      <Routes>
        <Route element={<Layout />}>
          <Route path='/' element={<Home_page />} />
          <Route path='/products' element={<Product_page />} />
          <Route path='/product/:id' element={<Product_id_page />} />
          <Route path="/read_story/:id" element={<Read_story />} />
          <Route path='/cart_page' element={<Cart_page />} />
          <Route path='/checkout_page' element={<Checkout_page />} />
          <Route path='/login_page' element={<Login_page />} />
          <Route path='/signup_page' element={<Signup_page />} />
          <Route path='/order/complete' element={<OrderComplete_page />} />
          <Route path='payment-success' element={<Payment_success />} ></Route>
          <Route path='payment-failed' element={<Payment_failed />} ></Route>
          <Route path='art' element={<Art_pages />} ></Route>
          <Route path='/art/:artworkId' element={<Art_pages />} />

          

          {/* Add more pages like below */}
          {/* <Route path="about" element={<About />} /> */}
          {/* <Route path="contact" element={<Contact />} /> */}
          
        </Route>
      </Routes>
    </div>
  )
}

export default App