import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { showSuccess, showError } from '../../utils/toast';
import { shopService } from '../../services';
import { INDIAN_STATES, INDIAN_CATEGORIES, BUSINESS_TYPES, validateGST, validateFSSAI } from '../../utils/indianConstants';

const CreateShopModal = ({ isOpen, onClose, onShopCreated }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: INDIAN_CATEGORIES[0],
    phone: '',
    businessType: '',
    gstNumber: '',
    panNumber: '',
    fssaiNumber: '',
    houseNumber: '',
    street: '',
    landmark: '',
    area: '',
    city: '',
    state: '',
    pincode: '',
    latitude: '',
    longitude: '',
    deliveryEnabled: false,
    deliveryRadius: 5,
  });

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      showSuccess('Getting your location...');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString(),
          });
          showSuccess('Location captured!');
        },
        (error) => {
          showError('Unable to get location. Please enter manually.');
          console.error(error);
        }
      );
    } else {
      showError('Geolocation is not supported by your browser');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate GST if provided
    if (formData.gstNumber && !validateGST(formData.gstNumber)) {
      showError('Invalid GST number format');
      setLoading(false);
      return;
    }

    // Validate FSSAI if provided
    if (formData.fssaiNumber && !validateFSSAI(formData.fssaiNumber)) {
      showError('FSSAI number must be 14 digits');
      setLoading(false);
      return;
    }

    try {
      const shopData = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        phone: formData.phone,
        businessDetails: {
          businessType: formData.businessType,
          gstNumber: formData.gstNumber,
          panNumber: formData.panNumber,
          fssaiNumber: formData.fssaiNumber,
        },
        address: {
          houseNumber: formData.houseNumber,
          street: formData.street,
          landmark: formData.landmark,
          area: formData.area,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        },
        location: {
          type: 'Point',
          coordinates: [parseFloat(formData.longitude), parseFloat(formData.latitude)],
        },
        deliveryEnabled: formData.deliveryEnabled,
        deliveryRadius: formData.deliveryEnabled ? formData.deliveryRadius : 0,
      };

      const response = await shopService.createShop(shopData);
      showSuccess('Shop created successfully! Awaiting admin approval.');
      onShopCreated(response.data);
      onClose();
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to create shop');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-large max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
          <h2 className="text-2xl font-bold">Create New Shop</h2>
          <button onClick={onClose} className="icon-button">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">📋 Basic Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Shop Name *</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ramesh General Store"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
                <textarea
                  required
                  rows={3}
                  className="input-field"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of your shop..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                  <select
                    required
                    className="input-field"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    {INDIAN_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
                  <div className="flex gap-0">
                    <span className="inline-flex items-center px-3 py-2 border border-r-0 border-gray-300 bg-gray-100 text-gray-700 text-sm font-medium rounded-l-lg">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      pattern="[6-9][0-9]{9}"
                      maxLength="10"
                      className="input-field rounded-l-none flex-1"
                      placeholder="9876543210"
                      value={formData.phone.replace('+91', '')}
                      onChange={(e) => {
                        const phone = e.target.value.replace(/\D/g, '');
                        if (phone.length <= 10) {
                          setFormData({ ...formData, phone: phone ? `+91${phone}` : '' });
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Business Details */}
          <div>
            <h3 className="text-lg font-semibold mb-4">🏢 Business Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Business Type</label>
                <select
                  className="input-field"
                  value={formData.businessType}
                  onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                >
                  <option value="">Select Business Type</option>
                  {BUSINESS_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">GST Number (Optional)</label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.gstNumber}
                    onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value.toUpperCase() })}
                    placeholder="22AAAAA0000A1Z5"
                    pattern="[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}"
                    maxLength="15"
                  />
                  <p className="text-xs text-gray-500 mt-1">15-character GST number</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">PAN Number (Optional)</label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.panNumber}
                    onChange={(e) => setFormData({ ...formData, panNumber: e.target.value.toUpperCase() })}
                    placeholder="ABCDE1234F"
                    pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                    maxLength="10"
                  />
                </div>
              </div>

              {(formData.category === 'Food & Beverages' || formData.category === 'Groceries & Staples') && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">FSSAI Number (For Food Business)</label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.fssaiNumber}
                    onChange={(e) => setFormData({ ...formData, fssaiNumber: e.target.value.replace(/\D/g, '') })}
                    placeholder="12345678901234"
                    pattern="\d{14}"
                    maxLength="14"
                  />
                  <p className="text-xs text-gray-500 mt-1">14-digit FSSAI license number</p>
                </div>
              )}
            </div>
          </div>

          {/* Address */}
          <div>
            <h3 className="text-lg font-semibold mb-4">📍 Address</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">House/Shop No.</label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.houseNumber}
                    onChange={(e) => setFormData({ ...formData, houseNumber: e.target.value })}
                    placeholder="Shop 15"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Street/Road *</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    placeholder="M.G. Road"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Landmark</label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.landmark}
                    onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                    placeholder="Near City Hospital"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Area/Locality</label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    placeholder="Koramangala"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">City *</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Bangalore"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">State *</label>
                  <select
                    required
                    className="input-field"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  >
                    <option value="">Select State</option>
                    {INDIAN_STATES.map((state) => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Pincode *</label>
                  <input
                    type="text"
                    required
                    pattern="\d{6}"
                    maxLength="6"
                    className="input-field"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, '') })}
                    placeholder="560001"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <h3 className="text-lg font-semibold mb-4">🌍 Location Coordinates</h3>
            <div className="space-y-4">
              <button
                type="button"
                onClick={handleGetLocation}
                className="btn-secondary w-full"
              >
                📍 Get My Current Location
              </button>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Latitude *</label>
                  <input
                    type="number"
                    step="any"
                    required
                    className="input-field"
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                    placeholder="12.9716"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Longitude *</label>
                  <input
                    type="number"
                    step="any"
                    required
                    className="input-field"
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                    placeholder="77.5946"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500">
                Click the button above or enter coordinates manually
              </p>
            </div>
          </div>

          {/* Delivery Options */}
          <div>
            <h3 className="text-lg font-semibold mb-4">🚚 Delivery Options</h3>
            <div className="space-y-4">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  className="w-5 h-5"
                  checked={formData.deliveryEnabled}
                  onChange={(e) => setFormData({ ...formData, deliveryEnabled: e.target.checked })}
                />
                <span className="font-medium">Enable home delivery</span>
              </label>

              {formData.deliveryEnabled && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Delivery Radius (km) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    required
                    className="input-field"
                    value={formData.deliveryRadius}
                    onChange={(e) => setFormData({ ...formData, deliveryRadius: parseInt(e.target.value) })}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex-1"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Shop'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateShopModal;
