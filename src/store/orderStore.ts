import { create } from 'zustand';

interface OrderItem {
  id: string;
  name: string;
  category: string;
  price: number;
}

interface OrderState {
  items: OrderItem[];
  token: string | null;
  customerName: string;
  addItem: (item: Omit<OrderItem, 'id'> & { id?: string }) => void;
  removeItem: (itemId: string) => void;
  clearOrder: () => void;
  generateToken: () => void;
  setCustomerName: (name: string) => void;
}

export const useOrderStore = create<OrderState>((set) => ({
  items: [],
  token: null,
  customerName: '',
  addItem: (item) => set((state) => ({ 
    items: [
      ...state.items,
      {
        id: item.id ?? (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`),
        name: item.name,
        category: item.category,
        price: item.price,
      }
    ] 
  })),
  removeItem: (itemId) => set((state) => ({ 
    items: state.items.filter(item => item.id !== itemId) 
  })),
  clearOrder: () => set({ items: [], token: null }),
  generateToken: () => {
    const token = Math.random().toString(36).substr(2, 6).toUpperCase();
    set({ token });
  },
  setCustomerName: (name) => set({ customerName: name })
}));