import React from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 min-h-screen">
        <h1 className="text-3xl font-bold mb-8">Admin Paneli</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            className="border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate('/adminpanel/products')}
          >
            <h2 className="text-xl font-semibold mb-2">Ürün Yönetimi</h2>
            <p className="text-gray-600">Ürün ekleme, düzenleme ve silme işlemleri</p>
          </div>
          
          <div 
            className="border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate('/adminpanel/users')}
          >
            <h2 className="text-xl font-semibold mb-2">Kullanıcı Yönetimi</h2>
            <p className="text-gray-600">Kullanıcıları görüntüleme ve yönetme</p>
          </div>
          
          <div 
            className="border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate('/adminpanel/orders')}
          >
            <h2 className="text-xl font-semibold mb-2">Sipariş Yönetimi</h2>
            <p className="text-gray-600">Siparişleri görüntüleme ve yönetme</p>
          </div>

          <div 
            className="border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate('/adminpanel/contactMessages')}
          >
            <h2 className="text-xl font-semibold mb-2">İletişim Mesajları</h2>
            <p className="text-gray-600">Kullanıcı mesajlarını görüntüleme ve yönetme</p>
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
};

export default AdminPanel;