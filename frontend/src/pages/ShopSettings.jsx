import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ArrowLeftIcon, CogIcon } from '@heroicons/react/24/outline';
import { shopService } from '../services';
import { showSuccess, showError } from '../utils/toast';

const ShopSettings = () => {
  const { shopId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    name: '',
    description: '',
    category: '',
    phone: '',
    gstNumber: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
    },
    deliveryEnabled: false,
    deliveryRadius: 5,
    businessHours: {
      monday: { open: '09:00', close: '18:00', closed: false },
      tuesday: { open: '09:00', close: '18:00', closed: false },
      wednesday: { open: '09:00', close: '18:00', closed: false },
      thursday: { open: '09:00', close: '18:00', closed: false },
      friday: { open: '09:00', close: '18:00', closed: false },
      saturday: { open: '09:00', close: '18:00', closed: false },
      sunday: { open: '09:00', close: '18:00', closed: true },
    },
  });

  useEffect(() => {
    loadSettings();
  }, [shopId]);

  const loadSettings = async () => {
    try {
      const response = await shopService.getShopById(shopId);
      setSettings({
        ...response.data,
        businessHours: response.data.businessHours || settings.businessHours,
      });
    } catch (error) {
      showError('Failed to load shop settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await shopService.updateShop(shopId, settings);
      showSuccess('Settings updated successfully!');
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const categories = ['Electronics', 'Clothing', 'Food & Beverages', 'Groceries', 'Books', 'Health & Beauty', 'Sports', 'Toys', 'Home & Kitchen', 'Other'];

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
        {/* Header */}
        <button
          onClick={() => navigate('/shop-dashboard')}
          className="flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Back to Dashboard
        </button>

        <div className="flex items-center gap-3 mb-8">
          <CogIcon className="w-8 h-8 text-gray-700" />
          <h1 className="text-4xl font-bold text-gray-900">Shop Settings</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="card-elevated">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Basic Information</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Shop Name *
                </label>
                <input
                  type="text"
                  required
                  className="input-field"
                  value={settings.name}
                  onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  className="input-field"
                  value={settings.description}
                  onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    required
                    className="input-field"
                    value={settings.category}
                    onChange={(e) => setSettings({ ...settings, category: e.target.value })}
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    className="input-field"
                    value={settings.phone}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  GST Number
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={settings.gstNumber}
                  onChange={(e) => setSettings({ ...settings, gstNumber: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="card-elevated">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Address</h3>
            
            <div className="space-y-4">
              <input
                type="text"
                required
                className="input-field"
                placeholder="Street Address"
                value={settings.address.street}
                onChange={(e) => setSettings({
                  ...settings,
                  address: { ...settings.address, street: e.target.value }
                })}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  required
                  className="input-field"
                  placeholder="City"
                  value={settings.address.city}
                  onChange={(e) => setSettings({
                    ...settings,
                    address: { ...settings.address, city: e.target.value }
                  })}
                />
                
                <input
                  type="text"
                  required
                  className="input-field"
                  placeholder="State"
                  value={settings.address.state}
                  onChange={(e) => setSettings({
                    ...settings,
                    address: { ...settings.address, state: e.target.value }
                  })}
                />
              </div>
              
              <input
                type="text"
                required
                className="input-field"
                placeholder="ZIP Code"
                value={settings.address.zipCode}
                onChange={(e) => setSettings({
                  ...settings,
                  address: { ...settings.address, zipCode: e.target.value }
                })}
              />
            </div>
          </div>

          {/* Delivery Settings */}
          <div className="card-elevated">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Delivery Settings</h3>
            
            <div className="space-y-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="w-5 h-5 text-primary-600 rounded"
                  checked={settings.deliveryEnabled}
                  onChange={(e) => setSettings({ ...settings, deliveryEnabled: e.target.checked })}
                />
                <span className="ml-3 text-gray-900 font-medium">Enable Delivery</span>
              </label>

              {settings.deliveryEnabled && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Delivery Radius (km)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    className="input-field"
                    value={settings.deliveryRadius}
                    onChange={(e) => setSettings({ ...settings, deliveryRadius: parseInt(e.target.value) })}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/shop-dashboard')}
              className="btn-secondary"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ShopSettings;
