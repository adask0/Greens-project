import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";
import "../styles/comment-section.css";

const CommentsSection = ({ listingId }) => {
  const { user, isClient, isContractor } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchComments();
  }, [listingId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      console.log("=== FETCH COMMENTS DEBUG ===");
      console.log("listingId:", listingId);
      console.log("API URL:", `/listings/${listingId}/comments`);

      const response = await api.get(`/listings/${listingId}/comments`);

      console.log("Response status:", response.status);
      console.log("Response data:", response.data);

      let commentsData = response.data?.data || response.data || [];
      console.log("Comments data:", commentsData);
      console.log("Comments count:", commentsData.length);

      if (commentsData.length > 0) {
        console.log("First comment:", commentsData[0]);
        commentsData.forEach((comment, index) => {
          console.log(`Comment ${index}:`, comment);
        });
      }

      setComments(commentsData);
      setError(null);
    } catch (err) {
      console.error("Error details:", err);
      console.error("Error response:", err.response?.data);
      setError("Błąd podczas pobierania komentarzy");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("Musisz być zalogowany, aby dodać komentarz");
      return;
    }

    if (!newComment.trim()) {
      setError("Komentarz nie może być pusty");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const commentData = {
        listing_id: listingId,
        message: newComment,
        subject: "Komentarz do ogłoszenia",
        sender_name: user.name || user.company_name,
        sender_email: user.email,
        sender_phone: user.phone || "",
        message_type: "comment",
        status: "pending", // Wymaga zatwierdzenia przez admina
      };

      await api.post("/messages", commentData);

      setNewComment("");
      setSuccess(
        "Komentarz został wysłany do moderacji. Pojawi się po zatwierdzeniu przez administratora."
      );

      // Ukryj komunikat o sukcesie po 5 sekundach
      setTimeout(() => setSuccess(null), 5000);
    } catch (err) {
      console.error("Błąd podczas dodawania komentarza:", err);
      setError("Błąd podczas dodawania komentarza");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("pl-PL", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "";
    }
  };

  const renderStars = (rating) => {
    if (!rating) return null;

    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} className="comment-star filled">
          ★
        </span>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <span key="half" className="comment-star half">
          ★
        </span>
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="comment-star empty">
          ★
        </span>
      );
    }

    return <div className="comment-rating">{stars}</div>;
  };

  // Funkcja do określenia kto odpowiedział na komentarz (bez dodatkowej kolumny)
  const getReplyInfo = (comment) => {
    console.log("=== CHECKING REPLY INFO ===");
    console.log("Comment:", comment);
    console.log("replied_by:", comment.replied_by);
    console.log("company_name:", comment.company_name);
    console.log("Current user:", user);

    if (!comment.admin_reply) {
      return null;
    }

    // Jeśli replied_by jest null, to kontrahent odpowiedział
    // (bo admin zawsze ma replied_by ustawione)
    if (!comment.replied_by || comment.replied_by === null) {
      console.log("Reply type: CONTRACTOR (replied_by is null)");
      return {
        type: "contractor",
        name: comment.company_name || "Wykonawca",
        label: "Odpowiedź wykonawcy"
      };
    }

    // Jeśli replied_by istnieje, to admin odpowiedział
    console.log("Reply type: ADMIN (replied_by exists)");
    return {
      type: "admin",
      name: "Administrator",
      label: "Odpowiedź administratora"
    };
  };

  return (
    <div className="comments-section">
      <h3>Komentarze ({comments.length})</h3>

      {/* Formularz dodawania komentarza - tylko dla zalogowanych */}
      {user ? (
        <div className="comment-form-container">
          <h4>Dodaj komentarz</h4>

          {error && (
            <div className="comment-alert comment-alert-error">{error}</div>
          )}

          {success && (
            <div className="comment-alert comment-alert-success">{success}</div>
          )}

          <form onSubmit={handleSubmitComment} className="comment-form">
            <div className="comment-form-header">
              <div className="comment-user-info">
                <span className="comment-username">
                  {user.name || user.company_name}
                </span>
                <span className="comment-user-type">
                  {isContractor() ? "(Wykonawca)" : "(Klient)"}
                </span>
              </div>
            </div>

            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Napisz swój komentarz..."
              className="comment-textarea"
              rows="4"
              maxLength="1000"
              disabled={submitting}
            />

            <div className="comment-form-footer">
              <span className="comment-counter">{newComment.length}/1000</span>
              <button
                type="submit"
                className="comment-submit-btn"
                disabled={submitting || !newComment.trim()}
              >
                {submitting ? "Wysyłanie..." : "Dodaj komentarz"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="comment-login-prompt">
          <p>
            <a href="/login" className="comment-login-link">
              Zaloguj się
            </a>{" "}
            lub{" "}
            <a href="/register" className="comment-login-link">
              zarejestruj
            </a>
            , aby dodać komentarz.
          </p>
        </div>
      )}

      {/* Lista komentarzy */}
      <div className="comments-list">
        {loading ? (
          <div className="comments-loading">Ładowanie komentarzy...</div>
        ) : comments.length === 0 ? (
          <div className="comments-empty">
            <p>Brak komentarzy. Bądź pierwszą osobą, która skomentuje!</p>
          </div>
        ) : (
          comments.map((comment) => {
            const replyInfo = getReplyInfo(comment);

            return (
              <div key={comment.id} className="comment-item">
                <div className="comment-header">
                  <div className="comment-author-info">
                    <span className="comment-author-name">
                      {comment.sender_name || "Anonim"}
                    </span>
                    <span className="comment-date">
                      {formatDate(comment.created_at)}
                    </span>
                  </div>
                  {comment.rating && renderStars(comment.rating)}
                </div>

                <div className="comment-content">
                  <p>{comment.message}</p>
                </div>

                {/* Odpowiedzi z informacją kto odpowiedział */}
                {comment.admin_reply && replyInfo && (
                  <div className={`comment-reply ${replyInfo.type}`}>
                    <div className="reply-header">
                      <span className={`reply-badge ${replyInfo.type}`}>
                        {replyInfo.label}
                      </span>
                      <span className="reply-author">
                        {replyInfo.name}
                      </span>
                      {comment.replied_at && (
                        <span className="reply-date">
                          {formatDate(comment.replied_at)}
                        </span>
                      )}
                    </div>
                    <div className="reply-content">
                      <p>{comment.admin_reply}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CommentsSection;