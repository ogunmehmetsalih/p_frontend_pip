import React from 'react';
import { X, Trash2, List } from 'lucide-react';

const ProductDeleteConfirmation = ({ product, onCancel, onConfirm }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-red-600">Ürün Silme Onayı</h2>
        <div className="flex space-x-2">
          <button
            onClick={onCancel}
            className="flex items-center px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            title="Ürün Listesine Dön"
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
        <p className="font-bold">Bu ürünü silmek üzeresiniz!</p>
        <p className="text-sm">Bu işlem geri alınamaz. Lütfen silmek istediğinizden emin olun.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Ürün Bilgileri</h3>
          <div className="space-y-2">
            <p><span className="font-medium">ID:</span> {product.id}</p>
            <p><span className="font-medium">Ad:</span> {product.name}</p>
            <p><span className="font-medium">Kategori:</span> {product.category?.name || 'Belirtilmemiş'}</p>
            <p><span className="font-medium">Fiyat:</span> {Number(product.price || 0).toFixed(2)} TL</p>
            <p><span className="font-medium">Stok:</span> {product.stock || 0}</p>
          </div>
        </div>

        {product.imageUrl && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Ürün Resmi</h3>
            <img 
              src={product.imageUrl} 
              alt={product.name}
              className="h-40 object-contain border border-gray-200 rounded"
            />
          </div>
        )}
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

export default ProductDeleteConfirmation;