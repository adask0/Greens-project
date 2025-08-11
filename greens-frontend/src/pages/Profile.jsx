import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../styles/profile.css";
import api from "../services/api";
import CommentsSection from "./CommentsSection";

// Import assets - popraw ścieżki jeśli potrzeba
import Avatar from "../assets/Avatar.png";
import person1 from "../assets/person1.png";
import person2 from "../assets/person2.png";
import person3 from "../assets/person3.png";
import person4 from "../assets/person4.png";
import facebookIcon from "../assets/facebook.svg";
import instagramIcon from "../assets/instagram.svg";
import linkedinIcon from "../assets/linkedin.svg";
import youtubeIcon from "../assets/youtube.svg";

const Profile = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContactInfo, setShowContactInfo] = useState({
    phone: false,
    email: false,
  });

  // Mapa obrazków
  const imageMap = {
    "../assets/Avatar.png": Avatar,
    "../assets/person1.png": person1,
    "../assets/person2.png": person2,
    "../assets/person3.png": person3,
    "../assets/person4.png": person4,
  };

  // Mapa ikon social media
  const iconMap = {
    facebook: facebookIcon,
    instagram: instagramIcon,
    linkedin: linkedinIcon,
    youtube: youtubeIcon,
  };

  useEffect(() => {
    fetchListing();
  }, [id]);

  const fetchListing = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get(`/listings/${id}`);

      let listingData = response.data?.data || response.data;

      // Mapowanie danych z API na format używany w komponencie
      const mappedListing = {
        id: listingData.id,
        title: listingData.title || listingData.company_name || "Brak tytułu",
        description: listingData.description || "Brak opisu",
        longDescription:
          listingData.long_description ||
          listingData.description ||
          "Brak szczegółowego opisu",
        category: listingData.category || "Inne",
        subcategory: listingData.subcategory || "Ogólne",
        price: listingData.price || 0,
        rating: listingData.rating || (Math.random() * 2 + 3).toFixed(1),
        location: listingData.location || "Warszawa",
        companyName: listingData.company_name || "Firma",
        avatar: "../assets/Avatar.png",
        phone: listingData.phone || "+48 123 456 789",
        email: listingData.email || "kontakt@firma.pl",
        tags: [
          listingData.subcategory,
          listingData.category,
          listingData.location,
        ].filter(Boolean),
        experience:
          listingData.experience ||
          `${Math.floor(Math.random() * 15) + 3} lat doświadczenia`,
        images: [
          "../assets/person1.png",
          "../assets/person2.png",
          "../assets/person3.png",
        ],
        socialMedia: {
          facebook: listingData.facebook_url || "",
          instagram: listingData.instagram_url || "",
          linkedin: listingData.linkedin_url || "",
          youtube: listingData.youtube_url || "",
        },
        clicks: listingData.clicks || 0,
        featured: listingData.featured || false,
        status: listingData.status || "aktywne",
        created_at: listingData.created_at,
        published_at: listingData.published_at,
      };

      setListing(mappedListing);

      // Zwiększ licznik kliknięć
      try {
        await api.post(`/listings/${id}/increment-clicks`);
      } catch (clickError) {
        console.error(
          "Błąd podczas zwiększania licznika kliknięć:",
          clickError
        );
      }
    } catch (err) {
      console.error("Błąd podczas pobierania ogłoszenia:", err);
      setError("Błąd podczas pobierania ogłoszenia");
    } finally {
      setLoading(false);
    }
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

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === listing.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? listing.images.length - 1 : prev - 1
    );
  };

  const handleContactClick = (type) => {
    setShowContactInfo((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const renderSocialMedia = () => {
    const socialIcons = [];

    Object.entries(listing.socialMedia).forEach(([platform, url]) => {
      if (url) {
        socialIcons.push(
          <a
            key={platform}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
          >
            <img
              src={iconMap[platform]}
              alt={platform}
              className="social-icon"
            />
          </a>
        );
      }
    });

    return socialIcons.length > 0 ? socialIcons : null;
  };

  if (loading) {
    return (
      <div className="profile-bgc">
        <div className="profile-container">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "50vh",
              fontSize: "18px",
            }}
          >
            Ładowanie...
          </div>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="profile-bgc">
        <div className="profile-container">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "50vh",
              fontSize: "18px",
              color: "red",
            }}
          >
            <p>{error || "Nie znaleziono ogłoszenia"}</p>
            <button
              onClick={() => window.history.back()}
              style={{
                marginTop: "20px",
                padding: "10px 20px",
                backgroundColor: "#16a34a",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Wróć
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-bgc">
      <div className="profile-container">
        <div className="profile-header">
          <h1 className="profile-category">Kategoria: {listing.category}</h1>
          <h1 className="profile-title">{listing.title}</h1>
          <div className="profile-price">{listing.price}zł</div>
        </div>
        <div className="profile-content">
          <div className="profile-sidebar">
            <div className="profile-contact-card">
              <div className="profile-rating">
                {renderStars(listing.rating)}
              </div>

              <div className="profile-avatar-container">
                <img
                  src={imageMap[listing.avatar] || Avatar}
                  alt={listing.companyName}
                  className="profile-avatar"
                />
              </div>

              <h3 className="profile-company-name">{listing.companyName}</h3>
              <p className="profile-location">{listing.location}</p>

              <div className="profile-contact-buttons">
                <button
                  className="profile-contact-btn phone-btn"
                  onClick={() => handleContactClick("phone")}
                >
                  {showContactInfo.phone ? listing.phone : "Telefon"}
                </button>

                <button
                  className="profile-contact-btn email-btn"
                  onClick={() => handleContactClick("email")}
                >
                  {showContactInfo.email ? listing.email : "Mail"}
                </button>
              </div>
            </div>
            {renderSocialMedia() && (
              <div className="profile-social-media">{renderSocialMedia()}</div>
            )}
          </div>

          <div className="profile-main">
            <div className="profile-info">
              <div className="profile-description">
                <h2>Opis</h2>
                <p>{listing.longDescription}</p>
              </div>

              <div className="profile-tags">
                <h3>Specjalizacje</h3>
                <div className="tags-container">
                  {listing.tags.map((tag, index) => (
                    <span key={index} className="profile-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="profile-experience">
                <h3>Doświadczenie</h3>
                <p>{listing.experience}</p>
              </div>
            </div>

            {/* Galeria zdjęć NA DOLE */}
            <div className="profile-gallery">
              <div className="profile-gallery-main">
                <button className="gallery-nav-btn prev" onClick={prevImage}>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>

                <img
                  src={imageMap[listing.images[currentImageIndex]] || person1}
                  alt={`${listing.companyName} - zdjęcie ${
                    currentImageIndex + 1
                  }`}
                  className="profile-gallery-image"
                />

                <button className="gallery-nav-btn next" onClick={nextImage}>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              </div>

              <div className="profile-gallery-thumbnails">
                {listing.images.map((image, index) => (
                  <img
                    key={index}
                    src={imageMap[image] || person1}
                    alt={`Miniatura ${index + 1}`}
                    className={`profile-thumbnail ${
                      index === currentImageIndex ? "active" : ""
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            </div>

            <CommentsSection listingId={listing.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
