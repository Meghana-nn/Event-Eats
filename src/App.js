import 'bootstrap/dist/css/bootstrap.min.css';
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
import CatererDashboard from './components/CatererDashboard';
import { useAuth } from './contexts/Auth';
import { useEffect } from 'react';
import Header from './components/Header';
import Success from './pages/Success';
import axios from 'axios';
import CatererLogin from './components/CatererLogin';
import ListMenu from './components/menu/ListMenu';
import { CatererProvider } from './contexts/CatererContext';
import './App.css'

function App() {

  const { handleLogin } = useAuth();
  useEffect(() => {
      if(localStorage.getItem('token'))  {
        (async () => {
          const response = await axios.get('http://localhost:3010/api/users/account', {
            headers: {
              Authorization: localStorage.getItem('token')
            }
          })
          handleLogin(response.data)
        })();
      }
    }, []);

  return (
    <>
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
            <Route path="event" element={<Event />} />
            <Route path="account" element={<Account />} />
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="success" element={<Success />} />
            <Route path="caterer/*" element={<CatererDashboard />} />
            <Route path="caterer/login/:userId" element={<CatererLogin />} />
            {/* <Route path="login/caterer/:userId" element={<CatererLogin />} /> */}
            <Route path='/caterer/list/menu' element={<ListMenu/>}/>
            {/* <Route path="waiting" element={<WaitingPage />} /> */}
          </Routes>
          </CatererProvider>
        
         
        </main>
    </>
  );
}

export default App;
