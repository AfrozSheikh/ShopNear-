// Loading Spinner Component
export const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`${sizeClasses[size]} border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin`}></div>
    </div>
  );
};

// Empty State Component
export const EmptyState = ({ icon, title, description, action }) => {
  return (
    <div className="text-center py-12">
      {icon && <div className="text-6xl mb-4">{icon}</div>}
      <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
      {description && <p className="text-gray-600 mb-6">{description}</p>}
      {action && action}
    </div>
  );
};

// Status Badge Component
export const StatusBadge = ({ status, type = 'order' }) => {
  const getOrderColor = (status) => {
    switch (status) {
      case 'requested':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getShopColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const colorClass = type === 'order' ? getOrderColor(status) : getShopColor(status);

  return (
    <span className={`badge ${colorClass} text-xs uppercase`}>
      {status}
    </span>
  );
};

// Confirmation Dialog Component
export const useConfirm = () => {
  const confirm = (message) => {
    return window.confirm(message);
  };

  return confirm;
};

// Price Formatter
export const formatPrice = (price) => {
  return `₹${parseFloat(price).toFixed(2)}`;
};

// Date Formatter
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Distance Formatter
export const formatDistance = (meters) => {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
};
