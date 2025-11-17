// Component - CSV Error Display
// Displays all CSV errors grouped by row with correction interface

import React from 'react';
import CSVErrorRow from './CSVErrorRow';

function CSVErrorDisplay({ validation, onCorrection }) {
  if (!validation || !validation.errors || validation.errors.length === 0) {
    return null;
  }

  // Group errors by row
  const errorsByRow = {};
  validation.errors.forEach(error => {
    if (!errorsByRow[error.row]) {
      errorsByRow[error.row] = [];
    }
    errorsByRow[error.row].push(error);
  });

  const rowNumbers = Object.keys(errorsByRow).sort((a, b) => parseInt(a) - parseInt(b));

  return (
    <div className="w-full max-w-4xl mx-auto mt-6">
      <div className="p-6 rounded-lg bg-red-50 border border-red-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-red-800">
            Errors Found ({validation.errors.length})
          </h3>
          <span className="text-sm text-red-600">
            {rowNumbers.length} row{rowNumbers.length > 1 ? 's' : ''} with errors
          </span>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {rowNumbers.map(rowNumber => (
            <CSVErrorRow
              key={rowNumber}
              rowNumber={parseInt(rowNumber)}
              errors={errorsByRow[rowNumber]}
              onCorrection={onCorrection}
            />
          ))}
        </div>

        <div className="mt-4 p-3 bg-red-100 rounded border border-red-200">
          <p className="text-sm text-red-800">
            <strong>Note:</strong> Please correct all errors before proceeding. You can expand each row to see details and provide corrections.
          </p>
        </div>
      </div>
    </div>
  );
}

export default CSVErrorDisplay;

