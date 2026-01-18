import { createContext, useContext, useState, useEffect } from 'react';
import { showSuccess } from '../utils/toast';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to load cart:', error);
        localStorage.removeItem('cart');
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.productId === product._id);

      if (existingItem) {
        return prevCart.map((item) =>
          item.productId === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [
        ...prevCart,
        {
          productId: product._id,
          name: product.name,
          price: product.price,
          unit: product.unit,
          shopId: product.shopId?._id || product.shopId,
          shopName: product.shopId?.name || 'Unknown Shop',
          quantity,
          image: product.images?.[0] || null,
        },
      ];
    });

    showSuccess(`${product.name} added to cart!`);
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.productId !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const getItemsByShop = () => {
    const shops = {};
    cart.forEach((item) => {
      if (!shops[item.shopId]) {
        shops[item.shopId] = {
          shopId: item.shopId,
          shopName: item.shopName,
          items: [],
        };
      }
      shops[item.shopId].items.push(item);
    });
    return Object.values(shops);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        getItemsByShop,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
