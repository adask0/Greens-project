import React, { useState, useEffect } from "react";
import api from "../services/api";

const CookieManagement = () => {
  const [cookieData, setCookieData] = useState([]);
  const [statistics, setStatistics] = useState({
    total_consents: 0,
    analytics_acceptance_rate: 0,
    marketing_acceptance_rate: 0,
    recent_consents: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("consented_at");
  const [filterBy, setFilterBy] = useState("all");

  useEffect(() => {
    fetchCookieStatistics();
    fetchCookieConsents();
  }, []);

  const fetchCookieStatistics = async () => {
    try {
      const response = await api.get("/admin/cookies/statistics");
      setStatistics(response.data);
    } catch (err) {
      console.error("Błąd podczas pobierania statystyk cookies:", err);
    }
  };

  const fetchCookieConsents = async () => {
    try {
      setLoading(true);
      setError(null);

      // Jeśli nie masz tego endpointa, możesz go stworzyć lub użyć statistics
      const response = await api.get("/admin/cookies/statistics");
      setCookieData(response.data.recent_consents || []);
    } catch (err) {
      setError("Błąd podczas pobierania danych cookies");
      console.error("Błąd:", err);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredData = () => {
    let filtered = [...cookieData];

    // Filtrowanie po wyszukiwanej frazie
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.ip_address?.includes(searchTerm)
      );
    }

    // Filtrowanie po typie zgody
    if (filterBy === "analytics") {
      filtered = filtered.filter(
        (item) => item.preferences?.analytics === true
      );
    } else if (filterBy === "marketing") {
      filtered = filtered.filter(
        (item) => item.preferences?.marketing === true
      );
    } else if (filterBy === "necessary_only") {
      filtered = filtered.filter(
        (item) =>
          item.preferences?.analytics === false &&
          item.preferences?.marketing === false
      );
    }

    // Sortowanie
    filtered.sort((a, b) => {
      if (sortBy === "consented_at") {
        return new Date(b.consented_at) - new Date(a.consented_at);
      } else if (sortBy === "user_name") {
        return (a.user?.name || "").localeCompare(b.user?.name || "");
      } else if (sortBy === "ip_address") {
        return a.ip_address.localeCompare(b.ip_address);
      }
      return 0;
    });

    return filtered;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("pl-PL");
  };

  const getPreferencesDisplay = (preferences) => {
    const badges = [];
    if (preferences?.necessary) badges.push("Niezbędne");
    if (preferences?.analytics) badges.push("Analityczne");
    if (preferences?.marketing) badges.push("Marketingowe");
    return badges.join(", ");
  };

  const getPreferencesStyle = (preferences) => {
    if (preferences?.analytics && preferences?.marketing) {
      return { backgroundColor: "#dcfce7", color: "#15803d" }; // Zielone - wszystkie
    } else if (preferences?.analytics || preferences?.marketing) {
      return { backgroundColor: "#fef3c7", color: "#d97706" }; // Żółte - częściowe
    } else {
      return { backgroundColor: "#fee2e2", color: "#dc2626" }; // Czerwone - tylko niezbędne
    }
  };

  if (loading) {
    return (
      <div className="content-panel">
        <div className="loading">Ładowanie danych cookies...</div>
      </div>
    );
  }

  const filteredData = getFilteredData();

  return (
    <div className="content-panel">
      {error && <div className="alert alert-error">⚠️ {error}</div>}

      {/* Statystyki */}
      <div className="content-header">
        <h2>Zarządzanie Cookies</h2>
        <div
          className="stats-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
            marginBottom: "1.5rem",
          }}
        >
          <div
            className="stat-card"
            style={{
              padding: "1rem",
              backgroundColor: "white",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
            }}
          >
            <div
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: "#1f2937",
              }}
            >
              {statistics.total_consents}
            </div>
            <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
              Łączne zgody
            </div>
          </div>

          <div
            className="stat-card"
            style={{
              padding: "1rem",
              backgroundColor: "white",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
            }}
          >
            <div
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: "#059669",
              }}
            >
              {statistics.analytics_acceptance_rate}%
            </div>
            <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
              Akceptacja analitycznych
            </div>
          </div>

          <div
            className="stat-card"
            style={{
              padding: "1rem",
              backgroundColor: "white",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
            }}
          >
            <div
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: "#dc2626",
              }}
            >
              {statistics.marketing_acceptance_rate}%
            </div>
            <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
              Akceptacja marketingowych
            </div>
          </div>
        </div>
      </div>

      {/* Filtry i wyszukiwanie */}
      <div className="search-filters">
        <select
          className="filter-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="consented_at">Data zgody</option>
          <option value="user_name">Nazwa użytkownika</option>
          <option value="ip_address">Adres IP</option>
        </select>

        <select
          className="filter-select"
          value={filterBy}
          onChange={(e) => setFilterBy(e.target.value)}
        >
          <option value="all">Wszystkie zgody</option>
          <option value="analytics">Z cookies analitycznymi</option>
          <option value="marketing">Z cookies marketingowymi</option>
          <option value="necessary_only">Tylko niezbędne</option>
        </select>

        <input
          type="text"
          placeholder="Szukaj po email, nazwie lub IP"
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <button className="refresh-btn" onClick={fetchCookieConsents}>
          🔄 Odśwież
        </button>
      </div>

      {/* Tabela z danymi */}
      <div className="table-container">
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {/* Nagłówek tabeli */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "12px 16px",
              backgroundColor: "#f8f9fa",
              border: "1px solid #e2e8f0",
              fontWeight: "bold",
              fontSize: "0.875rem",
            }}
          >
            <div style={{ flex: "2" }}>Użytkownik</div>
            <div style={{ flex: "1.5" }}>IP Address</div>
            <div style={{ flex: "2" }}>Preferencje</div>
            <div style={{ flex: "1.5" }}>Data zgody</div>
            <div style={{ flex: "1" }}>User Agent</div>
          </div>

          {/* Wiersze danych */}
          {filteredData.map((consent, index) => (
            <div
              key={consent.id || index}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "12px 16px",
                backgroundColor: "white",
                border: "1px solid #e2e8f0",
                fontSize: "0.875rem",
              }}
            >
              <div style={{ flex: "2" }}>
                {consent.user ? (
                  <div>
                    <div style={{ fontWeight: "500" }}>{consent.user.name}</div>
                    <div style={{ color: "#6b7280", fontSize: "0.75rem" }}>
                      {consent.user.email}
                    </div>
                  </div>
                ) : (
                  <div style={{ color: "#9ca3af", fontStyle: "italic" }}>
                    Użytkownik niezalogowany
                  </div>
                )}
              </div>

              <div style={{ flex: "1.5", fontFamily: "monospace" }}>
                {consent.ip_address}
              </div>

              <div style={{ flex: "2" }}>
                <span
                  style={{
                    ...getPreferencesStyle(consent.preferences),
                    padding: "2px 6px",
                    borderRadius: "4px",
                    fontSize: "0.75rem",
                    fontWeight: "500",
                  }}
                >
                  {getPreferencesDisplay(consent.preferences)}
                </span>
              </div>

              <div style={{ flex: "1.5", color: "#6b7280" }}>
                {formatDate(consent.consented_at)}
              </div>

              <div
                style={{
                  flex: "1",
                  color: "#9ca3af",
                  fontSize: "0.75rem",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {consent.user_agent
                  ? consent.user_agent.substring(0, 30) + "..."
                  : "Nieznany"}
              </div>
            </div>
          ))}
        </div>

        {filteredData.length === 0 && (
          <div className="no-data">Brak danych do wyświetlenia</div>
        )}
      </div>

      {/* Stopka z informacjami */}
      <div className="table-footer">
        <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
          Wyświetlono: {filteredData.length} z {cookieData.length} zgód
        </div>
      </div>
    </div>
  );
};

export default CookieManagement;
