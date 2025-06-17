import React, { useState, useEffect } from "react";
import { X, Save, List } from "lucide-react";
import { toast } from "react-toastify";

const AddPutUserForm = ({ user, onCancel, onSaveSuccess }) => {
  const isEditMode = !!user;
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
    isAdmin: user?.isAdmin || false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const url = isEditMode
        ? `http://localhost:5001/api/users/${user.id}`
        : "http://localhost:5001/api/users";

      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "İşlem başarısız oldu");
      }

      const result = await response.json();
      onSaveSuccess(result);

      // Başarılı mesajı
      toast.success(
        isEditMode
          ? "Kullanıcı başarıyla güncellendi!"
          : "Yeni kullanıcı başarıyla eklendi!",
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
        }
      );
    } catch (err) {
      setError(err.message);
      // Hata mesajı
      toast.error(`Hata: ${err.message}`, {
        position: "top-right",
        autoClose: 5001,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          {isEditMode ? "Kullanıcı Düzenle" : "Yeni Kullanıcı Ekle"}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={onCancel}
            className="flex items-center px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            disabled={loading}
            title="Kullanıcı Listesine Dön"
          >
            <List size={18} className="mr-1" />
            <span className="hidden sm:inline">Liste</span>
          </button>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
            disabled={loading}
            title="Kapat"
          >
            <X size={24} />
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ad*
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email*
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {isEditMode ? "Yeni Şifre" : "Şifre*"}
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required={!isEditMode}
              minLength={isEditMode ? 0 : 6}
            />
            {isEditMode && (
              <p className="text-xs text-gray-500 mt-1">
                Şifreyi değiştirmek istemiyorsanız boş bırakın
              </p>
            )}
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="isAdmin"
              id="isAdmin"
              checked={formData.isAdmin}
              onChange={handleChange}
              className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
            />
            <label
              htmlFor="isAdmin"
              className="ml-2 block text-sm text-gray-700"
            >
              Admin Yetkisi
            </label>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            İptal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            {loading ? (
              <span className="animate-spin mr-2">↻</span>
            ) : (
              <Save size={18} className="mr-2" />
            )}
            {isEditMode ? "Güncelle" : "Kaydet"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPutUserForm;
