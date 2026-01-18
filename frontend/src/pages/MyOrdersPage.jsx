import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import { orderService } from '../services';
import { showError } from '../utils/toast';

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await orderService.getMyOrders();
      setOrders(response.data);
    } catch (error) {
      showError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'requested':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="skeleton h-12 w-12 rounded-full"></div>
      </div>
    );
  }

  return (
    <>
      <Toaster />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="card-elevated text-center py-16">
            <ShoppingBagIcon className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Orders Yet</h3>
            <p className="text-gray-600">Your orders will appear here</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="card-elevated">
                {/* Order Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Order #{order.orderNumber}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Shop: {order.shopId?.name || 'Unknown'}
                    </p>
                  </div>
                  <span className={`badge ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                {/* Order Items */}
                <div className="border-t border-b py-4 mb-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Items</h4>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center text-sm"
                      >
                        <span className="text-gray-700">
                          {item.productId?.name || 'Product'} × {item.quantity}
                        </span>
                        <span className="font-medium text-gray-900">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Total */}
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-primary-600">
                    ₹{order.totalAmount.toFixed(2)}
                  </span>
                </div>

                {/* Order Type */}
                <div className="text-sm text-gray-600 mb-4">
                  <span className={order.isDelivery ? 'text-blue-600' : 'text-green-600'}>
                    {order.isDelivery ? '🚚 Delivery' : '🏪 Pickup'}
                  </span>
                </div>

                {/* Status Timeline */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm">
                    {order.status === 'requested' && (
                      <p className="text-yellow-700">⏳ Waiting for shop to accept</p>
                    )}
                    {order.status === 'accepted' && (
                      <p className="text-blue-700">✓ Shop is preparing your order</p>
                    )}
                    {order.status === 'completed' && (
                      <p className="text-green-700">✓ Order completed</p>
                    )}
                    {order.status === 'rejected' && order.rejectionReason && (
                      <p className="text-red-700">
                        ✗ Rejected: {order.rejectionReason}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default MyOrdersPage;
