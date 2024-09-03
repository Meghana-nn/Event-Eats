import React, { useEffect, useState } from 'react';
import { useCaterer } from '../../contexts/CatererContext';
import { useCart } from 'react-use-cart';
import { useNavigate } from 'react-router-dom';

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

  const { addItem } = useCart();
  const [cartCount, setCartCount] = useState(0);
  const [selectedCaterer, setSelectedCaterer] = useState(
    JSON.parse(localStorage.getItem('selectedCaterer')) || null
  );
  const [catererImages, setCatererImages] = useState({});
  const [catererMenuDetails, setCatererMenuDetails] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllCaterers();
  }, [fetchAllCaterers]);

  useEffect(() => {
    if (selectedCaterer) {
      fetchMenuItems(selectedCaterer._id);
      fetchServices(selectedCaterer._id);
      localStorage.setItem('selectedCaterer', JSON.stringify(selectedCaterer));
    }
  }, [selectedCaterer, fetchMenuItems, fetchServices]);

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

  const handleAddCatererToEvent = (caterer) => {
    console.log('Caterer to add to event:', caterer);
    if (!caterer._id || !caterer.name) {
        console.error('Caterer does not have an id or name:', caterer);
        return;
    }
    // Save the caterer details for the event
    localStorage.setItem('eventCaterer', JSON.stringify(caterer));
    alert(`${caterer.name} is set for the event!`);
  };

  const handleAddServiceToCart = (service) => {
    console.log('Service to book:', service);
    if (!service._id || !service.price) {
        console.error('Service does not have an id or price:', service);
        return;
    }
    addItem({ id: service._id, name: service.serviceName, price: service.price,...service });
    setCartCount(cartCount + 1);
    alert(`You booked the service: ${service.serviceName}`);
  };

  const handleAddMenuItemToCart = (item) => {
    console.log('Item to add to cart:', item);

    // Check if item has necessary properties
    if (!item._id || !item.amount || !item.menuImages || item.menuImages.length === 0) {
        console.error('Item does not have an id, price, or images:', item);
        return;
    }

    // Construct the cart item with the selected image
    const cartItem = {
        id: item._id,
        name: item.name,
        price: item.amount,
        quantity: 1, // Default quantity is 1
        image: item.menuImages[0] // Use the selected menu item's image
    };

    // Add item to the cart
    addItem(cartItem);
    setCartCount(cartCount + 1);
    alert(`${item.name} added to cart!`);
};


  const handleNavigateToEvent = () => {
    if (selectedCaterer) {
    // Navigate manually with the state
    navigate('/customers-events', {
     
      state: {
        catererId: selectedCaterer._id,
        caterer: selectedCaterer ? selectedCaterer._id : null,
        services: services.filter(service => service._id),
        menuItems: menuItems.filter(item => item._id)
      }
    });
  }else {
    alert("Please select a caterer before proceeding.");
  }
};

  return (
    <div className="customer-menu-container">
      <div className="customerSidebar">
        <ul>
          {caterers.map((caterer) => (
            <li key={caterer._id} className="caterer-list-item" onClick={() => handleCatererClick(caterer)}>
              <div className="caterer-card">
                <h4>{caterer.name}</h4>
                {catererImages[caterer._id] && (
                  <>
                    <img src={catererImages[caterer._id]} alt={caterer.name} className='catererCardImage' />
                    <button onClick={(e) => { 
                      e.stopPropagation(); 
                      handleAddCatererToEvent(caterer);
                    }}>
                      Add Caterer
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
              <h3>{selectedCaterer.name}</h3>
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
                <button className="service-button" onClick={() => handleAddServiceToCart(service)}>
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
                <button onClick={() => handleAddMenuItemToCart(item)}>Add to Cart</button>
              </div>
            ))}
          </div>
        </div>
        <button className="navigate-button" onClick={handleNavigateToEvent}>
          Go to Event Page
        </button>
      </div>
      
    </div>
  );
}

export default CustomerMenu;
