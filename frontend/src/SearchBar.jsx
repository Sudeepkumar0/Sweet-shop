import React, { useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <input
      type="text"
      value={query}
      onChange={handleChange}
      placeholder="Search sweets..."
      style={{
        padding: "8px 12px",
        borderRadius: "20px",
        border: "1px solid #ccc",
        outline: "none",
        width: "100%",
        boxSizing: "border-box",
        marginBottom: "16px",
        transition: "border-color 0.2s",
      }}
      onFocus={(e) => (e.target.style.borderColor = "#007bff")}
      onBlur={(e) => (e.target.style.borderColor = "#ccc")}
    />
  );
};

export default SearchBar;
