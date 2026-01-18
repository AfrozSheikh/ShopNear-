import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { UserCircleIcon, MapPinIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { showSuccess, showError } from '../utils/toast';

const CustomerProfile = () => {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
    },
  });

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.profile?.name || '',
        email: user.email || '',
        phone: user.profile?.phone || '',
        address: user.profile?.address || {
          street: '',
          city: '',
          state: '',
          zipCode: '',
        },
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      showSuccess('Profile updated successfully!');
      setEditing(false);
    } catch (error) {
      showError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">My Profile</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="card-elevated text-center">
            <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserCircleIcon className="w-16 h-16 text-primary-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">{profile.name}</h2>
            <p className="text-gray-600 mb-4">{profile.email}</p>
            <span className="badge badge-success">Customer</span>
          </div>

          {/* Profile Form */}
          <div className="md:col-span-2 card-elevated">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Profile Information</h3>
              {!editing && (
                <button onClick={() => setEditing(true)} className="btn-primary btn-sm">
                  Edit Profile
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="flex items-center gap-2">
                  <UserCircleIcon className="w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    className="input-field flex-1"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    disabled={!editing}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="flex items-center gap-2">
                  <EnvelopeIcon className="w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    className="input-field flex-1"
                    value={profile.email}
                    disabled
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="flex items-center gap-2">
                  <PhoneIcon className="w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    className="input-field flex-1"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    disabled={!editing}
                    placeholder="+91 1234567890"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <MapPinIcon className="w-5 h-5 inline mr-2" />
                  Address
                </label>
                <div className="space-y-3 pl-7">
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Street Address"
                    value={profile.address.street}
                    onChange={(e) => setProfile({
                      ...profile,
                      address: { ...profile.address, street: e.target.value }
                    })}
                    disabled={!editing}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      className="input-field"
                      placeholder="City"
                      value={profile.address.city}
                      onChange={(e) => setProfile({
                        ...profile,
                        address: { ...profile.address, city: e.target.value }
                      })}
                      disabled={!editing}
                    />
                    <input
                      type="text"
                      className="input-field"
                      placeholder="State"
                      value={profile.address.state}
                      onChange={(e) => setProfile({
                        ...profile,
                        address: { ...profile.address, state: e.target.value }
                      })}
                      disabled={!editing}
                    />
                  </div>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="ZIP Code"
                    value={profile.address.zipCode}
                    onChange={(e) => setProfile({
                      ...profile,
                      address: { ...profile.address, zipCode: e.target.value }
                    })}
                    disabled={!editing}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              {editing && (
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(false);
                      // Reset to original values
                      if (user) {
                        setProfile({
                          name: user.profile?.name || '',
                          email: user.email || '',
                          phone: user.profile?.phone || '',
                          address: user.profile?.address || {
                            street: '',
                            city: '',
                            state: '',
                            zipCode: '',
                          },
                        });
                      }
                    }}
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
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerProfile;
