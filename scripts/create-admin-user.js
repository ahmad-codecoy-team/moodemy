/**
 * Script to create admin user or add admin role to existing user
 * Run this script once to set up your first admin user
 */

const admin = require('firebase-admin');

// Initialize Firebase Admin (make sure you have your service account key)
const serviceAccount = require('./path-to-your-service-account-key.json'); // Update this path

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${serviceAccount.project_id}-default-rtdb.firebaseio.com/`
});

async function createAdminUser() {
  try {
    // Option 1: Create a new admin user
    const newAdmin = await admin.auth().createUser({
      email: 'admin@moodyme.com', // Change this to your desired admin email
      password: 'AdminPassword123!', // Change this to a secure password
      displayName: 'Admin User',
      disabled: false
    });

    // Set custom claims for admin role
    await admin.auth().setCustomUserClaims(newAdmin.uid, {
      role: 'ADMIN',
      firstName: 'Admin',
      lastName: 'User'
    });

    console.log('✅ Admin user created successfully!');
    console.log('Email:', newAdmin.email);
    console.log('UID:', newAdmin.uid);
    console.log('You can now login with this admin account.');

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  }
}

async function addAdminRoleToExistingUser() {
  try {
    // Option 2: Add admin role to existing user
    const email = 'your-existing-user@example.com'; // Change this to your existing user's email
    
    const userRecord = await admin.auth().getUserByEmail(email);
    
    // Set custom claims for admin role
    await admin.auth().setCustomUserClaims(userRecord.uid, {
      role: 'ADMIN',
      firstName: 'Admin', // Update with actual first name
      lastName: 'User'    // Update with actual last name
    });

    console.log('✅ Admin role added to existing user!');
    console.log('Email:', userRecord.email);
    console.log('UID:', userRecord.uid);
    console.log('The user can now access admin features.');

  } catch (error) {
    console.error('❌ Error adding admin role:', error);
  }
}

// Choose which function to run:
// createAdminUser();        // Uncomment to create new admin user
// addAdminRoleToExistingUser(); // Uncomment to add admin role to existing user

// For safety, let's make this interactive
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('Firebase Admin User Setup');
console.log('========================');
console.log('1. Create new admin user');
console.log('2. Add admin role to existing user');
console.log('');

rl.question('Choose option (1 or 2): ', (answer) => {
  if (answer === '1') {
    createAdminUser().then(() => process.exit());
  } else if (answer === '2') {
    rl.question('Enter the email of the existing user: ', (email) => {
      // Update the email in the function
      addAdminRoleToExistingUser().then(() => process.exit());
    });
  } else {
    console.log('Invalid option');
    process.exit();
  }
});