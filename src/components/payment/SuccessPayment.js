import React from 'react'
import { useEffect } from 'react'
import axios from 'axios'

function SuccessPayment() {
    useEffect(()=>{
        (async()=>{
            try{
                const stripeId = localStorage.getItem('stripeId')
                const payment = await axios.put(`http://localhost:3010/api/payments/${stripeId}/success`,{paymentStatus:"Successful"})
            }catch(err){
                console.log(err)
            }
        })()
    },[])
    
  return (
    <div><h2>Payment Successful!</h2>
      <p>Thank you for your purchase.</p></div>
  )
}

export default SuccessPayment