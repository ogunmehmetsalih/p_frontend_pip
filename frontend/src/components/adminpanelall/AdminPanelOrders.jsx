import React, { useState, useEffect } from "react";
import { Check, X, Truck, Search } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useNavigate } from "react-router-dom";
const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5001/api/orders", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setOrders(data.data);
        setError(null);
      } catch (error) {
        console.error("Siparişler yüklenirken hata:", error);
        setError(error.message);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = Array.isArray(orders)
    ? orders.filter(
        (order) =>
          String(order.id).toLowerCase().includes(searchTerm.toLowerCase()) ||
          String(order.customer?.name || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      )
    : [];

  const getStatusBadge = (status) => {
    switch (status) {
      case "shipped":
        return (
          <span className="bg-green-100 text-green-800 px-2 py-1 text-xs rounded-full flex items-center">
            <Check size={12} className="mr-1" /> Gönderildi
          </span>
        );
      case "processing":
        return (
          <span className="bg-red-100 text-red-800 px-2 py-1 text-xs rounded-full flex items-center">
            <Truck size={12} className="mr-1" /> Hazırlanıyor
          </span>
        );
      case "cancelled":
        return (
          <span className="bg-red-100 text-red-800 px-2 py-1 text-xs rounded-full flex items-center">
            <X size={12} className="mr-1" /> İptal Edildi
          </span>
        );
      default:
        return (
          <span className="bg-gray-100 text-gray-800 px-2 py-1 text-xs rounded-full">
            {status}
          </span>
        );
    }
  };

  const handleViewDetails = (orderId) => {
    navigate(`/adminpanel/orders/${orderId}`);
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm("Bu siparişi silmek istediğinize emin misiniz?")) {
      try {
        const response = await fetch(
          `http://localhost:5001/api/orders/${orderId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Sipariş silinemedi");
        }

        // Başarılı silme durumunda sipariş listesini güncelle
        setOrders(orders.filter((order) => order.id !== orderId));
      } catch (error) {
        console.error("Sipariş silinirken hata:", error);
        alert("Sipariş silinirken bir hata oluştu");
      }
    }
  };

  if (error) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8 min-h-screen text-center">
          <h1 className="text-3xl font-bold mb-8">Sipariş Yönetimi</h1>
          <div className="text-red-500 mb-4">
            <p className="text-lg">Siparişler yüklenirken hata oluştu:</p>
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
        <h1 className="text-3xl font-bold mb-8">Sipariş Yönetimi</h1>

        {/* Arama Çubuğu */}
        <div className="mb-6 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Sipariş veya müşteri ara..."
            className="pl-10 pr-4 py-2 border rounded-lg w-full max-w-md focus:outline-none focus:ring-2 focus:ring-red-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {filteredOrders.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                {searchTerm
                  ? "Aramanızla eşleşen sipariş bulunamadı"
                  : "Henüz sipariş bulunmamaktadır"}
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sipariş No
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Müşteri
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tarih
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ürün Sayısı
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Toplam
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Durum
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.user?.name || "Bilinmiyor"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString(
                              "tr-TR"
                            )
                          : "Tarih Yok"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {Array.isArray(order.orderItems)
                          ? order.orderItems.reduce(
                              (total, item) => total + (item.quantity || 0),
                              0
                            )
                          : 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.totalAmount
                          ? Number(order.totalAmount).toFixed(2)
                          : Array.isArray(order.orderItems)
                          ? order.orderItems
                              .reduce(
                                (sum, item) =>
                                  sum +
                                  Number(item.price) * (item.quantity || 0),
                                0
                              )
                              .toFixed(2)
                          : "0.00"}{" "}
                        TL
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleViewDetails(order.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Detay
                        </button>
                        <button
                          onClick={() => handleDeleteOrder(order.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Sil
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default AdminOrders;
