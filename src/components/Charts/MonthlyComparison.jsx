import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import useStore from '../../store/useStore';

const MonthlyComparison = () => {
  const { transactions, theme } = useStore();
  const isDark = theme === 'dark';

  // Calculate this month vs last month expenses
  const calculateMonthlyComparison = () => {
    const now = new Date();
    let currentMonth = now.getMonth();
    let currentYear = now.getFullYear();

    // Check if current month has transactions
    let currentMonthTransactions = transactions.filter((t) => {
      const tDate = new Date(t.date);
      return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
    });

    // If no transactions for current month, find the most recent month with data
    if (currentMonthTransactions.length === 0 && transactions.length > 0) {
      const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
      const mostRecentDate = new Date(sortedTransactions[0].date);
      currentMonth = mostRecentDate.getMonth();
      currentYear = mostRecentDate.getFullYear();
    }

    const thisMonthExpenses = transactions
      .filter((t) => {
        const tDate = new Date(t.date);
        return (
          t.type === 'expense' &&
          tDate.getMonth() === currentMonth &&
          tDate.getFullYear() === currentYear
        );
      })
      .reduce((sum, t) => sum + t.amount, 0);

    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const lastMonthExpenses = transactions
      .filter((t) => {
        const tDate = new Date(t.date);
        return (
          t.type === 'expense' &&
          tDate.getMonth() === lastMonth &&
          tDate.getFullYear() === lastMonthYear
        );
      })
      .reduce((sum, t) => sum + t.amount, 0);

    return [
      { month: 'Last Month', expenses: lastMonthExpenses },
      { month: 'This Month', expenses: thisMonthExpenses },
    ];
  };

  const data = calculateMonthlyComparison();

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {payload[0].payload.month}
          </p>
          <p className="text-sm font-semibold text-danger">
            ₹{payload[0].value.toLocaleString('en-IN')}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
        <XAxis
          dataKey="month"
          stroke={isDark ? '#9ca3af' : '#6b7280'}
          style={{ fontSize: '12px' }}
        />
        <YAxis
          stroke={isDark ? '#9ca3af' : '#6b7280'}
          style={{ fontSize: '12px' }}
          tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="expenses" fill="#ef5350" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default MonthlyComparison;
