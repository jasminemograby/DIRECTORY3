// Component - CSV Error Row
// Displays a single row's errors with correction capability

import React, { useState } from 'react';

function CSVErrorRow({ rowNumber, errors, rowData, onCorrection }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [corrections, setCorrections] = useState({});

  const handleCorrectionChange = (column, value) => {
    setCorrections(prev => ({
      ...prev,
      [column]: value
    }));
  };

  const handleApplyCorrections = () => {
    if (onCorrection) {
      onCorrection(rowNumber, corrections);
    }
  };

  if (!errors || errors.length === 0) {
    return null;
  }

  return (
    <div className="border border-red-200 rounded-lg p-4 mb-3 bg-white">
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div>
          <p className="font-semibold text-red-800">
            Row {rowNumber} - {errors.length} error{errors.length > 1 ? 's' : ''}
          </p>
          <p className="text-sm text-red-600 mt-1">
            {errors.map(e => e.column).join(', ')}
          </p>
        </div>
        <svg
          className={`w-5 h-5 text-red-600 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-3">
          {errors.map((error, index) => (
            <div key={index} className="p-3 bg-red-50 rounded border border-red-100">
              <p className="text-sm font-medium text-red-800 mb-1">
                Column: <span className="font-mono">{error.column}</span>
              </p>
              <p className="text-sm text-red-600 mb-2">{error.message}</p>
              
              {error.type === 'missing_field' && (
                <div className="mt-2">
                  <input
                    type="text"
                    placeholder={`Enter ${error.column}`}
                    value={corrections[error.column] || ''}
                    onChange={(e) => handleCorrectionChange(error.column, e.target.value)}
                    className="w-full px-3 py-2 border border-red-300 rounded text-sm"
                  />
                </div>
              )}
              
              {error.type === 'invalid_format' && (
                <div className="mt-2">
                  <input
                    type="text"
                    placeholder={`Correct ${error.column}`}
                    value={corrections[error.column] || (rowData?.[error.column] || '')}
                    onChange={(e) => handleCorrectionChange(error.column, e.target.value)}
                    className="w-full px-3 py-2 border border-red-300 rounded text-sm"
                  />
                </div>
              )}
            </div>
          ))}

          {Object.keys(corrections).length > 0 && (
            <button
              onClick={handleApplyCorrections}
              className="mt-3 px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors text-sm font-medium"
            >
              Apply Corrections
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default CSVErrorRow;

