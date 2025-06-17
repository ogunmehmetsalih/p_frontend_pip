import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Check, MapPin, CreditCard, User, Truck, X } from "lucide-react";
import { AuthContext } from "../AuthContext";

const AdminOrderDetail = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("processing");
  const [isUpdating, setIsUpdating] = useState(false);
  const [notes, setNotes] = useState("");
  const [subtotal, setSubtotal] = useState(0);
  const [shippingFee, setShippingFee] = useState(0);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState(null);
  const { token } = useContext(AuthContext);

  console.log("The token we use:", token);

  // Veri parse ve kontrol fonksiyonu
  const parseOrderData = (responseData) => {
    try {
      // API response'dan data object'ini al
      const orderData = responseData.data || responseData;

      // ShippingAddress'i parse et
      let shippingAddress = {};
      if (orderData.shippingAddress) {
        if (typeof orderData.shippingAddress === "string") {
          shippingAddress = JSON.parse(orderData.shippingAddress);
        } else {
          shippingAddress = orderData.shippingAddress;
        }
      }

      // User bilgilerini kontrol et
      const user = orderData.user || {};

      // Order items'ları kontrol et
      const orderItems = orderData.orderItems || [];

      // Status'u frontend için dönüştür (delivered -> completed)
      let displayStatus = orderData.status;
      if (orderData.status === "delivered") {
        displayStatus = "completed";
      }

      return {
        ...orderData,
        shippingAddress,
        user,
        orderItems,
        status: displayStatus,
      };
    } catch (error) {
      console.error("Veri parse edilirken hata:", error);
      return {
        // ...orderData,
        // shippingAddress: {},
        // user: {},
        // orderItems: [],
        // status: orderData.status || 'processing'
      };
    }
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setIsUpdating(true);

        const response = await fetch(
          `http://localhost:5001/api/orders/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Sipariş detayları yüklenemedi");
        }

        const responseData = await response.json();
        console.log("Fetched Order (Raw):", responseData);

        // Veriyi parse et ve kontrol et
        const parsedOrder = parseOrderData(responseData);
        console.log("Parsed Order:", parsedOrder);

        setOrder(parsedOrder);
        setStatus(parsedOrder.status || "processing");
        setNotes(parsedOrder.notes || "");

        // Subtotal ve toplam hesapla - totalAmount varsa onu kullan
        if (parsedOrder.totalAmount) {
          const totalFromAPI = parseFloat(parsedOrder.totalAmount);
          setTotal(totalFromAPI);
          // Kargo ücreti varsayılan 20 TL, subtotal = total - kargo
          setShippingFee(20.0);
          setSubtotal(totalFromAPI - 20.0);
        } else {
          // orderItems'lardan hesapla
          const orderItems = parsedOrder.orderItems || [];
          const sub = orderItems.reduce((sum, item) => {
            const price = parseFloat(item.price) || 0;
            const quantity = parseInt(item.quantity) || 0;
            return sum + price * quantity;
          }, 0);

          setSubtotal(sub);
          setShippingFee(20.0);
          setTotal(sub + 20.0);
        }
      } catch (error) {
        console.error("Sipariş detayları yüklenirken hata:", error);
        setError(error.message);
      } finally {
        setIsUpdating(false);
      }
    };

    if (orderId && token) {
      fetchOrder();
    }
  }, [orderId, token]);

  const handleStatusChange = async (newStatus) => {
    setIsUpdating(true);
    try {
      // Frontend'deki completed'ı backend'deki delivered'a dönüştür
      const backendStatus = newStatus === "completed" ? "delivered" : newStatus;

      const response = await fetch(
        `http://localhost:5001/api/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: backendStatus }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Durum güncelleme hatası:", errorText);
        throw new Error(`Durum güncellenemedi: ${errorText}`);
      }

      const updatedResponseData = await response.json();
      const parsedUpdatedOrder = parseOrderData(updatedResponseData);

      setOrder(parsedUpdatedOrder);
      setStatus(parsedUpdatedOrder.status);
    } catch (error) {
      console.error("Durum güncellenirken hata:", error);
      alert(`Durum güncellenirken bir hata oluştu: ${error.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveNotes = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch(
        `http://localhost:5001/api/orders/${orderId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ notes }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Not güncelleme hatası:", errorText);
        throw new Error(`Not kaydedilemedi: ${errorText}`);
      }

      const updatedResponseData = await response.json();
      const parsedUpdatedOrder = parseOrderData(updatedResponseData);

      setOrder(parsedUpdatedOrder);
    } catch (error) {
      console.error("Not kaydedilirken hata:", error);
      alert(`Not kaydedilirken bir hata oluştu: ${error.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  // Güvenli şekilde shippingAddress'e erişim
  const getShippingAddress = () => {
    if (!order?.shippingAddress) return {};
    return order.shippingAddress;
  };

  const shippingAddress = getShippingAddress();

  // Yerel getStatusBadge fonksiyonu
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
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
      case "completed":
      case "delivered":
        return (
          <span className="bg-blue-100 text-blue-800 px-2 py-1 text-xs rounded-full flex items-center">
            <Check size={12} className="mr-1" /> Tamamlandı
          </span>
        );
      default:
        return (
          <span className="bg-gray-100 text-gray-800 px-2 py-1 text-xs rounded-full">
            {status || "Bilinmiyor"}
          </span>
        );
    }
  };

  if (error) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8 min-h-screen">
          <div className="text-red-500 text-center">
            <h2 className="text-xl font-bold mb-2">Hata Oluştu</h2>
            <p>{error}</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!order) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8 min-h-screen">
          <div className="text-gray-500 text-center">
            <h2 className="text-xl font-bold mb-2">Yükleniyor...</h2>
            <p>Sipariş detayları getiriliyor.</p>
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Sipariş Detayları</h1>
          <div className="flex items-center space-x-4">
            {getStatusBadge(order.status)}
            <select
              value={status}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={isUpdating}
              className="border rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
            >
              <option value="processing">Hazırlanıyor</option>
              <option value="shipped">Kargoya Verildi</option>
              <option value="completed">Tamamlandı</option>
              <option value="cancelled">İptal Edildi</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">
              Sipariş #{order.orderNumber || order.id}
            </h2>
            <p className="text-gray-500">
              Sipariş Tarihi:{" "}
              {order.createdAt
                ? new Date(order.createdAt).toLocaleDateString("tr-TR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Tarih belirtilmemiş"}
            </p>
          </div>

          <div className="p-6">
            <h3 className="font-semibold mb-3">Ürünler</h3>
            {!order.orderItems || order.orderItems.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-2">
                  Bu siparişte ürün detayları bulunamadı.
                </p>
                <p className="text-sm text-gray-400">
                  Toplam Tutar:{" "}
                  {order.totalAmount
                    ? parseFloat(order.totalAmount).toFixed(2)
                    : "0.00"}{" "}
                  TL
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {order.orderItems.map((item, index) => {
                  const price = parseFloat(item.price) || 0;
                  const quantity = parseInt(item.quantity) || 0;
                  return (
                    <div
                      key={item.id || index}
                      className="py-4 flex justify-between"
                    >
                      <div>
                        <h4 className="font-medium">
                          {item.product?.name || item.name || "Ürün adı yok"}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {quantity} adet × {price.toFixed(2)} TL
                        </p>
                      </div>
                      <span className="font-semibold">
                        {(price * quantity).toFixed(2)} TL
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="p-6 bg-gray-50 border-t">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Ara Toplam:</span>
              <span>{subtotal.toFixed(2)} TL</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Kargo:</span>
              <span>{shippingFee.toFixed(2)} TL</span>
            </div>
            <div className="flex justify-between font-semibold text-lg pt-2 border-t">
              <span>Toplam:</span>
              <span className="text-red-600">{total.toFixed(2)} TL</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold flex items-center mb-4">
              <User className="mr-2 text-red-500" />
              Müşteri Bilgileri
            </h2>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Ad:</span>{" "}
                {order.user?.name || "Belirtilmemiş"}
              </p>
              <p>
                <span className="font-medium">Email:</span>{" "}
                {order.user?.email || "Belirtilmemiş"}
              </p>
              <p>
                <span className="font-medium">Müşteri ID:</span>{" "}
                {order.user?.id || order.userId || "Belirtilmemiş"}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold flex items-center mb-4">
              <MapPin className="mr-2 text-red-500" />
              Teslimat Adresi
            </h2>
            <address className="not-italic space-y-2">
              <p>
                {shippingAddress.street ||
                  shippingAddress.address ||
                  "Adres belirtilmemiş"}
              </p>
              <p>
                {shippingAddress.district || "İlçe belirtilmemiş"} /{" "}
                {shippingAddress.city || "Şehir belirtilmemiş"}
              </p>
              <p>{shippingAddress.country || "Ülke belirtilmemiş"}</p>
              <p>Posta Kodu: {shippingAddress.postalCode || "Belirtilmemiş"}</p>
              {shippingAddress.fullName && (
                <p>
                  <span className="font-medium">Alıcı:</span>{" "}
                  {shippingAddress.fullName}
                </p>
              )}
              {shippingAddress.phone && (
                <p>
                  <span className="font-medium">Telefon:</span>{" "}
                  {shippingAddress.phone}
                </p>
              )}
            </address>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold flex items-center mb-4">
              <CreditCard className="mr-2 text-red-500" />
              Ödeme Bilgileri
            </h2>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Yöntem:</span>{" "}
                {order.paymentMethod === "credit_card"
                  ? "Kredi Kartı"
                  : order.paymentMethod || "Belirtilmemiş"}
              </p>
              <p>
                <span className="font-medium">Durum:</span>{" "}
                {order.paymentStatus === "pending"
                  ? "Bekliyor"
                  : order.paymentStatus === "completed"
                  ? "Tamamlandı"
                  : order.paymentStatus === "failed"
                  ? "Başarısız"
                  : order.paymentStatus || "Belirtilmemiş"}
              </p>
              <p>
                <span className="font-medium">Toplam:</span>{" "}
                <span className="text-red-600 font-bold">
                  {total.toFixed(2)} TL
                </span>
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Sipariş Notları</h2>
            <textarea
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              rows="4"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Sipariş için not ekleyin..."
            ></textarea>
            <button
              onClick={handleSaveNotes}
              disabled={isUpdating}
              className="mt-3 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors disabled:opacity-50"
            >
              {isUpdating ? "Kaydediliyor..." : "Notu Kaydet"}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AdminOrderDetail;
