import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const MessagesList = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    sortBy: "created_at",
    sortOrder: "desc",
    message_type: "", // Nowy filtr dla typu wiadomości
  });
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [quickReplies, setQuickReplies] = useState({});

  // Pobieranie wiadomości z API
  useEffect(() => {
    fetchMessages();
  }, [filters]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/messages", {
        params: filters,
      });
      setMessages(response.data.data || response.data);
    } catch (err) {
      console.error("Error fetching messages:", err);
      setError("Błąd podczas pobierania wiadomości");
    } finally {
      setLoading(false);
    }
  };

  // Obsługa szybkiej odpowiedzi
  const handleQuickReply = async (messageId) => {
    const replyText = quickReplies[messageId];
    if (!replyText || !replyText.trim()) return;

    try {
      await api.post(`/admin/messages/${messageId}/reply`, {
        message: replyText,
        admin_reply: replyText, // Dodaj pole admin_reply
      });

      // Wyczyść pole szybkiej odpowiedzi
      setQuickReplies((prev) => ({
        ...prev,
        [messageId]: "",
      }));

      // Odśwież listę wiadomości
      fetchMessages();

      alert("Odpowiedź została wysłana!");
    } catch (err) {
      console.error("Error sending reply:", err);
      alert("Błąd podczas wysyłania odpowiedzi");
    }
  };

  // Zmiana statusu wiadomości
  const handleStatusChange = async (messageId, newStatus) => {
    try {
      await api.patch(`/admin/messages/${messageId}/status`, {
        status: newStatus,
      });

      // Aktualizuj lokalnie
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, status: newStatus } : msg
        )
      );

      // Jeśli to komentarz i został zatwierdzony, wyślij notyfikację
      const message = messages.find(msg => msg.id === messageId);
      if (message?.message_type === 'comment' && newStatus === 'approved') {
        try {
          await api.post(`/admin/messages/${messageId}/notify-approval`);
        } catch (notifyErr) {
          console.error("Błąd podczas wysyłania notyfikacji:", notifyErr);
        }
      }

    } catch (err) {
      console.error("Error updating status:", err);
      alert("Błąd podczas aktualizacji statusu");
    }
  };

  // Usuwanie wiadomości
  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm("Czy na pewno chcesz usunąć tę wiadomość?")) return;

    try {
      await api.delete(`/admin/messages/${messageId}`);
      setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
    } catch (err) {
      console.error("Error deleting message:", err);
      alert("Błąd podczas usuwania wiadomości");
    }
  };

  // Obsługa zaznaczania wiadomości
  const handleSelectMessage = (messageId) => {
    setSelectedMessages((prev) =>
      prev.includes(messageId)
        ? prev.filter((id) => id !== messageId)
        : [...prev, messageId]
    );
  };

  // Masowe operacje
  const handleBulkStatusUpdate = async (newStatus) => {
    if (selectedMessages.length === 0) return;

    try {
      await api.put("/admin/messages/bulk-update", {
        message_ids: selectedMessages,
        status: newStatus,
      });

      fetchMessages();
      setSelectedMessages([]);
    } catch (err) {
      console.error("Error bulk updating:", err);
      alert("Błąd podczas masowej aktualizacji");
    }
  };

  // Obsługa filtrów
  const handleSearchChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      search: e.target.value,
    }));
  };

  const handleSortChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: e.target.value,
    }));
  };

  const handleTypeFilterChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      message_type: e.target.value,
    }));
  };

  // Funkcja pomocnicza do określenia klasy CSS dla statusu
  const getStatusClass = (status) => {
    switch (status) {
      case "approved":
      case "resolved":
      case "zatwierdzony":
        return "status-select status-active";
      case "rejected":
      case "spam":
      case "odrzucony":
        return "status-select status-inactive";
      case "pending":
      case "oczekujący":
      default:
        return "status-select status-pending";
    }
  };

  // Funkcja do określenia typu wiadomości
  const getMessageTypeLabel = (messageType) => {
    switch (messageType) {
      case "comment":
        return "💬 Komentarz";
      case "inquiry":
        return "❓ Zapytanie";
      case "complaint":
        return "⚠️ Skarga";
      default:
        return "📧 Wiadomość";
    }
  };

  // Funkcja do skracania długich tekstów
  const truncateText = (text, maxLength = 50) => {
    if (!text) return "Brak treści";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  if (loading) return <div className="no-data">Ładowanie wiadomości...</div>;
  if (error) return <div className="no-data">{error}</div>;

  // Statystyki
  const totalMessages = messages.length;
  const pendingMessages = messages.filter(msg => msg.status === 'pending' || msg.status === 'oczekujący').length;
  const approvedMessages = messages.filter(msg => msg.status === 'approved' || msg.status === 'zatwierdzony').length;
  const commentsCount = messages.filter(msg => msg.message_type === 'comment').length;

  return (
    <div className="content-panel">
      {/* Statystyki */}
      <div className="stats-container" style={{ marginBottom: "1rem", display: "flex", gap: "1rem" }}>
        <div className="stat-item" style={{ padding: "0.5rem", backgroundColor: "#f3f4f6", borderRadius: "4px" }}>
          <span>Wszystkich: {totalMessages}</span>
        </div>
        <div className="stat-item" style={{ padding: "0.5rem", backgroundColor: "#fef3c7", borderRadius: "4px" }}>
          <span>Oczekujących: {pendingMessages}</span>
        </div>
        <div className="stat-item" style={{ padding: "0.5rem", backgroundColor: "#d1fae5", borderRadius: "4px" }}>
          <span>Zatwierdzonych: {approvedMessages}</span>
        </div>
        <div className="stat-item" style={{ padding: "0.5rem", backgroundColor: "#e0e7ff", borderRadius: "4px" }}>
          <span>Komentarzy: {commentsCount}</span>
        </div>
      </div>

      <div className="content-header">
        <div className="search-filters">
          <select
            className="filter-select"
            onChange={handleSortChange}
            value={filters.sortBy}
          >
            <option value="created_at">Sortuj wg daty</option>
            <option value="sender_name">Sortuj wg nadawcy</option>
            <option value="company_name">Sortuj wg firmy</option>
            <option value="status">Sortuj wg statusu</option>
            <option value="message_type">Sortuj wg typu</option>
          </select>
          
          <select
            className="filter-select"
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, status: e.target.value }))
            }
          >
            <option value="">Wszystkie statusy</option>
            <option value="pending">Oczekujące</option>
            <option value="approved">Zatwierdzone</option>
            <option value="rejected">Odrzucone</option>
          </select>

          <select
            className="filter-select"
            onChange={handleTypeFilterChange}
            value={filters.message_type}
          >
            <option value="">Wszystkie typy</option>
            <option value="comment">Komentarze</option>
            <option value="inquiry">Zapytania</option>
            <option value="complaint">Skargi</option>
          </select>
          
          <input
            type="text"
            placeholder="Szukaj wiadomości..."
            className="search-input"
            value={filters.search}
            onChange={handleSearchChange}
          />
          <button className="search-btn" onClick={() => fetchMessages()}>
            Odśwież
          </button>
        </div>

        {selectedMessages.length > 0 && (
          <div className="bulk-actions" style={{ marginTop: "16px" }}>
            <span>Zaznaczono: {selectedMessages.length}</span>
            <button
              className="bulk-btn"
              onClick={() => handleBulkStatusUpdate("approved")}
            >
              Zatwierdź zaznaczone
            </button>
            <button
              className="bulk-btn"
              onClick={() => handleBulkStatusUpdate("rejected")}
            >
              Odrzuć zaznaczone
            </button>
          </div>
        )}
      </div>

      <div className="table-container messages-table">
        <table className="data-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedMessages(messages.map((msg) => msg.id));
                    } else {
                      setSelectedMessages([]);
                    }
                  }}
                  checked={
                    selectedMessages.length === messages.length &&
                    messages.length > 0
                  }
                />
              </th>
              <th>Typ</th>
              <th>Od (Użytkownik)</th>
              <th>Do (Firma)</th>
              <th>Ogłoszenie</th>
              <th>Temat</th>
              <th>Treść</th>
              <th>E-mail</th>
              <th>Telefon</th>
              <th>Status</th>
              <th>Szybka odpowiedź</th>
              <th>Akcje</th>
            </tr>
          </thead>
          <tbody>
            {messages.length === 0 ? (
              <tr>
                <td colSpan="12" className="no-data">
                  Brak wiadomości do wyświetlenia
                </td>
              </tr>
            ) : (
              messages.map((message) => (
                <tr key={message.id} className={message.message_type === 'comment' ? 'comment-row' : ''}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedMessages.includes(message.id)}
                      onChange={() => handleSelectMessage(message.id)}
                    />
                  </td>
                  <td>
                    <span className="message-type-badge">
                      {getMessageTypeLabel(message.message_type)}
                    </span>
                  </td>
                  <td>
                    <div className="input-with-badge">
                      <input
                        type="text"
                        value={
                          message.sender_name ||
                          message.user?.name ||
                          "Nieznany użytkownik"
                        }
                        readOnly
                      />
                      {message.is_urgent && (
                        <span className="status-dot">!</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <input
                      type="text"
                      value={
                        message.company_name ||
                        message.listing?.company_name ||
                        "Nieznana firma"
                      }
                      readOnly
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={
                        message.listing?.title ||
                        `ID: ${message.listing_id || 'Brak'}`
                      }
                      readOnly
                      title={message.listing?.title}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={truncateText(message.subject || message.topic, 30)}
                      readOnly
                      title={message.subject || message.topic}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={truncateText(message.message, 40)}
                      readOnly
                      title={message.message} // Pełna treść w tooltip
                    />
                  </td>
                  <td>
                    <input
                      type="email"
                      value={message.sender_email || message.email || ""}
                      readOnly
                    />
                  </td>
                  <td>
                    <input
                      type="tel"
                      value={message.sender_phone || message.phone || ""}
                      readOnly
                    />
                  </td>
                  <td>
                    <select
                      className={getStatusClass(message.status)}
                      value={message.status || "pending"}
                      onChange={(e) =>
                        handleStatusChange(message.id, e.target.value)
                      }
                    >
                      <option value="pending">Oczekujący</option>
                      <option value="approved">Zatwierdzony</option>
                      <option value="rejected">Odrzucony</option>
                    </select>
                  </td>
                  <td>
                    <div className="input-with-icon">
                      <input
                        type="text"
                        className="quick-message-input"
                        placeholder={
                          message.message_type === 'comment' 
                            ? "Odpowiedź na komentarz" 
                            : "Szybka odpowiedź"
                        }
                        value={quickReplies[message.id] || ""}
                        onChange={(e) =>
                          setQuickReplies((prev) => ({
                            ...prev,
                            [message.id]: e.target.value,
                          }))
                        }
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            handleQuickReply(message.id);
                          }
                        }}
                      />
                      <button
                        className="send-btn"
                        onClick={() => handleQuickReply(message.id)}
                        title="Wyślij odpowiedź"
                      >
                        📤
                      </button>
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      {message.message_type === 'comment' && (
                        <button
                          className={`approve-btn ${message.status === 'approved' ? 'approved' : ''}`}
                          onClick={() => handleStatusChange(message.id, 'approved')}
                          title="Zatwierdź komentarz"
                          disabled={message.status === 'approved'}
                        >
                          ✓
                        </button>
                      )}
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteMessage(message.id)}
                        title="Usuń wiadomość"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="table-footer">
        <button className="save-btn" onClick={() => fetchMessages()}>
          ODŚWIEŻ LISTĘ
        </button>
      </div>
    </div>
  );
};

export default MessagesList;import React, { useState, useEffect } from 'react';
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

      // Mapowanie danych z API
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
        rating: listing.rating || (Math.random() * 2 + 3).toFixed(1),
        clicks: listing.clicks || 0,
        featured: listing.featured || false,
        status: listing.status || "aktywne",
        created_at: listing.created_at,
        published_at: listing.published_at,
        user: {
          name: listing.company_name || "Użytkownik",
          rating: listing.rating || (Math.random() * 2 + 3).toFixed(1)
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

    fallbackCategories.forEach((category, categoryIndex) => {
      for (let i = 0; i < 5; i++) {
        const company = companies[i % companies.length];
        const city = cities[i % cities.length];
        
        fallbackListings.push({
          id: categoryIndex * 5 + i + 1,
          title: `Profesjonalne ${category.name.toLowerCase()} - ${company}`,
          description: `Oferujemy wysokiej jakości usługi ${category.name.toLowerCase()} w ${city}. Doświadczony zespół, konkurencyjne ceny.`,
          category: category,
          subcategory: 'Ogólne',
          price: Math.floor(Math.random() * 300) + 100,
          location: city,
          company_name: company,
          rating: (Math.random() * 2 + 3).toFixed(1),
          clicks: Math.floor(Math.random() * 100),
          featured: Math.random() > 0.7,
          status: 'aktywne',
          created_at: new Date().toISOString(),
          published_at: new Date().toISOString(),
          user: {
            name: company,
            rating: (Math.random() * 2 + 3).toFixed(1)
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
        rating: listing.rating || (Math.random() * 2 + 3).toFixed(1),
        clicks: listing.clicks || 0,
        featured: listing.featured || false,
        status: listing.status || "aktywne",
        user: {
          name: listing.company_name || "Użytkownik",
          rating: listing.rating || (Math.random() * 2 + 3).toFixed(1)
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
                        {[...Array(5)].map((_, i) => (
                          <span key={i} style={{ 
                            color: i < Math.floor(listing.user?.rating || 0) ? '#fbbf24' : '#d1d5db',
                            fontSize: '0.875rem'
                          }}>
                            ★
                          </span>
                        ))}
                        <span style={{ marginLeft: '0.5rem', fontSize: '0.875rem', color: '#666' }}>
                          ({listing.user?.rating || '0'})
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