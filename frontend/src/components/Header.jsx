import { useState } from "react";
import { Link } from "react-router-dom"; // React Router kullanıyorsanız

const Header = () => {
  // Mobil menü için durum yönetimi
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Gezinme bağlantıları
  const navLinks = [
    { name: "Ana Sayfa", path: "/" },
    { name: "Kadın", path: "/kadin" },
    { name: "Erkek", path: "/erkek" },
    { name: "Çocuk", path: "/cocuk" },
    { name: "İndirim", path: "/indirim" },
  ];

  return (
    <div className="relative h-[500px]">
      {/* Arka plan resmi */}
      <div className="absolute inset-0">
        <img
          src="https://witcdn.trtmarket.com/Data/BlockUploadData/slider/img1/299/ani-yuzuk-tr-12.jpg?1747121874"
          alt="Slider"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Header içeriği */}
      <header className="relative z-10">
        {/* Mobil menü */}
        {isMenuOpen && (
          <div className="md:hidden bg-black bg-opacity-90">
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-white hover:text-red-400 transition duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>
    </div>
  );
};

export default Header;
