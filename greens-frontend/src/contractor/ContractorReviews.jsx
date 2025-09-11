import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";
import Avatar from "../assets/Avatar.png";
import "../styles/contractor-reviews.css";

const ContractorReviews = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState({
    average_rating: 0,
    total_reviews: 0,
    rating_breakdown: {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    },
  });
  const [filterRating, setFilterRating] = useState("all");
  const [filterVisibility, setFilterVisibility] = useState("all"); // Dodano filter widoczności
  const [sortBy, setSortBy] = useState("newest");
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (user) {
      fetchReviews();
      fetchStatistics();
    }
  }, [user]);

  const fetchReviews = async () => {
    try {
      console.log("=== FETCHING CONTRACTOR REVIEWS ===");
      // Używamy endpointu dla contractor reviews (messages jako reviews)
      const response = await api.get("/contractor/reviews");
      console.log("Reviews response:", response.data);

      let reviewsData = [];
      if (response.data?.data?.data) {
        reviewsData = response.data.data.data;
      } else if (response.data?.data) {
        reviewsData = response.data.data;
      } else if (Array.isArray(response.data)) {
        reviewsData = response.data;
      }

      console.log("Processed reviews data:", reviewsData);
      setReviews(reviewsData);
    } catch (error) {
      console.error("Błąd podczas pobierania opinii:", error);
      setMessage({
        type: "error",
        text: "Nie udało się pobrać opinii",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      console.log("=== FETCHING REVIEWS STATISTICS ===");
      // Używamy endpointu dla contractor statistics
      const response = await api.get("/contractor/reviews/statistics");
      console.log("Statistics response:", response.data);

      if (response.data?.data) {
        setStatistics(response.data.data);
      }
    } catch (error) {
      console.error("Błąd podczas pobierania statystyk:", error);
      // Fallback - oblicz statystyki lokalnie
      calculateLocalStatistics();
    }
  };

  const calculateLocalStatistics = () => {
    if (reviews.length === 0) return;

    const totalReviews = reviews.length;
    const sumRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = (sumRating / totalReviews).toFixed(1);

    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      breakdown[review.rating] = (breakdown[review.rating] || 0) + 1;
    });

    setStatistics({
      average_rating: parseFloat(averageRating),
      total_reviews: totalReviews,
      rating_breakdown: breakdown,
    });
  };

  const handleReply = (review) => {
    setSelectedReview(review);
    setReplyText(review.admin_reply || "");
    setShowReplyModal(true);
  };

  const submitReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    try {
      console.log("=== SUBMITTING REPLY ===");
      console.log("Review ID:", selectedReview.id);
      console.log("Reply text:", replyText);

      const response = await api.post(`/contractor/reviews/${selectedReview.id}/reply`, {
        message: replyText.trim() // Używamy 'message' jak w MessageController
      });

      console.log("Reply response:", response.data);

      // Update local state
      setReviews((prev) =>
        prev.map((review) =>
          review.id === selectedReview.id
            ? {
                ...review,
                contractor_reply: replyText.trim(),
                contractor_reply_date: new Date().toISOString(),
              }
            : review
        )
      );

      setMessage({
        type: "success",
        text: "Odpowiedź została dodana pomyślnie!",
      });

      setShowReplyModal(false);
      setSelectedReview(null);
      setReplyText("");
    } catch (error) {
      console.error("Błąd podczas dodawania odpowiedzi:", error);
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Nie udało się dodać odpowiedzi",
      });
    }
  };

  const handleToggleVisibility = async (reviewId, currentVisibility) => {
    try {
      console.log("=== TOGGLING REVIEW VISIBILITY ===");
      console.log("Review ID:", reviewId);
      console.log("Current visibility:", currentVisibility);

      const newVisibility = !currentVisibility;

      const response = await api.patch(`/contractor/reviews/${reviewId}/visibility`, {
        status: newVisibility ? "approved" : "rejected" // Używamy rejected zamiast hidden
      });

      console.log("Visibility toggle response:", response.data);

      // Update local state
      setReviews((prev) =>
        prev.map((review) =>
          review.id === reviewId
            ? { ...review, status: newVisibility ? "approved" : "rejected" }
            : review
        )
      );

      setMessage({
        type: "success",
        text: `Opinia została ${newVisibility ? "pokazana" : "ukryta"}`,
      });
    } catch (error) {
      console.error("Błąd podczas zmiany widoczności:", error);
      setMessage({
        type: "error",
        text: "Nie udało się zmienić widoczności opinii",
      });
    }
  };

  const filteredAndSortedReviews = () => {
    let filtered = reviews;

    // Filter by rating
    if (filterRating !== "all") {
      filtered = filtered.filter(
        (review) => review.rating === parseInt(filterRating)
      );
    }

    // Filter by visibility
    if (filterVisibility !== "all") {
      filtered = filtered.filter((review) => {
        if (filterVisibility === "visible") return review.status === "approved";
        if (filterVisibility === "hidden") return review.status === "rejected";
        return true;
      });
    }

    // Sort reviews
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created_at) - new Date(a.created_at);
        case "oldest":
          return new Date(a.created_at) - new Date(b.created_at);
        case "highest":
          return b.rating - a.rating;
        case "lowest":
          return a.rating - b.rating;
        default:
          return 0;
      }
    });

    return filtered;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("pl-PL", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderStars = (rating, size = "normal") => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`star ${i <= rating ? "filled" : "empty"} ${size}`}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  const getRatingPercentage = (rating) => {
    return statistics.total_reviews > 0
      ? (
          (statistics.rating_breakdown[rating] / statistics.total_reviews) *
          100
        ).toFixed(1)
      : 0;
  };

  if (!user) {
    return (
      <div className="contractor-reviews-loading">
        <div>Ładowanie danych użytkownika...</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="contractor-reviews-loading">
        <div>Ładowanie opinii...</div>
      </div>
    );
  }

  const filteredReviews = filteredAndSortedReviews();

  return (
    <div className="contractor-reviews">
      <div className="contractor-reviews-header">
        <h2>Oceny i opinie</h2>
        <p>Zarządzaj opiniami od swoich klientów</p>
      </div>

      {message.text && (
        <div className={`contractor-message ${message.type}`}>
          {message.text}
        </div>
      )}

      {/* Statistics */}
      <div className="contractor-reviews-stats">
        <div className="contractor-stats-summary">
          <div className="contractor-average-rating">
            <div className="rating-number">{statistics.average_rating}</div>
            <div className="rating-stars">
              {renderStars(Math.round(statistics.average_rating), "large")}
            </div>
            <div className="rating-count">
              Na podstawie {statistics.total_reviews} opinii
            </div>
          </div>
        </div>

        <div className="contractor-rating-breakdown">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="contractor-rating-row">
              <span className="rating-label">{rating} gwiazdek</span>
              <div className="rating-bar">
                <div
                  className="rating-fill"
                  style={{ width: `${getRatingPercentage(rating)}%` }}
                ></div>
              </div>
              <span className="rating-count">
                {statistics.rating_breakdown[rating]} (
                {getRatingPercentage(rating)}%)
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="contractor-reviews-filters">
        <div className="contractor-filter-group">
          <label>Filtruj według oceny:</label>
          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
            className="contractor-filter-select"
          >
            <option value="all">Wszystkie oceny</option>
            <option value="5">5 gwiazdek</option>
            <option value="4">4 gwiazdki</option>
            <option value="3">3 gwiazdki</option>
            <option value="2">2 gwiazdki</option>
            <option value="1">1 gwiazdka</option>
          </select>
        </div>

        <div className="contractor-filter-group">
          <label>Widoczność:</label>
          <select
            value={filterVisibility}
            onChange={(e) => setFilterVisibility(e.target.value)}
            className="contractor-filter-select"
          >
            <option value="all">Wszystkie</option>
            <option value="visible">Widoczne</option>
            <option value="hidden">Ukryte</option>
          </select>
        </div>

        <div className="contractor-filter-group">
          <label>Sortuj według:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="contractor-filter-select"
          >
            <option value="newest">Najnowsze</option>
            <option value="oldest">Najstarsze</option>
            <option value="highest">Najwyższa ocena</option>
            <option value="lowest">Najniższa ocena</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="contractor-reviews-list">
        {reviews.length === 0 ? (
          <div className="contractor-reviews-empty">
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <h3>Brak opinii</h3>
              <p>Nie masz jeszcze żadnych opinii od klientów.</p>
              <p>Gdy klienci zaczną oceniać Twoje usługi, zobaczysz je tutaj.</p>
            </div>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="contractor-reviews-empty">
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>Brak wyników</h3>
              <p>Brak opinii spełniających wybrane kryteria filtrowania.</p>
              <button
                onClick={() => {
                  setFilterRating("all");
                  setFilterVisibility("all");
                  setSortBy("newest");
                }}
                className="contractor-btn-reset"
              >
                Wyczyść filtry
              </button>
            </div>
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div
              key={review.id}
              className={`contractor-review-card ${
                review.is_featured ? "featured" : ""
              } ${review.is_visible === false ? "hidden-review" : ""}`}
            >
              {review.is_featured && (
                <div className="contractor-featured-badge">
                  Wyróżniona opinia
                </div>
              )}

              {review.status === "rejected" && (
                <div className="contractor-hidden-badge">
                  Ukryta opinia
                </div>
              )}

              <div className="contractor-review-header">
                <div className="contractor-review-client">
                  <img
                    src={review.user?.avatar || review.avatar || Avatar}
                    alt={review.user?.name || review.user_name || "Użytkownik"}
                  />
                  <div className="contractor-client-info">
                    <h4>{review.sender_name || "Nieznany użytkownik"}</h4>
                    <p className="contractor-service-type">
                      {review.listing?.title || "Nieznane ogłoszenie"}
                    </p>
                  </div>
                </div>

                <div className="contractor-review-meta">
                  <div className="contractor-review-rating">
                    {renderStars(review.rating)}
                  </div>
                  <div className="contractor-review-date">
                    {formatDate(review.created_at)}
                  </div>
                </div>
              </div>

              <div className="contractor-review-content">
                <p>{review.message || "Brak komentarza"}</p>
              </div>

              {review.admin_reply && (
                <div className="contractor-reply">
                  <div className="contractor-reply-header">
                    <strong>Twoja odpowiedź:</strong>
                    <span className="contractor-reply-date">
                      {formatDate(review.replied_at || review.updated_at)}
                    </span>
                  </div>
                  <p>{review.admin_reply}</p>
                </div>
              )}

              <div className="contractor-review-actions">
                <button
                  onClick={() => handleReply(review)}
                  className="contractor-btn-reply"
                >
                  {review.admin_reply ? "Edytuj odpowiedź" : "Odpowiedz"}
                </button>

                <button
                  onClick={() => handleToggleVisibility(review.id, review.status === "approved")}
                  className={`contractor-btn-visibility ${
                    review.status === "approved" ? "hide" : "show"
                  }`}
                >
                  {review.status === "approved" ? "Ukryj" : "Pokaż"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Reply Modal */}
      {showReplyModal && selectedReview && (
        <div className="contractor-reviews-modal">
          <div className="contractor-modal-content">
            <div className="contractor-modal-header">
              <h3>
                {selectedReview.contractor_reply
                  ? "Edytuj odpowiedź"
                  : "Odpowiedz na opinię"}
              </h3>
              <button
                onClick={() => setShowReplyModal(false)}
                className="contractor-btn-close"
              >
                ✕
              </button>
            </div>

            <div className="contractor-modal-body">
              <div className="contractor-review-context">
                <div className="contractor-context-header">
                  <strong>{selectedReview.user?.name || selectedReview.user_name}</strong>
                  <div className="contractor-context-rating">
                    {renderStars(selectedReview.rating)}
                  </div>
                </div>
                <p className="contractor-context-service">
                  <strong>Ogłoszenie:</strong> {selectedReview.listing?.title || selectedReview.listing_title}
                </p>
                <p className="contractor-context-comment">
                  "{selectedReview.comment || selectedReview.review}"
                </p>
              </div>

              <form onSubmit={submitReply}>
                <div className="contractor-form-group">
                  <label>Twoja odpowiedź:</label>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Napisz profesjonalną odpowiedź na tę opinię..."
                    rows="4"
                    required
                  />
                </div>

                <div className="contractor-reply-tips">
                  <h4>Wskazówki:</h4>
                  <ul>
                    <li>Podziękuj za opinię</li>
                    <li>Odnosząc się do krytyki, bądź konstruktywny</li>
                    <li>Zachowaj profesjonalny ton</li>
                    <li>Zaproś do dalszej współpracy</li>
                  </ul>
                </div>

                <div className="contractor-modal-actions">
                  <button
                    type="button"
                    onClick={() => setShowReplyModal(false)}
                    className="contractor-btn-cancel"
                  >
                    Anuluj
                  </button>
                  <button type="submit" className="contractor-btn-save">
                    {selectedReview.contractor_reply
                      ? "Zaktualizuj"
                      : "Opublikuj odpowiedź"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractorReviews;
