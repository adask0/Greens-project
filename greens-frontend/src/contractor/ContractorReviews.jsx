import React, { useState, useEffect } from "react";
import api from "../services/api";
import Avatar from "../assets/Avatar.png";
import "../styles/contractor-reviews.css";

const ContractorReviews = () => {
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
  const [sortBy, setSortBy] = useState("newest");
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchReviews();
    fetchStatistics();
  }, []);

  const fetchReviews = async () => {
    try {
      // W rzeczywistości byłby API call z ID kontrachenta
      const mockReviews = [
        {
          id: 1,
          client_name: "Anna Kowalska",
          client_avatar: Avatar,
          rating: 5,
          comment:
            "Fantastyczna obsługa! Firma wykonała sprzątanie naszego biura perfekcyjnie. Wszystko było dokładnie wyczyszczone, a pracownicy bardzo profesjonalni. Polecam!",
          service_type: "Sprzątanie biur",
          created_at: "2025-08-05T14:30:00Z",
          contractor_reply: null,
          is_featured: true,
        },
        {
          id: 2,
          client_name: "Piotr Nowak",
          client_avatar: Avatar,
          rating: 4,
          comment:
            "Bardzo dobra jakość usług. Jedyny minus to nieco późniejsze przybycie niż umówiona godzina, ale poza tym wszystko było świetnie zrobione.",
          service_type: "Zarządzanie wspólnotą",
          created_at: "2025-08-03T09:15:00Z",
          contractor_reply: {
            text: "Dziękuję za opinię! Przepraszamy za opóźnienie - mieliśmy problemy komunikacyjne. Wprowadziliśmy już zmiany, aby takie sytuacje się nie powtarzały.",
            created_at: "2025-08-03T16:20:00Z",
          },
        },
        {
          id: 3,
          client_name: "Maria Wiśniewska",
          client_avatar: Avatar,
          rating: 5,
          comment:
            "Świetna komunikacja od początku do końca. Szybko odpowiadali na wiadomości, terminowo wykonali usługę. Mieszkanie błyszczy jak nowe!",
          service_type: "Sprzątanie mieszkań",
          created_at: "2025-08-01T11:45:00Z",
          contractor_reply: null,
        },
        {
          id: 4,
          client_name: "Tomasz Lewandowski",
          client_avatar: Avatar,
          rating: 3,
          comment:
            "Usługa w porządku, ale oczekiwałem więcej za tę cenę. Niektóre miejsca mogły być lepiej wyczyszczone.",
          service_type: "Konserwacja budynków",
          created_at: "2025-07-28T16:20:00Z",
          contractor_reply: null,
        },
        {
          id: 5,
          client_name: "Katarzyna Zielińska",
          client_avatar: Avatar,
          rating: 5,
          comment:
            "Profesjonalne podejście, konkurencyjne ceny i doskonała jakość. Będę korzystać z usług tej firmy w przyszłości. Dziękuję!",
          service_type: "Mycie okien",
          created_at: "2025-07-25T13:10:00Z",
          contractor_reply: {
            text: "Bardzo dziękuję za miłe słowa! Cieszymy się, że jesteś zadowolona z naszych usług. Czekamy na kolejne zlecenia.",
            created_at: "2025-07-25T18:30:00Z",
          },
        },
        {
          id: 6,
          client_name: "Robert Kowalczyk",
          client_avatar: Avatar,
          rating: 2,
          comment:
            "Niestety jestem rozczarowany. Sprzątanie było powierzchowne, a kilka umówionych rzeczy w ogóle nie zostało zrobionych. Nie polecam.",
          service_type: "Sprzątanie biur",
          created_at: "2025-07-20T10:30:00Z",
          contractor_reply: null,
        },
      ];

      setReviews(mockReviews);
    } catch (error) {
      console.error("Błąd podczas pobierania opinii:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      // Mock statistics - w rzeczywistości API call
      setStatistics({
        average_rating: 4.2,
        total_reviews: 23,
        rating_breakdown: {
          5: 12,
          4: 6,
          3: 3,
          2: 1,
          1: 1,
        },
      });
    } catch (error) {
      console.error("Błąd podczas pobierania statystyk:", error);
    }
  };

  const handleReply = (review) => {
    setSelectedReview(review);
    setReplyText(review.contractor_reply?.text || "");
    setShowReplyModal(true);
  };

  const submitReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    try {
      // Mock API call
      // await api.post(`/reviews/${selectedReview.id}/reply`, { text: replyText });

      // Update local state
      setReviews((prev) =>
        prev.map((review) =>
          review.id === selectedReview.id
            ? {
                ...review,
                contractor_reply: {
                  text: replyText,
                  created_at: new Date().toISOString(),
                },
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
      setMessage({
        type: "error",
        text: "Nie udało się dodać odpowiedzi",
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
        {filteredReviews.length === 0 ? (
          <div className="contractor-reviews-empty">
            <p>
              {filterRating !== "all"
                ? `Brak opinii z oceną ${filterRating} gwiazdek`
                : "Nie masz jeszcze żadnych opinii"}
            </p>
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div
              key={review.id}
              className={`contractor-review-card ${
                review.is_featured ? "featured" : ""
              }`}
            >
              {review.is_featured && (
                <div className="contractor-featured-badge">
                  Wyróżniona opinia
                </div>
              )}

              <div className="contractor-review-header">
                <div className="contractor-review-client">
                  <img src={review.client_avatar} alt={review.client_name} />
                  <div className="contractor-client-info">
                    <h4>{review.client_name}</h4>
                    <p className="contractor-service-type">
                      {review.service_type}
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
                <p>{review.comment}</p>
              </div>

              {review.contractor_reply && (
                <div className="contractor-reply">
                  <div className="contractor-reply-header">
                    <strong>Twoja odpowiedź:</strong>
                    <span className="contractor-reply-date">
                      {formatDate(review.contractor_reply.created_at)}
                    </span>
                  </div>
                  <p>{review.contractor_reply.text}</p>
                </div>
              )}

              <div className="contractor-review-actions">
                <button
                  onClick={() => handleReply(review)}
                  className="contractor-btn-reply"
                >
                  {review.contractor_reply ? "Edytuj odpowiedź" : "Odpowiedz"}
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
                  <strong>{selectedReview.client_name}</strong>
                  <div className="contractor-context-rating">
                    {renderStars(selectedReview.rating)}
                  </div>
                </div>
                <p className="contractor-context-comment">
                  "{selectedReview.comment}"
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
