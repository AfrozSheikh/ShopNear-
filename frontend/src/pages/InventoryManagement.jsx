import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ArrowLeftIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline';
import { showSuccess, showError } from '../utils/toast';

const InventoryManagement = () => {
  const { shopId, productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [inventory, setInventory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adjustmentType, setAdjustmentType] = useState('add'); // add or remove
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState('');

  useEffect(() => {
    loadInventory();
  }, [productId]);

  const loadInventory = async () => {
    try {
      // TODO: Replace with actual API calls
      const mockProduct = {
        _id: productId,
        name: 'Sample Product',
        unit: 'piece',
      };
      
      const mockInventory = {
        productId: productId,
        totalQuantity: 150,
        reserved: 25,
        available: 125,
        history: [
          {
            type: 'add',
            quantity: 50,
            reason: 'New stock arrival',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            performedBy: 'Admin',
          },
          {
            type: 'remove',
            quantity: 10,
            reason: 'Damaged items',
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            performedBy: 'Admin',
          },
          {
            type: 'reserved',
            quantity: 5,
            reason: 'Order #12345',
            timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
          },
        ],
      };

      setProduct(mockProduct);
      setInventory(mockInventory);
    } catch (error) {
      showError('Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  const handleAdjustment = async (e) => {
    e.preventDefault();

    if (!reason.trim()) {
      showError('Please provide a reason for adjustment');
      return;
    }

    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newHistory = {
        type: adjustmentType,
        quantity,
        reason,
        timestamp: new Date(),
        performedBy: 'Shop Owner',
      };

      const newTotal = adjustmentType === 'add' 
        ? inventory.totalQuantity + quantity
        : inventory.totalQuantity - quantity;

      setInventory({
        ...inventory,
        totalQuantity: newTotal,
        available: newTotal - inventory.reserved,
        history: [newHistory, ...inventory.history],
      });

      showSuccess(`Inventory ${adjustmentType === 'add' ? 'increased' : 'decreased'} by ${quantity}`);
      
      // Reset form
      setQuantity(1);
      setReason('');
    } catch (error) {
      showError('Failed to adjust inventory');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="skeleton h-12 w-12 rounded-full"></div>
      </div>
    );
  }

  if (!inventory) return null;

  return (
    <>
      <Toaster />
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <button
          onClick={() => navigate(`/shop/${shopId}/products`)}
          className="flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Back to Products
        </button>

        <h1 className="text-4xl font-bold text-gray-900 mb-2">Inventory Management</h1>
        <p className="text-gray-600 mb-8">{product.name}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Current Stock Cards */}
          <div className="card-elevated">
            <div className="text-sm text-gray-600 mb-1">Total Stock</div>
            <div className="text-3xl font-bold text-gray-900">{inventory.totalQuantity}</div>
            <div className="text-sm text-gray-500">{product.unit}(s)</div>
          </div>

          <div className="card-elevated">
            <div className="text-sm text-gray-600 mb-1">Reserved</div>
            <div className="text-3xl font-bold text-yellow-600">{inventory.reserved}</div>
            <div className="text-sm text-gray-500">In orders</div>
          </div>

          <div className="card-elevated">
            <div className="text-sm text-gray-600 mb-1">Available</div>
            <div className="text-3xl font-bold text-green-600">{inventory.available}</div>
            <div className="text-sm text-gray-500">For sale</div>
          </div>
        </div>

        {/* Adjustment Form */}
        <div className="card-elevated mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Adjust Inventory</h3>
          
          <form onSubmit={handleAdjustment} className="space-y-4">
            {/* Adjustment Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Adjustment Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAdjustmentType('add')}
                  className={`p-4 border-2 rounded-xl transition-all ${
                    adjustmentType === 'add'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <PlusIcon className="w-6 h-6 mx-auto mb-2 text-green-600" />
                  <div className="font-semibold">Add Stock</div>
                </button>

                <button
                  type="button"
                  onClick={() => setAdjustmentType('remove')}
                  className={`p-4 border-2 rounded-xl transition-all ${
                    adjustmentType === 'remove'
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <MinusIcon className="w-6 h-6 mx-auto mb-2 text-red-600" />
                  <div className="font-semibold">Remove Stock</div>
                </button>
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Quantity ({product.unit}s)
              </label>
              <input
                type="number"
                required
                min="1"
                className="input-field"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              />
            </div>

            {/* Reason */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Reason *
              </label>
              <textarea
                required
                rows={3}
                className="input-field"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g., New stock arrival, Damaged items, Return from customer"
              />
            </div>

            <button type="submit" className="btn-primary w-full">
              {adjustmentType === 'add' ? 'Add' : 'Remove'} {quantity} {product.unit}(s)
            </button>
          </form>
        </div>

        {/* History */}
        <div className="card-elevated">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Inventory History</h3>
          
          <div className="space-y-3">
            {inventory.history.map((entry, index) => (
              <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    entry.type === 'add'
                      ? 'bg-green-100 text-green-600'
                      : entry.type === 'remove'
                      ? 'bg-red-100 text-red-600'
                      : 'bg-yellow-100 text-yellow-600'
                  }`}
                >
                  {entry.type === 'add' ? '+' : entry.type === 'remove' ? '-' : '⏳'}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <div className="font-semibold text-gray-900">
                      {entry.type === 'add' ? 'Added' : entry.type === 'remove' ? 'Removed' : 'Reserved'} {entry.quantity} {product.unit}(s)
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(entry.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm mb-1">{entry.reason}</p>
                  {entry.performedBy && (
                    <p className="text-xs text-gray-500">By: {entry.performedBy}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default InventoryManagement;
