import React from 'react';
import { Link } from 'react-router-dom';

function CustomerDashboard() {
  console.log('Current path:', window.location.pathname);

  return (
    <div>
      <h1>Customer Dashboard</h1>
      <nav>
        <ul>
          <li>
            <Link to="/customers-events">Customer Events</Link>
          </li>
          <li>
            <Link to="/customers/events/fetch">Get Customer Events</Link>
          </li>
          <li>
            <Link to="/customers/list/menu">Customer Menu</Link>
          </li>
          
        </ul>
      </nav>
    </div>
  );
}

export default CustomerDashboard;
