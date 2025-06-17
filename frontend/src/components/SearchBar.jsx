import React, { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom"; // veya next/router

const SearchBar = ({ isVisible, onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener("mousedown", handleClickOutside);
      searchRef.current?.querySelector("input")?.focus();
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isVisible, onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Arama terimini URL'e ekleyerek search sayfasına yönlendir
      navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
      onClose();
      setSearchTerm(""); // Arama çubuğunu temizle
    }
  };

  if (!isVisible) return null;

  return (
    <div
      ref={searchRef}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Ürün Ara</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Aramayı kapat"
          >
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex">
          <div className="relative flex-grow">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-4 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Aramak istediğiniz ürün..."
              autoFocus
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-600"
            >
              <Search size={24} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchBar;
