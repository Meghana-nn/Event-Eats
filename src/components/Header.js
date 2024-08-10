import React from 'react';
import { Link } from 'react-router-dom';
import logo from "../assets/Eats_Logo.png";
import { FaCircleUser } from "react-icons/fa6";
import { useAuth } from '../contexts/Auth';
import { BsCalendarEventFill } from "react-icons/bs";
import { motion } from 'framer-motion';

const Header = () => {
  const { user, handleLogout } = useAuth();

  const linkVariants = {
    hover: { scale: 1.1 },
    tap: { scale: 0.9 }
  };

  const linkStyle = {
    textDecoration: 'none',
    color: 'inherit'
  };

  return (
    <header className='fixed shadow-md w-full h-24 px-4 md:px-4 z-1000'>
      {/* desktop */}
      <div className='flex items-center h-full justify-between'>
        <Link to="/">
          <div className='h-20'>
            <img src={logo} className='h-full' alt='logo' />
          </div>
        </Link>
        <div className='flex items-center gap-4 md:gap-7'>
          <nav className='flex gap-4 md:gap-6 text-base md:text-text-lg'>
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
                <Link to="/account" className="text-1xl text-slate-500" style={{ color: 'black', ...linkStyle }}>ACCOUNT</Link>
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
        {user && user.role === 'caterer' && (
          <div className='flex items-center gap-4 md:gap-7'>
            <motion.div whileHover="hover" whileTap="tap" variants={linkVariants}>
              <Link to="/caterer" style={linkStyle}>CatererDashboard</Link>
            </motion.div>
            <motion.div whileHover="hover" whileTap="tap" variants={linkVariants}>
              <Link to="/event" className='relative text-2xl' style={{ color: 'black', ...linkStyle }}>
                <BsCalendarEventFill />
                <div className='-top-5 -right-6  relative text-black bg-blue-700 h-4 w-4 rounded-full -m-2 text-xs -p-2 text-center'>0</div>
              </Link>
            </motion.div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
