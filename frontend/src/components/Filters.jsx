import { useState } from "react";

const FilterDropdown = ({ label, options, selected, setSelected }) => {
  return (
    <div className="relative min-w-[180px]">
      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 w-full focus:outline-none focus:ring-2 focus:ring--500 focus:border-red-500"
      >
        <option value="">{label} Seçin</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <svg
          className="fill-current h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  );
};

const Filters = ({
  selectedCategory,
  setSelectedCategory,
  selectedBrand,
  setSelectedBrand,
  selectedPrice,
  setSelectedPrice,
  selectedSort,
  setSelectedSort,
  onResetFilters,
}) => {
  // Filtre seçenekleri
  const categories = [
    { value: "tum-kategoriler", label: "Tüm Kategoriler" },
    { value: "kazaklar", label: "Kazaklar" },
    { value: "tisortler", label: "Tişörtler" },
    { value: "ayakkabilar", label: "Ayakkabılar" },
    { value: "pantolonlar", label: "Pantolonlar" },
    { value: "gomlekler", label: "Gömlekler" },
    { value: "aksesuarlar", label: "Aksesuarlar" },
  ];

  const brands = [
    { value: "tum", label: "Tüm Markalar" },
    { value: "nike", label: "Nike" },
    { value: "adidas", label: "Adidas" },
    { value: "zara", label: "Zara" },
    { value: "lcw", label: "LC Waikiki" },
    { value: "hm", label: "H&M" },
  ];

  const priceRanges = [
    { value: "tum", label: "Tüm Fiyatlar" },
    { value: "0-100", label: "0 - 100 TL" },
    { value: "100-250", label: "100 - 250 TL" },
    { value: "250-500", label: "250 - 500 TL" },
    { value: "500-1000", label: "500 - 1000 TL" },
    { value: "1000+", label: "1000 TL üzeri" },
  ];

  // Sıralama seçenekleri
  const sortOptions = [
    { value: "default", label: "Varsayılan" },
    { value: "price-asc", label: "Fiyat: Düşükten Yükseğe" },
    { value: "price-desc", label: "Fiyat: Yüksekten Düşüğe" },
    { value: "name-asc", label: "İsme Göre (A-Z)" },
    { value: "name-desc", label: "İsme Göre (Z-A)" },
    { value: "newest", label: "En Yeniler" },
    { value: "oldest", label: "En Eskiler" },
  ];

  return (
    <div className="mb-8 bg-gray-50 p-4 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Filtrele</h2>
      <div className="flex flex-wrap gap-4">
        <FilterDropdown
          label="Kategori"
          options={categories}
          selected={selectedCategory}
          setSelected={setSelectedCategory}
        />

        <FilterDropdown
          label="Marka"
          options={brands}
          selected={selectedBrand}
          setSelected={setSelectedBrand}
        />

        <FilterDropdown
          label="Fiyat Aralığı"
          options={priceRanges}
          selected={selectedPrice}
          setSelected={setSelectedPrice}
        />

        <FilterDropdown
          label="Sırala"
          options={sortOptions}
          selected={selectedSort}
          setSelected={setSelectedSort}
        />

        <button
          onClick={onResetFilters}
          className="px-4 py-2 bg-white border border-red-500 text-red-600 hover:bg-red-50 rounded-md font-medium transition-colors"
        >
          Filtreleri Temizle
        </button>
      </div>
    </div>
  );
};

export default Filters;
