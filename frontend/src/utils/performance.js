// Performance optimization utilities

import { lazy, Suspense } from 'react';

// Loading component for lazy loaded routes
export const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="flex flex-col items-center gap-4">
      <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

// Lazy load wrapper with error boundary
export const lazyLoad = (importFunc) => {
  const LazyComponent = lazy(importFunc);
  
  return (props) => (
    <Suspense fallback={<PageLoader />}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

// Image lazy loading utility
export const LazyImage = ({ src, alt, className, placeholder }) => {
  const [imageSrc, setImageSrc] = useState(placeholder || '/placeholder.png');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setImageSrc(src);
      setIsLoading(false);
    };
  }, [src]);

  return (
    <div className={`relative ${className}`}>
      <img
        src={imageSrc}
        alt={alt}
        className={`transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-primary-600 rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

// Debounce function for search inputs
export const debounce = (func, delay = 300) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Throttle function for scroll events
export const throttle = (func, limit = 100) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Intersection Observer hook for infinite scroll
export const useIntersectionObserver = (callback, options = {}) => {
  const targetRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          callback();
        }
      });
    }, options);

    const currentTarget = targetRef.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [callback, options]);

  return targetRef;
};

// Local storage with expiry
export const setWithExpiry = (key, value, ttl) => {
  const now = new Date();
  const item = {
    value: value,
    expiry: now.getTime() + ttl,
  };
  localStorage.setItem(key, JSON.stringify(item));
};

export const getWithExpiry = (key) => {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) {
    return null;
  }

  const item = JSON.parse(itemStr);
  const now = new Date();

  if (now.getTime() > item.expiry) {
    localStorage.removeItem(key);
    return null;
  }

  return item.value;
};
