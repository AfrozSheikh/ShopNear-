import { useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { TrashIcon, MinusIcon, PlusIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { useCart } from '../context/CartContext';
import { showSuccess } from '../utils/toast';

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, clearCart, getCartTotal, getItemsByShop } = useCart();

  const handleCheckout = () => {
    if (cart.length === 0) return;
    navigate('/checkout');
  };

  const handleClearCart = () => {
    if (confirm('Are you sure you want to clear your cart?')) {
      clearCart();
      showSuccess('Cart cleared');
    }
  };

  const shopGroups = getItemsByShop();

  if (cart.length === 0) {
    return (
      <>
        <Toaster />
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="card-elevated text-center py-16">
            <ShoppingBagIcon className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Cart is Empty</h2>
            <p className="text-gray-600 mb-8">Add products to your cart to get started</p>
            <button onClick={() => navigate('/search')} className="btn-primary">
              Browse Products
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Toaster />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
            <p className="text-gray-600">{cart.length} items in your cart</p>
          </div>
          <button onClick={handleClearCart} className="btn-secondary btn-sm">
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {shopGroups.map((shop) => (
              <div key={shop.shopId} className="card">
                {/* Shop Header */}
                <div className="border-b pb-3 mb-4">
                  <h3 className="text-lg font-bold text-gray-900">{shop.shopName}</h3>
                  <p className="text-sm text-gray-500">{shop.items.length} items</p>
                </div>

                {/* Shop Items */}
                <div className="space-y-4">
                  {shop.items.map((item) => (
                    <div key={item.productId} className="flex gap-4 pb-4 border-b last:border-b-0">
                      {/* Product Image */}
                      <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <span className="text-3xl">📦</span>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">{item.name}</h4>
                        <p className="text-sm text-gray-500 mb-2">
                          ₹{item.price.toFixed(2)} / {item.unit}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                              className="p-2 hover:bg-gray-100 transition-colors"
                            >
                              <MinusIcon className="w-4 h-4" />
                            </button>
                            <span className="px-4 py-2 font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              className="p-2 hover:bg-gray-100 transition-colors"
                            >
                              <PlusIcon className="w-4 h-4" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.productId)}
                            className="text-red-600 hover:text-red-700 p-2"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      {/* Item Total */}
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card-elevated sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h3>

              <div className="space-y-3 mb-6">
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

              <button onClick={handleCheckout} className="btn-primary w-full mb-3">
                Proceed to Checkout
              </button>

              <button
                onClick={() => navigate('/search')}
                className="btn-secondary w-full"
              >
                Continue Shopping
              </button>

              <div className="mt-6 text-sm text-gray-600">
                <p className="mb-2">💳 Secure checkout</p>
                <p className="mb-2">🚚 Free delivery on all orders</p>
                <p>📦 Products from {shopGroups.length} shop{shopGroups.length > 1 ? 's' : ''}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartPage;
