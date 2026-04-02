import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import useStore from '../../store/useStore';
import { categoryColors } from '../../data/mockData';

const SpendingDonut = () => {
  const { transactions, theme } = useStore();
  const isDark = theme === 'dark';

  // Calculate spending by category (expenses only)
  const calculateCategorySpending = () => {
    const categoryTotals = {};

    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        if (categoryTotals[t.category]) {
          categoryTotals[t.category] += t.amount;
        } else {
          categoryTotals[t.category] = t.amount;
        }
      });

    return Object.keys(categoryTotals).map((category) => ({
      name: category,
      value: categoryTotals[category],
      color: categoryColors[category] || '#888888',
    }));
  };

  const data = calculateCategorySpending();

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {payload[0].name}
          </p>
          <p className="text-sm font-semibold" style={{ color: payload[0].payload.color }}>
            ₹{payload[0].value.toLocaleString('en-IN')}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {((payload[0].value / data.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  const renderLegend = (props) => {
    const { payload } = props;
    return (
      <div className="flex flex-wrap gap-3 justify-center mt-4">
        {payload.map((entry, index) => (
          <div key={`legend-${index}`} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs text-gray-700 dark:text-gray-300">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-dark-card rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Spending by Category
      </h3>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={renderLegend} />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500 dark:text-gray-400">No expense data available</p>
        </div>
      )}
    </div>
  );
};

export default SpendingDonut;
