import { useState, useEffect } from "react";
import api from "../services/api";

const SubscriptionsList = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get("/subscriptions");
      console.log("Pobrane subskrypcje:", response.data);

      const subscriptionsData = response.data.data || [];

      const subscriptionsWithEdit = subscriptionsData.map((sub) => ({
        ...sub,
        isEditing: false,
        originalPrice: parseFloat(sub.price),
      }));

      setSubscriptions(subscriptionsWithEdit);
    } catch (err) {
      setError("Błąd podczas pobierania subskrypcji");
      console.error("Błąd:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleEdit = (index) => {
    const updated = [...subscriptions];

    if (updated[index].isEditing) {
      updated[index].price = updated[index].originalPrice;
    }

    updated[index].isEditing = !updated[index].isEditing;
    setSubscriptions(updated);
  };

  const handlePriceChange = (index, newPrice) => {
    const updated = [...subscriptions];
    updated[index].price = newPrice;
    setSubscriptions(updated);
  };

  const saveChanges = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const changedSubscriptions = subscriptions
        .filter(
          (sub) => parseFloat(sub.price) !== parseFloat(sub.originalPrice)
        )
        .map((sub) => ({
          id: sub.id,
          price: parseFloat(sub.price),
        }));

      if (changedSubscriptions.length === 0) {
        setSuccess("Brak zmian do zapisania");
        setTimeout(() => setSuccess(null), 3000);
        return;
      }

      for (const sub of changedSubscriptions) {
        await api.put(`/subscriptions/${sub.id}`, {
          price: sub.price,
        });
      }

      await fetchSubscriptions();

      setSuccess("Zmiany zostały zapisane!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("Błąd podczas zapisywania");
      console.error("Błąd:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="content-panel">
        <div className="loading">Ładowanie subskrypcji...</div>
      </div>
    );
  }

  return (
    <div className="content-panel">
      {error && <div className="alert alert-error">⚠️ {error}</div>}

      {success && <div className="alert alert-success">✅ {success}</div>}

      <div className="subscription-cards">
        {subscriptions.map((sub, index) => (
          <div key={sub.id} className="subscription-card">
            <h3>Subskrypcja {sub.name}</h3>
            <p className="duration">{sub.duration}</p>

            {sub.isEditing ? (
              <input
                className="price-editor"
                type="number"
                step="0.01"
                value={sub.price}
                onChange={(e) => handlePriceChange(index, e.target.value)}
              />
            ) : (
              <div className="price">{sub.price} zł</div>
            )}

            <button className="edit-btn" onClick={() => toggleEdit(index)}>
              {sub.isEditing ? "anuluj" : "edytuj"} ✏️
            </button>
          </div>
        ))}
      </div>

      <div className="table-footer">
        <button className="save-btn" onClick={saveChanges} disabled={saving}>
          {saving ? "ZAPISYWANIE..." : "ZAPISZ ZMIANY"}
        </button>
      </div>
    </div>
  );
};

export default SubscriptionsList;
