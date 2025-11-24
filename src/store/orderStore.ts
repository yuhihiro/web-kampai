import { create } from 'zustand';
import type { PaymentMethod } from '../components/PaymentModal';

interface OrderItem {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
}

interface OrderState {
  items: OrderItem[];
  token: string | null;
  customerName: string;
  paymentMethod: PaymentMethod;
  addItem: (item: Omit<OrderItem, 'id' | 'quantity'> & { id?: string; quantity?: number }) => void;
  removeItem: (itemId: string) => void;
  updateItemQuantity: (itemId: string, quantity: number) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  clearOrder: () => void;
  generateToken: () => void;
  setCustomerName: (name: string) => void;
}

export const useOrderStore = create<OrderState>((set) => ({
  items: [],
  token: null,
  customerName: '',
  paymentMethod: null,
  addItem: (item) => set((state) => {
    const existingItem = state.items.find(i => i.name === item.name && i.category === item.category);
    if (existingItem) {
      return {
        items: state.items.map(i => 
          i.id === existingItem.id 
            ? { ...i, quantity: i.quantity + (item.quantity || 1) }
            : i
        )
      };
    }
    return { 
      items: [
        ...state.items,
        {
          id: item.id ?? (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`),
          name: item.name,
          category: item.category,
          price: item.price,
          quantity: item.quantity || 1,
        }
      ] 
    };
  }),
  removeItem: (itemId) => set((state) => ({ 
    items: state.items.filter(item => item.id !== itemId) 
  })),
  updateItemQuantity: (itemId, quantity) => set((state) => ({
    items: state.items.map(item => 
      item.id === itemId 
        ? { ...item, quantity: Math.max(1, quantity) }
        : item
    )
  })),
  setPaymentMethod: (method) => set({ paymentMethod: method }),
  clearOrder: () => set({ items: [], token: null, paymentMethod: null }),
  generateToken: () => {
    const token = Math.random().toString(36).substr(2, 6).toUpperCase();
    set({ token });
  },
  setCustomerName: (name) => set({ customerName: name })
}));