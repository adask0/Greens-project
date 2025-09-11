import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";
import Avatar from "../assets/Avatar.png";
import "../styles/contractor-listings.css";

const ContractorListings = () => {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingListing, setEditingListing] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [selectedImages, setSelectedImages] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [currentImages, setCurrentImages] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    long_description: "",
    price: "",
    category: "",
    subcategory: "",
    location: "",
    phone: "",
    email: "",
    status: "active",
  });

  const categories = {
    "Usługi porządkowe": [
      "Porządkowe",
      "Sprzątanie biur",
      "Mycie okien",
      "Sprzątanie mieszkań",
    ],
    "Zarządzanie nieruchomościami mieszkalnymi": [
      "Mieszkalnictwo",
      "Administracja",
      "Konserwacja",
      "Zarządzanie wspólnotą",
      "Nadzór techniczny",
    ],
    "Nieruchomości przemysłowe": [
      "Przemysłowe",
      "Fabryki",
      "Magazyny",
      "Hale produkcyjne",
      "Tereny przemysłowe",
    ],
    "Nieruchomości gruntowe": [
      "Gruntowe",
      "Działki budowlane",
      "Tereny rolne",
      "Działki rekreacyjne",
      "Tereny inwestycyjne",
    ],
  };

  const fetchUserProfile = async () => {
    try {
      const response = await api.get("/contractor/profile");

      let profileData = {};
      if (response.data?.data) {
        profileData = response.data.data;
      } else if (response.data) {
        profileData = response.data;
      }

      setUserProfile(profileData);
    } catch (error) {
      console.error("Błąd podczas pobierania profilu użytkownika:", error);
      if (user) {
        setUserProfile(user);
      }
    }
  };

  useEffect(() => {
    fetchListings();
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchListings = async () => {
    try {
      const response = await api.get("/contractor/listings");

      let listingsData = [];
      if (response.data?.data?.data) {
        listingsData = response.data.data.data;
      } else if (response.data?.data) {
        listingsData = response.data.data;
      } else if (Array.isArray(response.data)) {
        listingsData = response.data;
      }

      setListings(listingsData);
    } catch (error) {
      console.error("Błąd podczas pobierania ogłoszeń:", error);
      setMessage({
        type: "error",
        text: "Nie udało się pobrać ogłoszeń",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (field === "category") {
      setFormData((prev) => ({
        ...prev,
        subcategory: "",
      }));
    }
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) {
      return;
    }

    const totalFiles = selectedImages.length + files.length;
    if (totalFiles > 10) {
      setMessage({
        type: "error",
        text: `Możesz wybrać maksymalnie 10 zdjęć. Aktualnie masz ${selectedImages.length}, próbujesz dodać ${files.length}`,
      });
      return;
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const invalidFiles = files.filter(
      (file) => !allowedTypes.includes(file.type)
    );

    if (invalidFiles.length > 0) {
      setMessage({
        type: "error",
        text: "Dozwolone są tylko pliki JPG, PNG i WEBP",
      });
      return;
    }

    const oversizedFiles = files.filter((file) => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setMessage({
        type: "error",
        text: `Pliki zbyt duże: ${oversizedFiles
          .map((f) => f.name)
          .join(", ")}. Maksymalny rozmiar to 5MB`,
      });
      return;
    }

    setSelectedImages(prevImages => [...prevImages, ...files]);
    setMessage({ type: "", text: "" });
    e.target.value = '';
  };

  const uploadImages = async (listingId) => {
    if (selectedImages.length === 0) return;

    try {
      setUploadingImages(true);
      const formData = new FormData();

      selectedImages.forEach((image, index) => {
        formData.append(`images[${index}]`, image);
      });

      await api.post(`/contractor/listings/${listingId}/images`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage({
        type: "success",
        text: "Zdjęcia zostały przesłane!",
      });

      setSelectedImages([]);
    } catch (error) {
      console.error("Błąd podczas przesyłania zdjęć:", error);
      setMessage({
        type: "error",
        text: "Nie udało się przesłać zdjęć",
      });
    } finally {
      setUploadingImages(false);
    }
  };

  const fetchCurrentImages = async (listingId) => {
    try {
      const response = await api.get(
        `/contractor/listings/${listingId}/images`
      );
      setCurrentImages(response.data.images || []);
    } catch (error) {
      console.error("Błąd podczas pobierania zdjęć:", error);
    }
  };

  const deleteImage = async (listingId, imageName) => {
    try {
      await api.delete(`/contractor/listings/${listingId}/images/${imageName}`);
      setCurrentImages((prev) =>
        prev.filter((img) => img.filename !== imageName)
      );
      setMessage({
        type: "success",
        text: "Zdjęcie zostało usunięte",
      });
    } catch (error) {
      console.error("Błąd podczas usuwania zdjęcia:", error);
      setMessage({
        type: "error",
        text: "Nie udało się usunąć zdjęcia",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    try {
      let response;
      if (editingListing) {
        response = await api.put(
          `/contractor/listings/${editingListing.id}`,
          formData
        );
        setMessage({
          type: "success",
          text: "Ogłoszenie zostało zaktualizowane!",
        });
      } else {
        response = await api.post("/contractor/listings", formData);
        setMessage({
          type: "success",
          text: "Ogłoszenie zostało dodane!",
        });

        if (selectedImages.length > 0 && response.data?.data?.id) {
          await uploadImages(response.data.data.id);
        }
      }

      resetForm();
      fetchListings();
    } catch (error) {
      console.error("Błąd podczas zapisywania ogłoszenia:", error);
      setMessage({
        type: "error",
        text:
          error.response?.data?.message || "Nie udało się zapisać ogłoszenia",
      });
    }
  };

  const handleEdit = async (listing) => {
    setEditingListing(listing);
    setFormData({
      title: listing.title || "",
      description: listing.description || "",
      long_description: listing.long_description || listing.description || "",
      price: listing.price || "",
      category: listing.category || "",
      subcategory: listing.subcategory || "",
      location: listing.location || "",
      phone: listing.phone || "",
      email: listing.email || "",
      status: listing.status || "active",
    });

    if (listing.id) {
      await fetchCurrentImages(listing.id);
    }

    setShowForm(true);
  };

  const handleDelete = async (listingId) => {
    if (!window.confirm("Czy na pewno chcesz usunąć to ogłoszenie?")) {
      return;
    }

    try {
      await api.delete(`/contractor/listings/${listingId}`);
      setMessage({
        type: "success",
        text: "Ogłoszenie zostało usunięte!",
      });
      fetchListings();
    } catch (error) {
      console.error("Błąd podczas usuwania ogłoszenia:", error);
      setMessage({
        type: "error",
        text: "Nie udało się usunąć ogłoszenia",
      });
    }
  };

  const handleToggleStatus = async (listingId, currentStatus) => {
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active";
      await api.patch(`/contractor/listings/${listingId}/status`, {
        status: newStatus,
      });
      setMessage({
        type: "success",
        text: `Ogłoszenie zostało ${
          newStatus === "active" ? "aktywowane" : "dezaktywowane"
        }!`,
      });
      fetchListings();
    } catch (error) {
      console.error("Błąd podczas zmiany statusu:", error);
      setMessage({
        type: "error",
        text: "Nie udało się zmienić statusu ogłoszenia",
      });
    }
  };

  const handleToggleFeatured = async (listingId, currentFeatured) => {
    try {
      await api.patch(`/contractor/listings/${listingId}/toggle-featured`);
      setMessage({
        type: "success",
        text: `Ogłoszenie zostało ${
          !currentFeatured ? "wyróżnione" : "odznaczone"
        }!`,
      });
      fetchListings();
    } catch (error) {
      console.error("Błąd podczas zmiany wyróżnienia:", error);
      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Nie udało się zmienić wyróżnienia ogłoszenia",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      long_description: "",
      price: "",
      category: "",
      subcategory: "",
      location: userProfile?.city || "",
      phone: userProfile?.phone || "",
      email: userProfile?.email || "",
      status: "active",
    });
    setEditingListing(null);
    setShowForm(false);
    setSelectedImages([]);
    setCurrentImages([]);
  };

  const handleAddNewListing = () => {
    setEditingListing(null);
    setFormData({
      title: "",
      description: "",
      long_description: "",
      price: "",
      category: "",
      subcategory: "",
      location: userProfile?.city || "",
      phone: userProfile?.phone || "",
      email: userProfile?.email || "",
      status: "active",
    });
    setSelectedImages([]);
    setCurrentImages([]);
    setShowForm(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("pl-PL");
  };

  const getStatusDisplayName = (status) => {
    switch (status) {
      case "active":
        return "Aktywna";
      case "inactive":
        return "Nieaktywna";
      case "pending":
        return "Oczekująca";
      default:
        return "Nieznany";
    }
  };

  if (loading) {
    return (
      <div className="contractor-listings-loading">
        <div>Ładowanie ogłoszeń...</div>
      </div>
    );
  }

  return (
    <div className="contractor-listings">
      <div className="contractor-listings-header">
        <h2>Moje Oferty</h2>
        <button
          onClick={handleAddNewListing}
          className="contractor-btn-add"
        >
          + Dodaj nową ofertę
        </button>
      </div>

      {message.text && (
        <div className={`contractor-message ${message.type}`}>
          {message.text}
        </div>
      )}

      {showForm && (
        <div className="contractor-listings-modal">
          <div className="contractor-listings-form">
            <div className="contractor-form-header">
              <h3>{editingListing ? "Edytuj ofertę" : "Dodaj nową ofertę"}</h3>
              <button onClick={resetForm} className="contractor-btn-close">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="contractor-form-row">
                <div className="contractor-form-group">
                  <label>Tytuł oferty *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    required
                    placeholder="np. Profesjonalne sprzątanie biur"
                  />
                </div>

                <div className="contractor-form-group">
                  <label>Cena (zł) *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    required
                    placeholder="200"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="contractor-form-row">
                <div className="contractor-form-group">
                  <label>Kategoria *</label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      handleInputChange("category", e.target.value)
                    }
                    required
                  >
                    <option value="">Wybierz kategorię</option>
                    {Object.keys(categories).map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="contractor-form-group">
                  <label>Podkategoria *</label>
                  <select
                    value={formData.subcategory}
                    onChange={(e) =>
                      handleInputChange("subcategory", e.target.value)
                    }
                    required
                    disabled={!formData.category}
                  >
                    <option value="">Wybierz podkategorię</option>
                    {formData.category &&
                      categories[formData.category]?.map((subcategory) => (
                        <option key={subcategory} value={subcategory}>
                          {subcategory}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="contractor-form-row">
                <div className="contractor-form-group">
                  <label>Lokalizacja *</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      handleInputChange("location", e.target.value)
                    }
                    required
                    placeholder="Warszawa"
                  />
                </div>

                <div className="contractor-form-group">
                  <label>Telefon</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+48 123 456 789"
                  />
                </div>
              </div>

              <div className="contractor-form-group">
                <label>Email kontaktowy</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="kontakt@example.com"
                />
              </div>

              <div className="contractor-form-group">
                <label>Krótki opis oferty *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  required
                  placeholder="Krótki opis usługi..."
                  rows="3"
                />
              </div>

              <div className="contractor-form-group">
                <label>Szczegółowy opis oferty</label>
                <textarea
                  value={formData.long_description}
                  onChange={(e) =>
                    handleInputChange("long_description", e.target.value)
                  }
                  placeholder="Szczegółowy opis świadczonych usług, doświadczenia, certyfikatów..."
                  rows="5"
                />
              </div>

              <div className="contractor-form-group">
                <label>Zdjęcia (maksymalnie 10, do 5MB każde)</label>
                <div className="file-input-wrapper">
                  <input
                    type="file"
                    multiple
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleImageSelect}
                    className="contractor-file-input"
                    id="listing-images"
                  />
                  <label
                    htmlFor="listing-images"
                    className="file-input-label"
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.add("drag-over");
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.remove("drag-over");
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.remove("drag-over");
                      const files = Array.from(e.dataTransfer.files);
                      const event = { target: { files } };
                      handleImageSelect(event);
                    }}
                  >
                    📁 Wybierz zdjęcia lub przeciągnij tutaj
                    <br />
                    <small>Maksymalnie 10 plików, każdy do 5MB</small>
                  </label>
                </div>
                {selectedImages.length > 0 && (
                  <div className="selected-images-preview">
                    <p>Wybrane zdjęcia: {selectedImages.length}</p>
                    <div className="selected-images-list">
                      {selectedImages.map((file, index) => (
                        <div key={index} className="selected-image-item">
                          <span className="selected-image-name">
                            {file.name}
                          </span>
                          <span className="selected-image-size">
                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const newImages = selectedImages.filter(
                                (_, i) => i !== index
                              );
                              setSelectedImages(newImages);
                            }}
                            className="remove-selected-image"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {editingListing && currentImages.length > 0 && (
                <div className="contractor-form-group">
                  <label>Aktualne zdjęcia</label>
                  <div className="current-images-grid">
                    {currentImages.map((image, index) => (
                      <div key={index} className="current-image-item">
                        <img src={image.url} alt={`Zdjęcie ${index + 1}`} />
                        <button
                          type="button"
                          onClick={() =>
                            deleteImage(editingListing.id, image.filename)
                          }
                          className="delete-image-btn"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="contractor-form-group">
                <label className="contractor-checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.status === "active"}
                    onChange={(e) =>
                      handleInputChange(
                        "status",
                        e.target.checked ? "active" : "inactive"
                      )
                    }
                  />
                  <span className="contractor-checkbox-custom"></span>
                  <span className="contractor-checkbox-text">
                    Oferta aktywna
                  </span>
                </label>
              </div>

              <div className="contractor-form-actions">
                <button
                  type="button"
                  onClick={resetForm}
                  className="contractor-btn-cancel"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  className="contractor-btn-save"
                  disabled={uploadingImages}
                >
                  {uploadingImages
                    ? "Przesyłanie..."
                    : editingListing
                    ? "Zaktualizuj"
                    : "Dodaj ofertę"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="contractor-listings-grid">
        {listings.length === 0 ? (
          <div className="contractor-listings-empty">
            <p>Nie masz jeszcze żadnych ofert</p>
            <button
              onClick={handleAddNewListing}
              className="contractor-btn-add"
            >
              Dodaj pierwszą ofertę
            </button>
          </div>
        ) : (
          listings.map((listing) => (
            <div key={listing.id} className="contractor-listing-card">
              <div className="contractor-listing-header">
                <img src={Avatar} alt="Avatar" />
                <div className="contractor-listing-info">
                  <h4>{listing.title}</h4>
                  <p>{listing.description}</p>
                </div>
              </div>

              <div className="contractor-listing-details">
                <div className="contractor-listing-category">
                  {listing.category} - {listing.subcategory}
                </div>
                <div className="contractor-listing-location">
                  📍 {listing.location}
                </div>
                <div className="contractor-listing-price">
                  {listing.price}zł
                </div>
              </div>

              <div className="contractor-listing-meta">
                <span className="contractor-listing-date">
                  Dodano: {formatDate(listing.created_at)}
                </span>
                <div className="contractor-listing-badges">
                  <span
                    className={`contractor-badge ${
                      listing.status === "active" ? "active" : "inactive"
                    }`}
                  >
                    {getStatusDisplayName(listing.status)}
                  </span>
                  {listing.featured && (
                    <span className="contractor-badge featured">
                      Wyróżniona
                    </span>
                  )}
                </div>
              </div>

              <div className="contractor-listing-actions">
                <button
                  onClick={() => handleEdit(listing)}
                  className="contractor-btn-edit"
                >
                  Edytuj
                </button>
                <button
                  onClick={() => handleToggleStatus(listing.id, listing.status)}
                  className={`contractor-btn-toggle ${
                    listing.status === "active" ? "deactivate" : "activate"
                  }`}
                >
                  {listing.status === "active" ? "Dezaktywuj" : "Aktywuj"}
                </button>
                <button
                  onClick={() =>
                    handleToggleFeatured(listing.id, listing.featured)
                  }
                  className={`contractor-btn-featured ${
                    listing.featured ? "remove" : "add"
                  }`}
                >
                  {listing.featured ? "Usuń wyróżnienie" : "Wyróżnij"}
                </button>
                <button
                  onClick={() => handleDelete(listing.id)}
                  className="contractor-btn-delete"
                >
                  Usuń
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ContractorListings;
