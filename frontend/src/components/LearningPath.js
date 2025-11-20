// Component - Learning Path Section
// Displays learning path from Learner AI

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getEmployeeLearningPath } from '../services/employeeService';

function LearningPath({ employeeId }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [learningPathData, setLearningPathData] = useState(null);

  useEffect(() => {
    const fetchLearningPath = async () => {
      if (!user?.companyId || !employeeId) return;

      try {
        setLoading(true);
        setError(null);
        const response = await getEmployeeLearningPath(user.companyId, employeeId);
        const learningPath = response?.learningPath || response?.response?.learningPath || response;
        setLearningPathData(learningPath);
      } catch (err) {
        console.error('[LearningPath] Error fetching learning path:', err);
        if (err.response?.status === 403) {
          setError('Your profile must be approved by HR to view learning path.');
        } else {
          setError('Failed to load learning path. Using fallback data.');
          setLearningPathData({
            path_id: '',
            courses: [],
            progress: 0,
            recommendations: []
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLearningPath();
  }, [employeeId, user?.companyId]);

  const handleViewFullLearningPath = () => {
    // Redirect to Learner AI microservice frontend
    alert('Redirecting to LEARNER AI');
    // TODO: When Learner AI frontend is available, redirect to it
    // const learnerAIUrl = process.env.REACT_APP_LEARNER_AI_URL || 'https://learner-ai-backend-production.up.railway.app';
    // window.open(`${learnerAIUrl}/learning-path?employee_id=${employeeId}`, '_blank');
  };

  if (loading) {
    return (
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          Learning Path
        </h2>
        <div className="p-6 rounded-lg border" style={{
          background: 'var(--bg-secondary)',
          borderColor: 'var(--border-default)'
        }}>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Loading learning path...
          </p>
        </div>
      </div>
    );
  }

  if (error && !learningPathData) {
    return (
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          Learning Path
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

  const pathId = learningPathData?.path_id || '';
  const courses = learningPathData?.courses || [];
  const progress = learningPathData?.progress || 0;
  const recommendations = learningPathData?.recommendations || [];

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
        Learning Path
      </h2>
      <div className="p-6 rounded-lg border" style={{
        background: 'var(--bg-secondary)',
        borderColor: 'var(--border-default)'
      }}>
        {/* Path ID */}
        {pathId && (
          <div className="mb-4">
            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              Path ID: {pathId}
            </div>
          </div>
        )}

        {/* Progress */}
        {progress > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                Overall Progress
              </span>
              <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                {progress}%
              </span>
            </div>
            <div className="w-full h-2 rounded-full" style={{ background: 'var(--bg-primary)' }}>
              <div
                className="h-2 rounded-full"
                style={{
                  width: `${progress}%`,
                  background: 'var(--color-primary, #3b82f6)'
                }}
              />
            </div>
          </div>
        )}

        {/* Courses in Path */}
        {courses.length > 0 ? (
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Courses in Path ({courses.length})
            </h3>
            <div className="space-y-2">
              {courses.map((course, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded border"
                  style={{
                    background: 'var(--bg-primary)',
                    borderColor: 'var(--border-default)'
                  }}
                >
                  <div className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                    {course.course_name || course.name || `Course ${idx + 1}`}
                  </div>
                  {course.order && (
                    <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                      Step {course.order}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
            No learning path yet.
          </p>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Recommendations
            </h3>
            <div className="space-y-2">
              {recommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className="p-2 rounded border"
                  style={{
                    background: 'var(--bg-primary)',
                    borderColor: 'var(--border-default)'
                  }}
                >
                  <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {rec.course_name || rec.recommendation || JSON.stringify(rec)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* View Full Learning Path Button */}
        <button
          onClick={handleViewFullLearningPath}
          className="px-4 py-2 rounded-md text-sm mt-4"
          style={{
            background: 'var(--bg-button-primary)',
            color: 'var(--text-button-primary)'
          }}
        >
          View Full Learning Path
        </button>
      </div>
    </div>
  );
}

export default LearningPath;

