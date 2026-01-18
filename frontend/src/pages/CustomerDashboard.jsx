import { useState } from 'react';
import { searchService } from '../services';
import { useLocation } from '../context/LocationContext';

const CustomerDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { location } = useLocation();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim() || !location) return;

    setLoading(true);
    setError('');

    try {
      const response = await searchService.searchProducts(
        searchQuery,
        location.lat,
        location.lng,
        10
      );
      setResults(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Search Products</h1>

      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search for products..."
            className="input-field flex-1"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
        {location && (
          <p className="text-sm text-gray-600 mt-2">
            Searching within 10 km of your location
          </p>
        )}
      </form>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((result, index) => (
          <div key={index} className="card hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-bold mb-2">{result.product.name}</h3>
            <p className="text-gray-600 mb-2">{result.product.description}</p>
            <p className="text-2xl font-bold text-primary-600 mb-2">
              ₹{result.product.price}
            </p>
            <div className="border-t pt-3 mt-3 space-y-1">
              <p className="text-sm font-semibold">{result.shop.name}</p>
              <p className="text-sm text-gray-600">{result.shop.address.city}</p>
              <p className="text-sm text-green-600">
                {result.distance} km away • {result.inventory.availableQuantity} in stock
              </p>
            </div>
            <button className="btn-primary w-full mt-4">
              View Shop
            </button>
          </div>
        ))}
      </div>

      {results.length === 0 && !loading && searchQuery && (
        <p className="text-center text-gray-600 mt-8">No products found</p>
      )}
    </div>
  );
};

export default CustomerDashboard;
