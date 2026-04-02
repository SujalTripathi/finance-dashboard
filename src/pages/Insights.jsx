import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  TrendingUp,
  Target,
  Receipt,
  UtensilsCrossed,
  Plane,
  Lightbulb,
  Film,
  Briefcase,
  Wallet,
} from 'lucide-react';
import InsightCard from '../components/InsightCard';
import MonthlyComparison from '../components/Charts/MonthlyComparison';
import IncomeExpenseBar from '../components/Charts/IncomeExpenseBar';
import useStore from '../store/useStore';

const categoryIconMap = {
  Food: UtensilsCrossed,
  Travel: Plane,
  Shopping: ShoppingBag,
  Utilities: Lightbulb,
  Entertainment: Film,
  Investments: TrendingUp,
  Salary: Wallet,
  Freelance: Briefcase,
};

const Insights = () => {
  const { transactions } = useStore();
  const [animatedProgress, setAnimatedProgress] = useState(0);

  // Calculate insights
  const calculateInsights = () => {
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

    // Category spending this month (expenses only)
    const categorySpending = {};
    thisMonthTransactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        if (categorySpending[t.category]) {
          categorySpending[t.category] += t.amount;
        } else {
          categorySpending[t.category] = t.amount;
        }
      });

    // Top spending category
    let topCategory = null;
    let topAmount = 0;
    Object.keys(categorySpending).forEach((cat) => {
      if (categorySpending[cat] > topAmount) {
        topAmount = categorySpending[cat];
        topCategory = cat;
      }
    });

    // Biggest transaction this month
    const biggestExpense = thisMonthTransactions
      .filter((t) => t.type === 'expense')
      .reduce((max, t) => (t.amount > (max?.amount || 0) ? t : max), null);

    // Savings calculation
    const thisMonthIncome = thisMonthTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const thisMonthExpenses = thisMonthTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const savings = thisMonthIncome - thisMonthExpenses;
    const savingsGoal = 20000;
    const savingsProgress = (savings / savingsGoal) * 100;

    return {
      topCategory,
      topAmount,
      biggestExpense,
      savings,
      savingsGoal,
      savingsProgress: Math.min(savingsProgress, 100),
      isShowingFallbackData,
      displayMonthName,
    };
  };

  const insights = calculateInsights();
  const TopCategoryIcon = insights.topCategory ? categoryIconMap[insights.topCategory] : ShoppingBag;

  // Animate progress bar on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(insights.savingsProgress);
    }, 100);
    return () => clearTimeout(timer);
  }, [insights.savingsProgress]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Insights</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Detailed analysis of your financial health
        </p>
      </div>

      {/* Fallback Data Warning */}
      {insights.isShowingFallbackData && (
        <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 flex items-center gap-2">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-sm text-blue-800 dark:text-blue-300">
            <span className="font-semibold">Showing {insights.displayMonthName} data</span> — No transactions found for current month
          </p>
        </div>
      )}

      {/* Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Spending Category */}
        <InsightCard title="Top Spending Category">
          {insights.topCategory ? (
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-full bg-primary/10">
                <TopCategoryIcon className="text-primary" size={32} />
              </div>
              <div>
                <h4 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {insights.topCategory}
                </h4>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  ₹{insights.topAmount.toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No expense data for this month</p>
          )}
        </InsightCard>

        {/* Savings Goal */}
        <InsightCard title="Savings Goal">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Current Progress</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {insights.savingsProgress.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
              <div
                className="bg-success h-full rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${animatedProgress}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                ₹{insights.savings.toLocaleString('en-IN')}
              </span>
              <span className="text-gray-600 dark:text-gray-400">
                ₹{insights.savingsGoal.toLocaleString('en-IN')}
              </span>
            </div>
            {insights.savings >= insights.savingsGoal && (
              <div className="mt-2 p-3 bg-success/10 rounded-md">
                <p className="text-sm font-medium text-success">
                  Congratulations! You've reached your savings goal! 🎉
                </p>
              </div>
            )}
          </div>
        </InsightCard>

        {/* Monthly Comparison */}
        <InsightCard title="Monthly Comparison">
          <MonthlyComparison />
        </InsightCard>

        {/* Biggest Transaction */}
        <InsightCard title="Biggest Transaction This Month">
          {insights.biggestExpense ? (
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {insights.biggestExpense.description}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {new Date(insights.biggestExpense.date).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-danger">
                    ₹{insights.biggestExpense.amount.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                  {insights.biggestExpense.category}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No expenses recorded this month</p>
          )}
        </InsightCard>
      </div>

      {/* Income vs Expense Chart - Full Width */}
      <div className="mt-6">
        <IncomeExpenseBar />
      </div>
    </div>
  );
};

export default Insights;
