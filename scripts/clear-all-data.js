// Node.js script to clear all companies and employees data
// Run with: node scripts/clear-all-data.js
// WARNING: This will delete ALL data from the database

const { Pool } = require('pg');
const config = require('../backend/src/config');

async function clearAllData() {
  if (!config.databaseUrl) {
    throw new Error('DATABASE_URL is not configured.');
  }

  const pool = new Pool({
    connectionString: config.databaseUrl,
    ssl: config.databaseSsl ? { rejectUnauthorized: false } : false,
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 30000,
    max: 10
  });

  const client = await pool.connect();

  try {
    console.log('🗑️  Starting data deletion...\n');

    // Start transaction
    await client.query('BEGIN');

    // Delete in reverse order of dependencies
    console.log('Deleting employee_profile_approvals...');
    await client.query('DELETE FROM employee_profile_approvals');
    console.log('✓ Deleted employee_profile_approvals');

    console.log('Deleting employee_project_summaries...');
    await client.query('DELETE FROM employee_project_summaries');
    console.log('✓ Deleted employee_project_summaries');

    console.log('Deleting trainer_settings...');
    await client.query('DELETE FROM trainer_settings');
    console.log('✓ Deleted trainer_settings');

    console.log('Deleting employee_roles...');
    await client.query('DELETE FROM employee_roles');
    console.log('✓ Deleted employee_roles');

    console.log('Deleting employee_teams...');
    await client.query('DELETE FROM employee_teams');
    console.log('✓ Deleted employee_teams');

    console.log('Deleting employee_managers...');
    await client.query('DELETE FROM employee_managers');
    console.log('✓ Deleted employee_managers');

    console.log('Deleting employees...');
    await client.query('DELETE FROM employees');
    console.log('✓ Deleted employees');

    console.log('Deleting teams...');
    await client.query('DELETE FROM teams');
    console.log('✓ Deleted teams');

    console.log('Deleting departments...');
    await client.query('DELETE FROM departments');
    console.log('✓ Deleted departments');

    console.log('Deleting companies...');
    await client.query('DELETE FROM companies');
    console.log('✓ Deleted companies');

    console.log('Deleting company_registration_requests...');
    await client.query('DELETE FROM company_registration_requests');
    console.log('✓ Deleted company_registration_requests');

    console.log('Deleting audit_logs...');
    await client.query('DELETE FROM audit_logs');
    console.log('✓ Deleted audit_logs');

    // Commit transaction
    await client.query('COMMIT');
    console.log('\n✅ All data deleted successfully!\n');

    // Verify deletion
    console.log('Verifying deletion...\n');
    const counts = await client.query(`
      SELECT 
        (SELECT COUNT(*) FROM companies) as companies_count,
        (SELECT COUNT(*) FROM employees) as employees_count,
        (SELECT COUNT(*) FROM departments) as departments_count,
        (SELECT COUNT(*) FROM teams) as teams_count,
        (SELECT COUNT(*) FROM employee_roles) as employee_roles_count,
        (SELECT COUNT(*) FROM employee_teams) as employee_teams_count,
        (SELECT COUNT(*) FROM employee_managers) as employee_managers_count,
        (SELECT COUNT(*) FROM employee_profile_approvals) as approvals_count,
        (SELECT COUNT(*) FROM employee_project_summaries) as project_summaries_count,
        (SELECT COUNT(*) FROM trainer_settings) as trainer_settings_count,
        (SELECT COUNT(*) FROM company_registration_requests) as registration_requests_count,
        (SELECT COUNT(*) FROM audit_logs) as audit_logs_count
    `);

    const result = counts.rows[0];
    console.log('Remaining records:');
    console.log(`  Companies: ${result.companies_count}`);
    console.log(`  Employees: ${result.employees_count}`);
    console.log(`  Departments: ${result.departments_count}`);
    console.log(`  Teams: ${result.teams_count}`);
    console.log(`  Employee Roles: ${result.employee_roles_count}`);
    console.log(`  Employee Teams: ${result.employee_teams_count}`);
    console.log(`  Employee Managers: ${result.employee_managers_count}`);
    console.log(`  Profile Approvals: ${result.approvals_count}`);
    console.log(`  Project Summaries: ${result.project_summaries_count}`);
    console.log(`  Trainer Settings: ${result.trainer_settings_count}`);
    console.log(`  Registration Requests: ${result.registration_requests_count}`);
    console.log(`  Audit Logs: ${result.audit_logs_count}`);

    if (
      result.companies_count === '0' &&
      result.employees_count === '0' &&
      result.departments_count === '0' &&
      result.teams_count === '0'
    ) {
      console.log('\n✅ Database is now empty and ready for testing!');
    } else {
      console.log('\n⚠️  Warning: Some records may still exist. Please check manually.');
    }
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error deleting data:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the script
clearAllData()
  .then(() => {
    console.log('\n✨ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Failed:', error.message);
    process.exit(1);
  });

