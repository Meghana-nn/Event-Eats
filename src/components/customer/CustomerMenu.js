import React, { useEffect, useState } from 'react';
import { useCaterer } from '../../contexts/CatererContext';
import { useCart } from '../../contexts/CartContext';
import '../customer/Customer.css';

function CustomerMenu() {
  const {
    caterers,
    fetchAllCaterers,
    fetchMenuItems,
    menuItems,
    fetchServices,
    services
  } = useCaterer();

  const { addToCart, cartItems } = useCart();
  const [cartCount, setCartCount] = useState(cartItems);
  const [selectedCaterer, setSelectedCaterer] = useState(
    JSON.parse(localStorage.getItem('selectedCaterer')) || null
  );
  const [catererImages, setCatererImages] = useState({});
  const [catererMenuDetails, setCatererMenuDetails] = useState({});

  useEffect(() => {
    fetchAllCaterers();
  }, []);

  useEffect(() => {
    if (selectedCaterer) {
      fetchMenuItems(selectedCaterer._id);
      fetchServices(selectedCaterer._id);
      localStorage.setItem('selectedCaterer', JSON.stringify(selectedCaterer));
    }
  }, [selectedCaterer]);

  useEffect(() => {
    if (menuItems.length > 0 && selectedCaterer) {
      setCatererImages(prevImages => ({
        ...prevImages,
        [selectedCaterer._id]: menuItems[0].menuImages[0]
      }));
      setCatererMenuDetails(prevDetails => ({
        ...prevDetails,
        [selectedCaterer._id]: {
          name: menuItems[0].name,
          amount: menuItems[0].amount
        }
      }));
    }
  }, [menuItems, selectedCaterer]);

  const handleCatererClick = (caterer) => {
    setSelectedCaterer(caterer);
  };

  const handleServiceAction = (service) => {
    alert(`You booked the service: ${service.serviceName}`);
    // Additional actions like adding to cart or booking logic
  };

  const handleAddToCart = (item) => {
    addToCart(item);
    setCartCount(cartCount + 1);
    alert(`${item.name} added to cart!`);
  };

  return (
    <div className="customer-menu-container">
      <div className="customerSidebar">
        <ul>
          {caterers.map((caterer) => (
            <li key={caterer._id} className="caterer-list-item" onClick={() => handleCatererClick(caterer)}>
              <div className="caterer-card">
                <h2>{caterer.name}</h2>
                {catererImages[caterer._id] && (
                  <>
                    <img src={catererImages[caterer._id]} alt={caterer.name} className='catererCardImage' />
                    <p>{catererMenuDetails[caterer._id]?.name}</p>
                    <p>Price: ${catererMenuDetails[caterer._id]?.amount}</p>
                    <button onClick={(e) => { 
                      e.stopPropagation(); 
                      handleAddToCart(menuItems[0]);
                    }}>
                      Add to Cart
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="main-content">
        {selectedCaterer && (
          <div className="sectionOne">
            <div className="caterer-card">
              <h2>{selectedCaterer.name}</h2>
              <p>Location: {selectedCaterer.location}</p>
              <p>Categories: {selectedCaterer.categories.join(', ')}</p>
              <p>Cuisines: {selectedCaterer.cuisines.join(', ')}</p>
              <p>Vegetarian: {selectedCaterer.isVeg ? 'Yes' : 'No'}</p>
              <p>Verified: {selectedCaterer.isVerified ? 'Yes' : 'No'}</p>
            </div>
          </div>
        )}
        <div className="sectionTwo">
          <h4>Services</h4>
          <div className="services-container">
          {services.map(service => (
            <div key={service._id} className="service-card">
              <h3>{service.serviceName}</h3>
              <p>Description: {service.description}</p>
              <p>Price: ${service.price}</p>
              <p>Duration: {service.duration} hours</p>
              <p>Category: {service.category}</p>
              <button className="service-button" onClick={() => handleServiceAction(service)}>
                  Book Service
                </button>
            </div>
          ))}
        </div>
        </div>
        <div className="sectionThree">
          <h4>Menu Items</h4>
          <div className="menu-items-container">
            {menuItems.map(item => (
              <div key={item._id} className="menu-item-card">
                <h3>{item.name}</h3>
                <p>Price: ${item.amount}</p>
                <img src={item.menuImages[0]} alt={item.name} className='menuItemImage' />
                <button onClick={() => handleAddToCart(item)}>Add to Cart</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerMenu;
