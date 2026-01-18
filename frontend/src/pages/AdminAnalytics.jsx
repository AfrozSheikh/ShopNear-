import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { UserGroupIcon, ShoppingBagIcon, CurrencyRupeeIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';
import { SalesChart, OrdersChart } from '../components/charts/Charts';
import { showError } from '../utils/toast';

const AdminAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [timeRange, setTimeRange] = useState('7days'); // 7days, 30days, 90days

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    try {
      // TODO: Replace with actual API call
      const mockAnalytics = {
        overview: {
          totalShops: 156,
          totalCustomers: 3245,
          totalOrders: 8932,
          totalRevenue: 1245600,
          growth: {
            shops: 12.5,
            customers: 25.3,
            orders: 18.7,
            revenue: 22.1,
          },
        },
        salesData: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          values: [45000, 52000, 48000, 61000, 59000, 72000, 68000],
        },
        ordersData: {
          labels: ['Requested', 'Accepted', 'Completed', 'Rejected'],
          values: [234, 456, 7890, 352],
        },
        topShops: [
          { name: 'Electronics Hub', orders: 456, revenue: 125600 },
          { name: 'Fashion Store', orders: 398, revenue: 98400 },
          { name: 'Grocery Mart', orders: 312, revenue: 76800 },
          { name: 'Book Corner', orders: 245, revenue: 45600 },
          { name: 'Sports Zone', orders: 198, revenue: 38900 },
        ],
        recentActivity: [
          { type: 'shop', message: 'New shop registered: Tech Store', time: '2 hours ago' },
          { type: 'order', message: 'Order #12345 completed', time: '3 hours ago' },
          { type: 'customer', message: '10 new customers registered', time: '5 hours ago' },
          { type: 'shop', message: 'Shop approved: Fashion Boutique', time: '1 day ago' },
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Platform Analytics</h1>
          
          {/* Time Range Selector */}
          <div className="flex gap-2">
            {[
              { value: '7days', label: '7 Days' },
              { value: '30days', label: '30 Days' },
              { value: '90days', label: '90 Days' },
            ].map((range) => (
              <button
                key={range.value}
                onClick={() => setTimeRange(range.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  timeRange === range.value
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card-elevated">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">Total Shops</div>
              <ShoppingBagIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {analytics.overview.totalShops}
            </div>
            <div className="text-sm text-green-600 flex items-center gap-1">
              <ArrowTrendingUpIcon className="w-4 h-4" />
              +{analytics.overview.growth.shops}%
            </div>
          </div>

          <div className="card-elevated">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">Total Customers</div>
              <UserGroupIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {analytics.overview.totalCustomers.toLocaleString()}
            </div>
            <div className="text-sm text-green-600 flex items-center gap-1">
              <ArrowTrendingUpIcon className="w-4 h-4" />
              +{analytics.overview.growth.customers}%
            </div>
          </div>

          <div className="card-elevated">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">Total Orders</div>
              <ShoppingBagIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {analytics.overview.totalOrders.toLocaleString()}
            </div>
            <div className="text-sm text-green-600 flex items-center gap-1">
              <ArrowTrendingUpIcon className="w-4 h-4" />
              +{analytics.overview.growth.orders}%
            </div>
          </div>

          <div className="card-elevated">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">Total Revenue</div>
              <CurrencyRupeeIcon className="w-6 h-6 text-orange-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              ₹{(analytics.overview.totalRevenue / 1000).toFixed(0)}k
            </div>
            <div className="text-sm text-green-600 flex items-center gap-1">
              <ArrowTrendingUpIcon className="w-4 h-4" />
              +{analytics.overview.growth.revenue}%
            </div>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Shops */}
          <div className="card-elevated">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Top Performing Shops</h3>
            <div className="space-y-3">
              {analytics.topShops.map((shop, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <span className="font-medium text-gray-900">{shop.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">₹{shop.revenue.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">{shop.orders} orders</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card-elevated">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {analytics.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 border-l-4 border-primary-500 bg-gray-50 rounded">
                  <div className="text-2xl">
                    {activity.type === 'shop' && '🏪'}
                    {activity.type === 'order' && '📦'}
                    {activity.type === 'customer' && '👤'}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900">{activity.message}</p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
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

export default AdminAnalytics;
