import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { BellIcon, XMarkIcon, CheckIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useNotifications } from '../context/NotificationContext';
import { formatDateTime } from '../components/common/UIComponents';

const NotificationsPage = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, clearAll } = useNotifications();
  const [filter, setFilter] = useState('all'); // all, unread, read

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'read') return n.read;
    return true;
  });

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'order':
        return '📦';
      case 'product':
        return '🛍️';
      case 'shop':
        return '🏪';
      case 'payment':
        return '💳';
      case 'review':
        return '⭐';
      case 'system':
        return '⚙️';
      default:
        return '🔔';
    }
  };

  return (
    <>
      <Toaster />
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Notifications</h1>
            <p className="text-gray-600">{unreadCount} unread</p>
          </div>
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} className="btn-secondary btn-sm">
                Mark All Read
              </button>
            )}
            {notifications.length > 0 && (
              <button onClick={clearAll} className="btn-danger btn-sm">
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {['all', 'unread', 'read'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === f
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <div className="card-elevated text-center py-16">
            <BellIcon className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Notifications</h3>
            <p className="text-gray-600">
              {filter === 'unread' ? "You're all caught up!" : "You don't have any notifications yet"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`card flex items-start gap-4 ${
                  !notification.read ? 'bg-blue-50 border-l-4 border-primary-600' : ''
                }`}
              >
                {/* Icon */}
                <div className="text-3xl flex-shrink-0">
                  {getNotificationIcon(notification.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {notification.title}
                  </h3>
                  <p className="text-gray-700 mb-2">{notification.message}</p>
                  <p className="text-sm text-gray-500">
                    {formatDateTime(notification.timestamp)}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 flex-shrink-0">
                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                      title="Mark as read"
                    >
                      <CheckIcon className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notification.id)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default NotificationsPage;
