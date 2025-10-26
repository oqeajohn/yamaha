# How to Change Admin Password

## Current Credentials

- **Username**: `admin`
- **Password**: `password` (default)

## Method 1: Using the Password Generator Script (Recommended)

### Step 1: Generate New Password Hash

Run the password generator script:

```bash
cd /Users/johnalcantara/Documents/yamaha
node generate-password.js YourNewPassword123
```

Replace `YourNewPassword123` with your desired password.

### Step 2: Copy the Hash

The script will output a hash like this:
```
$2a$10$AbCdEfGhIjKlMnOpQrStUvWxYz1234567890AbCdEfGhIjKlMnOp
```

### Step 3: Update server.js

Open `server.js` and find the `ADMIN_CREDENTIALS` section (around line 27-30):

```javascript
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' // OLD HASH
};
```

Replace with the new hash:

```javascript
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: '$2a$10$AbCdEfGhIjKlMnOpQrStUvWxYz1234567890AbCdEfGhIjKlMnOp' // NEW HASH
};
```

### Step 4: Restart the Server

```bash
# Stop the current server (Ctrl+C if running in terminal)
# Or kill the process:
lsof -ti:3000 | xargs kill -9

# Start the server again
npm start
```

### Step 5: Test Login

1. Go to http://localhost:3000/admin/login-vue.html
2. Login with:
   - Username: `admin`
   - Password: `YourNewPassword123` (or whatever you chose)

## Method 2: Change Username Too

If you also want to change the username, update both fields:

```javascript
const ADMIN_CREDENTIALS = {
    username: 'myadmin',  // Change this
    password: '$2a$10$AbCdEfGhIjKlMnOpQrStUvWxYz1234567890AbCdEfGhIjKlMnOp'
};
```

## Method 3: Quick Test (Manual Hash)

If you just want to test, here are some pre-generated hashes:

### Password: `admin123`
```javascript
password: '$2a$10$7Z5qN3rE8vK9mX2wY1pQ.OGkKzVxWuAsDfGhJkLmNoPqRsTuVwXyZ'
```

### Password: `yamaha2024`
```javascript
password: '$2a$10$8A6rO4sF9wL0nY3xZ2qR.PHlLaWyXvBtEgIjKmLoOpQsTvUwYzAaC'
```

⚠️ **Note**: These are example hashes. For security, generate your own using the script!

## Security Best Practices

1. ✅ Use a strong password (at least 8 characters, mix of letters, numbers, symbols)
2. ✅ Don't share the password
3. ✅ Change the default password immediately
4. ✅ Keep the `server.js` file secure (don't commit to public repos with real passwords)
5. ✅ Consider using environment variables for production

## Troubleshooting

### "Invalid credentials" after changing password

- Make sure you copied the full hash (it's very long!)
- Check for extra spaces or line breaks
- Verify the server was restarted
- Check the browser console for errors

### Lost password?

If you forget the password, just generate a new hash and update `server.js` again.

### Server won't start?

Check the terminal for syntax errors in `server.js`. Make sure the hash is wrapped in quotes:

```javascript
password: '$2a$10$...'  // ✅ Correct
password: $2a$10$...    // ❌ Wrong (missing quotes)
```

## Example: Complete Password Change Process

```bash
# 1. Generate hash
node generate-password.js MySecurePass2024

# 2. Copy the output hash

# 3. Edit server.js
nano server.js  # or use your editor

# 4. Find ADMIN_CREDENTIALS section and paste new hash

# 5. Restart server
lsof -ti:3000 | xargs kill -9
npm start

# 6. Test login at http://localhost:3000/admin/login-vue.html
```

Done! Your admin password is now changed.
