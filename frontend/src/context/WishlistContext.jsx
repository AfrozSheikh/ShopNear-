import { createContext, useContext, useState, useEffect } from 'react';
import { showSuccess } from '../utils/toast';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  // Load wishlist from localStorage
  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (error) {
        console.error('Failed to load wishlist:', error);
        localStorage.removeItem('wishlist');
      }
    }
  }, []);

  // Save wishlist to localStorage
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = (product) => {
    const exists = wishlist.find((item) => item._id === product._id);
    if (exists) {
      return;
    }

    setWishlist([
      ...wishlist,
      {
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || null,
        shopId: product.shopId?._id || product.shopId,
        shopName: product.shopId?.name || 'Unknown Shop',
        category: product.category,
        addedAt: new Date().toISOString(),
      },
    ]);

    showSuccess(`${product.name} added to wishlist!`);
  };

  const removeFromWishlist = (productId) => {
    setWishlist(wishlist.filter((item) => item._id !== productId));
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item._id === productId);
  };

  const clearWishlist = () => {
    setWishlist([]);
    localStorage.removeItem('wishlist');
  };

  const toggleWishlist = (product) => {
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
        toggleWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
