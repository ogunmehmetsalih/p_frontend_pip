// import { createContext, useState, useEffect } from 'react';

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   // localStorage'dan başlangıç durumunu al
//   const [isLoggedIn, setIsLoggedIn] = useState(() => {
//     return localStorage.getItem('isLoggedIn') === 'true';
//   });
//   const [user, setUser] = useState(() => {
//     const storedUser = localStorage.getItem('user');
//     return storedUser ? JSON.parse(storedUser) : null;
//   });
//   const [cartItems, setCartItems] = useState([]);

//   // Durum değiştiğinde localStorage'a kaydet
//   useEffect(() => {
//     localStorage.setItem('isLoggedIn', isLoggedIn);
//     localStorage.setItem('user', user ? JSON.stringify(user) : null);
//   }, [isLoggedIn, user]);

//   const userDatabase = [
//     { email: 'user@example.com', password: 'password123', name: 'Test User' },
//     { email: 'admin@example.com', password: 'admin123', name: 'Admin User' },
//   ];

//   const login = (email, password) => {
//     if (email === 'admin@example.com' && password === 'admin123') {
//       setIsLoggedIn(true);
//       setUser({ email, name: 'Admin', isAdmin: true });
//       return true;
//     }
//     if (email && password) {
//       setIsLoggedIn(true);
//       setUser({ email, name: email.split('@')[0], isAdmin: false });
//       return true;
//     }
//     return false;
//   };

//   const signup = (email, password, name) => {
//     if (!email || !password || !name) return false;
//     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return false;
//     if (password.length < 6) return false;

//     userDatabase.push({ email, password, name });
//     setIsLoggedIn(true);
//     setUser({ email, name });
//     return true;
//   };

//   const logout = () => {
//     setIsLoggedIn(false);
//     setUser(null);
//     localStorage.removeItem('isLoggedIn');
//     localStorage.removeItem('user');
//   };

//   const addToCart = (product) => {
//     setCartItems([...cartItems, product]);
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         isLoggedIn,
//         user,
//         login,
//         logout,
//         signup,
//         cartItems,
//         addToCart,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// src/AuthContext.jsx
import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Token ve kullanıcı bilgisi için state'ler
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true); // Kimlik doğrulama durumunun yüklenip yüklenmediği

  // Kullanıcı sepete eklenen ürünler (mevcut yapıyı korumak için)
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Sepet değiştiğinde localStorage'a yaz
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Uygulama yüklendiğinde localStorage'dan token ve kullanıcı bilgisini kontrol et
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("user"); // Kullanıcı bilgisini de kaydediyorsanız

    if (storedToken) {
      setToken(storedToken);
      // Eğer kullanıcı bilgisi token'dan çıkarılabiliyorsa (örn: JWT decode) burada yapılabilir
      // Veya login sırasında backend'den gelen user objesini de kaydetmişseniz
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        // Eğer token varsa ama user yoksa, belki bir /me endpoint'i ile user bilgisini çekebilirsiniz.
        // Şimdilik sadece token'ın varlığına güvenelim.
        setUser({ email: "unknown@example.com", name: "User" }); // Varsayılan kullanıcı bilgisi
      }
    }
    setIsLoadingAuth(false); // Yükleme tamamlandı
  }, []);

  // `token` veya `user` değiştiğinde localStorage'ı güncelle
  // Bu useEffect, `login` veya `logout` çağrıldığında otomatik olarak çalışacak.
  useEffect(() => {
    if (token) {
      localStorage.setItem("authToken", token);
    } else {
      localStorage.removeItem("authToken"); // Token yoksa sil
    }

    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user"); // Kullanıcı yoksa sil
    }
  }, [token, user]);

  // Giriş fonksiyonu: Backend ile etkileşime girer ve token alır
  const login = async (email, password) => {
    try {
      const response = await fetch("http://localhost:5001/api/auth/login", {
        // <-- BURAYI KENDİ BACKEND LOGIN URL'NİZLE DEĞİŞTİRİN
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const receivedToken = data.token; // Backend'den gelen token
        const userData = data.user; // Backend'den gelen kullanıcı bilgisi (opsiyonel)

        setToken(receivedToken);
        setUser(userData || { email, name: email.split("@")[0] }); // Backend'den gelmezse varsayılan
        return true; // Giriş başarılı
      } else {
        const errorData = await response.json();
        console.error("Giriş başarısız:", errorData.message);
        return false; // Giriş başarısız
      }
    } catch (err) {
      console.error("API isteği sırasında hata oluştu:", err);
      return false; // Hata oluştu
    }
  };

  // Çıkış fonksiyonu: Token'ı ve kullanıcı bilgisini temizler
  const logout = () => {
    setToken(null);
    setUser(null);
    // localStorage'daki öğeleri doğrudan siliyoruz, useEffect zaten bu state değişikliklerini yansıtacaktır
    // ancak açıkça belirtmek güvenlik açısından iyi olabilir.
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  };

  // Yeni kullanıcı kaydı (eğer backend'inizde varsa)
  const signup = async (email, password, name) => {
    try {
      const response = await fetch("http://localhost:5001/api/auth/register", {
        // <-- BURAYI KENDİ BACKEND SIGNUP URL'NİZLE DEĞİŞTİRİN
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name }),
      });

      if (response.ok) {
        const data = await response.json();
        // Eğer kayıt sonrası otomatik giriş yapılıyorsa token alıp kaydedebilirsiniz
        const receivedToken = data.token;
        const userData = data.user;

        setToken(receivedToken);
        setUser(userData || { email, name });
        return true;
      } else {
        const errorData = await response.json();
        console.error("Kayıt başarısız:", errorData.message);
        return false;
      }
    } catch (err) {
      console.error("API isteği sırasında hata oluştu:", err);
      return false;
    }
  };

  // Yükleme sırasında bekletme
  if (isLoadingAuth) {
    return <div>Oturum kontrol ediliyor...</div>; // Uygulama başlatılırken gösterilecek bir yükleme ekranı
  }

  // AuthProvider içine bu fonksiyonları ekleyin
  const addToCart = (product, quantity = 1) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);
      let updatedCart;

      if (existingItem) {
        updatedCart = prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        updatedCart = [
          ...prev,
          {
            ...product,
            quantity,
            // Fiyat garantisi ekleyin
            price:
              typeof product.price === "string"
                ? parseFloat(product.price.replace(/[^\d.]/g, ""))
                : product.price,
          },
        ];
      }

      return updatedCart;
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateCartItemQuantity = (productId, newQuantity) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId
          ? { ...item, quantity: Math.max(1, newQuantity) }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <AuthContext.Provider
      value={{
        // `isLoggedIn` yerine doğrudan `!!token` kullanmak token'a bağlılığı artırır.
        isLoggedIn: !!token, // `token` varsa true, yoksa false
        token, // Token'ı da dışarıya açıyoruz, böylece API isteklerinde kullanabiliriz
        user,
        login,
        logout,
        signup,
        cartItems,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        clearCart,
        cartTotal: cartItems.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        ),
        cartItemCount: cartItems.reduce(
          (count, item) => count + item.quantity,
          0
        ),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
