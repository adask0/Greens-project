import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import img1 from "../assets/img1.png";
import Header from "../components/Header";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const { login } = useAuth();

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

    try {
      await login(formData);
      window.location.href = "/";
    } catch (error) {
      setError("Błąd logowania. Sprawdź dane.");
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
        <div
          style={{
            width: isMobile ? "100%" : "60%",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              marginBottom: "2rem",
              fontSize: "0.85rem",
              color: "rgba(255,255,255,0.8)",
            }}
          >
            Home / Logowanie
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
              Zaloguj się
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
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                gap: "1.5rem",
                marginBottom: "2rem",
              }}
            >
              <div>
                <label style={labelStyles}>E-mail:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Greens.pl"
                  style={inputStyles}
                  required
                />
              </div>
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
                  cursor: "pointer",
                  minWidth: "120px",
                }}
              >
                {loading ? "Logowanie..." : "Zaloguj się"}
              </button>

              <a
                href="/forgot-password"
                style={{
                  color: "white",
                  textDecoration: "none",
                  fontSize: "0.9rem",
                  textAlign: isMobile ? "center" : "left",
                }}
              >
                Nie pamiętam hasła
              </a>
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
                href="/register"
                style={{
                  color: "white",
                  textDecoration: "underline",
                  fontSize: "0.9rem",
                  textAlign: isMobile ? "center" : "left",
                }}
              >
                Zarejestruj się
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

export default Login;
