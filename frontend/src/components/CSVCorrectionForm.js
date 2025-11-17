// Component - CSV Correction Form
// Allows users to correct CSV errors and resubmit

import React, { useState } from 'react';

function CSVCorrectionForm({ validation, onResubmit, onCancel }) {
  const [corrections, setCorrections] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCorrectionChange = (rowNumber, column, value) => {
    setCorrections(prev => ({
      ...prev,
      [`${rowNumber}_${column}`]: value
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Format corrections for backend
      const formattedCorrections = {};
      Object.keys(corrections).forEach(key => {
        const [row, column] = key.split('_');
        if (!formattedCorrections[row]) {
          formattedCorrections[row] = {};
        }
        formattedCorrections[row][column] = corrections[key];
      });

      if (onResubmit) {
        await onResubmit(formattedCorrections);
      }
    } catch (error) {
      console.error('Error submitting corrections:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

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

  const hasCorrections = Object.keys(corrections).length > 0;

  return (
    <div className="w-full max-w-4xl mx-auto mt-6">
      <div className="p-6 rounded-lg" style={{ background: 'var(--bg-card)' }}>
        <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          Correct CSV Errors
        </h3>

        <div className="space-y-4 max-h-96 overflow-y-auto">
          {Object.keys(errorsByRow).sort((a, b) => parseInt(a) - parseInt(b)).map(rowNumber => (
            <div key={rowNumber} className="border rounded-lg p-4" style={{ borderColor: 'var(--border-default)' }}>
              <p className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                Row {rowNumber}
              </p>
              <div className="space-y-3">
                {errorsByRow[rowNumber].map((error, index) => (
                  <div key={index} className="p-3 rounded" style={{ background: 'var(--bg-primary)' }}>
                    <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                      {error.column}: {error.message}
                    </p>
                    <input
                      type="text"
                      placeholder={`Enter correct value for ${error.column}`}
                      value={corrections[`${rowNumber}_${error.column}`] || ''}
                      onChange={(e) => handleCorrectionChange(rowNumber, error.column, e.target.value)}
                      className="w-full px-3 py-2 rounded border mt-2 text-sm"
                      style={{
                        background: 'var(--bg-card)',
                        borderColor: 'var(--border-default)',
                        color: 'var(--text-primary)'
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          {onCancel && (
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded border transition-colors"
              style={{
                background: 'var(--bg-card)',
                borderColor: 'var(--border-default)',
                color: 'var(--text-primary)'
              }}
            >
              Cancel
            </button>
          )}
          <button
            onClick={handleSubmit}
            disabled={!hasCorrections || isSubmitting}
            className={`px-6 py-2 rounded font-medium transition-colors ${
              !hasCorrections || isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-teal-600 hover:bg-teal-700 text-white'
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Apply Corrections & Resubmit'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CSVCorrectionForm;

