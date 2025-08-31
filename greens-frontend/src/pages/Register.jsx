import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import img1 from "../assets/img1.png";
import Header from "../components/Header";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "", // Zmienione z firstName i lastName na pojedyncze pole name
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    city: "", // Dodane pole city
    address: "", // Dodane pole address
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register } = useAuth();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Hasła nie są identyczne");
      setLoading(false);
      return;
    }

    try {
      // Przygotuj dane zgodnie ze strukturą API
      const registrationData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.confirmPassword, // Laravel wymaga tego pola
        phone: formData.phone,
        city: formData.city,
        address: formData.address,
        user_type: "client", // Domyślnie client
      };

      await register(registrationData);
      // Pokazuj loading przez 1.5 sekundy dla lepszego UX
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } catch (error) {
      console.error("Registration error:", error);

      // Obsługa różnych typów błędów
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const errorMessages = Object.values(errors).flat();
        setError(errorMessages.join(", "));
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Błąd rejestracji. Spróbuj ponownie.");
      }
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const labelStyles = {
    display: "block",
    marginBottom: "0.5rem",
    fontWeight: "500",
    color: "white",
  };

  const inputStyles = {
    width: "100%",
    padding: "0.75rem",
    border: "2px solid black",
    borderRadius: "0",
    fontSize: "1rem",
    backgroundColor: "white",
    boxSizing: "border-box",
    boxShadow: "5px 5px rgba(249, 115, 22, 1)",
  };

  const passwordContainerStyles = {
    position: "relative",
    display: "flex",
    alignItems: "center",
  };

  const eyeButtonStyles = {
    position: "absolute",
    right: "10px",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "5px",
    color: "#666",
    fontSize: "18px",
    zIndex: 1,
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#45964d",
        fontFamily: "Poppins, sans-serif",
        color: "white",
        position: "relative",
      }}
    >
      {/* Loading Overlay */}
      {loading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(69, 150, 77, 0.9)",
            backdropFilter: "blur(4px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <div
            style={{
              width: "50px",
              height: "50px",
              border: "4px solid rgba(255, 255, 255, 0.3)",
              borderTop: "4px solid white",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          ></div>
          <p
            style={{
              fontSize: "18px",
              fontWeight: "500",
              color: "white",
              margin: 0,
            }}
          >
            Rejestracja...
          </p>
        </div>
      )}

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>

      <Header />

      <main
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: "2rem",
          alignItems: "center",
          width: "100%",
          padding: isMobile ? "0 1.5rem 2rem" : "0 4rem 2rem",
          boxSizing: "border-box",
          marginTop: isMobile ? "1rem" : "4rem",
        }}
      >
        {/* Form Section */}
        <div
          style={{
            width: isMobile ? "100%" : "60%",
            flexShrink: 0,
          }}
        >
          {/* Breadcrumb */}
          <div
            style={{
              marginBottom: "2rem",
              fontSize: "0.85rem",
              color: "rgba(255,255,255,0.8)",
            }}
          >
            Home / Rejestracja
          </div>

          <h1
            style={{
              fontWeight: "600",
              marginBottom: "2rem",
              fontSize: isMobile ? "2rem" : "1.8rem",
              lineHeight: 1.3,
            }}
          >
            <span
              style={{
                boxShadow: "inset 0 -0.4em 0 0 #f97316",
              }}
            >
              Zarejestruj się
            </span>
          </h1>

          {error && (
            <div
              style={{
                backgroundColor: "#fee2e2",
                color: "#dc2626",
                padding: "0.75rem",
                borderRadius: "8px",
                marginBottom: "1rem",
                border: "1px solid #fca5a5",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Name Field */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={labelStyles}>Imię i nazwisko:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Jan Kowalski"
                style={inputStyles}
                required
                disabled={loading}
              />
            </div>

            {/* Email and Phone Row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                gap: "1.5rem",
                marginBottom: "1.5rem",
              }}
            >
              <div>
                <label style={labelStyles}>E-mail:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="jan@example.com"
                  style={inputStyles}
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <label style={labelStyles}>Telefon:</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+48 123 456 789"
                  style={inputStyles}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* City and Address Row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                gap: "1.5rem",
                marginBottom: "1.5rem",
              }}
            >
              <div>
                <label style={labelStyles}>Miasto:</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Warszawa"
                  style={inputStyles}
                  disabled={loading}
                />
              </div>
              <div>
                <label style={labelStyles}>Adres:</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="ul. Przykładowa 123"
                  style={inputStyles}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                gap: "1.5rem",
                marginBottom: "2rem",
              }}
            >
              <div>
                <label style={labelStyles}>Hasło:</label>
                <div style={passwordContainerStyles}>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••••••••••"
                    style={inputStyles}
                    required
                    minLength="8"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    style={eyeButtonStyles}
                    disabled={loading}
                  >
                    {showPassword ? (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label style={labelStyles}>Powtórz hasło:</label>
                <div style={passwordContainerStyles}>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••••••••••"
                    style={inputStyles}
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    style={eyeButtonStyles}
                    disabled={loading}
                  >
                    {showConfirmPassword ? (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                gap: "1rem",
                alignItems: isMobile ? "stretch" : "center",
                justifyContent: "flex-start",
                marginBottom: "2rem",
              }}
            >
              <button
                type="submit"
                disabled={loading}
                style={{
                  backgroundColor: loading ? "#d97706" : "#f97316",
                  color: "white",
                  padding: "0.8rem 2rem",
                  border: "none",
                  borderRadius: "20px",
                  fontSize: "1rem",
                  fontWeight: "500",
                  cursor: loading ? "not-allowed" : "pointer",
                  minWidth: "140px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  transition: "background-color 0.3s ease",
                }}
              >
                {loading && (
                  <div
                    style={{
                      width: "16px",
                      height: "16px",
                      border: "2px solid transparent",
                      borderTop: "2px solid white",
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite",
                    }}
                  ></div>
                )}
                {loading ? "Rejestracja..." : "Zarejestruj się"}
              </button>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                gap: "1rem",
                alignItems: isMobile ? "stretch" : "center",
                justifyContent: "flex-start",
              }}
            >
              <a
                href="/login"
                style={{
                  color: "white",
                  textDecoration: "underline",
                  fontSize: "0.9rem",
                  textAlign: isMobile ? "center" : "left",
                  opacity: loading ? 0.5 : 1,
                  pointerEvents: loading ? "none" : "auto",
                }}
              >
                Masz już konto? Zaloguj się
              </a>

              <a
                href="/register-company"
                style={{
                  color: "white",
                  textDecoration: "underline",
                  fontSize: "0.9rem",
                  textAlign: isMobile ? "center" : "left",
                  opacity: loading ? 0.5 : 1,
                  pointerEvents: loading ? "none" : "auto",
                }}
              >
                Zarejestruj Firmę
              </a>
            </div>
          </form>
        </div>

        <div
          style={{
            width: isMobile ? "80%" : "40%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: isMobile ? "3rem" : "0",
            opacity: loading ? 0.3 : 1,
            transition: "opacity 0.3s ease",
          }}
        >
          <img
            src={img1}
            alt="Illustration of a person on a ladder"
            style={{
              maxWidth: "100%",
              maxHeight: "65vh",
              objectFit: "contain",
            }}
          />
        </div>
      </main>
    </div>
  );
};

export default Register;
