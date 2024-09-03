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
import CustomerEvents from './components/customer/CustomerEvents';
import CustomerEventList from './components/customer/CustomerEventList';
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
import { CartProvider } from 'react-use-cart';
import Cart from './components/Cart';
import Payment from './components/payment/Payment';
import TestNavigate from './components/TestNvigate';
import EventHome from './components/customer/EventHome';
import SuccessPayment from './components/payment/SuccessPayment';

import ChatWindow from './components/enquiry/Chatwindow'; 
import CustomerEnquiry from './components/enquiry/CustomerEnquiry';
import CatererEnquiry from './components/enquiry/CatererEnquiry';

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
    
      <CatererProvider>
        <CustomerProvider>
          <CartProvider>
            <Header />
            <main className='pt-28'>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="register" element={<Register />} />
                <Route path="login" element={<Login />} />
                <Route path="menu" element={<Menu />} />
                <Route path="contact" element={<Contact />} />
                <Route path="about" element={<About />} />
                <Route path="event" element={<Event />} />
                <Route path="account" element={<Account />} />
                <Route path="admin" element={<AdminDashboard />} />
                <Route path="success" element={<Success />} />
                <Route path='landing' element={<LandingPage />} />

                {/* Caterer specific routes */}
                <Route path="caterer/*" element={<CatererDashboard />} />
                <Route path="caterer/login/:userId" element={<CatererLogin />} />
                <Route path="caterer/list/menu" element={<ListMenu />} />

                {/* Customer specific routes */}
                <Route path="customers/*" element={<CustomerDashboard />} />
                <Route path="customer/login/:userId" element={<CustomerLogin />} />
                <Route path="customers/list/menu" element={<CustomerMenu />} />
                <Route path="customers/events/home" element={<EventHome/>}/>
                <Route path="customers-events" element={<CustomerEvents />} />
                {/* <Route path="/test" element={<div>Test Page</div>} /> */}
                <Route path="customers/events/fetch" element={<CustomerEventList />} />

                <Route path='cart' element={<Cart />} />
                <Route path='/cart/payment' element={<Payment />} />
                <Route path="success/payment" element={<SuccessPayment />} />

                <Route path="chat/:userId" element={<ChatWindow />} />
                <Route path="enquiries/customers" element={<CustomerEnquiry />} />
                <Route path="enquiries/caterers" element={<CatererEnquiry />} />
                
                
               
                
              </Routes>
            </main>
          </CartProvider>
        </CustomerProvider>
      </CatererProvider>
    </>
  );
}

export default App;
