// Script to clear all data from the database
// Run with: node backend/src/scripts/clearDatabase.js

const { Pool } = require('pg');
require('dotenv').config();

// Get database URL from environment or use Railway's default
const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!databaseUrl) {
  console.error('❌ DATABASE_URL or POSTGRES_URL environment variable is not set!');
  console.error('Please set DATABASE_URL in your .env file or Railway environment variables.');
  process.exit(1);
}

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: databaseUrl.includes('railway') || databaseUrl.includes('supabase') 
    ? { rejectUnauthorized: false } 
    : false
});

async function clearDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('🗑️  Starting database cleanup...');
    
    await client.query('BEGIN');
    
    // Delete in reverse order of dependencies
    const deleteQueries = [
      'DELETE FROM employee_requests',
      'DELETE FROM employee_profile_approvals',
      'DELETE FROM trainer_settings',
      'DELETE FROM employee_project_summaries',
      'DELETE FROM employee_roles',
      'DELETE FROM employee_teams',
      'DELETE FROM employee_managers',
      'DELETE FROM audit_logs',
      'DELETE FROM employees',
      'DELETE FROM teams',
      'DELETE FROM departments',
      'DELETE FROM company_registration_requests',
      'DELETE FROM companies'
    ];
    
    for (const query of deleteQueries) {
      const result = await client.query(query);
      console.log(`✅ ${query}: ${result.rowCount} rows deleted`);
    }
    
    await client.query('COMMIT');
    
    // Verify deletion
    const verifyQueries = [
      { name: 'companies', query: 'SELECT COUNT(*) FROM companies' },
      { name: 'employees', query: 'SELECT COUNT(*) FROM employees' },
      { name: 'departments', query: 'SELECT COUNT(*) FROM departments' },
      { name: 'teams', query: 'SELECT COUNT(*) FROM teams' },
      { name: 'employee_roles', query: 'SELECT COUNT(*) FROM employee_roles' },
      { name: 'employee_requests', query: 'SELECT COUNT(*) FROM employee_requests' },
      { name: 'employee_profile_approvals', query: 'SELECT COUNT(*) FROM employee_profile_approvals' }
    ];
    
    console.log('\n📊 Verification:');
    for (const { name, query } of verifyQueries) {
      const result = await client.query(query);
      const count = result.rows[0].count;
      console.log(`   ${name}: ${count} rows remaining`);
    }
    
    console.log('\n✅ Database cleared successfully!');
    console.log('You can now upload a new CSV file.');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error clearing database:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the script
clearDatabase()
  .then(() => {
    console.log('\n✨ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Failed:', error);
    process.exit(1);
  });

