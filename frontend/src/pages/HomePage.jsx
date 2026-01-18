import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../utils/constants';
import { 
  MagnifyingGlassIcon, 
  ShoppingBagIcon, 
  ShieldCheckIcon, 
  MapPinIcon,
  SparklesIcon,
  TruckIcon 
} from '@heroicons/react/24/outline';

const HomePage = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: ShieldCheckIcon,
      title: 'Verified Shops',
      description: 'All shops are verified with GST and legal documents for your safety',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: MapPinIcon,
      title: 'Location-Based',
      description: 'Find shops near you with real-time distance and availability',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: SparklesIcon,
      title: 'Real-Time Inventory',
      description: 'See actual stock availability before you visit or order',
      gradient: 'from-orange-500 to-red-500',
    },
    {
      icon: TruckIcon,
      title: 'Flexible Delivery',
      description: 'Choose to visit the shop or request optional home delivery',
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      icon: ShoppingBagIcon,
      title: 'Easy Ordering',
      description: 'Simple checkout process with multiple payment options',
      gradient: 'from-indigo-500 to-purple-500',
    },
    {
      icon: MagnifyingGlassIcon,
      title: 'Smart Search',
      description: 'Advanced filters to find exactly what you need instantly',
      gradient: 'from-pink-500 to-rose-500',
    },
  ];

  const stats = [
    { number: '10,000+', label: 'Verified Shops' },
    { number: '50,000+', label: 'Products' },
    { number: '1M+', label: 'Happy Customers' },
    { number: '24/7', label: 'Support' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative hero-gradient text-white overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-300 rounded-full blur-3xl animate-pulse-slow animation-delay-1000"></div>
        </div>

        <div className="relative container-custom py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-8 animate-slide-down">
              <SparklesIcon className="w-5 h-5" />
              <span className="text-sm font-semibold">Welcome to the Future of Local Shopping</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Discover Local Shops
              <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-pink-200">
                Near You
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-purple-100 mb-10 max-w-3xl mx-auto leading-relaxed">
              Shop from verified local stores with real-time inventory. Get products delivered or pick them up from nearby locations.
            </p>

            {!user ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link 
                  to="/register" 
                  className="btn-primary btn-lg hover-glow w-full sm:w-auto group"
                >
                  <span>Start Shopping</span>
                  <ShoppingBagIcon className="w-5 h-5 inline ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  to="/login" 
                  className="btn-secondary btn-lg w-full sm:w-auto text-primary-600 hover:text-primary-700"
                >
                  Sign In
                </Link>
              </div>
            ) : (
              <div className="flex gap-4 justify-center">
                {user.role === ROLES.CUSTOMER && (
                  <Link to="/search" className="btn-primary btn-lg hover-glow">
                    <MagnifyingGlassIcon className="w-5 h-5 inline mr-2" />
                    Search Products
                  </Link>
                )}
                {user.role === ROLES.SHOP_OWNER && (
                  <Link to="/shop-dashboard" className="btn-primary btn-lg hover-glow">
                    Go to Dashboard
                  </Link>
                )}
                {user.role === ROLES.ADMIN && (
                  <Link to="/admin" className="btn-primary btn-lg hover-glow">
                    Admin Panel
                  </Link>
                )}
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20">
              {stats.map((stat, index) => (
                <div key={index} className="animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</div>
                  <div className="text-purple-200 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" 
              fill="#F9FAFB"
            />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="section-heading">
              Why Choose <span className="text-gradient">ShopNear</span>?
            </h2>
            <p className="section-subheading mx-auto">
              Everything you need for a seamless local shopping experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card-elevated group animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} p-3 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-full h-full text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="section-heading">How It Works</h2>
            <p className="section-subheading mx-auto">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            {[
              { step: '01', title: 'Search Products', desc: 'Find products from verified shops near you', icon: '🔍' },
              { step: '02', title: 'Place Order', desc: 'Choose delivery or pickup and complete checkout', icon: '🛒' },
              { step: '03', title: 'Get Products', desc: 'Receive at your doorstep or collect from shop', icon: '📦' },
            ].map((item, index) => (
              <div key={index} className="text-center relative">
                {index < 2 && (
                  <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-primary-300 to-transparent"></div>
                )}
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-white flex items-center justify-center text-4xl shadow-large hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <div className="text-sm font-bold text-primary-600 mb-2">STEP {item.step}</div>
                <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 via-primary-700 to-purple-800 text-white">
        <div className="container-custom text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Start Shopping?
          </h2>
          <p className="text-xl mb-10 text-purple-100 max-w-2xl mx-auto">
            Join thousands of happy customers discovering and shopping from local verified stores
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn-primary btn-lg bg-white text-primary-600 hover:bg-gray-50">
              Create Free Account
            </Link>
            <Link to="/search" className="btn-outline btn-lg border-white text-white hover:bg-white/10">
              Browse Products
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white text-2xl font-bold mb-4">ShopNear</h3>
              <p className="text-gray-400">
                Your trusted platform for local commerce and real-time inventory.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/search" className="hover:text-white transition-colors">Search Products</Link></li>
                <li><Link to="/register" className="hover:text-white transition-colors">Sign Up</Link></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">For Sellers</h4>
              <ul className="space-y-2">
                <li><Link to="/register" className="hover:text-white transition-colors">Register Shop</Link></li>
                <li><Link to="/shop-dashboard" className="hover:text-white transition-colors">Seller Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2026 ShopNear. All rights reserved. Built with ❤️ for local businesses.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
