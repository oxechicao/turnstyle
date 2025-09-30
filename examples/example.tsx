// React TypeScript Example File
// This file demonstrates various React patterns and TypeScript syntax for theme testing

import * as React from "react";
import {
  useState,
  useEffect,
  useContext,
  createContext,
  useCallback,
  useMemo,
  useRef,
} from "react";

// ===== INTERFACES AND TYPES =====
interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  isActive?: boolean;
  joinDate?: string;
  lastLogin?: string;
}

interface UserContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

type Theme = "light" | "dark" | "auto";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
}

interface ButtonProps {
  title: string;
  children?: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "danger" | "outline";
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

interface UserCardProps {
  user: User;
  showDetails?: boolean;
}

// ===== CONTEXT CREATION =====
const UserContext = createContext<UserContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
});

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  setTheme: () => {},
  isDark: false,
});

// ===== CUSTOM HOOKS =====
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

// Generic hook with trailing comma to avoid JSX conflict
export const useLocalStorage = function <T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T) => {
      try {
        setStoredValue(value);
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key]
  );

  return [storedValue, setValue];
};

export const useDebounce = function <T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

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

// ===== PROVIDERS =====
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback((userData: User) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeUser("user");
  }, []);

  const isAuthenticated = useMemo(() => user !== null, [user]);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Error parsing saved user:", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      isAuthenticated,
    }),
    [user, login, logout, isAuthenticated]
  );

  return React.createElement(UserContext.Provider, { value }, children);
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useLocalStorage<Theme>("theme", "light");

  const isDark = useMemo(() => {
    if (theme === "auto") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return theme === "dark";
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      isDark ? "dark" : "light"
    );
  }, [isDark]);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      isDark,
    }),
    [theme, setTheme, isDark]
  );

  return React.createElement(ThemeContext.Provider, { value }, children);
};

// ===== FUNCTIONAL COMPONENTS =====
export const Button: React.FC<ButtonProps> = ({
  title,
  children,
  className = "",
  variant = "primary",
  onClick,
  disabled = false,
  ...props
}) => {
  const baseClasses =
    "px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2";
  const variantClasses: Record<string, string> = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-300",
    secondary:
      "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 disabled:bg-gray-300",
    danger:
      "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-red-300",
    outline:
      "border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500",
  };

  return React.createElement(
    "button",
    {
      className: `${baseClasses} ${variantClasses[variant]} ${className}`,
      onClick,
      title,
      disabled,
      ...props,
    },
    children || title
  );
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const sizeClasses: Record<string, string> = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === modalRef.current) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return React.createElement(
    "div",
    {
      ref: modalRef,
      className:
        "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4",
      onClick: handleBackdropClick,
    },
    React.createElement(
      "div",
      {
        className: `bg-white dark:bg-gray-800 rounded-lg shadow-xl ${sizeClasses[size]} w-full`,
      },
      [
        React.createElement(
          "div",
          {
            key: "header",
            className:
              "flex items-center justify-between p-6 border-b dark:border-gray-700",
          },
          [
            React.createElement(
              "h2",
              {
                key: "title",
                className:
                  "text-xl font-semibold text-gray-900 dark:text-white",
              },
              title
            ),
            React.createElement(
              "button",
              {
                key: "close",
                onClick: onClose,
                className:
                  "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors text-2xl leading-none",
              },
              "×"
            ),
          ]
        ),
        React.createElement(
          "div",
          {
            key: "content",
            className: "p-6",
          },
          children
        ),
      ]
    )
  );
};

export const UserCard: React.FC<UserCardProps> = ({
  user,
  showDetails = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(showDetails);

  return React.createElement(
    "div",
    {
      className:
        "bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border transition-all duration-200",
    },
    [
      React.createElement(
        "div",
        {
          key: "main",
          className: "flex items-center space-x-3",
        },
        [
          user.avatar
            ? React.createElement("img", {
                key: "avatar",
                src: user.avatar,
                alt: `${user.name}'s avatar`,
                className:
                  "w-12 h-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600",
              })
            : React.createElement(
                "div",
                {
                  key: "avatar",
                  className:
                    "w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium text-lg",
                },
                user.name.charAt(0).toUpperCase()
              ),
          React.createElement(
            "div",
            {
              key: "info",
              className: "flex-1 min-w-0",
            },
            [
              React.createElement(
                "h3",
                {
                  key: "name",
                  className:
                    "font-medium text-gray-900 dark:text-white truncate",
                },
                user.name
              ),
              React.createElement(
                "p",
                {
                  key: "email",
                  className:
                    "text-sm text-gray-500 dark:text-gray-400 truncate",
                },
                user.email
              ),
              user.role &&
                React.createElement(
                  "span",
                  {
                    key: "role",
                    className:
                      "inline-block px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full mt-1",
                  },
                  user.role
                ),
            ]
          ),
          React.createElement(
            "button",
            {
              key: "toggle",
              onClick: () => setIsExpanded(!isExpanded),
              className:
                "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1",
            },
            isExpanded ? "▼" : "▶"
          ),
        ]
      ),
      isExpanded &&
        React.createElement(
          "div",
          {
            key: "details",
            className:
              "mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2",
          },
          React.createElement(
            "div",
            {
              className: "grid grid-cols-2 gap-4 text-sm",
            },
            [
              React.createElement("div", { key: "id" }, [
                React.createElement(
                  "span",
                  { className: "text-gray-500 dark:text-gray-400" },
                  "User ID:"
                ),
                React.createElement(
                  "span",
                  { className: "ml-2 text-gray-900 dark:text-white" },
                  user.id
                ),
              ]),
              React.createElement("div", { key: "status" }, [
                React.createElement(
                  "span",
                  { className: "text-gray-500 dark:text-gray-400" },
                  "Status:"
                ),
                React.createElement(
                  "span",
                  {
                    className: `ml-2 px-2 py-1 rounded-full text-xs ${
                      user.isActive
                        ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                        : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                    }`,
                  },
                  user.isActive ? "Active" : "Inactive"
                ),
              ]),
            ]
          )
        ),
    ]
  );
};

// ===== MAIN APP COMPONENT =====
export const App: React.FC = () => {
  const { user, login, logout, isAuthenticated } = useUser();
  const { theme, setTheme, isDark } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const handleLogin = () => {
    const newUser: User = {
      id: Date.now(),
      name: "John Doe",
      email: "john@example.com",
      avatar: "https://via.placeholder.com/40",
      role: "Administrator",
      isActive: true,
      joinDate: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };
    login(newUser);
  };

  const themeOptions: { value: Theme; label: string }[] = [
    { value: "light", label: "☀️ Light" },
    { value: "dark", label: "🌙 Dark" },
    { value: "auto", label: "🔄 Auto" },
  ];

  useEffect(() => {
    if (debouncedSearchTerm) {
      console.log("Searching for:", debouncedSearchTerm);
      // Perform search operation here
    }
  }, [debouncedSearchTerm]);

  return React.createElement(
    "div",
    {
      className: `min-h-screen transition-colors duration-200 ${
        isDark ? "dark" : ""
      }`,
    },
    React.createElement(
      "div",
      {
        className: "bg-gray-50 dark:bg-gray-900 min-h-screen",
      },
      [
        // Header
        React.createElement(
          "header",
          {
            key: "header",
            className:
              "bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 sticky top-0 z-40",
          },
          React.createElement(
            "div",
            {
              className: "max-w-6xl mx-auto px-4 py-4",
            },
            React.createElement(
              "div",
              {
                className: "flex items-center justify-between",
              },
              [
                React.createElement(
                  "div",
                  {
                    key: "title",
                    className: "flex items-center space-x-4",
                  },
                  [
                    React.createElement(
                      "h1",
                      {
                        key: "heading",
                        className:
                          "text-2xl font-bold text-gray-900 dark:text-white",
                      },
                      "React TSX Demo"
                    ),
                    React.createElement(
                      "span",
                      {
                        key: "version",
                        className:
                          "px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full",
                      },
                      "v1.0.0"
                    ),
                  ]
                ),
                React.createElement(
                  "div",
                  {
                    key: "controls",
                    className: "flex items-center space-x-4",
                  },
                  [
                    React.createElement(
                      "select",
                      {
                        key: "theme-select",
                        value: theme,
                        onChange: (e: React.ChangeEvent<HTMLSelectElement>) =>
                          setTheme(e.target.value as Theme),
                        className:
                          "px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500",
                      },
                      themeOptions.map((option) =>
                        React.createElement(
                          "option",
                          {
                            key: option.value,
                            value: option.value,
                          },
                          option.label
                        )
                      )
                    ),
                    isAuthenticated
                      ? React.createElement(
                          "div",
                          {
                            key: "auth-section",
                            className: "flex items-center space-x-2",
                          },
                          [
                            React.createElement(
                              "span",
                              {
                                key: "welcome",
                                className:
                                  "text-sm text-gray-600 dark:text-gray-300",
                              },
                              `Welcome, ${user?.name}!`
                            ),
                            React.createElement(Button, {
                              key: "logout",
                              onClick: logout,
                              variant: "secondary",
                              title: "Logout",
                            }),
                          ]
                        )
                      : React.createElement(Button, {
                          key: "login",
                          onClick: handleLogin,
                          title: "Login",
                        }),
                  ]
                ),
              ]
            )
          )
        ),

        // Main Content
        React.createElement(
          "main",
          {
            key: "main",
            className: "max-w-6xl mx-auto px-4 py-8",
          },
          React.createElement(
            "div",
            {
              className: "grid grid-cols-1 lg:grid-cols-3 gap-6",
            },
            [
              // Search Section
              React.createElement(
                "div",
                {
                  key: "search",
                  className: "lg:col-span-2",
                },
                React.createElement(
                  "div",
                  {
                    className:
                      "bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700",
                  },
                  [
                    React.createElement(
                      "div",
                      {
                        key: "header",
                        className:
                          "px-6 py-4 border-b border-gray-200 dark:border-gray-700",
                      },
                      React.createElement(
                        "h2",
                        {
                          className:
                            "text-xl font-semibold text-gray-900 dark:text-white",
                        },
                        "🔍 Search Example"
                      )
                    ),
                    React.createElement(
                      "div",
                      {
                        key: "content",
                        className: "p-6 space-y-4",
                      },
                      [
                        React.createElement("input", {
                          key: "search-input",
                          type: "text",
                          placeholder: "Search...",
                          value: searchTerm,
                          onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                            setSearchTerm(e.target.value),
                          className:
                            "w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500",
                        }),
                        debouncedSearchTerm &&
                          React.createElement(
                            "p",
                            {
                              key: "search-result",
                              className:
                                "text-sm text-gray-600 dark:text-gray-400",
                            },
                            `Searching for: "${debouncedSearchTerm}"`
                          ),
                      ]
                    ),
                  ]
                )
              ),

              // Sidebar
              React.createElement(
                "div",
                {
                  key: "sidebar",
                  className: "space-y-6",
                },
                [
                  // User Info
                  isAuthenticated &&
                    user &&
                    React.createElement(
                      "div",
                      {
                        key: "user-info",
                        className:
                          "bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700",
                      },
                      [
                        React.createElement(
                          "div",
                          {
                            key: "header",
                            className:
                              "px-6 py-4 border-b border-gray-200 dark:border-gray-700",
                          },
                          React.createElement(
                            "h2",
                            {
                              className:
                                "text-xl font-semibold text-gray-900 dark:text-white",
                            },
                            "👤 Current User"
                          )
                        ),
                        React.createElement(
                          "div",
                          {
                            key: "content",
                            className: "p-6",
                          },
                          React.createElement(UserCard, {
                            user,
                            showDetails: true,
                          })
                        ),
                      ]
                    ),

                  // Actions
                  React.createElement(
                    "div",
                    {
                      key: "actions",
                      className:
                        "bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700",
                    },
                    [
                      React.createElement(
                        "div",
                        {
                          key: "header",
                          className:
                            "px-6 py-4 border-b border-gray-200 dark:border-gray-700",
                        },
                        React.createElement(
                          "h2",
                          {
                            className:
                              "text-xl font-semibold text-gray-900 dark:text-white",
                          },
                          "🛠️ Actions"
                        )
                      ),
                      React.createElement(
                        "div",
                        {
                          key: "content",
                          className: "p-6 space-y-3",
                        },
                        React.createElement(Button, {
                          onClick: () => setIsModalOpen(true),
                          title: "📋 Open Modal",
                          className: "w-full",
                          variant: "outline",
                        })
                      ),
                    ]
                  ),
                ]
              ),
            ]
          )
        ),

        // Modal
        React.createElement(
          Modal,
          {
            key: "modal",
            isOpen: isModalOpen,
            onClose: () => setIsModalOpen(false),
            title: "Example Modal Dialog",
            size: "lg",
          },
          React.createElement(
            "div",
            {
              className: "space-y-6",
            },
            [
              React.createElement("div", { key: "modal-content" }, [
                React.createElement(
                  "h3",
                  {
                    key: "modal-title",
                    className:
                      "text-lg font-medium text-gray-900 dark:text-white mb-2",
                  },
                  "Modal Content"
                ),
                React.createElement(
                  "p",
                  {
                    key: "modal-description",
                    className:
                      "text-gray-600 dark:text-gray-300 leading-relaxed",
                  },
                  "This is an example modal component demonstrating TypeScript integration with React."
                ),
              ]),
              React.createElement(
                "div",
                {
                  key: "modal-actions",
                  className:
                    "border-t dark:border-gray-700 pt-4 flex flex-wrap gap-2",
                },
                [
                  React.createElement(Button, {
                    key: "confirm",
                    onClick: () => setIsModalOpen(false),
                    variant: "primary",
                    title: "✓ Confirm",
                  }),
                  React.createElement(Button, {
                    key: "cancel",
                    onClick: () => setIsModalOpen(false),
                    variant: "secondary",
                    title: "✕ Cancel",
                  }),
                ]
              ),
            ]
          )
        ),
      ]
    )
  );
};

// ===== HIGHER-ORDER COMPONENT =====
export const withAuth = function <P extends object>(
  WrappedComponent: React.ComponentType<P>
): React.FC<P> {
  return (props: P) => {
    const { isAuthenticated } = useUser();

    if (!isAuthenticated) {
      return React.createElement(
        "div",
        {
          className:
            "flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900",
        },
        React.createElement(
          "div",
          {
            className:
              "max-w-md w-full mx-4 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6",
          },
          React.createElement(
            "div",
            {
              className: "text-center space-y-4",
            },
            [
              React.createElement(
                "div",
                { key: "icon", className: "text-6xl" },
                "🔒"
              ),
              React.createElement(
                "h2",
                {
                  key: "title",
                  className:
                    "text-xl font-semibold text-gray-900 dark:text-white",
                },
                "Authentication Required"
              ),
              React.createElement(
                "p",
                {
                  key: "description",
                  className: "text-gray-600 dark:text-gray-400",
                },
                "Please log in to access this content."
              ),
            ]
          )
        )
      );
    }

    return React.createElement(WrappedComponent, props);
  };
};

// ===== EXPORT DEFAULT =====
export default function AppWithProviders() {
  return React.createElement(
    UserProvider,
    {},
    React.createElement(ThemeProvider, {}, React.createElement(App))
  );
}

const Foo = () => <Card title="Test" />;
