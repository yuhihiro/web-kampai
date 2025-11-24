import React, { useState } from 'react';

export type PaymentMethod = 'pix' | 'credit' | 'debit' | null;

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (paymentMethod: PaymentMethod) => void;
  total: number;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onConfirm, total }) => {
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(null);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (selectedPayment) {
      onConfirm(selectedPayment);
      setSelectedPayment(null);
    }
  };

  const paymentMethods = [
    {
      id: 'pix' as PaymentMethod,
      name: 'PIX',
      icon: '📱',
      description: 'Pagamento instantâneo via PIX',
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'credit' as PaymentMethod,
      name: 'Cartão de Crédito',
      icon: '💳',
      description: 'Parcelamento disponível',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'debit' as PaymentMethod,
      name: 'Cartão de Débito',
      icon: '💰',
      description: 'Débito em conta',
      color: 'from-purple-500 to-purple-600'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4 animate-slideInUp border border-gray-100">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4 animate-bounce">💳</div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-red-600 bg-clip-text text-transparent mb-2">
            Forma de Pagamento
          </h2>
          <p className="text-gray-600">Escolha como deseja pagar</p>
        </div>

        {/* Total */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-4 mb-6 text-center">
          <p className="text-gray-600 text-sm mb-1">Total do pedido</p>
          <p className="text-3xl font-bold text-red-600">R$ {total.toFixed(2)}</p>
        </div>

        {/* Payment Methods */}
        <div className="space-y-3 mb-8">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => setSelectedPayment(method.id)}
              className={`w-full p-4 rounded-2xl border-2 transition-all duration-300 flex items-center space-x-4 ${
                selectedPayment === method.id
                  ? 'border-red-500 bg-red-50 shadow-lg scale-105'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="text-3xl">{method.icon}</div>
              <div className="flex-1 text-left">
                <h3 className="font-bold text-gray-900">{method.name}</h3>
                <p className="text-sm text-gray-600">{method.description}</p>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                selectedPayment === method.id
                  ? 'border-red-500 bg-red-500'
                  : 'border-gray-300'
              }`}>
                {selectedPayment === method.id && (
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-6 rounded-2xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all duration-200"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedPayment}
            className={`flex-1 py-3 px-6 rounded-2xl font-bold text-white transition-all duration-200 ${
              selectedPayment
                ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 hover:scale-105 shadow-lg'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};