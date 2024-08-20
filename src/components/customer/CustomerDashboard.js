import React from 'react';
import { Routes, Route ,Link} from 'react-router-dom';
// import { CustomerProvider } from '../../contexts/CustomerContext'; // Import CustomerProvider
import CustomerEvents from './CustomerEvents'; // Import your component
import CustomerEventList from './CustomerEventList'; // Import your component

function CustomerDashboard() {
  return (
   
      <div>
        
        <Link to="customers/events">customer event</Link> ||
        <Link to="customers/events/fetch">get customer Event</Link>||
        <Link to={`/customers`} className="text-2xl text-slate-500" style={{ color: 'black', }}></Link>
        <Link to="carts">cart</Link>

        <Routes>
          <Route path="customers/events" element={<CustomerEvents />} />
          <Route path="customers/events/fetch" element={<CustomerEventList />} />
        </Routes >
      </div>
    
  );
}

export default CustomerDashboard;
