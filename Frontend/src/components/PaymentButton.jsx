import React from "react";
import axios from "axios";

const PaymentButton = ({ amount,label,className})=>
    {
    const loadRazorpayScript = () => 
        {
        return new Promise((resolve) => 
            {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => 
                {
                resolve(true);
            };
            script.onerror = () => 
                {
                resolve(false);
            };
            document.body.appendChild(script);
        });
    };
    const handlePayment = async () => {
  try {
    const res = await loadRazorpayScript();
    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }
    // create order on the server
    const response = await axios.post("/api/payment/create-order", {
      amount: amount,
      currency: "INR",
    });
    const { id: orderId, amount: orderAmount, currency } = response.data.order;
    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID,
      amount: orderAmount,
      currency,
      name: "TarkVitark",
      description: `Payment for ${label}`,
      order_id: orderId, // should be order_id, not orderId
      handler: function (response) {
        alert("Payment Successful");
        console.log(response);
      },
      prefill: {
        name: 'Customer Name',
        email: 'customer@example.com',
        contact: '9123456789',
      },
      theme: {
        color: '#3399cc',
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (error) {
    console.error('Payment error:', error);
    alert('Payment failed. Please try again.');
  }
};

  return (
    <button
      onClick={handlePayment}
      className={className}
    >
      Pay ₹{amount} ({label})
    </button>
  );
};

export default PaymentButton;