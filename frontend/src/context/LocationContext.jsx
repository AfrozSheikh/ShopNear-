import { createContext, useState, useContext, useEffect } from 'react';

const LocationContext = createContext(null);

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user's current location
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLoading(false);
        },
        (err) => {
          setError(err.message);
          setLoading(false);
          // Set default location (e.g., Pune, India)
          setLocation({ lat: 18.5204, lng: 73.8567 });
        }
      );
    } else {
      setError('Geolocation not supported');
      setLoading(false);
      setLocation({ lat: 18.5204, lng: 73.8567 });
    }
  }, []);

  const value = {
    location,
    error,
    loading,
    setLocation,
  };

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within LocationProvider');
  }
  return context;
};
