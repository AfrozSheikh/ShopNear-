import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useCart } from '../context/CartContext';
import { orderService } from '../services';
import { showSuccess, showError } from '../utils/toast';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, getItemsByShop, getCartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [orderType, setOrderType] = useState('pickup'); // pickup or delivery

  const handlePlaceOrder = async (shop) => {
    setLoading(true);
    try {
      const orderData = {
        shopId: shop.shopId,
        items: shop.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
        isDelivery: orderType === 'delivery',
      };

      const response = await orderService.createOrder(orderData);
      showSuccess(`Order placed successfully! Order #${response.data.orderNumber}`);
      
      // Remove ordered items from cart
      shop.items.forEach((item) => {
        const index = cart.findIndex((c) => c.productId === item.productId);
        if (index > -1) cart.splice(index, 1);
      });
      
      // If cart is now empty, clear it completely
      if (cart.length === 0) {
        clearCart();
      }
      
      // Navigate to orders page after a short delay
      setTimeout(() => {
        navigate('/my-orders');
      }, 1500);
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const shopGroups = getItemsByShop();

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <>
      <Toaster />
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <button
          onClick={() => navigate('/cart')}
          className="flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Back to Cart
        </button>

        <h1 className="text-4xl font-bold text-gray-900 mb-8">Checkout</h1>

        {/* Order Type Selection */}
        <div className="card mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Order Type</h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setOrderType('pickup')}
              className={`p-4 border-2 rounded-xl transition-all ${
                orderType === 'pickup'
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-3xl mb-2">🏪</div>
              <div className="font-semibold">Pickup</div>
              <div className="text-sm text-gray-600">Collect from shop</div>
            </button>

            <button
              onClick={() => setOrderType('delivery')}
              className={`p-4 border-2 rounded-xl transition-all ${
                orderType === 'delivery'
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-3xl mb-2">🚚</div>
              <div className="font-semibold">Delivery</div>
              <div className="text-sm text-gray-600">Delivered to you</div>
            </button>
          </div>
        </div>

        {/* Orders by Shop */}
        <div className="space-y-6">
          {shopGroups.map((shop) => {
            const shopTotal = shop.items.reduce(
              (sum, item) => sum + item.price * item.quantity,
              0
            );

            return (
              <div key={shop.shopId} className="card">
                {/* Shop Header */}
                <div className="border-b pb-4 mb-4">
                  <h3 className="text-lg font-bold text-gray-900">{shop.shopName}</h3>
                  <p className="text-sm text-gray-500">{shop.items.length} items</p>
                </div>

                {/* Items */}
                <div className="space-y-3 mb-4">
                  {shop.items.map((item) => (
                    <div key={item.productId} className="flex justify-between items-center">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          {item.quantity} × ₹{item.price.toFixed(2)}
                        </p>
                      </div>
                      <p className="font-semibold text-gray-900">
                        ₹{(item.quantity * item.price).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Shop Total */}
                <div className="border-t pt-4 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">Shop Total</span>
                    <span className="text-xl font-bold text-primary-600">
                      ₹{shopTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Place Order Button */}
                <button
                  onClick={() => handlePlaceOrder(shop)}
                  disabled={loading}
                  className="btn-primary w-full disabled:opacity-50"
                >
                  {loading ? 'Placing Order...' : `Place Order from ${shop.shopName}`}
                </button>

                <p className="text-xs text-gray-500 mt-3 text-center">
                  {orderType === 'delivery'
                    ? '🚚 Delivery charges may apply'
                    : '🏪 Pickup from shop location'}
                </p>
              </div>
            );
          })}
        </div>

        {/* Total Summary */}
        <div className="card-elevated mt-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-gray-700">
              <span>Subtotal</span>
              <span>₹{getCartTotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Delivery</span>
              <span className="text-green-600">FREE</span>
            </div>
            <div className="border-t pt-3 flex justify-between items-center">
              <span className="text-lg font-bold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-primary-600">
                ₹{getCartTotal().toFixed(2)}
              </span>
            </div>
          </div>

          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> You'll place separate orders for each shop. Each shop owner will accept/reject your order individually.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;
