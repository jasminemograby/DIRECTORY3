// Component - Profile Dashboard Section
// Displays learning dashboard data from Learning Analytics

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getEmployeeDashboard } from '../services/employeeService';

function ProfileDashboard({ employeeId }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!user?.companyId || !employeeId) return;

      try {
        setLoading(true);
        setError(null);
        const response = await getEmployeeDashboard(user.companyId, employeeId);
        const dashboard = response?.dashboard || response?.response?.dashboard || response;
        setDashboardData(dashboard);
      } catch (err) {
        console.error('[ProfileDashboard] Error fetching dashboard:', err);
        if (err.response?.status === 403) {
          setError('Your profile must be approved by HR to view dashboard.');
        } else {
          setError('Failed to load dashboard. Using fallback data.');
          setDashboardData({
            progress_summary: {},
            recent_activity: [],
            upcoming_deadlines: [],
            achievements: []
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [employeeId, user?.companyId]);

  const handleViewFullDashboard = () => {
    // TODO: Redirect to Learning Analytics microservice frontend when available
    const analyticsUrl = process.env.REACT_APP_LEARNING_ANALYTICS_URL || 'https://learning-analytics-production.up.railway.app';
    window.open(`${analyticsUrl}/dashboard?employee_id=${employeeId}`, '_blank');
  };

  if (loading) {
    return (
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          Learning Dashboard
        </h2>
        <div className="p-6 rounded-lg border" style={{
          background: 'var(--bg-secondary)',
          borderColor: 'var(--border-default)'
        }}>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error && !dashboardData) {
    return (
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          Learning Dashboard
        </h2>
        <div className="p-6 rounded-lg border" style={{
          background: 'var(--bg-secondary)',
          borderColor: 'var(--border-default)'
        }}>
          <p className="text-sm" style={{ color: 'var(--text-error, #ef4444)' }}>
            {error}
          </p>
        </div>
      </div>
    );
  }

  const progressSummary = dashboardData?.progress_summary || {};
  const recentActivity = dashboardData?.recent_activity || [];
  const upcomingDeadlines = dashboardData?.upcoming_deadlines || [];
  const achievements = dashboardData?.achievements || [];

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
        Learning Dashboard
      </h2>
      <div className="p-6 rounded-lg border" style={{
        background: 'var(--bg-secondary)',
        borderColor: 'var(--border-default)'
      }}>
        {/* Progress Summary */}
        {Object.keys(progressSummary).length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Progress Summary
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(progressSummary).map(([key, value]) => (
                <div key={key} className="p-3 rounded border" style={{
                  background: 'var(--bg-primary)',
                  borderColor: 'var(--border-default)'
                }}>
                  <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {key.replace(/_/g, ' ').toUpperCase()}
                  </div>
                  <div className="text-lg font-bold mt-1" style={{ color: 'var(--text-primary)' }}>
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Activity */}
        {recentActivity.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Recent Activity
            </h3>
            <div className="space-y-2">
              {recentActivity.slice(0, 5).map((activity, idx) => (
                <div key={idx} className="text-sm p-2 rounded" style={{
                  background: 'var(--bg-primary)',
                  color: 'var(--text-secondary)'
                }}>
                  {activity.description || activity.message || JSON.stringify(activity)}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Deadlines */}
        {upcomingDeadlines.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Upcoming Deadlines
            </h3>
            <div className="space-y-2">
              {upcomingDeadlines.slice(0, 3).map((deadline, idx) => (
                <div key={idx} className="p-2 rounded border" style={{
                  background: 'var(--bg-primary)',
                  borderColor: 'var(--border-default)'
                }}>
                  <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    {deadline.title || deadline.course_name || 'Deadline'}
                  </div>
                  <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                    {deadline.due_date ? new Date(deadline.due_date).toLocaleDateString() : 'No date'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Achievements */}
        {achievements.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Achievements
            </h3>
            <div className="flex flex-wrap gap-2">
              {achievements.map((achievement, idx) => (
                <span key={idx} className="px-3 py-1 rounded-full text-sm" style={{
                  background: 'rgba(34, 197, 94, 0.1)',
                  border: '1px solid rgb(34, 197, 94)',
                  color: 'rgb(34, 197, 94)'
                }}>
                  {achievement.name || achievement.title || `Achievement ${idx + 1}`}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {Object.keys(progressSummary).length === 0 && 
         recentActivity.length === 0 && 
         upcomingDeadlines.length === 0 && 
         achievements.length === 0 && (
          <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
            No dashboard data available yet. Your learning progress will appear here.
          </p>
        )}

        {/* View Full Dashboard Button */}
        <button
          onClick={handleViewFullDashboard}
          className="px-4 py-2 rounded-md text-sm mt-4"
          style={{
            background: 'var(--bg-button-primary)',
            color: 'var(--text-button-primary)'
          }}
        >
          View Full Dashboard
        </button>
      </div>
    </div>
  );
}

export default ProfileDashboard;

