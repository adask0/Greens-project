import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";
import ContractorProfile from "./ContractorProfile";
import ContractorListings from "./ContractorListings";
import ContractorSubscription from "./ContractorSubscription";
import ContractorSettings from "./ContractorSettings";
import ContractorReviews from "./ContractorReviews";
import ListIcon from "../assets/List.svg?react";
import Avatar from "../assets/Avatar.png";
import "../styles/contractor-dashboard.css";

const ContractorDashboard = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (location.pathname === "/contractor" || location.pathname === "/contractor/") {
      navigate("/contractor/profile", { replace: true });
    }
  }, [location.pathname, navigate]);

  useEffect(() => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMenuOpen &&
        !event.target.closest(".contractor-sidebar") &&
        !event.target.closest(".mobile-menu-toggle")
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Błąd podczas wylogowywania:", error);
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

    return Avatar;
  };

  if (!user) {
    return (
      <div className="contractor-loading">
        <div>Ładowanie...</div>
      </div>
    );
  }

  const currentPath = location.pathname;

  return (
    <div className="contractor-dashboard">
      <button
        className={`mobile-menu-toggle ${isMenuOpen ? "open" : ""}`}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <ListIcon className={`rotate-icon ${isMenuOpen ? "open" : ""}`} />
      </button>

      {isMenuOpen && (
        <div className="overlay" onClick={() => setIsMenuOpen(false)}></div>
      )}

      <div className={`contractor-sidebar ${isMenuOpen ? "open" : ""}`}>
        <div className="contractor-header">
          <div className="contractor-logo">
            <h1>Greens</h1>
            <div className="contractor-logo-dot"></div>
          </div>
        </div>

        <div className="contractor-profile-section">
          <div className="contractor-profile-avatar">
            <img
              src={getAvatarUrl()}
              alt="Avatar"
              onError={(e) => {
                e.target.src = Avatar;
              }}
            />
            <div className="contractor-status-badge">
              {user?.subscription_type || "STANDARD"}
            </div>
          </div>
          <div className="contractor-profile-info">
            <h3 className="contractor-name">
              {user?.name || user?.company_name || "Kontrachent"}
            </h3>
            <p className="contractor-location">
              {user?.city || user?.address || "Warszawa"}
            </p>
            <div className="contractor-rating">
              {renderStars(user?.rating || 0)}
            </div>
          </div>
        </div>

        <nav className="contractor-nav">
          <Link
            to="/contractor/profile"
            className={`contractor-nav-item ${
              currentPath.includes("/contractor/profile") ? "active" : ""
            }`}
          >
            <span className="nav-icon">👤</span> Dane Osobowe
          </Link>
          <Link
            to="/contractor/listings"
            className={`contractor-nav-item ${
              currentPath.includes("/contractor/listings") ? "active" : ""
            }`}
          >
            <span className="nav-icon">📋</span> Moje Oferty
          </Link>
          <Link
            to="/contractor/subscription"
            className={`contractor-nav-item ${
              currentPath.includes("/contractor/subscription") ? "active" : ""
            }`}
          >
            <span className="nav-icon">💳</span> Subskrypcje
          </Link>
          <Link
            to="/contractor/reviews"
            className={`contractor-nav-item ${
              currentPath.includes("/contractor/reviews") ? "active" : ""
            }`}
          >
            <span className="nav-icon">⭐</span> Oceny
          </Link>
          <Link
            to="/contractor/settings"
            className={`contractor-nav-item ${
              currentPath.includes("/contractor/settings") ? "active" : ""
            }`}
          >
            <span className="nav-icon">⚙️</span> Ustawienia
          </Link>
          <button onClick={handleLogout} className="contractor-nav-item logout">
            <span className="nav-icon">🚪</span> Wyloguj
          </button>
        </nav>
      </div>

      <div className="contractor-main">
        <Routes>
          <Route path="profile" element={<ContractorProfile />} />
          <Route path="listings" element={<ContractorListings />} />
          <Route path="subscription" element={<ContractorSubscription />} />
          <Route path="reviews" element={<ContractorReviews />} />
          <Route path="settings" element={<ContractorSettings />} />
        </Routes>
      </div>
    </div>
  );
};

export default ContractorDashboard;
