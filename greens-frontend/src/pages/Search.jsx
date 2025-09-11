import React, { useState, useEffect } from "react";
import { useLocation, useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Avatar from "../assets/Avatar.png";
import img1 from "../assets/img1.png";
import "../styles/search.css";
import SelectWithSearch from "./SelectWithSearch";
import api from "../services/api";

const Search = () => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState("list");
  const itemsPerPage = viewMode === "grid" ? 12 : 6;
  const [priceRange, setPriceRange] = useState([100, 10000]);
  const [selectedCity, setSelectedCity] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showingFavorites, setShowingFavorites] = useState(false);
  const [favoriteListings, setFavoriteListings] = useState([]);
  const [selectedServices, setSelectedServices] = useState({
    "Usługi porządkowe": [],
    "Zarządzanie nieruchomościami mieszkalnymi": [],
    "Nieruchomości przemysłowe": [],
    "Nieruchomości gruntowe": [],
  });
  const [selectedCategoryButtons, setSelectedCategoryButtons] = useState([]);
  const [isEverythingSelected, setIsEverythingSelected] = useState(true);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Statyczne kategorie na podstawie obrazka
  const [categories, setCategories] = useState({
    "Usługi porządkowe": [
      { name: "Porządkowe", count: 0 },
      { name: "Sprzątanie biur", count: 0 },
      { name: "Mycie okien", count: 0 },
      { name: "Sprzątanie mieszkań", count: 0 },
    ],
    "Zarządzanie nieruchomościami mieszkalnymi": [
      { name: "Mieszkalnictwo", count: 0 },
      { name: "Administracja", count: 0 },
      { name: "Konserwacja", count: 0 },
      { name: "Zarządzanie wspólnotą", count: 0 },
      { name: "Nadzór techniczny", count: 0 },
    ],
    "Nieruchomości przemysłowe": [
      { name: "Przemysłowe", count: 0 },
      { name: "Fabryki", count: 0 },
      { name: "Magazyny", count: 0 },
      { name: "Hale produkcyjne", count: 0 },
      { name: "Tereny przemysłowe", count: 0 },
    ],
    "Nieruchomości gruntowe": [
      { name: "Gruntowe", count: 0 },
      { name: "Działki budowlane", count: 0 },
      { name: "Tereny rolne", count: 0 },
      { name: "Działki rekreacyjne", count: 0 },
      { name: "Tereny inwestycyjne", count: 0 },
    ],
  });

  // Pobieranie danych z API
  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("=== FETCHING LISTINGS ===");

      const response = await api.get("/listings", {
        params: {
          per_page: 100,
          status: "active",
        },
      });

      console.log("API Response:", response.data);

      let listingsData = [];

      // Obsługa różnych struktur odpowiedzi API
      if (response.data?.data?.data) {
        listingsData = response.data.data.data;
      } else if (response.data?.data) {
        listingsData = response.data.data;
      } else if (Array.isArray(response.data)) {
        listingsData = response.data;
      } else {
        console.error(
          "Nie można znaleźć danych ogłoszeń w odpowiedzi:",
          response.data
        );
        listingsData = [];
      }

      console.log("Raw listings data:", listingsData);

      // POPRAWIONE MAPOWANIE - dodanie kategorii na podstawie subcategory
      const mappedListings = listingsData.map((listing) => {
        console.log("Processing listing:", listing);

        // Mapowanie subcategory na główną kategorię
        let mainCategory = "Usługi porządkowe"; // Domyślna kategoria

        if (listing.subcategory) {
          // Sprawdź w której kategorii jest dana subcategory
          Object.entries(categories).forEach(
            ([categoryName, subcategories]) => {
              if (
                subcategories.some((sub) => sub.name === listing.subcategory)
              ) {
                mainCategory = categoryName;
              }
            }
          );
        }

        const mappedListing = {
          id: listing.id,
          title: listing.title || listing.company_name || "Brak tytułu",
          description: listing.description || "Brak opisu",
          longDescription:
            listing.long_description ||
            listing.description ||
            "Brak szczegółowego opisu",
          category: mainCategory,
          subcategory: listing.subcategory || "Ogólne",
          price: listing.price || 0,
          rating: listing.rating || (Math.random() * 2 + 3).toFixed(1),
          location: listing.location || "Warszawa",
          companyName: listing.company_name || "Firma",
          avatar: "../assets/Avatar.png",
          phone: listing.phone || "+48 123 456 789",
          email: listing.email || "kontakt@firma.pl",
          tags: [listing.subcategory, mainCategory, listing.location].filter(
            Boolean
          ),
          experience:
            listing.experience ||
            `${Math.floor(Math.random() * 15) + 3} lat doświadczenia`,
          images: [
            "../assets/person1.png",
            "../assets/person2.png",
            "../assets/person3.png",
          ],
          socialMedia: {
            facebook: "",
            instagram: "",
            linkedin: "",
            youtube: "",
          },
          clicks: listing.clicks || 0,
          featured: listing.featured || false,
          status: listing.status || "active",
          created_at: listing.created_at,
          published_at: listing.published_at,
        };

        console.log("Mapped listing:", mappedListing);
        return mappedListing;
      });

      console.log("All mapped listings:", mappedListings);
      setListings(mappedListings);

      // Aktualizuj liczniki kategorii
      updateCategoryCounts(mappedListings);
    } catch (err) {
      console.error("Błąd podczas pobierania ogłoszeń:", err);
      setError("Błąd podczas pobierania ogłoszeń");

      // Fallback - generuj przykładowe dane jeśli API nie działa
      const fallbackData = generateFallbackData();
      setListings(fallbackData);
      updateCategoryCounts(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  // Funkcja pobierania ulubionych
  const fetchFavorites = async () => {
    if (!user) return;

    try {
      const response = await api.get('/user/favorites');
      const favoriteIds = response.data.favorites || [];

      // Filtruj listings tylko do tych które są w ulubionych
      const favoritesOnly = listings.filter(listing =>
        favoriteIds.includes(listing.id)
      );

      setFavoriteListings(favoritesOnly);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      setFavoriteListings([]);
    }
  };

  // POPRAWIONA funkcja aktualizująca liczniki kategorii
  const updateCategoryCounts = (listingsData) => {
    console.log("=== UPDATING CATEGORY COUNTS ===");
    console.log("Listings data for counting:", listingsData);

    const updatedCategories = { ...categories };

    Object.keys(updatedCategories).forEach((categoryKey) => {
      updatedCategories[categoryKey].forEach((subcategory) => {
        const count = listingsData.filter((listing) => {
          const matches =
            listing.category === categoryKey &&
            listing.subcategory === subcategory.name;
          if (matches) {
            console.log(
              `Match found: ${listing.title} -> ${categoryKey} -> ${subcategory.name}`
            );
          }
          return matches;
        }).length;

        subcategory.count = count;
        console.log(`${categoryKey} -> ${subcategory.name}: ${count}`);
      });
    });

    setCategories(updatedCategories);
    console.log("Updated categories:", updatedCategories);
  };

  // Funkcja generująca dane fallback jeśli API nie działa
  const generateFallbackData = () => {
    const companies = [
      "Clean Pro",
      "EcoClean",
      "Perfect Clean",
      "Green Services",
      "Pro Management",
      "City Clean",
      "Fresh Air",
      "Clean Masters",
      "Eco Solutions",
      "Smart Clean",
    ];

    const cities = [
      "Warszawa",
      "Kraków",
      "Łódź",
      "Wrocław",
      "Poznań",
      "Gdańsk",
      "Szczecin",
      "Bydgoszcz",
      "Lublin",
      "Katowice",
    ];

    const fallbackListings = [];
    let id = 1;

    Object.entries(categories).forEach(([category, subcategories]) => {
      subcategories.forEach((subcategory) => {
        const count = Math.floor(Math.random() * 5) + 3;

        for (let i = 0; i < count; i++) {
          const company =
            companies[Math.floor(Math.random() * companies.length)];
          const city = cities[Math.floor(Math.random() * cities.length)];

          fallbackListings.push({
            id: id++,
            title: `${subcategory.name} - ${company}`,
            description: `Profesjonalne usługi ${subcategory.name.toLowerCase()} w ${city}. Doświadczony zespół z wieloletnim stażem.`,
            longDescription: `Oferujemy kompleksowe usługi ${subcategory.name.toLowerCase()} na najwyższym poziomie. Nasz zespół składa się z wykwalifikowanych specjalistów z wieloletnim doświadczeniem.`,
            category: category,
            subcategory: subcategory.name,
            price: Math.floor(Math.random() * 300) + 100,
            rating: (Math.random() * 2 + 3).toFixed(1),
            location: city,
            companyName: company,
            avatar: "../assets/Avatar.png",
            phone: `+48 ${Math.floor(Math.random() * 900000000) + 100000000}`,
            email: `kontakt@${company.toLowerCase().replace(" ", "")}.pl`,
            tags: [subcategory.name, category.split(" ")[0], city],
            experience: `${
              Math.floor(Math.random() * 15) + 3
            } lat doświadczenia`,
            images: [
              "../assets/person1.png",
              "../assets/person2.png",
              "../assets/person3.png",
            ],
            socialMedia: {
              facebook: "",
              instagram: "",
              linkedin: "",
              youtube: "",
            },
            clicks: Math.floor(Math.random() * 100),
            featured: Math.random() > 0.8,
            status: "active",
            created_at: new Date().toISOString(),
            published_at: new Date().toISOString(),
          });
        }
      });
    });

    return fallbackListings;
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      let categoryName = "";

      switch (categoryParam) {
        case "services-cleaning":
          categoryName = "Usługi porządkowe";
          break;
        case "residential-management":
          categoryName = "Zarządzanie nieruchomościami mieszkalnymi";
          break;
        case "industrial-properties":
          categoryName = "Nieruchomości przemysłowe";
          break;
        case "land-properties":
          categoryName = "Nieruchomości gruntowe";
          break;
      }

      if (categoryName && categories[categoryName]) {
        setIsEverythingSelected(false);
        setSelectedCategoryButtons([categoryName]);
        const subcategoryNames = categories[categoryName].map(
          (sub) => sub.name
        );
        setSelectedServices((prev) => ({
          ...prev,
          [categoryName]: subcategoryNames,
        }));
      }
    }
  }, [searchParams]);

  // Odświeżanie ulubionych
  useEffect(() => {
    if (showingFavorites && user) {
      fetchFavorites();
    }
  }, [listings, user]);

  // Obsługa wyszukiwania
  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  // Obsługa przycisku Szukaj
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    console.log("Searching for:", searchQuery);
  };

  // POPRAWIONA logika filtrowania z wyszukiwaniem tekstowym i ulubionymi
  const filteredListings = (() => {
    // Jeśli pokazujemy ulubione, użyj favoriteListings jako podstawy
    let baseListings = showingFavorites ? favoriteListings : listings;

    return baseListings.filter((listing) => {
      console.log("=== FILTERING LISTING ===");
      console.log(
        "Listing:",
        listing.title,
        listing.category,
        listing.subcategory
      );

      // FILTR TEKSTOWY
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const searchableText = [
          listing.title,
          listing.description,
          listing.companyName,
          listing.category,
          listing.subcategory,
          listing.location,
          ...listing.tags
        ].join(" ").toLowerCase();

        if (!searchableText.includes(query)) {
          console.log("Filtered out by search query");
          return false;
        }
      }

      // Filtr cenowy
      if (listing.price < priceRange[0] || listing.price > priceRange[1]) {
        console.log("Filtered out by price");
        return false;
      }

      // Filtr miasta
      if (selectedCity && listing.location !== selectedCity) {
        console.log("Filtered out by city");
        return false;
      }

      // Jeśli pokazujemy ulubione, nie aplikuj dodatkowych filtrów kategorii
      if (showingFavorites) {
        return true;
      }

      // Jeśli wybrano "WSZYSTKO"
      if (isEverythingSelected) {
        console.log("Everything selected - showing all");
        return true;
      }

      // Sprawdź czy jest jakakolwiek subcategory wybrana
      const hasAnySelectedSubcategory = Object.values(selectedServices).some(
        (arr) => arr.length > 0
      );

      if (!hasAnySelectedSubcategory) {
        console.log("No subcategories selected - showing all");
        return true;
      }

      // Sprawdź czy listing pasuje do wybranych subcategorii
      const matchesSelectedSubcategory = selectedServices[
        listing.category
      ]?.includes(listing.subcategory);

      console.log("Category:", listing.category);
      console.log("Subcategory:", listing.subcategory);
      console.log(
        "Selected services for category:",
        selectedServices[listing.category]
      );
      console.log("Matches:", matchesSelectedSubcategory);

      return matchesSelectedSubcategory;
    });
  })();

  console.log("=== FILTERING RESULTS ===");
  console.log("Search query:", searchQuery);
  console.log("Showing favorites:", showingFavorites);
  console.log("Total listings:", listings.length);
  console.log("Filtered listings:", filteredListings.length);
  console.log("Selected services:", selectedServices);
  console.log("Is everything selected:", isEverythingSelected);

  const totalPages = Math.ceil(
    filteredListings.length / (viewMode === "grid" ? 12 : 6)
  );
  const startIndex = (currentPage - 1) * (viewMode === "grid" ? 12 : 6);
  const currentListings = filteredListings.slice(
    startIndex,
    startIndex + (viewMode === "grid" ? 12 : 6)
  );

  const changeViewMode = (mode) => {
    const isMobile = window.innerWidth <= 768;

    if (isMobile && mode === "grid") {
      setViewMode("list");
    } else {
      setViewMode(mode);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setViewMode("list");
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleEverythingClick = () => {
    console.log("=== EVERYTHING CLICKED ===");
    setIsEverythingSelected(true);
    setShowingFavorites(false);
    setSelectedCategoryButtons([]);
    setSelectedServices({
      "Usługi porządkowe": [],
      "Zarządzanie nieruchomościami mieszkalnymi": [],
      "Nieruchomości przemysłowe": [],
      "Nieruchomości gruntowe": [],
    });
    setCurrentPage(1);
  };

  const handleFavoritesClick = async () => {
    console.log("=== FAVORITES CLICKED ===");
    setShowingFavorites(true);
    setIsEverythingSelected(false);
    setSelectedCategoryButtons([]);
    setSelectedServices({
      "Usługi porządkowe": [],
      "Zarządzanie nieruchomościami mieszkalnymi": [],
      "Nieruchomości przemysłowe": [],
      "Nieruchomości gruntowe": [],
    });
    setCurrentPage(1);

    await fetchFavorites();
  };

  const handleCategoryButtonClick = (category) => {
    console.log("=== CATEGORY BUTTON CLICKED ===", category);
    setIsEverythingSelected(false);
    setShowingFavorites(false);

    setSelectedCategoryButtons((prev) => {
      if (prev.includes(category)) {
        const updated = prev.filter((cat) => cat !== category);
        setSelectedServices((prevServices) => ({
          ...prevServices,
          [category]: [],
        }));
        return updated;
      } else {
        const updated = [...prev, category];
        const subcategoryNames = categories[category].map((sub) => sub.name);
        setSelectedServices((prevServices) => ({
          ...prevServices,
          [category]: subcategoryNames,
        }));
        return updated;
      }
    });
    setCurrentPage(1);
  };

  const handleServiceChange = (category, subcategory, checked) => {
    console.log("=== SERVICE CHANGE ===", category, subcategory, checked);
    setIsEverythingSelected(false);
    setShowingFavorites(false);

    setSelectedServices((prev) => {
      const updated = { ...prev };
      if (checked) {
        if (!updated[category].includes(subcategory)) {
          updated[category] = [...updated[category], subcategory];
        }
      } else {
        updated[category] = updated[category].filter(
          (item) => item !== subcategory
        );
      }
      console.log("Updated selected services:", updated);
      return updated;
    });
    setCurrentPage(1);
  };

  const handlePriceChange = (e) => {
    const value = parseInt(e.target.value);
    setPriceRange([priceRange[0], value]);
    setCurrentPage(1);
  };

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

  if (loading) {
    return (
      <div className="search-container">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
            fontSize: "18px",
          }}
        >
          Ładowanie ogłoszeń...
        </div>
      </div>
    );
  }

  if (error && listings.length === 0) {
    return (
      <div className="search-container">
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
          <p>{error}</p>
          <button
            onClick={fetchListings}
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
            Spróbuj ponownie
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="search-container">
      <section className="search-hero">
        <div className="search-hero-content">
          <div className="search-hero-text">
            <div className="search-hero-top">
              <div className="search-hero-title-section">
                <div className="search-logo">
                  <h1>Greens</h1>
                  <div className="search-logo-dot"></div>
                </div>

                <h2 className="search-title">
                  Twoje miejsce,
                  <br />
                  <span className="search-title-highlight">nasze zadanie</span>
                </h2>

                <p className="search-description">Lista specjalistów</p>
              </div>

              <div className="search-hero-image">
                <img src={img1} alt="Ludzik z żarówką" />
              </div>
            </div>

            <div className="search-hero-bottom">
              <form className="search-bar" onSubmit={handleSearchSubmit}>
                <div className="search-profile-container">
                  <input
                    type="text"
                    placeholder="W czym szukasz pomocy?"
                    className="search-profile"
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                  />
                  <svg
                    className="search-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#666"
                    strokeWidth="2"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                </div>

                <div className="search-location-container">
                  <SelectWithSearch
                    value={selectedCity}
                    onChange={setSelectedCity}
                  />
                  <svg
                    className="search-location-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#666"
                    strokeWidth="2"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>

                <button type="submit" className="search-button">Szukaj</button>
              </form>

              <div className="search-categories">
                <button
                  onClick={handleEverythingClick}
                  className={`search-category-btn ${
                    isEverythingSelected ? "active" : ""
                  }`}
                >
                  WSZYSTKO
                </button>

                {user && (
                  <button
                    onClick={handleFavoritesClick}
                    className={`search-category-btn ${
                      showingFavorites ? "active" : ""
                    }`}
                  >
                    ULUBIONE
                  </button>
                )}

                <button
                  onClick={() => handleCategoryButtonClick("Usługi porządkowe")}
                  className={`search-category-btn ${
                    selectedCategoryButtons.includes("Usługi porządkowe")
                      ? "active"
                      : ""
                  }`}
                >
                  USŁUGI PORZĄDKOWE
                </button>
                <button
                  onClick={() =>
                    handleCategoryButtonClick(
                      "Zarządzanie nieruchomościami mieszkalnymi"
                    )
                  }
                  className={`search-category-btn ${
                    selectedCategoryButtons.includes(
                      "Zarządzanie nieruchomościami mieszkalnymi"
                    )
                      ? "active"
                      : ""
                  }`}
                >
                  ZARZĄDZANIE NIERUCHOMOŚCIAMI MIESZKALNYMI
                </button>
                <button
                  onClick={() =>
                    handleCategoryButtonClick("Nieruchomości przemysłowe")
                  }
                  className={`search-category-btn ${
                    selectedCategoryButtons.includes(
                      "Nieruchomości przemysłowe"
                    )
                      ? "active"
                      : ""
                  }`}
                >
                  NIERUCHOMOŚCI PRZEMYSŁOWE
                </button>
                <button
                  onClick={() =>
                    handleCategoryButtonClick("Nieruchomości gruntowe")
                  }
                  className={`search-category-btn ${
                    selectedCategoryButtons.includes("Nieruchomości gruntowe")
                      ? "active"
                      : ""
                  }`}
                >
                  NIERUCHOMOŚCI GRUNTOWE
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="search-main">
        <div className="search-sidebar">
          <div className="search-filter-section">
            <h3 className="search-filter-title">Cena</h3>
            <div className="search-filter-container">
              <div className="search-price-label">Od</div>
              <input
                type="text"
                value={priceRange[0]}
                onChange={(e) =>
                  setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])
                }
                className="search-price-input"
              />
              <div className="search-price-label">Do</div>
              <input
                type="text"
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([priceRange[0], parseInt(e.target.value) || 0])
                }
                className="search-price-input"
              />
            </div>
            <input
              type="range"
              min="100"
              max="10000"
              value={priceRange[1]}
              onChange={handlePriceChange}
              className="search-price-range"
            />
            <div className="search-price-display">
              {priceRange[0]} - {priceRange[1]} zł
            </div>
          </div>

          {Object.entries(categories).map(([category, subcategories]) => (
            <div key={category} className="search-filter-section">
              <h4 className="search-category-title">{category}</h4>
              {subcategories.map((subcategory) => (
                <div
                  key={subcategory.name}
                  onClick={() =>
                    handleServiceChange(
                      category,
                      subcategory.name,
                      !selectedServices[category].includes(subcategory.name)
                    )
                  }
                  className="search-subcategory-item"
                >
                  <div className="search-subcategory-content">
                    <div
                      className={`search-checkbox ${
                        selectedServices[category].includes(subcategory.name)
                          ? "checked"
                          : ""
                      }`}
                    >
                      {selectedServices[category].includes(
                        subcategory.name
                      ) && (
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 10 10"
                          fill="white"
                        >
                          <path
                            d="M8.5 2.5L3.5 7.5L1.5 5.5"
                            stroke="white"
                            strokeWidth="1.5"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedServices[category].includes(
                        subcategory.name
                      )}
                      onChange={(e) =>
                        handleServiceChange(
                          category,
                          subcategory.name,
                          e.target.checked
                        )
                      }
                      className="search-checkbox-hidden"
                    />
                    <span className="search-subcategory-name">
                      {subcategory.name}
                    </span>
                  </div>
                  <span className="search-subcategory-count">
                    ({subcategory.count})
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="search-content">
          <div className="search-view-controls">
            <div
              onClick={() => changeViewMode("list")}
              className={`search-view-btn ${
                viewMode === "list" ? "active" : ""
              } ${isMobile ? "mobile-hidden" : ""}`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <rect x="3" y="5" width="18" height="2" rx="1" />
                <rect x="3" y="11" width="18" height="2" rx="1" />
                <rect x="3" y="17" width="18" height="2" rx="1" />
              </svg>
            </div>

            <div
              onClick={() => changeViewMode("grid")}
              className={`search-view-btn ${
                viewMode === "grid" ? "active" : ""
              } ${isMobile ? "mobile-hidden" : ""}`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
            </div>
          </div>

          <div className={`search-listings ${viewMode}`}>
            {currentListings.map((listing) => (
              <div
                key={listing.id}
                className="search-listing-card"
                onClick={() => handleListingClick(listing.id)}
              >
                <div className="search-listing-header">
                  <img
                    src={Avatar}
                    alt="Avatar"
                    className="search-listing-avatar"
                  />
                  <div className="search-listing-info">
                    <h4 className="search-listing-title">{listing.title}</h4>
                    <p className="search-listing-description">
                      {listing.description}
                    </p>
                    <div className="search-listing-rating">
                      {renderStars(listing.rating)}
                      <span className="rating-value">({listing.rating})</span>
                    </div>
                  </div>
                </div>

                <div className="search-listing-footer">
                  <div style={{ backgroundColor: "rgba(0, 0, 0, 0)" }}>
                    <div className="search-listing-category">
                      {listing.category}
                    </div>
                    <div className="search-listing-city">
                      {listing.location}
                    </div>
                    <div className="search-listing-price">
                      {listing.price}zł
                    </div>
                  </div>
                </div>
                <button className="search-listing-btn">Pokaż</button>
              </div>
            ))}
          </div>

          {currentListings.length === 0 && !loading && (
            <div
              style={{
                textAlign: "center",
                padding: "3rem",
                fontSize: "18px",
                color: "white",
              }}
            >
              {showingFavorites
                ? "Nie masz jeszcze żadnych ulubionych ogłoszeń"
                : searchQuery
                  ? `Brak wyników dla "${searchQuery}"`
                  : "Brak ogłoszeń spełniających kryteria wyszukiwania"
              }
            </div>
          )}

          {totalPages > 1 && (
            <div className="search-pagination">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`search-pagination-btn ${
                      currentPage === page ? "active" : ""
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
