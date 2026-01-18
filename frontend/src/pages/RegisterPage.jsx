import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../utils/constants';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: ROLES.CUSTOMER,
    name: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userData = {
        email: formData.email,
        password: formData.password,
        role: formData.role,
        profile: {
          name: formData.name,
          phone: formData.phone,
        },
      };

      await register(userData);
      
      // Redirect based on role
      if (formData.role === ROLES.ADMIN) navigate('/admin');
      else if (formData.role === ROLES.SHOP_OWNER) navigate('/shop-dashboard');
      else navigate('/search');
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h2 className="text-3xl font-bold text-center text-gray-900">Create Account</h2>
          <p className="mt-2 text-center text-gray-600">Join ShopNear today</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                required
                className="input-field"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                required
                className="input-field"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
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
              <p className="text-xs text-gray-500 mt-1">10-digit mobile number starting with 6-9</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                required
                minLength={6}
                className="input-field"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">I am a</label>
              <select
                className="input-field"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value={ROLES.CUSTOMER}>Customer - Shop for products</option>
                <option value={ROLES.SHOP_OWNER}>Shop Owner - Sell products</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Choose your account type to get started
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
