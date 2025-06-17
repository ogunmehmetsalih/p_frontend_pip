import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import Navbar from "./Navbar";
import Footer from "./Footer";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, addToCart } = useContext(AuthContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:5001/api/products/${id}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setProduct(data);
        setError(null);

        // Fetch related products
        if (data.category) {
          const categoryId =
            typeof data.category === "string"
              ? data.category
              : data.category.id;
          const relatedResponse = await fetch(
            `http://localhost:5001/api/products?category=${categoryId}&limit=4`
          );
          if (relatedResponse.ok) {
            const relatedData = await relatedResponse.json();
            setRelatedProducts(relatedData.filter((p) => p.id !== data.id));
          }
        }
      } catch (err) {
        console.error("Error loading product:", err);
        setError(err.message);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    addToCart(product, selectedQuantity);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500"></div>
        <p className="mt-2 text-lg">Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-lg text-red-500">Error loading product: {error}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-lg text-gray-600">Product not found.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Image */}
          <div className="bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={
                product.imageUrl || product.image || "/images/placeholder.png"
              }
              alt={product.name}
              className="w-full h-full object-cover max-h-[500px]"
              onError={(e) => {
                e.target.src = "/images/placeholder.png";
              }}
            />
          </div>

          {/* Product Info */}
          <div className="space-y-4">
            <h1 className="text-2xl font-bold">{product.name}</h1>

            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm inline-block">
              {typeof product.brand === "string"
                ? product.brand
                : product.brand?.name || "BRAND"}
            </span>

            <p className="text-gray-500">
              {typeof product.category === "string"
                ? product.category.charAt(0).toUpperCase() +
                  product.category.slice(1)
                : product.category?.name?.charAt(0).toUpperCase() +
                    product.category?.name?.slice(1) || "Category"}
            </p>

            <div className="text-2xl font-bold text-red-600">
              {Number(product.price || 0).toFixed(2)} TL
            </div>

            {product.description && (
              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold">Tanım</h3>
                <p>{product.description}</p>
              </div>
            )}

            <div className="pt-4 flex flex-col md:flex-row md:items-center gap-4">
              <input
                type="number"
                min="1"
                max={product.stock || 99}
                value={selectedQuantity}
                onChange={(e) => setSelectedQuantity(Number(e.target.value))}
                className="w-24 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                style={{ maxWidth: "100px" }}
              />
              <button
                onClick={handleAddToCart}
                className="w-full md:w-auto px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                Sepete Ekle
              </button>
            </div>

            {product.specifications && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Specifications</h3>
                <ul className="space-y-2">
                  {Object.entries(product.specifications).map(
                    ([key, value]) => (
                      <li
                        key={key}
                        className="flex border-b border-gray-100 py-2"
                      >
                        <span className="text-gray-600 w-1/3">{key}</span>
                        <span className="w-2/3">{value}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  to={`/products/${relatedProduct.id}`}
                  key={relatedProduct.id}
                  className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow block"
                >
                  <div className="h-48 bg-gray-100 overflow-hidden">
                    <img
                      src={relatedProduct.image || "/images/placeholder.png"}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold">{relatedProduct.name}</h3>
                    <p className="text-red-600 font-bold mt-2">
                      {Number(relatedProduct.price || 0).toFixed(2)} TL
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default ProductDetail;
