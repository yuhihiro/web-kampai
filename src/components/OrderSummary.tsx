import React, { useState } from 'react';
import { useOrderStore } from '../store/orderStore';
import { PaymentModal } from './PaymentModal';
import type { PaymentMethod } from './PaymentModal';

export const OrderSummary: React.FC = () => {
  const { items, removeItem, generateToken, customerName, setCustomerName, setPaymentMethod, paymentMethod } = useOrderStore();
  const [showToken, setShowToken] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleFinalizeOrder = () => {
    if (items.length === 0 || !customerName.trim()) return;
    
    // Show payment modal instead of directly generating token
    setShowPaymentModal(true);
  };

  const handlePaymentConfirm = (paymentMethod: PaymentMethod) => {
    setPaymentMethod(paymentMethod);
    setShowPaymentModal(false);
    
    // Generate token after payment method is selected
    generateToken();
    setShowToken(true);
    
    // Animação do token
    const tokenElement = document.querySelector('.token-display');
    if (tokenElement) {
      tokenElement.classList.add('token-animation');
    }
    
    setTimeout(() => {
      setShowToken(false);
    }, 10000);
  };

  return (
    <div className="bg-neutral-900 rounded-3xl shadow-2xl p-4 sm:p-8 border border-neutral-800 relative overflow-hidden text-white">
      {/* Elementos decorativos de fundo */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-red-50 to-orange-50 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-linear-to-tr from-green-50 to-blue-50 rounded-full translate-y-12 -translate-x-12 opacity-50"></div>
      
      <div className="relative z-10">
        {/* Header do Resumo */}
        <div className="flex items-center mb-8 gap-4 sm:gap-0 sm:flex-row flex-col sm:items-center">
          <div className="bg-linear-to-r from-red-500 to-red-600 text-white p-3 rounded-2xl shadow-lg sm:mr-4">
            <div className="text-3xl">📋</div>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">
              Resumo do Pedido
            </h2>
            <p className="text-gray-400 font-medium">Revise e finalize o pedido</p>
          </div>
        </div>
        
        {/* Campo do Cliente */}
        <div className="mb-8">
          <label className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            <div className="text-xl mr-2">👤</div>
            Nome do Cliente
          </label>
          <div className="relative">
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-6 py-4 border-2 border-neutral-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-lg transition-all bg-neutral-800 text-white shadow-inner"
              placeholder="Digite o nome do cliente"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
              ✏️
            </div>
          </div>
        </div>

        {/* Lista de Itens */}
        <div className="space-y-4 mb-8 max-h-[60vh] sm:max-h-96 overflow-y-auto custom-scrollbar">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <div className="relative inline-block mb-6">
                <div className="text-8xl opacity-20">🍽️</div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-4xl">❓</div>
                </div>
              </div>
              <p className="text-gray-300 text-xl font-medium mb-2">Nenhum item selecionado</p>
              <p className="text-gray-400 text-sm">Selecione itens do cardápio para começar</p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="group bg-linear-to-r from-neutral-900 to-neutral-800 rounded-2xl border border-neutral-700 hover:border-red-400 hover:shadow-lg transition-all duration-300 p-5">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-bold text-white text-lg mb-1 group-hover:text-red-400 transition-colors">
                        {item.name}
                        {item.quantity > 1 && <span className="text-red-400 ml-2">x{item.quantity}</span>}
                      </div>
                      <div className="text-sm text-gray-300 font-medium bg-neutral-800 px-3 py-1 rounded-full inline-block">
                        {item.category}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="bg-linear-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-xl font-bold shadow-lg">
                        R$ {(item.price * item.quantity).toFixed(2)}
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="bg-red-900/30 text-red-400 hover:bg-red-900/50 hover:text-red-300 hover:scale-110 font-bold text-xl w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow-md group-hover:rotate-12"
                        title="Remover item"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Payment Method */}
        {paymentMethod && (
          <div className="bg-linear-to-r from-blue-50 to-purple-50 rounded-2xl p-4 mb-6 border-2 border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="text-2xl mr-3">
                  {paymentMethod === 'pix' ? '📱' : paymentMethod === 'credit' ? '💳' : '💰'}
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-semibold">Forma de Pagamento</p>
                  <p className="font-bold text-gray-900">
                    {paymentMethod === 'pix' ? 'PIX' : paymentMethod === 'credit' ? 'Cartão de Crédito' : 'Cartão de Débito'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPaymentModal(true)}
                className="text-blue-600 hover:text-blue-800 font-semibold text-sm underline"
              >
                Alterar
              </button>
            </div>
          </div>
        )}

        {/* Total e Botão de Finalização */}
        <div className="bg-linear-to-r from-neutral-900 to-neutral-800 rounded-2xl p-6 border-2 border-neutral-700">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <div className="text-3xl mr-3">💰</div>
              <span className="text-2xl font-bold text-white">Total do Pedido</span>
            </div>
            <div className="bg-linear-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-2xl font-bold text-2xl sm:text-3xl shadow-xl">
              R$ {total.toFixed(2)}
            </div>
          </div>

          <button
            onClick={handleFinalizeOrder}
            disabled={items.length === 0 || !customerName.trim()}
            className={`w-full py-5 px-6 sm:px-8 rounded-2xl font-bold text-lg sm:text-xl transition-all duration-300 flex items-center justify-center space-x-3 ${
              items.length === 0 || !customerName.trim()
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-linear-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 hover:scale-105 shadow-2xl hover:shadow-red-200'
            }`}
          >
            <div className="text-2xl">🎯</div>
            <span>Finalizar Pedido</span>
          </button>
        </div>

        {/* Mensagem de Sucesso */}
        {showToken && (
          <div className="mt-8 p-6 bg-linear-to-r from-green-50 via-green-100 to-emerald-50 border-2 border-green-300 rounded-2xl animate-fadeIn shadow-lg">
            <div className="text-center">
              <div className="text-6xl mb-4 animate-bounce">🎉</div>
              <p className="text-green-800 font-bold text-2xl mb-2">
                Pedido finalizado com sucesso!
              </p>
              <p className="text-green-700 text-lg font-medium mb-4">
                Token de atendimento gerado no cabeçalho
              </p>
              {paymentMethod !== 'pix' && (
                <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4 mb-4 inline-block">
                  <p className="text-yellow-800 font-semibold text-sm mb-1">📱 Ação necessária</p>
                  <p className="text-yellow-900 font-bold">
                    Encaminhe o cliente à maquininha ao lado para realizar o pagamento
                  </p>
                </div>
              )}
              {paymentMethod && (
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 inline-block mb-4">
                  <p className="text-green-600 text-sm font-semibold mb-1">
                    💳 Forma de pagamento:
                  </p>
                  <p className="text-green-800 font-bold">
                    {paymentMethod === 'pix' ? 'PIX' : paymentMethod === 'credit' ? 'Cartão de Crédito' : 'Cartão de Débito'}
                  </p>
                </div>
              )}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 inline-block">
                <p className="text-green-600 text-sm font-semibold">
                  🎫 Anote o token para o cliente
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onConfirm={handlePaymentConfirm}
        total={total}
      />
    </div>
  );
};