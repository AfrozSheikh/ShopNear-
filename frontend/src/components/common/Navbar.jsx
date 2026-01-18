import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCartIcon, HeartIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { ROLES } from '../../utils/constants';

const Navbar = () => {
  const { user, logout, loading } = useAuth();
  const { getCartCount } = useCart();
  const { wishlist } = useWishlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  const cartCount = getCartCount();
  const wishlistCount = wishlist.length;

  // Show loading state while checking authentication
  if (loading) {
    return (
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-2xl font-bold text-primary-600">
              ShopNear
            </Link>
            <div className="skeleton h-8 w-32"></div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-primary-600 hover:text-primary-700 transition-colors">
            🏪 ShopNear
          </Link>

          {/* Desktop Menu */}
          {user ? (
            <>
              <div className="hidden md:flex items-center gap-6">
                <span className="text-gray-700 font-medium">
                  {user?.profile?.name || 'User'} 
                  <span className="text-sm text-gray-500 ml-2">({user?.role || ''})</span>
                </span>
                
                {user.role === ROLES.CUSTOMER && (
                  <>
                    <Link to="/search" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
                      🔍 Search
                    </Link>
                    <Link to="/my-orders" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
                      📦 Orders
                    </Link>
                    <Link to="/wishlist" className="relative">
                      <HeartIcon className="w-6 h-6 text-gray-700 hover:text-red-500 transition-colors" />
                      {wishlistCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                          {wishlistCount}
                        </span>
                      )}
                    </Link>
                    <Link to="/cart" className="relative">
                      <ShoppingCartIcon className="w-6 h-6 text-gray-700 hover:text-primary-600 transition-colors" />
                      {cartCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                          {cartCount}
                        </span>
                      )}
                    </Link>
                  </>
                )}
                
                {user.role === ROLES.SHOP_OWNER && (
                  <Link to="/shop-dashboard" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
                    🏪 Dashboard
                  </Link>
                )}
                
                {user.role === ROLES.ADMIN && (
                  <Link to="/admin" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
                    ⚙️ Admin
                  </Link>
                )}
                
                <button onClick={handleLogout} className="btn-secondary text-sm">
                  Logout
                </button>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-md hover:bg-gray-100"
              >
                {mobileMenuOpen ? (
                  <XMarkIcon className="w-6 h-6 text-gray-700" />
                ) : (
                  <Bars3Icon className="w-6 h-6 text-gray-700" />
                )}
              </button>
            </>
          ) : (
            <div className="flex gap-3">
              <Link to="/login" className="btn-secondary text-sm">
                Login
              </Link>
              <Link to="/register" className="btn-primary text-sm">
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Dropdown */}
        {user && mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t animate-slide-down">
            <div className="px-4 py-2 space-y-1">
              <div className="px-4 py-2 border-b">
                <p className="font-medium text-gray-700">{user?.profile?.name || 'User'}</p>
                <p className="text-sm text-gray-500">{user?.role || ''}</p>
              </div>

              {user.role === ROLES.CUSTOMER && (
                <>
                  <Link
                    to="/search"
                    className="block px-4 py-2 rounded hover:bg-gray-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    🔍 Search
                  </Link>
                  <Link
                    to="/my-orders"
                    className="block px-4 py-2 rounded hover:bg-gray-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    📦 Orders
                  </Link>
                  <Link
                    to="/wishlist"
                    className="block px-4 py-2 rounded hover:bg-gray-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    ❤️ Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
                  </Link>
                  <Link
                    to="/cart"
                    className="block px-4 py-2 rounded hover:bg-gray-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    🛒 Cart {cartCount > 0 && `(${cartCount})`}
                  </Link>
                </>
              )}

              {user.role === ROLES.SHOP_OWNER && (
                <Link
                  to="/shop-dashboard"
                  className="block px-4 py-2 rounded hover:bg-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  🏪 Dashboard
                </Link>
              )}

              {user.role === ROLES.ADMIN && (
                <Link
                  to="/admin"
                  className="block px-4 py-2 rounded hover:bg-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  ⚙️ Admin
                </Link>
              )}

              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 rounded hover:bg-gray-100 text-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
