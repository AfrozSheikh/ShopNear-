import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ArrowLeftIcon, ShoppingCartIcon, StarIcon, HeartIcon } from '@heroicons/react/24/outline';
import { productService, shopService, reviewService } from '../services';
import { showError } from '../utils/toast';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { formatIndianCurrency } from '../utils/indianFormatters';
import ReviewForm from '../components/product/ReviewForm';
import ReviewsList from '../components/product/ReviewsList';

const ProductDetailPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [product, setProduct] = useState(null);
  const [shop, setShop] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    loadProduct();
    loadReviews();
  }, [productId]);

  const loadProduct = async () => {
    try {
      const response = await productService.getProductById(productId);
      setProduct(response.data);
      
      if (response.data.shopId) {
        const shopResponse = await shopService.getShopById(response.data.shopId);
        setShop(shopResponse.data);
      }
    } catch (error) {
      showError('Failed to load product');
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async () => {
    try {
      const response = await reviewService.getProductReviews(productId);
      setReviews(response.data.reviews);
      setReviewStats(response.data.stats);
    } catch (error) {
      console.error('Failed to load reviews:', error);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleReviewSubmitted = (newReview) => {
    setReviews([newReview, ...reviews]);
    setShowReviewForm(false);
    loadReviews(); // Reload to get updated stats
  };

  const handleHelpfulClick = async (reviewId) => {
    try {
      await reviewService.markHelpful(reviewId);
      loadReviews(); // Reload to get updated helpful counts
    } catch (error) {
      showError('Failed to update review');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="skeleton h-12 w-12 rounded-full"></div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <>
      <Toaster />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Back
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Product Image */}
          <div className="bg-gray-100 rounded-2xl aspect-square flex items-center justify-center overflow-hidden">
            {product.images && product.images.length > 0 ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-9xl">📦</span>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-4xl font-bold text-gray-900 flex-1">{product.name}</h1>
              <button
                onClick={() => toggleWishlist(product)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <HeartIcon 
                  className={`w-8 h-8 ${isInWishlist(product._id) ? 'text-red-500 fill-current' : 'text-gray-400'}`} 
                />
              </button>
            </div>
            
            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm text-gray-500">{product.category}</span>
              {product.inventory?.available ? (
                <span className="badge badge-success">In Stock</span>
              ) : (
                <span className="badge badge-danger">Out of Stock</span>
              )}
            </div>

            {/* Rating */}
            {reviewStats && reviewStats.totalReviews > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon
                      key={star}
                      className={`w-5 h-5 ${
                        star <= Math.round(reviewStats.averageRating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {reviewStats.averageRating.toFixed(1)} ({reviewStats.totalReviews} reviews)
                </span>
              </div>
            )}

            <div className="text-4xl font-bold text-primary-600 mb-6">
              {formatIndianCurrency(product.price)}
              <span className="text-lg text-gray-500 ml-2">/ {product.unit}</span>
            </div>

            <div className="prose prose-gray mb-6">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-700">{product.description}</p>
            </div>

            {/* Shop Info */}
            {shop && (
              <div className="card mb-4">
                <h3 className="font-semibold text-gray-900 mb-2">Sold by</h3>
                <p className="text-lg font-medium text-primary-600">{shop.name}</p>
                <p className="text-sm text-gray-600">{shop.address.street}, {shop.address.city}</p>
                {shop.deliveryEnabled && (
                  <p className="text-sm text-green-600 mt-1">
                    🚚 Delivery available ({shop.deliveryRadius} km)
                  </p>
                )}
              </div>
            )}

            {/* WhatsApp Contact Button */}
            {shop && shop.phone && (
              <a
                href={`https://wa.me/91${shop.phone.replace(/\D/g, '')}?text=Hi, I'm interested in ${encodeURIComponent(product.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary w-full flex items-center justify-center gap-2 mb-6"
              >
                <span className="text-xl">💬</span>
                Contact on WhatsApp
              </a>
            )}

            {/* Stock Info */}
            <div className="mb-6">
              <p className="text-sm text-gray-600">
                Available: {product.inventory?.totalQuantity || 0} units
              </p>
            </div>

            {/* Quantity Selector */}
            {product.inventory?.available && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Quantity
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="px-6 py-2 font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.inventory?.totalQuantity, quantity + 1))}
                      className="px-4 py-2 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-sm text-gray-500">
                    Max: {product.inventory?.totalQuantity || 0}
                  </span>
                </div>
              </div>
            )}

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={!product.inventory?.available}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCartIcon className="w-5 h-5" />
              {product.inventory?.available ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="border-t pt-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900">Customer Reviews</h2>
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="btn-primary btn-sm"
            >
              {showReviewForm ? 'Cancel' : 'Write a Review'}
            </button>
          </div>

          {showReviewForm && (
            <div className="mb-8">
              <ReviewForm
                productId={productId}
                onReviewSubmitted={handleReviewSubmitted}
                onCancel={() => setShowReviewForm(false)}
              />
            </div>
          )}

          <ReviewsList reviews={reviews} onHelpfulClick={handleHelpfulClick} />
        </div>
      </div>
    </>
  );
};

export default ProductDetailPage;
