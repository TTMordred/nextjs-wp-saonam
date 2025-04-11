'use client';

import React from 'react';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({ 
  error, 
  resetErrorBoundary 
}) => {
  return (
    <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
      <h2 className="text-xl font-bold text-red-800 mb-4">Đã xảy ra lỗi</h2>
      <p className="text-red-700 mb-4">
        Chúng tôi đã ghi nhận lỗi này và sẽ khắc phục sớm nhất có thể.
      </p>
      <details className="mb-4">
        <summary className="cursor-pointer text-red-700 font-medium">Chi tiết lỗi</summary>
        <pre className="mt-2 p-4 bg-red-100 rounded text-red-900 text-sm overflow-auto">
          {error.message}
        </pre>
      </details>
      <button
        onClick={resetErrorBoundary}
        className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-colors"
      >
        Thử lại
      </button>
    </div>
  );
};
