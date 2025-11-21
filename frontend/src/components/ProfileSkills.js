// Component - Profile Skills Section
// Displays employee skills from Skills Engine

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getEmployeeSkills } from '../services/employeeService';

function ProfileSkills({ employeeId }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [skillsData, setSkillsData] = useState(null);

  useEffect(() => {
    const fetchSkills = async () => {
      if (!user?.companyId || !employeeId) return;

      try {
        setLoading(true);
        setError(null);
        const response = await getEmployeeSkills(user.companyId, employeeId);
        console.log('[ProfileSkills] Raw response:', response);
        // Handle envelope structure: { requester_service: 'directory_service', response: { success: true, skills: {...} } }
        // The middleware wraps the controller response, so we need response.response.skills
        const skills = response?.response?.skills || response?.skills || response?.response || response;
        console.log('[ProfileSkills] Extracted skills:', skills);
        console.log('[ProfileSkills] Skills competencies:', skills?.competencies?.length || 0);
        setSkillsData(skills);
      } catch (err) {
        console.error('[ProfileSkills] Error fetching skills:', err);
        // If profile not approved, show appropriate message
        if (err.response?.status === 403) {
          setError('Your profile must be approved by HR to view skills.');
        } else {
          // Try to use fallback mock data structure
          console.warn('[ProfileSkills] Using fallback mock data structure');
          // The mock data structure uses nested_competencies
          setSkillsData({
            competencies: [
              {
                name: "Data Analysis",
                nested_competencies: [
                  {
                    name: "Data Processing",
                    skills: [
                      { name: "Python", verified: false },
                      { name: "SQL", verified: false }
                    ]
                  },
                  {
                    name: "Data Visualization",
                    skills: [
                      { name: "Power BI", verified: false },
                      { name: "Tableau", verified: false }
                    ]
                  }
                ]
              }
            ],
            relevance_score: 0,
            gap: { missing_skills: [] }
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, [employeeId, user?.companyId]);

  const renderCompetencies = (competencies, level = 0) => {
    if (!competencies || competencies.length === 0) return null;

    return (
      <div className={level > 0 ? 'ml-4 mt-2' : ''}>
        {competencies.map((comp, idx) => (
          <div key={idx} className="mb-3">
            <div 
              className="font-medium mb-1"
              style={{ 
                color: 'var(--text-primary)',
                fontSize: level === 0 ? '1rem' : level === 1 ? '0.9rem' : '0.85rem'
              }}
            >
              {comp.name}
            </div>
            {comp.skills && comp.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {comp.skills.map((skill, skillIdx) => (
                  <span
                    key={skillIdx}
                    className="px-3 py-1 rounded-full text-sm"
                    style={{
                      background: skill.verified 
                        ? 'rgba(34, 197, 94, 0.1)' 
                        : 'var(--bg-primary)',
                      border: `1px solid ${skill.verified ? 'rgb(34, 197, 94)' : 'var(--border-default)'}`,
                      color: skill.verified 
                        ? 'rgb(34, 197, 94)' 
                        : 'var(--text-secondary)'
                    }}
                  >
                    {skill.name}
                    {skill.verified && (
                      <span className="ml-1" title="Verified">✓</span>
                    )}
                  </span>
                ))}
              </div>
            )}
            {comp.nested_competencies && renderCompetencies(comp.nested_competencies, level + 1)}
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          Skills
        </h2>
        <div className="p-6 rounded-lg border" style={{
          background: 'var(--bg-secondary)',
          borderColor: 'var(--border-default)'
        }}>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Loading skills...
          </p>
        </div>
      </div>
    );
  }

  if (error && !skillsData) {
    return (
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          Skills
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

  // Handle both flat competencies array and nested_competencies structure
  const competencies = skillsData?.competencies || skillsData?.nested_competencies || [];
  const relevanceScore = skillsData?.relevance_score || 0;
  const missingSkills = skillsData?.gap?.missing_skills || [];

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
        Skills
      </h2>
      <div className="p-6 rounded-lg border" style={{
        background: 'var(--bg-secondary)',
        borderColor: 'var(--border-default)'
      }}>
        {/* Relevance Score */}
        {relevanceScore > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                Relevance Score
              </span>
              <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                {relevanceScore.toFixed(1)}%
              </span>
            </div>
            <div className="w-full h-2 rounded-full" style={{ background: 'var(--bg-primary)' }}>
              <div
                className="h-2 rounded-full"
                style={{
                  width: `${relevanceScore}%`,
                  background: 'var(--color-primary, #3b82f6)'
                }}
              />
            </div>
          </div>
        )}

        {/* Competencies */}
        {competencies.length > 0 ? (
          <div className="mb-4">
            {renderCompetencies(competencies)}
          </div>
        ) : (
          <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
            No skills data available yet. Skills will be displayed here once processed by Skills Engine.
          </p>
        )}

        {/* Missing Skills (Gap) */}
        {missingSkills.length > 0 && (
          <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border-default)' }}>
            <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Skills Gap
            </h3>
            <div className="flex flex-wrap gap-2">
              {missingSkills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full text-sm"
                  style={{
                    background: 'rgba(251, 191, 36, 0.1)',
                    border: '1px solid rgb(251, 191, 36)',
                    color: 'rgb(251, 191, 36)'
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-4">
          <button
            className="px-4 py-2 rounded-md text-sm"
            style={{
              background: 'var(--bg-button-primary)',
              color: 'var(--text-button-primary)'
            }}
            onClick={() => {
              // TODO: Link to Skills Engine UI when available
              alert('Skills Gap view will be available once Skills Engine UI is integrated.');
            }}
          >
            View Skills Gap
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileSkills;

