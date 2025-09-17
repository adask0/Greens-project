import React, { useState } from "react";
import { useCookies } from "../hooks/useCookies";
import "../styles/cookies.css";

const CookieBanner = () => {
  const { hasConsent, preferences, savePreferences } = useCookies();
  const [showModal, setShowModal] = useState(false);
  const [localPreferences, setLocalPreferences] = useState(preferences);

  if (hasConsent) return null;

  const handleAcceptAll = () => {
    savePreferences({
      necessary: true,
      analytics: true,
      marketing: true,
    });
  };

  const handleAcceptNecessary = () => {
    savePreferences({
      necessary: true,
      analytics: false,
      marketing: false,
    });
  };

  const handleSaveCustom = () => {
    savePreferences(localPreferences);
    setShowModal(false);
  };

  const handleOpenModal = () => {
    setLocalPreferences(preferences);
    setShowModal(true);
  };

  return (
    <>
      <div className="cookie-banner">
        <div className="cookie-banner-content">
          <div className="cookie-banner-text">
            <p>
              Ta strona używa cookies aby zapewnić najlepsze doświadczenia.
              <a href="/polityka-cookies" className="cookie-link">
                Dowiedz się więcej
              </a>
            </p>
          </div>

          <div className="cookie-banner-buttons">
            <button
              onClick={handleOpenModal}
              className="cookie-btn cookie-btn-settings"
            >
              Ustawienia
            </button>
            <button
              onClick={handleAcceptAll}
              className="cookie-btn cookie-btn-accept"
            >
              Akceptuj wszystkie
            </button>
            <button
              onClick={handleAcceptNecessary}
              className="cookie-btn cookie-btn-necessary"
            >
              Tylko niezbędne
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="cookie-modal-overlay">
          <div className="cookie-modal">
            <h3>Ustawienia Cookies</h3>

            <div className="cookie-preferences">
              <label className="cookie-preference">
                <div className="cookie-preference-info">
                  <span className="cookie-preference-title">
                    Cookies niezbędne
                  </span>
                  <span className="cookie-preference-desc">
                    Wymagane do działania strony
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={true}
                  disabled
                  className="cookie-checkbox"
                />
              </label>

              <label className="cookie-preference">
                <div className="cookie-preference-info">
                  <span className="cookie-preference-title">
                    Cookies analityczne
                  </span>
                  <span className="cookie-preference-desc">
                    Pomagają analizować ruch na stronie
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={localPreferences.analytics}
                  onChange={(e) =>
                    setLocalPreferences((prev) => ({
                      ...prev,
                      analytics: e.target.checked,
                    }))
                  }
                  className="cookie-checkbox"
                />
              </label>

              <label className="cookie-preference">
                <div className="cookie-preference-info">
                  <span className="cookie-preference-title">
                    Cookies marketingowe
                  </span>
                  <span className="cookie-preference-desc">
                    Służą do personalizacji reklam
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={localPreferences.marketing}
                  onChange={(e) =>
                    setLocalPreferences((prev) => ({
                      ...prev,
                      marketing: e.target.checked,
                    }))
                  }
                  className="cookie-checkbox"
                />
              </label>
            </div>

            <div className="cookie-modal-buttons">
              <button
                onClick={() => setShowModal(false)}
                className="cookie-btn cookie-btn-cancel"
              >
                Anuluj
              </button>
              <button
                onClick={handleSaveCustom}
                className="cookie-btn cookie-btn-save"
              >
                Zapisz preferencje
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CookieBanner;
