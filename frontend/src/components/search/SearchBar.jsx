import { useState, useEffect, useRef } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { searchService } from '../../services';

const SearchBar = ({ onSearch, placeholder = "Search products..." }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      try {
        // TODO: Replace with actual autocomplete API
        const mockSuggestions = [
          { type: 'product', name: `${query} - Product 1`, id: '1' },
          { type: 'product', name: `${query} - Product 2`, id: '2' },
          { type: 'shop', name: `${query} Shop`, id: '3' },
          { type: 'category', name: query.charAt(0).toUpperCase() + query.slice(1), id: '4' },
        ];
        setSuggestions(mockSuggestions);
      } catch (error) {
        console.error('Failed to fetch suggestions:', error);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    if (suggestion.type === 'product') {
      navigate(`/product/${suggestion.id}`);
    } else if (suggestion.type === 'shop') {
      // Navigate to shop page
    } else if (suggestion.type === 'category') {
      onSearch(suggestion.name);
    }
    setQuery('');
    setShowSuggestions(false);
  };

  const getSuggestionIcon = (type) => {
    switch (type) {
      case 'product':
        return '📦';
      case 'shop':
        return '🏪';
      case 'category':
        return '🏷️';
      default:
        return '🔍';
    }
  };

  return (
    <div ref={searchRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          placeholder={placeholder}
          className="input-field pl-10 pr-10"
        />
        
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setSuggestions([]);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        )}
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && (suggestions.length > 0 || loading) && (
        <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-96 overflow-y-auto z-50">
          {loading ? (
            <div className="p-4 text-center text-gray-500">Loading...</div>
          ) : (
            <div className="py-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
                >
                  <span className="text-2xl">{getSuggestionIcon(suggestion.type)}</span>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{suggestion.name}</div>
                    <div className="text-xs text-gray-500 capitalize">{suggestion.type}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
