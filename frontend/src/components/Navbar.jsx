import React, { useState, useContext } from "react";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  ChevronDown,
  LogOut,
  X,
} from "lucide-react";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";

function Navbar() {
  const { isLoggedIn, logout, cartItems, user } = useContext(AuthContext);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();

  const cartItemsCount = cartItems.length;

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  const toggleSearchBar = () => {
    setShowSearchBar(!showSearchBar);
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  const handleSearch = (searchTerm) => {
    navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
  };

  const handleLogout = () => {
    logout();
    setShowProfileDropdown(false);
    navigate("/");
  };

  return (
    <>
      <nav className="bg-white text-black shadow-sm relative z-40">
        <div className="container mx-auto flex justify-between items-center p-4">
          {/* Logo - Homepage link */}
          <a
            href="/"
            className="font-bold text-2xl hover:text-red-600 transition-colors duration-200"
          >
            <img
              src="https://trtmarket.com/Data/EditorFiles/site-2.png"
              alt="PROGÜVEN"
              className="h-12"
            />
          </a>

          {/* Ana Navigasyon - Masaüstü */}
          <div className="hidden md:flex space-x-8">
            <a
              href="/"
              className="hover:text-red-600 transition-colors duration-200"
            >
              Anasayfa
            </a>
            <a
              href="/productsList"
              className="hover:text-red-600 transition-colors duration-200"
            >
              Ürünler
            </a>
            <a
              href="/contact"
              className="hover:text-red-600 transition-colors duration-200"
            >
              İletişim
            </a>
            <a
              href="/about"
              className="hover:text-red-600 transition-colors duration-200"
            >
              Hakkımızda
            </a>
            {/* Admin panel linki */}
            {user?.isAdmin && (
              <a
                href="/adminpanel"
                className="hover:text-red-600 transition-colors duration-200"
              >
                Admin Paneli
              </a>
            )}
          </div>

          {/* Sağ Kısım - Arama ve Kullanıcı İşlemleri */}
          <div className="flex items-center space-x-6">
            {/* Arama İkonu */}
            <button
              onClick={toggleSearchBar}
              className="hover:text-red-600 transition-colors duration-200"
              aria-label="Arama yap"
            >
              <Search className="h-6 w-6" />
            </button>

            {/* Kullanıcı giriş durumuna göre içerik */}
            {isLoggedIn ? (
              <>
                {/* Sepet İkonu */}
                <button
                  onClick={() => navigate("/preCheckOut")}
                  className="relative hover:text-red-600 transition-colors duration-200"
                >
                  <ShoppingCart className="h-6 w-6" />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemsCount}
                    </span>
                  )}
                </button>

                {/* Profil Dropdown */}
                <div className="relative">
                  <button
                    onClick={toggleProfileDropdown}
                    className="flex items-center space-x-1 hover:text-red-600 transition-colors duration-200"
                    aria-label="Profil menüsü"
                  >
                    <User className="h-6 w-6" />
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        showProfileDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {showProfileDropdown && (
                    <div
                      className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-100"
                      onMouseLeave={() => setShowProfileDropdown(false)}
                    >
                      <button
                        onClick={() => {
                          navigate("/profile");
                          setShowProfileDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 flex items-center"
                      >
                        <User className="h-4 w-4 mr-2" />
                        Profil Ayarları
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 flex items-center"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Çıkış Yap
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* Giriş/Kayıt Butonları - Masaüstü */
              <div className="hidden md:flex space-x-4">
                <button
                  onClick={() => navigate("/login")}
                  className="px-4 py-2 hover:text-red-600 transition-colors duration-200"
                >
                  Giriş Yap
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors duration-200"
                >
                  Kayıt Ol
                </button>
              </div>
            )}

            {/* Mobil Menü Butonu */}
            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="hover:text-red-600 transition-colors duration-200"
                aria-label="Mobil menü"
              >
                {showMobileMenu ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobil Menü İçeriği */}
        {showMobileMenu && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="container mx-auto px-4 py-3 flex flex-col space-y-4">
              <a
                href="/"
                className="hover:text-red-600 transition-colors duration-200 py-2"
                onClick={() => setShowMobileMenu(false)}
              >
                Anasayfa
              </a>
              <a
                href="/productsList"
                className="hover:text-red-600 transition-colors duration-200 py-2"
                onClick={() => setShowMobileMenu(false)}
              >
                Ürünler
              </a>
              <a
                href="/contact"
                className="hover:text-red-600 transition-colors duration-200 py-2"
                onClick={() => setShowMobileMenu(false)}
              >
                İletişim
              </a>
              <a
                href="/about"
                className="hover:text-red-600 transition-colors duration-200 py-2"
                onClick={() => setShowMobileMenu(false)}
              >
                Hakkımızda
              </a>

              {/* Admin panel linki - Mobil */}
              {user?.isAdmin && (
                <a
                  href="/adminpanel"
                  className="hover:text-red-600 transition-colors duration-200 py-2"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Admin Paneli
                </a>
              )}

              {/* Giriş/Kayıt Butonları - Mobil */}
              {!isLoggedIn && (
                <div className="flex flex-col space-y-3 pt-2">
                  <button
                    onClick={() => {
                      navigate("/login");
                      setShowMobileMenu(false);
                    }}
                    className="px-4 py-2 hover:text-red-600 transition-colors duration-200 text-left"
                  >
                    Giriş Yap
                  </button>
                  <button
                    onClick={() => {
                      navigate("/signup");
                      setShowMobileMenu(false);
                    }}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors duration-200 text-center"
                  >
                    Kayıt Ol
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Arama Çubuğu */}
      <SearchBar
        isVisible={showSearchBar}
        onClose={toggleSearchBar}
        onSearch={handleSearch}
      />
    </>
  );
}

export default Navbar;
