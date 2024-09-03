import React, { createContext, useContext } from 'react';

const CartFunctionsContext = createContext();

export const CartFunctionsProvider = ({ children }) => {
  const handleAddMenuItemToCart = (item) => {
    console.log('Item to add to cart:', item);
    if (!item._id || !item.price) {
      console.error('Item does not have an id or price:', item);
      return;
    }
    addItem({ id: item._id, name: item.itemName, price: item.price, ...item });
    setCartCount(cartCount + 1);
    alert(`You added the menu item: ${item.itemName}`);
  };

  const handleAddServiceToCart = (service) => {
    console.log('Service to book:', service);
    if (!service._id || !service.price) {
      console.error('Service does not have an id or price:', service);
      return;
    }
    addItem({ id: service._id, name: service.serviceName, price: service.price, ...service });
    setCartCount(cartCount + 1);
    alert(`You booked the service: ${service.serviceName}`);
  };

  return (
    <CartFunctionsContext.Provider value={{ handleAddMenuItemToCart, handleAddServiceToCart }}>
      {children}
    </CartFunctionsContext.Provider>
  );
};

export const useCartFunctions = () => useContext(CartFunctionsContext);
