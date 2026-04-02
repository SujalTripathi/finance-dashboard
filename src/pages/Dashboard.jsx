import React, { useState, useEffect } from 'react';
import { Wallet, TrendingUp, TrendingDown, PiggyBank } from 'lucide-react';
import KPICard from '../components/KPICard';
import BalanceTrend from '../components/Charts/BalanceTrend';
import SpendingDonut from '../components/Charts/SpendingDonut';
import useStore from '../store/useStore';

const Dashboard = () => {
  const { transactions } = useStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for skeleton
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Calculate KPIs
  const calculateKPIs = () => {
    const now = new Date();
    let currentMonth = now.getMonth();
    let currentYear = now.getFullYear();
    let isShowingFallbackData = false;
    let displayMonthName = '';

    // This month's transactions
    let thisMonthTransactions = transactions.filter((t) => {
      const tDate = new Date(t.date);
      return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
    });

    // If no transactions for current month, find the most recent month with data
    if (thisMonthTransactions.length === 0 && transactions.length > 0) {
      isShowingFallbackData = true;
      // Sort transactions by date descending to get the most recent
      const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
      const mostRecentDate = new Date(sortedTransactions[0].date);
      currentMonth = mostRecentDate.getMonth();
      currentYear = mostRecentDate.getFullYear();

      // Format the month name
      displayMonthName = mostRecentDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

      // Get transactions for the most recent month
      thisMonthTransactions = transactions.filter((t) => {
        const tDate = new Date(t.date);
        return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
      });
    }

    // Last month's transactions (relative to the month we're showing)
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const lastMonthTransactions = transactions.filter((t) => {
      const tDate = new Date(t.date);
      return tDate.getMonth() === lastMonth && tDate.getFullYear() === lastMonthYear;
    });

    // Calculate totals
    const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpenses;

    const monthlyIncome = thisMonthTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const monthlyExpenses = thisMonthTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const lastMonthIncome = lastMonthTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const lastMonthExpenses = lastMonthTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100 : 0;

    // Calculate deltas
    const balanceDelta = lastMonthIncome - lastMonthExpenses > 0
      ? (((balance - (lastMonthIncome - lastMonthExpenses)) / (lastMonthIncome - lastMonthExpenses)) * 100)
      : 0;

    const incomeDelta = lastMonthIncome > 0
      ? (((monthlyIncome - lastMonthIncome) / lastMonthIncome) * 100)
      : 0;

    const expenseDelta = lastMonthExpenses > 0
      ? (((monthlyExpenses - lastMonthExpenses) / lastMonthExpenses) * 100)
      : 0;

    const lastMonthSavingsRate = lastMonthIncome > 0
      ? ((lastMonthIncome - lastMonthExpenses) / lastMonthIncome) * 100
      : 0;

    const savingsDelta = savingsRate - lastMonthSavingsRate;

    return {
      balance,
      balanceDelta: parseFloat(balanceDelta.toFixed(1)),
      monthlyIncome,
      incomeDelta: parseFloat(incomeDelta.toFixed(1)),
      monthlyExpenses,
      expenseDelta: parseFloat(expenseDelta.toFixed(1)),
      savingsRate,
      savingsDelta: parseFloat(savingsDelta.toFixed(1)),
      isShowingFallbackData,
      displayMonthName,
    };
  };

  const kpis = calculateKPIs();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Fallback Data Warning */}
      {kpis.isShowingFallbackData && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 flex items-center gap-2">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-sm text-blue-800 dark:text-blue-300">
            <span className="font-semibold">Showing {kpis.displayMonthName} data</span> — No transactions found for current month
          </p>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Balance"
          value={kpis.balance}
          delta={kpis.balanceDelta}
          icon={Wallet}
          isLoading={isLoading}
        />
        <KPICard
          title="Monthly Income"
          value={kpis.monthlyIncome}
          delta={kpis.incomeDelta}
          icon={TrendingUp}
          isLoading={isLoading}
        />
        <KPICard
          title="Monthly Expenses"
          value={kpis.monthlyExpenses}
          delta={kpis.expenseDelta}
          icon={TrendingDown}
          isLoading={isLoading}
        />
        <KPICard
          title="Savings Rate"
          value={kpis.savingsRate}
          prefix=""
          suffix="%"
          delta={kpis.savingsDelta}
          icon={PiggyBank}
          isLoading={isLoading}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BalanceTrend />
        <SpendingDonut />
      </div>
    </div>
  );
};

export default Dashboard;
