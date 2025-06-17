const Footer = () => {
  const socialMedia = [
    {
      name: "Instagram",
      icon: "fab fa-instagram",
      url: "https://instagram.com",
    },
    {
      name: "Facebook",
      icon: "fab fa-facebook-f",
      url: "https://facebook.com",
    },
    { name: "Twitter", icon: "fab fa-twitter", url: "https://twitter.com" },
    {
      name: "LinkedIn",
      icon: "fab fa-linkedin-in",
      url: "https://linkedin.com",
    },
  ];

  // Generate a random phone number
  const randomPhoneNumber = `+90 ${Math.floor(
    1000000000 + Math.random() * 9000000000
  )}`;

  return (
    <footer className="border-t border-red-400 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Left - Address */}
          <div className="mb-4 md:mb-0">
            <h3 className="font-semibold">Adres</h3>
            <p className="text-sm">
              1234 Sokak, No:56
              <br />
              İstanbul, Türkiye
            </p>
          </div>

          {/* Center - Social Media and Copyright */}
          <div className="flex flex-col items-center mb-4 md:mb-0">
            <div className="flex space-x-4 mb-2">
              {socialMedia.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-red-500 transition-colors duration-300 ease-in-out"
                  aria-label={social.name}
                >
                  <i className={`${social.icon} text-xl`} />
                </a>
              ))}
            </div>
            <div className="text-sm">
              Copyright © {new Date().getFullYear()} - Tüm hakları saklıdır
            </div>
          </div>

          {/* Right - Contact */}
          <div className="flex flex-col items-center md:items-end">
            <div className="flex items-center mb-1">
              <i className="fas fa-phone-alt mr-2 text-red-500" />
              <span className="font-semibold">İletişim</span>
            </div>
            <a
              href={`tel:${randomPhoneNumber.replace(/\s+/g, "")}`}
              className="text-sm hover:text-red-500 transition-colors duration-300 ease-in-out"
            >
              {randomPhoneNumber}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
