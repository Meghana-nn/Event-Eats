import { loadStripe } from '@stripe/stripe-js';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCustomer } from '../../contexts/CustomerContext';
import { useEffect, useState } from 'react';
import axios from 'axios';
import './Payment.css'; // Import the CSS file

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);


function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { customerId } = useCustomer();
  const [menuCart, setMenuCart] = useState(null);
  const [loading, setLoading] = useState(true);

  // Retrieve cartId from location state
  const { cartId } = location.state || {};

  useEffect(() => {
    const fetchMenuCart = async () => {
      if (!cartId) {
        console.error('Cart ID is null or undefined');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3010/api/carts/${cartId}`);
        console.log('API Response:', response.data);
        if (response.data.menuCart) {
          setMenuCart(response.data.menuCart); // Ensure it's a single object
        } else {
          console.error('No menu cart data found');
        }
      } catch (err) {
        console.error('Failed to fetch menu cart:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuCart();
  }, [cartId]);

  const handlePayment = async () => {
    if (!menuCart) return;

    try {
      const stripe = await stripePromise;

      console.log('Menu Cart Data Sent to Server:', menuCart);

      const response = await axios.post("http://localhost:3010/api/create-checkout-session", {
        menuCartId: menuCart._id, 
        amount: menuCart.totalAmount,
        totalEventCost: menuCart.totalEventCost, // Add totalEventCost here
        customerId: customerId,
        menuCart: menuCart, 
        catererId: menuCart.catererId,
        noOfPeople: menuCart.noOfPeople
      });
      console.log('Stripe Response:', response);

      if (response.data.error) {
        throw new Error('Failed to create checkout session');
      }

      const session = response.data;
      console.log('Stripe Session Data:', session);

      const result = await stripe.redirectToCheckout({
        sessionId: session.id
      });

      if (result.error) {
        console.error(result.error.message);
      }
    } catch (err) {
      console.error('Error during payment:', err);
    }
  };

  return (
    <div className="payment-table-container">
      <h2>Payment</h2>
      {loading ? (
        <p>Loading menu cart details...</p>
      ) : menuCart ? (
        <div>
          <h3>Order Summary for Event: {menuCart.eventName}</h3>
          <table className="payment-table">
            <thead>
              <tr>
                <th>Menu Item</th>
                <th>Quantity</th>
                <th>Price (₹)</th>
              </tr>
            </thead>
            <tbody>
              {menuCart.menuItems && menuCart.menuItems.length > 0 ? (
                menuCart.menuItems.map(item => (
                  <tr key={item._id}>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>{item.amount}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">No menu items found</td>
                </tr>
              )}
              {menuCart.services && menuCart.services.length > 0 ? (
                menuCart.services.map(service => (
                  <tr key={service._id}>
                    <td>{service.name}</td>
                    <td>1</td>
                    <td>{service.price}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">No services found</td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="payment-summary">
            <p>Number of People: {menuCart.noOfPeople || 1}</p>
            <p>Total Event Cost: ₹{menuCart.totalEventCost}</p> {/* Display total event cost */}
            <p>Total Amount: ₹{menuCart.totalAmount}</p> {/* Display total amount from response */}
          </div>
        </div>
      ) : (
        <p>No menu cart data available</p>
      )}
      <button onClick={handlePayment} disabled={!menuCart}>
        Confirm 👻
      </button>
    </div>
  );
}

export default Payment;
