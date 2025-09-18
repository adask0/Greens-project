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
    city: "",
    nip: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    // Krok 1: Rejestracja firmy
    const registrationData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      password_confirmation: formData.password_confirmation,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      nip: formData.nip,
      status: "dostępny",
      is_active: true,
      subscription: "1 mies.",
      subscription_end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    };

    const response = await api.post("/register-company", registrationData);

    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("company", JSON.stringify(response.data.company));
      api.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;

      // Krok 2: Upload awatara jeśli wybrano plik - używamy tego samego endpointa co w panelu
      if (avatarFile) {
        try {
          const formData = new FormData();
          formData.append('avatar', avatarFile);

          // Użyj tego samego endpointa co w panelu kontrahenta
          const avatarResponse = await fetch('https://greens.org.pl/backend.greens.org.pl/public/upload_avatar.php', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${response.data.token}`
            },
            body: formData
          });

          const avatarData = await avatarResponse.json();
          console.log('Avatar upload response during registration:', avatarData);

          if (avatarData.success) {
            // Aktualizuj dane w localStorage z nowym avatarem
            const companyData = JSON.parse(localStorage.getItem("company") || "{}");
            companyData.avatar = avatarData.avatar;
            companyData.avatar_url = avatarData.avatar_url;
            localStorage.setItem("company", JSON.stringify(companyData));
          } else {
            console.error('Avatar upload failed:', avatarData.message);
          }

        } catch (avatarError) {
          console.error('Error uploading avatar during registration:', avatarError);
          // Nie przerywamy procesu rejestracji jeśli upload awatara się nie udał
        }
      }

      // Pokazuj loading przez 1.5 sekundy dla lepszego UX
      setTimeout(() => {
        window.location.href = "/contractor";
      }, 1500);
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
      // Sprawdź typ pliku
      if (!file.type.startsWith('image/')) {
        setError('Proszę wybrać plik obrazu (JPG, PNG, GIF)');
        return;
      }

      // Sprawdź rozmiar pliku (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Plik jest za duży. Maksymalny rozmiar to 5MB');
        return;
      }

      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatar(e.target.result);
      };
      reader.readAsDataURL(file);
      setError(''); // Wyczyść błąd jeśli plik jest OK
    }
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
            Rejestracja firmy...
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
            {/* Ukryty input dla awatara */}
            {/* <input
              id="avatar-input"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              style={{ display: "none" }}
              disabled={loading}
            />

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={labelStyles}>Nazwa firmy:</label>
              <div style={{
                display: "flex",
                gap: "1rem",
                alignItems: "flex-start"
              }}>
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    backgroundColor: "#f97316",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: loading ? "not-allowed" : "pointer",
                    flexShrink: 0,
                    transition: "all 0.2s ease",
                    position: "relative",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                    opacity: loading ? 0.5 : 1,
                  }}
                  onClick={loading ? undefined : handleAvatarClick}
                  title={loading ? "Ładowanie..." : "Kliknij aby dodać logo firmy"}
                >
                  {avatar ? (
                    <img
                      src={avatar}
                      alt="Avatar"
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <svg
                      width="36"
                      height="36"
                      viewBox="0 0 24 24"
                      fill="white"
                    >
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  )}
                  {!avatar && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: "2px",
                        right: "2px",
                        width: "26px",
                        height: "26px",
                        backgroundColor: "#16a34a",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "3px solid white",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
                      }}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="white"
                      >
                        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                      </svg>
                    </div>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="PHU BUD PERFECT"
                    style={inputStyles}
                    required
                    disabled={loading}
                  />
                  <div style={{
                    fontSize: "0.75rem",
                    color: "rgba(255,255,255,0.7)",
                    marginTop: "0.25rem"
                  }}>
                    Kliknij na ikonkę aby dodać logo firmy
                  </div>
                </div>
              </div>
            </div> */}

            <div
              style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                gap: "1.5rem",
                marginBottom: "1.5rem",
              }}
            >
                <div style={{ flex: 1 }}>
                <label style={labelStyles}>Nazwa firmy:</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="PHU BUD PERFECT"
                    style={inputStyles}
                    required
                    disabled={loading}
                  />
                </div>
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
                  disabled={loading}
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
                <label style={labelStyles}>Miasto:</label>
                <input
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Warszawa"
                  style={inputStyles}
                  required
                  disabled={loading}
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
                  disabled={loading}
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
                <label style={labelStyles}>NIP (opcjonalnie):</label>
                <input
                  name="nip"
                  value={formData.nip}
                  onChange={handleChange}
                  placeholder="1234567890"
                  style={inputStyles}
                  disabled={loading}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyles}>Adres:</label>
                <input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="ul. Przykładowa 123"
                  style={inputStyles}
                  required
                  disabled={loading}
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
                <div style={passwordContainerStyles}>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••••••••••"
                    style={inputStyles}
                    required
                    minLength={8}
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
              <div style={{ flex: 1 }}>
                <label style={labelStyles}>Powtórz hasło:</label>
                <div style={passwordContainerStyles}>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="password_confirmation"
                    value={formData.password_confirmation}
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
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  margin: isMobile ? "0 auto" : "0",
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

export default RegisterCompany;
