import { useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { HeartIcon, TrashIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../components/common/UIComponents';

const WishlistPage = () => {
  const navigate = useNavigate();
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = (item) => {
    // Note: We need the full product object, but wishlist only stores basic info
    // In a real app, you'd fetch the full product details
    const product = {
      _id: item._id,
      name: item.name,
      price: item.price,
      images: item.image ? [item.image] : [],
      shopId: { _id: item.shopId, name: item.shopName },
      unit: 'piece', // Default, should be fetched
    };
    
    addToCart(product, 1);
    removeFromWishlist(item._id);
  };

  if (wishlist.length === 0) {
    return (
      <>
        <Toaster />
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="card-elevated text-center py-16">
            <HeartIcon className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Wishlist is Empty</h2>
            <p className="text-gray-600 mb-8">Save items you love to view them later</p>
            <button onClick={() => navigate('/search')} className="btn-primary">
              Browse Products
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Toaster />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">My Wishlist</h1>
            <p className="text-gray-600">{wishlist.length} items saved</p>
          </div>
          <button onClick={clearWishlist} className="btn-secondary btn-sm">
            Clear All
          </button>
        </div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((item) => (
            <div key={item._id} className="card-elevated group">
              {/* Product Image */}
              <div 
                className="bg-gray-100 rounded-xl h-48 mb-4 flex items-center justify-center overflow-hidden cursor-pointer"
                onClick={() => navigate(`/product/${item._id}`)}
              >
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <span className="text-6xl">📦</span>
                )}
              </div>

              {/* Product Info */}
              <h3 
                className="font-bold text-gray-900 mb-1 line-clamp-2 cursor-pointer hover:text-primary-600"
                onClick={() => navigate(`/product/${item._id}`)}
              >
                {item.name}
              </h3>
              <p className="text-sm text-gray-500 mb-2">{item.category}</p>
              <p className="text-sm text-gray-600 mb-3">{item.shopName}</p>

              {/* Price */}
              <div className="text-2xl font-bold text-primary-600 mb-4">
                {formatPrice(item.price)}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleMoveToCart(item)}
                  className="btn-primary flex-1 btn-sm flex items-center justify-center gap-2"
                >
                  <ShoppingCartIcon className="w-4 h-4" />
                  Add to Cart
                </button>
                <button
                  onClick={() => removeFromWishlist(item._id)}
                  className="btn-danger btn-sm flex items-center justify-center"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>

              {/* Added Date */}
              <p className="text-xs text-gray-500 mt-3">
                Added {new Date(item.addedAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default WishlistPage;
