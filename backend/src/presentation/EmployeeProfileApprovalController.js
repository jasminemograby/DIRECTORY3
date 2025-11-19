// Presentation Layer - Employee Profile Approval Controller
// Handles HR approval/rejection of enriched employee profiles

const EmployeeProfileApprovalRepository = require('../infrastructure/EmployeeProfileApprovalRepository');
const EmployeeRepository = require('../infrastructure/EmployeeRepository');
const { hrOnlyMiddleware } = require('../shared/authMiddleware');

class EmployeeProfileApprovalController {
  constructor() {
    this.approvalRepository = new EmployeeProfileApprovalRepository();
    this.employeeRepository = new EmployeeRepository();
  }

  /**
   * Get all pending approval requests for a company
   * GET /api/v1/companies/:id/profile-approvals
   * Requires HR authentication
   */
  async getPendingApprovals(req, res, next) {
    try {
      const { id: companyId } = req.params;

      // Verify user is HR for this company
      if (!req.user || !req.user.isHR || req.user.companyId !== companyId) {
        return res.status(403).json({
          error: 'Access denied. HR privileges required.'
        });
      }

      const pendingApprovals = await this.approvalRepository.findPendingByCompanyId(companyId);

      return res.status(200).json({
        approvals: pendingApprovals
      });
    } catch (error) {
      console.error('[EmployeeProfileApprovalController] Error fetching pending approvals:', error);
      return res.status(500).json({
        error: 'An error occurred while fetching pending approvals'
      });
    }
  }

  /**
   * Approve an enriched employee profile
   * POST /api/v1/companies/:id/profile-approvals/:approvalId/approve
   * Requires HR authentication
   */
  async approveProfile(req, res, next) {
    try {
      const { id: companyId, approvalId } = req.params;
      const hrEmployeeId = req.user?.id;

      // Verify user is HR for this company
      if (!req.user || !req.user.isHR || req.user.companyId !== companyId) {
        return res.status(403).json({
          error: 'Access denied. HR privileges required.'
        });
      }

      // Get approval request
      const approval = await this.approvalRepository.findById(approvalId);
      if (!approval) {
        console.error('[EmployeeProfileApprovalController] Approval not found:', {
          approvalId,
          companyId,
          hrEmployeeId
        });
        return res.status(404).json({
          error: 'Approval request not found'
        });
      }

      console.log('[EmployeeProfileApprovalController] Found approval:', {
        id: approval.id,
        employee_uuid: approval.employee_uuid,
        employee_id: approval.employee_id,
        company_id: approval.company_id,
        status: approval.status
      });

      // Verify approval belongs to this company
      // Compare as strings to handle UUID comparison (UUIDs can be objects or strings)
      const approvalCompanyId = approval.company_id?.toString() || approval.company_id;
      const requestCompanyId = companyId?.toString() || companyId;
      
      if (approvalCompanyId !== requestCompanyId) {
        console.error('[EmployeeProfileApprovalController] Company ID mismatch:', {
          approvalCompanyId: approvalCompanyId,
          requestedCompanyId: requestCompanyId,
          approvalCompanyIdType: typeof approvalCompanyId,
          requestCompanyIdType: typeof requestCompanyId
        });
        return res.status(403).json({
          error: 'Approval request does not belong to this company'
        });
      }

      // Verify approval is pending
      if (approval.status !== 'pending') {
        return res.status(400).json({
          error: `Approval request is already ${approval.status}`
        });
      }

      // Update approval request
      const updatedApproval = await this.approvalRepository.approveProfile(approvalId, hrEmployeeId);

      // Update employee profile status to 'approved'
      // Use employee_uuid (the UUID from apa.employee_id) - this is the correct UUID field
      const employeeUuid = approval.employee_uuid || approval.employee_id;
      
      if (!employeeUuid) {
        console.error('[EmployeeProfileApprovalController] No employee UUID found in approval:', approval);
        return res.status(500).json({
          error: 'Unable to identify employee from approval request'
        });
      }

      console.log('[EmployeeProfileApprovalController] Updating employee profile status:', {
        employeeUuid,
        newStatus: 'approved'
      });

      await this.employeeRepository.updateProfileStatus(employeeUuid, 'approved');

      console.log(`[EmployeeProfileApprovalController] ✅ Profile approved for employee: ${employeeUuid}`);

      return res.status(200).json({
        success: true,
        approval: updatedApproval,
        message: 'Profile approved successfully'
      });
    } catch (error) {
      console.error('[EmployeeProfileApprovalController] Error approving profile:', error);
      return res.status(500).json({
        error: 'An error occurred while approving profile'
      });
    }
  }

  /**
   * Reject an enriched employee profile
   * POST /api/v1/companies/:id/profile-approvals/:approvalId/reject
   * Requires HR authentication
   */
  async rejectProfile(req, res, next) {
    try {
      const { id: companyId, approvalId } = req.params;
      const { reason } = req.body;
      const hrEmployeeId = req.user?.id;

      // Verify user is HR for this company
      if (!req.user || !req.user.isHR || req.user.companyId !== companyId) {
        return res.status(403).json({
          error: 'Access denied. HR privileges required.'
        });
      }

      // Get approval request
      const approval = await this.approvalRepository.findById(approvalId);
      if (!approval) {
        return res.status(404).json({
          error: 'Approval request not found'
        });
      }

      // Verify approval belongs to this company
      // Compare as strings to handle UUID comparison
      const approvalCompanyId = approval.company_id?.toString() || approval.company_id;
      const requestCompanyId = companyId?.toString() || companyId;
      
      if (approvalCompanyId !== requestCompanyId) {
        console.error('[EmployeeProfileApprovalController] Company ID mismatch (reject):', {
          approvalCompanyId: approvalCompanyId,
          requestedCompanyId: requestCompanyId
        });
        return res.status(403).json({
          error: 'Approval request does not belong to this company'
        });
      }

      // Verify approval is pending
      if (approval.status !== 'pending') {
        return res.status(400).json({
          error: `Approval request is already ${approval.status}`
        });
      }

      // Update approval request
      const updatedApproval = await this.approvalRepository.rejectProfile(
        approvalId,
        hrEmployeeId,
        reason || 'Profile rejected by HR'
      );

      // Update employee profile status to 'rejected'
      // Use employee_uuid (the UUID from apa.employee_id) - this is the correct UUID field
      const employeeUuid = approval.employee_uuid || approval.employee_id;
      
      if (!employeeUuid) {
        console.error('[EmployeeProfileApprovalController] No employee UUID found in approval:', approval);
        return res.status(500).json({
          error: 'Unable to identify employee from approval request'
        });
      }

      console.log('[EmployeeProfileApprovalController] Updating employee profile status:', {
        employeeUuid,
        newStatus: 'rejected'
      });

      await this.employeeRepository.updateProfileStatus(employeeUuid, 'rejected');

      console.log(`[EmployeeProfileApprovalController] ❌ Profile rejected for employee: ${employeeUuid}`);

      return res.status(200).json({
        success: true,
        approval: updatedApproval,
        message: 'Profile rejected'
      });
    } catch (error) {
      console.error('[EmployeeProfileApprovalController] Error rejecting profile:', error);
      return res.status(500).json({
        error: 'An error occurred while rejecting profile'
      });
    }
  }

  /**
   * Get approval status for an employee
   * GET /api/v1/employees/:id/approval-status
   * Requires authentication
   */
  async getApprovalStatus(req, res, next) {
    try {
      const { id: employeeId } = req.params;
      const authenticatedEmployeeId = req.user?.id;
      const isHR = req.user?.isHR || false;

      // Verify user can access this employee's approval status
      if (!isHR && authenticatedEmployeeId !== employeeId) {
        return res.status(403).json({
          error: 'You can only view your own approval status'
        });
      }

      const approval = await this.approvalRepository.findByEmployeeId(employeeId);
      const employee = await this.employeeRepository.findById(employeeId);

      if (!employee) {
        return res.status(404).json({
          error: 'Employee not found'
        });
      }

      return res.status(200).json({
        employee_id: employeeId,
        profile_status: employee.profile_status,
        approval: approval || null
      });
    } catch (error) {
      console.error('[EmployeeProfileApprovalController] Error fetching approval status:', error);
      return res.status(500).json({
        error: 'An error occurred while fetching approval status'
      });
    }
  }
}

module.exports = EmployeeProfileApprovalController;

