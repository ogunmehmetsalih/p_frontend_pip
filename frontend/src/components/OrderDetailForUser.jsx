import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./../components/Navbar";
import Footer from "./../components/Footer";
import {
  Check,
  MapPin,
  CreditCard,
  User,
  Truck,
  X,
  ArrowLeft,
} from "lucide-react";
import { AuthContext } from "./AuthContext";

const UserOrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [subtotal, setSubtotal] = useState(0);
  const [shippingFee, setShippingFee] = useState(0);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AuthContext);
  console.log("Order ID: ", orderId);
  // Parse order data safely
  const parseOrderData = (responseData) => {
    try {
      const orderData = responseData.data || responseData;

      let shippingAddress = {};
      if (orderData.shippingAddress) {
        if (typeof orderData.shippingAddress === "string") {
          shippingAddress = JSON.parse(orderData.shippingAddress);
        } else {
          shippingAddress = orderData.shippingAddress;
        }
      }

      // Convert status for display
      let displayStatus = orderData.status;
      if (orderData.status === "delivered") {
        displayStatus = "completed";
      }

      return {
        ...orderData,
        shippingAddress,
        orderItems: orderData.orderItems || [],
        status: displayStatus,
      };
    } catch (error) {
      console.error("Error parsing order data:", error);
      return {};
    }
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `http://localhost:5001/api/orders/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Could not load order details");
        }

        const responseData = await response.json();
        const parsedOrder = parseOrderData(responseData);

        if (!parsedOrder || !parsedOrder.id) {
          throw new Error("Invalid order data received");
        }

        setOrder(parsedOrder);

        // Calculate order totals
        if (parsedOrder.totalAmount) {
          const totalFromAPI = parseFloat(parsedOrder.totalAmount);
          setTotal(totalFromAPI);
          setShippingFee(20.0);
          setSubtotal(totalFromAPI - 20.0);
        } else {
          const sub = (parsedOrder.orderItems || []).reduce((sum, item) => {
            const price = parseFloat(item.price) || 0;
            const quantity = parseInt(item.quantity) || 0;
            return sum + price * quantity;
          }, 0);

          setSubtotal(sub);
          setShippingFee(20.0);
          setTotal(sub + 20.0);
        }
      } catch (error) {
        console.error("Error loading order:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (orderId && token) {
      fetchOrder();
    }
  }, [orderId, token]);

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "shipped":
        return (
          <span className="bg-green-100 text-green-800 px-3 py-1 text-sm rounded-full flex items-center">
            <Truck size={14} className="mr-1" /> Hazırlanıyor
          </span>
        );
      case "processing":
        return (
          <span className="bg-red-100 text-red-800 px-3 py-1 text-sm rounded-full flex items-center">
            <Truck size={14} className="mr-1" /> Processing
          </span>
        );
      case "cancelled":
        return (
          <span className="bg-red-100 text-red-800 px-3 py-1 text-sm rounded-full flex items-center">
            <X size={14} className="mr-1" /> Cancelled
          </span>
        );
      case "completed":
      case "delivered":
        return (
          <span className="bg-blue-100 text-blue-800 px-3 py-1 text-sm rounded-full flex items-center">
            <Check size={14} className="mr-1" /> Delivered
          </span>
        );
      default:
        return (
          <span className="bg-gray-100 text-gray-800 px-3 py-1 text-sm rounded-full">
            {status || "Unknown"}
          </span>
        );
    }
  };

  const getShippingAddress = () => {
    if (!order?.shippingAddress) return {};
    return order.shippingAddress;
  };

  const shippingAddress = getShippingAddress();

  if (error) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8 min-h-screen">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-red-600 mb-4"
          >
            <ArrowLeft size={18} className="mr-1" /> Geri dön
          </button>
          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <X className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Error loading order
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (loading || !order) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8 min-h-screen">
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-12 w-12 bg-red-200 rounded-full mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-48"></div>
            </div>
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
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-red-600 mb-6 hover:text-red-700 transition-colors"
        >
          <ArrowLeft size={18} className="mr-1" /> Geri Dön
        </button>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            Order #{order.orderNumber || order.id}
          </h1>
          <div>{getStatusBadge(order.status)}</div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold mb-2">Sipariş Özeti</h2>
            <p className="text-gray-500">
              Şu zamanda sipariş edildi:{" "}
              {order.createdAt
                ? new Date(order.createdAt).toLocaleDateString("tr-TR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Date not available"}
            </p>
          </div>

          <div className="p-6">
            <h3 className="font-semibold mb-4 text-lg">Ürünler</h3>
            {!order.orderItems || order.orderItems.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No items found in this order.</p>
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
                      <div className="flex">
                        <div className="h-20 w-20 bg-gray-100 rounded-md mr-4 overflow-hidden">
                          {item.product?.image && (
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="h-full w-full object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium">
                            {item.product?.name ||
                              item.name ||
                              "Product name not available"}
                          </h4>
                          <p className="text-sm text-gray-500">
                            Adet: {quantity}
                          </p>
                          {item.product?.color && (
                            <p className="text-sm text-gray-500">
                              Renk: {item.product.color}
                            </p>
                          )}
                          {item.product?.size && (
                            <p className="text-sm text-gray-500">
                              Boyut: {item.product.size}
                            </p>
                          )}
                        </div>
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
              <span className="text-gray-600">Subtotal:</span>
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
              <MapPin className="mr-2 text-red-500" />
              Kargo Adresi
            </h2>
            <address className="not-italic space-y-2">
              <p className="font-medium">
                {shippingAddress.fullName || "Belirtilmedi"}
              </p>
              <p>
                {shippingAddress.street ||
                  shippingAddress.address ||
                  "Address yok"}
              </p>
              <p>
                {shippingAddress.district || "District not specified"},{" "}
                {shippingAddress.city || "City not specified"}
              </p>
              <p>{shippingAddress.country || "Country not specified"}</p>
              <p>Posta Kodu: {shippingAddress.postalCode || "Not specified"}</p>
              {shippingAddress.phone && (
                <p className="mt-2">Phone: {shippingAddress.phone}</p>
              )}
            </address>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold flex items-center mb-4">
              <CreditCard className="mr-2 text-red-500" />
              Ödeme Bilgileri
            </h2>
            <div className="space-y-3">
              <p>
                <span className="font-medium">Ödeme Şekli:</span>{" "}
                {order.paymentMethod === "credit_card"
                  ? "Kredi Kartı"
                  : order.paymentMethod || "Not specified"}
              </p>
              <p>
                <span className="font-medium">Sipariş Durumu:</span>{" "}
                {order.paymentStatus === "pending"
                  ? "Beklemede"
                  : order.paymentStatus === "completed"
                  ? "Ödendi"
                  : order.paymentStatus === "failed"
                  ? "Yapılmadı"
                  : order.paymentStatus || "Not specified"}
              </p>
              <p>
                <span className="font-medium">Toplam Ücret:</span>
                <span className="text-red-600 font-bold ml-1">
                  {total.toFixed(2)} TL
                </span>
              </p>
            </div>
          </div>

          {order.notes && (
            <div className="bg-white rounded-lg shadow p-6 md:col-span-2">
              <h2 className="text-xl font-semibold mb-3">Order Notes</h2>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-gray-700">{order.notes}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UserOrderDetail;
