import React from 'react';

function CompanyRegistrationFormFields({ formData, errors, onChange }) {
  return (
    <div className="space-y-6">
      {/* Company Name */}
      <div>
        <label
          htmlFor="company_name"
          className="block text-sm font-medium mb-2"
          style={{ color: 'var(--text-primary)' }}
        >
          Company Name <span style={{ color: 'var(--border-error)' }}>*</span>
        </label>
        <input
          type="text"
          id="company_name"
          name="company_name"
          value={formData.company_name}
          onChange={onChange}
          className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-all"
          style={{
            background: 'var(--bg-card)',
            borderColor: errors.company_name ? 'var(--border-error)' : 'var(--border-default)',
            color: 'var(--text-primary)',
            '--tw-ring-color': 'var(--border-focus)'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--border-focus)';
            e.target.style.boxShadow = '0 0 0 3px rgba(4, 120, 87, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = errors.company_name ? 'var(--border-error)' : 'var(--border-default)';
            e.target.style.boxShadow = 'none';
          }}
          placeholder="Enter your company name"
        />
        {errors.company_name && (
          <p className="mt-1 text-sm" style={{ color: 'var(--border-error)' }}>
            {errors.company_name}
          </p>
        )}
      </div>

      {/* Industry */}
      <div>
        <label
          htmlFor="industry"
          className="block text-sm font-medium mb-2"
          style={{ color: 'var(--text-primary)' }}
        >
          Industry <span style={{ color: 'var(--border-error)' }}>*</span>
        </label>
        <input
          type="text"
          id="industry"
          name="industry"
          value={formData.industry}
          onChange={onChange}
          className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-all"
          style={{
            background: 'var(--bg-card)',
            borderColor: errors.industry ? 'var(--border-error)' : 'var(--border-default)',
            color: 'var(--text-primary)',
            focusRingColor: 'var(--border-focus)'
          }}
          placeholder="e.g., Technology, Healthcare, Finance"
        />
        {errors.industry && (
          <p className="mt-1 text-sm" style={{ color: 'var(--border-error)' }}>
            {errors.industry}
          </p>
        )}
      </div>

      {/* Company Domain */}
      <div>
        <label
          htmlFor="domain"
          className="block text-sm font-medium mb-2"
          style={{ color: 'var(--text-primary)' }}
        >
          Company Domain <span style={{ color: 'var(--border-error)' }}>*</span>
        </label>
        <input
          type="text"
          id="domain"
          name="domain"
          value={formData.domain}
          onChange={onChange}
          className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-all"
          style={{
            background: 'var(--bg-card)',
            borderColor: errors.domain ? 'var(--border-error)' : 'var(--border-default)',
            color: 'var(--text-primary)',
            focusRingColor: 'var(--border-focus)'
          }}
          placeholder="example.com"
        />
        {errors.domain && (
          <p className="mt-1 text-sm" style={{ color: 'var(--border-error)' }}>
            {errors.domain}
          </p>
        )}
      </div>

      {/* HR Contact Name */}
      <div>
        <label
          htmlFor="hr_contact_name"
          className="block text-sm font-medium mb-2"
          style={{ color: 'var(--text-primary)' }}
        >
          HR Contact Name <span style={{ color: 'var(--border-error)' }}>*</span>
        </label>
        <input
          type="text"
          id="hr_contact_name"
          name="hr_contact_name"
          value={formData.hr_contact_name}
          onChange={onChange}
          className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-all"
          style={{
            background: 'var(--bg-card)',
            borderColor: errors.hr_contact_name ? 'var(--border-error)' : 'var(--border-default)',
            color: 'var(--text-primary)',
            focusRingColor: 'var(--border-focus)'
          }}
          placeholder="Enter HR contact name"
        />
        {errors.hr_contact_name && (
          <p className="mt-1 text-sm" style={{ color: 'var(--border-error)' }}>
            {errors.hr_contact_name}
          </p>
        )}
      </div>

      {/* HR Contact Email */}
      <div>
        <label
          htmlFor="hr_contact_email"
          className="block text-sm font-medium mb-2"
          style={{ color: 'var(--text-primary)' }}
        >
          HR Contact Email <span style={{ color: 'var(--border-error)' }}>*</span>
        </label>
        <input
          type="email"
          id="hr_contact_email"
          name="hr_contact_email"
          value={formData.hr_contact_email}
          onChange={onChange}
          className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-all"
          style={{
            background: 'var(--bg-card)',
            borderColor: errors.hr_contact_email ? 'var(--border-error)' : 'var(--border-default)',
            color: 'var(--text-primary)',
            focusRingColor: 'var(--border-focus)'
          }}
          placeholder="hr@example.com"
        />
        {errors.hr_contact_email && (
          <p className="mt-1 text-sm" style={{ color: 'var(--border-error)' }}>
            {errors.hr_contact_email}
          </p>
        )}
      </div>

      {/* HR Contact Role */}
      <div>
        <label
          htmlFor="hr_contact_role"
          className="block text-sm font-medium mb-2"
          style={{ color: 'var(--text-primary)' }}
        >
          HR Contact Role <span style={{ color: 'var(--border-error)' }}>*</span>
        </label>
        <input
          type="text"
          id="hr_contact_role"
          name="hr_contact_role"
          value={formData.hr_contact_role}
          onChange={onChange}
          className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-all"
          style={{
            background: 'var(--bg-card)',
            borderColor: errors.hr_contact_role ? 'var(--border-error)' : 'var(--border-default)',
            color: 'var(--text-primary)',
            focusRingColor: 'var(--border-focus)'
          }}
          placeholder="e.g., HR Manager, People Operations"
        />
        {errors.hr_contact_role && (
          <p className="mt-1 text-sm" style={{ color: 'var(--border-error)' }}>
            {errors.hr_contact_role}
          </p>
        )}
      </div>
    </div>
  );
}

export default CompanyRegistrationFormFields;

