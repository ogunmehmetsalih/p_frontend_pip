// import React, { useContext, useEffect } from 'react';
// import { CheckCircle, Truck, CreditCard, MapPin } from 'lucide-react';
// import { AuthContext } from './AuthContext';
// import Navbar from './Navbar';
// import Footer from './Footer';
// import { useNavigate } from 'react-router-dom';

// const OrderConfirmation = () => {
//   const {
//     lastOrder,
//     clearCart,
//     user
//   } = useContext(AuthContext);

//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!lastOrder) {
//       navigate('/');
//     }

//     // Sipariş onaylandığında sepeti temizle
//     return () => {
//       clearCart();
//     };
//   }, [lastOrder, navigate, clearCart]);

//   const handleViewMyOrdersClick = () => {
//     navigate('/orders');
//   };

//   if (!lastOrder) {
//     return (
//       <>
//         {console.log()}
//         <Navbar />
//         <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
//           <div className="text-center">
//             <p className="text-lg">Sipariş bilgileri yükleniyor...</p>
//           </div>
//         </div>
//         <Footer />
//       </>
//     );
//   }

//   // Tarih formatlama
//   const formatDate = (dateString) => {
//     const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
//     return new Date(dateString).toLocaleDateString('tr-TR', options);
//   };

//   // Ödeme durumu çevirisi
//   const getPaymentStatusText = (status) => {
//     switch (status) {
//       case 'pending':
//         return 'Ödeme Bekleniyor';
//       case 'completed':
//         return 'Ödeme Tamamlandı';
//       case 'failed':
//         return 'Ödeme Başarısız';
//       default:
//         return status;
//     }
//   };

//   // Sipariş durumu çevirisi
//   const getOrderStatusText = (status) => {
//     switch (status) {
//       case 'processing':
//         return 'Hazırlanıyor';
//       case 'shipped':
//         return 'Kargoya Verildi';
//       case 'delivered':
//         return 'Teslim Edildi';
//       case 'cancelled':
//         return 'İptal Edildi';
//       default:
//         return status;
//     }
//   };

//   return (
//     <>
//       <Navbar />
//       <div className="container mx-auto px-4 py-8 min-h-screen">
//         <div className="max-w-3xl mx-auto text-center mb-8">
//           <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
//           <h1 className="text-3xl font-bold mb-2">Siparişiniz Alındı!</h1>
//           <p className="text-gray-600">Sipariş numaranız: <span className="font-semibold">{lastOrder.orderNumber}</span></p>
//           <p className="text-gray-600 mt-2">Sipariş tarihi: {formatDate(lastOrder.createdAt)}</p>
//           <div className="mt-4 inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-red-100 text-red-800">
//             {getOrderStatusText(lastOrder.status)}
//           </div>
//         </div>

//         <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
//           <div className="p-6 border-b">
//             <h2 className="text-xl font-semibold flex items-center">
//               <Truck className="mr-2 text-red-500" />
//               Sipariş Detayları
//             </h2>
//           </div>
//           <div className="p-6">
//             {lastOrder.orderItems.map((item) => (
//               <div key={item.id} className="flex justify-between py-3 border-b last:border-b-0">
//                 <div className="flex items-start">
//                   <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden mr-4">
//                     <img
//                       src={item.product.imageUrl || '/images/placeholder-product.png'}
//                       alt={item.product.name}
//                       className="w-full h-full object-cover"
//                     />
//                   </div>
//                   <div>
//                     <h3 className="font-medium">{item.product.name}</h3>
//                     <p className="text-sm text-gray-500">{item.quantity} adet × {item.price.toFixed(2)} TL</p>
//                     {item.product.brand && (
//                       <p className="text-xs text-gray-400">{item.product.brand.name}</p>
//                     )}
//                   </div>
//                 </div>
//                 <span className="font-semibold">{(item.price * item.quantity).toFixed(2)} TL</span>
//               </div>
//             ))}
//           </div>
//           <div className="p-6 bg-gray-50">
//             <div className="space-y-2">
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Ara Toplam</span>
//                 <span>{lastOrder.totalAmount.toFixed(2)} TL</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Kargo</span>
//                 <span>Ücretsiz</span>
//               </div>
//               <div className="flex justify-between font-semibold text-lg pt-2 border-t">
//                 <span>Toplam</span>
//                 <span className="text-red-600">{lastOrder.totalAmount.toFixed(2)} TL</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="grid md:grid-cols-2 gap-6 mb-8">
//           <div className="bg-white rounded-lg shadow p-6">
//             <h2 className="text-xl font-semibold flex items-center mb-4">
//               <MapPin className="mr-2 text-red-500" />
//               Teslimat Adresi
//             </h2>
//             <address className="not-italic">
//               <p className="font-medium">{lastOrder.shippingAddress.fullName}</p>
//               <p className="text-gray-600">{lastOrder.shippingAddress.addressLine1}</p>
//               {lastOrder.shippingAddress.addressLine2 && (
//                 <p className="text-gray-600">{lastOrder.shippingAddress.addressLine2}</p>
//               )}
//               <p className="text-gray-600">
//                 {lastOrder.shippingAddress.postalCode} {lastOrder.shippingAddress.city}
//               </p>
//               <p className="text-gray-600">Tel: {lastOrder.shippingAddress.phone}</p>
//             </address>
//           </div>

//           <div className="bg-white rounded-lg shadow p-6">
//             <h2 className="text-xl font-semibold flex items-center mb-4">
//               <CreditCard className="mr-2 text-red-500" />
//               Ödeme Bilgileri
//             </h2>
//             <div>
//               <p className="font-medium">{lastOrder.paymentMethod || 'Kredi Kartı'}</p>
//               <div className="mt-2 flex items-center">
//                 <span className="text-gray-600">Durum: </span>
//                 <span className={`ml-2 font-semibold ${
//                   lastOrder.paymentStatus === 'completed' ? 'text-green-500' :
//                   lastOrder.paymentStatus === 'failed' ? 'text-red-500' : 'text-red-500'
//                 }`}>
//                   {getPaymentStatusText(lastOrder.paymentStatus)}
//                 </span>
//               </div>
//               <p className="text-gray-600 mt-1">Toplam: {lastOrder.totalAmount.toFixed(2)} TL</p>
//               {user?.isAdmin && (
//                 <div className="mt-4 pt-4 border-t">
//                   <p className="text-sm text-gray-500">Yönetici Notu:</p>
//                   <p className="text-sm">Sipariş ID: {lastOrder.id}</p>
//                   <p className="text-sm">Kullanıcı ID: {lastOrder.userId}</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         <div className="text-center">
//           <p className="text-gray-600 mb-4">
//             Siparişinizin durumunu{" "}
//             <button
//               onClick={handleViewMyOrdersClick}
//               className="text-red-600 hover:underline"
//             >
//               siparişlerim
//             </button>{" "}
//             sayfasından takip edebilirsiniz.
//           </p>
//           <div className="flex justify-center gap-4">
//             <button
//               onClick={() => navigate('/')}
//               className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 px-6 py-2 rounded-md transition-colors"
//             >
//               Alışverişe Devam Et
//             </button>
//             <button
//               onClick={handleViewMyOrdersClick}
//               className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md transition-colors"
//             >
//               Siparişlerimi Görüntüle
//             </button>
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default OrderConfirmation;

// import React, { useContext, useEffect, useState } from 'react';
// import { CheckCircle, Truck, CreditCard, MapPin } from 'lucide-react';
// import { AuthContext } from './AuthContext';
// import Navbar from './Navbar';
// import Footer from './Footer';
// import { useNavigate, useLocation } from 'react-router-dom';

// const OrderConfirmation = () => {
//   const {
//     token,
//     clearCart,
//     user
//   } = useContext(AuthContext);

//   const navigate = useNavigate();
//   const location = useLocation();
//   const [order, setOrder] = useState(location.state?.order);
//   const [loading, setLoading] = useState(!order);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     // Eğer state'te order yoksa ve URL'de orderId varsa, API'den çek
//     const fetchOrder = async () => {
//       try {
//         setLoading(true);
//         const orderId = location.pathname.split('/').pop();

//         const response = await fetch(`http://localhost:5001/api/orders/${orderId}`, {
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         });

//         if (!response.ok) {
//           throw new Error('Sipariş bilgileri alınamadı');
//         }

//         const data = await response.json();
//         setOrder(data);
//       } catch (err) {
//         setError(err.message);
//         console.error('Sipariş hatası:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (!order && token) {
//       fetchOrder();
//     }

//     // Sipariş onaylandığında sepeti temizle
//     return () => {
//       clearCart();
//     };
//   }, [order, token, clearCart, location]);

//   const handleViewMyOrdersClick = () => {
//     navigate('/orders');
//   };

//   const formatDate = (dateString) => {
//     const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
//     return new Date(dateString).toLocaleDateString('tr-TR', options);
//   };

//   const getPaymentStatusText = (status) => {
//     switch (status) {
//       case 'pending': return 'Ödeme Bekleniyor';
//       case 'completed': return 'Ödeme Tamamlandı';
//       case 'failed': return 'Ödeme Başarısız';
//       default: return status;
//     }
//   };

//   const getOrderStatusText = (status) => {
//     switch (status) {
//       case 'processing': return 'Hazırlanıyor';
//       case 'shipped': return 'Kargoya Verildi';
//       case 'delivered': return 'Teslim Edildi';
//       case 'cancelled': return 'İptal Edildi';
//       default: return status;
//     }
//   };

//   if (loading) {
//     return (
//       <>
//         <Navbar />
//         <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
//           <div className="text-center">
//             <p className="text-lg">Sipariş bilgileri yükleniyor...</p>
//           </div>
//         </div>
//         <Footer />
//       </>
//     );
//   }

//   if (error || !order) {
//     return (
//       <>
//         <Navbar />
//         <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
//           <div className="text-center">
//             <p className="text-lg text-red-500">{error || 'Sipariş bulunamadı'}</p>
//             <button
//               onClick={() => navigate('/')}
//               className="mt-4 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md transition-colors"
//             >
//               Ana Sayfaya Dön
//             </button>
//           </div>
//         </div>
//         <Footer />
//       </>
//     );
//   }

//   return (
//     <>
//       <Navbar />
//       <div className="container mx-auto px-4 py-8 min-h-screen">
//         <div className="max-w-3xl mx-auto text-center mb-8">
//           <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
//           <h1 className="text-3xl font-bold mb-2">Siparişiniz Alındı!</h1>
//           <p className="text-gray-600">Sipariş numaranız: <span className="font-semibold">{order.orderNumber}</span></p>
//           <p className="text-gray-600 mt-2">Sipariş tarihi: {formatDate(order.createdAt)}</p>
//           <div className="mt-4 inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-red-100 text-red-800">
//             {getOrderStatusText(order.status)}
//           </div>
//         </div>

//         <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
//           <div className="p-6 border-b">
//             <h2 className="text-xl font-semibold flex items-center">
//               <Truck className="mr-2 text-red-500" />
//               Sipariş Detayları
//             </h2>
//           </div>
//           <div className="p-6">
//             {order.orderItems.map((item) => (
//               <div key={item._id} className="flex justify-between py-3 border-b last:border-b-0">
//                 <div className="flex items-start">
//                   <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden mr-4">
//                     <img
//                       src={item.imageUrl || '/images/placeholder-product.png'}
//                       alt={item.name}
//                       className="w-full h-full object-cover"
//                     />
//                   </div>
//                   <div>
//                     <h3 className="font-medium">{item.name}</h3>
//                     <p className="text-sm text-gray-500">{item.quantity} adet × {item.price.toFixed(2)} TL</p>
//                     {item.brand && (
//                       <p className="text-xs text-gray-400">{item.brand}</p>
//                     )}
//                   </div>
//                 </div>
//                 <span className="font-semibold">{(item.price * item.quantity).toFixed(2)} TL</span>
//               </div>
//             ))}
//           </div>
//           <div className="p-6 bg-gray-50">
//             <div className="space-y-2">
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Ara Toplam</span>
//                 <span>{order.itemsPrice.toFixed(2)} TL</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Kargo</span>
//                 <span>{order.shippingPrice.toFixed(2)} TL</span>
//               </div>
//               <div className="flex justify-between font-semibold text-lg pt-2 border-t">
//                 <span>Toplam</span>
//                 <span className="text-red-600">{order.totalPrice.toFixed(2)} TL</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="grid md:grid-cols-2 gap-6 mb-8">
//           <div className="bg-white rounded-lg shadow p-6">
//             <h2 className="text-xl font-semibold flex items-center mb-4">
//               <MapPin className="mr-2 text-red-500" />
//               Teslimat Adresi
//             </h2>
//             <address className="not-italic">
//               <p className="font-medium">{order.shippingAddress.fullName}</p>
//               <p className="text-gray-600">{order.shippingAddress.addressLine1}</p>
//               {order.shippingAddress.addressLine2 && (
//                 <p className="text-gray-600">{order.shippingAddress.addressLine2}</p>
//               )}
//               <p className="text-gray-600">
//                 {order.shippingAddress.postalCode} {order.shippingAddress.city}
//               </p>
//               <p className="text-gray-600">Tel: {order.shippingAddress.phone}</p>
//             </address>
//           </div>

//           <div className="bg-white rounded-lg shadow p-6">
//             <h2 className="text-xl font-semibold flex items-center mb-4">
//               <CreditCard className="mr-2 text-red-500" />
//               Ödeme Bilgileri
//             </h2>
//             <div>
//               <p className="font-medium">{order.paymentMethod || 'Kredi Kartı'}</p>
//               <div className="mt-2 flex items-center">
//                 <span className="text-gray-600">Durum: </span>
//                 <span className={`ml-2 font-semibold ${
//                   order.paymentStatus === 'completed' ? 'text-green-500' :
//                   order.paymentStatus === 'failed' ? 'text-red-500' : 'text-red-500'
//                 }`}>
//                   {getPaymentStatusText(order.paymentStatus)}
//                 </span>
//               </div>
//               <p className="text-gray-600 mt-1">Toplam: {order.totalPrice.toFixed(2)} TL</p>
//               {user?.isAdmin && (
//                 <div className="mt-4 pt-4 border-t">
//                   <p className="text-sm text-gray-500">Yönetici Notu:</p>
//                   <p className="text-sm">Sipariş ID: {order._id}</p>
//                   <p className="text-sm">Kullanıcı ID: {order.user}</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         <div className="text-center">
//           <p className="text-gray-600 mb-4">
//             Siparişinizin durumunu{" "}
//             <button
//               onClick={handleViewMyOrdersClick}
//               className="text-red-600 hover:underline"
//             >
//               siparişlerim
//             </button>{" "}
//             sayfasından takip edebilirsiniz.
//           </p>
//           <div className="flex justify-center gap-4">
//             <button
//               onClick={() => navigate('/')}
//               className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 px-6 py-2 rounded-md transition-colors"
//             >
//               Alışverişe Devam Et
//             </button>
//             <button
//               onClick={handleViewMyOrdersClick}
//               className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md transition-colors"
//             >
//               Siparişlerimi Görüntüle
//             </button>
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default OrderConfirmation;

import React, { useContext, useEffect, useState } from "react";
import { CheckCircle, Truck, CreditCard, MapPin } from "lucide-react";
import { AuthContext } from "./AuthContext";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useNavigate, useLocation } from "react-router-dom";

const OrderConfirmation = () => {
  const { token, clearCart, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order);
  const [loading, setLoading] = useState(!order);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const orderId = location.pathname.split("/").pop();

        const response = await fetch(
          `http://localhost:5001/api/orders/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Sipariş bilgileri alınamadı");
        }

        const data = await response.json();
        setOrder(data);
      } catch (err) {
        setError(err.message);
        console.error("Sipariş hatası:", err);
      } finally {
        setLoading(false);
      }
    };

    if (!order && token) {
      fetchOrder();
    }

    return () => {
      if (order) clearCart();
    };
  }, [order, token, clearCart, location]);

  const handleViewMyOrdersClick = () => {
    navigate("/orders");
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("tr-TR", options);
  };

  const getPaymentStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Ödeme Bekleniyor";
      case "completed":
        return "Ödeme Tamamlandı";
      case "failed":
        return "Ödeme Başarısız";
      default:
        return status;
    }
  };

  const getOrderStatusText = (status) => {
    switch (status) {
      case "processing":
        return "Hazırlanıyor";
      case "shipped":
        return "Kargoya Verildi";
      case "delivered":
        return "Teslim Edildi";
      case "cancelled":
        return "İptal Edildi";
      default:
        return status;
    }
  };

  // Decimal veya string fiyatı sayıya çevirme
  const formatPrice = (price) => {
    if (price == null) return "0.00";
    const num =
      typeof price === "object" && price.toString
        ? Number(price.toString())
        : Number(price);
    return isNaN(num) ? "0.00" : num.toFixed(2);
  };

  // Subtotal hesaplama
  const subtotal =
    order?.orderItems?.reduce((sum, item) => {
      if (!item) return sum;
      const price =
        typeof item.price === "object" && item.price.toString
          ? Number(item.price.toString())
          : Number(item.price);
      const quantity = Number(item.quantity) || 0;
      return sum + price * quantity;
    }, 0) || 0;

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg">Sipariş bilgileri yükleniyor...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !order) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg text-red-500">
              {error || "Sipariş bulunamadı"}
            </p>
            <button
              onClick={() => navigate("/")}
              className="mt-4 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md transition-colors"
            >
              Ana Sayfaya Dön
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Backend'den gelen shippingAddress yapısını kontrol et
  const shippingAddress =
    typeof order.shippingAddress === "string"
      ? JSON.parse(order.shippingAddress)
      : order.shippingAddress;

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 min-h-screen">
        <div className="max-w-3xl mx-auto text-center mb-8">
          <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
          <h1 className="text-3xl font-bold mb-2">Siparişiniz Alındı!</h1>
          <p className="text-gray-600">
            Sipariş numaranız:{" "}
            <span className="font-semibold">{order.orderNumber}</span>
          </p>
          <p className="text-gray-600 mt-2">
            Sipariş tarihi: {formatDate(order.createdAt)}
          </p>
          <div className="mt-4 inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-red-100 text-red-800">
            {getOrderStatusText(order.status)}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold flex items-center">
              <Truck className="mr-2 text-red-500" />
              Sipariş Detayları
            </h2>
          </div>
          <div className="p-6">
            {order.orderItems.map((item) => (
              <div
                key={item.id}
                className="flex justify-between py-3 border-b last:border-b-0"
              >
                <div className="flex items-start">
                  <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden mr-4">
                    <img
                      src={
                        item.product?.imageUrl ||
                        "/images/placeholder-product.png"
                      }
                      alt={item.product?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">{item.product?.name}</h3>
                    <p className="text-sm text-gray-500">
                      {item.quantity} adet × {formatPrice(item.price)} TL
                    </p>
                    {item.product?.brand?.name && (
                      <p className="text-xs text-gray-400">
                        {item.product.brand.name}
                      </p>
                    )}
                  </div>
                </div>
                <span className="font-semibold">
                  {formatPrice(Number(item.price) * item.quantity)} TL
                </span>
              </div>
            ))}
          </div>
          <div className="p-6 bg-gray-50">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Ara Toplam</span>
                <span>{formatPrice(subtotal)} TL</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Kargo</span>
                <span>{formatPrice(subtotal > 500 ? 0 : 29.99)} TL</span>
              </div>
              <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                <span>Toplam</span>
                <span className="text-red-600">
                  {formatPrice(subtotal + (subtotal > 500 ? 0 : 29.99))} TL
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold flex items-center mb-4">
              <MapPin className="mr-2 text-red-500" />
              Teslimat Adresi
            </h2>
            <address className="not-italic">
              <p className="font-medium">{shippingAddress.fullName}</p>
              <p className="text-gray-600">{shippingAddress.address}</p>
              <p className="text-gray-600">{shippingAddress.city}</p>
              <p className="text-gray-600">Tel: {shippingAddress.phone}</p>
            </address>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold flex items-center mb-4">
              <CreditCard className="mr-2 text-red-500" />
              Ödeme Bilgileri
            </h2>
            <div>
              <p className="font-medium">
                {order.paymentMethod || "Kredi Kartı"}
              </p>
              <div className="mt-2 flex items-center">
                <span className="text-gray-600">Durum: </span>
                <span
                  className={`ml-2 font-semibold ${
                    order.paymentStatus === "completed"
                      ? "text-green-500"
                      : order.paymentStatus === "failed"
                      ? "text-red-500"
                      : "text-red-500"
                  }`}
                >
                  {getPaymentStatusText(order.paymentStatus)}
                </span>
              </div>
              <p className="text-gray-600 mt-1">
                Toplam: {formatPrice(subtotal + (subtotal > 500 ? 0 : 29.99))}{" "}
                TL
              </p>
              {user?.isAdmin && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-500">Yönetici Notu:</p>
                  <p className="text-sm">Sipariş ID: {order.id}</p>
                  <p className="text-sm">Kullanıcı ID: {order.userId}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Siparişinizin durumunu{" "}
            <button
              onClick={handleViewMyOrdersClick}
              className="text-red-600 hover:underline"
            >
              siparişlerim
            </button>{" "}
            sayfasından takip edebilirsiniz.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 px-6 py-2 rounded-md transition-colors"
            >
              Alışverişe Devam Et
            </button>
            <button
              onClick={handleViewMyOrdersClick}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md transition-colors"
            >
              Siparişlerimi Görüntüle
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderConfirmation;
