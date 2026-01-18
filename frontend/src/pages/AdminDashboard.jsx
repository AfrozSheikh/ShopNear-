import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { CheckIcon, XMarkIcon, ClockIcon } from '@heroicons/react/24/outline';
import { shopService } from '../services';
import { showSuccess, showError } from '../utils/toast';

const AdminDashboard = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending'); // all, pending, approved, rejected
  const [selectedShop, setSelectedShop] = useState(null);

  useEffect(() => {
    loadShops();
  }, []);

  const loadShops = async () => {
    try {
      const response = await shopService.getAllShops();
      console.log(response);
      
      setShops(response.data);
    } catch (error) {
      showError('Failed to load shops');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (shopId) => {
    try {
      await shopService.verifyShop(shopId, 'approve');
      showSuccess('Shop approved successfully!');
      loadShops();
      setSelectedShop(null);
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to approve shop');
    }
  };

  const handleReject = async (shopId) => {
    const reason = prompt('Reason for rejection:');
    if (!reason) return;

    try {
      await shopService.verifyShop(shopId, 'reject', reason);
      showSuccess('Shop rejected');
      loadShops();
      setSelectedShop(null);
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to reject shop');
    }
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

  const filteredShops = shops.filter((shop) => {
    if (filter === 'all') return true;
    return shop.verificationStatus === filter;
  });

  const stats = {
    total: shops.length,
    pending: shops.filter((s) => s.verificationStatus === 'pending').length,
    approved: shops.filter((s) => s.verificationStatus === 'approved').length,
    rejected: shops.filter((s) => s.verificationStatus === 'rejected').length,
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
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage shop verifications and platform</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card-elevated">
            <div className="text-sm text-gray-600 mb-1">Total Shops</div>
            <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
          </div>
          <div className="card-elevated">
            <div className="text-sm text-gray-600 mb-1">Pending</div>
            <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
          </div>
          <div className="card-elevated">
            <div className="text-sm text-gray-600 mb-1">Approved</div>
            <div className="text-3xl font-bold text-green-600">{stats.approved}</div>
          </div>
          <div className="card-elevated">
            <div className="text-sm text-gray-600 mb-1">Rejected</div>
            <div className="text-3xl font-bold text-red-600">{stats.rejected}</div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {['all', 'pending', 'approved', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === status
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Shops List */}
        {filteredShops.length === 0 ? (
          <div className="card-elevated text-center py-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Shops</h3>
            <p className="text-gray-600">
              {filter === 'all'
                ? 'No shops registered yet'
                : `No ${filter} shops`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredShops.map((shop) => (
              <div key={shop._id} className="card-elevated">
                {/* Shop Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{shop.name}</h3>
                    <p className="text-sm text-gray-500">{shop.category}</p>
                  </div>
                  <span className={`badge ${getStatusColor(shop.verificationStatus)}`}>
                    {shop.verificationStatus === 'pending' && <ClockIcon className="w-4 h-4 inline mr-1" />}
                    {shop.verificationStatus}
                  </span>
                </div>

                {/* Description */}
                <p className="text-gray-600 mb-4">{shop.description}</p>

                {/* Shop Details */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-2">
                  <div className="text-sm">
                    <span className="font-medium text-gray-700">Owner:</span>{' '}
                    <span className="text-gray-900">
                      {shop.ownerId?.profile?.name || 'N/A'}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium text-gray-700">Email:</span>{' '}
                    <span className="text-gray-900">{shop.ownerId?.email || 'N/A'}</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium text-gray-700">Phone:</span>{' '}
                    <span className="text-gray-900">{shop.phone}</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium text-gray-700">GST:</span>{' '}
                    <span className="text-gray-900">{shop.gstNumber}</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium text-gray-700">Address:</span>{' '}
                    <span className="text-gray-900">
                      {shop.address.street}, {shop.address.city}, {shop.address.state} -{' '}
                      {shop.address.zipCode}
                    </span>
                  </div>
                  {shop.deliveryEnabled && (
                    <div className="text-sm text-green-600">
                      ✓ Delivery enabled ({shop.deliveryRadius} km)
                    </div>
                  )}
                </div>

                {/* Created At */}
                <div className="text-xs text-gray-500 mb-4">
                  Registered: {new Date(shop.createdAt).toLocaleDateString()}
                </div>

                {/* Actions */}
                {shop.verificationStatus === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(shop._id)}
                      className="btn-success flex-1 btn-sm flex items-center justify-center gap-2"
                    >
                      <CheckIcon className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(shop._id)}
                      className="btn-danger btn-sm flex items-center justify-center gap-2"
                    >
                      <XMarkIcon className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                )}

                {shop.verificationStatus === 'rejected' && shop.rejectionReason && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
                    <strong>Rejection Reason:</strong> {shop.rejectionReason}
                  </div>
                )}

                {shop.verificationStatus === 'approved' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-800 text-center">
                    ✓ Shop is live and accepting orders
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

export default AdminDashboard;
