import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/Auth';
import 'bootstrap/dist/css/bootstrap.min.css';

// const store=configureStore()
// console.log(store)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthProvider>
   
     <BrowserRouter>
       <App/>
     </BrowserRouter>
    
  </AuthProvider>
); 

