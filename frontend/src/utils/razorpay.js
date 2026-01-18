// Razorpay payment utilities

export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const createRazorpayOrder = async (orderDetails) => {
  // This should call your backend API to create Razorpay order
  // Backend will use Razorpay SDK to create order
  
  const response = await fetch('/api/payment/create-order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(orderDetails),
  });

  return await response.json();
};

export const initiateRazorpayPayment = async (orderData, userDetails, onSuccess, onError) => {
  const isScriptLoaded = await loadRazorpayScript();

  if (!isScriptLoaded) {
    onError({ message: 'Failed to load Razorpay SDK' });
    return;
  }

  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
    amount: orderData.amount, // Amount in paise
    currency: 'INR',
    name: 'ShopNear',
    description: orderData.description || 'Order Payment',
    order_id: orderData.razorpayOrderId,
    handler: async function (response) {
      try {
        // Verify payment on backend
        const verifyResponse = await fetch('/api/payment/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            orderId: orderData.orderId,
          }),
        });

        const verifyData = await verifyResponse.json();
        
        if (verifyData.success) {
          onSuccess(verifyData);
        } else {
          onError({ message: 'Payment verification failed' });
        }
      } catch (error) {
        onError(error);
      }
    },
    prefill: {
      name: userDetails.name,
      email: userDetails.email,
      contact: userDetails.phone,
    },
    notes: {
      orderId: orderData.orderId,
    },
    theme: {
      color: '#3b82f6',
    },
    modal: {
      ondismiss: function() {
        onError({ message: 'Payment cancelled by user', cancelled: true });
      },
    },
  };

  const razorpay = new window.Razorpay(options);
  razorpay.open();
};

export const formatRazorpayAmount = (amount) => {
  // Convert rupees to paise (multiply by 100)
  return Math.round(amount * 100);
};

export const parseRazorpayAmount = (paise) => {
  // Convert paise to rupees (divide by 100)
  return paise / 100;
};
