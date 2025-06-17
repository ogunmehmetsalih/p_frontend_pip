import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import Filters from "./Filters";
import { Edit, Trash2, MoreVertical } from "lucide-react";
import ProductEditForm from "./adminpanelall/adminproducts/AdminPanelEditProduct";

const ProductsSection = () => {
  // State management
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");
  const [selectedSort, setSelectedSort] = useState("default");
  const [editingProductId, setEditingProductId] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  const { isLoggedIn, addToCart, user, token } = useContext(AuthContext);
  const navigate = useNavigate();

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5001/api/products");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setProducts(data);
        setError(null);
      } catch (err) {
        console.error("Error loading products:", err);
        setError(err.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle product update success
  const handleUpdateSuccess = (updatedProduct) => {
    setProducts(
      products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    setEditingProduct(null);
  };

  // Sorting function
  const sortProducts = (productsToSort) => {
    const sortedProducts = [...productsToSort];

    switch (selectedSort) {
      case "price-asc":
        return sortedProducts.sort((a, b) => a.price - b.price);
      case "price-desc":
        return sortedProducts.sort((a, b) => b.price - a.price);
      case "name-asc":
        return sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
      case "newest":
        return sortedProducts.sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );
      case "oldest":
        return sortedProducts.sort(
          (a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
        );
      default:
        return sortedProducts;
    }
  };

  // Filter products based on selected filters
  const getFilteredProducts = () => {
    const filtered = products.filter((product) => {
      const categorySlug =
        product.category?.slug ||
        (typeof product.category === "string"
          ? product.category.toLowerCase()
          : "");

      const categoryMatch =
        !selectedCategory ||
        selectedCategory === "all-categories" ||
        categorySlug === selectedCategory;

      const brandSlug =
        product.brand?.slug ||
        (typeof product.brand === "string" ? product.brand.toLowerCase() : "");

      const brandMatch =
        !selectedBrand ||
        selectedBrand === "all" ||
        brandSlug === selectedBrand;

      let priceMatch = true;
      if (selectedPrice && selectedPrice !== "all") {
        const priceValue = parseFloat(product.price);
        const [min, max] = selectedPrice.split("-");
        priceMatch = max
          ? priceValue >= Number(min) && priceValue <= Number(max)
          : priceValue >= Number(min.replace("+", ""));
      }

      return categoryMatch && brandMatch && priceMatch;
    });

    return sortProducts(filtered);
  };

  // Pagination logic
  const itemsPerPage = 6;
  const filteredProducts = getFilteredProducts();
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const getCurrentProducts = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleResetFilters = () => {
    setSelectedCategory("");
    setSelectedBrand("");
    setSelectedPrice("");
    setSelectedSort("default");
    setCurrentPage(1);
  };

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    addToCart(product);
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await fetch(
          `http://localhost:5001/api/products/${productId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete product");
        }

        setProducts(products.filter((product) => product.id !== productId));
      } catch (err) {
        console.error("Error deleting product:", err);
        alert("Error deleting product");
      }
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex justify-center mt-8 space-x-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-red-50"
        >
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-4 py-2 border rounded ${
              currentPage === page ? "bg-red-500 text-white" : "hover:bg-red-50"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-red-50"
        >
          Next
        </button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500"></div>
        <p className="mt-2 text-lg">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-lg text-red-500">Error loading products: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (editingProduct) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ProductEditForm
          product={editingProduct}
          onCancel={() => setEditingProduct(null)}
          onSaveSuccess={handleUpdateSuccess}
        />
      </div>
    );
  }

  if (filteredProducts.length === 0 && !loading && !error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Filters
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedBrand={selectedBrand}
          setSelectedBrand={setSelectedBrand}
          selectedPrice={selectedPrice}
          setSelectedPrice={setSelectedPrice}
          selectedSort={selectedSort}
          setSelectedSort={setSelectedSort}
          onResetFilters={handleResetFilters}
        />
        <div className="text-center py-12">
          <p className="text-lg text-gray-600">
            No products match your filters.
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Reset Filters
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Filters
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedBrand={selectedBrand}
        setSelectedBrand={setSelectedBrand}
        selectedPrice={selectedPrice}
        setSelectedPrice={setSelectedPrice}
        selectedSort={selectedSort}
        setSelectedSort={setSelectedSort}
        onResetFilters={handleResetFilters}
      />

      <div className="mb-4">
        <p className="text-gray-600">{filteredProducts.length} ürün bulundu</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {getCurrentProducts().map((product) => (
          <Link
            to={`/products/${product.id}`}
            key={product.id}
            className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow relative block"
          >
            {user?.isAdmin && (
              <div className="absolute top-2 right-2 z-10">
                <div className="dropdown relative">
                  <button
                    className="p-1 bg-white rounded-full shadow hover:bg-gray-100"
                    onClick={(e) => {
                      e.preventDefault();
                      setEditingProductId(
                        editingProductId === product.id ? null : product.id
                      );
                    }}
                  >
                    <MoreVertical size={18} />
                  </button>

                  {editingProductId === product.id && (
                    <div
                      className="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-100"
                      onMouseLeave={() => setEditingProductId(null)}
                    >
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setEditingProduct(product);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 flex items-center"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleDeleteProduct(product.id);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 flex items-center"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="h-64 bg-gray-100 overflow-hidden">
              <img
                src={
                  product.imageUrl || product.image || "/images/placeholder.png"
                }
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "/images/placeholder.png";
                }}
              />
            </div>

            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg">{product.name}</h3>
                <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                  {typeof product.brand === "string"
                    ? product.brand
                    : product.brand?.name || "BRAND"}
                </span>
              </div>

              <p className="text-gray-500 text-sm mb-3">
                {typeof product.category === "string"
                  ? product.category.charAt(0).toUpperCase() +
                    product.category.slice(1)
                  : product.category?.name?.charAt(0).toUpperCase() +
                      product.category?.name?.slice(1) || "Category"}
              </p>

              <div className="flex justify-between items-center">
                <span className="text-red-600 font-bold">
                  {Number(product.price || 0).toFixed(2)} TL
                </span>
                <button
                  onClick={(e) => handleAddToCart(e, product)}
                  className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded transition-colors"
                >
                  Sepete Ekle
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {renderPagination()}
    </div>
  );
};

export default ProductsSection;
