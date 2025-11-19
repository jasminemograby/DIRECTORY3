// Component - Profile Edit Form
// Allows employees to edit their own profile fields

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateEmployee } from '../services/employeeService';

function ProfileEditForm({ employee, onSave, onCancel }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    current_role_in_company: '',
    target_role_in_company: '',
    preferred_language: '',
    bio: '',
    linkedin_url: '',
    github_url: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (employee) {
      setFormData({
        full_name: employee.full_name || '',
        email: employee.email || '',
        current_role_in_company: employee.current_role_in_company || '',
        target_role_in_company: employee.target_role_in_company || '',
        preferred_language: employee.preferred_language || '',
        bio: employee.bio || '',
        linkedin_url: employee.linkedin_url || '',
        github_url: employee.github_url || ''
      });
    }
  }, [employee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.current_role_in_company.trim()) {
      newErrors.current_role_in_company = 'Current role is required';
    }

    if (!formData.target_role_in_company.trim()) {
      newErrors.target_role_in_company = 'Target role is required';
    }

    if (!formData.preferred_language.trim()) {
      newErrors.preferred_language = 'Preferred language is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    setSuccess(null);
    setErrors({});

    try {
      await updateEmployee(user.companyId, employee.id, formData);
      setSuccess('Profile updated successfully!');
      
      // Call onSave callback to refresh profile data
      if (onSave) {
        setTimeout(() => {
          onSave();
        }, 1000);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to update profile';
      setErrors({ submit: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mb-6">
      <h2 
        className="text-xl font-semibold mb-4"
        style={{ color: 'var(--text-primary)' }}
      >
        Edit Profile
      </h2>
      <div 
        className="p-6 rounded-lg border"
        style={{
          background: 'var(--bg-secondary)',
          borderColor: 'var(--border-default)'
        }}
      >
        {success && (
          <div className="mb-4 p-3 rounded" style={{
            background: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid rgb(34, 197, 94)',
            color: 'rgb(34, 197, 94)'
          }}>
            <p className="text-sm">{success}</p>
          </div>
        )}

        {errors.submit && (
          <div className="mb-4 p-3 rounded" style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgb(239, 68, 68)',
            color: 'rgb(239, 68, 68)'
          }}>
            <p className="text-sm">{errors.submit}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-md border"
              style={{
                background: 'var(--bg-primary)',
                borderColor: errors.full_name ? 'rgb(239, 68, 68)' : 'var(--border-default)',
                color: 'var(--text-primary)'
              }}
            />
            {errors.full_name && (
              <p className="text-xs mt-1" style={{ color: 'rgb(239, 68, 68)' }}>
                {errors.full_name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-md border"
              style={{
                background: 'var(--bg-primary)',
                borderColor: errors.email ? 'rgb(239, 68, 68)' : 'var(--border-default)',
                color: 'var(--text-primary)'
              }}
            />
            {errors.email && (
              <p className="text-xs mt-1" style={{ color: 'rgb(239, 68, 68)' }}>
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Current Role in Company <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="current_role_in_company"
              value={formData.current_role_in_company}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-md border"
              style={{
                background: 'var(--bg-primary)',
                borderColor: errors.current_role_in_company ? 'rgb(239, 68, 68)' : 'var(--border-default)',
                color: 'var(--text-primary)'
              }}
            />
            {errors.current_role_in_company && (
              <p className="text-xs mt-1" style={{ color: 'rgb(239, 68, 68)' }}>
                {errors.current_role_in_company}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Target Role in Company <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="target_role_in_company"
              value={formData.target_role_in_company}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-md border"
              style={{
                background: 'var(--bg-primary)',
                borderColor: errors.target_role_in_company ? 'rgb(239, 68, 68)' : 'var(--border-default)',
                color: 'var(--text-primary)'
              }}
            />
            {errors.target_role_in_company && (
              <p className="text-xs mt-1" style={{ color: 'rgb(239, 68, 68)' }}>
                {errors.target_role_in_company}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Preferred Language <span className="text-red-500">*</span>
            </label>
            <select
              name="preferred_language"
              value={formData.preferred_language}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-md border"
              style={{
                background: 'var(--bg-primary)',
                borderColor: errors.preferred_language ? 'rgb(239, 68, 68)' : 'var(--border-default)',
                color: 'var(--text-primary)'
              }}
            >
              <option value="">Select language...</option>
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="it">Italian</option>
              <option value="pt">Portuguese</option>
              <option value="ar">Arabic</option>
              <option value="zh">Chinese</option>
              <option value="ja">Japanese</option>
              <option value="ko">Korean</option>
              <option value="ru">Russian</option>
            </select>
            {errors.preferred_language && (
              <p className="text-xs mt-1" style={{ color: 'rgb(239, 68, 68)' }}>
                {errors.preferred_language}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Bio (Optional)
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 rounded-md border"
              style={{
                background: 'var(--bg-primary)',
                borderColor: 'var(--border-default)',
                color: 'var(--text-primary)'
              }}
              placeholder="Tell us about yourself..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              LinkedIn URL (Optional)
            </label>
            <input
              type="url"
              name="linkedin_url"
              value={formData.linkedin_url}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-md border"
              style={{
                background: 'var(--bg-primary)',
                borderColor: 'var(--border-default)',
                color: 'var(--text-primary)'
              }}
              placeholder="https://linkedin.com/in/yourprofile"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              GitHub URL (Optional)
            </label>
            <input
              type="url"
              name="github_url"
              value={formData.github_url}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-md border"
              style={{
                background: 'var(--bg-primary)',
                borderColor: 'var(--border-default)',
                color: 'var(--text-primary)'
              }}
              placeholder="https://github.com/yourusername"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: 'var(--bg-button-primary)',
                color: 'var(--text-button-primary)'
              }}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: 'var(--bg-button-secondary)',
                  color: 'var(--text-button-secondary)'
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfileEditForm;

