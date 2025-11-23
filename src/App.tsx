import { useState } from 'react';
import { Header } from './components/Header';
import { Menu } from './components/Menu';
import { OrderSummary } from './components/OrderSummary';
import { useOrderStore } from './store/orderStore';

function App() {
  const { clearOrder } = useOrderStore();
  const [showWelcome, setShowWelcome] = useState(true);

  const handleNewOrder = () => {
    clearOrder();
    setShowWelcome(false);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header onNewOrder={handleNewOrder} />
      
      {showWelcome ? (
        <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-950 to-black flex items-center justify-center px-4 animate-fadeIn">
          <div className="text-center max-w-4xl mx-auto">
            {/* Logo Animada */}
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-400 rounded-full blur-3xl opacity-30 animate-pulse"></div>
              <div className="relative bg-white rounded-full p-2 shadow-2xl border-4 border-white">
                <img
                  src={`${import.meta.env.BASE_URL}WhatsApp Image 2025-11-23 at 20.17.17.jpeg`}
                  alt="Logo"
                  className="w-40 h-40 rounded-full object-cover animate-float"
                />
              </div>
            </div>
            
            {/* Título Principal */}
            <h1 className="text-7xl font-black bg-gradient-to-r from-red-500 via-red-600 to-red-700 bg-clip-text text-transparent mb-6 tracking-tight">
              Sushi Token
            </h1>
            
            
            
            {/* Botão Principal */}
            <button
              onClick={() => setShowWelcome(false)}
              className="group relative bg-gradient-to-r from-red-500 to-red-600 text-white px-12 py-6 rounded-3xl font-bold text-2xl shadow-2xl hover:shadow-red-500/25 hover:scale-105 transition-all duration-300 flex items-center space-x-4 mx-auto"
            >
              <div className="text-3xl group-hover:animate-pulse">🚀</div>
              <span>Iniciar Novo Pedido</span>
              <div className="text-xl group-hover:translate-x-2 transition-transform">→</div>
            </button>
            
            
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
