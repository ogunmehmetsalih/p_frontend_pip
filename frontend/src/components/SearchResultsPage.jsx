import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const SearchResultsPage = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // URL'den arama terimini al
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get("query") || "";
    setSearchQuery(query);

    if (query) {
      fetchSearchResults(query);
    } else {
      setIsLoading(false);
    }
  }, [location]);

  // Örnek API isteği (gerçek projede backend API'si kullanılmalı)
  const fetchSearchResults = async (query) => {
    setIsLoading(true);
    try {
      // Burada gerçek bir API çağrısı yapılacak
      // Örnek olarak:
      // const response = await fetch(`/api/search?q=${query}`);
      // const data = await response.json();

      // Mock data ile simüle ediyoruz
      const mockResults = [
        { id: 1, name: `${query} Ürünü 1`, price: 99.99 },
        { id: 2, name: `${query} Ürünü 2`, price: 149.99 },
      ];

      setSearchResults(mockResults);
    } catch (error) {
      console.error("Arama hatası:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 min-h-screen">
        <h1 className="text-2xl font-bold mb-6">
          Arama Sonuçları: "{searchQuery}"
        </h1>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
          </div>
        ) : searchResults.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map((product) => (
              <div
                key={product.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <h3 className="font-bold text-lg">{product.name}</h3>
                <p className="text-red-600 font-semibold">
                  {product.price.toFixed(2)} TL
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">
              "{searchQuery}" ile ilgili sonuç bulunamadı
            </p>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default SearchResultsPage;
