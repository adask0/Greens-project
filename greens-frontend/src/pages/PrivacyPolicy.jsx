import React from "react";

const PrivacyPolicy = () => {
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
          Polityka Prywatności
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
              1. Administrator danych osobowych
            </h2>
            <div
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                padding: "1.5rem",
                borderRadius: "8px",
              }}
            >
              <p style={{ marginBottom: "1rem", fontSize: "1.1rem" }}>
                Administratorem Twoich danych osobowych jest{" "}
                <strong>Greens sp. z o.o.</strong>
              </p>
              <div style={{ fontSize: "1rem", lineHeight: "1.6" }}>
                <div style={{ marginBottom: "0.5rem" }}>
                  Adres: ul. Przykładowa 123, 00-000 Warszawa
                </div>
                <div style={{ marginBottom: "0.5rem" }}>
                  Email: kontakt@greens.pl
                </div>
                <div style={{ marginBottom: "0.5rem" }}>
                  Telefon: 123 456 789
                </div>
                <div>NIP: 123-456-78-90</div>
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
              2. Jakie dane zbieramy?
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
                  Dane rejestracyjne
                </h3>
                <p style={{ marginBottom: "1rem" }}>
                  Podczas rejestracji konta zbieramy:
                </p>
                <div style={{ paddingLeft: "1rem" }}>
                  <div style={{ marginBottom: "0.5rem" }}>Imię i nazwisko</div>
                  <div style={{ marginBottom: "0.5rem" }}>Adres email</div>
                  <div style={{ marginBottom: "0.5rem" }}>Numer telefonu</div>
                  <div style={{ marginBottom: "0.5rem" }}>
                    Hasło (zaszyfrowane)
                  </div>
                  <div>Dane firmy (dla kont firmowych)</div>
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
                  Dane techniczne
                </h3>
                <p style={{ marginBottom: "1rem" }}>
                  Automatycznie zbieramy podczas korzystania z serwisu:
                </p>
                <div style={{ paddingLeft: "1rem" }}>
                  <div style={{ marginBottom: "0.5rem" }}>Adres IP</div>
                  <div style={{ marginBottom: "0.5rem" }}>
                    Typ przeglądarki i systemu
                  </div>
                  <div style={{ marginBottom: "0.5rem" }}>
                    Czas i data odwiedzin
                  </div>
                  <div style={{ marginBottom: "0.5rem" }}>
                    Odwiedzone strony
                  </div>
                  <div>Źródło ruchu</div>
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
                  Dane komunikacyjne
                </h3>
                <p style={{ marginBottom: "1rem" }}>
                  Gdy kontaktujesz się z nami:
                </p>
                <div style={{ paddingLeft: "1rem" }}>
                  <div style={{ marginBottom: "0.5rem" }}>Treść wiadomości</div>
                  <div style={{ marginBottom: "0.5rem" }}>
                    Data i czas kontaktu
                  </div>
                  <div>Dane kontaktowe z wiadomości</div>
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
              3. W jakim celu przetwarzamy dane?
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
                  Świadczenie usług
                </h3>
                <div style={{ paddingLeft: "1rem", marginTop: "0.5rem" }}>
                  <div style={{ marginBottom: "0.5rem" }}>
                    Rejestracja i prowadzenie konta
                  </div>
                  <div style={{ marginBottom: "0.5rem" }}>
                    Publikacja ogłoszeń nieruchomości
                  </div>
                  <div style={{ marginBottom: "0.5rem" }}>
                    Obsługa zapytań i wiadomości
                  </div>
                  <div>Świadczenie usług premium</div>
                </div>
                <p
                  style={{
                    marginTop: "1rem",
                    fontSize: "0.9rem",
                    fontStyle: "italic",
                  }}
                >
                  <strong>Podstawa prawna:</strong> Art. 6 ust. 1 lit. b) RODO
                  (wykonanie umowy)
                </p>
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
                  Marketing i analityka
                </h3>
                <div style={{ paddingLeft: "1rem", marginTop: "0.5rem" }}>
                  <div style={{ marginBottom: "0.5rem" }}>
                    Wysyłanie newslettera
                  </div>
                  <div style={{ marginBottom: "0.5rem" }}>
                    Personalizacja reklam
                  </div>
                  <div style={{ marginBottom: "0.5rem" }}>
                    Analiza zachowań użytkowników
                  </div>
                  <div>Ulepszanie usług</div>
                </div>
                <p
                  style={{
                    marginTop: "1rem",
                    fontSize: "0.9rem",
                    fontStyle: "italic",
                  }}
                >
                  <strong>Podstawa prawna:</strong> Art. 6 ust. 1 lit. a) RODO
                  (zgoda)
                </p>
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
                  Obowiązki prawne
                </h3>
                <div style={{ paddingLeft: "1rem", marginTop: "0.5rem" }}>
                  <div style={{ marginBottom: "0.5rem" }}>
                    Prowadzenie dokumentacji księgowej
                  </div>
                  <div style={{ marginBottom: "0.5rem" }}>
                    Odpowiedzi organom państwowym
                  </div>
                  <div>Wymogi podatkowe</div>
                </div>
                <p
                  style={{
                    marginTop: "1rem",
                    fontSize: "0.9rem",
                    fontStyle: "italic",
                  }}
                >
                  <strong>Podstawa prawna:</strong> Art. 6 ust. 1 lit. c) RODO
                  (obowiązek prawny)
                </p>
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
              4. Jak długo przechowujemy dane?
            </h2>
            <div
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                padding: "1.5rem",
                borderRadius: "8px",
              }}
            >
              <div style={{ marginBottom: "1rem" }}>
                <strong>Konta użytkowników:</strong> Do usunięcia konta lub 3
                lata od ostatniej aktywności
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <strong>Dane księgowe:</strong> 5 lat (wymagane prawem)
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <strong>Dane marketingowe:</strong> Do cofnięcia zgody lub
                maksymalnie 3 lata
              </div>
              <div>
                <strong>Logi systemowe:</strong> 12 miesięcy
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
              5. Komu przekazujemy dane?
            </h2>
            <div
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                padding: "1.5rem",
                borderRadius: "8px",
              }}
            >
              <p style={{ marginBottom: "1rem" }}>
                Twoje dane mogą być przekazane:
              </p>
              <div style={{ paddingLeft: "1rem" }}>
                <div style={{ marginBottom: "0.5rem" }}>
                  Dostawcom usług IT (hosting, email, analityka)
                </div>
                <div style={{ marginBottom: "0.5rem" }}>
                  Firmom księgowym i prawnym
                </div>
                <div style={{ marginBottom: "0.5rem" }}>
                  Organom państwowym (na żądanie)
                </div>
                <div>Partnerom marketingowym (za zgodą)</div>
              </div>
              <p style={{ marginTop: "1rem", fontStyle: "italic" }}>
                Wszyscy partnerzy zobowiązani są do ochrony Twoich danych.
              </p>
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
              6. Twoje prawa
            </h2>
            <div
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                padding: "1.5rem",
                borderRadius: "8px",
              }}
            >
              <p style={{ marginBottom: "1rem" }}>
                Zgodnie z RODO masz prawo do:
              </p>
              <div style={{ paddingLeft: "1rem" }}>
                <div style={{ marginBottom: "0.5rem" }}>
                  Dostępu do swoich danych
                </div>
                <div style={{ marginBottom: "0.5rem" }}>
                  Sprostowania nieprawidłowych danych
                </div>
                <div style={{ marginBottom: "0.5rem" }}>Usunięcia danych</div>
                <div style={{ marginBottom: "0.5rem" }}>
                  Ograniczenia przetwarzania
                </div>
                <div style={{ marginBottom: "0.5rem" }}>
                  Przenoszenia danych
                </div>
                <div style={{ marginBottom: "0.5rem" }}>
                  Sprzeciwu wobec przetwarzania
                </div>
                <div> Cofnięcia zgody</div>
              </div>
              <div
                style={{
                  marginTop: "1.5rem",
                  padding: "1rem",
                  background: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "6px",
                }}
              >
                <strong>Kontakt w sprawie praw:</strong> kontakt@greens.pl
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
              7. Bezpieczeństwo danych
            </h2>
            <div
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                padding: "1.5rem",
                borderRadius: "8px",
              }}
            >
              <p style={{ marginBottom: "1rem" }}>
                Stosujemy zaawansowane środki ochrony:
              </p>
              <div style={{ paddingLeft: "1rem" }}>
                <div style={{ marginBottom: "0.5rem" }}>
                  Szyfrowanie danych (SSL/TLS)
                </div>
                <div style={{ marginBottom: "0.5rem" }}>
                  Regularne kopie zapasowe
                </div>
                <div style={{ marginBottom: "0.5rem" }}>Kontrola dostępu</div>
                <div style={{ marginBottom: "0.5rem" }}>
                  Monitoring bezpieczeństwa
                </div>
                <div>Szkolenia pracowników</div>
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
              8. Pliki cookies
            </h2>
            <div
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                padding: "1.5rem",
                borderRadius: "8px",
              }}
            >
              <p style={{ marginBottom: "1rem" }}>
                Nasza strona używa plików cookies. Szczegóły znajdziesz w
                <a
                  href="/polityka-cookies"
                  style={{
                    color: "#a7f3d0",
                    textDecoration: "underline",
                    marginLeft: "0.25rem",
                    fontWeight: "500",
                  }}
                >
                  Polityce Cookies
                </a>
                .
              </p>
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
              9. Kontakt
            </h2>
            <div
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                padding: "1.5rem",
                borderRadius: "8px",
              }}
            >
              <p style={{ marginBottom: "1rem", fontSize: "1.1rem" }}>
                Administrator danych osobowych:
              </p>
              <div style={{ fontSize: "1rem", lineHeight: "1.8" }}>
                <div style={{ marginBottom: "0.5rem" }}>
                  <strong>Email:</strong> kontakt@greens.pl
                </div>
                <div style={{ marginBottom: "0.5rem" }}>
                  <strong>Telefon:</strong> 123 456 789
                </div>
                <div style={{ marginBottom: "0.5rem" }}>
                  <strong>Adres:</strong> ul. Przykładowa 123, 00-000 Warszawa
                </div>
                <div>
                  <strong>Godziny pracy:</strong> Pn-Pt 9:00-17:00
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
