// Component - Approved Profile Tabs
// Organizes approved employee profile sections into tabs

import React, { useState } from 'react';
import ProfileSkills from './ProfileSkills';
import ProfileCourses from './ProfileCourses';
import LearningPath from './LearningPath';
import ProfileAnalytics from './ProfileAnalytics';
import ProfileDashboard from './ProfileDashboard';
import ProfileRequests from './ProfileRequests';

function ApprovedProfileTabs({ employeeId, user }) {
  const [activeTab, setActiveTab] = useState('skills');

  const tabs = [
    { id: 'skills', label: 'Skills', component: ProfileSkills },
    { id: 'courses', label: 'Courses', component: ProfileCourses },
    { id: 'learning-path', label: 'Learning Path', component: LearningPath },
    { id: 'analytics', label: 'Analytics', component: ProfileAnalytics },
    { id: 'dashboard', label: 'Dashboard', component: ProfileDashboard },
    { id: 'requests', label: 'Requests', component: ProfileRequests }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div>
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-6 border-b" style={{ borderColor: 'var(--border-default)' }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="px-4 py-2 text-sm font-medium transition-colors"
            style={{
              borderBottom: activeTab === tab.id ? '2px solid var(--color-primary, #3b82f6)' : '2px solid transparent',
              color: activeTab === tab.id 
                ? 'var(--color-primary, #3b82f6)' 
                : 'var(--text-secondary)',
              background: 'transparent',
              cursor: 'pointer'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {ActiveComponent && <ActiveComponent employeeId={employeeId} />}
      </div>
    </div>
  );
}

export default ApprovedProfileTabs;

