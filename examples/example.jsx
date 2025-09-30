// React JavaScript Example File
// This file demonstrates various React patterns and JSX syntax for theme testing

import React, { useState, useEffect, useContext, createContext, useCallback, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';

// ===== CONTEXT CREATION =====
const UserContext = createContext({
  user: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
});

const ThemeContext = createContext({
  theme: 'light',
  setTheme: () => {},
  isDark: false,
});

// ===== CUSTOM HOOKS =====
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key]);

  return [storedValue, setValue];
};

export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(url, options);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (url) {
      fetchData();
    }
  }, [url, JSON.stringify(options)]);

  return { data, loading, error };
};

// ===== PROVIDERS =====
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = useCallback((userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
  }, []);

  const isAuthenticated = useMemo(() => user !== null, [user]);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const value = useMemo(() => ({
    user,
    login,
    logout,
    isAuthenticated,
  }), [user, login, logout, isAuthenticated]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useLocalStorage('theme', 'light');

  const isDark = useMemo(() => {
    if (theme === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return theme === 'dark';
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const value = useMemo(() => ({
    theme,
    setTheme,
    isDark,
  }), [theme, setTheme, isDark]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// ===== FUNCTIONAL COMPONENTS =====
export const Button = ({
  title,
  children,
  className = '',
  variant = 'primary',
  onClick,
  disabled = false,
  ...props
}) => {
  const baseClasses = 'px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-300',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 disabled:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-red-300',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      onClick={onClick}
      title={title}
      disabled={disabled}
      {...props}
    >
      {children || title}
    </button>
  );
};

Button.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
  className: PropTypes.string,
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger', 'outline']),
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
};

export const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  const modalRef = useRef(null);

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (event) => {
    if (event.target === modalRef.current) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      ref={modalRef}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl ${sizeClasses[size]} w-full`}>
        <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors text-2xl leading-none"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', '2xl']),
};

export const Card = ({ title, children, className = '', variant = 'default' }) => {
  const variantClasses = {
    default: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
    elevated: 'bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700',
    outlined: 'bg-transparent border-2 border-gray-300 dark:border-gray-600',
  };

  return (
    <div className={`rounded-lg ${variantClasses[variant]} ${className}`}>
      {title && (
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

Card.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'elevated', 'outlined']),
};

export const UserCard = ({ user, showDetails = false, onToggleDetails }) => {
  const [isExpanded, setIsExpanded] = useState(showDetails);

  const handleToggle = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    if (onToggleDetails) {
      onToggleDetails(newState);
    }
  };

  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <div className="flex items-center space-x-3">
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={`${user.name}'s avatar`}
            className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium text-lg">
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 dark:text-white truncate">{user.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
          {user.role && (
            <span className="inline-block px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full mt-1">
              {user.role}
            </span>
          )}
        </div>
        <button
          onClick={handleToggle}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1"
          aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
        >
          <svg
            className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500 dark:text-gray-400">User ID:</span>
              <span className="ml-2 text-gray-900 dark:text-white">{user.id}</span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Status:</span>
              <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                user.isActive 
                  ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                  : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
              }`}>
                {user.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Joined:</span>
              <span className="ml-2 text-gray-900 dark:text-white">
                {user.joinDate ? new Date(user.joinDate).toLocaleDateString() : 'N/A'}
              </span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Last Login:</span>
              <span className="ml-2 text-gray-900 dark:text-white">
                {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
              </span>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

UserCard.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    avatar: PropTypes.string,
    role: PropTypes.string,
    isActive: PropTypes.bool,
    joinDate: PropTypes.string,
    lastLogin: PropTypes.string,
  }).isRequired,
  showDetails: PropTypes.bool,
  onToggleDetails: PropTypes.func,
};

export const LoadingSpinner = ({ size = 'md', color = 'primary' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  const colorClasses = {
    primary: 'text-blue-600',
    secondary: 'text-gray-600',
    success: 'text-green-600',
    danger: 'text-red-600',
  };

  return (
    <div className="flex items-center justify-center">
      <svg
        className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  color: PropTypes.oneOf(['primary', 'secondary', 'success', 'danger']),
};

export const SearchInput = ({ value, onChange, placeholder = 'Search...', onClear, debounceMs = 300 }) => {
  const [localValue, setLocalValue] = useState(value || '');
  const debouncedValue = useDebounce(localValue, debounceMs);

  useEffect(() => {
    if (onChange && debouncedValue !== value) {
      onChange(debouncedValue);
    }
  }, [debouncedValue, onChange, value]);

  useEffect(() => {
    setLocalValue(value || '');
  }, [value]);

  const handleClear = () => {
    setLocalValue('');
    if (onClear) {
      onClear();
    }
  };

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      {localValue && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

SearchInput.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  onClear: PropTypes.func,
  debounceMs: PropTypes.number,
};

// ===== MAIN APP COMPONENT =====
export const App = () => {
  const { user, login, logout, isAuthenticated } = useUser();
  const { theme, setTheme, isDark } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    const newUser = {
      id: Date.now(),
      name: 'John Doe',
      email: 'john@example.com',
      avatar: 'https://via.placeholder.com/40',
      role: 'Administrator',
      isActive: true,
      joinDate: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };
    login(newUser);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    // Simulate API call
    if (term) {
      setLoading(true);
      setTimeout(() => {
        const mockUsers = [
          {
            id: 1,
            name: 'Alice Johnson',
            email: 'alice@example.com',
            role: 'Designer',
            isActive: true,
            joinDate: '2023-01-15T00:00:00Z',
            lastLogin: '2024-09-29T10:30:00Z',
          },
          {
            id: 2,
            name: 'Bob Smith',
            email: 'bob@example.com',
            role: 'Developer',
            isActive: false,
            joinDate: '2023-03-20T00:00:00Z',
            lastLogin: '2024-08-15T14:20:00Z',
          },
        ].filter(user => 
          user.name.toLowerCase().includes(term.toLowerCase()) ||
          user.email.toLowerCase().includes(term.toLowerCase())
        );
        setUsers(mockUsers);
        setLoading(false);
      }, 1000);
    } else {
      setUsers([]);
    }
  };

  const themeOptions = [
    { value: 'light', label: '☀️ Light' },
    { value: 'dark', label: '🌙 Dark' },
    { value: 'auto', label: '🔄 Auto' },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDark ? 'dark' : ''}`}>
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 sticky top-0 z-40">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  React JSX Demo
                </h1>
                <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                  v1.0.0
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {themeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {isAuthenticated ? (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Welcome, {user.name}!
                    </span>
                    <Button onClick={logout} variant="secondary" size="sm">
                      Logout
                    </Button>
                  </div>
                ) : (
                  <Button onClick={handleLogin}>
                    Login
                  </Button>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Search Section */}
            <div className="lg:col-span-2">
              <Card title="🔍 Search Users" variant="elevated">
                <div className="space-y-4">
                  <SearchInput
                    value={searchTerm}
                    onChange={handleSearch}
                    placeholder="Search users by name or email..."
                    onClear={() => handleSearch('')}
                  />
                  
                  {loading && (
                    <div className="flex items-center justify-center py-8">
                      <LoadingSpinner size="lg" />
                      <span className="ml-2 text-gray-600 dark:text-gray-400">Searching...</span>
                    </div>
                  )}

                  {!loading && users.length > 0 && (
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Found {users.length} user{users.length !== 1 ? 's' : ''}
                      </p>
                      {users.map((searchUser) => (
                        <UserCard key={searchUser.id} user={searchUser} />
                      ))}
                    </div>
                  )}

                  {!loading && searchTerm && users.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-500 dark:text-gray-400">No users found for "{searchTerm}"</p>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* User Info */}
              {isAuthenticated && user && (
                <Card title="👤 Current User" variant="elevated">
                  <UserCard user={user} showDetails={true} />
                </Card>
              )}

              {/* Actions */}
              <Card title="🛠️ Actions" variant="elevated">
                <div className="space-y-3">
                  <Button 
                    onClick={() => setIsModalOpen(true)} 
                    className="w-full"
                    variant="outline"
                  >
                    📋 Open Modal
                  </Button>
                  <Button 
                    onClick={() => window.location.reload()} 
                    className="w-full"
                    variant="secondary"
                  >
                    🔄 Refresh Page
                  </Button>
                  <Button 
                    onClick={() => console.log('Feature coming soon!')} 
                    className="w-full"
                    variant="danger"
                    disabled
                  >
                    🚀 Coming Soon
                  </Button>
                </div>
              </Card>

              {/* Stats */}
              <Card title="📊 Statistics" variant="elevated">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Theme:</span>
                    <span className="font-medium text-gray-900 dark:text-white capitalize">{theme}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Mode:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {isDark ? 'Dark' : 'Light'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      isAuthenticated 
                        ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                        : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                    }`}>
                      {isAuthenticated ? 'Logged In' : 'Guest'}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </main>

        {/* Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Example Modal Dialog"
          size="lg"
        >
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Modal Content
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                This is an example modal component demonstrating various React patterns including:
              </p>
              <ul className="mt-3 list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
                <li>Portal rendering with createPortal</li>
                <li>Event handling and keyboard shortcuts</li>
                <li>Focus management and accessibility</li>
                <li>Responsive design and theming</li>
              </ul>
            </div>
            
            <div className="border-t dark:border-gray-700 pt-4">
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => setIsModalOpen(false)} variant="primary">
                  ✓ Confirm
                </Button>
                <Button onClick={() => setIsModalOpen(false)} variant="secondary">
                  ✕ Cancel
                </Button>
                <Button onClick={() => alert('Action clicked!')} variant="outline">
                  ⚡ Action
                </Button>
              </div>
            </div>
          </div>
        </Modal>

        {/* Footer */}
        <footer className="bg-white dark:bg-gray-800 border-t dark:border-gray-700 mt-12">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
              <p>React JSX Example • Built with React {React.version} • Theme: {theme}</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

// ===== HIGHER-ORDER COMPONENT =====
export const withAuth = (WrappedComponent) => {
  const AuthenticatedComponent = (props) => {
    const { isAuthenticated } = useUser();

    if (!isAuthenticated) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
          <Card className="max-w-md w-full mx-4">
            <div className="text-center space-y-4">
              <div className="text-6xl">🔒</div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Authentication Required
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Please log in to access this content.
              </p>
              <Button onClick={() => window.location.reload()}>
                Refresh to Login
              </Button>
            </div>
          </Card>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };

  AuthenticatedComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name})`;
  
  return AuthenticatedComponent;
};

// ===== EXPORT DEFAULT =====
export default function AppWithProviders() {
  return (
    <UserProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </UserProvider>
  );
}