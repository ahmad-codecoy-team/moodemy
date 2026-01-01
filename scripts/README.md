# Firebase Admin Setup Scripts

## Quick Setup for Admin User

Since Firebase Console doesn't have a direct UI for adding custom claims, we need to use the Admin SDK to set up your first admin user.

### Method 1: Using the Node.js Script (Recommended)

1. **Download your service account key:**
   - Go to Firebase Console → Project Settings → Service Accounts
   - Click "Generate new private key"
   - Save the JSON file securely

2. **Update the script:**
   ```bash
   cd scripts
   ```
   - Edit `create-admin-user.js`
   - Update the path to your service account key file
   - Update admin email and password if needed

3. **Run the script:**
   ```bash
   node create-admin-user.js
   ```

4. **Choose option:**
   - Option 1: Create new admin user
   - Option 2: Add admin role to existing user

### Method 2: Using Firebase CLI (Alternative)

If you prefer using Firebase CLI:

1. **Install Firebase CLI:**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase:**
   ```bash
   firebase login
   ```

3. **Set custom claims via Firebase Functions:**
   Create a temporary Firebase Function to set claims.

### Method 3: Direct Firebase Console Workaround

1. **Go to Firebase Console → Authentication → Users**
2. **Click on your user**
3. **In the user details, look for "Custom claims" section**
   - If you don't see it, refresh the page
   - Sometimes it appears after clicking "Show more"

4. **Add custom claims JSON:**
   ```json
   {
     "role": "ADMIN",
     "firstName": "Your Name",
     "lastName": "Last Name"
   }
   ```

## After Setting Up Admin User

1. **Test the login:**
   - Go to your Next.js app
   - Use the admin email and password to login

2. **Verify custom claims:**
   - Check if the user gets access to admin dashboard
   - Verify the role is properly set

## Troubleshooting

- **"Custom claims" option missing:** Try refreshing Firebase Console or using Method 1
- **Permission denied:** Ensure your service account has proper permissions
- **Authentication failed:** Double-check your .env.local variables

## Security Note

- Remove the service account key file after setup
- Change default passwords immediately
- Never commit service account keys to version control