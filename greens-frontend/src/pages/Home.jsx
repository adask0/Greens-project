import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import api from "../services/api";
import "../styles/home.css";

// Import ikon/obrazków
import Icon1 from "../assets/1.png";
import Icon2 from "../assets/1(1).png";
import Icon3 from "../assets/1(2).png";
import Icon4 from "../assets/1(3).png";
import Icon5 from "../assets/5.png";
import Icon6 from "../assets/6.png";
import Icon7 from "../assets/7.png";
import Avatar from "../assets/Avatar.png";
import Logo from "../assets/Logo.png";
import img1 from "../assets/img1.png";
import imgPeople from "../assets/people.png";
import imgClimb from "../assets/climb.png";

const Home = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isConsentChecked, setIsConsentChecked] = useState(false);

  // Stany dla formularza kontaktowego
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [captchaValue, setCaptchaValue] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    api
      .get("/listings", {
        params: {
          featured: 1,
          per_page: 3,
        },
      })
      .then((response) => {
        console.log("API Response:", response.data);

        const data =
          response.data?.data?.data ||
          response.data?.data ||
          response.data ||
          [];

        console.log("Extracted data:", data);

        if (Array.isArray(data)) {
          setListings(data);
        } else {
          console.warn("API nie zwróciło tablicy:", data);
          setListings([]);
        }

        setLoading(false);
      })
      .catch((error) => {
        console.error("Błąd podczas pobierania ogłoszeń:", error);
        setListings([]);
        setLoading(false);
      });
  }, []);

  const services = [
    {
      icon: Icon1,
      title: "Usługi porządkowe",
      link: "/lista?category=services-cleaning",
    },
    {
      icon: Icon2,
      title: "Zarządzanie nieruchomościami mieszkalnymi",
      link: "/lista?category=residential-management",
    },
    {
      icon: Icon3,
      title: "Nieruchomości przemysłowe",
      link: "/lista?category=industrial-properties",
    },
    {
      icon: Icon4,
      title: "Nieruchomości gruntowe",
      link: "/lista?category=land-properties",
    },
  ];

  const handleListingClick = (listingId) => {
    navigate(`/ogloszenie/${listingId}`);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} className="star filled">
          ★
        </span>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <span key="half" className="star half">
          ★
        </span>
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="star empty">
          ★
        </span>
      );
    }

    return stars;
  };

  // Obsługa zmian w formularzu
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Obsługa captcha
  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
  };

  // Obsługa wysyłania formularza
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Walidacja
    if (!formData.name || !formData.email || !formData.message) {
      setSubmitMessage('Proszę wypełnić wszystkie wymagane pola.');
      return;
    }

    if (!isConsentChecked) {
      setSubmitMessage('Proszę wyrazić zgodę na przetwarzanie danych osobowych.');
      return;
    }

    if (!captchaValue) {
      setSubmitMessage('Proszę potwierdzić captchę.');
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      // Wysyłanie maila przez Laravel API
      const response = await api.post('/contact', {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        message: formData.message,
        'g-recaptcha-response': captchaValue
      });

      if (response.status === 200 || response.status === 201) {
        setSubmitMessage('Wiadomość została wysłana pomyślnie!');
        // Resetowanie formularza
        setFormData({
          name: '',
          phone: '',
          email: '',
          message: ''
        });
        setIsConsentChecked(false);
        setCaptchaValue(null);
        // Reset captcha
        if (window.grecaptcha) {
          window.grecaptcha.reset();
        }
      }
    } catch (error) {
      console.error('Błąd przy wysyłaniu wiadomości:', error);
      const errorMessage = error.response?.data?.message ||
                          error.response?.data?.error ||
                          'Wystąpił błąd podczas wysyłania wiadomości. Spróbuj ponownie.';
      setSubmitMessage(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="home-container">
      <section className="home-hero">
        <div className="home-hero-content">
          <div className="home-hero-text">
            <div className="home-logo">
              <h1>Greens</h1>
              <div className="home-logo-dot"></div>
            </div>

            <h2 className="home-title">
              Twoje miejsce,
              <br />
              <span className="home-title-highlight">nasze zadanie</span>
            </h2>

            <p className="home-description">
              Łączymy specjalistów z klientami 24/7. Usługi od A do Z dla firm i
              osób fizycznych. Sprawdzeni partnerzy, elastyczne rozwiązania.
            </p>

            <div className="home-buttons">
              <Link to="/lista" className="home-btn-primary">
                Znajdź Usługe
              </Link>
              <Link to="/contractor/listings" className="home-btn-secondary">
                Dodaj Ogłoszenie
              </Link>
            </div>
          </div>

          <div className="home-hero-image">
            <div className="home-hero-image-container">
              <div className="home-hero-image-content">
                <img src={img1} alt="Pan z żarówką" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="home-services">
        <h2 className="home-services-title">
          Nasze usługi,
          <br />
          <span className="home-services-title-highlight">
            znajdź specjaliste
          </span>
        </h2>

        <div className="home-services-grid">
          {services.map((service, index) => (
            <Link key={index} to={service.link} className="home-service-card">
              <div className="home-services-container">
                <div className="home-service-arrow">↗</div>

                <img
                  src={service.icon}
                  alt={service.title}
                  className="home-service-icon"
                />

                <h3 className="home-service-title">{service.title}</h3>
              </div>

              <div className="home-service-link">PRZEJDŹ DO LISTY</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-listings">
        <span className="home-listings-title">Ostatnio dodane</span>

        {loading ? (
          <div className="home-listings-loading">Ładowanie ogłoszeń...</div>
        ) : (
          <div className="home-listings-container">
            {Array.isArray(listings) && listings.length > 0 ? (
              listings.slice(0, 3).map((listing, index) => (
                <div
                  key={listing.id || index}
                  className="search-listing-card"
                  onClick={() => handleListingClick(listing.id || index)}
                >
                  <div className="search-listing-header">
                    <img
                      src={Avatar}
                      alt="Avatar"
                      className="search-listing-avatar"
                    />
                    <div className="search-listing-info">
                      <h4 className="search-listing-title">
                        {listing.title || "Nieruchomości dual color"}
                      </h4>
                      <p className="search-listing-description">
                        {listing.description ||
                          "Komplex oferta dla nieruchomości"}
                      </p>
                      <div className="search-listing-rating">
                        {renderStars(listing.rating || 4.5)}
                        <span className="rating-value">
                          ({listing.rating || 4.5})
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="search-listing-footer">
                    <div
                      style={{
                        backgroundColor: "rgba(0, 0, 0, 0)",
                      }}
                    >
                      <div className="search-listing-category">
                        {listing.category || "Zarządzanie nieruchomościami"}
                      </div>
                      <div className="search-listing-city">
                        {listing.location || "Warszawa"}
                      </div>
                      <div className="search-listing-price">
                        {listing.price ? `${listing.price}zł` : "200zł"}
                      </div>
                    </div>
                  </div>
                  <button className="search-listing-btn">Pokaż</button>
                </div>
              ))
            ) : (
              <div className="home-listings-empty">
                <p>Brak dostępnych ogłoszeń</p>
              </div>
            )}
          </div>
        )}

        <div className="home-listings-link">
          <Link to="/listings">Przejdź do wszystkich</Link>
        </div>
      </section>

      <section className="home-about">
        <div className="home-about-grid">
          <div>
            <h2 className="home-about-title">
              O nas
              <br />
              <span className="home-about-title-highlight">
                Krótko o firmie
              </span>
            </h2>

            <p className="home-about-text">
              GREENS to platforma łącząca specjalistów wykonawców z klientami
              biznesowymi i prywatnych. Działamy kompleksowo w branży
              nieruchomości i usług pomocniczych. Doświadczenie zespołu plus
              kompetencje zarządcze gwarantują sukces.
            </p>
          </div>

          <div className="home-about-image">
            <div className="home-about-image-content">
              <img src={imgPeople} alt="O nas" />
            </div>
          </div>
        </div>

        <div className="home-mission-grid">
          <div className="home-mission-image">
            <div className="home-mission-image-content">
              <img src={imgClimb} alt="Nasza misja" />
            </div>
          </div>

          <div className="home-mission-content">
            <span className="home-mission-title">Nasza misja</span>

            <p className="home-mission-text">
              Specjalizujemy się w systematycznym zarządzaniu nieruchomościami
              różnego typu oraz kompletną obsługą techniczną obiektów.
              Świadczymy profesjonalne przeglądy eksperckich ekspertów oraz
              monitoring kompletnej infrastruktury i wykańczanie obiektów
              mieszkalnych.
            </p>
          </div>
        </div>
      </section>

      <section className="home-contact">
        <h2 className="home-contact-title">Kontakt z nami</h2>

        <div className="home-contact-icons">
          <div className="home-contact-icons-container">
            <div className="home-contact-icon-item">
              <img src={Icon7} alt="Support 24/7" />
              <span>Support 24/7</span>
            </div>
            <div className="home-contact-icon-item mail">
              <img src={Icon6} alt="Mail" />
              <span>Mail</span>
            </div>
            <div className="home-contact-icon-item">
              <img src={Icon5} alt="Telefon" />
              <span>Telefon</span>
            </div>
          </div>
        </div>

        <form className="home-contact-form" onSubmit={handleSubmit}>
          <div className="home-contact-form-row">
            <label className="home-contact-form-label">
              <span className="input-title">Imię: *</span>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Karolina"
                className="home-contact-form-input"
                required
              />
            </label>
            <label className="home-contact-form-label">
              <span className="input-title">Telefon:</span>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+48 000 000 000"
                className="home-contact-form-input"
              />
            </label>
            <label className="home-contact-form-label">
              <span className="input-title">E-mail: *</span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="example@gmail.com"
                className="home-contact-form-input"
                required
              />
            </label>
          </div>

          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            placeholder="Twoja wiadomość *"
            rows={isMobile ? "6" : "8"}
            className="home-contact-form-textarea"
            required
          ></textarea>

          <div className="home-contact-form-captcha">
            <ReCAPTCHA
              sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"}
              onChange={handleCaptchaChange}
            />
          </div>

          <label className="home-contact-form-consent">
            <input
              type="checkbox"
              required
              checked={isConsentChecked}
              onChange={(e) => setIsConsentChecked(e.target.checked)}
            />

            <div
              className={`home-contact-form-checkbox ${
                isConsentChecked ? "checked" : ""
              }`}
            >
              {isConsentChecked && (
                <svg
                  className="icon-home"
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
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

            <span className="home-contact-form-consent-text">
              Wyrażam zgodę na przetwarzanie moich danych osobowych zgodnie z
              Rozporządzeniem o Ochronie Danych Osobowych w celu realizacji
              zgłoszenia. *
            </span>
          </label>

          {submitMessage && (
            <div className={`home-contact-form-message ${submitMessage.includes('pomyślnie') ? 'success' : 'error'}`}>
              {submitMessage}
            </div>
          )}

          <div className="home-contact-form-submit">
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Wysyłanie...' : 'Wyślij'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default Home;
