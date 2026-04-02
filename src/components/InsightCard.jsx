import React from 'react';

const InsightCard = ({ title, children, className = '' }) => {
  return (
    <div
      className={`bg-white dark:bg-dark-card rounded-lg p-6 border border-gray-200 dark:border-gray-700 ${className}`}
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
      {children}
    </div>
  );
};

export default InsightCard;
