import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../styles/profile.css";
import api from "../services/api";
import CommentsSection from "./CommentsSection";

import Avatar from "../assets/Avatar.png";
import facebookIcon from "../assets/facebook.svg";
import instagramIcon from "../assets/instagram.svg";
import linkedinIcon from "../assets/linkedin.svg";
import youtubeIcon from "../assets/youtube.svg";

const Profile = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContactInfo, setShowContactInfo] = useState({
    phone: false,
    email: false,
  });
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  const iconMap = {
    facebook: facebookIcon,
    instagram: instagramIcon,
    linkedin: linkedinIcon,
    youtube: youtubeIcon,
  };

  useEffect(() => {
    fetchListing();
  }, [id]);

  // Sprawdź czy oferta jest w ulubionych
  useEffect(() => {
    if (user && listing) {
      checkIfFavorite();
    }
  }, [user, listing]);

  const checkIfFavorite = async () => {
    if (!user || !listing) return;

    try {
      const response = await api.get("/user/favorites");
      const favorites = response.data.favorites || [];
      setIsFavorite(favorites.includes(parseInt(id)));
    } catch (error) {
      console.error("Error checking favorites:", error);
    }
  };

  const toggleFavorite = async () => {
    if (!user) {
      alert("Musisz być zalogowany, aby dodać do ulubionych");
      return;
    }

    setFavoriteLoading(true);
    try {
      const response = await api.post(`/listings/${id}/toggle-favorite`);
      setIsFavorite(response.data.is_favorited);

      // Pokaż komunikat
      const message = response.data.is_favorited
        ? "Dodano do ulubionych!"
        : "Usunięto z ulubionych!";

      // Możesz dodać toast notification tutaj
      console.log(message);
    } catch (error) {
      console.error("Error toggling favorite:", error);
      alert("Wystąpił błąd. Spróbuj ponownie.");
    } finally {
      setFavoriteLoading(false);
    }
  };

  const fetchListing = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("=== FETCHING LISTING ===");
      console.log("Listing ID:", id);

      const response = await api.get(`/listings/${id}`);
      console.log("Listing response:", response.data);

      let listingData = response.data?.data || response.data;

      // Parsuj zdjęcia z bazy danych
      let images = [];
      try {
        if (listingData.images) {
          console.log("Raw images from DB:", listingData.images);

          // Jeśli images to string JSON, sparsuj go
          if (typeof listingData.images === "string") {
            const parsedImages = JSON.parse(listingData.images);
            console.log("Parsed images array:", parsedImages);

            // Konwertuj nazwy plików na pełne URL-e
            images = parsedImages.map((filename) => {
              // Usuń slashe z początku jeśli są
              const cleanFilename = filename.replace(/^\/+/, "");
              return `http://localhost:8000/storage/listings/${cleanFilename}`;
            });
          } else if (Array.isArray(listingData.images)) {
            // Jeśli już jest tablicą
            images = listingData.images.map((img) => {
              if (img.startsWith("http")) {
                return img;
              }
              if (img.startsWith("/storage")) {
                return `http://localhost:8000${img}`;
              }
              const cleanFilename = img.replace(/^\/+/, "");
              return `http://localhost:8000/storage/listings/${cleanFilename}`;
            });
          }
        }

        console.log("Final processed images:", images);
      } catch (imageError) {
        console.error("Error parsing images:", imageError);
        console.error("Raw images data:", listingData.images);
        images = []; // Fallback do pustej tablicy
      }

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
        avatar: listingData.avatar || Avatar,
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
        images: images, // Tylko zdjęcia z bazy danych
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

      console.log("Mapped listing:", mappedListing);
      setListing(mappedListing);

      // Zwiększ licznik kliknięć
      try {
        await api.post(`/listings/${id}/increment-clicks`);
        console.log("Click counter incremented");
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
    if (listing.images && listing.images.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === listing.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (listing.images && listing.images.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? listing.images.length - 1 : prev - 1
      );
    }
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

  // Funkcja do obsługi błędów ładowania obrazków
  const handleImageError = (e) => {
    console.error("Error loading image:", e.target.src);
    // Ukryj obrazek, który się nie załadował
    e.target.style.display = "none";
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
          <div className="profile-price">{listing.price}zł</div>

          {user && (
            <button
              className={`profile-favorite-btn ${isFavorite ? "active" : ""} ${
                favoriteLoading ? "adding" : ""
              }`}
              onClick={toggleFavorite}
              disabled={favoriteLoading}
            >
              <svg
                className="favorite-icon"
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill={isFavorite ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z" />
              </svg>
            </button>
          )}
        </div>

        <div className="profile-content">
          <div className="profile-sidebar">
            <div className="profile-contact-card">
              <div className="profile-rating">
                {renderStars(listing.rating)}
              </div>

              <div className="profile-avatar-container">
                <img
                  src={
                    listing.avatar.startsWith("http") ||
                    listing.avatar.startsWith("/")
                      ? listing.avatar
                      : Avatar
                  }
                  alt={listing.companyName}
                  className="profile-avatar"
                  onError={(e) => {
                    e.target.src = Avatar;
                  }}
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

            {listing.images && listing.images.length > 0 && (
              <div className="profile-gallery">
                <div className="profile-gallery-main">
                  {listing.images.length > 1 && (
                    <button
                      className="gallery-nav-btn prev"
                      onClick={prevImage}
                    >
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
                  )}

                  <img
                    src={listing.images[currentImageIndex]}
                    alt={`${listing.companyName} - zdjęcie ${
                      currentImageIndex + 1
                    }`}
                    className="profile-gallery-image"
                    onError={handleImageError}
                  />

                  {listing.images.length > 1 && (
                    <button
                      className="gallery-nav-btn next"
                      onClick={nextImage}
                    >
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
                  )}
                </div>

                {listing.images.length > 1 && (
                  <div className="profile-gallery-thumbnails">
                    {listing.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Miniatura ${index + 1}`}
                        className={`profile-thumbnail ${
                          index === currentImageIndex ? "active" : ""
                        }`}
                        onClick={() => setCurrentImageIndex(index)}
                        onError={handleImageError}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {(!listing.images || listing.images.length === 0) && (
              <div className="no-images-message">
                <p>Brak zdjęć do wyświetlenia</p>
              </div>
            )}

            <CommentsSection listingId={listing.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
