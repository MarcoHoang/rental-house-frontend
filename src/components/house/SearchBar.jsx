// src/components/house/SearchBar.jsx
import React, { useState } from "react";
import styles from "./SearchBar.module.css"; // Import CSS Modules

const SearchBar = () => {
  // Logic giữ nguyên
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (query.trim()) {
      alert(`Đang tìm kiếm với từ khóa: "${query}"`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className={styles.searchWrapper}>
      <input
        type="text"
        placeholder="Tìm kiếm theo địa điểm, quận, tên đường..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={handleKeyPress}
        className={styles.searchInput}
      />
      <button onClick={handleSearch} className={styles.searchButton}>
        Tìm kiếm
      </button>
    </div>
  );
};

export default SearchBar;
