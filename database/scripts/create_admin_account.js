// Script to create a directory admin account using AdminRepository
// Usage: node database/scripts/create_admin_account.js

const AdminRepository = require('../../backend/src/infrastructure/AdminRepository');

async function createAdmin() {
  try {
    const adminRepository = new AdminRepository();
    
    // Admin credentials
    const adminData = {
      email: 'admin@educore.io',
      password: 'SecurePass123',
      full_name: 'Directory Admin'
    };
    
    // Check if admin already exists
    const existingAdmin = await adminRepository.findByEmail(adminData.email);
    if (existingAdmin) {
      console.log('⚠️  Admin account already exists with email:', adminData.email);
      console.log('Admin ID:', existingAdmin.id);
      console.log('Admin Name:', existingAdmin.full_name);
      console.log('Admin Active:', existingAdmin.is_active);
      console.log('\nTo update the password, delete the existing admin first or update it manually.');
      process.exit(0);
    }
    
    console.log('Creating admin account...');
    console.log('Email:', adminData.email);
    console.log('Name:', adminData.full_name);
    
    const admin = await adminRepository.create(adminData);
    
    console.log('\n✅ Admin account created successfully!');
    console.log('Admin ID:', admin.id);
    console.log('Admin Email:', admin.email);
    console.log('Admin Name:', admin.full_name);
    console.log('\n📝 Login Credentials:');
    console.log('   Email: admin@educore.io');
    console.log('   Password: SecurePass123');
    console.log('\n⚠️  IMPORTANT: Change the password in production!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin account:', error);
    if (error.code === '23505') {
      console.error('   Error: Admin with this email already exists');
    }
    process.exit(1);
  }
}

createAdmin();

