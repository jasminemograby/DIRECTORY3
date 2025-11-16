import React from 'react';

function VerificationStatus({ status, companyName, domain }) {
  const getStatusConfig = () => {
    switch (status) {
      case 'pending':
        return {
          text: 'VERIFICATION IN PROGRESS',
          description: 'We are verifying your company information. This may take a few moments.',
          icon: '⏳',
          color: 'var(--border-warning)',
          bgColor: 'rgba(245, 158, 11, 0.1)'
        };
      case 'approved':
        return {
          text: 'VERIFICATION APPROVED',
          description: 'Your company has been verified successfully! You can now proceed to upload your employee data.',
          icon: '✅',
          color: 'var(--border-success)',
          bgColor: 'rgba(16, 185, 129, 0.1)'
        };
      case 'rejected':
        return {
          text: 'VERIFICATION REJECTED',
          description: 'Your company verification was rejected. Please contact support for assistance.',
          icon: '❌',
          color: 'var(--border-error)',
          bgColor: 'rgba(239, 68, 68, 0.1)'
        };
      default:
        return {
          text: 'VERIFICATION PENDING',
          description: 'Verification status is being checked...',
          icon: '⏳',
          color: 'var(--text-muted)',
          bgColor: 'rgba(100, 116, 139, 0.1)'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div
      className="p-6 rounded-lg border mb-6"
      style={{
        background: config.bgColor,
        borderColor: config.color
      }}
    >
      <div className="flex items-center gap-4 mb-4">
        <span className="text-4xl">{config.icon}</span>
        <div>
          <h3
            className="text-xl font-bold mb-1"
            style={{ color: config.color }}
          >
            {config.text}
          </h3>
          <p
            className="text-sm"
            style={{ color: 'var(--text-secondary)' }}
          >
            {config.description}
          </p>
        </div>
      </div>

      {companyName && (
        <div className="mt-4 pt-4 border-t" style={{ borderColor: config.color }}>
          <p className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>
            Company:
          </p>
          <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
            {companyName}
          </p>
        </div>
      )}

      {domain && (
        <div className="mt-2">
          <p className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>
            Domain:
          </p>
          <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
            {domain}
          </p>
        </div>
      )}
    </div>
  );
}

export default VerificationStatus;

