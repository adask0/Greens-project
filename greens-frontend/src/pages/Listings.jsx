import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Listings = () => {
  const [listings, setListings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    location: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Pobierz ogłoszenia
      const listingsResponse = await api.get('/listings', {
        params: {
          per_page: 100,
          status: 'aktywne'
        }
      });

      let listingsData = [];

      // Obsługa różnych struktur odpowiedzi API
      if (listingsResponse.data?.data?.data) {
        listingsData = listingsResponse.data.data.data;
      } else if (listingsResponse.data?.data) {
        listingsData = listingsResponse.data.data;
      } else if (Array.isArray(listingsResponse.data)) {
        listingsData = listingsResponse.data;
      }

      // Mapowanie danych z API - używamy prawdziwych ratingów z backendu
      const mappedListings = listingsData.map(listing => ({
        id: listing.id,
        title: listing.title || listing.company_name || "Brak tytułu",
        description: listing.description || "Brak opisu",
        category: {
          id: listing.category_id || 1,
          name: listing.category || "Inne",
          icon: getCategoryIcon(listing.category)
        },
        subcategory: listing.subcategory || "Ogólne",
        price: listing.price,
        location: listing.location || "Warszawa",
        company_name: listing.company_name || "Firma",
        // Używamy prawdziwego ratingu z backendu
        rating: listing.rating || listing.company?.rating || listing.user?.rating || 0,
        clicks: listing.clicks || 0,
        featured: listing.featured || false,
        status: listing.status || "aktywne",
        created_at: listing.created_at,
        published_at: listing.published_at,
        user: {
          name: listing.company_name || listing.user?.name || "Użytkownik",
          // Pobierz rating użytkownika/firmy z backendu
          rating: listing.company?.rating || listing.user?.rating || listing.rating || 0
        }
      }));

      setListings(mappedListings);

      // Wygeneruj kategorie na podstawie danych
      const uniqueCategories = [...new Map(
        mappedListings.map(listing => [listing.category.name, listing.category])
      ).values()];

      setCategories(uniqueCategories);

    } catch (err) {
      console.error('Błąd podczas pobierania danych:', err);
      setError('Błąd podczas pobierania danych');

      // Fallback - wygeneruj przykładowe dane
      generateFallbackData();
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (categoryName) => {
    const iconMap = {
      'Usługi porządkowe': '🧹',
      'Zarządzanie nieruchomościami mieszkalnymi': '🏠',
      'Nieruchomości przemysłowe': '🏭',
      'Nieruchomości gruntowe': '🌱',
      'Inne': '🔧'
    };
    return iconMap[categoryName] || '🔧';
  };

  const generateFallbackData = () => {
    const fallbackCategories = [
      { id: 1, name: 'Usługi porządkowe', icon: '🧹' },
      { id: 2, name: 'Zarządzanie nieruchomościami mieszkalnymi', icon: '🏠' },
      { id: 3, name: 'Nieruchomości przemysłowe', icon: '🏭' },
      { id: 4, name: 'Nieruchomości gruntowe', icon: '🌱' }
    ];

    const fallbackListings = [];
    const companies = ['Clean Pro', 'EcoClean', 'Perfect Clean', 'Green Services', 'Pro Management'];
    const cities = ['Warszawa', 'Kraków', 'Łódź', 'Wrocław', 'Poznań'];
    // Przykładowe ratingi dla fallback danych
    const sampleRatings = [4.2, 3.8, 4.5, 3.9, 4.1];

    fallbackCategories.forEach((category, categoryIndex) => {
      for (let i = 0; i < 5; i++) {
        const company = companies[i % companies.length];
        const city = cities[i % cities.length];
        const rating = sampleRatings[i % sampleRatings.length];

        fallbackListings.push({
          id: categoryIndex * 5 + i + 1,
          title: `Profesjonalne ${category.name.toLowerCase()} - ${company}`,
          description: `Oferujemy wysokiej jakości usługi ${category.name.toLowerCase()} w ${city}. Doświadczony zespół, konkurencyjne ceny.`,
          category: category,
          subcategory: 'Ogólne',
          price: Math.floor(Math.random() * 300) + 100,
          location: city,
          company_name: company,
          rating: rating,
          clicks: Math.floor(Math.random() * 100),
          featured: Math.random() > 0.7,
          status: 'aktywne',
          created_at: new Date().toISOString(),
          published_at: new Date().toISOString(),
          user: {
            name: company,
            rating: rating
          }
        });
      }
    });

    setListings(fallbackListings);
    setCategories(fallbackCategories);
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const params = {
        per_page: 100,
        status: 'aktywne'
      };

      if (filters.search) params.search = filters.search;
      if (filters.category) params.category = filters.category;
      if (filters.location) params.location = filters.location;

      const response = await api.get('/listings', { params });

      let listingsData = [];
      if (response.data?.data?.data) {
        listingsData = response.data.data.data;
      } else if (response.data?.data) {
        listingsData = response.data.data;
      } else if (Array.isArray(response.data)) {
        listingsData = response.data;
      }

      // Mapowanie z prawdziwymi ratingami
      const mappedListings = listingsData.map(listing => ({
        id: listing.id,
        title: listing.title || listing.company_name || "Brak tytułu",
        description: listing.description || "Brak opisu",
        category: {
          id: listing.category_id || 1,
          name: listing.category || "Inne",
          icon: getCategoryIcon(listing.category)
        },
        subcategory: listing.subcategory || "Ogólne",
        price: listing.price,
        location: listing.location || "Warszawa",
        company_name: listing.company_name || "Firma",
        // Prawdziwy rating z backendu
        rating: listing.rating || listing.company?.rating || listing.user?.rating || 0,
        clicks: listing.clicks || 0,
        featured: listing.featured || false,
        status: listing.status || "aktywne",
        user: {
          name: listing.company_name || listing.user?.name || "Użytkownik",
          rating: listing.company?.rating || listing.user?.rating || listing.rating || 0
        }
      }));

      setListings(mappedListings);
    } catch (error) {
      console.error('Błąd wyszukiwania:', error);
      setError('Błąd podczas wyszukiwania');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleListingClick = (listingId) => {
    navigate(`/ogloszenie/${listingId}`);
  };

  // Funkcja do wyświetlania gwiazdek na podstawie ratingu
  const renderStars = (rating) => {
    const numericRating = parseFloat(rating) || 0;
    const fullStars = Math.floor(numericRating);
    const hasHalfStar = numericRating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <>
        {[...Array(fullStars)].map((_, i) => (
          <span key={`full-${i}`} style={{ color: '#fbbf24', fontSize: '0.875rem' }}>★</span>
        ))}
        {hasHalfStar && (
          <span style={{ color: '#fbbf24', fontSize: '0.875rem' }}>☆</span>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={`empty-${i}`} style={{ color: '#d1d5db', fontSize: '0.875rem' }}>★</span>
        ))}
      </>
    );
  };

  if (loading) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          Ładowanie ofert...
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#16a34a', padding: '2rem 0' }}>
      <div className="container">
        <h1 style={{ color: 'white', textAlign: 'center', marginBottom: '2rem', fontSize: '2rem' }}>
          Nasze usługi, znajdź specjalistę
        </h1>

        {error && (
          <div style={{
            backgroundColor: '#fee2e2',
            color: '#dc2626',
            padding: '1rem',
            borderRadius: '0.5rem',
            marginBottom: '2rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {/* Filtry */}
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          marginBottom: '2rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'end'
        }}>
          <div style={{ flex: '1', minWidth: '200px' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Szukaj usług...
            </label>
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Wpisz czego szukasz..."
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.25rem'
              }}
            />
          </div>

          <div style={{ flex: '1', minWidth: '200px' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Kategoria
            </label>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.25rem'
              }}
            >
              <option value="">Wszystkie kategorie</option>
              {categories.map(category => (
                <option key={category.id} value={category.name}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ flex: '1', minWidth: '200px' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Lokalizacja
            </label>
            <input
              type="text"
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              placeholder="Miasto..."
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.25rem'
              }}
            />
          </div>

          <button
            onClick={handleSearch}
            className="btn-primary"
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#16a34a',
              color: 'white',
              border: 'none',
              borderRadius: '0.25rem',
              cursor: 'pointer'
            }}
          >
            Szukaj
          </button>
        </div>

        {/* Wyniki */}
        {listings.length === 0 ? (
          <div style={{
            backgroundColor: 'white',
            padding: '3rem',
            borderRadius: '0.5rem',
            textAlign: 'center'
          }}>
            <h3>Brak ofert</h3>
            <p style={{ color: '#666', marginBottom: '1rem' }}>
              Nie znaleziono ofert spełniających kryteria wyszukiwania.
            </p>
            <button
              onClick={() => navigate('/register')}
              style={{
                backgroundColor: '#16a34a',
                color: 'white',
                padding: '0.75rem 1.5rem',
                border: 'none',
                borderRadius: '0.25rem',
                cursor: 'pointer',
                textDecoration: 'none'
              }}
            >
              Dodaj pierwszą ofertę
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.5rem'
          }}>
            {listings.map(listing => (
              <div key={listing.id} style={{
                backgroundColor: 'white',
                borderRadius: '0.5rem',
                overflow: 'hidden',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                transition: 'transform 0.2s',
              }}
              onClick={() => handleListingClick(listing.id)}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
              >
                <div style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: '#f3f4f6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '0.75rem'
                    }}>
                      👤
                    </div>
                    <div>
                      <h4 style={{ margin: 0 }}>{listing.user?.name || 'Użytkownik'}</h4>
                      <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.25rem' }}>
                        {renderStars(listing.user?.rating || 0)}
                        <span style={{ marginLeft: '0.5rem', fontSize: '0.875rem', color: '#666' }}>
                          ({parseFloat(listing.user?.rating || 0).toFixed(1)})
                        </span>
                      </div>
                    </div>
                  </div>

                  <h3 style={{ marginBottom: '0.75rem' }}>{listing.title}</h3>
                  <p style={{ color: '#666', marginBottom: '1rem', fontSize: '0.9rem' }}>
                    {listing.description.length > 100
                      ? listing.description.substring(0, 100) + '...'
                      : listing.description
                    }
                  </p>

                  {listing.price && (
                    <p style={{ fontWeight: '600', color: '#16a34a', marginBottom: '0.75rem' }}>
                      {listing.price} zł
                    </p>
                  )}

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.875rem',
                    color: '#666'
                  }}>
                    <span>📍 {listing.location}</span>
                    <span>{listing.category?.icon} {listing.category?.name}</span>
                  </div>

                  <button
                    style={{
                      width: '100%',
                      marginTop: '1rem',
                      backgroundColor: '#16a34a',
                      color: 'white',
                      padding: '0.75rem',
                      border: 'none',
                      borderRadius: '0.25rem',
                      cursor: 'pointer'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleListingClick(listing.id);
                    }}
                  >
                    Zobacz szczegóły
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Listings;
