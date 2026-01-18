import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { MagnifyingGlassIcon, FunnelIcon, MapPinIcon, ShoppingCartIcon, HeartIcon } from '@heroicons/react/24/outline';
import { searchService } from '../services';
import { showError } from '../utils/toast';
import { useLocation } from '../context/LocationContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { INDIAN_CATEGORIES } from '../utils/indianConstants';
import { formatIndianCurrency } from '../utils/indianFormatters';

const ProductBrowse = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    maxDistance: 10,
  });
  const [showFilters, setShowFilters] = useState(false);
  const { location } = useLocation();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const categories = ['All', ...INDIAN_CATEGORIES];

  useEffect(() => {
    searchProducts();
  }, [location]);

  const searchProducts = async () => {
    if (!location) {
      showError('Please enable location to search products');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const params = {
        latitude: location.latitude,
        longitude: location.longitude,
        maxDistance: filters.maxDistance * 1000, // Convert km to meters
      };

      if (searchQuery) params.query = searchQuery;
      if (filters.category && filters.category !== 'All') params.category = filters.category;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;

      const response = await searchService.searchProducts(params);
      setProducts(response.data);
    } catch (error) {
      showError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchProducts();
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
  };

  const handleToggleWishlist = (e, product) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <>
      <Toaster />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Browse Products</h1>
          <p className="text-gray-600">Discover products from nearby shops</p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                className="input-field pl-12"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary flex items-center gap-2"
            >
              <FunnelIcon className="w-5 h-5" />
              Filters
            </button>
            <button type="submit" className="btn-primary">
              Search
            </button>
          </div>
        </form>

        {/* Filters */}
        {showFilters && (
          <div className="card mb-6 animate-slide-down">
            <h3 className="font-semibold text-gray-900 mb-4">Filters</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  className="input-field"
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Min Price (₹)</label>
                <input
                  type="number"
                  className="input-field"
                  placeholder="0"
                  value={filters.minPrice}
                  onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Price (₹)</label>
                <input
                  type="number"
                  className="input-field"
                  placeholder="10000"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Distance: {filters.maxDistance} km
                </label>
                <input
                  type="range"
                  min="1"
                  max="50"
                  className="w-full"
                  value={filters.maxDistance}
                  onChange={(e) => setFilters({ ...filters, maxDistance: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => {
                  setFilters({ category: '', minPrice: '', maxPrice: '', maxDistance: 10 });
                  setSearchQuery('');
                }}
                className="btn-secondary btn-sm"
              >
                Clear Filters
              </button>
              <button onClick={searchProducts} className="btn-primary btn-sm">
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* Location Status */}
        {location && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6 flex items-center gap-2">
            <MapPinIcon className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-blue-800">
              Searching near your location ({location.latitude.toFixed(4)}, {location.longitude.toFixed(4)})
            </span>
          </div>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card">
                <div className="skeleton h-48 mb-4"></div>
                <div className="skeleton h-6 mb-2"></div>
                <div className="skeleton h-4 mb-4"></div>
                <div className="skeleton h-10"></div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="card-elevated text-center py-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Products Found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product._id} className="card-elevated group cursor-pointer relative" onClick={() => navigate(`/product/${product._id}`)}>
                {/* Wishlist Heart Button */}
                <button
                  onClick={(e) => handleToggleWishlist(e, product)}
                  className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all"
                >
                  <HeartIcon 
                    className={`w-6 h-6 transition-colors ${
                      isInWishlist(product._id) 
                        ? 'text-red-500 fill-current' 
                        : 'text-gray-400 hover:text-red-500'
                    }`}
                  />
                </button>

                {/* Product Image */}
                <div className="bg-gray-100 rounded-xl h-48 mb-4 flex items-center justify-center overflow-hidden">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <span className="text-6xl">📦</span>
                  )}
                </div>

                {/* Product Info */}
                <h3 className="font-bold text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
                <p className="text-sm text-gray-500 mb-2">{product.category}</p>

                {/* Shop Info */}
                <div className="text-sm text-gray-600 mb-3">
                  <p className="font-medium">{product.shopId?.name}</p>
                  {product.distance && (
                    <p className="text-xs text-gray-500">📍 {(product.distance / 1000).toFixed(1)} km away</p>
                  )}
                </div>

                {/* Price */}
                <div className="flex items-baseline justify-between mb-4">
                  <span className="text-2xl font-bold text-primary-600">₹{product.price.toFixed(2)}</span>
                  <span className="text-sm text-gray-500">/{product.unit}</span>
                </div>

                {/* Stock Status */}
                <div className="mb-4">
                  {product.inventory?.available ? (
                    <span className="badge badge-success text-xs">In Stock</span>
                  ) : (
                    <span className="badge badge-danger text-xs">Out of Stock</span>
                  )}
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(product);
                  }}
                  disabled={!product.inventory?.available}
                  className="btn-primary w-full btn-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCartIcon className="w-4 h-4" />
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ProductBrowse;
