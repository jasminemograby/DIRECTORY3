// Component - Profile Requests Section
// Allows employees to submit and view requests

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { submitEmployeeRequest, getEmployeeRequests } from '../services/employeeService';

function ProfileRequests({ employeeId, isViewOnly = false }) {
  const { user } = useAuth();
  const [requestType, setRequestType] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      if (!user?.companyId || !employeeId) return;

      try {
        setLoading(true);
        setError(null);
        const response = await getEmployeeRequests(user.companyId, employeeId);
        // Handle different response formats
        const requestsData = response?.data?.requests || response?.requests || response?.response?.requests || [];
        setRequests(requestsData);
      } catch (err) {
        console.error('[ProfileRequests] Error fetching requests:', err);
        if (err.response?.status === 403) {
          setError('Your profile must be approved by HR to view requests.');
        } else {
          setError('Failed to load requests.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [employeeId, user?.companyId]);

  const handleSubmitRequest = async () => {
    if (!requestType || !title.trim()) {
      setError('Please select a request type and provide a title');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);

      const response = await submitEmployeeRequest(user.companyId, employeeId, {
        request_type: requestType,
        title: title.trim(),
        description: description.trim() || null
      });

      setSuccess('Request submitted successfully!');
      setRequestType('');
      setTitle('');
      setDescription('');

      // Refresh requests list
      const requestsResponse = await getEmployeeRequests(user.companyId, employeeId);
      const refreshedRequests = requestsResponse?.data?.requests || requestsResponse?.requests || requestsResponse?.response?.requests || [];
      setRequests(refreshedRequests);
    } catch (err) {
      console.error('[ProfileRequests] Error submitting request:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Failed to submit request';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return { bg: 'rgba(34, 197, 94, 0.1)', border: 'rgb(34, 197, 94)', text: 'rgb(34, 197, 94)' };
      case 'rejected':
        return { bg: 'rgba(239, 68, 68, 0.1)', border: 'rgb(239, 68, 68)', text: 'rgb(239, 68, 68)' };
      case 'in_progress':
        return { bg: 'rgba(59, 130, 246, 0.1)', border: 'rgb(59, 130, 246)', text: 'rgb(59, 130, 246)' };
      case 'completed':
        return { bg: 'rgba(34, 197, 94, 0.1)', border: 'rgb(34, 197, 94)', text: 'rgb(34, 197, 94)' };
      default:
        return { bg: 'rgba(251, 191, 36, 0.1)', border: 'rgb(251, 191, 36)', text: 'rgb(251, 191, 36)' };
    }
  };

  const getRequestTypeLabel = (type) => {
    const labels = {
      'learn-new-skills': 'Learn New Skills',
      'apply-trainer': 'Apply for Trainer Role',
      'self-learning': 'Self-Learning Request',
      'other': 'Other Request'
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          Requests
        </h2>
        <div className="p-6 rounded-lg border" style={{
          background: 'var(--bg-secondary)',
          borderColor: 'var(--border-default)'
        }}>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Loading requests...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
        Requests
      </h2>
      <div className="p-6 rounded-lg border" style={{
        background: 'var(--bg-secondary)',
        borderColor: 'var(--border-default)'
      }}>
        {/* Success Message */}
        {success && (
          <div className="mb-4 p-3 rounded" style={{
            background: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid rgb(34, 197, 94)',
            color: 'rgb(34, 197, 94)'
          }}>
            <p className="text-sm">{success}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 rounded" style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgb(239, 68, 68)',
            color: 'rgb(239, 68, 68)'
          }}>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Submit New Request Form - Hidden in view-only mode */}
        {!isViewOnly && (
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
            Submit New Request
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Request Type <span className="text-red-500">*</span>
              </label>
              <select
                value={requestType}
                onChange={(e) => setRequestType(e.target.value)}
                className="w-full px-3 py-2 rounded-md border"
                style={{
                  background: 'var(--bg-primary)',
                  borderColor: 'var(--border-default)',
                  color: 'var(--text-primary)'
                }}
              >
                <option value="">Select a request type...</option>
                <option value="learn-new-skills">Request to Learn New Skills</option>
                <option value="apply-trainer">Apply for Trainer Role</option>
                <option value="self-learning">Self-Learning Request</option>
                <option value="other">Other Request</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter request title"
                className="w-full px-3 py-2 rounded-md border"
                style={{
                  background: 'var(--bg-primary)',
                  borderColor: 'var(--border-default)',
                  color: 'var(--text-primary)'
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Description (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide additional details about your request"
                rows={3}
                className="w-full px-3 py-2 rounded-md border"
                style={{
                  background: 'var(--bg-primary)',
                  borderColor: 'var(--border-default)',
                  color: 'var(--text-primary)'
                }}
              />
            </div>

            <button
              onClick={handleSubmitRequest}
              disabled={!requestType || !title.trim() || submitting}
              className="px-4 py-2 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: 'var(--bg-button-primary)',
                color: 'var(--text-button-primary)'
              }}
            >
              {submitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </div>
        )}

        {/* Existing Requests */}
        <div>
          <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
            My Requests ({requests.length})
          </h3>
          {requests.length > 0 ? (
            <div className="space-y-3">
              {requests.map((request) => {
                const statusStyle = getStatusColor(request.status);
                return (
                  <div
                    key={request.id}
                    className="p-4 rounded-lg border"
                    style={{
                      background: 'var(--bg-primary)',
                      borderColor: statusStyle.border
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                            {request.title}
                          </span>
                          <span
                            className="px-2 py-1 rounded text-xs font-medium"
                            style={{
                              background: statusStyle.bg,
                              border: `1px solid ${statusStyle.border}`,
                              color: statusStyle.text
                            }}
                          >
                            {request.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>
                          Type: {getRequestTypeLabel(request.request_type)}
                        </div>
                        {request.description && (
                          <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
                            {request.description}
                          </p>
                        )}
                        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                          Submitted: {new Date(request.requested_at).toLocaleDateString()}
                        </div>
                        {request.reviewed_at && (
                          <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                            Reviewed: {new Date(request.reviewed_at).toLocaleDateString()}
                            {request.reviewer_name && ` by ${request.reviewer_name}`}
                          </div>
                        )}
                        {request.rejection_reason && (
                          <div className="mt-2 p-2 rounded text-xs" style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            color: 'rgb(239, 68, 68)'
                          }}>
                            Rejection reason: {request.rejection_reason}
                          </div>
                        )}
                        {request.response_notes && (
                          <div className="mt-2 p-2 rounded text-xs" style={{
                            background: 'rgba(59, 130, 246, 0.1)',
                            color: 'rgb(59, 130, 246)'
                          }}>
                            Response: {request.response_notes}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              No requests submitted yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfileRequests;

