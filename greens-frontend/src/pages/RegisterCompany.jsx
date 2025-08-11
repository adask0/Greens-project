import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";
import img1 from "../assets/img1.png";
import Header from "../components/Header";

const RegisterCompany = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    phone: "",
    address: "",
    nip: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [avatar, setAvatar] = useState(null);
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

    if (formData.password !== formData.password_confirmation) {
      setError("Hasła nie są identyczne");
      setLoading(false);
      return;
    }

    try {
      const registrationData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
        phone: formData.phone,
        address: formData.address,
        nip: formData.nip,
        status: "dostępny",
        is_active: true,
        subscription: "1 mies.",
        subscription_end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0], // 30 dni od teraz
      };

      const response = await api.post("/register-company", registrationData);

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("company", JSON.stringify(response.data.company));

        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data.token}`;

        window.location.href = "/contractor";
      } else {
        alert("Firma została zarejestrowana! Teraz możesz się zalogować.");
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Registration error:", error);

      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const errorMessages = Object.values(errors).flat().join(", ");
        setError(errorMessages);
      } else {
        setError(
          error.response?.data?.message ||
            "Błąd rejestracji. Sprawdź dane i spróbuj ponownie."
        );
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

  const handleAvatarClick = () => {
    document.getElementById("avatar-input").click();
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatar(e.target.result);
      };
      reader.readAsDataURL(file);
    }
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
          marginTop: isMobile ? "1rem" : "4rem",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: "2rem",
          alignItems: "center",
          width: "100%",
          padding: isMobile ? "0 1.5rem 2rem" : "0 4rem 2rem",
          boxSizing: "border-box",
        }}
      >
        <div style={{ width: isMobile ? "100%" : "60%", flexShrink: 0 }}>
          <div
            style={{
              marginBottom: "2rem",
              fontSize: "0.85rem",
              color: "rgba(255,255,255,0.8)",
            }}
          >
            Home / Rejestracja / Kontrachent
          </div>
          <h1
            style={{
              fontWeight: "600",
              marginBottom: "2.5rem",
              fontSize: isMobile ? "2rem" : "1.8rem",
            }}
          >
            <span style={{ boxShadow: "inset 0 -0.4em 0 0 #f97316" }}>
              Dołącz do Greens jako kontrachent
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
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={labelStyles}>Nazwa firmy:</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="PHU BUD PERFECT"
                style={inputStyles}
                required
              />
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                gap: "1.5rem",
                marginBottom: "1.5rem",
              }}
            >
              <div style={{ flex: 1 }}>
                <label style={labelStyles}>E-mail:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="kontakt@firma.pl"
                  style={inputStyles}
                  required
                />
              </div>
              <div style={{ flex: 1 }}>
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

            <div
              style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                gap: "1.5rem",
                marginBottom: "1.5rem",
              }}
            >
              <div style={{ flex: 1 }}>
                <label style={labelStyles}>Adres:</label>
                <input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Warszawa, ul. Przykładowa 123"
                  style={inputStyles}
                  required
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyles}>NIP (opcjonalnie):</label>
                <input
                  name="nip"
                  value={formData.nip}
                  onChange={handleChange}
                  placeholder="1234567890"
                  style={inputStyles}
                />
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                gap: "1.5rem",
                marginBottom: "2.5rem",
              }}
            >
              <div style={{ flex: 1 }}>
                <label style={labelStyles}>Hasło:</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••••••••••"
                  style={inputStyles}
                  required
                  minLength={8}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyles}>Powtórz hasło:</label>
                <input
                  type="password"
                  name="password_confirmation"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  placeholder="••••••••••••••••"
                  style={inputStyles}
                  required
                />
              </div>
            </div>

            <div style={{ textAlign: isMobile ? "center" : "left" }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  backgroundColor: loading ? "#d97706" : "#f97316",
                  color: "white",
                  padding: "0.8rem 2.5rem",
                  border: "none",
                  borderRadius: "20px",
                  fontSize: "1rem",
                  fontWeight: "500",
                  cursor: loading ? "not-allowed" : "pointer",
                  width: isMobile ? "100%" : "auto",
                  transition: "background-color 0.2s",
                }}
              >
                {loading ? "Rejestracja..." : "Zostań kontrachentem"}
              </button>
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

export default RegisterCompany;
