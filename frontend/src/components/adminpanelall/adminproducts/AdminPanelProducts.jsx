import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Edit, Trash2, Plus } from "lucide-react";
import Navbar from "../../Navbar";
import Footer from "../../Footer";
import AdminAddProduct from "./AdminPanelAddProduct";
import ProductEditForm from "./AdminPanelEditProduct";
import ProductDeleteConfirmation from "./AdminProductDeleteConfirmation";
const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null); // Yeni state

  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5001/api/products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setProducts(data);
      setError(null);
    } catch (error) {
      console.error("Ürünler yüklenirken hata:", error);
      setError(error.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Ürünleri API'dan çek
  useEffect(() => {
    fetchProducts();
  }, []);

  // Ürün silme işlemi
  const handleDelete = async (productId) => {
    console.log("Silme işlemi başlatılıyor, ürün ID:", productId);
    try {
      const response = await fetch(
        `http://localhost:5001/api/products/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Silme isteği gönderildi, yanıt durumu:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Sunucu hatası:", response.status, errorText);
        if (errorText.includes("Cannot delete product with active orders")) {
          alert(
            "Bu ürün aktif siparişlerde bulunduğu için devre dışı bırakılamadı."
          );
        } else {
          alert(`Ürün devre dışı bırakılırken bir hata oluştu: ${errorText}`);
        }
        throw new Error(`Ürün devre dışı bırakılamadı. Hata: ${errorText}`);
      }

      console.log("Ürün başarıyla silindi");
      fetchProducts();
      setProducts(
        products.map((p) =>
          p.id === productId ? { ...p, isActive: false } : p
        )
      );
      setDeletingProduct(null);
    } catch (error) {
      console.error("Ürün devre dışı bırakılırken hata:", error);
      alert("Ürün devre dışı bırakılırken bir hata oluştu");
    } finally {
      console.log("Silme işlemi tamamlandı (başarılı veya başarısız).");
    }
  };

  // Yeni ürün ekleme başarılı olduğunda
  const handleAddSuccess = (newProduct) => {
    setProducts([...products, newProduct]);
    setShowAddForm(false);
    navigate("/adminpanel/products");
  };
  const handleUpdateSuccess = (updatedProduct) => {
    setProducts(
      products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    setEditingProduct(null);
  };

  // Hata durumu
  if (error) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8 min-h-screen text-center">
          <h1 className="text-3xl font-bold mb-8">Ürün Yönetimi</h1>
          <div className="text-red-500 mb-4">
            <p className="text-lg">Ürünler yüklenirken hata oluştu:</p>
            <p className="text-sm">{error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Yeniden Dene
          </button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 min-h-screen">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Ürün Yönetimi</h1>
          {!showAddForm && !editingProduct && !deletingProduct && (
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              <Plus size={18} className="mr-2" />
              Yeni Ürün Ekle
            </button>
          )}
        </div>

        {showAddForm ? (
          <AdminAddProduct
            onCancel={() => setShowAddForm(false)}
            onSaveSuccess={handleAddSuccess}
          />
        ) : editingProduct ? (
          <ProductEditForm
            product={editingProduct}
            onCancel={() => setEditingProduct(null)}
            onSaveSuccess={handleUpdateSuccess}
          />
        ) : deletingProduct ? (
          <ProductDeleteConfirmation
            product={deletingProduct}
            onCancel={() => setDeletingProduct(null)}
            onConfirm={() => handleDelete(deletingProduct.id)}
          />
        ) : (
          <>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                {products.length === 0 ? (
                  <div className="p-6 text-center">
                    <p className="text-gray-500 mb-4">
                      Henüz ürün bulunmamaktadır
                    </p>
                    <button
                      onClick={() => setShowAddForm(true)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                    >
                      Yeni Ürün Ekle
                    </button>
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ürün Adı
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Kategori
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fiyat
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Stok
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          İşlemler
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {products.map((product) => (
                        <tr key={product.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {product.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product.category?.name ||
                              product.category ||
                              "Belirtilmemiş"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {Number(product.price || 0).toFixed(2)} TL
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product.stock || 0}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => setEditingProduct(product)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Edit size={18} />
                              </button>
                              <button
                                onClick={() => setDeletingProduct(product)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default AdminProducts;
