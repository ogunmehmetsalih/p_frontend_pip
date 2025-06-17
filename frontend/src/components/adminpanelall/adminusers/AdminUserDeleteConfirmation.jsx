import React from 'react';
import { X, Trash2, List } from 'lucide-react';

const UserDeleteConfirmation = ({ user, onCancel, onConfirm }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-red-600">Kullanıcı Silme Onayı</h2>
        <div className="flex space-x-2">
          <button
            onClick={onCancel}
            className="flex items-center px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            title="Kullanıcı Listesine Dön"
          >
            <List size={18} className="mr-1" />
            <span className="hidden sm:inline">Liste</span>
          </button>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
            title="Kapat"
          >
            <X size={24} />
          </button>
        </div>
      </div>

      <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6">
        <p className="font-bold">Bu kullanıcıyı silmek üzeresiniz!</p>
        <p className="text-sm">Bu işlem geri alınamaz. Lütfen silmek istediğinizden emin olun.</p>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Kullanıcı Bilgileri</h3>
        <div className="space-y-2">
          <p><span className="font-medium">ID:</span> {user.id}</p>
          <p><span className="font-medium">Ad:</span> {user.name}</p>
          <p><span className="font-medium">Email:</span> {user.email}</p>
          <p><span className="font-medium">Rol:</span> {user.isAdmin ? 'Admin' : 'Normal Kullanıcı'}</p>
          <p><span className="font-medium">Kayıt Tarihi:</span> {new Date(user.createdAt).toLocaleDateString('tr-TR')}</p>
        </div>
      </div>

      <div className="mt-6 flex justify-end space-x-3">
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          İptal
        </button>
        <button
          onClick={onConfirm}
          className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          <Trash2 size={18} className="mr-2" />
          Sil
        </button>
      </div>
    </div>
  );
};

export default UserDeleteConfirmation;