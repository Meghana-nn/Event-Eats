// src/components/Cart.js
import React from 'react';
import { useCart } from '../contexts/CartContext';

function Cart() {
  const { cartItems, removeFromCart } = useCart();

  return (
    <div>
      <h1>Your Cart</h1>
      {cartItems.length > 0 ? (
        cartItems.map((item, index) => (
          <div key={index}>
            <p>Event ID: {item.eventId}</p>
            <p>Item ID: {item.itemId}</p>
            <p>User ID: {item.userId}</p>
            {item.catererId && <p>Caterer ID: {item.catererId}</p>}
            {item.services && item.services.length > 0 && (
              <>
                <h3>Services:</h3>
                {item.services.map((service, idx) => (
                  <div key={idx}>
                    <p>Name: {service.name}</p>
                    <p>Description: {service.description}</p>
                    <p>Price: ${service.price}</p>
                  </div>
                ))}
              </>
            )}
            {item.menuItems && item.menuItems.length > 0 && (
              <>
                <h3>Menu Items:</h3>
                {item.menuItems.map((menuItem, idx) => (
                  <div key={idx}>
                    <p>Name: {menuItem.name}</p>
                    <p>Quantity: {menuItem.quantity}</p>
                    <p>Price: ${menuItem.price}</p>
                  </div>
                ))}
              </>
            )}
            <button onClick={() => removeFromCart(item.id)}>Remove</button>
          </div>
        ))
      ) : (
        <p>Your cart is empty</p>
      )}
    </div>
  );
}

export default Cart;
