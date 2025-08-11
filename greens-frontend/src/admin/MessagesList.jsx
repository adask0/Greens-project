import React, { useState, useEffect } from "react";
import api from "../services/api";
import SendIcon from "../assets/Send.svg";

const MessagesList = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    sortBy: "created_at",
    sortOrder: "desc",
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

  // Funkcja pomocnicza do określenia klasy CSS dla statusu
  const getStatusClass = (status) => {
    switch (status) {
      case "approved":
      case "resolved":
        return "status-select status-active";
      case "rejected":
      case "spam":
        return "status-select status-inactive";
      case "pending":
      default:
        return "status-select status-pending";
    }
  };

  if (loading) return <div className="no-data">Ładowanie wiadomości...</div>;
  if (error) return <div className="no-data">{error}</div>;

  return (
    <div className="content-panel">
      <div className="content-header">
        <div className="search-filters">
          <select
            className="filter-select"
            onChange={handleSortChange}
            value={filters.sortBy}
          >
            <option value="created_at">Sortuj wg daty</option>
            <option value="company_name">Sortuj wg firmy</option>
            <option value="status">Sortuj wg statusu</option>
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
              <th>Od (Użytkownik)</th>
              <th>Do (Firma)</th>
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
                <td colSpan="10" className="no-data">
                  Brak wiadomości do wyświetlenia
                </td>
              </tr>
            ) : (
              messages.map((message) => (
                <tr key={message.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedMessages.includes(message.id)}
                      onChange={() => handleSelectMessage(message.id)}
                    />
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
                        message.company?.name ||
                        "Nieznana firma"
                      }
                      readOnly
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={message.subject || message.topic || "Brak tematu"}
                      readOnly
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={
                        message.message?.substring(0, 50) +
                          (message.message?.length > 50 ? "..." : "") ||
                        "Brak treści"
                      }
                      readOnly
                      title={message.message} // Pełna treść w tooltip
                    />
                  </td>
                  <td>
                    <input
                      type="email"
                      value={message.email || message.sender_email || ""}
                      readOnly
                    />
                  </td>
                  <td>
                    <input
                      type="tel"
                      value={message.phone || message.sender_phone || ""}
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
                        placeholder="Szybka odpowiedź"
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
                      <img
                        src={SendIcon}
                        alt="Send"
                        className="send-icon"
                        onClick={() => handleQuickReply(message.id)}
                      />
                    </div>
                  </td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteMessage(message.id)}
                      title="Usuń wiadomość"
                    >
                      🗑️
                    </button>
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

export default MessagesList;
