import React, { useState } from 'react';
import { Search, ShoppingCart, User, Menu, ChevronDown } from 'lucide-react';
import ProductsSection from './ProductsSection';
import Header from './Header';
import Navbar from './Navbar';
import Footer from './Footer';
export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [selectedBrand, setSelectedBrand] = useState('Tümü');
  const [selectedPrice, setSelectedPrice] = useState('Tümü');
  
  const categories = ['Tümü', 'Elektronik', 'Giyim', 'Ev & Yaşam', 'Kozmetik'];
  const brands = ['Tümü', 'Marka A', 'Marka B', 'Marka C', 'Marka D'];
  const priceRanges = ['Tümü', '0-100 TL', '100-500 TL', '500-1000 TL', '1000+ TL'];
  
  const products = [
    { id: 1, name: 'Ürün 1', price: '299.99 TL', category: 'Elektronik' },
    { id: 2, name: 'Ürün 2', price: '149.50 TL', category: 'Giyim' },
    { id: 3, name: 'Ürün 3', price: '599.00 TL', category: 'Ev & Yaşam' },
    { id: 4, name: 'Ürün 4', price: '899.99 TL', category: 'Elektronik' },
  ];
  
  const FilterDropdown = ({ label, options, selected, setSelected }) => (
    <div className="relative inline-block text-left mx-2">
      <div>
        <button 
          type="button" 
          className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
          onClick={(e) => e.currentTarget.nextElementSibling.classList.toggle('hidden')}
        >
          {label}: {selected}
          <ChevronDown className="ml-2 h-4 w-4" />
        </button>
      </div>
      <div className="hidden absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg">
        <div className="py-1">
          {options.map((option) => (
            <a
              key={option}
              href="#"
              className={`block px-4 py-2 text-sm ${selected === option ? 'bg-gray-100 text-gray-900' : 'text-gray-700'} hover:bg-gray-100`}
              onClick={(e) => {
                e.preventDefault();
                setSelected(option);
                e.currentTarget.parentElement.parentElement.classList.add('hidden');
              }}
            >
              {option}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
  
  return (
    <div className="bg-white min-h-screen text-black">
      <Navbar/>
      
      <Header/>
      
      
      <ProductsSection/>
      {/* Footer */}
      <Footer/>
    </div>
  );
}