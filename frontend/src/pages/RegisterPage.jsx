import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { validateEmail, validatePassword } from "../utils/Validation.js";

const RegisterPage = ({ onNavigate }) => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }
    if (!validateEmail(formData.email)) {
      newErrors.email = "Invalid email address";
    }
    if (!validatePassword(formData.password)) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await register(formData.name, formData.email, formData.password);
      onNavigate("dashboard");
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1 className="auth-title">Become an Author</h1>
          <p className="auth-subtitle">
            Start sharing your stories with the world
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="John Doe"
              className={errors.name ? "error" : ""}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="you@example.com"
              className={errors.email ? "error" : ""}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="••••••••"
              className={errors.password ? "error" : ""}
            />
            {errors.password && (
              <span className="error-text">{errors.password}</span>
            )}
          </div>

          {errors.submit && <div className="error-banner">{errors.submit}</div>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Creating account..." : "Register as Author"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{" "}
            <button onClick={() => onNavigate("login")} className="link-button">
              Sign in
            </button>
          </p>
          <p style={{ marginTop: "0.5rem" }}>
            <button
              onClick={() => onNavigate("dashboard")}
              className="link-button"
            >
              ← Browse as Guest
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
