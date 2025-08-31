import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";
import Avatar from "../assets/Avatar.png";
import "../styles/contractor-profile.css";

const ContractorProfile = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    address: "",
    status: "dostępny",
    about: "",
    company_name: "",
    nip: "",
    website: "",
    company_description: "",
    subscription: "",
    subscription_type: "",
    subscription_end_date: "",
    is_active: true,
    specializations: [],
    avatar: "",
    email_new_messages: true,
    email_new_reviews: true,
    email_listing_updates: true,
    email_promotional: false,
    sms_new_messages: false,
    sms_urgent_notifications: true,
    push_new_messages: true,
    push_new_reviews: true,
    profile_visibility: "public",
    show_phone: true,
    show_email: false,
    allow_reviews: true,
    allow_messages: true,
    search_engine_indexing: true,
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [activeTab, setActiveTab] = useState("personal");

  const availableSpecializations = [
    "Porządkowe",
    "Sprzątanie biur",
    "Mycie okien",
    "Sprzątanie mieszkań",
    "Mieszkalnictwo",
    "Administracja",
    "Konserwacja",
    "Zarządzanie wspólnotą",
    "Nadzór techniczny",
    "Przemysłowe",
    "Fabryki",
    "Magazyny",
    "Hale produkcyjne",
    "Tereny przemysłowe",
    "Gruntowe",
    "Działki budowlane",
    "Tereny rolne",
    "Działki rekreacyjne",
    "Tereny inwestycyjne",
  ];

  useEffect(() => {
    if (user) {
      setProfileData((prevData) => ({
        ...prevData,
        ...user,
        specializations: Array.isArray(user.specializations)
          ? user.specializations
          : [],
      }));
    }
  }, [user]);

  const getAvatarUrl = () => {
    // 1. Priorytet - user z AuthContext (zawsze aktualne)
    if (user?.avatar_url) {
      // Backend już zwraca pełny URL
      return user.avatar_url;
    }

    if (user?.avatar) {
      if (user.avatar.startsWith('http')) {
        return user.avatar;
      }
      // Jeśli avatar zaczyna się od "avatars/", użyj bez dodatkowego "avatars/"
      const avatarPath = user.avatar.startsWith('avatars/')
        ? user.avatar.replace('avatars/', '')
        : user.avatar;
      return `http://127.0.0.1:8000/storage/avatars/${avatarPath}`;
    }

    // 2. Fallback - localStorage (tylko jako cache)
    const companyData = localStorage.getItem("company");
    if (companyData) {
      try {
        const company = JSON.parse(companyData);
        if (company.avatar_url) {
          return company.avatar_url;
        }
        if (company.avatar) {
          if (company.avatar.startsWith('http')) {
            return company.avatar;
          }
          const avatarPath = company.avatar.startsWith('avatars/')
            ? company.avatar.replace('avatars/', '')
            : company.avatar;
          return `http://127.0.0.1:8000/storage/avatars/${avatarPath}`;
        }
      } catch (e) {
        // ignore parse error
      }
    }

    // 3. Fallback - profileData (lokalny stan)
    if (profileData.avatar_url) {
      return profileData.avatar_url;
    }

    if (profileData.avatar) {
      if (profileData.avatar.startsWith('http')) {
        return profileData.avatar;
      }
      const avatarPath = profileData.avatar.startsWith('avatars/')
        ? profileData.avatar.replace('avatars/', '')
        : profileData.avatar;
      return `http://127.0.0.1:8000/storage/avatars/${avatarPath}`;
    }

    return Avatar;
  };

  const handleInputChange = (field, value) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSpecializationToggle = (specialization) => {
    setProfileData((prev) => ({
      ...prev,
      specializations: (prev.specializations || []).includes(specialization)
        ? prev.specializations.filter((s) => s !== specialization)
        : [...(prev.specializations || []), specialization],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await api.put("/contractor/profile", profileData);

      if (response.data.company) {
        localStorage.setItem("company", JSON.stringify(response.data.company));
      }

      setMessage({
        type: "success",
        text: "Profil został zaktualizowany pomyślnie!",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Nie udało się zaktualizować profilu",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMessage({
        type: "error",
        text: "Proszę wybrać plik obrazu (JPG, PNG, GIF)"
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage({
        type: "error",
        text: "Plik jest za duży. Maksymalny rozmiar to 5MB"
      });
      return;
    }

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      setSaving(true);
      const response = await api.post("/contractor/profile/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const newAvatar = response.data.avatar || response.data.avatar_url;

      // 1. Aktualizuj lokalny stan
      setProfileData((prev) => ({
        ...prev,
        avatar: newAvatar,
      }));

      // 2. Aktualizuj localStorage jako cache
      const companyData = JSON.parse(localStorage.getItem("company") || "{}");
      companyData.avatar = newAvatar;
      localStorage.setItem("company", JSON.stringify(companyData));

      // 3. WAŻNE: Pobierz zaktualizowane dane użytkownika z serwera
      // Żeby AuthContext miał aktualne dane
      try {
        const profileResponse = await api.get("/contractor/profile");
        // Tu powinieneś zaktualizować AuthContext - w zależności od implementacji
        // np. refetch user data lub trigger refresh
      } catch (error) {
        console.error("Error refreshing user data:", error);
      }

      setMessage({
        type: "success",
        text: "Zdjęcie profilowe zostało zaktualizowane!",
      });

    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Nie udało się zaktualizować zdjęcia profilowego",
      });
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="contractor-profile-loading">
        <div>Ładowanie profilu...</div>
      </div>
    );
  }

  return (
    <div className="contractor-profile">
      <div className="contractor-profile-header">
        <h2>Dane Profilu</h2>
        <p>Zarządzaj swoimi danymi osobowymi i firmowymi</p>
      </div>

      {message.text && (
        <div className={`contractor-message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="contractor-profile-tabs">
        <button
          className={`tab-btn ${activeTab === "personal" ? "active" : ""}`}
          onClick={() => setActiveTab("personal")}
        >
          Dane Osobowe
        </button>
        <button
          className={`tab-btn ${activeTab === "company" ? "active" : ""}`}
          onClick={() => setActiveTab("company")}
        >
          Dane Firmy
        </button>
        <button
          className={`tab-btn ${activeTab === "specializations" ? "active" : ""}`}
          onClick={() => setActiveTab("specializations")}
        >
          Specjalizacje
        </button>
        <button
          className={`tab-btn ${activeTab === "settings" ? "active" : ""}`}
          onClick={() => setActiveTab("settings")}
        >
          Ustawienia
        </button>
      </div>

      <form onSubmit={handleSubmit} className="contractor-profile-form">
        {activeTab === "personal" && (
          <div className="contractor-profile-section">
            <h3>Dane Osobowe</h3>

            <div className="contractor-avatar-section">
              <div className="contractor-avatar-preview">
                <img
                  src={getAvatarUrl()}
                  alt="Avatar"
                  onError={(e) => {
                    e.target.src = Avatar;
                  }}
                />
                <label className="contractor-avatar-upload">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    style={{ display: "none" }}
                  />
                  Zmień zdjęcie
                </label>
              </div>
            </div>

            <div className="contractor-form-row">
              <div className="contractor-form-group">
                <label>Imię i nazwisko *</label>
                <input
                  type="text"
                  value={profileData.name || ""}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                  placeholder="Jan Kowalski"
                />
              </div>

              <div className="contractor-form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={profileData.email || ""}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                  placeholder="jan@example.com"
                />
              </div>
            </div>

            <div className="contractor-form-row">
              <div className="contractor-form-group">
                <label>Telefon</label>
                <input
                  type="tel"
                  value={profileData.phone || ""}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="+48 123 456 789"
                />
              </div>

              <div className="contractor-form-group">
                <label>Miasto *</label>
                <input
                  type="text"
                  value={profileData.city || ""}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  required
                  placeholder="Warszawa"
                />
              </div>
            </div>

            <div className="contractor-form-group">
              <label>Adres</label>
              <input
                type="text"
                value={profileData.address || ""}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="ul. Przykładowa 123, 00-000 Warszawa"
              />
            </div>

            <div className="contractor-form-group">
              <label>Status</label>
              <select
                value={profileData.status || "dostępny"}
                onChange={(e) => handleInputChange("status", e.target.value)}
              >
                <option value="dostępny">Dostępny</option>
                <option value="niedostępny">Niedostępny</option>
                <option value="zawieszony">Zawieszony</option>
              </select>
            </div>

            <div className="contractor-form-group">
              <label>Opis usług</label>
              <textarea
                value={profileData.about || ""}
                onChange={(e) => handleInputChange("about", e.target.value)}
                placeholder="Opisz swoje usługi, doświadczenie i podejście do pracy..."
                rows="4"
              />
            </div>
          </div>
        )}

        {activeTab === "company" && (
          <div className="contractor-profile-section">
            <h3>Dane Firmy</h3>

            <div className="contractor-form-row">
              <div className="contractor-form-group">
                <label>Nazwa firmy</label>
                <input
                  type="text"
                  value={profileData.company_name || ""}
                  onChange={(e) => handleInputChange("company_name", e.target.value)}
                  placeholder="Nazwa Sp. z o.o."
                />
              </div>

              <div className="contractor-form-group">
                <label>NIP</label>
                <input
                  type="text"
                  value={profileData.nip || ""}
                  onChange={(e) => handleInputChange("nip", e.target.value)}
                  placeholder="1234567890"
                />
              </div>
            </div>

            <div className="contractor-form-group">
              <label>Strona internetowa</label>
              <input
                type="url"
                value={profileData.website || ""}
                onChange={(e) => handleInputChange("website", e.target.value)}
                placeholder="https://www.example.com"
              />
            </div>

            <div className="contractor-form-group">
              <label>Opis firmy</label>
              <textarea
                value={profileData.company_description || ""}
                onChange={(e) => handleInputChange("company_description", e.target.value)}
                placeholder="Opisz swoją firmę, historię, misję i wartości..."
                rows="4"
              />
            </div>

            <div className="contractor-form-row">
              <div className="contractor-form-group">
                <label>Subskrypcja</label>
                <input
                  type="text"
                  value={profileData.subscription || ""}
                  onChange={(e) => handleInputChange("subscription", e.target.value)}
                  placeholder="12 mies."
                  disabled
                />
              </div>

              <div className="contractor-form-group">
                <label>Typ subskrypcji</label>
                <input
                  type="text"
                  value={profileData.subscription_type || ""}
                  disabled
                  placeholder="STANDARD"
                />
              </div>
            </div>

            <div className="contractor-form-row">
              <div className="contractor-form-group">
                <label>Data zakończenia subskrypcji</label>
                <input
                  type="date"
                  value={profileData.subscription_end_date ? profileData.subscription_end_date.split(" ")[0] : ""}
                  disabled
                />
              </div>

              <div className="contractor-form-group">
                <label>Konto aktywne</label>
                <select
                  value={profileData.is_active ? "1" : "0"}
                  onChange={(e) => handleInputChange("is_active", e.target.value === "1")}
                  disabled
                >
                  <option value="1">Aktywne</option>
                  <option value="0">Nieaktywne</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {activeTab === "specializations" && (
          <div className="contractor-profile-section">
            <h3>Specjalizacje</h3>
            <p className="contractor-specializations-hint">
              Wybierz obszary, w których świadczysz usługi
            </p>

            <div className="contractor-specializations-grid">
              {availableSpecializations.map((specialization) => (
                <label
                  key={specialization}
                  className={`contractor-specialization-item ${
                    (profileData.specializations || []).includes(specialization) ? "selected" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={(profileData.specializations || []).includes(specialization)}
                    onChange={() => handleSpecializationToggle(specialization)}
                    style={{ display: "none" }}
                  />
                  <div className="contractor-specialization-checkbox">
                    {(profileData.specializations || []).includes(specialization) && (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="white">
                        <path
                          d="M10 3L4.5 8.5L2 6"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                  <span>{specialization}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="contractor-profile-section">
            <h3>Ustawienia</h3>

            <div className="contractor-settings-group">
              <h4>Powiadomienia Email</h4>
              <div className="contractor-form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={profileData.email_new_messages || false}
                    onChange={(e) => handleInputChange("email_new_messages", e.target.checked)}
                  />
                  Nowe wiadomości
                </label>
              </div>
              <div className="contractor-form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={profileData.email_new_reviews || false}
                    onChange={(e) => handleInputChange("email_new_reviews", e.target.checked)}
                  />
                  Nowe oceny
                </label>
              </div>
              <div className="contractor-form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={profileData.email_listing_updates || false}
                    onChange={(e) => handleInputChange("email_listing_updates", e.target.checked)}
                  />
                  Aktualizacje ofert
                </label>
              </div>
              <div className="contractor-form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={profileData.email_promotional || false}
                    onChange={(e) => handleInputChange("email_promotional", e.target.checked)}
                  />
                  Materiały promocyjne
                </label>
              </div>
            </div>

            <div className="contractor-settings-group">
              <h4>Powiadomienia SMS</h4>
              <div className="contractor-form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={profileData.sms_new_messages || false}
                    onChange={(e) => handleInputChange("sms_new_messages", e.target.checked)}
                  />
                  Nowe wiadomości
                </label>
              </div>
              <div className="contractor-form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={profileData.sms_urgent_notifications || false}
                    onChange={(e) => handleInputChange("sms_urgent_notifications", e.target.checked)}
                  />
                  Pilne powiadomienia
                </label>
              </div>
            </div>

            <div className="contractor-settings-group">
              <h4>Powiadomienia Push</h4>
              <div className="contractor-form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={profileData.push_new_messages || false}
                    onChange={(e) => handleInputChange("push_new_messages", e.target.checked)}
                  />
                  Nowe wiadomości
                </label>
              </div>
              <div className="contractor-form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={profileData.push_new_reviews || false}
                    onChange={(e) => handleInputChange("push_new_reviews", e.target.checked)}
                  />
                  Nowe oceny
                </label>
              </div>
            </div>

            <div className="contractor-settings-group">
              <h4>Prywatność</h4>
              <div className="contractor-form-group">
                <label>Widoczność profilu</label>
                <select
                  value={profileData.profile_visibility || "public"}
                  onChange={(e) => handleInputChange("profile_visibility", e.target.value)}
                >
                  <option value="public">Publiczny</option>
                  <option value="private">Prywatny</option>
                </select>
              </div>
              <div className="contractor-form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={profileData.show_phone || false}
                    onChange={(e) => handleInputChange("show_phone", e.target.checked)}
                  />
                  Pokazuj numer telefonu
                </label>
              </div>
              <div className="contractor-form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={profileData.show_email || false}
                    onChange={(e) => handleInputChange("show_email", e.target.checked)}
                  />
                  Pokazuj email
                </label>
              </div>
              <div className="contractor-form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={profileData.allow_reviews || false}
                    onChange={(e) => handleInputChange("allow_reviews", e.target.checked)}
                  />
                  Pozwalaj na oceny
                </label>
              </div>
              <div className="contractor-form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={profileData.allow_messages || false}
                    onChange={(e) => handleInputChange("allow_messages", e.target.checked)}
                  />
                  Pozwalaj na wiadomości
                </label>
              </div>
              <div className="contractor-form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={profileData.search_engine_indexing || false}
                    onChange={(e) => handleInputChange("search_engine_indexing", e.target.checked)}
                  />
                  Indeksowanie przez wyszukiwarki
                </label>
              </div>
            </div>
          </div>
        )}

        <div className="contractor-profile-actions">
          <button type="submit" disabled={saving} className="contractor-btn-save">
            {saving ? "Zapisywanie..." : "Zapisz zmiany"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContractorProfile;
