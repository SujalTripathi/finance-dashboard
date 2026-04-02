import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mockTransactions } from '../data/mockData';

const useStore = create(
  persist(
    (set, get) => ({
      // State
      transactions: mockTransactions,
      role: 'admin', // 'viewer' | 'admin'
      theme: 'dark', // 'light' | 'dark'
      activePage: 'dashboard', // 'dashboard' | 'transactions' | 'insights'
      filters: {
        search: '',
        type: 'all', // 'all' | 'income' | 'expense'
        sortBy: 'date-desc', // 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'
      },

      // Actions
      addTransaction: (transaction) =>
        set((state) => ({
          transactions: [
            {
              ...transaction,
              id: Date.now().toString(),
            },
            ...state.transactions,
          ],
        })),

      editTransaction: (id, updatedTransaction) =>
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, ...updatedTransaction } : t
          ),
        })),

      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),

      setRole: (role) => set({ role }),

      setTheme: (theme) => {
        set({ theme });
        // Update document class for dark mode
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },

      setActivePage: (page) => set({ activePage: page }),

      setFilters: (filters) =>
        set((state) => ({
          filters: { ...state.filters, ...filters },
        })),

      resetFilters: () =>
        set({
          filters: {
            search: '',
            type: 'all',
            sortBy: 'date-desc',
          },
        }),

      // Computed getters
      getFilteredTransactions: () => {
        const { transactions, filters } = get();
        let filtered = [...transactions];

        // Filter by type
        if (filters.type !== 'all') {
          filtered = filtered.filter((t) => t.type === filters.type);
        }

        // Filter by search
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          filtered = filtered.filter(
            (t) =>
              t.description.toLowerCase().includes(searchLower) ||
              t.category.toLowerCase().includes(searchLower)
          );
        }

        // Sort
        if (filters.sortBy === 'date-desc') {
          filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        } else if (filters.sortBy === 'date-asc') {
          filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
        } else if (filters.sortBy === 'amount-desc') {
          filtered.sort((a, b) => b.amount - a.amount);
        } else if (filters.sortBy === 'amount-asc') {
          filtered.sort((a, b) => a.amount - b.amount);
        }

        return filtered;
      },
    }),
    {
      name: 'finance-dashboard-storage',
      partialize: (state) => ({
        transactions: state.transactions,
        role: state.role,
        theme: state.theme,
      }),
    }
  )
);

// Initialize theme on load
if (typeof window !== 'undefined') {
  const storedState = localStorage.getItem('finance-dashboard-storage');
  if (storedState) {
    const { state } = JSON.parse(storedState);
    if (state.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } else {
    // Default to dark theme
    document.documentElement.classList.add('dark');
  }
}

export default useStore;
