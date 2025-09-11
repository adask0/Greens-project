import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import Logo from "../assets/Logo.png";
import { Link, useLocation } from "react-router-dom";
import "../styles/header.css";

const Header = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isTablet, setIsTablet] = useState(
    window.innerWidth > 768 && window.innerWidth <= 1024
  );
  const [isSmallDesktop, setIsSmallDesktop] = useState(
    window.innerWidth > 1024 && window.innerWidth <= 1200
  );
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsTablet(window.innerWidth > 768 && window.innerWidth <= 1024);
      setIsSmallDesktop(window.innerWidth > 1024 && window.innerWidth <= 1200);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => logout();
  const toggleMenu = () => setMenuOpen(!menuOpen);

  const navLinks = [
    { label: "STRONA GŁÓWNA", href: "/" },
    { label: "USŁUGI PORZĄDKOWE", href: "/lista?category=services-cleaning" },
    {
      label: "ZARZĄDZANIE NIERUCHOMOŚCIAMI MIESZKALNYMI",
      href: "/lista?category=residential-management",
    },
    {
      label: "NIERUCHOMOŚCI PRZEMYSŁOWE",
      href: "/lista?category=industrial-properties",
    },
    {
      label: "NIERUCHOMOŚCI GRUNTOWE",
      href: "/lista?category=land-properties",
    },
  ];

  const isActive = (href) => {
    if (href === "/") {
      return location.pathname === "/";
    }
    if (href.includes("/lista?category=")) {
      const category = href.split("category=")[1];
      return (
        location.pathname === "/lista" &&
        location.search.includes(`category=${category}`)
      );
    }
    return location.pathname === href;
  };

  return (
    <header className="header-container">
      <div className="header-content">
        {isMobile ? (
          <>
            <div className="header-logo-mobile">
              <Link to="/">
                <img src={Logo} alt="Greens Logo" />
              </Link>
            </div>

            <div className="header-mobile-buttons">
              <button
                onClick={toggleMenu}
                className="header-mobile-hamburger"
                aria-label="Toggle menu"
              >
                <div
                  className={`hamburger-line ${menuOpen ? "open" : ""}`}
                ></div>
                <div
                  className={`hamburger-line ${menuOpen ? "open" : ""}`}
                ></div>
                <div
                  className={`hamburger-line ${menuOpen ? "open" : ""}`}
                ></div>
              </button>
            </div>

            <div className={`header-mobile-dropdown ${menuOpen ? "open" : ""}`}>
              <div className="header-mobile-dropdown-content">
                <nav className="header-mobile-nav">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      className={`header-mobile-nav-link ${
                        isActive(link.href) ? "active" : ""
                      }`}
                      onClick={() => setMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>

                <div className="header-mobile-auth">
                  {user ? (
                    <div className="header-mobile-user-menu">
                      {user.user_type === "contractor" && (
                        <Link
                          to="/contractor"
                          className="header-mobile-panel-btn contractor"
                          onClick={() => setMenuOpen(false)}
                        >
                          Panel Kontrachenta
                        </Link>
                      )}
                      {user.is_admin && (
                        <Link
                          to="/admin"
                          className="header-mobile-panel-btn admin"
                          onClick={() => setMenuOpen(false)}
                        >
                          Panel Admina
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          handleLogout();
                          setMenuOpen(false);
                        }}
                        className="header-mobile-logout-btn"
                      >
                        Wyloguj
                      </button>
                    </div>
                  ) : (
                    <Link
                      to="/login"
                      className="header-mobile-login-btn"
                      onClick={() => setMenuOpen(false)}
                    >
                      ZALOGUJ SIĘ
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {menuOpen && (
              <div
                className="header-mobile-overlay"
                onClick={() => setMenuOpen(false)}
              ></div>
            )}
          </>
        ) : (
          <>
            <div className="header-logo">
              <Link to="/">
                <img src={Logo} alt="Greens Logo" />
              </Link>
            </div>

            <nav className="header-nav">
              <div
                className="header-nav-links"
                style={{
                  gap: isTablet
                    ? "0.4rem"
                    : isSmallDesktop
                    ? "0.7rem"
                    : "1.5rem",
                  flexWrap: isTablet ? "wrap" : "nowrap",
                }}
              >
                {navLinks.map((link) => (
                  <div
                    key={link.href}
                    className={`header-nav-item ${
                      isActive(link.href) ? "active" : ""
                    }`}
                  >
                    <Link
                      to={link.href}
                      className={`header-nav-link ${
                        isActive(link.href) ? "active" : ""
                      }`}
                    >
                      {link.label}
                    </Link>
                  </div>
                ))}
              </div>
            </nav>

            <div className="header-right">
              {user ? (
                <div className="header-user-menu">
                  {user.user_type === "contractor" && (
                    <Link
                      to="/contractor"
                      className="header-auth-btn contractor"
                    >
                      <span>Panel Kontrachenta</span>
                    </Link>
                  )}

                  {user.is_admin && (
                    <Link to="/admin" className="header-auth-btn admin">
                      <span>Panel Admina</span>
                    </Link>
                  )}
                  <div
                    style={{
                      width: "10px",
                    }}
                  ></div>
                  <button onClick={handleLogout} className="header-auth-btn">
                    Wyloguj
                  </button>
                </div>
              ) : (
                <Link to="/login" className="header-auth-btn login">
                  ZALOGUJ SIĘ
                </Link>
              )}
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
