// // src/components/CheckoutForm.js
// import React, { useState } from 'react';
// import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import './Payment.css';

// function CheckoutForm({ items, event, totalAmount, cartId }) {
//   const stripe = useStripe();
//   const elements = useElements();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     if (!stripe || !elements) {
//       return;
//     }

//     try {
//       // Create a payment session on the backend
//       const { data } = await axios.post('http://localhost:3010/api/payments', {
//         headers:{
//             Authorization:localStorage.getItem('token')
//         }
//       },{
//         menuCartId: cartId,
//         amount: totalAmount * 100, // Convert amount to cents
//         customerId: event.customerId,
//       });

//       const { clientSecret } = data;

//       // Confirm the card payment
//       const paymentResult = await stripe.confirmCardPayment(clientSecret, {
//         payment_method: {
//           card: elements.getElement(CardElement),
//           billing_details: {
//             name: event.customerId,
//           },
//         },
//       });

//       if (paymentResult.error) {
//         setError(paymentResult.error.message);
//       } else {
//         if (paymentResult.paymentIntent.status === 'succeeded') {
//           // Payment successful
//           navigate('/success/payment');
//         } else {
//           setError('Payment failed');
//         }
//       }
//     } catch (err) {
//       setError('Payment error. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="checkout-form">
//       <CardElement className="card-element" />
//       {error && <div className="error-message">{error}</div>}
//       <button type="submit" className="pay-button" disabled={!stripe || loading}>
//         {loading ? 'Processing...' : 'Pay Now'}
//       </button>
//     </form>
//   );
// }

// export default CheckoutForm;
