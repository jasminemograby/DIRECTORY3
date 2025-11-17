// Component - Company Dashboard
// Main dashboard component combining metrics, hierarchy, and employee list

import React, { useState } from 'react';
import CompanyMetrics from './CompanyMetrics';
import CompanyHierarchy from './CompanyHierarchy';
import EmployeeList from './EmployeeList';

function CompanyDashboard({ company, departments, teams, employees, hierarchy, metrics, onEmployeeClick }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'hierarchy', 'employees'

  return (
    <div className="w-full space-y-6">
      {/* Tabs */}
      <div className="flex space-x-4 border-b" style={{ borderColor: 'var(--border-default)' }}>
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'overview'
              ? 'border-b-2 border-teal-600 text-teal-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
          style={{
            color: activeTab === 'overview' ? 'var(--border-focus)' : 'var(--text-secondary)',
            borderBottomColor: activeTab === 'overview' ? 'var(--border-focus)' : 'transparent'
          }}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('hierarchy')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'hierarchy'
              ? 'border-b-2 border-teal-600 text-teal-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
          style={{
            color: activeTab === 'hierarchy' ? 'var(--border-focus)' : 'var(--text-secondary)',
            borderBottomColor: activeTab === 'hierarchy' ? 'var(--border-focus)' : 'transparent'
          }}
        >
          Hierarchy
        </button>
        <button
          onClick={() => setActiveTab('employees')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'employees'
              ? 'border-b-2 border-teal-600 text-teal-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
          style={{
            color: activeTab === 'employees' ? 'var(--border-focus)' : 'var(--text-secondary)',
            borderBottomColor: activeTab === 'employees' ? 'var(--border-focus)' : 'transparent'
          }}
        >
          Employees
        </button>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                Company Metrics
              </h3>
              <CompanyMetrics metrics={metrics} />
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                Company Information
              </h3>
              <div className="p-6 rounded-lg" style={{ background: 'var(--bg-card)' }}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Company Name</p>
                    <p className="font-medium mt-1" style={{ color: 'var(--text-primary)' }}>
                      {company?.company_name || '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Industry</p>
                    <p className="font-medium mt-1" style={{ color: 'var(--text-primary)' }}>
                      {company?.industry || '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Domain</p>
                    <p className="font-medium mt-1" style={{ color: 'var(--text-primary)' }}>
                      {company?.domain || '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Verification Status</p>
                    <p className="font-medium mt-1" style={{ color: 'var(--text-primary)' }}>
                      {company?.verification_status || '-'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'hierarchy' && (
          <div>
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              Organizational Hierarchy
            </h3>
            <CompanyHierarchy hierarchy={hierarchy} onEmployeeClick={onEmployeeClick} />
          </div>
        )}

        {activeTab === 'employees' && (
          <div>
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              All Employees ({employees?.length || 0})
            </h3>
            <EmployeeList employees={employees} onEmployeeClick={onEmployeeClick} />
          </div>
        )}
      </div>
    </div>
  );
}

export default CompanyDashboard;

