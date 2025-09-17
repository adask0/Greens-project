import React, { useState, useEffect } from "react";
import VectorIcon from "../assets/Vector.svg?react";
import RatingIcon from "../assets/Rating.svg?react";
import ProfilesIcon from "../assets/Profiles.svg?react";
import ArrowIcon from "../assets/Arrow.svg?react";
import LogOutIcon from "../assets/LogOut.svg?react";
import ListIcon from "../assets/List.svg?react";
import "../styles/admin-list.css";
import CompanyList from "./CompanyList";
import AnnouncementsList from "./AnnouncementsList";
import MessagesList from "./MessagesList";
import SubscriptionsList from "./SubscriptionsList";
import CategoryList from "./CategoryList";
// import CookieManagement from "./CookieManagement";
import { useAuth } from "../contexts/AuthContext";

const AdminPanel = () => {
  const [selectedList, setSelectedList] = useState("company");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { logout } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);
      window.location.href = "/login";
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMenuOpen &&
        !event.target.closest(".admin-sidebar") &&
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

  const menuItems = [
    {
      id: "company",
      name: "Lista firm",
      icon: VectorIcon,
      component: CompanyList,
    },
    {
      id: "profiles",
      name: "Ogłoszenia",
      icon: ProfilesIcon,
      component: AnnouncementsList,
    },
    {
      id: "categories",
      name: "Kategorie",
      icon: ListIcon,
      component: CategoryList,
    },
    {
      id: "messages",
      name: "Wiadomości",
      icon: ArrowIcon,
      component: MessagesList,
    },
    {
      id: "subscription",
      name: "Subskrypcje",
      icon: RatingIcon,
      component: SubscriptionsList,
    },
    // {
    //   id: "cookies",
    //   name: "Cookies",
    //   icon: ListIcon,
    //   component: CookieManagement,
    // },
  ];

  const activeComponent =
    menuItems.find((item) => item.id === selectedList)?.component ||
    CompanyList;
  const ActiveComponent = activeComponent;

  const handleMenuItemClick = (id) => {
    setSelectedList(id);
    if (window.innerWidth <= 768) {
      setIsMenuOpen(false);
    }
  };

  return (
    <div className="admin-container">
      <button
        className={`mobile-menu-toggle ${isMenuOpen ? "menu-open" : ""}`}
        onClick={toggleMenu}
      >
        <ListIcon className={`rotate-icon ${isMenuOpen ? "open" : ""}`} />
      </button>

      <div className={`admin-sidebar ${isMenuOpen ? "open" : ""}`}>
        <nav className="admin-nav">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <div
                key={item.id}
                className={`nav-item ${
                  selectedList === item.id ? "active" : ""
                }`}
                onClick={() => handleMenuItemClick(item.id)}
              >
                <span className="nav-text">{item.name}</span>
                <IconComponent />
              </div>
            );
          })}
        </nav>
        <div className="logout-section">
          <button className="logout-btn" onClick={handleLogout}>
            <span>Wyloguj</span>
            <LogOutIcon />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="admin-content-wrapper">
        <div className="admin-content">
          <ActiveComponent />
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
