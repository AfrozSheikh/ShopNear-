import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { SalesChart, OrdersChart, ProductCategoryChart } from '../components/charts/Charts';
import { showError } from '../utils/toast';

const ShopAnalytics = () => {
  const { shopId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    loadAnalytics();
  }, [shopId]);

  const loadAnalytics = async () => {
    try {
      // TODO: Replace with actual API call
      // Simulating analytics data
      const mockAnalytics = {
        revenue: {
          total: 45600,
          thisMonth: 12500,
          growth: 15.5,
        },
        orders: {
          total: 234,
          pending: 12,
          completed: 198,
          rejected: 24,
        },
        products: {
          total: 45,
          active: 42,
          outOfStock: 3,
        },
        salesData: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          values: [4500, 5200, 4800, 6100, 5900, 7200, 6800],
        },
        ordersData: {
          labels: ['Requested', 'Accepted', 'Completed', 'Rejected'],
          values: [12, 45, 198, 24],
        },
        categoryData: {
          labels: ['Electronics', 'Clothing', 'Food', 'Books', 'Other'],
          values: [12, 8, 15, 5, 5],
        },
        topProducts: [
          { name: 'Product A', sales: 145, revenue: 7250 },
          { name: 'Product B', sales: 98, revenue: 4900 },
          { name: 'Product C', sales: 76, revenue: 3800 },
          { name: 'Product D', sales: 65, revenue: 3250 },
          { name: 'Product E', sales: 54, revenue: 2700 },
        ],
      };

      setAnalytics(mockAnalytics);
    } catch (error) {
      showError('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="skeleton h-12 w-12 rounded-full"></div>
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <>
      <Toaster />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <button
          onClick={() => navigate('/shop-dashboard')}
          className="flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Back to Dashboard
        </button>

        <h1 className="text-4xl font-bold text-gray-900 mb-8">Shop Analytics</h1>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card-elevated">
            <div className="text-sm text-gray-600 mb-1">Total Revenue</div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              ₹{analytics.revenue.total.toLocaleString()}
            </div>
            <div className="text-sm text-green-600">+{analytics.revenue.growth}% this month</div>
          </div>

          <div className="card-elevated">
            <div className="text-sm text-gray-600 mb-1">Total Orders</div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{analytics.orders.total}</div>
            <div className="text-sm text-gray-500">{analytics.orders.pending} pending</div>
          </div>

          <div className="card-elevated">
            <div className="text-sm text-gray-600 mb-1">Active Products</div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{analytics.products.active}</div>
            <div className="text-sm text-gray-500">of {analytics.products.total} total</div>
          </div>

          <div className="card-elevated">
            <div className="text-sm text-gray-600 mb-1">This Month</div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              ₹{analytics.revenue.thisMonth.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">Revenue</div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="card-elevated">
            <SalesChart data={analytics.salesData} />
          </div>

          <div className="card-elevated">
            <OrdersChart data={analytics.ordersData} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="card-elevated lg:col-span-1">
            <ProductCategoryChart data={analytics.categoryData} />
          </div>

          {/* Top Products */}
          <div className="card-elevated lg:col-span-2">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Top Selling Products</h3>
            <div className="space-y-3">
              {analytics.topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <span className="font-medium text-gray-900">{product.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">₹{product.revenue.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">{product.sales} sales</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShopAnalytics;
