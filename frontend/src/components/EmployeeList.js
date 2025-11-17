// Component - Employee List
// Displays list of all company employees

import React from 'react';

function EmployeeList({ employees, onEmployeeClick }) {
  if (!employees || employees.length === 0) {
    return (
      <div className="p-6 rounded-lg text-center" style={{ background: 'var(--bg-card)' }}>
        <p style={{ color: 'var(--text-secondary)' }}>No employees found</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border-default)' }}>
              <th className="text-left p-3 font-semibold" style={{ color: 'var(--text-primary)' }}>Name</th>
              <th className="text-left p-3 font-semibold" style={{ color: 'var(--text-primary)' }}>Email</th>
              <th className="text-left p-3 font-semibold" style={{ color: 'var(--text-primary)' }}>Roles</th>
              <th className="text-left p-3 font-semibold" style={{ color: 'var(--text-primary)' }}>Current Role</th>
              <th className="text-left p-3 font-semibold" style={{ color: 'var(--text-primary)' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr
                key={employee.id}
                className="hover:bg-opacity-50 cursor-pointer transition-colors"
                style={{ 
                  borderBottom: '1px solid var(--border-default)',
                  background: 'var(--bg-card)'
                }}
                onClick={() => onEmployeeClick && onEmployeeClick(employee)}
              >
                <td className="p-3" style={{ color: 'var(--text-primary)' }}>
                  {employee.full_name}
                </td>
                <td className="p-3" style={{ color: 'var(--text-secondary)' }}>
                  {employee.email}
                </td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-1">
                    {employee.roles && employee.roles.length > 0 ? (
                      employee.roles.map((role, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs rounded"
                          style={{
                            background: 'var(--bg-primary)',
                            color: 'var(--text-primary)',
                            border: '1px solid var(--border-default)'
                          }}
                        >
                          {role}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>No roles</span>
                    )}
                  </div>
                </td>
                <td className="p-3" style={{ color: 'var(--text-secondary)' }}>
                  {employee.current_role_in_company || '-'}
                </td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      employee.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {employee.status || 'active'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EmployeeList;

