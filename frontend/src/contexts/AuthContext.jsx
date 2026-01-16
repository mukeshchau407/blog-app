import { createContext, useState, useCallback, useMemo } from "react";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Initialize state from localStorage to avoid setState in effect
  const [user, setUser] = useState(() => {
    const userData = localStorage.getItem("blog_user");
    return userData ? JSON.parse(userData) : null;
  });

  const [loading, setLoading] = useState(false);

  const login = useCallback(async (email, password) => {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email && password) {
          // Check for admin
          const isAdmin = email === "admin@blog.com" && password === "admin123";

          // Check for existing author in localStorage
          const authors = JSON.parse(
            localStorage.getItem("blog_authors") || "[]"
          );
          const existingAuthor = authors.find(
            (a) => a.email === email && a.password === password
          );

          if (!isAdmin && !existingAuthor) {
            reject(new Error("Invalid email or password"));
            return;
          }

          const mockUser = isAdmin
            ? {
                id: 999,
                name: "Admin",
                email: email,
                role: "admin",
              }
            : {
                id: existingAuthor.id,
                name: existingAuthor.name,
                email: existingAuthor.email,
                role: "author",
              };

          const mockToken = `mock_jwt_${Date.now()}`;

          localStorage.setItem("blog_token", mockToken);
          localStorage.setItem("blog_user", JSON.stringify(mockUser));
          setUser(mockUser);
          resolve(mockUser);
        } else {
          reject(new Error("Invalid credentials"));
        }
      }, 800);
    });
  }, []);

  const register = useCallback(async (name, email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (name && email && password) {
          // Check if email already exists
          const authors = JSON.parse(
            localStorage.getItem("blog_authors") || "[]"
          );

          if (authors.some((a) => a.email === email)) {
            reject(new Error("Email already registered"));
            return;
          }

          const newAuthor = {
            id: Date.now(),
            name,
            email,
            password, // In production, this would be hashed!
            role: "author",
            createdAt: new Date().toISOString(),
          };

          // Save to authors list
          authors.push(newAuthor);
          localStorage.setItem("blog_authors", JSON.stringify(authors));

          // Create user session
          const mockUser = {
            id: newAuthor.id,
            name: newAuthor.name,
            email: newAuthor.email,
            role: "author",
          };
          const mockToken = `mock_jwt_${Date.now()}`;

          localStorage.setItem("blog_token", mockToken);
          localStorage.setItem("blog_user", JSON.stringify(mockUser));
          setUser(mockUser);
          resolve(mockUser);
        } else {
          reject(new Error("Registration failed"));
        }
      }, 800);
    });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("blog_token");
    localStorage.removeItem("blog_user");
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      login,
      register,
      logout,
      isAuthenticated: !!user,
      isAdmin: user?.role === "admin",
      isAuthor: user?.role === "author",
      canWrite: user?.role === "admin" || user?.role === "author",
      loading,
    }),
    [user, login, register, logout, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
