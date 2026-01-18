import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { shopService, productService } from '../services';
import { showError } from '../utils/toast';
import { formatIndianCurrency } from '../utils/indianFormatters';

const ShopProfilePage = () => {
  const { shopId } = useParams();
  const navigate = useNavigate();
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadShop();
  }, [shopId]);

  const loadShop = async () => {
    try {
      const shopResponse = await shopService.getShopById(shopId);
      setShop(shopResponse.data);
      
      const productsResponse = await productService.getShopProducts(shopId);
      setProducts(productsResponse.data || []);
    } catch (error) {
      showError('Failed to load shop');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="skeleton h-12 w-12 rounded-full"></div>
      </div>
    );
  }

  if (!shop) return null;

  return (
    <>
      <Toaster />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Shop Header */}
        <div className="card mb-8">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">{shop.name}</h1>
              <p className="text-gray-600 text-lg mb-4">{shop.description}</p>
              <span className="badge badge-success">{shop.category}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">📍 Address</h3>
              <p className="text-gray-600">
                {shop.address.street}
                {shop.address.landmark && `, ${shop.address.landmark}`}
              </p>
              <p className="text-gray-600">
                {shop.address.city}, {shop.address.state} - {shop.address.pincode}
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">📞 Contact</h3>
              <p className="text-gray-600">{shop.phone}</p>
              {shop.email && <p className="text-gray-600">{shop.email}</p>}
              
              {shop.deliveryEnabled && (
                <p className="text-green-600 mt-2">
                  🚚 Delivery available (within {shop.deliveryRadius} km)
                </p>
              )}
            </div>
          </div>

          {/* WhatsApp Contact */}
          {shop.phone && (
            <a
              href={`https://wa.me/91${shop.phone.replace(/\D/g, '')}?text=Hi, I'd like to know more about your products`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary w-full mt-6"
            >
              <span className="text-xl">💬</span> Contact on WhatsApp
            </a>
          )}
        </div>

        {/* Products */}
        <h2 className="text-3xl font-bold mb-6">Products from this Shop</h2>
        
        {products.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500 text-lg">No products available yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <div 
                key={product._id} 
                className="card-elevated cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => navigate(`/product/${product._id}`)}
              >
                {product.images && product.images.length > 0 ? (
                  <img 
                    src={product.images[0]} 
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-t-lg mb-4"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-100 rounded-t-lg mb-4 flex items-center justify-center">
                    <span className="text-6xl">📦</span>
                  </div>
                )}
                
                <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-primary-600 font-bold text-xl">
                    {formatIndianCurrency(product.price)}
                  </span>
                  {product.inventory?.available ? (
                    <span className="badge badge-success text-xs">In Stock</span>
                  ) : (
                    <span className="badge badge-danger text-xs">Out of Stock</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ShopProfilePage;
