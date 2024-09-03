import React,{useState,useEffect} from 'react';
import { Link } from 'react-router-dom';
import logo from "../assets/Eats_Logo.png";
import { FaCircleUser, FaCartShopping } from "react-icons/fa6";
import { BsCalendarEventFill } from "react-icons/bs";
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/Auth';
import { useCart } from 'react-use-cart';
import { useCustomer } from '../contexts/CustomerContext';

import '../App.css';

const Header = () => {
  const { user, handleLogout } = useAuth();
  const [cartItems, setCartItems] = useState(0);
  const { eventCount } = useCustomer();

  const { items} = useCart();

  useEffect(() => {
    setCartItems(items.length);
  }, [items]);


//   const handleEventCountChange = (count) => {
//   setEventCount(count);
// };

  const linkVariants = {
    hover: { scale: 1.1 },
    tap: { scale: 0.9 }
  };

  const linkStyle = {
    textDecoration: 'none',
    color: 'inherit'
  };

  return (
    <header className='header'>
      <AnimatePresence>
        <div className='flex items-center h-full justify-between'>
          <Link to="/">
            <div className='h-20'>
              <img src={logo} className='h-full' alt='logo' />
            </div>
          </Link>
          <div className='flex items-center gap-4 md:gap-7'>
            <nav className='flex gap-4 md:gap-6 text-base md:text-lg'>
              <motion.div whileHover="hover" whileTap="tap" variants={linkVariants}>
                <Link to="/" style={linkStyle}>HOME</Link>
              </motion.div>
              <motion.div whileHover="hover" whileTap="tap" variants={linkVariants}>
                <Link to="/menu" style={linkStyle}>MENU</Link>
              </motion.div>
              <motion.div whileHover="hover" whileTap="tap" variants={linkVariants}>
                <Link to="/contact" style={linkStyle}>CONTACT</Link>
              </motion.div>
              {!user || user.role !== 'caterer' ? (
                <motion.div whileHover="hover" whileTap="tap" variants={linkVariants}>
                  <Link to="/about" style={linkStyle}>ABOUT</Link>
                </motion.div>
              ) : null}
            </nav>

            {!user ? (
              <>
                <motion.div whileHover="hover" whileTap="tap" variants={linkVariants}>
                  <Link to="/login" className="text-2xl text-slate-500" style={{ color: 'black', ...linkStyle }}>
                    <FaCircleUser />
                  </Link>
                </motion.div>
              </>
            ) : (
              <>
                <motion.div whileHover="hover" whileTap="tap" variants={linkVariants}>
                  <Link to="/account" className=" text-1xl text-slate-500" style={{ color: 'black', ...linkStyle }}>ACCOUNT</Link>
                </motion.div>
                <motion.div whileHover="hover" whileTap="tap" variants={linkVariants}>
                  <Link to="/" onClick={() => {
                    localStorage.removeItem('token');
                    handleLogout();
                  }} className="text-1xl text-slate-500" style={{ color: 'black', ...linkStyle }}>LOGOUT</Link>
                </motion.div>
              </>
            )}
          </div>
          {user && (
            <div className='flex items-center gap-4 md:gap-7'>
              {user.role === 'caterer' && (
                <motion.div whileHover="hover" whileTap="tap" variants={linkVariants}>
                  <Link to="/caterer" style={linkStyle}>Caterer Dashboard</Link>
                </motion.div>
              )}
              {user.role === 'customer' && (
                <>
                  <motion.div whileHover="hover" whileTap="tap" variants={linkVariants}>
                    <Link to="/customers/dashboard" style={linkStyle}>Customer Dashboard</Link>
                  </motion.div>
                  <motion.div whileHover="hover" whileTap="tap" variants={linkVariants}>
                    <Link to="/cart" className='relative text-3xl' style={{ color: 'black', ...linkStyle }}>
                      <FaCartShopping />
                      <div className='-top-6 -right-6  relative text-white bg-blue-700 h-4 w-4 rounded-full -m-2 text-xs -p-2 text-center'>{cartItems}</div>
                    </Link>
                  </motion.div>
                </>
              )}
              {(user.role === 'caterer' || user.role === 'customer') && (
                <motion.div whileHover="hover" whileTap="tap" variants={linkVariants}>
                  <Link to="/event" className='relative text-2xl' style={{ color: 'black', ...linkStyle }}>
                    <BsCalendarEventFill />
                    <div className='-top-5 -right-6  relative text-white bg-blue-700 h-4 w-4 rounded-full -m-2 text-xs -p-2 text-center'>{eventCount}</div>
                  </Link>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </AnimatePresence>
    </header>
  );
};

export default Header;
