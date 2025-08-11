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
      window.location.href = "/";
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
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#45964d",
        fontFamily: "Poppins, sans-serif",
        color: "white",
      }}
    >
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
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••••••••••"
                  style={inputStyles}
                  required
                  minLength="8"
                />
              </div>
              <div>
                <label style={labelStyles}>Powtórz hasło:</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••••••••••"
                  style={inputStyles}
                  required
                />
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
                  backgroundColor: "#f97316",
                  color: "white",
                  padding: "0.8rem 2rem",
                  border: "none",
                  borderRadius: "20px",
                  fontSize: "1rem",
                  fontWeight: "500",
                  cursor: loading ? "not-allowed" : "pointer",
                  minWidth: "120px",
                  opacity: loading ? 0.7 : 1,
                }}
              >
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
