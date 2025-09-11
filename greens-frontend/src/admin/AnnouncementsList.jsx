import { useState, useEffect } from "react";
import api from "../services/api";

const AnnouncementsList = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [featuredCount, setFeaturedCount] = useState(0);
  const [saving, setSaving] = useState(false);
  const [deletePopup, setDeletePopup] = useState({ show: false, id: null });

  useEffect(() => {
    fetchAnnouncements();
  }, [sortBy, filterStatus]);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        per_page: 50,
        sort_by: sortBy,
        sort_order: "desc",
      };

      if (filterStatus) {
        params.status = filterStatus;
      }

      if (searchTerm) {
        params.search = searchTerm;
      }

      console.log("=== DEBUG INFO ===");
      console.log("Wysyłane parametry:", params);

      const response = await api.get("/admin/listings", { params });

      let listingsData = [];

      if (response.data?.data?.data) {
        listingsData = response.data.data.data;
      } else if (response.data?.data) {
        listingsData = response.data.data;
      } else if (Array.isArray(response.data)) {
        listingsData = response.data;
      } else {
        console.error("Nie można znaleźć danych ogłoszeń:", response.data);
        listingsData = [];
      }

      console.log("Final listingsData:", listingsData);
      setAnnouncements(listingsData);

      const featured = listingsData.filter((a) => a.featured).length;
      setFeaturedCount(featured);
    } catch (err) {
      console.error("=== ERROR ===", err);
      setError(
        `Błąd podczas pobierania ogłoszeń: ${
          err.response?.data?.message || err.message
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      setSaving(true);
      setError(null);

      console.log("=== ZMIANA STATUSU ===");
      console.log("ID:", id);
      console.log("Nowy status:", newStatus);

      const response = await api.patch(`/admin/listings/${id}/status`, {
        status: newStatus,
      });

      console.log("Response status change:", response.data);

      // Aktualizuj lokalny stan
      setAnnouncements((prev) =>
        prev.map((ann) => (ann.id === id ? { ...ann, status: newStatus } : ann))
      );

      setSuccess("Status został zmieniony");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Błąd zmiany statusu:", err);
      setError(
        `Błąd podczas zmiany statusu: ${
          err.response?.data?.message || err.message
        }`
      );
      setTimeout(() => setError(null), 5000);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleFeatured = async (id, currentFeatured) => {
    try {
      if (!currentFeatured && featuredCount >= 5) {
        setError("Osiągnięto limit 5 wyróżnionych ogłoszeń");
        setTimeout(() => setError(null), 3000);
        return;
      }

      setSaving(true);

      const response = await api.patch(`/admin/listings/${id}/toggle-featured`);

      setAnnouncements((prev) =>
        prev.map((ann) =>
          ann.id === id ? { ...ann, featured: !ann.featured } : ann
        )
      );

      setFeaturedCount(response.data.featured_count || featuredCount);
      setSuccess(response.data.message || "Wyróżnienie zostało zmienione");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Błąd podczas zmiany wyróżnienia"
      );
      console.error("Błąd:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (id) => {
    setDeletePopup({ show: true, id });
  };

  const handleDeleteConfirm = async () => {
    const { id } = deletePopup;

    try {
      setSaving(true);
      await api.delete(`/admin/listings/${id}`);

      setAnnouncements((prev) => prev.filter((ann) => ann.id !== id));
      setSuccess("Ogłoszenie zostało usunięte");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("Błąd podczas usuwania ogłoszenia");
      console.error("Błąd:", err);
    } finally {
      setSaving(false);
      setDeletePopup({ show: false, id: null });
    }
  };

  const handleDeleteCancel = () => {
    setDeletePopup({ show: false, id: null });
  };

  const getFilteredAnnouncements = () => {
    let filtered = [...announcements];

    if (searchTerm && !filterStatus) {
      filtered = filtered.filter(
        (a) =>
          (a.title &&
            a.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (a.company_name &&
            a.company_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (a.description &&
            a.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    return filtered;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("pl-PL", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch (error) {
      return "-";
    }
  };

  // POPRAWKA: Ujednolicone mapowanie statusów
  const getStatusClass = (status) => {
    switch (status) {
      case "active":
        return "status-active";
      case "inactive":
        return "status-inactive";
      case "pending":
        return "status-pending";
      default:
        return "status-inactive";
    }
  };

  // POPRAWKA: Funkcja do wyświetlania statusów po polsku
  const getStatusDisplayName = (status) => {
    switch (status) {
      case "active":
        return "Aktywne";
      case "inactive":
        return "Nieaktywne";
      case "pending":
        return "Oczekujące";
      default:
        return "Nieaktywne";
    }
  };

  if (loading) {
    return (
      <div className="content-panel">
        <div className="loading">Ładowanie ogłoszeń...</div>
      </div>
    );
  }

  const filteredAnnouncements = getFilteredAnnouncements();

  return (
    <div className="content-panel">
      {error && <div className="alert alert-error">⚠️ {error}</div>}
      {success && <div className="alert alert-success">✅ {success}</div>}

      <div className="content-header">
        <div className="search-filters">
          <input
            type="text"
            placeholder="Szukaj ogłoszeń..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />

          <select
            className="filter-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="created_at">Data utworzenia</option>
            <option value="published_at">Data publikacji</option>
            <option value="clicks">Liczba kliknięć</option>
            <option value="price">Cena</option>
            <option value="title">Tytuł</option>
          </select>

          <select
            className="filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">Wszystkie statusy</option>
            <option value="active">Aktywne</option>
            <option value="inactive">Nieaktywne</option>
            <option value="pending">Oczekujące</option>
          </select>

          <button className="refresh-btn" onClick={fetchAnnouncements}>
            🔄 Odśwież
          </button>
        </div>

        <div className="stats">
          Ogłoszeń: {filteredAnnouncements.length} | Wyróżnionych:{" "}
          {featuredCount}/5
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Firma</th>
              <th>Ogłoszenie</th>
              <th>Data wystawienia</th>
              <th>Status</th>
              <th>Ilość kliknięć</th>
              <th>Cena</th>
              <th>Wyróżnij ({featuredCount}/5)</th>
              <th>Akcje</th>
            </tr>
          </thead>
          <tbody>
            {filteredAnnouncements.map((announcement) => (
              <tr key={announcement.id}>
                <td>{announcement.id}</td>
                <td>{announcement.company_name || "-"}</td>
                <td>
                  <div className="announcement-title">
                    {announcement.title || "Bez tytułu"}
                    <small className="announcement-category">
                      {announcement.category || "-"} /{" "}
                      {announcement.subcategory || "-"}
                    </small>
                  </div>
                </td>
                <td>
                  {formatDate(
                    announcement.published_at || announcement.created_at
                  )}
                </td>
                <td>
                  <select
                    className={`status-select ${getStatusClass(
                      announcement.status
                    )}`}
                    value={announcement.status || "inactive"}
                    onChange={(e) =>
                      handleStatusChange(announcement.id, e.target.value)
                    }
                    disabled={saving}
                  >
                    <option value="active">Aktywne</option>
                    <option value="inactive">Nieaktywne</option>
                    <option value="pending">Oczekujące</option>
                  </select>
                </td>
                <td className="text-center">{announcement.clicks || 0}</td>
                <td>{announcement.price || 0} zł</td>
                <td>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={announcement.featured || false}
                      onChange={() =>
                        handleToggleFeatured(
                          announcement.id,
                          announcement.featured
                        )
                      }
                      disabled={saving}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteClick(announcement.id)}
                    disabled={saving}
                  >
                    Usuń
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredAnnouncements.length === 0 && !loading && (
          <div className="no-data">
            {announcements.length === 0
              ? "Brak ogłoszeń w systemie"
              : "Brak ogłoszeń spełniających kryteria"}
          </div>
        )}
      </div>

      {deletePopup.show && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>Potwierdzenie usunięcia</h3>
            <p>Czy na pewno chcesz usunąć to ogłoszenie?</p>
            <p className="popup-warning">Ta operacja jest nieodwracalna!</p>
            <div className="popup-buttons">
              <button
                className="popup-btn popup-btn-cancel"
                onClick={handleDeleteCancel}
                disabled={saving}
              >
                Anuluj
              </button>
              <button
                className="popup-btn popup-btn-confirm"
                onClick={handleDeleteConfirm}
                disabled={saving}
              >
                {saving ? "Usuwanie..." : "Usuń"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .status-active {
          background-color: #d4edda;
          color: #155724;
          border-color: #c3e6cb;
        }

        .status-inactive {
          background-color: #f8d7da;
          color: #721c24;
          border-color: #f5c6cb;
        }

        .status-pending {
          background-color: #fff3cd;
          color: #856404;
          border-color: #ffeaa7;
        }
      `}</style>
    </div>
  );
};

export default AnnouncementsList;
