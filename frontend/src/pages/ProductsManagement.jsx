import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ArrowLeftIcon, PlusIcon, PencilIcon, TrashIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { productService, shopService } from '../services';
import { showSuccess, showError } from '../utils/toast';
import CreateProductModal from '../components/product/CreateProductModal';

const ProductsManagement = () => {
  const { shopId } = useParams();
  const navigate = useNavigate();
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    loadData();
  }, [shopId]);

  const loadData = async () => {
    try {
      const [shopRes, productsRes] = await Promise.all([
        shopService.getShopById(shopId),
        productService.getShopProducts(shopId),
      ]);
      setShop(shopRes.data);
      setProducts(productsRes.data);
    } catch (error) {
      showError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleProductCreated = (newProduct) => {
    setProducts([...products, newProduct]);
    setShowCreateModal(false);
  };

  const handleProductUpdated = (updatedProduct) => {
    setProducts(products.map((p) => (p._id === updatedProduct._id ? updatedProduct : p)));
    setSelectedProduct(null);
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await productService.deleteProduct(productId);
      setProducts(products.filter((p) => p._id !== productId));
      showSuccess('Product deleted successfully');
    } catch (error) {
      showError('Failed to delete product');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="skeleton h-12 w-12 rounded-full"></div>
      </div>
    );
  }

  return (
    <>
      <Toaster />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/shop-dashboard')}
            className="flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-4"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Back to Shops
          </button>

          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {shop?.name} - Products
              </h1>
              <p className="text-gray-600">Manage products and inventory</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary flex items-center gap-2"
            >
              <PlusIcon className="w-5 h-5" />
              Add Product
            </button>
          </div>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="card-elevated text-center py-16">
            <PhotoIcon className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Products Yet</h3>
            <p className="text-gray-600 mb-6">Add your first product to start selling</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary"
            >
              <PlusIcon className="w-5 h-5 inline mr-2" />
              Add First Product
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product._id} className="card-elevated group">
                {/* Product Image */}
                <div className="bg-gray-100 rounded-xl h-48 mb-4 flex items-center justify-center overflow-hidden">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <PhotoIcon className="w-16 h-16 text-gray-300" />
                  )}
                </div>

                {/* Product Info */}
                <h3 className="text-lg font-bold text-gray-900 mb-1">{product.name}</h3>
                <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>

                {/* Price & Stock */}
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold text-primary-600">
                    ₹{(product.price || 0).toFixed(2)}
                  </span>
                  <span className={`badge ${product.inventory?.available ? 'badge-success' : 'badge-danger'}`}>
                    {product.inventory?.available ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>

                <div className="text-sm text-gray-600 mb-4">
                  Stock: {product.inventory?.totalQuantity || 0} units
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedProduct(product);
                      setShowCreateModal(true);
                    }}
                    className="btn-secondary flex-1 btn-sm flex items-center justify-center gap-2"
                  >
                    <PencilIcon className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product._id)}
                    className="btn-danger btn-sm flex items-center justify-center gap-2"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create/Edit Product Modal */}
        <CreateProductModal
          isOpen={showCreateModal}
          onClose={() => {
            setShowCreateModal(false);
            setSelectedProduct(null);
          }}
          onProductCreated={handleProductCreated}
          onProductUpdated={handleProductUpdated}
          shopId={shopId}
          product={selectedProduct}
        />
      </div>
    </>
  );
};

export default ProductsManagement;
