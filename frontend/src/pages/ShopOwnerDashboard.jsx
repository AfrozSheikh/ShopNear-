import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { PlusIcon, BuildingStorefrontIcon } from '@heroicons/react/24/outline';
import { shopService } from '../services';
import { showSuccess, showError } from '../utils/toast';
import CreateShopModal from '../components/shop/CreateShopModal';
import { useNavigate } from 'react-router-dom';

const ShopOwnerDashboard = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadShops();
  }, []);

  const loadShops = async () => {
    try {
      const response = await shopService.getMyShops();
      setShops(response.data);
    } catch (error) {
      showError ('Failed to load shops');
      console.error('Failed to load shops:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShopCreated = (newShop) => {
    setShops([...shops, newShop]);
    setShowCreateModal(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="skeleton h-12 w-12 rounded-full mb-4 mx-auto"></div>
          <div className="skeleton h-4 w-32 mb-2"></div>
          <div className="skeleton h-4 w-24"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">My Shops</h1>
            <p className="text-gray-600">Manage your shops, products, and orders</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <PlusIcon className="w-5 h-5" />
            Create New Shop
          </button>
        </div>

        {/* Shops Grid */}
        {shops.length === 0 ? (
          <div className="card-elevated text-center py-16 animate-fade-in">
            <BuildingStorefrontIcon className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Shops Yet</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Create your first shop to start selling products and managing orders
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary"
            >
              <PlusIcon className="w-5 h-5 inline mr-2" />
              Create Your First Shop
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shops.map((shop) => (
              <div
                key={shop._id}
                className="card-elevated group hover:shadow-glow transition-all duration-300"
              >
                {/* Status Badge */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">
                      {shop.name}
                    </h3>
                    <p className="text-sm text-gray-500">{shop.category}</p>
                  </div>
                  <span className={`badge ${getStatusColor(shop.verificationStatus)} text-xs uppercase`}>
                    {shop.verificationStatus}
                  </span>
                </div>

                {/* Description */}
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {shop.description}
                </p>

                {/* Shop Details */}
                <div className="border-t border-gray-100 pt-4 space-y-2 mb-4">
                  <div className="flex items-start gap-2 text-sm">
                    <span className="text-gray-500">📍</span>
                    <span className="text-gray-700">
                      {shop.address.street}, {shop.address.city}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-500">📞</span>
                    <span className="text-gray-700">{shop.phone}</span>
                  </div>
                  {shop.deliveryEnabled && (
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <span>🚚</span>
                      <span>Delivery: {shop.deliveryRadius} km radius</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/shop/${shop._id}/products`)}
                    className="btn-primary flex-1 btn-sm"
                    disabled={shop.verificationStatus !== 'approved'}
                  >
                    Products
                  </button>
                  <button
                    onClick={() => navigate(`/shop/${shop._id}/orders`)}
                    className="btn-secondary flex-1 btn-sm"
                    disabled={shop.verificationStatus !== 'approved'}
                  >
                    Orders
                  </button>
                </div>

                {shop.verificationStatus === 'pending' && (
                  <p className="text-xs text-yellow-600 mt-3 text-center">
                    ⏳ Awaiting admin verification
                  </p>
                )}
                {shop.verificationStatus === 'rejected' && (
                  <p className="text-xs text-red-600 mt-3 text-center">
                    ❌ Rejected: {shop.rejectionReason}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Create Shop Modal */}
        <CreateShopModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onShopCreated={handleShopCreated}
        />
      </div>
    </>
  );
};

export default ShopOwnerDashboard;
