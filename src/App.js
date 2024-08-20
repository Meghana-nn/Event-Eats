import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Account from './components/Account';
import Menu from './pages/Menu';
import Event from './pages/Event';
import Contact from './pages/Contact';
import About from './pages/About';
import AdminDashboard from './components/AdminDashboard';
import CatererDashboard from './components/caterer/CatererDashboard';
import CustomerDashboard from './components/customer/CustomerDashboard';
import { useAuth } from './contexts/Auth';
import { CatererProvider } from './contexts/CatererContext';
import { CustomerProvider } from './contexts/CustomerContext';
import Header from './components/Header';
import Success from './pages/Success';
import axios from 'axios';
import CatererLogin from './components/caterer/CatererLogin';
import ListMenu from './components/caterer/ListMenu';
import CustomerLogin from './components/customer/CustomerLogin';
import CustomerMenu from './components/customer/CustomerMenu';
import './App.css';
import LandingPage from './pages/LandingPage';
import { CartProvider } from './contexts/CartContext';
import Cart from './components/Cart';

function App() {
  const { handleLogin } = useAuth();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      (async () => {
        const response = await axios.get('http://localhost:3010/api/users/account', {
          headers: {
            Authorization: localStorage.getItem('token')
          }
        });
        handleLogin(response.data);
      })();
    }
  }, []);

  return (
    <>
     <CustomerProvider>
      <CartProvider>
      <Header />
      <main className='pt-28'>
        <CatererProvider>
         
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="register" element={<Register />} />
              <Route path="login" element={<Login />} />
              <Route path="menu" element={<Menu />} />
              <Route path="contact" element={<Contact />} />
              <Route path="about" element={<About />} />
              <Route path="/event" element={<Event />} />
              <Route path="account" element={<Account />} />
              <Route path="admin" element={<AdminDashboard />} />
              <Route path="success" element={<Success />} />
              <Route path='landing' element={<LandingPage/>}/>

              {/* Caterer specific routes */}
              <Route path="caterer/*" element={<CatererDashboard />} />
              <Route path="caterer/login/:userId" element={<CatererLogin />} />
              <Route path="caterer/list/menu" element={<ListMenu />} />

              {/* Customer specific routes */}
              <Route path="customers/*" element={<CustomerDashboard />} />
              <Route path="customer/login/:userId" element={<CustomerLogin />} />
              <Route path="customers/list/menu" element={<CustomerMenu/>}/>

              
              <Route path='cart' element={<Cart/>}/>
            </Routes>
         
        </CatererProvider>
      </main>
      </CartProvider>
    </CustomerProvider>
    </>
  );
}

export default App;
