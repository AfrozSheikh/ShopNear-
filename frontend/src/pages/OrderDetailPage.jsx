import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { orderService } from '../services';
import { formatIndianCurrency, formatIndianDateTime } from '../utils/indianFormatters';
import { showError, showSuccess } from '../utils/toast';

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    try {
      const response = await orderService.getOrderById(orderId);
      setOrder(response.data);
    } catch (error) {
      showError('Failed to load order');
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    
    try {
      await orderService.cancelOrder(orderId);
      showSuccess('Order cancelled successfully');
      loadOrder();
    } catch (error) {
      showError('Failed to cancel order');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="skeleton h-12 w-12 rounded-full"></div>
      </div>
    );
  }

  if (!order) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'badge-success';
      case 'cancelled': return 'badge-danger';
      case 'rejected': return 'badge-danger';
      default: return 'badge-warning';
    }
  };

  return (
    <>
      <Toaster />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Back
        </button>

        <div className="card mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Order Details</h1>
              <p className="text-gray-600">Order ID: {order._id}</p>
              <p className="text-sm text-gray-500">{formatIndianDateTime(order.createdAt)}</p>
            </div>
            <span className={`badge ${getStatusColor(order.status)}`}>
              {order.status.toUpperCase()}
            </span>
          </div>

          {/* Order Items */}
          <div className="border-t pt-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Items</h2>
            <div className="space-y-4">
              {order.items && order.items.map((item, index) => (
                <div key={index} className="flex gap-4 items-center p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-lg">{item.productId?.name || item.name || 'Product'}</p>
                    <p className="text-sm text-gray-600">
                      Quantity: {item.quantity} × {formatIndianCurrency(item.price)}
                    </p>
                  </div>
                  <p className="font-bold text-lg">{formatIndianCurrency(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Info */}
          {order.deliveryAddress && (
            <div className="border-t pt-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p>{order.deliveryAddress.street}</p>
                {order.deliveryAddress.landmark && <p>{order.deliveryAddress.landmark}</p>}
                <p>{order.deliveryAddress.city}, {order.deliveryAddress.state}</p>
                <p>Pincode: {order.deliveryAddress.pincode}</p>
              </div>
            </div>
          )}

          {/* Payment Info */}
          <div className="border-t pt-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method:</span>
                <span className="font-medium">{order.paymentMethod === 'cash' ? 'Cash on Delivery' : 'Online Payment'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Status:</span>
                <span className={`font-medium ${order.paymentStatus === 'paid' ? 'text-green-600' : 'text-orange-600'}`}>
                  {order.paymentStatus.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Total */}
          <div className="border-t pt-6">
            <div className="flex justify-between items-center text-2xl font-bold">
              <span>Total Amount</span>
              <span className="text-primary-600">{formatIndianCurrency(order.totalAmount)}</span>
            </div>
          </div>

          {/* Actions */}
          {order.status === 'pending' && (
            <div className="mt-6 pt-6 border-t">
              <button 
                onClick={handleCancelOrder} 
                className="btn-danger w-full"
              >
                Cancel Order
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default OrderDetailPage;
