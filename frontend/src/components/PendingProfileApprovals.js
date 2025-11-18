// Component - Pending Profile Approvals
// Displays list of employees with enriched profiles waiting for HR approval

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

function PendingProfileApprovals({ approvals, companyId, onApprovalUpdate }) {
  const navigate = useNavigate();
  const [processing, setProcessing] = useState({});
  const [error, setError] = useState(null);

  const handleApprove = async (approvalId, employeeId) => {
    try {
      setProcessing({ ...processing, [approvalId]: 'approving' });
      setError(null);

      const response = await api.post(`/companies/${companyId}/profile-approvals/${approvalId}/approve`);

      if (response.data && response.data.response) {
        const result = response.data.response;
        if (result.success) {
          // Notify parent to refresh data
          if (onApprovalUpdate) {
            onApprovalUpdate();
          }
        }
      }
    } catch (err) {
      console.error('Error approving profile:', err);
      setError(err.response?.data?.response?.error || 'Failed to approve profile');
    } finally {
      setProcessing({ ...processing, [approvalId]: null });
    }
  };

  const handleReject = async (approvalId, employeeId) => {
    const reason = prompt('Please provide a reason for rejection (optional):');
    if (reason === null) return; // User cancelled

    try {
      setProcessing({ ...processing, [approvalId]: 'rejecting' });
      setError(null);

      const response = await api.post(`/companies/${companyId}/profile-approvals/${approvalId}/reject`, {
        reason: reason || 'Profile rejected by HR'
      });

      if (response.data && response.data.response) {
        const result = response.data.response;
        if (result.success) {
          // Notify parent to refresh data
          if (onApprovalUpdate) {
            onApprovalUpdate();
          }
        }
      }
    } catch (err) {
      console.error('Error rejecting profile:', err);
      setError(err.response?.data?.response?.error || 'Failed to reject profile');
    } finally {
      setProcessing({ ...processing, [approvalId]: null });
    }
  };

  if (!approvals || approvals.length === 0) {
    return (
      <div 
        className="p-6 rounded-lg border text-center"
        style={{
          background: 'var(--bg-secondary)',
          borderColor: 'var(--border-default)'
        }}
      >
        <p style={{ color: 'var(--text-secondary)' }}>
          No pending profile approvals. All enriched profiles have been reviewed.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div 
          className="p-4 rounded-lg"
          style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid var(--border-error)',
            color: 'var(--text-error)'
          }}
        >
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-3">
        {approvals.map((approval) => (
          <div
            key={approval.id}
            className="p-4 rounded-lg border"
            style={{
              background: 'var(--bg-secondary)',
              borderColor: 'var(--border-default)'
            }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 
                    className="font-semibold"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {approval.full_name || approval.employee_id}
                  </h3>
                  <span 
                    className="text-xs px-2 py-1 rounded-full"
                    style={{
                      background: 'rgba(251, 191, 36, 0.1)',
                      color: 'rgb(251, 191, 36)'
                    }}
                  >
                    Awaiting Approval
                  </span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm mb-3">
                  <div>
                    <span style={{ color: 'var(--text-secondary)' }}>Email: </span>
                    <span style={{ color: 'var(--text-primary)' }}>{approval.email}</span>
                  </div>
                  {approval.department && (
                    <div>
                      <span style={{ color: 'var(--text-secondary)' }}>Department: </span>
                      <span style={{ color: 'var(--text-primary)' }}>{approval.department}</span>
                    </div>
                  )}
                  {approval.team && (
                    <div>
                      <span style={{ color: 'var(--text-secondary)' }}>Team: </span>
                      <span style={{ color: 'var(--text-primary)' }}>{approval.team}</span>
                    </div>
                  )}
                  {approval.enrichment_completed_at && (
                    <div>
                      <span style={{ color: 'var(--text-secondary)' }}>Enriched: </span>
                      <span style={{ color: 'var(--text-primary)' }}>
                        {new Date(approval.enrichment_completed_at).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => navigate(`/employee/${approval.employee_uuid || approval.employee_id}`)}
                  className="px-3 py-1.5 text-sm rounded border transition-colors"
                  style={{
                    borderColor: 'var(--border-default)',
                    color: 'var(--text-primary)',
                    background: 'var(--bg-primary)'
                  }}
                >
                  View Profile
                </button>
                <button
                  onClick={() => handleApprove(approval.id, approval.employee_uuid || approval.employee_id)}
                  disabled={processing[approval.id] === 'approving'}
                  className="px-3 py-1.5 text-sm rounded text-white transition-colors"
                  style={{
                    background: processing[approval.id] === 'approving' 
                      ? 'rgba(34, 197, 94, 0.6)' 
                      : 'rgb(34, 197, 94)',
                    cursor: processing[approval.id] === 'approving' ? 'not-allowed' : 'pointer'
                  }}
                >
                  {processing[approval.id] === 'approving' ? 'Approving...' : 'Approve'}
                </button>
                <button
                  onClick={() => handleReject(approval.id, approval.employee_uuid || approval.employee_id)}
                  disabled={processing[approval.id] === 'rejecting'}
                  className="px-3 py-1.5 text-sm rounded text-white transition-colors"
                  style={{
                    background: processing[approval.id] === 'rejecting' 
                      ? 'rgba(239, 68, 68, 0.6)' 
                      : 'rgb(239, 68, 68)',
                    cursor: processing[approval.id] === 'rejecting' ? 'not-allowed' : 'pointer'
                  }}
                >
                  {processing[approval.id] === 'rejecting' ? 'Rejecting...' : 'Reject'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PendingProfileApprovals;

