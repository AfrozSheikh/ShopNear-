import { useState } from 'react';
import { CreditCardIcon, BanknotesIcon } from '@heroicons/react/24/outline';
import { showSuccess, showError, showLoading, dismissToast } from '../utils/toast';

const PaymentModal = ({ isOpen, onClose, amount, orderId, onSuccess }) => {
  const [paymentMethod, setPaymentMethod] = useState('razorpay'); // razorpay or cod
  const [processing, setProcessing] = useState(false);

  if (!isOpen) return null;

  const handleRazorpayPayment = async () => {
    setProcessing(true);
    const toastId = showLoading('Processing payment...');

    try {
      // TODO: Replace with actual Razorpay integration
      // This is a placeholder for the Razorpay flow
      
      // Step 1: Create order on backend
      // const orderResponse = await paymentService.createRazorpayOrder({ orderId, amount });
      
      // Step 2: Initialize Razorpay
      /*
      const options = {
        key: 'YOUR_RAZORPAY_KEY',
        amount: amount * 100, // Amount in paise
        currency: 'INR',
        name: 'ShopNear',
        description: `Order #${orderId}`,
        order_id: orderResponse.data.razorpayOrderId,
        handler: async function (response) {
          // Verify payment on backend
          const verification = await paymentService.verifyPayment({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            orderId,
          });
          
          if (verification.data.success) {
            showSuccess('Payment successful!');
            onSuccess();
          }
        },
        prefill: {
          name: 'Customer Name',
          email: 'customer@example.com',
          contact: '9999999999',
        },
        theme: {
          color: '#3b82f6',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      */

      // Simulating payment success
      await new Promise(resolve => setTimeout(resolve, 2000));
      showSuccess('Payment successful!');
      onSuccess();
      onClose();
    } catch (error) {
      showError('Payment failed. Please try again.');
    } finally {
      dismissToast(toastId);
      setProcessing(false);
    }
  };

  const handleCOD = async () => {
    setProcessing(true);
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      showSuccess('Order placed with Cash on Delivery!');
      onSuccess();
      onClose();
    } catch (error) {
      showError('Failed to place order');
    } finally {
      setProcessing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (paymentMethod === 'razorpay') {
      await handleRazorpayPayment();
    } else {
      await handleCOD();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment</h2>

        <form onSubmit={handleSubmit}>
          {/* Order Summary */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700">Order ID</span>
              <span className="font-medium text-gray-900">#{orderId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Total Amount</span>
              <span className="text-2xl font-bold text-primary-600">₹{amount.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="space-y-3 mb-6">
            <button
              type="button"
              onClick={() => setPaymentMethod('razorpay')}
              className={`w-full p-4 border-2 rounded-xl transition-all ${
                paymentMethod === 'razorpay'
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <CreditCardIcon className="w-6 h-6 text-primary-600" />
                <div className="text-left">
                  <div className="font-semibold text-gray-900">Online Payment</div>
                  <div className="text-sm text-gray-600">Pay via Razorpay (Cards, UPI, Wallets)</div>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('cod')}
              className={`w-full p-4 border-2 rounded-xl transition-all ${
                paymentMethod === 'cod'
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <BanknotesIcon className="w-6 h-6 text-green-600" />
                <div className="text-left">
                  <div className="font-semibold text-gray-900">Cash on Delivery</div>
                  <div className="text-sm text-gray-600">Pay when you receive</div>
                </div>
              </div>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
              disabled={processing}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex-1"
              disabled={processing}
            >
              {processing ? 'Processing...' : paymentMethod === 'razorpay' ? 'Pay Now' : 'Confirm Order'}
            </button>
          </div>

          {paymentMethod === 'razorpay' && (
            <div className="mt-4 text-xs text-gray-500 text-center">
              Secured by Razorpay • Your payment information is safe
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;
