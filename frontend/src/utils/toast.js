import toast from 'react-hot-toast';

export const showSuccess = (message) => {
  toast.success(message, {
    duration: 3000,
    position: 'top-right',
    style: {
      background: '#10b981',
      color: '#fff',
      fontWeight: '500',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#10b981',
    },
  });
};

export const showError = (message) => {
  toast.error(message, {
    duration: 4000,
    position: 'top-right',
    style: {
      background: '#ef4444',
      color: '#fff',
      fontWeight: '500',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#ef4444',
    },
  });
};

export const showLoading = (message = 'Loading...') => {
  return toast.loading(message, {
    position: 'top-right',
  });
};

export const dismissToast = (toastId) => {
  toast.dismiss(toastId);
};
