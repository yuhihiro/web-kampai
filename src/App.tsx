import { useState } from 'react';
import { Header } from './components/Header';
import { Menu } from './components/Menu';
import { OrderSummary } from './components/OrderSummary';
import { useOrderStore } from './store/orderStore';

function App() {
  const { clearOrder } = useOrderStore();
  const [showWelcome, setShowWelcome] = useState(true);

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      {showWelcome ? (
        <div className="min-h-screen bg-linear-to-br from-neutral-900 via-neutral-950 to-black flex items-center justify-center px-4 sm:px-6 animate-fadeIn">
          <div className="text-center max-w-4xl mx-auto">
            {/* Logo Animada */}
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-linear-to-r from-red-600 to-red-400 rounded-full blur-3xl opacity-30 animate-pulse"></div>
              <div className="relative bg-white rounded-full p-2 shadow-2xl border-4 border-white">
                {(() => {
                  const file = 'logo.jpeg';
                  const logoSrc = `${import.meta.env.BASE_URL}${encodeURIComponent(file)}`;
                  return (
                    <img
                      src={logoSrc}
                      alt="Logo"
                      className="w-40 h-40 rounded-full object-cover animate-float"
                    />
                  );
                })()}
              </div>
            </div>
            
            {/* Título Principal */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white mb-6 tracking-tight">
              Kanpai Box
            </h1>
            {/* Botão Principal */}
            <button
              onClick={() => { clearOrder(); setShowWelcome(false); }}
              className="group relative bg-linear-to-r from-red-500 to-red-600 text-white px-8 md:px-12 py-5 md:py-6 rounded-3xl font-bold text-xl md:text-2xl shadow-2xl hover:shadow-red-500/25 hover:scale-105 transition-all duration-300 flex items-center space-x-4 mx-auto"
            >
              <div className="text-3xl group-hover:animate-pulse">🚀</div>
              <span>Iniciar Novo Pedido</span>
              <div className="text-xl group-hover:translate-x-2 transition-transform">→</div>
            </button>
            
            
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="lg:col-span-2">
              <Menu />
            </div>
            <div className="lg:col-span-1">
              <OrderSummary />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
