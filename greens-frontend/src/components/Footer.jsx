import Logo from "../assets/Logo.png";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Avatar from "../assets/Avatar.png";
import facebookIcon from "../assets/facebook.svg";
import instagramIcon from "../assets/instagram.svg";
import linkedinIcon from "../assets/linkedin.svg";
import youtubeIcon from "../assets/youtube.svg";
import "../styles/footer.css";

const Footer = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const socialMedia = [
    {
      name: "facebook",
      icon: facebookIcon,
      url: "https://www.facebook.com",
    },
    {
      name: "instagram",
      icon: instagramIcon,
      url: "https://www.instagram.com",
    },
    {
      name: "linkedin",
      icon: linkedinIcon,
      url: "https://www.linkedin.com",
    },
    {
      name: "youtube",
      icon: youtubeIcon,
      url: "https://www.youtube.com",
    },
  ];

  const SocialMediaIcons = () => (
    <div className="social-media-icons">
      {socialMedia.map((social) => (
        <a
          key={social.name}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          className="social-links"
        >
          <img
            src={social.icon}
            alt={`${social.name} icon`}
            className="media-icon"
          />
        </a>
      ))}
    </div>
  );

  return (
    <div className="footer-container">
      <div className="top-footer">
        <div className="first-footer">
          <Link to="/">
            <img src={Logo} alt="Greens Logo" />
          </Link>
          {!isMobile && <SocialMediaIcons />}
        </div>
        <div className="second-footer">
          Specjalizujemy się w kompleksowym zarządzaniu nieruchomościami. Dzięki
          współpracy z wykwalifikowanymi partnerami oferujemy elastyczne,
          dopasowane rozwiązania i wysoką jakość usług.
        </div>
        <div className="third-footer">
          {isMobile && <SocialMediaIcons />}
          <div className="about-us">
            <h2>O NAS</h2>
            <p>kontakt</p>
            <p>social media</p>
          </div>
          <div className="about-us">
            <h2>INFO</h2>
            <Link to="/polityka-prywatnosci">
              <p>polityka prywatności</p>
            </Link>
            <p>regulamin</p>
            <Link to="/polityka-cookies">
              <p>cookies</p>
            </Link>
          </div>
        </div>
      </div>
      <div className="bottom-footer">
        <strong>© 2025 Greens sp. z o.o.</strong>
        <p>
          tel: <strong>798 408 333</strong>
        </p>
      </div>
    </div>
  );
};

export default Footer;
