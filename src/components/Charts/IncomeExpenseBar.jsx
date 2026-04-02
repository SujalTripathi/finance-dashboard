import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import useStore from '../../store/useStore';

const IncomeExpenseBar = () => {
  const { transactions, theme } = useStore();
  const isDark = theme === 'dark';

  // Calculate income vs expense for last 6 months
  const calculateIncomeExpenseData = () => {
    const monthNames = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
    const months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - i));
      return {
        month: monthNames[i],
        income: 0,
        expense: 0,
        year: date.getFullYear(),
        monthIndex: date.getMonth(),
      };
    });

    transactions.forEach((t) => {
      const tDate = new Date(t.date);
      const monthData = months.find(
        (m) => m.monthIndex === tDate.getMonth() && m.year === tDate.getFullYear()
      );
      if (monthData) {
        if (t.type === 'income') {
          monthData.income += t.amount;
        } else {
          monthData.expense += t.amount;
        }
      }
    });

    return months.map(({ month, income, expense }) => ({ month, income, expense }));
  };

  const data = calculateIncomeExpenseData();

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            {payload[0].payload.month}
          </p>
          {payload.map((item, index) => (
            <p key={index} className="text-sm font-semibold" style={{ color: item.color }}>
              {item.name}: ₹{item.value.toLocaleString('en-IN')}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-dark-card rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Income vs Expense
      </h3>
      <ResponsiveContainer width="100%" height={300}>
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
          <Legend
            wrapperStyle={{
              paddingTop: '20px',
              fontSize: '14px',
            }}
            iconType="circle"
          />
          <Bar dataKey="income" fill="#26a69a" radius={[8, 8, 0, 0]} />
          <Bar dataKey="expense" fill="#ef5350" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IncomeExpenseBar;
