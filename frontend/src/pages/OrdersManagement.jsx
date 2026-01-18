import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ArrowLeftIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { orderService, shopService } from '../services';
import { showSuccess, showError } from '../utils/toast';

const OrdersManagement = () => {
  const { shopId } = useParams();
  const navigate = useNavigate();
  const [shop, setShop] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, requested, accepted, completed

  useEffect(() => {
    loadData();
  }, [shopId]);

  const loadData = async () => {
    try {
      const [shopRes, ordersRes] = await Promise.all([
        shopService.getShopById(shopId),
        orderService.getShopOrders(shopId),
      ]);
      setShop(shopRes.data);
      setOrders(ordersRes.data);
    } catch (error) {
      showError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptOrder = async (orderId) => {
    try {
      await orderService.acceptOrder(orderId);
      showSuccess('Order accepted successfully!');
      loadData();
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to accept order');
    }
  };

  const handleRejectOrder = async (orderId) => {
    const reason = prompt('Reason for rejection:');
    if (!reason) return;

    try {
      await orderService.rejectOrder(orderId, { reason });
      showSuccess('Order rejected');
      loadData();
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to reject order');
    }
  };

  const handleCompleteOrder = async (orderId) => {
    try {
      await orderService.completeOrder(orderId);
      showSuccess('Order marked as complete!');
      loadData();
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to complete order');
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

  const filteredOrders = orders.filter((order) => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

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
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/shop-dashboard')}
            className="flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-4"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Back to Shops
          </button>

          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {shop?.name} - Orders
            </h1>
            <p className="text-gray-600">Manage incoming orders</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {['all', 'requested', 'accepted', 'completed', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                filter === status
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              <span className="ml-2 text-sm">
                ({orders.filter((o) => status === 'all' || o.status === status).length})
              </span>
            </button>
          ))}
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="card-elevated text-center py-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Orders</h3>
            <p className="text-gray-600">
              {filter === 'all'
                ? 'No orders yet. They will appear here when customers place orders.'
                : `No ${filter} orders.`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
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
                  </div>
                  <span className={`badge ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                {/* Customer Info */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Customer</h4>
                  <p className="text-sm text-gray-700">
                    Name: {order.customerId?.profile?.name || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-700">
                    Phone: {order.customerId?.profile?.phone || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-700">
                    Email: {order.customerId?.email || 'N/A'}
                  </p>
                </div>

                {/* Order Items */}
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Items</h4>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center bg-white border border-gray-200 rounded-lg p-3"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {item.productId?.name || 'Product'}
                          </p>
                          <p className="text-sm text-gray-500">
                            Quantity: {item.quantity} × ₹{item.price.toFixed(2)}
                          </p>
                        </div>
                        <p className="font-bold text-gray-900">
                          ₹{(item.quantity * item.price).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total Amount */}
                <div className="border-t pt-4 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-primary-600">
                      ₹{order.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Order Type */}
                <div className="mb-4">
                  <span className="text-sm font-medium text-gray-700">
                    Type:{' '}
                    <span className={order.isDelivery ? 'text-blue-600' : 'text-green-600'}>
                      {order.isDelivery ? '🚚 Delivery' : '🏪 Pickup'}
                    </span>
                  </span>
                </div>

                {/* Actions */}
                {order.status === 'requested' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAcceptOrder(order._id)}
                      className="btn-success flex-1 btn-sm flex items-center justify-center gap-2"
                    >
                      <CheckIcon className="w-4 h-4" />
                      Accept Order
                    </button>
                    <button
                      onClick={() => handleRejectOrder(order._id)}
                      className="btn-danger btn-sm flex items-center justify-center gap-2"
                    >
                      <XMarkIcon className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                )}

                {order.status === 'accepted' && (
                  <button
                    onClick={() => handleCompleteOrder(order._id)}
                    className="btn-success w-full btn-sm"
                  >
                    Mark as Complete
                  </button>
                )}

                {order.status === 'rejected' && order.rejectionReason && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
                    <strong>Rejection Reason:</strong> {order.rejectionReason}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default OrdersManagement;
