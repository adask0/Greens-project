import React, { useState, useRef, useEffect } from "react";
import "../styles/search.css";

const cities = [
  "Warszawa",
  "Kraków",
  "Łódź",
  "Wrocław",
  "Poznań",
  "Gdańsk",
  "Szczecin",
  "Bydgoszcz",
  "Lublin",
  "Katowice",
  "Białystok",
  "Gorzów Wielkopolski",
  "Olsztyn",
  "Rzeszów",
  "Opole",
  "Kielce",
  "Zielona Góra",
  "Torun",
];

const SelectWithSearch = ({ value, onChange }) => {
  const [inputValue, setInputValue] = useState(value || "");
  const [showOptions, setShowOptions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const wrapperRef = useRef(null);

  const filteredOptions = cities.filter((city) =>
    city.toLowerCase().startsWith(inputValue.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowOptions(false);
        setHighlightedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (city) => {
    setInputValue(city);
    setShowOptions(false);
    setHighlightedIndex(-1);
    onChange(city);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setShowOptions(true);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!showOptions) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < filteredOptions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredOptions.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
        handleSelect(filteredOptions[highlightedIndex]);
      }
    } else if (e.key === "Escape") {
      setShowOptions(false);
      setHighlightedIndex(-1);
    }
  };

  const toggleOptions = () => {
    setShowOptions((prev) => !prev);
    setHighlightedIndex(-1);
  };

  return (
    <div
      className="select-with-search"
      ref={wrapperRef}
      style={{ position: "relative", display: "inline-block", width: "250px" }}
    >
      <input
        type="text"
        placeholder="Wybierz miasto"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => setShowOptions(true)}
        onKeyDown={handleKeyDown}
        className="search-location-input"
        autoComplete="off"
        style={{ paddingRight: "30px", width: "100%", boxSizing: "border-box" }}
      />
      <svg
        onClick={toggleOptions}
        className="search-dropdown-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#666"
        strokeWidth="2"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>

      {showOptions && (
        <ul
          className="options-list"
          style={{
            position: "absolute",
            zIndex: 1000,
            width: "100%",
            maxHeight: "150px",
            overflowY: "auto",
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            marginTop: "2px",
            borderRadius: "4px",
            padding: 0,
            listStyle: "none",
          }}
        >
          {filteredOptions.length === 0 && (
            <li
              className="no-options"
              style={{ padding: "8px", color: "#999", userSelect: "none" }}
            >
              Brak wyników
            </li>
          )}
          {filteredOptions.map((city, index) => (
            <li
              key={city}
              onMouseDown={() => handleSelect(city)}
              className={`option-item ${
                index === highlightedIndex ? "highlighted" : ""
              }`}
              style={{
                padding: "8px",
                backgroundColor:
                  index === highlightedIndex ? "#bde4ff" : "transparent",
                cursor: "pointer",
                userSelect: "none",
              }}
            >
              {city}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SelectWithSearch;
