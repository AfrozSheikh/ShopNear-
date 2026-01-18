import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { showSuccess, showError } from '../../utils/toast';
import { productService } from '../../services';
import ImageUpload from '../common/ImageUpload';

const CreateProductModal = ({ isOpen, onClose, onProductCreated, onProductUpdated, shopId, product }) => {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Electronics',
    price: '',
    unit: 'piece',
    initialStock: '',
  });

  const categories = [
    'Electronics',
    'Clothing',
    'Food & Beverages',
    'Groceries',
    'Books',
    'Health & Beauty',
    'Sports',
    'Toys',
    'Home & Kitchen',
    'Other',
  ];

  const units = ['piece', 'kg', 'liter', 'meter', 'pack', 'box'];

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        category: product.category || 'Electronics',
        price: product.price || '',
        unit: product.unit || 'piece',
        initialStock: product.inventory?.totalQuantity || '',
      });
      // Set existing images if available
      if (product.images && product.images.length > 0) {
        setImages(product.images.map((url, index) => ({
          preview: url,
          file: null,
          isPrimary: index === 0,
        })));
      }
    } else {
      setFormData({
        name: '',
        description: '',
        category: 'Electronics',
        price: '',
        unit: 'piece',
        initialStock: '',
      });
      setImages([]);
    }
  }, [product]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        price: parseFloat(formData.price),
        unit: formData.unit,
        shopId: shopId,
        images: images.map(img => img.preview), // Store image URLs
      };

      if (product) {
        // Update existing product
        const response = await productService.updateProduct(product._id, productData);
        showSuccess('Product updated successfully!');
        onProductUpdated(response.data);
      } else {
        // Create new product
        productData.initialStock = parseInt(formData.initialStock);
        const response = await productService.createProduct(productData);
        showSuccess('Product created successfully!');
        onProductCreated(response.data);
      }

      onClose();
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-large max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={onClose} className="icon-button">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Product Images */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Product Images
            </label>
            <ImageUpload
              images={images}
              onImagesChange={setImages}
              maxImages={5}
            />
            <p className="text-xs text-gray-500 mt-2">
              Upload up to 5 images. First image will be the primary image.
            </p>
          </div>

          {/* Product Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              required
              className="input-field"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Samsung Galaxy S21"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              required
              rows={4}
              className="input-field"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your product..."
            />
          </div>

          {/* Category and Unit */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category *
              </label>
              <select
                required
                className="input-field"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Unit *
              </label>
              <select
                required
                className="input-field"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              >
                {units.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Price and Initial Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Price (₹) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                className="input-field"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="99.99"
              />
            </div>

            {!product && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Initial Stock *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  className="input-field"
                  value={formData.initialStock}
                  onChange={(e) => setFormData({ ...formData, initialStock: e.target.value })}
                  placeholder="100"
                />
              </div>
            )}
          </div>

          {product && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> To update stock quantity, use the Inventory Management section.
              </p>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex-1"
              disabled={loading}
            >
              {loading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProductModal;
