# Deployment Setup Guide for CrownPrevail Admin Dashboard

## ⚠️ CRITICAL: Security Configuration Required Before Public Hosting

Your admin dashboard uses Firebase for authentication and data storage. **Do NOT deploy to public until you complete these steps.**

---

## Step 1: Create Firebase Environment Configuration

### 1.1 Copy Environment Template
```bash
# Copy the example file
copy .env.example .env
```

### 1.2 Fill in Your Firebase Credentials
Edit `.env` with your actual Firebase project details:

```
VITE_FIREBASE_API_KEY=AIzaSyAXpkiAZpVsmQ4CeyfR_cn8cmOzvklQqXI
VITE_FIREBASE_AUTH_DOMAIN=crownprevail-logistics.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=crownprevail-logistics
VITE_FIREBASE_STORAGE_BUCKET=crownprevail-logistics.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=1026209370719
VITE_FIREBASE_APP_ID=1:1026209370719:web:f3ce4b1d0d412d21d401ea
VITE_FIREBASE_MEASUREMENT_ID=G-1X28HRDEQX
```

### 1.3 (Optional) Add OpenRouter API for AI Assistant
```
VITE_OPENROUTER_API_KEY=sk-or-v1-your_openrouter_api_key_here
```

Get API key from: https://openrouter.ai/

---

## Step 2: Set Up Firestore Security Rules

### 2.1 Deploy Rules to Firebase
```bash
# Install Firebase CLI if not already installed
npm install -g firebase-tools

# Login to Firebase
firebase login

# Deploy security rules
firebase deploy --only firestore:rules
```

### 2.2 Verify Rules Are Active
After deployment, rules in `admin/firestore.rules` will protect your data:
- **Blog Posts**: Public read (published only), admin write
- **Team Members**: Admin only read/write
- **Contact Inquiries**: Admin read, public create (from website)
- **Quotes**: Admin only read/write
- **Newsletter**: Admin read, public subscribe
- **Comments**: Admin moderation, public create

---

## Step 3: Configure Firebase Authentication

### 3.1 Enable Email/Password Authentication
1. Go to Firebase Console → Authentication → Sign-in method
2. Enable "Email/Password" provider
3. Click "Save"

### 3.2 Set Up Admin User
Create your admin user account:
1. Go to Authentication → Users
2. Click "Add user"
3. Enter email and password
4. This user will have admin access to the dashboard

---

## Step 4: Test Locally Before Deploying

### 4.1 Start Development Server
```bash
node preview-server.js
```

### 4.2 Test Login
1. Go to `http://localhost:8080/admin/index.html`
2. Login with your admin credentials
3. Test all features: Dashboard, Team, Blogs, Inquiries

### 4.3 Verify No Console Errors
Open browser DevTools (F12) and check Console tab for errors.

---

## Step 5: Deploy to Hosting

### 5.1 Install Firebase CLI
```bash
npm install -g firebase-tools
```

### 5.2 Initialize Firebase (if not done)
```bash
firebase init
# Select: Hosting
# Public directory: . (root folder)
# Configure as SPA: Yes
```

### 5.3 Build and Deploy
```bash
# For static hosting (no build required)
firebase deploy
```

---

## Step 6: Post-Deployment Checklist

- [ ] Login works with admin credentials
- [ ] Dashboard loads and shows stats
- [ ] Team management (CRUD) works
- [ ] Blog management works
- [ ] Inquiries display correctly
- [ ] No API key errors in browser console
- [ ] Firestore rules are enforcing permissions

---

## Troubleshooting

### "Firebase configuration is incomplete" Error
- Make sure `.env` file exists in root directory
- Check all environment variables are set
- Restart your server after creating `.env`

### "Permission denied" in Firestore
- Deploy security rules: `firebase deploy --only firestore:rules`
- Check user is logged in
- Verify user has admin role if required

### "Network error" or "Failed to fetch"
- Check Firebase project ID matches in config
- Verify API key is valid
- Check CORS settings in Firebase Console

---

## Security Best Practices

1. **Never commit `.env` to git** - It's already in `.gitignore`
2. **Use environment variables** for all sensitive data
3. **Keep API keys secret** - Never share them publicly
4. **Review Firestore rules** regularly
5. **Enable audit logging** for production

---

## Support

If you encounter issues:
1. Check browser console (F12) for errors
2. Verify Firebase project settings
3. Confirm all environment variables are set
4. Review Firestore security rules
