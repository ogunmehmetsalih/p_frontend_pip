import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import Navbar from "./Navbar";
import Footer from "./Footer";

const SignupPage = () => {
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const success = await signup(email, password, name);
      if (success) {
        navigate("/");
      } else {
        setError("Lütfen tüm alanları doğru şekilde doldurun");
      }
    } catch (err) {
      setError("Kayıt sırasında bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
            Kayıt Ol
          </h2>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="name">
                Ad Soyad
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 rounded-md bg-gray-50 text-gray-800 border border-gray-300 focus:outline-none focus:border-blue-500 transition-all"
                placeholder="Ad ve soyadınızı girin"
                required
                minLength="3"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-md bg-gray-50 text-gray-800 border border-gray-300 focus:outline-none focus:border-blue-500 transition-all"
                placeholder="Email adresinizi girin"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2" htmlFor="password">
                Şifre
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded-md bg-gray-50 text-gray-800 border border-gray-300 focus:outline-none focus:border-blue-500 transition-all"
                placeholder="Şifrenizi girin (en az 6 karakter)"
                required
                minLength="6"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-red-500 text-white font-semibold p-3 rounded-md hover:bg-red-600 transition-all focus:outline-none focus:ring-2 focus:ring-red-400 ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Kayıt Olunuyor..." : "Kayıt Ol"}
            </button>
          </form>
          <p className="text-gray-600 text-center mt-4">
            Zaten hesabınız var mı?{" "}
            <a href="/login" className="text-blue-500 hover:underline">
              Giriş Yap
            </a>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SignupPage;
