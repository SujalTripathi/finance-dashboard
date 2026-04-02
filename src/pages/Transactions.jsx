import React, { useState } from 'react';
import { Plus, Download } from 'lucide-react';
import TransactionTable from '../components/TransactionTable';
import TransactionModal from '../components/TransactionModal';
import useStore from '../store/useStore';

const Transactions = () => {
  const { role, getFilteredTransactions } = useStore();
  const [modalOpen, setModalOpen] = useState(false);

  const handleExportCSV = () => {
    const transactions = getFilteredTransactions();

    if (transactions.length === 0) {
      alert('No transactions to export');
      return;
    }

    // Create CSV content
    const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
    const rows = transactions.map((t) => [
      t.date,
      `"${t.description}"`,
      t.category,
      t.type,
      t.amount,
    ]);

    const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `transactions_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transactions</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Manage and track all your financial transactions
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <Download size={18} />
            Export CSV
          </button>
          {role === 'admin' && (
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              <Plus size={18} />
              Add Transaction
            </button>
          )}
        </div>
      </div>

      {/* Transaction Table */}
      <TransactionTable />

      {/* Add Transaction Modal */}
      <TransactionModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default Transactions;
