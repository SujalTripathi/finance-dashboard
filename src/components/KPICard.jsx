import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const KPICard = ({ title, value, prefix = '₹', suffix = '', delta, icon: Icon, isLoading = false }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const isDeltaPositive = delta >= 0;

  useEffect(() => {
    if (isLoading) return;

    const duration = 1000; // 1 second
    const steps = 60;
    const stepValue = value / steps;
    const stepDuration = duration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      if (currentStep <= steps) {
        setDisplayValue(Math.floor(stepValue * currentStep));
      } else {
        setDisplayValue(value);
        clearInterval(timer);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [value, isLoading]);

  const formatValue = (val) => {
    if (suffix === '%') {
      return val.toFixed(0);
    }
    return val.toLocaleString('en-IN');
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-dark-card rounded-lg p-6 border border-gray-200 dark:border-gray-700 animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
          <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
      </div>
    );
  }

  return (
    <div className="group relative bg-white dark:bg-dark-card rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-success/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</h3>
          {Icon && (
            <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
              <Icon className="text-primary" size={20} />
            </div>
          )}
        </div>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-3xl font-bold text-gray-900 dark:text-white animate-count">
            {prefix}
            {formatValue(displayValue)}
            {suffix}
          </span>
        </div>
        {delta !== undefined && delta !== null && (
          <div className="flex items-center gap-1">
            {isDeltaPositive ? (
              <TrendingUp className="text-success" size={16} />
            ) : (
              <TrendingDown className="text-danger" size={16} />
            )}
            <span
              className={`text-sm font-medium ${
                isDeltaPositive ? 'text-success' : 'text-danger'
              }`}
            >
              {isDeltaPositive ? '+' : ''}
              {delta}% vs last month
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default KPICard;
