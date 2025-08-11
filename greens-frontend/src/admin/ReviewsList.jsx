import { useState, useEffect } from "react";
import api from "../services/api";

const ReviewsList = () => {
  const [reviews, setReviews] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterRating, setFilterRating] = useState("");
  const [filterCompany, setFilterCompany] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [saving, setSaving] = useState(false);
  const [selectedReviews, setSelectedReviews] = useState([]);
  const [bulkAction, setBulkAction] = useState("");
  const [editingReviews, setEditingReviews] = useState({});

  useEffect(() => {
    fetchReviews();
    fetchCompanies();
  }, [sortBy, filterStatus, filterRating, filterCompany]);

  const fetchReviews = async () => {
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

      if (filterRating) {
        params.rating = filterRating;
      }

      if (filterCompany) {
        params.company_id = filterCompany;
      }

      if (searchTerm) {
        params.search = searchTerm;
      }

      console.log("Wysyłane parametry:", params);
      console.log("Wywołuję URL:", "/admin/reviews");

      const response = await api.get("/admin/reviews", { params });
      console.log("Odpowiedź serwera:", response.data);

      const reviewsData = response.data.data.data || response.data.data || [];
      setReviews(reviewsData);
    } catch (err) {
      setError("Błąd podczas pobierania ocen");
      console.error("Błąd:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      console.log("Pobieranie firm z:", "/companies/all");
      const response = await api.get("/companies/all");
      console.log("Firmy:", response.data);
      setCompanies(response.data.data || []);
    } catch (err) {
      console.error("Błąd podczas pobierania firm:", err);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchReviews();
  };

  const handleToggleVisibility = async (id, currentHidden) => {
    try {
      setSaving(true);
      await api.patch(`/admin/reviews/${id}/toggle-visibility`);

      setReviews((prev) =>
        prev.map((review) =>
          review.id === id
            ? { ...review, is_hidden: !review.is_hidden }
            : review
        )
      );

      setSuccess("Status komentarza został zmieniony");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("Błąd podczas zmiany statusu komentarza");
      console.error("Błąd:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleEditReview = (id, field, value) => {
    setEditingReviews((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleSaveReview = async (id) => {
    try {
      setSaving(true);
      const updates = editingReviews[id];

      if (!updates) return;

      await api.put(`/admin/reviews/${id}`, updates);

      setReviews((prev) =>
        prev.map((review) =>
          review.id === id ? { ...review, ...updates } : review
        )
      );

      setEditingReviews((prev) => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });

      setSuccess("Ocena została zaktualizowana");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("Błąd podczas zapisywania zmian");
      console.error("Błąd:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleSelectReview = (id) => {
    setSelectedReviews((prev) =>
      prev.includes(id)
        ? prev.filter((reviewId) => reviewId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedReviews.length === reviews.length) {
      setSelectedReviews([]);
    } else {
      setSelectedReviews(reviews.map((review) => review.id));
    }
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selectedReviews.length === 0) {
      setError("Wybierz akcję i przynajmniej jedną ocenę");
      return;
    }

    try {
      setSaving(true);
      await api.put("/admin/reviews/bulk-update", {
        ids: selectedReviews,
        action: bulkAction,
      });

      await fetchReviews();
      setSelectedReviews([]);
      setBulkAction("");
      setSuccess("Operacja została wykonana pomyślnie");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("Błąd podczas wykonywania operacji");
      console.error("Błąd:", err);
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("pl-PL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const renderStars = (rating) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  if (loading) {
    return (
      <div className="content-panel">
        <div className="loading">Ładowanie ocen...</div>
      </div>
    );
  }

  return (
    <div className="content-panel">
      {error && <div className="alert alert-error">⚠️ {error}</div>}
      {success && <div className="alert alert-success">✅ {success}</div>}

      <div className="content-header">
        <div className="search-filters">
          <select
            className="filter-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="created_at">Data utworzenia</option>
            <option value="rating">Ocena</option>
            <option value="order_date">Data zlecenia</option>
            <option value="is_hidden">Status</option>
          </select>

          <select
            className="filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">Wszystkie statusy</option>
            <option value="hidden">Widoczne</option>
            <option value="visible">Ukryte</option>
          </select>

          <select
            className="filter-select"
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
          >
            <option value="">Wszystkie oceny</option>
            {[1, 2, 3, 4, 5].map((rating) => (
              <option key={rating} value={rating}>
                {rating} {rating === 1 ? "gwiazdka" : "gwiazdki"}
              </option>
            ))}
          </select>

          <select
            className="filter-select"
            value={filterCompany}
            onChange={(e) => setFilterCompany(e.target.value)}
          >
            <option value="">Wszystkie firmy</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>

          <form onSubmit={handleSearchSubmit} className="search-form">
            <input
              type="text"
              placeholder="Szukaj w komentarzach..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="search-btn">
              🔍 Szukaj
            </button>
          </form>

          <button className="refresh-btn" onClick={fetchReviews}>
            🔄 Odśwież
          </button>
        </div>

        <div className="bulk-actions">
          <select
            className="bulk-select"
            value={bulkAction}
            onChange={(e) => setBulkAction(e.target.value)}
          >
            <option value="">Wybierz akcję</option>
            <option value="hide">Ukryj wybrane</option>
            <option value="show">Pokaż wybrane</option>
            <option value="delete">Usuń wybrane</option>
          </select>
          <button
            className="bulk-btn"
            onClick={handleBulkAction}
            disabled={selectedReviews.length === 0 || !bulkAction || saving}
          >
            Wykonaj ({selectedReviews.length})
          </button>
        </div>

        <div className="stats">
          Ocen: {reviews.length} | Wybrano: {selectedReviews.length}
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={
                    selectedReviews.length === reviews.length &&
                    reviews.length > 0
                  }
                  onChange={handleSelectAll}
                />
              </th>
              <th>Oceniany</th>
              <th>Przez</th>
              <th>Ocena</th>
              <th>Komentarz</th>
              <th>Nr zlecenia (data)</th>
              <th>Status</th>
              <th>Akcje</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr
                key={review.id}
                className={review.is_hidden ? "hidden-review" : ""}
              >
                <td>
                  <input
                    type="checkbox"
                    checked={selectedReviews.includes(review.id)}
                    onChange={() => handleSelectReview(review.id)}
                  />
                </td>
                <td>
                  <span className="company-name">
                    {review.company?.name || "Nieznana firma"}
                  </span>
                </td>
                <td>
                  <span className="reviewer-name">
                    {review.user?.name || "Nieznany użytkownik"}
                  </span>
                </td>
                <td>
                  <div className="rating-cell">
                    <select
                      className="rating-select"
                      value={editingReviews[review.id]?.rating || review.rating}
                      onChange={(e) =>
                        handleEditReview(
                          review.id,
                          "rating",
                          parseInt(e.target.value)
                        )
                      }
                    >
                      {[1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={num}>
                          {num} ★
                        </option>
                      ))}
                    </select>
                    <span className="stars">{renderStars(review.rating)}</span>
                  </div>
                </td>
                <td>
                  <textarea
                    value={
                      editingReviews[review.id]?.comment ??
                      (review.comment || "")
                    }
                    onChange={(e) =>
                      handleEditReview(review.id, "comment", e.target.value)
                    }
                    placeholder="Brak komentarza"
                    rows="2"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    className="order-input"
                    value={
                      editingReviews[review.id]?.order_number ??
                      (review.order_number || "")
                    }
                    onChange={(e) =>
                      handleEditReview(
                        review.id,
                        "order_number",
                        e.target.value
                      )
                    }
                    placeholder="Nr zlecenia"
                  />
                  <small className="order-date">
                    {review.order_date
                      ? formatDate(review.order_date)
                      : "Brak daty"}
                  </small>
                </td>
                <td>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={review.is_hidden}
                      onChange={() =>
                        handleToggleVisibility(review.id, review.is_hidden)
                      }
                      disabled={saving}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="status-text">
                    {review.is_hidden ? "Ukryty" : "Widoczny"}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    {editingReviews[review.id] && (
                      <button
                        className="save-btn"
                        onClick={() => handleSaveReview(review.id)}
                        disabled={saving}
                      >
                        💾 Zapisz
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {reviews.length === 0 && (
          <div className="no-data">Brak ocen do wyświetlenia</div>
        )}
      </div>
    </div>
  );
};

export default ReviewsList;
