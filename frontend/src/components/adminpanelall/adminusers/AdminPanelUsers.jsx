import React, { useState, useEffect } from "react";
import { Edit, Trash2, UserPlus } from "lucide-react";
import Navbar from "../../Navbar";
import Footer from "../../Footer";
import AddPutUserForm from "./AdminAddPutUser";
import UserDeleteConfirmation from "./AdminUserDeleteConfirmation";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);

  // Kullanıcıları API'dan çek
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5001/api/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setUsers(data);
      setError(null);
    } catch (error) {
      console.error("Kullanıcılar yüklenirken hata:", error);
      setError(error.message);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Kullanıcı silme işlemi
  const handleDelete = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:5001/api/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Kullanıcı silinemedi");
      }

      setUsers(users.filter((u) => u.id !== userId));
      setDeletingUser(null);
    } catch (error) {
      console.error("Kullanıcı silinirken hata:", error);
      alert("Kullanıcı silinirken bir hata oluştu");
    }
  };

  // Yeni kullanıcı ekleme başarılı olduğunda
  const handleAddSuccess = (newUser) => {
    setUsers([...users, newUser]);
    setShowAddForm(false);
  };

  // Kullanıcı güncelleme başarılı olduğunda
  const handleUpdateSuccess = (updatedUser) => {
    setUsers(users.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    setEditingUser(null);
  };

  // Hata durumu
  if (error) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8 min-h-screen text-center">
          <h1 className="text-3xl font-bold mb-8">Kullanıcı Yönetimi</h1>
          <div className="text-red-500 mb-4">
            <p className="text-lg">Kullanıcılar yüklenirken hata oluştu:</p>
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
          <h1 className="text-3xl font-bold">Kullanıcı Yönetimi</h1>
          {!showAddForm && !editingUser && !deletingUser && (
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              <UserPlus size={18} className="mr-2" />
              Yeni Kullanıcı Ekle
            </button>
          )}
        </div>

        {showAddForm ? (
          <AddPutUserForm
            onCancel={() => setShowAddForm(false)}
            onSaveSuccess={handleAddSuccess}
          />
        ) : editingUser ? (
          <AddPutUserForm
            user={editingUser}
            onCancel={() => setEditingUser(null)}
            onSaveSuccess={handleUpdateSuccess}
          />
        ) : deletingUser ? (
          <UserDeleteConfirmation
            user={deletingUser}
            onCancel={() => setDeletingUser(null)}
            onConfirm={() => handleDelete(deletingUser.id)}
          />
        ) : (
          <>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                {users.length === 0 ? (
                  <div className="p-6 text-center">
                    <p className="text-gray-500 mb-4">
                      Henüz kullanıcı bulunmamaktadır
                    </p>
                    <button
                      onClick={() => setShowAddForm(true)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                    >
                      Yeni Kullanıcı Ekle
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
                          Ad
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rol
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Katılma Tarihi
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          İşlemler
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {user.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                user.isAdmin
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {user.isAdmin ? "Admin" : "Kullanıcı"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(user.createdAt).toLocaleDateString(
                              "tr-TR"
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => setEditingUser(user)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Edit size={18} />
                              </button>
                              <button
                                onClick={() => setDeletingUser(user)}
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

export default AdminUsers;
