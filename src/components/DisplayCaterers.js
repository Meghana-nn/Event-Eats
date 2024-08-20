import React, { useState, useEffect } from 'react';
import { useCaterer } from '../contexts/CatererContext';
import { useCart } from '../contexts/CartContext';
import '../App.css';

function DisplayCaterers() {
  const { caterers, menuItems, updateMenuItems } = useCaterer();
  const { addToCart, cartItems } = useCart();
  const [cartCount, setCartCount] = useState(cartItems.length);

  useEffect(() => {
    updateMenuItems();
  }, []);

  const handleAddToCart = (item) => {
    addToCart(item);
    setCartCount(cartCount + 1);
    alert(`${item.name} added to cart!`);
  };

  const handleClick = (caterer) => {
    alert(`You clicked on caterer "${caterer.name}"`);
  };

  return (
    <>
      <div className='catererItemSection'>
        <h4>Top Caterers</h4>
        <div className='catererCardContainer'>
          {caterers.map((caterer) => {
            const catererMenuItems = menuItems.filter(item => item.catererId === caterer._id);
            return (
              <div className='CatererCard' key={caterer._id} onClick={() => handleClick(caterer)}>
                <div className='CatererCardContent'>
                  <h3>{caterer.name}</h3>
                  <p>Location: {caterer.location}</p>
                  {catererMenuItems.slice(0, 1).map((item) => (
                    <div key={item._id}>
                      <img src={item.menuImages[0]} alt={item.name} className='catererCardImage' />
                      <h3>{item.name}</h3>
                      <p>Price: ${item.amount}</p>
                      <button onClick={(e) => { 
                        e.stopPropagation(); 
                        handleAddToCart(item);
                      }}>
                        Add to Cart
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default DisplayCaterers;
