import React from 'react';

const SuccessPage: React.FC = () => {
  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Payment Successful!</h1>
      <p>Thank you for your purchase!</p>
      <p>Your order has been processed, and you will receive a confirmation email shortly.</p>
      <a href="/" style={{ display: 'inline-block', marginTop: '20px', textDecoration: 'none', padding: '10px 20px', background: '#4CAF50', color: 'white', borderRadius: '5px' }}>
        Go Back to Home
      </a>
    </div>
  );
};

export default SuccessPage;
