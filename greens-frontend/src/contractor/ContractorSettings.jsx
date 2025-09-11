import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";
import "../styles/contractor-settings.css";

const ContractorSettings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [activeTab, setActiveTab] = useState("password");

  // Password change state
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  // Notifications settings
  const [notificationSettings, setNotificationSettings] = useState({
    email_new_messages: true,
    email_new_reviews: true,
    email_listing_updates: false,
    email_promotional: false,
    sms_new_messages: true,
    sms_urgent_notifications: true,
    push_new_messages: true,
    push_new_reviews: true,
  });

  // Privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    profile_visibility: "public", // public, registered_only, private
    show_phone: true,
    show_email: false,
    allow_reviews: true,
    allow_messages: true,
    search_engine_indexing: true,
  });

  // Account deletion
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      // W rzeczywistości byłyby to osobne API calle
      // const notificationsResponse = await api.get("/settings/notifications");
      // const privacyResponse = await api.get("/settings/privacy");
      // setNotificationSettings(notificationsResponse.data);
      // setPrivacySettings(privacyResponse.data);
    } catch (error) {
      console.error("Błąd podczas pobierania ustawień:", error);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordData.new_password !== passwordData.confirm_password) {
      setMessage({
        type: "error",
        text: "Nowe hasła nie są identyczne",
      });
      return;
    }

    if (passwordData.new_password.length < 8) {
      setMessage({
        type: "error",
        text: "Nowe hasło musi mieć co najmniej 8 znaków",
      });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await api.put("/change-password", {
        current_password: passwordData.current_password,
        new_password: passwordData.new_password,
      });

      setMessage({
        type: "success",
        text: "Hasło zostało zmienione pomyślnie!",
      });

      setPasswordData({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Nie udało się zmienić hasła",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationChange = async (setting, value) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [setting]: value,
    }));

    try {
      await api.put("/settings/notifications", {
        [setting]: value,
      });

      setMessage({
        type: "success",
        text: "Ustawienia powiadomień zostały zaktualizowane",
      });
    } catch (error) {
      console.error("Błąd podczas aktualizacji ustawień:", error);
      // Rollback change
      setNotificationSettings((prev) => ({
        ...prev,
        [setting]: !value,
      }));
    }
  };

  const handlePrivacyChange = async (setting, value) => {
    setPrivacySettings((prev) => ({
      ...prev,
      [setting]: value,
    }));

    try {
      await api.put("/settings/privacy", {
        [setting]: value,
      });

      setMessage({
        type: "success",
        text: "Ustawienia prywatności zostały zaktualizowane",
      });
    } catch (error) {
      console.error("Błąd podczas aktualizacji ustawień:", error);
      // Rollback change
      setPrivacySettings((prev) => ({
        ...prev,
        [setting]: typeof value === "boolean" ? !value : prev[setting],
      }));
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "USUŃ KONTO") {
      setMessage({
        type: "error",
        text: "Wpisz dokładnie 'USUŃ KONTO' aby potwierdzić",
      });
      return;
    }

    try {
      await api.delete("/profile");
      // Logout user and redirect
      window.location.href = "/";
    } catch (error) {
      setMessage({
        type: "error",
        text: "Nie udało się usunąć konta. Spróbuj ponownie.",
      });
    }
  };

  const renderSwitch = (checked, onChange, disabled = false) => (
    <label className={`contractor-switch ${disabled ? "disabled" : ""}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
      />
      <span className="contractor-switch-slider"></span>
    </label>
  );

  return (
    <div className="contractor-settings">
      <div className="contractor-settings-header">
        <h2>Ustawienia</h2>
        <p>Zarządzaj swoim kontem i preferencjami</p>
      </div>

      {message.text && (
        <div className={`contractor-message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="contractor-settings-tabs">
        <button
          className={`tab-btn ${activeTab === "password" ? "active" : ""}`}
          onClick={() => setActiveTab("password")}
        >
          Zmiana hasła
        </button>
        <button
          className={`tab-btn ${activeTab === "notifications" ? "active" : ""}`}
          onClick={() => setActiveTab("notifications")}
        >
          Powiadomienia
        </button>
        <button
          className={`tab-btn ${activeTab === "privacy" ? "active" : ""}`}
          onClick={() => setActiveTab("privacy")}
        >
          Prywatność
        </button>
        <button
          className={`tab-btn ${activeTab === "danger" ? "active" : ""}`}
          onClick={() => setActiveTab("danger")}
        >
          Strefa niebezpieczna
        </button>
      </div>

      <div className="contractor-settings-content">
        {activeTab === "password" && (
          <div className="contractor-settings-section">
            <h3>Zmiana hasła</h3>
            <p>Aktualizuj hasło do swojego konta</p>

            <form
              onSubmit={handlePasswordChange}
              className="contractor-password-form"
            >
              <div className="contractor-form-group">
                <label>Aktualne hasło *</label>
                <input
                  type="password"
                  value={passwordData.current_password}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      current_password: e.target.value,
                    }))
                  }
                  required
                  placeholder="Wprowadź aktualne hasło"
                />
              </div>

              <div className="contractor-form-group">
                <label>Nowe hasło *</label>
                <input
                  type="password"
                  value={passwordData.new_password}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      new_password: e.target.value,
                    }))
                  }
                  required
                  placeholder="Minimum 8 znaków"
                  minLength="8"
                />
              </div>

              <div className="contractor-form-group">
                <label>Potwierdź nowe hasło *</label>
                <input
                  type="password"
                  value={passwordData.confirm_password}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      confirm_password: e.target.value,
                    }))
                  }
                  required
                  placeholder="Powtórz nowe hasło"
                />
              </div>

              <div className="contractor-password-requirements">
                <h4>Wymagania dotyczące hasła:</h4>
                <ul>
                  <li
                    className={
                      passwordData.new_password.length >= 8 ? "valid" : ""
                    }
                  >
                    Co najmniej 8 znaków
                  </li>
                  <li
                    className={
                      /[A-Z]/.test(passwordData.new_password) ? "valid" : ""
                    }
                  >
                    Co najmniej jedna wielka litera
                  </li>
                  <li
                    className={
                      /[0-9]/.test(passwordData.new_password) ? "valid" : ""
                    }
                  >
                    Co najmniej jedna cyfra
                  </li>
                  <li
                    className={
                      passwordData.new_password ===
                        passwordData.confirm_password &&
                      passwordData.new_password
                        ? "valid"
                        : ""
                    }
                  >
                    Hasła muszą się zgadzać
                  </li>
                </ul>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="contractor-btn-save"
              >
                {loading ? "Zapisywanie..." : "Zmień hasło"}
              </button>
            </form>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="contractor-settings-section">
            <h3>Ustawienia powiadomień</h3>
            <p>Wybierz, kiedy chcesz otrzymywać powiadomienia</p>

            <div className="contractor-notifications-grid">
              <div className="contractor-notification-group">
                <h4>Powiadomienia email</h4>

                <div className="contractor-setting-item">
                  <div className="contractor-setting-info">
                    <span className="setting-name">Nowe wiadomości</span>
                    <span className="setting-desc">
                      Otrzymuj email gdy klient napisze wiadomość
                    </span>
                  </div>
                  {renderSwitch(
                    notificationSettings.email_new_messages,
                    (value) =>
                      handleNotificationChange("email_new_messages", value)
                  )}
                </div>

                <div className="contractor-setting-item">
                  <div className="contractor-setting-info">
                    <span className="setting-name">Nowe opinie</span>
                    <span className="setting-desc">
                      Powiadomienia o nowych recenzjach
                    </span>
                  </div>
                  {renderSwitch(
                    notificationSettings.email_new_reviews,
                    (value) =>
                      handleNotificationChange("email_new_reviews", value)
                  )}
                </div>

                <div className="contractor-setting-item">
                  <div className="contractor-setting-info">
                    <span className="setting-name">Aktualizacje ogłoszeń</span>
                    <span className="setting-desc">
                      Informacje o zmianach w Twoich ofertach
                    </span>
                  </div>
                  {renderSwitch(
                    notificationSettings.email_listing_updates,
                    (value) =>
                      handleNotificationChange("email_listing_updates", value)
                  )}
                </div>

                <div className="contractor-setting-item">
                  <div className="contractor-setting-info">
                    <span className="setting-name">Materiały promocyjne</span>
                    <span className="setting-desc">
                      Nowości, promocje i wskazówki biznesowe
                    </span>
                  </div>
                  {renderSwitch(
                    notificationSettings.email_promotional,
                    (value) =>
                      handleNotificationChange("email_promotional", value)
                  )}
                </div>
              </div>

              <div className="contractor-notification-group">
                <h4>Powiadomienia SMS</h4>

                <div className="contractor-setting-item">
                  <div className="contractor-setting-info">
                    <span className="setting-name">Nowe wiadomości</span>
                    <span className="setting-desc">
                      SMS przy nowych wiadomościach od klientów
                    </span>
                  </div>
                  {renderSwitch(
                    notificationSettings.sms_new_messages,
                    (value) =>
                      handleNotificationChange("sms_new_messages", value)
                  )}
                </div>

                <div className="contractor-setting-item">
                  <div className="contractor-setting-info">
                    <span className="setting-name">Pilne powiadomienia</span>
                    <span className="setting-desc">
                      Ważne informacje dotyczące konta
                    </span>
                  </div>
                  {renderSwitch(
                    notificationSettings.sms_urgent_notifications,
                    (value) =>
                      handleNotificationChange(
                        "sms_urgent_notifications",
                        value
                      )
                  )}
                </div>
              </div>

              <div className="contractor-notification-group">
                <h4>Powiadomienia push</h4>

                <div className="contractor-setting-item">
                  <div className="contractor-setting-info">
                    <span className="setting-name">Nowe wiadomości</span>
                    <span className="setting-desc">
                      Powiadomienia w przeglądarce
                    </span>
                  </div>
                  {renderSwitch(
                    notificationSettings.push_new_messages,
                    (value) =>
                      handleNotificationChange("push_new_messages", value)
                  )}
                </div>

                <div className="contractor-setting-item">
                  <div className="contractor-setting-info">
                    <span className="setting-name">Nowe opinie</span>
                    <span className="setting-desc">
                      Powiadomienia o nowych recenzjach
                    </span>
                  </div>
                  {renderSwitch(
                    notificationSettings.push_new_reviews,
                    (value) =>
                      handleNotificationChange("push_new_reviews", value)
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "privacy" && (
          <div className="contractor-settings-section">
            <h3>Ustawienia prywatności</h3>
            <p>Kontroluj widoczność swoich informacji</p>

            <div className="contractor-privacy-settings">
              <div className="contractor-setting-item">
                <div className="contractor-setting-info">
                  <span className="setting-name">Widoczność profilu</span>
                  <span className="setting-desc">
                    Kto może zobaczyć Twój profil
                  </span>
                </div>
                <select
                  value={privacySettings.profile_visibility}
                  onChange={(e) =>
                    handlePrivacyChange("profile_visibility", e.target.value)
                  }
                  className="contractor-select"
                >
                  <option value="public">Publiczny</option>
                  <option value="registered_only">
                    Tylko zarejestrowani użytkownicy
                  </option>
                  <option value="private">Prywatny</option>
                </select>
              </div>

              <div className="contractor-setting-item">
                <div className="contractor-setting-info">
                  <span className="setting-name">Pokaż numer telefonu</span>
                  <span className="setting-desc">
                    Wyświetlaj telefon w profilu publicznym
                  </span>
                </div>
                {renderSwitch(privacySettings.show_phone, (value) =>
                  handlePrivacyChange("show_phone", value)
                )}
              </div>

              <div className="contractor-setting-item">
                <div className="contractor-setting-info">
                  <span className="setting-name">Pokaż adres email</span>
                  <span className="setting-desc">
                    Wyświetlaj email w profilu publicznym
                  </span>
                </div>
                {renderSwitch(privacySettings.show_email, (value) =>
                  handlePrivacyChange("show_email", value)
                )}
              </div>

              <div className="contractor-setting-item">
                <div className="contractor-setting-info">
                  <span className="setting-name">Pozwól na opinie</span>
                  <span className="setting-desc">
                    Klienci mogą wystawiać Ci oceny
                  </span>
                </div>
                {renderSwitch(privacySettings.allow_reviews, (value) =>
                  handlePrivacyChange("allow_reviews", value)
                )}
              </div>

              <div className="contractor-setting-item">
                <div className="contractor-setting-info">
                  <span className="setting-name">Pozwól na wiadomości</span>
                  <span className="setting-desc">
                    Klienci mogą wysyłać Ci wiadomości
                  </span>
                </div>
                {renderSwitch(privacySettings.allow_messages, (value) =>
                  handlePrivacyChange("allow_messages", value)
                )}
              </div>

              <div className="contractor-setting-item">
                <div className="contractor-setting-info">
                  <span className="setting-name">
                    Indeksowanie w wyszukiwarkach
                  </span>
                  <span className="setting-desc">
                    Pozwól Google i innym na indeksowanie profilu
                  </span>
                </div>
                {renderSwitch(privacySettings.search_engine_indexing, (value) =>
                  handlePrivacyChange("search_engine_indexing", value)
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "danger" && (
          <div className="contractor-settings-section">
            <h3>Strefa niebezpieczna</h3>
            <p>Nieodwracalne akcje dotyczące Twojego konta</p>

            <div className="contractor-danger-zone">
              <div className="contractor-danger-item">
                <div className="contractor-danger-info">
                  <h4>Usuń konto</h4>
                  <p>
                    Permanentnie usuń swoje konto i wszystkie powiązane dane.
                    Tej akcji nie można cofnąć.
                  </p>
                  <ul className="contractor-delete-consequences">
                    <li>Wszystkie Twoje oferty zostaną usunięte</li>
                    <li>Historia wiadomości zostanie usunięta</li>
                    <li>Profil stanie się niedostępny</li>
                    <li>Nie będziesz mógł odzyskać tych danych</li>
                  </ul>
                </div>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="contractor-btn-danger"
                >
                  Usuń konto
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="contractor-settings-modal">
          <div className="contractor-modal-content">
            <div className="contractor-modal-header">
              <h3>Usuń konto</h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="contractor-btn-close"
              >
                ✕
              </button>
            </div>

            <div className="contractor-modal-body">
              <div className="contractor-delete-warning">
                <div className="warning-icon">⚠️</div>
                <p>
                  <strong>To działanie jest nieodwracalne!</strong>
                  <br />
                  Wszystkie Twoje dane zostaną permanentnie usunięte.
                </p>
              </div>

              <div className="contractor-form-group">
                <label>Wpisz "USUŃ KONTO" aby potwierdzić:</label>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="USUŃ KONTO"
                  className="contractor-delete-input"
                />
              </div>
            </div>

            <div className="contractor-modal-actions">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="contractor-btn-cancel"
              >
                Anuluj
              </button>
              <button
                onClick={handleDeleteAccount}
                className="contractor-btn-danger"
                disabled={deleteConfirmText !== "USUŃ KONTO"}
              >
                Usuń konto na zawsze
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractorSettings;
