import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LocationProvider } from './context/LocationContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { NotificationProvider } from './context/NotificationContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import Navbar from './components/common/Navbar';
import ProtectedRoute from './components/common/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductBrowse from './pages/ProductBrowse';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import MyOrdersPage from './pages/MyOrdersPage';
import WishlistPage from './pages/WishlistPage';
import CustomerProfile from './pages/CustomerProfile';
import NotificationsPage from './pages/NotificationsPage';
import ShopOwnerDashboard from './pages/ShopOwnerDashboard';
import ProductsManagement from './pages/ProductsManagement';
import OrdersManagement from './pages/OrdersManagement';
import ShopAnalytics from './pages/ShopAnalytics';
import ShopSettings from './pages/ShopSettings';
import InventoryManagement from './pages/InventoryManagement';
import AdminDashboard from './pages/AdminDashboard';
import AdminAnalytics from './pages/AdminAnalytics';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import OrderDetailPage from './pages/OrderDetailPage';
import ShopProfilePage from './pages/ShopProfilePage';
import { ROLES } from './utils/constants';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <LocationProvider>
            <CartProvider>
              <WishlistProvider>
                <NotificationProvider>
                  <div className="min-h-screen bg-gray-50">
                    <Navbar />
                    
                    <Routes>
                      {/* Public routes */}
                      <Route path="/" element={<HomePage />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/register" element={<RegisterPage />} />
                      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                      <Route path="/shop/:shopId" element={<ShopProfilePage />} />

                      {/* Customer routes */}
                      <Route
                        path="/search"
                        element={
                          <ProtectedRoute allowedRoles={[ROLES.CUSTOMER]}>
                            <ProductBrowse />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/product/:productId"
                        element={
                          <ProtectedRoute allowedRoles={[ROLES.CUSTOMER]}>
                            <ProductDetailPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/cart"
                        element={
                          <ProtectedRoute allowedRoles={[ROLES.CUSTOMER]}>
                            <CartPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/checkout"
                        element={
                          <ProtectedRoute allowedRoles={[ROLES.CUSTOMER]}>
                            <CheckoutPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/my-orders"
                        element={
                          <ProtectedRoute allowedRoles={[ROLES.CUSTOMER]}>
                            <MyOrdersPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/order/:orderId"
                        element={
                          <ProtectedRoute allowedRoles={[ROLES.CUSTOMER, ROLES.SHOP_OWNER, ROLES.ADMIN]}>
                            <OrderDetailPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/wishlist"
                        element={
                          <ProtectedRoute allowedRoles={[ROLES.CUSTOMER]}>
                            <WishlistPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/profile"
                        element={
                          <ProtectedRoute allowedRoles={[ROLES.CUSTOMER]}>
                            <CustomerProfile />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/notifications"
                        element={
                          <ProtectedRoute allowedRoles={[ROLES.CUSTOMER, ROLES.SHOP_OWNER, ROLES.ADMIN]}>
                            <NotificationsPage />
                          </ProtectedRoute>
                        }
                      />

                      {/* Shop Owner routes */}
                      <Route
                        path="/shop-dashboard"
                        element={
                          <ProtectedRoute allowedRoles={[ROLES.SHOP_OWNER]}>
                            <ShopOwnerDashboard />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/shop/:shopId/products"
                        element={
                          <ProtectedRoute allowedRoles={[ROLES.SHOP_OWNER]}>
                            <ProductsManagement />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/shop/:shopId/orders"
                        element={
                          <ProtectedRoute allowedRoles={[ROLES.SHOP_OWNER]}>
                            <OrdersManagement />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/shop/:shopId/analytics"
                        element={
                          <ProtectedRoute allowedRoles={[ROLES.SHOP_OWNER]}>
                            <ShopAnalytics />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/shop/:shopId/settings"
                        element={
                          <ProtectedRoute allowedRoles={[ROLES.SHOP_OWNER]}>
                            <ShopSettings />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/shop/:shopId/product/:productId/inventory"
                        element={
                          <ProtectedRoute allowedRoles={[ROLES.SHOP_OWNER]}>
                            <InventoryManagement />
                          </ProtectedRoute>
                        }
                      />

                      {/* Admin routes */}
                      <Route
                        path="/admin"
                        element={
                          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                            <AdminDashboard />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/admin/analytics"
                        element={
                          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                            <AdminAnalytics />
                          </ProtectedRoute>
                        }
                      />

                      {/* Fallback */}
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </div>
                </NotificationProvider>
              </WishlistProvider>
            </CartProvider>
          </LocationProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
