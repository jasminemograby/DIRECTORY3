// Script to run database migrations
// Usage: node scripts/run-migration.js

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const config = require('../src/config');

async function runMigration() {
  const pool = new Pool({
    connectionString: config.databaseUrl,
    ssl: config.databaseSsl ? { rejectUnauthorized: false } : false,
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 30000,
    max: 10
  });

  try {
    console.log('🔗 Connecting to database...');
    console.log('📄 Reading migration file...');
    
    // Read migration file
    const migrationPath = path.join(__dirname, '../../database/migrations/001_initial_schema.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('▶️  Running migration...');
    console.log('   This may take a few moments...\n');
    
    // Execute migration
    await pool.query(migrationSQL);
    
    console.log('✅ Migration completed successfully!');
    console.log('\n📊 Verifying tables...');
    
    // Verify tables were created
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);
    
    console.log(`\n✅ Found ${tablesResult.rows.length} tables:`);
    tablesResult.rows.forEach((row, index) => {
      console.log(`   ${index + 1}. ${row.table_name}`);
    });
    
    // Check specifically for employee_profile_approvals
    const approvalTableCheck = tablesResult.rows.find(r => r.table_name === 'employee_profile_approvals');
    if (approvalTableCheck) {
      console.log('\n✅ employee_profile_approvals table exists!');
    } else {
      console.log('\n⚠️  employee_profile_approvals table not found (may need to check migration)');
    }
    
    // Check for profile_status column
    const profileStatusCheck = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'employees' 
      AND column_name = 'profile_status'
    `);
    
    if (profileStatusCheck.rows.length > 0) {
      console.log('✅ profile_status column exists in employees table!');
    } else {
      console.log('⚠️  profile_status column not found in employees table');
    }
    
    console.log('\n🎉 Database migration complete!');
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    if (error.code === '42P07') {
      console.log('\n💡 Note: Some tables may already exist. This is normal if migration was partially run.');
    }
    console.error(error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigration();

