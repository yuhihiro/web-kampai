import React from 'react';
import { useOrderStore } from '../store/orderStore';

interface HeaderProps {
  onNewOrder: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNewOrder }) => {
  const { token, customerName } = useOrderStore();

  return (
    <header className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white shadow-2xl relative overflow-hidden">
      {/* Elementos decorativos de fundo */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-transparent"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
      
      <div className="container mx-auto px-6 py-8 relative z-10">
        <div className="flex justify-between items-center">
          {/* Logo e Título */}
          <div className="flex items-center space-x-6">
            <div className="bg-white/20 backdrop-blur-sm p-2 rounded-2xl shadow-lg">
              {(() => {
                const file = 'logo.jpeg';
                const logoSrc = `${import.meta.env.BASE_URL}${encodeURIComponent(file)}`;
                return (
                  <img
                    src={logoSrc}
                    alt="Logo"
                    className="w-16 h-16 rounded-xl object-cover animate-float"
                  />
                );
              })()}
            </div>
            <div className="space-y-1">
              <h1 className="text-4xl font-bold text-white tracking-tight">
                Kampai Box
              </h1>
              <p className="text-red-100 text-lg font-medium tracking-wide">
                Sistema de Atendimento Digital
              </p>
            </div>
          </div>
          
          {/* Informações do Pedido */}
          <div className="flex items-center space-x-6">
            {token && (
              <div className="bg-white/95 backdrop-blur-sm text-red-700 px-8 py-4 rounded-2xl shadow-xl border border-white/20 animate-fadeIn">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">🎯</div>
                  <div>
                    <div className="text-xs font-semibold text-red-600 uppercase tracking-wider">Token</div>
                    <div className="text-2xl font-bold font-mono">{token}</div>
                  </div>
                </div>
              </div>
            )}
            
            {customerName && (
              <div className="bg-white/90 backdrop-blur-sm text-gray-800 px-6 py-3 rounded-xl shadow-lg">
                <div className="flex items-center space-x-2">
                  <div className="text-lg">👤</div>
                  <div>
                    <div className="text-xs font-semibold text-gray-600">Cliente</div>
                    <div className="font-semibold">{customerName}</div>
                  </div>
                </div>
              </div>
            )}
            
            <button
              onClick={onNewOrder}
              className="bg-white text-red-700 px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center space-x-3 border-2 border-white/50 hover:border-white"
            >
              <div className="text-2xl">🔄</div>
              <span>Novo Pedido</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};