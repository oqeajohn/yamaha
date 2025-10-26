/**
 * Password Hash Generator
 * Run this script to generate a new bcrypt hash for your admin password
 * 
 * Usage: node generate-password.js <your-new-password>
 * Example: node generate-password.js MyNewPassword123
 */

const bcrypt = require('bcrypt');

const password = process.argv[2];

if (!password) {
    console.error('\n❌ Error: Please provide a password');
    console.log('\nUsage: node generate-password.js <your-new-password>');
    console.log('Example: node generate-password.js MyNewPassword123\n');
    process.exit(1);
}

if (password.length < 6) {
    console.error('\n❌ Error: Password must be at least 6 characters long\n');
    process.exit(1);
}

console.log('\n🔐 Generating password hash...\n');

bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
        console.error('❌ Error generating hash:', err);
        process.exit(1);
    }
    
    console.log('✅ Password hash generated successfully!\n');
    console.log('Copy this hash to server.js:\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(hash);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('📝 Update server.js (around line 27-30):');
    console.log(`
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: '${hash}'
};
`);
    console.log('⚠️  After updating, restart the server:\n');
    console.log('   npm start\n');
});
