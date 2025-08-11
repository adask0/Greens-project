import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";
import "../styles/contractor-subscription.css";

const ContractorSubscription = () => {
  const { user } = useAuth();
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [availablePlans, setAvailablePlans] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Mapowanie nazw planów na ich cechy
  const planFeatures = {
    STANDARD: {
      features: [
        "Do 3 aktywnych ogłoszeń",
        "Podstawowe statystyki",
        "Email support",
        "Profil kontrachenta",
      ],
      limitations: ["Brak wyróżnienia ogłoszeń", "Ograniczone statystyki"],
    },
    PLUS: {
      features: [
        "Do 10 aktywnych ogłoszeń",
        "Wyróżnienie ogłoszeń",
        "Szczegółowe statystyki",
        "Priority support",
        "Badge 'PLUS' przy profilu",
        "Promocja na stronie głównej",
      ],
      popular: true,
    },
    PREMIUM: {
      features: [
        "Nieograniczona liczba ogłoszeń",
        "Najwyższy priorytet w wynikach",
        "Zaawansowane analityki",
        "Dedykowany account manager",
        "Badge 'PREMIUM' przy profilu",
        "Top pozycja w kategorii",
        "Własne logo w wynikach",
      ],
    },
  };

  useEffect(() => {
    fetchSubscriptionData();
  }, []);

  const fetchSubscriptionData = async () => {
    try {
      setLoading(true);

      // Pobierz dostępne plany subskrypcji z API
      const subscriptionsResponse = await api.get("/subscriptions");
      console.log("Pobrane subskrypcje:", subscriptionsResponse.data);

      const subscriptionsData =
        subscriptionsResponse.data.data || subscriptionsResponse.data || [];

      // Przekształć dane z API na format potrzebny dla frontendu
      const formattedPlans = subscriptionsData.map((sub, index) => ({
        id: sub.id || index + 1,
        name: sub.name,
        price: parseFloat(sub.price),
        duration: sub.duration,
        features: planFeatures[sub.name]?.features || [],
        limitations: planFeatures[sub.name]?.limitations || [],
        popular: planFeatures[sub.name]?.popular || false,
      }));

      setAvailablePlans(formattedPlans);

      // Ustaw aktualną subskrypcję użytkownika na podstawie danych z AuthContext
      if (user) {
        setCurrentSubscription({
          type: user.subscription_type || "STANDARD",
          expires_at: user.subscription_end_date || "2025-02-15",
          status: user.is_active ? "active" : "inactive",
        });
      }

      // Przykładowa historia płatności (możesz dodać endpoint do API)
      setPaymentHistory([
        {
          id: 1,
          date: "2025-01-15",
          plan: user?.subscription_type || "STANDARD",
          amount:
            formattedPlans.find(
              (p) => p.name === (user?.subscription_type || "STANDARD")
            )?.price || 5,
          status: "paid",
          period: "Styczeń 2025",
        },
        {
          id: 2,
          date: "2024-12-15",
          plan: user?.subscription_type || "STANDARD",
          amount:
            formattedPlans.find(
              (p) => p.name === (user?.subscription_type || "STANDARD")
            )?.price || 5,
          status: "paid",
          period: "Grudzień 2024",
        },
        {
          id: 3,
          date: "2024-11-15",
          plan: user?.subscription_type || "STANDARD",
          amount:
            formattedPlans.find(
              (p) => p.name === (user?.subscription_type || "STANDARD")
            )?.price || 5,
          status: "paid",
          period: "Listopad 2024",
        },
      ]);
    } catch (error) {
      console.error("Błąd podczas pobierania danych subskrypcji:", error);
      setMessage({
        type: "error",
        text: "Nie udało się pobrać danych subskrypcji",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = (plan) => {
    setSelectedPlan(plan);
    setShowUpgradeModal(true);
  };

  const confirmUpgrade = async () => {
    if (!selectedPlan) return;

    try {
      await api.post("/subscriptions/upgrade", {
        plan: selectedPlan.name,
        duration: selectedPlan.duration,
      });

      setMessage({
        type: "success",
        text: `Plan został zmieniony na ${selectedPlan.name}!`,
      });

      setShowUpgradeModal(false);
      setSelectedPlan(null);
      fetchSubscriptionData();
    } catch (error) {
      console.error("Błąd podczas zmiany planu:", error);
      setMessage({
        type: "error",
        text: "Nie udało się zmienić planu. Spróbuj ponownie.",
      });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("pl-PL");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "success";
      case "pending":
        return "warning";
      case "failed":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "paid":
        return "Opłacone";
      case "pending":
        return "Oczekuje";
      case "failed":
        return "Nieudane";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="contractor-subscription-loading">
        <div>Ładowanie danych subskrypcji...</div>
      </div>
    );
  }

  return (
    <div className="contractor-subscription">
      <div className="contractor-subscription-header">
        <h2>Subskrypcje</h2>
        <p>Zarządzaj swoim planem i płatnościami</p>
      </div>

      {message.text && (
        <div className={`contractor-message ${message.type}`}>
          {message.text}
        </div>
      )}

      {currentSubscription && (
        <div className="contractor-current-subscription">
          <h3>Twój aktualny plan</h3>
          <div className="contractor-current-plan-card">
            <div className="contractor-plan-info">
              <div className="contractor-plan-name">
                {currentSubscription.type}
              </div>
              <div className="contractor-plan-status">
                Status:{" "}
                <span className={`status-${currentSubscription.status}`}>
                  {currentSubscription.status === "active"
                    ? "Aktywny"
                    : "Nieaktywny"}
                </span>
              </div>
              <div className="contractor-plan-expires">
                Ważny do: {formatDate(currentSubscription.expires_at)}
              </div>
            </div>
            <div className="contractor-plan-actions">
              <button
                onClick={() =>
                  handleUpgrade(availablePlans.find((p) => p.name === "PLUS"))
                }
                className="contractor-btn-upgrade"
              >
                Zmień plan
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="contractor-available-plans">
        <h3>Dostępne plany</h3>
        <div className="contractor-plans-grid">
          {availablePlans.map((plan) => (
            <div
              key={plan.id}
              className={`contractor-plan-card ${
                plan.popular ? "popular" : ""
              } ${currentSubscription?.type === plan.name ? "current" : ""}`}
            >
              {plan.popular && (
                <div className="contractor-plan-badge">Najpopularniejszy</div>
              )}

              <div className="contractor-plan-header">
                <h4>{plan.name}</h4>
                <div className="contractor-plan-price">
                  <span className="price">{plan.price}zł</span>
                  <span className="duration">{plan.duration}</span>
                </div>
              </div>

              <div className="contractor-plan-features">
                <h5>Co otrzymasz:</h5>
                <ul>
                  {plan.features.map((feature, index) => (
                    <li key={index} className="feature">
                      ✓ {feature}
                    </li>
                  ))}
                </ul>

                {plan.limitations && plan.limitations.length > 0 && (
                  <>
                    <h5>Ograniczenia:</h5>
                    <ul>
                      {plan.limitations.map((limitation, index) => (
                        <li key={index} className="limitation">
                          ✗ {limitation}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>

              <div className="contractor-plan-action">
                {currentSubscription?.type === plan.name ? (
                  <button className="contractor-btn-current" disabled>
                    Aktualny plan
                  </button>
                ) : (
                  <button
                    onClick={() => handleUpgrade(plan)}
                    className="contractor-btn-select"
                  >
                    {currentSubscription?.type === "STANDARD" &&
                    plan.name !== "STANDARD"
                      ? "Przejdź na ten plan"
                      : "Wybierz plan"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showUpgradeModal && selectedPlan && (
        <div className="contractor-subscription-modal">
          <div className="contractor-modal-content">
            <div className="contractor-modal-header">
              <h3>Zmiana planu</h3>
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="contractor-btn-close"
              >
                ✕
              </button>
            </div>

            <div className="contractor-modal-body">
              <p>Czy na pewno chcesz zmienić plan na:</p>

              <div className="contractor-selected-plan">
                <h4>{selectedPlan.name}</h4>
                <div className="contractor-plan-price">
                  <span className="price">{selectedPlan.price}zł</span>
                  <span className="duration">{selectedPlan.duration}</span>
                </div>
              </div>

              <div className="contractor-upgrade-info">
                <p>
                  <strong>Uwaga:</strong> Nowy plan będzie aktywny natychmiast
                  po opłaceniu. Pozostały czas z obecnego planu zostanie
                  rozliczony proporcjonalnie.
                </p>
              </div>
            </div>

            <div className="contractor-modal-actions">
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="contractor-btn-cancel"
              >
                Anuluj
              </button>
              <button
                onClick={confirmUpgrade}
                className="contractor-btn-confirm"
              >
                Potwierdź zmianę
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractorSubscription;
