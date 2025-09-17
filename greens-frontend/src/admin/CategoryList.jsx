import { useState, useEffect } from "react";
import api from "../services/api";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [changedCategories, setChangedCategories] = useState(new Set());
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    icon: "",
  });
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState(new Set());

  const [draggedCategory, setDraggedCategory] = useState(null);
  const [draggedSubcategory, setDraggedSubcategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get("/categories");
      console.log("Pobrane kategorie:", response.data);

      const categoriesData = response.data.data || response.data || [];
      setCategories(categoriesData);
      setChangedCategories(new Set());
    } catch (err) {
      setError("Błąd podczas pobierania kategorii");
      console.error("Błąd:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (categoryId) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const handleCategoryChange = (id, field, value) => {
    setCategories((prev) =>
      prev.map((category) =>
        category.id === id ? { ...category, [field]: value } : category
      )
    );
    setChangedCategories((prev) => new Set([...prev, id]));
  };

  const handleSubcategoryChange = (categoryId, subcategoryIndex, value) => {
    setCategories((prev) =>
      prev.map((category) => {
        if (category.id === categoryId) {
          const updatedSubcategories = [...(category.subcategories || [])];
          if (updatedSubcategories[subcategoryIndex]) {
            updatedSubcategories[subcategoryIndex] = {
              ...updatedSubcategories[subcategoryIndex],
              name: value,
            };
          }
          return { ...category, subcategories: updatedSubcategories };
        }
        return category;
      })
    );
    setChangedCategories((prev) => new Set([...prev, categoryId]));
  };

  const addSubcategoryInput = (categoryId) => {
    setCategories((prev) =>
      prev.map((category) => {
        if (category.id === categoryId) {
          const existingSubcategories = category.subcategories || [];
          const newSubcategory = {
            id: null,
            name: "",
            isNew: true,
            listings_count: 0,
          };
          return {
            ...category,
            subcategories: [...existingSubcategories, newSubcategory],
          };
        }
        return category;
      })
    );
    setChangedCategories((prev) => new Set([...prev, categoryId]));
    setExpandedCategories((prev) => new Set([...prev, categoryId]));
  };

  const removeSubcategoryInput = (categoryId, index) => {
    setCategories((prev) =>
      prev.map((category) => {
        if (category.id === categoryId) {
          const newSubcategories = [...category.subcategories];
          newSubcategories.splice(index, 1);
          return { ...category, subcategories: newSubcategories };
        }
        return category;
      })
    );
    setChangedCategories((prev) => new Set([...prev, categoryId]));
  };

  const handleCategoryDragStart = (e, categoryIndex) => {
    setDraggedCategory(categoryIndex);
    e.dataTransfer.effectAllowed = "move";
    e.target.style.opacity = "0.5";
  };

  const handleCategoryDragEnd = (e) => {
    e.target.style.opacity = "";
    setDraggedCategory(null);
  };

  const handleCategoryDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleCategoryDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedCategory === null || draggedCategory === dropIndex) return;

    const newCategories = [...categories];
    const draggedItem = newCategories[draggedCategory];

    newCategories.splice(draggedCategory, 1);
    newCategories.splice(dropIndex, 0, draggedItem);

    setCategories(newCategories);

    const changedIds = new Set([...changedCategories]);
    newCategories.forEach((cat) => changedIds.add(cat.id));
    setChangedCategories(changedIds);

    setDraggedCategory(null);
  };

  const handleSubcategoryDragStart = (e, categoryId, subcategoryIndex) => {
    setDraggedSubcategory({ categoryId, index: subcategoryIndex });
    e.dataTransfer.effectAllowed = "move";
    e.target.style.opacity = "0.5";
  };

  const handleSubcategoryDragEnd = (e) => {
    e.target.style.opacity = "";
    setDraggedSubcategory(null);
  };

  const handleSubcategoryDragOver = (e) => {
    e.preventDefault();
  };

  const handleSubcategoryDrop = (e, categoryId, dropIndex) => {
    e.preventDefault();
    if (
      !draggedSubcategory ||
      draggedSubcategory.categoryId !== categoryId ||
      draggedSubcategory.index === dropIndex
    )
      return;

    setCategories((prev) =>
      prev.map((category) => {
        if (category.id === categoryId) {
          const updatedSubcategories = [...category.subcategories];
          const draggedItem = updatedSubcategories[draggedSubcategory.index];

          updatedSubcategories.splice(draggedSubcategory.index, 1);
          updatedSubcategories.splice(dropIndex, 0, draggedItem);

          updatedSubcategories.forEach((sub, index) => {
            if (sub.id) {
              sub.id = parseInt(categoryId) * 1000 + index + 1;
            }
          });

          return { ...category, subcategories: updatedSubcategories };
        }
        return category;
      })
    );

    setChangedCategories((prev) => new Set([...prev, categoryId]));
    setDraggedSubcategory(null);
  };

  const saveChanges = async (e) => {
    e.preventDefault();

    if (changedCategories.size === 0) {
      setSuccess("Brak zmian do zapisania");
      setTimeout(() => setSuccess(null), 3000);
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const categoriesToUpdate = categories.filter((category) =>
        changedCategories.has(category.id)
      );

      for (let i = 0; i < categoriesToUpdate.length; i++) {
        const category = categoriesToUpdate[i];
        const categoryOrder = categories.findIndex(
          (cat) => cat.id === category.id
        );

        await api.put(`/admin/categories/${category.id}`, {
          name: category.name,
          description: category.description,
          icon: category.icon,
          order: categoryOrder,
        });

        if (category.subcategories) {
          for (let j = 0; j < category.subcategories.length; j++) {
            const subcategory = category.subcategories[j];
            if (subcategory.id && subcategory.name.trim()) {
              await api.put(`/admin/subcategories/${subcategory.id}`, {
                category_id: category.id,
                name: subcategory.name,
                order: j,
              });
            } else if (!subcategory.id && subcategory.name.trim()) {
              await api.post("/admin/subcategories", {
                category_id: category.id,
                name: subcategory.name,
                order: j,
              });
            }
          }
        }
      }

      setSuccess(`Zaktualizowano ${categoriesToUpdate.length} kategorii!`);
      setChangedCategories(new Set());
      setTimeout(() => setSuccess(null), 3000);

      await fetchCategories();
    } catch (err) {
      setError("Błąd podczas zapisywania zmian");
      console.error("Błąd:", err);
    } finally {
      setSaving(false);
    }
  };

  const addCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.name.trim()) return;

    try {
      setSaving(true);
      await api.post("/admin/categories", newCategory);
      setNewCategory({ name: "", description: "", icon: "" });
      setShowAddCategory(false);
      setSuccess("Kategoria została dodana!");
      setTimeout(() => setSuccess(null), 3000);
      await fetchCategories();
    } catch (err) {
      setError("Błąd podczas dodawania kategorii");
      console.error("Błąd:", err);
    } finally {
      setSaving(false);
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm("Czy na pewno chcesz usunąć tę kategorię?")) return;

    try {
      await api.delete(`/admin/categories/${id}`);
      setSuccess("Kategoria została usunięta!");
      setTimeout(() => setSuccess(null), 3000);
      await fetchCategories();
    } catch (err) {
      setError("Błąd podczas usuwania kategorii");
      console.error("Błąd:", err);
    }
  };

  const deleteSubcategory = async (categoryId, subcategoryId) => {
    if (!window.confirm("Czy na pewno chcesz usunąć tę podkategorię?")) return;

    try {
      await api.delete(`/admin/subcategories/${subcategoryId}`);
      setSuccess("Podkategoria została usunięta!");
      setTimeout(() => setSuccess(null), 3000);
      await fetchCategories();
    } catch (err) {
      setError("Błąd podczas usuwania podkategorii");
      console.error("Błąd:", err);
    }
  };

  const getFilteredCategories = () => {
    let filtered = [...categories];

    if (searchTerm) {
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortBy === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "listings_count") {
      filtered.sort(
        (a, b) => (b.listings_count || 0) - (a.listings_count || 0)
      );
    } else if (sortBy === "subcategories_count") {
      filtered.sort(
        (a, b) =>
          (b.subcategories?.length || 0) - (a.subcategories?.length || 0)
      );
    } else {
      filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    return filtered;
  };

  if (loading) {
    return (
      <div className="content-panel">
        <div className="loading">Ładowanie kategorii...</div>
      </div>
    );
  }

  const filteredCategories = getFilteredCategories();

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
            <option value="name">Nazwa</option>
            <option value="listings_count">Liczba ogłoszeń</option>
            <option value="subcategories_count">Liczba podkategorii</option>
            <option value="created_at">Data dodania</option>
          </select>

          <input
            type="text"
            placeholder="Szukaj kategorii"
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <button className="refresh-btn" onClick={fetchCategories}>
            🔄 Odśwież
          </button>

          <button
            className="search-btn"
            onClick={() => setShowAddCategory(true)}
          >
            + Dodaj kategorię
          </button>
        </div>

        <div className="stats">
          Kategorie: {filteredCategories.length}
          {changedCategories.size > 0 && (
            <span className="changes-indicator">
              | Zmieniono: {changedCategories.size}
            </span>
          )}
        </div>
      </div>

      {showAddCategory && (
        <div className="table-container">
          <form
            onSubmit={addCategory}
            style={{ padding: "20px", borderBottom: "1px solid #e2e8f0" }}
          >
            <h3>Dodaj nową kategorię</h3>
            <div
              style={{
                display: "flex",
                gap: "10px",
                alignItems: "center",
                marginTop: "10px",
              }}
            >
              <input
                type="text"
                placeholder="Nazwa kategorii"
                value={newCategory.name}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, name: e.target.value })
                }
                required
                style={{ flex: 1 }}
              />
              <input
                type="text"
                placeholder="Opis (opcjonalny)"
                value={newCategory.description}
                onChange={(e) =>
                  setNewCategory({
                    ...newCategory,
                    description: e.target.value,
                  })
                }
                style={{ flex: 1 }}
              />
              <input
                type="text"
                placeholder="Ikona (opcjonalny)"
                value={newCategory.icon}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, icon: e.target.value })
                }
                style={{ width: "120px" }}
              />
              <button type="submit" className="search-btn" disabled={saving}>
                {saving ? "Dodawanie..." : "Dodaj"}
              </button>
              <button
                type="button"
                className="delete-btn"
                onClick={() => setShowAddCategory(false)}
              >
                Anuluj
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="table-container">
        <form onSubmit={saveChanges}>
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            {filteredCategories.map((category, categoryIndex) => (
              <div key={category.id}>
                <div
                  draggable
                  onDragStart={(e) => handleCategoryDragStart(e, categoryIndex)}
                  onDragEnd={handleCategoryDragEnd}
                  onDragOver={handleCategoryDragOver}
                  onDrop={(e) => handleCategoryDrop(e, categoryIndex)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "12px 16px",
                    backgroundColor: changedCategories.has(category.id)
                      ? "#f0f9ff"
                      : "white",
                    border: "1px solid #e2e8f0",
                    borderBottom: expandedCategories.has(category.id)
                      ? "none"
                      : "1px solid #e2e8f0",
                    cursor: "grab",
                  }}
                >
                  <div
                    style={{ fontSize: "16px", color: "#999", cursor: "grab" }}
                  >
                    ⋮⋮
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleCategory(category.id)}
                    style={{
                      background: "none",
                      border: "none",
                      fontSize: "14px",
                      cursor: "pointer",
                      padding: "4px",
                      color: "#666",
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    {expandedCategories.has(category.id) ? "▼" : "▶"}
                  </button>

                  <input
                    value={category.name}
                    onChange={(e) =>
                      handleCategoryChange(category.id, "name", e.target.value)
                    }
                    style={{ flex: 2, fontWeight: "bold" }}
                    placeholder="Nazwa kategorii"
                    onMouseDown={(e) => e.stopPropagation()}
                  />

                  <input
                    value={category.description || ""}
                    onChange={(e) =>
                      handleCategoryChange(
                        category.id,
                        "description",
                        e.target.value
                      )
                    }
                    style={{ flex: 2 }}
                    placeholder="Opis kategorii"
                    onMouseDown={(e) => e.stopPropagation()}
                  />

                  <span
                    style={{
                      minWidth: "60px",
                      textAlign: "center",
                      color: "#666",
                      fontSize: "12px",
                    }}
                  >
                    {category.listings_count || 0} ogł.
                  </span>

                  <span
                    style={{
                      minWidth: "60px",
                      textAlign: "center",
                      color: "#666",
                      fontSize: "12px",
                    }}
                  >
                    {category.subcategories?.length || 0} pod.
                  </span>

                  <button
                    type="button"
                    className="search-btn"
                    onClick={() => addSubcategoryInput(category.id)}
                    style={{ fontSize: "12px", padding: "4px 8px" }}
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    + Pod
                  </button>

                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() => deleteCategory(category.id)}
                    disabled={category.listings_count > 0}
                    style={{ fontSize: "12px", padding: "4px 8px" }}
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    Usuń
                  </button>
                </div>

                {expandedCategories.has(category.id) && (
                  <div
                    style={{
                      border: "1px solid #e2e8f0",
                      borderTop: "none",
                      backgroundColor: "#f8f9fa",
                    }}
                  >
                    {category.subcategories &&
                    category.subcategories.length > 0 ? (
                      category.subcategories.map((subcategory, index) => (
                        <div
                          key={subcategory.id || `new-${index}`}
                          draggable
                          onDragStart={(e) =>
                            handleSubcategoryDragStart(e, category.id, index)
                          }
                          onDragEnd={handleSubcategoryDragEnd}
                          onDragOver={handleSubcategoryDragOver}
                          onDrop={(e) =>
                            handleSubcategoryDrop(e, category.id, index)
                          }
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            padding: "8px 16px 8px 60px",
                            borderBottom:
                              index < category.subcategories.length - 1
                                ? "1px solid #e2e8f0"
                                : "none",
                            cursor: "grab",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#bbb",
                              cursor: "grab",
                            }}
                          >
                            ⋮⋮
                          </div>

                          <input
                            value={subcategory.name || ""}
                            onChange={(e) =>
                              handleSubcategoryChange(
                                category.id,
                                index,
                                e.target.value
                              )
                            }
                            style={{ flex: 1 }}
                            placeholder="Nazwa podkategorii"
                            onMouseDown={(e) => e.stopPropagation()}
                          />

                          <span
                            style={{
                              minWidth: "60px",
                              textAlign: "center",
                              fontSize: "12px",
                              color: "#666",
                            }}
                          >
                            {subcategory.listings_count || 0} ogł.
                          </span>

                          {subcategory.id ? (
                            <button
                              type="button"
                              className="delete-btn"
                              onClick={() =>
                                deleteSubcategory(category.id, subcategory.id)
                              }
                              disabled={subcategory.listings_count > 0}
                              style={{ fontSize: "11px", padding: "2px 6px" }}
                              onMouseDown={(e) => e.stopPropagation()}
                            >
                              Usuń
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="delete-btn"
                              onClick={() =>
                                removeSubcategoryInput(category.id, index)
                              }
                              style={{ fontSize: "11px", padding: "2px 6px" }}
                              onMouseDown={(e) => e.stopPropagation()}
                            >
                              Usuń
                            </button>
                          )}
                        </div>
                      ))
                    ) : (
                      <div
                        style={{
                          padding: "12px 60px",
                          color: "#999",
                          fontStyle: "italic",
                          fontSize: "12px",
                        }}
                      >
                        Brak podkategorii
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredCategories.length === 0 && (
            <div className="no-data">Brak kategorii do wyświetlenia</div>
          )}

          <div className="table-footer">
            <button
              type="submit"
              className="save-btn"
              disabled={saving || changedCategories.size === 0}
            >
              {saving
                ? "ZAPISYWANIE..."
                : `ZAPISZ ZMIANY (${changedCategories.size})`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryList;
