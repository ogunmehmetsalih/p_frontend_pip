// src/components/AboutUs.js

import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

class AboutUs extends React.Component {
  render() {
    return (
      <>
        <Navbar />

        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Hakkımızda
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Müşterilerimizin güvenini kazanmak için çalışıyoruz.
              </p>
            </div>

            <div className="bg-white shadow-md rounded-lg p-8 md:p-12 mb-12">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Biz Kimiz?</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                E-Ticaret Sitesi olarak 2020 yılında kurulduk. Amacımız kullanıcıların kaliteli ve hızlı şekilde alışveriş yapabileceği güvenilir bir platform sunmaktır.
              </p>
              <p className="text-gray-700 leading-relaxed mb-6">
                Her geçen gün daha iyi hizmet vermek adına teknolojimize ve müşteri memnuniyetine odaklanıyoruz. Siz değerli müşterilerimizle birlikte büyüyoruz.
              </p>

              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Misyonumuz</h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                Tüm Türkiye'ye ulaşılabilir, sürdürülebilir ve şeffaf bir alışveriş deneyimi sunarak e-ticaretin geleceğiyle ilgili farkındalık yaratmak.
              </p>

              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Vizyonumuz</h3>
              <p className="text-gray-700 leading-relaxed">
                Bölgesel değil, global bir marka olma hedefiyle dijitalleşmeye açık herkese kapılarımızı açıyoruz.
              </p>
            </div>

            {/* Ekstra: Takım veya Misyon Görseli */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <img
                  src="https://source.unsplash.com/featured/?teamwork&auto=format&fit=crop&w=800&q=60 "
                  alt="Takımımız"
                  className="rounded-lg shadow-md w-full object-cover h-64"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Kaliteli Hizmet Anlayışımız</h3>
                <p className="text-gray-600">
                  Müşteri memnuniyeti öncelikli yaklaşımımızla, tüm süreçlerde profesyonelliği ve şeffaflığı ön planda tutuyoruz.
                </p>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </>
    );
  }
}

export default AboutUs;