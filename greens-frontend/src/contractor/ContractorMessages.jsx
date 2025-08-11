import React, { useState, useEffect, useRef } from "react";
import api from "../services/api";
import Avatar from "../assets/Avatar.png";
import "../styles/contractor-messages.css";

const ContractorMessages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchConversations = async () => {
    try {
      // Mock data - w rzeczywistości byłby API call
      const mockConversations = [
        {
          id: 1,
          client_name: "Anna Kowalska",
          client_email: "anna@example.com",
          client_avatar: Avatar,
          last_message:
            "Dziękuję za szybką odpowiedź! Kiedy możemy umówić się na wycenę?",
          last_message_time: "2025-08-07T10:30:00Z",
          unread_count: 2,
          listing_title: "Sprzątanie biur - Warszawa",
        },
        {
          id: 2,
          client_name: "Piotr Nowak",
          client_email: "piotr@company.pl",
          client_avatar: Avatar,
          last_message:
            "Proszę o kontakt w sprawie zarządzania nieruchomością.",
          last_message_time: "2025-08-06T15:45:00Z",
          unread_count: 0,
          listing_title: "Zarządzanie wspólnotami",
        },
        {
          id: 3,
          client_name: "Maria Wiśniewska",
          client_email: "maria@gmail.com",
          client_avatar: Avatar,
          last_message: "Czy świadczą Państwo usługi także w weekendy?",
          last_message_time: "2025-08-06T09:20:00Z",
          unread_count: 1,
          listing_title: "Sprzątanie mieszkań",
        },
        {
          id: 4,
          client_name: "Tomasz Lewandowski",
          client_email: "tomasz@example.com",
          client_avatar: Avatar,
          last_message: "Dziękuję za ofertę, przemyślimy sprawę.",
          last_message_time: "2025-08-05T14:10:00Z",
          unread_count: 0,
          listing_title: "Konserwacja budynków",
        },
      ];

      setConversations(mockConversations);
      if (mockConversations.length > 0 && !selectedConversation) {
        setSelectedConversation(mockConversations[0]);
      }
    } catch (error) {
      console.error("Błąd podczas pobierania konwersacji:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      // Mock messages data
      const mockMessages = [
        {
          id: 1,
          conversation_id: conversationId,
          sender_type: "client",
          sender_name: "Anna Kowalska",
          message:
            "Dzień dobry! Interesuje mnie Państwa oferta sprzątania biur. Czy mogliby Państwo przesłać szczegółową wycenę dla biura o powierzchni 200m2?",
          created_at: "2025-08-06T09:00:00Z",
          is_read: true,
        },
        {
          id: 2,
          conversation_id: conversationId,
          sender_type: "contractor",
          sender_name: "Ja",
          message:
            "Dzień dobry! Oczywiście, z przyjemnością przygotujemy wycenę. Czy mogłaby Pani podać więcej szczegółów o biurze? Ile jest pomieszczeń, czy są specjalne wymagania dotyczące sprzątania?",
          created_at: "2025-08-06T10:15:00Z",
          is_read: true,
        },
        {
          id: 3,
          conversation_id: conversationId,
          sender_type: "client",
          sender_name: "Anna Kowalska",
          message:
            "Biuro składa się z 8 pomieszczeń biurowych, 2 sal konferencyjnych, kuchni i 3 toalet. Potrzebujemy codziennego sprzątania po godzinach pracy.",
          created_at: "2025-08-06T11:30:00Z",
          is_read: true,
        },
        {
          id: 4,
          conversation_id: conversationId,
          sender_type: "contractor",
          sender_name: "Ja",
          message:
            "Dziękuję za informacje. Na podstawie podanych danych przygotowałem wstępną wycenę: 800zł miesięcznie za codzienne sprzątanie. W cenę wchodzi: odkurzanie, mycie podłóg, czyszczenie toalet, wynoszenie śmieci. Czy moglibyśmy umówić się na oględziny?",
          created_at: "2025-08-07T09:45:00Z",
          is_read: true,
        },
        {
          id: 5,
          conversation_id: conversationId,
          sender_type: "client",
          sender_name: "Anna Kowalska",
          message:
            "Dziękuję za szybką odpowiedź! Kiedy możemy umówić się na wycenę?",
          created_at: "2025-08-07T10:30:00Z",
          is_read: false,
        },
      ];

      setMessages(mockMessages);
    } catch (error) {
      console.error("Błąd podczas pobierania wiadomości:", error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    setSendingMessage(true);

    try {
      const messageToSend = {
        id: Date.now(),
        conversation_id: selectedConversation.id,
        sender_type: "contractor",
        sender_name: "Ja",
        message: newMessage.trim(),
        created_at: new Date().toISOString(),
        is_read: true,
      };

      // Dodaj wiadomość lokalnie
      setMessages((prev) => [...prev, messageToSend]);

      // Zaktualizuj ostatnią wiadomość w konwersacji
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === selectedConversation.id
            ? {
                ...conv,
                last_message: newMessage.trim(),
                last_message_time: new Date().toISOString(),
              }
            : conv
        )
      );

      setNewMessage("");

      // W rzeczywistości byłby tu API call
      // await api.post(`/conversations/${selectedConversation.id}/messages`, { message: newMessage });
    } catch (error) {
      console.error("Błąd podczas wysyłania wiadomości:", error);
    } finally {
      setSendingMessage(false);
    }
  };

  const markAsRead = async (conversationId) => {
    try {
      // Oznacz jako przeczytane lokalnie
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === conversationId ? { ...conv, unread_count: 0 } : conv
        )
      );

      // W rzeczywistości byłby tu API call
      // await api.patch(`/conversations/${conversationId}/mark-read`);
    } catch (error) {
      console.error("Błąd podczas oznaczania jako przeczytane:", error);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString("pl-PL", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return date.toLocaleDateString("pl-PL", {
        day: "2-digit",
        month: "2-digit",
      });
    }
  };

  const formatMessageTime = (dateString) => {
    return new Date(dateString).toLocaleString("pl-PL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.listing_title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleConversationSelect = (conversation) => {
    setSelectedConversation(conversation);
    if (conversation.unread_count > 0) {
      markAsRead(conversation.id);
    }
  };

  if (loading) {
    return (
      <div className="contractor-messages-loading">
        <div>Ładowanie wiadomości...</div>
      </div>
    );
  }

  return (
    <div className="contractor-messages">
      <div className="contractor-messages-sidebar">
        <div className="contractor-messages-header">
          <h3>Wiadomości</h3>
          <div className="contractor-messages-search">
            <input
              type="text"
              placeholder="Szukaj konwersacji..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              className="search-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </div>
        </div>

        <div className="contractor-conversations-list">
          {filteredConversations.length === 0 ? (
            <div className="contractor-conversations-empty">
              <p>Brak wiadomości</p>
            </div>
          ) : (
            filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`contractor-conversation-item ${
                  selectedConversation?.id === conversation.id ? "active" : ""
                }`}
                onClick={() => handleConversationSelect(conversation)}
              >
                <div className="contractor-conversation-avatar">
                  <img
                    src={conversation.client_avatar}
                    alt={conversation.client_name}
                  />
                  {conversation.unread_count > 0 && (
                    <div className="contractor-unread-badge">
                      {conversation.unread_count}
                    </div>
                  )}
                </div>

                <div className="contractor-conversation-content">
                  <div className="contractor-conversation-header">
                    <h4 className="contractor-client-name">
                      {conversation.client_name}
                    </h4>
                    <span className="contractor-conversation-time">
                      {formatTime(conversation.last_message_time)}
                    </span>
                  </div>

                  <div className="contractor-listing-title">
                    {conversation.listing_title}
                  </div>

                  <p className="contractor-last-message">
                    {conversation.last_message}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="contractor-messages-main">
        {selectedConversation ? (
          <>
            <div className="contractor-messages-chat-header">
              <div className="contractor-chat-client-info">
                <img
                  src={selectedConversation.client_avatar}
                  alt={selectedConversation.client_name}
                />
                <div>
                  <h4>{selectedConversation.client_name}</h4>
                  <p>{selectedConversation.listing_title}</p>
                </div>
              </div>
            </div>

            <div className="contractor-messages-chat-content">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`contractor-message-item ${
                    message.sender_type === "contractor" ? "own" : "other"
                  }`}
                >
                  <div className="contractor-message-bubble">
                    <p>{message.message}</p>
                    <span className="contractor-message-time">
                      {formatMessageTime(message.created_at)}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form
              onSubmit={handleSendMessage}
              className="contractor-messages-input"
            >
              <div className="contractor-input-container">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Napisz wiadomość..."
                  rows="1"
                  disabled={sendingMessage}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || sendingMessage}
                  className="contractor-send-button"
                >
                  {sendingMessage ? (
                    <div className="contractor-spinner"></div>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22,2 15,22 11,13 2,9 22,2" />
                    </svg>
                  )}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="contractor-no-conversation">
            <div>
              <h3>Wybierz konwersację</h3>
              <p>Wybierz konwersację z listy, aby wyświetlić wiadomości</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContractorMessages;
