import React from "react";
import { useCookies } from "../hooks/useCookies";

const CookiePolicy = () => {
  const { preferences, revokeConsent } = useCookies();

  const handleRevokeConsent = () => {
    if (
      window.confirm(
        "Czy na pewno chcesz cofnąć zgodę na cookies? Spowoduje to wylogowanie i usunięcie zapisanych preferencji."
      )
    ) {
      revokeConsent();
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#45964d",
        minHeight: "100vh",
        color: "white",
        fontFamily: "DM Sans, sans-serif",
        paddingTop: "6rem",
        paddingBottom: "4rem",
        paddingLeft: "1rem",
        paddingRight: "1rem",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h1
          style={{
            fontSize: "2.5rem",
            fontWeight: "bold",
            marginBottom: "1.5rem",
            textAlign: "center",
          }}
        >
          Polityka Cookies
        </h1>

        <div
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            padding: "1rem",
            borderRadius: "8px",
            marginBottom: "2rem",
            borderLeft: "4px solid white",
          }}
        >
          <p style={{ margin: 0, fontSize: "0.9rem" }}>
            <strong>Ostatnia aktualizacja:</strong>{" "}
            {new Date().toLocaleDateString("pl-PL")}
          </p>
        </div>

        <div style={{ lineHeight: "1.7" }}>
          <section style={{ marginBottom: "2.5rem" }}>
            <h2
              style={{
                fontSize: "1.8rem",
                fontWeight: "600",
                marginBottom: "1rem",
              }}
            >
              Czym są cookies?
            </h2>
            <p style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
              Cookies to małe pliki tekstowe, które są przechowywane na Twoim
              urządzeniu (komputerze, tablecie lub telefonie) podczas
              odwiedzania stron internetowych. Cookies pomagają nam zapewnić Ci
              lepsze doświadczenia podczas korzystania z naszej strony.
            </p>
          </section>

          <section style={{ marginBottom: "2.5rem" }}>
            <h2
              style={{
                fontSize: "1.8rem",
                fontWeight: "600",
                marginBottom: "1rem",
              }}
            >
              Jakie cookies używamy?
            </h2>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
              }}
            >
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  padding: "1.5rem",
                  borderRadius: "8px",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.3rem",
                    fontWeight: "500",
                    marginBottom: "0.5rem",
                  }}
                >
                  Cookies niezbędne (wymagane)
                </h3>
                <p style={{ marginBottom: "1rem" }}>
                  Te cookies są niezbędne do prawidłowego funkcjonowania strony
                  internetowej i nie można ich wyłączyć.
                </p>
                <div style={{ paddingLeft: "1rem" }}>
                  <div style={{ marginBottom: "0.5rem" }}>
                    Cookies sesji - umożliwiają poruszanie się po stronie
                  </div>
                  <div style={{ marginBottom: "0.5rem" }}>
                    Cookies bezpieczeństwa - chronią przed atakami
                  </div>
                  <div>Cookies preferencji - zapamiętują Twoje ustawienia</div>
                </div>
              </div>

              <div
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  padding: "1.5rem",
                  borderRadius: "8px",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.3rem",
                    fontWeight: "500",
                    marginBottom: "0.5rem",
                  }}
                >
                  Cookies analityczne
                </h3>
                <p style={{ marginBottom: "1rem" }}>
                  Pomagają nam zrozumieć, jak użytkownicy korzystają z naszej
                  strony.
                </p>
                <div style={{ paddingLeft: "1rem" }}>
                  <div style={{ marginBottom: "0.5rem" }}>
                    Google Analytics - analiza ruchu na stronie
                  </div>
                  <div>Cookies wydajności - pomiar szybkości ładowania</div>
                </div>
              </div>

              <div
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  padding: "1.5rem",
                  borderRadius: "8px",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.3rem",
                    fontWeight: "500",
                    marginBottom: "0.5rem",
                  }}
                >
                  Cookies marketingowe
                </h3>
                <p style={{ marginBottom: "1rem" }}>
                  Używane do personalizacji reklam i treści marketingowych.
                </p>
                <div style={{ paddingLeft: "1rem" }}>
                  <div style={{ marginBottom: "0.5rem" }}>
                    Cookies reklamowe - personalizacja reklam
                  </div>
                  <div>
                    Cookies mediów społecznościowych - udostępnianie treści
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section style={{ marginBottom: "2.5rem" }}>
            <h2
              style={{
                fontSize: "1.8rem",
                fontWeight: "600",
                marginBottom: "1rem",
              }}
            >
              Twoje obecne preferencje
            </h2>
            <div
              style={{
                background: "rgba(255, 255, 255, 0.15)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                borderRadius: "8px",
                padding: "1.5rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>Cookies niezbędne:</span>
                  <span style={{ fontWeight: "500", color: "#a7f3d0" }}>
                    Zawsze aktywne
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>Cookies analityczne:</span>
                  <span
                    style={{
                      fontWeight: "500",
                      color: preferences.analytics ? "#a7f3d0" : "#fca5a5",
                    }}
                  >
                    {preferences.analytics ? "Aktywne" : "Nieaktywne"}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>Cookies marketingowe:</span>
                  <span
                    style={{
                      fontWeight: "500",
                      color: preferences.marketing ? "#a7f3d0" : "#fca5a5",
                    }}
                  >
                    {preferences.marketing ? "Aktywne" : "Nieaktywne"}
                  </span>
                </div>
              </div>

              <div
                style={{
                  marginTop: "1.5rem",
                  paddingTop: "1.5rem",
                  borderTop: "1px solid rgba(255, 255, 255, 0.3)",
                }}
              >
                <button
                  onClick={handleRevokeConsent}
                  style={{
                    background: "#dc2626",
                    color: "white",
                    padding: "0.75rem 1.5rem",
                    borderRadius: "6px",
                    border: "none",
                    fontSize: "0.9rem",
                    fontWeight: "500",
                    cursor: "pointer",
                    transition: "background-color 0.2s",
                    fontFamily: "inherit",
                  }}
                  onMouseOver={(e) => (e.target.style.background = "#b91c1c")}
                  onMouseOut={(e) => (e.target.style.background = "#dc2626")}
                >
                  Cofnij zgodę na cookies
                </button>
              </div>
            </div>
          </section>

          <section style={{ marginBottom: "2.5rem" }}>
            <h2
              style={{
                fontSize: "1.8rem",
                fontWeight: "600",
                marginBottom: "1rem",
              }}
            >
              Zarządzanie cookies w przeglądarce
            </h2>
            <p style={{ marginBottom: "1.5rem", fontSize: "1.1rem" }}>
              Możesz kontrolować cookies w ustawieniach swojej przeglądarki:
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "1rem",
              }}
            >
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  padding: "1.5rem",
                  borderRadius: "8px",
                }}
              >
                <h4
                  style={{
                    fontWeight: "500",
                    marginBottom: "0.5rem",
                    fontSize: "1.1rem",
                  }}
                >
                  Chrome:
                </h4>
                <div style={{ fontSize: "0.95rem", lineHeight: "1.6" }}>
                  <div style={{ marginBottom: "0.25rem" }}>
                    1. Menu → Ustawienia
                  </div>
                  <div style={{ marginBottom: "0.25rem" }}>
                    2. Prywatność → Cookies
                  </div>
                  <div>3. Wybierz ustawienia</div>
                </div>
              </div>

              <div
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  padding: "1.5rem",
                  borderRadius: "8px",
                }}
              >
                <h4
                  style={{
                    fontWeight: "500",
                    marginBottom: "0.5rem",
                    fontSize: "1.1rem",
                  }}
                >
                  Firefox:
                </h4>
                <div style={{ fontSize: "0.95rem", lineHeight: "1.6" }}>
                  <div style={{ marginBottom: "0.25rem" }}>
                    1. Menu → Preferencje
                  </div>
                  <div style={{ marginBottom: "0.25rem" }}>
                    2. Prywatność i bezpieczeństwo
                  </div>
                  <div>3. Cookies i dane stron</div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2
              style={{
                fontSize: "1.8rem",
                fontWeight: "600",
                marginBottom: "1rem",
              }}
            >
              Kontakt
            </h2>
            <div
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                padding: "1.5rem",
                borderRadius: "8px",
              }}
            >
              <p style={{ marginBottom: "1rem", fontSize: "1.1rem" }}>
                W przypadku pytań dotyczących cookies:
              </p>
              <div style={{ fontSize: "1rem", lineHeight: "1.6" }}>
                <div style={{ marginBottom: "0.5rem" }}>
                  Email: kontakt@greens.pl
                </div>
                <div style={{ marginBottom: "0.5rem" }}>
                  Telefon: 123 456 789
                </div>
                <div>Adres: ul. Przykładowa 123, 00-000 Warszawa</div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;
