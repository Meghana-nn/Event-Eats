import React, { useState, useRef, useEffect } from 'react';
import { useCart } from 'react-use-cart';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import './Cart.css';
import { useCustomer } from '../contexts/CustomerContext';
import { useCaterer } from '../contexts/CatererContext';
import axios from 'axios';

function Cart() {
  const { addItem, items, totalItems, removeItem, updateItemQuantity } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const { event, setEvent, customerId } = useCustomer();
  const { catererId, setCatererId, services, setServices, menuItems, setMenuItems } = useCaterer();
  const [caterer, setCaterer] = useState(null);

  const selectedEvent = location.state?.selectedEvent;

  useEffect(() => {
    if (selectedEvent) {
      setEvent([selectedEvent]);
      setCaterer(selectedEvent.caterer || null);
      setServices(selectedEvent.services || []);
      setMenuItems(selectedEvent.menuItems || []);
    }
  }, [selectedEvent, setEvent, setServices, setMenuItems]);

  const currentEvent = selectedEvent || (event && event.length > 0 ? event[0] : null);

  const handleAddServiceToCart = (service) => {
    const item = {
      id: service._id,
      name: service.serviceName,
      price: service.price,
      duration: service.duration,
      quantity: 1,
      event: {
        id: currentEvent?._id || '',
        name: currentEvent?.name || '',
        startDate: currentEvent?.startDate || '',
        endDate: currentEvent?.endDate || '',
        location: currentEvent?.location || '',
        noOfPeople: currentEvent?.noOfPeople || 1,
      },
    };
    
    addItem(item);
    console.log('Added Service to Cart:', item);
  };

  const handleAddMenuItemToCart = (menuItem) => {
    const item = {
      id: menuItem._id,
      name: menuItem.name,
      price: menuItem.amount,
      quantity: 1,
      image: menuItem.menuImages[0],
      event: {
        id: currentEvent?._id || '',
        name: currentEvent?.name || '',
        startDate: currentEvent?.startDate || '',
        endDate: currentEvent?.endDate || '',
        location: currentEvent?.location || '',
        noOfPeople: currentEvent?.noOfPeople || 1,
      },
    };
    
    addItem(item);
    console.log('Added Menu Item to Cart:', item);
  };

  const handleRemoveItem = (id) => {
    removeItem(id);
    toast.info('Item has been removed from the cart');
  };

  const handleIncreaseQuantity = (id, quantity) => {
    updateItemQuantity(id, quantity + 1);
  };

  const handleDecreaseQuantity = (id, quantity) => {
    if (quantity > 1) {
      updateItemQuantity(id, quantity - 1);
    } else {
      handleRemoveItem(id);
    }
  };

  
  
  
  
  
  const calculateTotalPrice = () => {
    const eventDurationHours = currentEvent
      ? (new Date(currentEvent.endDate) - new Date(currentEvent.startDate)) / (1000 * 60 * 60)
      : 0;
    console.log('Event Duration Hours:', eventDurationHours);
  
    const totalEventCost = items.reduce((total, item) => {
      if (item.duration) {
        const serviceCost = (item.price / (item.duration || 1)) * eventDurationHours;
        console.log(`Service: ${item.name}, fixed service cost: ${item.price},duration of service :${item.duration}, total Service Cost for event:`, serviceCost);
        return total + serviceCost;
      }
      return total;
    }, 0);
    console.log('Total Event Cost:', totalEventCost);
  
    const totalFoodCost = items.reduce((total, item) => {
      if (!item.duration) {
        const foodCost = item.price * (currentEvent?.noOfPeople || 1) * item.quantity;
        console.log(`Food Item: ${item.name}, Food Cost:`, foodCost);
        return total + foodCost;
      }
      return total;
    }, 0);
    console.log('Total Food Cost:', totalFoodCost);
  
    const totalAmount = totalEventCost + totalFoodCost;
    console.log('Total Amount:', totalAmount);
  
    return {totalAmount,totalEventCost };
  }
  
  const { totalAmount } = calculateTotalPrice();

  const [isSwiping, setIsSwiping] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const circleRef = useRef(null);

  const handleMouseDown = (e) => {
    setIsSwiping(true);
    setStartX(e.clientX);
  };

  const handleMouseMove = (e) => {
    if (isSwiping) {
      const deltaX = e.clientX - startX;
      if (deltaX >= 0 && deltaX <= 300) {
        setCurrentX(deltaX);
        circleRef.current.style.transform = `translateX(${deltaX}px)`;
      }
    }
  };

  const handleMouseUp = async () => {
    setIsSwiping(false);
    if (currentX >= 250) {
      console.log('Items in Cart:', items);
      const {totalAmount,totalEventCost} = calculateTotalPrice();
      
      const cartData = {
        eventId: currentEvent?._id || '',
        eventName: currentEvent?.name || '',
        numberOfPeople: currentEvent?.noOfPeople || 1,
        services: items.filter(item => item.duration).map(service => ({
          _id: service.id,
          name: service.name,
          description: service.description,
          price: service.price,
          totalEventCost
        })),
        menuItems: items.filter(item => !item.duration).map(menuItem => ({
          _id: menuItem.id,
          name: menuItem.name,
          quantity: menuItem.quantity,
          price: menuItem.price,
          image: menuItem.image
        })),
        catererId: catererId || currentEvent?.catererId || '',
        totalEventCost,
        customerId,
        totalAmount
      };

      console.log('Cart Data:', cartData);

      try {
        const response = await axios.post('http://localhost:3010/api/carts', cartData, {
          headers: {
            Authorization: localStorage.getItem('token')
          }
        });

        console.log('Response Data:', response.data);

        const cart = response.data.menuCart;
        let cartId;

        if (cart && cart._id) {
          cartId = cart._id;
          console.log('Final Cart ID before navigating:', cartId);

          toast.success('Cart successfully saved!');
          console.log(cartId, 'at navigation');
          console.log('catererId', catererId);

          navigate('payment', {
            state: {
              items,
              event: currentEvent,
              totalEventCost, 
              totalAmount,
              cartId,
              catererId,
              numberOfPeople: currentEvent?.noOfPeople || 1, // Pass numberOfPeople
              eventName: currentEvent?.name || '' // Pass eventName
            },
          });
        } else {
          console.error('Cart ID not found in response:', response.data);
          toast.error('Failed to save cart');
        }
      } catch (error) {
        console.error('Error saving cart:', error);
        toast.error('Failed to save cart');
      }
      setCurrentX(300);
    } else {
      setCurrentX(0);
      circleRef.current.style.transform = 'translateX(0px)';
    }
  };

  return (
    <div className="cart-menu-container">
      <ToastContainer />
      <div className="cart-details">
        <div className="header-info">
          <p>Total Items: {totalItems}</p>
          {currentEvent ? (
            <h4 className="event-name">{currentEvent.name} - {currentEvent.noOfPeople}</h4>
          ) : (
            <p>No event selected</p>
          )}
        </div>
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td>
                  <div className="item-info">
                    <span className="item-name">{item.name}</span>
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="item-image"
                      />
                    )}
                  </div>
                </td>
                <td>₹{item.price}</td>
                <td>
        {!item.duration ? ( // Check if it's not a service (menu items don't have a duration)
          <>
            <button onClick={() => handleDecreaseQuantity(item.id, item.quantity)}>-</button>
            {item.quantity}
            <button onClick={() => handleIncreaseQuantity(item.id, item.quantity)}>+</button>
          </>
        ) : (
          <span><i>no quantity</i></span> // For services, just show a quantity of 1
        )}
      </td>
                <td>
                  <button className="remove-button" onClick={() => handleRemoveItem(item.id)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="total-price">
        <h4>Total Price: ₹{totalAmount}</h4>
        </div>
      </div>

      <div className="pay-button-container">
        <div
          className="pay-button"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <div className="pay-circle" ref={circleRef}></div>
          <span className="pay-text">Swipe to Pay</span>
        </div>
      </div>
    </div>
  );
}

export default Cart;
