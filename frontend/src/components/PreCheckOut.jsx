import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import Navbar from "./Navbar";
import Footer from "./Footer";

const PreCheckout = () => {
  const {
    cartItems,
    token,
    clearCart,
    removeFromCart,
    updateCartItemQuantity,
  } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    city: "",
    phone: "",
    cardName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  // Subtotal hesaplama
  const subtotal = (cartItems || []).reduce((sum, item) => {
    if (!item) return sum;
    let price = 0;
    if (typeof item.price === "number") {
      price = item.price;
    } else if (typeof item.price === "string") {
      price = parseFloat(item.price.replace(/[^0-9.]/g, "")) || 0;
    }
    const quantity = Number(item.quantity) || 0;
    return sum + price * quantity;
  }, 0);

  const shippingFee = subtotal > 500 ? 0 : 29.99;
  const total = subtotal + shippingFee;

  // Form input değişikliklerini yönet
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Form validasyonu
  const validateForm = () => {
    const {
      fullName,
      address,
      city,
      phone,
      cardName,
      cardNumber,
      expiryDate,
      cvv,
    } = formData;
    if (
      !fullName ||
      !address ||
      !city ||
      !phone ||
      !cardName ||
      !cardNumber ||
      !expiryDate ||
      !cvv
    ) {
      setError("Lütfen tüm alanları doldurun.");
      return false;
    }
    if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ""))) {
      setError("Kart numarası 16 haneli olmalıdır.");
      return false;
    }
    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
      setError("Son kullanma tarihi AA/YY formatında olmalıdır.");
      return false;
    }
    if (!/^\d{3}$/.test(cvv)) {
      setError("CVV 3 haneli olmalıdır.");
      return false;
    }
    return true;
  };

  // Ödeme işlemi
  const handlePaymentClick = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (!token) {
      setError("Giriş yapmanız gerekiyor.");
      navigate("/login");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const orderData = {
        items: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
        shippingAddress: {
          fullName: formData.fullName,
          address: formData.address,
          city: formData.city,
          phone: formData.phone,
        },
        paymentMethod: "credit_card",
      };

      const response = await fetch("http://localhost:5001/api/orders", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Sipariş oluşturulamadı");
      }

      const data = await response.json();
      clearCart();
      navigate("/checkout/payment", { state: { order: data.data } });
    } catch (err) {
      setError(err.message || "Sipariş işlemi sırasında bir hata oluştu");
      console.error("Sipariş hatası:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 min-h-screen">
        <h1 className="text-3xl font-bold mb-8">Sipariş Özeti</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Ürünler */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Sepetiniz</h2>

              {cartItems.length === 0 ? (
                <p className="text-gray-600">
                  Sepetinizde ürün bulunmamaktadır.
                </p>
              ) : (
                <div className="divide-y divide-gray-200">
                  {cartItems.map((item) => {
                    const price = Number(item.price) || 0;
                    return (
                      <div key={item.id} className="py-4 flex items-center">
                        <div className="w-24 h-24 bg-gray-100 rounded-md overflow-hidden">
                          <img
                            src={item.imageUrl || "/placeholder-image.jpg"}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="ml-4 flex-1">
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-gray-600 text-sm">
                            {item.brand?.name || "Marka Belirtilmemiş"}
                          </p>
                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-red-600 font-semibold">
                              {price.toFixed(2)} TL
                            </span>
                            <button
                              onClick={() =>
                                updateCartItemQuantity(
                                  item.id,
                                  Math.max(1, item.quantity - 1)
                                )
                              }
                              className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 text-lg"
                              disabled={item.quantity <= 1}
                              title="Adet azalt"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) =>
                                updateCartItemQuantity(
                                  item.id,
                                  Math.max(1, Number(e.target.value))
                                )
                              }
                              className="w-12 text-center border rounded"
                              style={{ maxWidth: "48px" }}
                            />
                            <button
                              onClick={() =>
                                updateCartItemQuantity(
                                  item.id,
                                  item.quantity + 1
                                )
                              }
                              className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 text-lg"
                              title="Adet arttır"
                            >
                              +
                            </button>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="ml-4 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                              title="Ürünü sepetten sil"
                            >
                              Sil
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Teslimat Bilgileri */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Teslimat Bilgileri</h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ad Soyad
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adres
                  </label>
                  <textarea
                    rows="3"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  ></textarea>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Şehir
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Telefon
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      required
                    />
                  </div>
                </div>
              </form>
            </div>

            {/* Ödeme Bilgileri */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Ödeme Bilgileri</h2>
              <form className="space-y-4" onSubmit={handlePaymentClick}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kart Üzerindeki İsim
                  </label>
                  <input
                    type="text"
                    name="cardName"
                    value={formData.cardName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Ad Soyad"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kart Numarası
                  </label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="1234 1234 1234 1234"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Son Kullanma Tarihi
                    </label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="AA/YY"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CVV
                    </label>
                    <input
                      type="text"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="123"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isProcessing || cartItems.length === 0}
                  className={`w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-md transition-colors ${
                    isProcessing || cartItems.length === 0
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {isProcessing ? "İşleniyor..." : "Ödeme Yap"}
                </button>
              </form>
            </div>
          </div>

          {/* Sipariş Özeti */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Sipariş Özeti</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Ara Toplam</span>
                  <span>{subtotal.toFixed(2)} TL</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Kargo</span>
                  <span>{shippingFee.toFixed(2)} TL</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-semibold text-lg">
                  <span>Toplam</span>
                  <span className="text-red-600">{total.toFixed(2)} TL</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PreCheckout;
