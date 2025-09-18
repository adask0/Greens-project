import { useState, useEffect } from "react";
import api from "../services/api";

const CompanyList = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [filterStatus, setFilterStatus] = useState("");
  const [changedCompanies, setChangedCompanies] = useState(new Set());
  const [selectedCompanies, setSelectedCompanies] = useState(new Set());
  const [deletingCompanies, setDeletingCompanies] = useState(new Set());

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get("/companies/all");
      console.log("Pobrane firmy:", response.data);

      const companiesData = response.data.data || [];
      setCompanies(companiesData);
      setChangedCompanies(new Set());
      setSelectedCompanies(new Set());
    } catch (err) {
      setError("Błąd podczas pobierania firm");
      console.error("Błąd:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (id, field, value) => {
    setCompanies((prev) =>
      prev.map((company) =>
        company.id === id ? { ...company, [field]: value } : company
      )
    );

    setChangedCompanies((prev) => new Set([...prev, id]));
  };

  const handleSelectCompany = (id) => {
    setSelectedCompanies((prev) => {
      const newSelected = new Set(prev);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      return newSelected;
    });
  };

  const handleSelectAll = () => {
    const filteredIds = getFilteredCompanies().map(c => c.id);
    if (selectedCompanies.size === filteredIds.length) {
      setSelectedCompanies(new Set());
    } else {
      setSelectedCompanies(new Set(filteredIds));
    }
  };

  const deleteCompany = async (id) => {
    const company = companies.find(c => c.id === id);
    if (!window.confirm(`Czy na pewno chcesz usunąć firmę "${company?.name}"?`)) {
      return;
    }

    try {
      setDeletingCompanies(prev => new Set([...prev, id]));
      await api.delete(`/companies/${id}`);

      setCompanies(prev => prev.filter(c => c.id !== id));
      setSelectedCompanies(prev => {
        const newSelected = new Set(prev);
        newSelected.delete(id);
        return newSelected;
      });
      setChangedCompanies(prev => {
        const newChanged = new Set(prev);
        newChanged.delete(id);
        return newChanged;
      });

      setSuccess(`Firma "${company?.name}" została usunięta`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(`Błąd podczas usuwania firmy "${company?.name}"`);
      console.error("Błąd:", err);
    } finally {
      setDeletingCompanies(prev => {
        const newDeleting = new Set(prev);
        newDeleting.delete(id);
        return newDeleting;
      });
    }
  };

  const deleteSelectedCompanies = async () => {
    if (selectedCompanies.size === 0) return;

    if (!window.confirm(`Czy na pewno chcesz usunąć ${selectedCompanies.size} zaznaczonych firm?`)) {
      return;
    }

    try {
      setSaving(true);
      let deletedCount = 0;
      let errors = [];

      for (const id of selectedCompanies) {
        try {
          await api.delete(`/companies/${id}`);
          deletedCount++;
        } catch (err) {
          const company = companies.find(c => c.id === id);
          errors.push(company?.name || `ID: ${id}`);
        }
      }

      // Usuń firmy z lokalnego stanu
      setCompanies(prev => prev.filter(c => !selectedCompanies.has(c.id)));
      setSelectedCompanies(new Set());
      setChangedCompanies(prev => {
        const newChanged = new Set(prev);
        selectedCompanies.forEach(id => newChanged.delete(id));
        return newChanged;
      });

      if (errors.length === 0) {
        setSuccess(`Usunięto ${deletedCount} firm`);
      } else {
        setSuccess(`Usunięto ${deletedCount} firm`);
        setError(`Nie udało się usunąć: ${errors.join(", ")}`);
      }

      setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 5000);

    } catch (err) {
      setError("Błąd podczas masowego usuwania");
      console.error("Błąd:", err);
    } finally {
      setSaving(false);
    }
  };

  const saveChanges = async (e) => {
    e.preventDefault();

    if (changedCompanies.size === 0) {
      setSuccess("Brak zmian do zapisania");
      setTimeout(() => setSuccess(null), 3000);
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const companiesToUpdate = companies
        .filter((company) => changedCompanies.has(company.id))
        .map((company) => ({
          id: company.id,
          name: company.name,
          address: company.address,
          email: company.email,
          phone: company.phone,
          subscription: company.subscription,
          nip: company.nip,
          status: company.status,
        }));

      console.log("Zapisywanie zmian:", companiesToUpdate);

      for (const company of companiesToUpdate) {
        await api.put(`/companies/${company.id}`, company);
      }

      setSuccess(`Zaktualizowano ${companiesToUpdate.length} firm!`);
      setChangedCompanies(new Set());
      setTimeout(() => setSuccess(null), 3000);

      await fetchCompanies();
    } catch (err) {
      setError("Błąd podczas zapisywania zmian");
      console.error("Błąd:", err);
    } finally {
      setSaving(false);
    }
  };

  const getFilteredCompanies = () => {
    let filtered = [...companies];

    if (filterStatus) {
      filtered = filtered.filter((c) => c.status === filterStatus);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.nip?.includes(searchTerm) ||
          c.address?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "email":
          return a.email.localeCompare(b.email);
        case "status":
          return a.status.localeCompare(b.status);
        default:
          return new Date(b.created_at) - new Date(a.created_at);
      }
    });

    return filtered;
  };

  if (loading) {
    return (
      <div className="content-panel">
        <div className="loading">Ładowanie firm...</div>
      </div>
    );
  }

  const filteredCompanies = getFilteredCompanies();

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
            <option value="">Sortuj</option>
            <option value="name">Nazwa</option>
            <option value="email">Email</option>
            <option value="status">Status</option>
            <option value="created_at">Data dodania</option>
          </select>

          <select
            className="filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">Wszystkie statusy</option>
            <option value="dostępny">Dostępny</option>
            <option value="niedostępny">Niedostępny</option>
            <option value="zawieszony">Zawieszony</option>
          </select>

          <input
            type="text"
            placeholder="Szukaj"
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <button className="refresh-btn" onClick={fetchCompanies}>
            🔄 Odśwież
          </button>

          {selectedCompanies.size > 0 && (
            <button
              className="delete-btn bulk-delete-btn"
              onClick={deleteSelectedCompanies}
              disabled={saving}
            >
              🗑️ Usuń zaznaczone ({selectedCompanies.size})
            </button>
          )}
        </div>

        <div className="stats">
          Znaleziono: {filteredCompanies.length} firm
          {changedCompanies.size > 0 && (
            <span className="changes-indicator">
              | Zmieniono: {changedCompanies.size}
            </span>
          )}
          {selectedCompanies.size > 0 && (
            <span className="selected-indicator">
              | Zaznaczono: {selectedCompanies.size}
            </span>
          )}
        </div>
      </div>

      <div className="table-container">
        <form onSubmit={saveChanges}>
          <table className="data-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={filteredCompanies.length > 0 && selectedCompanies.size === filteredCompanies.length}
                    onChange={handleSelectAll}
                    title="Zaznacz wszystkie"
                  />
                </th>
                <th>ID</th>
                <th>Firma</th>
                <th>Adres</th>
                <th>Status</th>
                <th>E-mail</th>
                <th>Telefon</th>
                <th>Sub.</th>
                <th>NIP</th>
                <th>Akcje</th>
              </tr>
            </thead>
            <tbody>
              {filteredCompanies.map((company) => (
                <tr
                  key={company.id}
                  className={`
                    ${changedCompanies.has(company.id) ? "changed" : ""}
                    ${selectedCompanies.has(company.id) ? "selected" : ""}
                    ${deletingCompanies.has(company.id) ? "deleting" : ""}
                  `.trim()}
                >
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedCompanies.has(company.id)}
                      onChange={() => handleSelectCompany(company.id)}
                      disabled={deletingCompanies.has(company.id)}
                    />
                  </td>
                  <td>{company.id}</td>
                  <td>
                    <input
                      value={company.name}
                      onChange={(e) =>
                        handleChange(company.id, "name", e.target.value)
                      }
                      disabled={deletingCompanies.has(company.id)}
                    />
                  </td>
                  <td>
                    <input
                      value={company.address || ""}
                      onChange={(e) =>
                        handleChange(company.id, "address", e.target.value)
                      }
                      disabled={deletingCompanies.has(company.id)}
                    />
                  </td>
                  <td>
                    <select
                      value={company.status}
                      onChange={(e) =>
                        handleChange(company.id, "status", e.target.value)
                      }
                      className={`status-select status-${company.status}`}
                      disabled={deletingCompanies.has(company.id)}
                    >
                      <option value="dostępny">dostępny</option>
                      <option value="niedostępny">niedostępny</option>
                      <option value="zawieszony">zawieszony</option>
                    </select>
                  </td>
                  <td>
                    <input
                      value={company.email}
                      onChange={(e) =>
                        handleChange(company.id, "email", e.target.value)
                      }
                      type="email"
                      disabled={deletingCompanies.has(company.id)}
                    />
                  </td>
                  <td>
                    <input
                      value={company.phone || ""}
                      onChange={(e) =>
                        handleChange(company.id, "phone", e.target.value)
                      }
                      disabled={deletingCompanies.has(company.id)}
                    />
                  </td>
                  <td>
                    <input
                      value={company.subscription || ""}
                      onChange={(e) =>
                        handleChange(company.id, "subscription", e.target.value)
                      }
                      className="subscription-input"
                      disabled={deletingCompanies.has(company.id)}
                    />
                  </td>
                  <td>
                    <input
                      value={company.nip || ""}
                      onChange={(e) =>
                        handleChange(company.id, "nip", e.target.value)
                      }
                      disabled={deletingCompanies.has(company.id)}
                    />
                  </td>
                  <td>
                    <button
                      type="button"
                      className="delete-btn"
                      onClick={() => deleteCompany(company.id)}
                      disabled={deletingCompanies.has(company.id)}
                      title={`Usuń firmę ${company.name}`}
                    >
                      {deletingCompanies.has(company.id) ? "..." : "Usuń"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredCompanies.length === 0 && (
            <div className="no-data">Brak firm do wyświetlenia</div>
          )}

          <div className="table-footer">
            <button
              type="submit"
              className="save-btn"
              disabled={saving || changedCompanies.size === 0}
            >
              {saving
                ? "ZAPISYWANIE..."
                : `ZAPISZ ZMIANY (${changedCompanies.size})`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanyList;
