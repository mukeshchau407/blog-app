import React from "react";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";

const Header = ({ currentPage, onNavigate }) => {
  const { user, logout, isAdmin, canWrite } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="header">
      <div className="header-content">
        <button onClick={() => onNavigate("dashboard")} className="logo">
          <span className="logo-icon">✦</span>
          <span className="logo-text">Chronicle</span>
        </button>

        <nav className="nav">
          <button
            onClick={() => onNavigate("dashboard")}
            className={currentPage === "dashboard" ? "active" : ""}
          >
            Stories
          </button>
          {canWrite && (
            <button
              onClick={() => onNavigate("create")}
              className={currentPage === "create" ? "active" : ""}
            >
              Write
            </button>
          )}
        </nav>

        <div className="header-actions">
          <button
            onClick={toggleTheme}
            className="icon-button"
            title="Toggle theme"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>

          {user ? (
            <>
              <div className="user-info">
                <span className="user-name">{user.name}</span>
                {isAdmin && <span className="admin-badge">Admin</span>}
                {user.role === "author" && (
                  <span className="author-badge">Author</span>
                )}
              </div>
              <button onClick={logout} className="btn-secondary">
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onNavigate("login")}
                className="btn-secondary"
              >
                Login
              </button>
              <button
                onClick={() => onNavigate("register")}
                className="btn-primary"
              >
                Register
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
