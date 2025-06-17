import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiEdit,
  FiSave,
  FiX,
  FiShoppingBag,
  FiUser,
  FiMail,
  FiLock,
} from "react-icons/fi";
import axios from "axios";
import { toast } from "react-toastify";
import Footer from "./Footer";
import Navbar from "./Navbar";
import { AuthContext } from "./AuthContext";
const ProfilePage = () => {
  // AuthContext'ten token ve user bilgisini al
  const { token, user: contextUser, isLoggedIn } = useContext(AuthContext);

  const [user, setUser] = useState({
    id: 0,
    name: "",
    email: "",
    isAdmin: false,
    createdAt: "",
  });
  const [orders, setOrders] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(true);
  const [orderLoading, setOrderLoading] = useState(true);
  const navigate = useNavigate();

  // API Base URL
  const API_BASE_URL = "http://localhost:5001/api";

  // Axios interceptor ile token ekleme
  const axiosConfig = (token) => ({
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  // Giriş kontrolü - AuthContext'i kullan
  useEffect(() => {
    if (!isLoggedIn || !token) {
      toast.error("Giriş yapmanız gerekiyor");
      navigate("/login");
      return;
    }
  }, [isLoggedIn, token, navigate]);

  // Kullanıcı bilgilerini getir
  useEffect(() => {
    const fetchUserData = async () => {
      if (!isLoggedIn || !token) {
        setLoading(false);
        return;
      }

      try {
        // Backend'de getCurrentUser endpoint'i kullan
        const response = await axios.get(
          `${API_BASE_URL}/users/me`,
          axiosConfig(token)
        );

        if (response.data) {
          setUser({
            id: response.data.id,
            name: response.data.name || "",
            email: response.data.email || "",
            isAdmin: response.data.isAdmin || false,
            createdAt: response.data.createdAt || new Date().toISOString(),
          });

          setEditData({
            name: response.data.name || "",
            email: response.data.email || "",
            password: "",
          });
        }

        setLoading(false);
      } catch (error) {
        console.error("Kullanıcı bilgileri alınamadı:", error);

        if (error.response?.status === 401) {
          toast.error("Oturum süreniz dolmuş, tekrar giriş yapın");
          // AuthContext'teki logout fonksiyonunu kullanmak daha iyi olur
          navigate("/login");
        } else if (error.response?.status === 404) {
          toast.error("Kullanıcı bulunamadı");
          navigate("/login");
        } else {
          toast.error(
            error.response?.data?.message || "Kullanıcı bilgileri alınamadı"
          );
        }

        setLoading(false);
      }
    };

    fetchUserData();
  }, [token, isLoggedIn, navigate]);

  // Siparişleri getir
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user.id || !token) return;

      try {
        // Backend'de getUserOrders endpoint'i kullan
        const response = await axios.get(
          `${API_BASE_URL}/orders/user`,
          axiosConfig(token)
        );

        if (response.data && Array.isArray(response.data)) {
          // Sipariş verilerini formatla
          const formattedOrders = response.data.map((order) => ({
            id: order.id,
            orderNumber: order.orderNumber || `ORD-${order.id}`,
            createdAt: order.createdAt || new Date().toISOString(),
            totalAmount: parseFloat(order.totalAmount) || 0,
            status: order.status || "processing",
            paymentStatus: order.paymentStatus || "pending",
            orderItems:
              order.orderItems?.map((item) => ({
                id: item.id,
                productId: item.productId,
                quantity: item.quantity,
                price: parseFloat(item.price) || 0,
                product: item.product || {},
              })) || [],
          }));

          setOrders(formattedOrders);
        }

        setOrderLoading(false);
      } catch (error) {
        console.error("Siparişler alınamadı:", error);

        if (error.response?.status === 401) {
          toast.error("Yetkisiz erişim");
        } else {
          toast.error(error.response?.data?.message || "Siparişler alınamadı");
        }

        setOrderLoading(false);
      }
    };

    fetchOrders();
  }, [user.id, token]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setEditData({
        name: user.name,
        email: user.email,
        password: "",
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      if (!token) {
        toast.error("Giriş yapmanız gerekiyor");
        navigate("/login");
        return;
      }

      // Validasyonlar
      if (!editData.name.trim()) {
        toast.error("Ad Soyad boş olamaz");
        return;
      }

      if (!editData.email.trim()) {
        toast.error("E-posta boş olamaz");
        return;
      }

      // Email format kontrolü
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(editData.email)) {
        toast.error("Geçerli bir e-posta adresi girin");
        return;
      }

      // Güncellenecek verileri hazırla
      const updateData = {
        name: editData.name.trim(),
        email: editData.email.trim(),
      };

      // Şifre varsa ekle
      if (editData.password && editData.password.trim()) {
        if (editData.password.length < 6) {
          toast.error("Şifre en az 6 karakter olmalıdır");
          return;
        }
        updateData.password = editData.password.trim();
      }

      // Backend updateUser endpoint'ini kullan
      const response = await axios.put(
        `${API_BASE_URL}/users/${user.id}`,
        updateData,
        axiosConfig(token)
      );

      if (response.data) {
        setUser((prevUser) => ({
          ...prevUser,
          name: response.data.name,
          email: response.data.email,
        }));

        setIsEditing(false);
        toast.success("Profil bilgileri başarıyla güncellendi");
      }
    } catch (error) {
      console.error("Güncelleme hatası:", error);

      if (error.response?.status === 401) {
        toast.error("Yetkisiz erişim");
        navigate("/login");
      } else if (error.response?.status === 404) {
        toast.error("Kullanıcı bulunamadı");
      } else if (error.response?.status === 400) {
        toast.error(error.response?.data?.message || "Geçersiz veri");
      } else {
        toast.error(error.response?.data?.message || "Güncelleme başarısız");
      }
    }
  };

  const formatDate = (dateString) => {
    try {
      if (!dateString) return "Bilgi Yok";

      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Bilgi Yok";

      return date.toLocaleDateString("tr-TR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Bilgi Yok";
    }
  };

  const formatPrice = (price) => {
    try {
      const numPrice = typeof price === "string" ? parseFloat(price) : price;
      if (isNaN(numPrice)) return "0,00 ₺";

      return new Intl.NumberFormat("tr-TR", {
        style: "currency",
        currency: "TRY",
      }).format(numPrice);
    } catch {
      return "0,00 ₺";
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      processing: "İşleniyor",
      shipped: "Kargoda",
      delivered: "Teslim Edildi",
      cancelled: "İptal Edildi",
    };
    return statusMap[status] || status || "Bilinmeyen";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "processing":
      default:
        return "bg-red-100 text-red-800";
    }
  };

  const handleOrderDetail = (orderId) => {
    navigate(`/profile/orders/${orderId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Profilim</h1>

          {/* Kullanıcı Bilgileri */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-700 flex items-center">
                <FiUser className="mr-2" /> Kişisel Bilgiler
              </h2>
              <button
                onClick={handleEditToggle}
                className="text-blue-600 hover:text-blue-800 flex items-center transition-colors"
              >
                {isEditing ? (
                  <>
                    <FiX className="mr-1" /> İptal
                  </>
                ) : (
                  <>
                    <FiEdit className="mr-1" /> Düzenle
                  </>
                )}
              </button>
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-1 font-medium">
                    Ad Soyad *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={editData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ad Soyad girin"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-1 font-medium">
                    E-posta *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={editData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="E-posta adresinizi girin"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-1 font-medium">
                    Yeni Şifre
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      name="password"
                      value={editData.password}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                      placeholder="Şifre değiştirmek istemiyorsanız boş bırakın"
                      minLength={6}
                    />
                    <FiLock className="absolute right-3 top-3 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    En az 6 karakter olmalıdır
                  </p>
                </div>

                <div className="flex justify-end pt-4 space-x-3">
                  <button
                    onClick={handleEditToggle}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    İptal
                  </button>
                  <button
                    onClick={handleSave}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
                  >
                    <FiSave className="mr-2" /> Kaydet
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Ad Soyad
                  </h3>
                  <p className="mt-1 text-lg text-gray-900">
                    {user.name || "Bilgi Yok"}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">E-posta</h3>
                  <p className="mt-1 text-lg text-gray-900 flex items-center">
                    <FiMail className="mr-2" /> {user.email || "Bilgi Yok"}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Üyelik Tarihi
                  </h3>
                  <p className="mt-1 text-lg text-gray-900">
                    {formatDate(user.createdAt)}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Hesap Türü
                  </h3>
                  <p className="mt-1 text-lg text-gray-900">
                    {user.isAdmin ? "Yönetici" : "Standart Kullanıcı"}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Sipariş Geçmişi */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-6 flex items-center">
              <FiShoppingBag className="mr-2" /> Sipariş Geçmişi
            </h2>

            {orderLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-8">
                <FiShoppingBag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500">
                  Henüz siparişiniz bulunmamaktadır.
                </p>
                <button
                  onClick={() => navigate("/productsList")}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Alışverişe Başla
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sipariş No
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tarih
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Toplam Tutar
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Durum
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Detay
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr
                        key={order.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{order.orderNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(order.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                          {formatPrice(order.totalAmount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {getStatusText(order.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button
                            onClick={() => handleOrderDetail(order.id)}
                            className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                          >
                            Detayları Gör
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProfilePage;
