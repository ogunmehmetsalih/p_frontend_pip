import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { AuthContext } from "./AuthContext";

const PreOrders = () => {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Backend'den sipariş verilerini çek
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("http://localhost:5001/api/orders", {
          headers: {
            Authorization: `Bearer ${token || localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Siparişler alınamadı: ${response.status}`);
        }

        const data = await response.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Siparişler yüklenirken hata oluştu:", err);
        setError(err.message);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  // Sipariş detay sayfasına yönlendirme
  const handleViewDetails = (orderId) => {
    navigate(`/orders/${orderId}`);
  };

  // Format date helper
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("tr-TR", options);
  };

  // Loading state
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8 min-h-screen text-center">
          <h1 className="text-3xl font-bold mb-8">Geçmiş Siparişlerim</h1>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
          </div>
          <p className="text-lg mt-4">Siparişleriniz yükleniyor...</p>
        </div>
        <Footer />
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8 min-h-screen text-center">
          <h1 className="text-3xl font-bold mb-8">Geçmiş Siparişlerim</h1>
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 max-w-md mx-auto">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  Siparişler yüklenirken hata oluştu: {error}
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            Yeniden Dene
          </button>
        </div>
        <Footer />
      </>
    );
  }

  // Empty state
  if (orders.length === 0 && !loading && !error) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8 min-h-screen">
          <h1 className="text-3xl font-bold mb-8">Geçmiş Siparişlerim</h1>
          <div className="text-center py-12">
            <svg
              className="mx-auto h-16 w-16 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              Henüz siparişiniz bulunmamaktadır
            </h3>
            <p className="mt-1 text-sm text-gray-500 mb-6">
              Alışverişe başlayarak ilk siparişinizi oluşturabilirsiniz.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <svg
                className="-ml-1 mr-2 h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              Alışverişe Başla
            </Link>
          </div>
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
          <h1 className="text-3xl font-bold">Geçmiş Siparişlerim</h1>
          <Link
            to="/products"
            className="text-sm font-medium text-red-600 hover:text-red-500"
          >
            Yeni Alışveriş Yap &rarr;
          </Link>
        </div>

        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg shadow overflow-hidden"
            >
              <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
                  <div className="mb-2 sm:mb-0">
                    <h2 className="text-lg font-semibold">
                      Sipariş #{order.id}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {formatDate(order.date)}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : order.status === "processing"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {order.status === "completed"
                        ? "Tamamlandı"
                        : order.status === "processing"
                        ? "Hazırlanıyor"
                        : "Beklemede"}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h3 className="sr-only">Ürünler</h3>
                  <ul className="divide-y divide-gray-200">
                    {order.items.map((item, idx) => (
                      <li key={idx} className="py-4 flex">
                        <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-md overflow-hidden">
                          {item.imageUrl && (
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="ml-4 flex-1 flex flex-col sm:flex-row justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">
                              {item.name}
                            </h4>
                            <p className="mt-1 text-sm text-gray-500">
                              Adet: {item.quantity}
                            </p>
                          </div>
                          <div className="mt-2 sm:mt-0">
                            <p className="text-sm font-medium text-gray-900">
                              {(item.price * item.quantity).toFixed(2)} TL
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-gray-200 pt-4 mt-4 flex justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Toplam Ürün:</p>
                    <p className="text-sm text-gray-500">Kargo Ücreti:</p>
                    <p className="text-lg font-medium mt-2">Genel Toplam:</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-900">
                      {order.total.subtotal.toFixed(2)} TL
                    </p>
                    <p className="text-sm text-gray-900">
                      {order.total.shippingFee.toFixed(2)} TL
                    </p>
                    <p className="text-lg font-medium text-red-600 mt-2">
                      {order.total.total.toFixed(2)} TL
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => handleViewDetails(order.id)}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Detayları Görüntüle
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PreOrders;
