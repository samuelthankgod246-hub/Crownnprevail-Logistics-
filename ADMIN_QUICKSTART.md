# Admin Dashboard - Quick Start Guide

## 🚀 Getting Started in 2 Minutes

### Step 1: Access the Admin Dashboard
Navigate to: `https://your-domain.com/admin/index.html`

Or locally: `file:///path-to/admin/index.html`

### Step 2: Login
1. Enter your admin email
2. Enter your password (minimum 6 characters)
3. Click "Sign In"
4. You'll be redirected to the dashboard

### Step 3: Explore the Dashboard
You're now in the admin area! The sidebar shows all available sections.

---

## 📍 Navigation Guide

### Sidebar Menu
Located on the left side of every admin page:

| Icon | Section | Purpose |
|------|---------|---------|
| 📊 | Dashboard | View overview and recent activity |
| 📝 | Blog Posts | Manage all blog content |
| ✉️ | Inquiries | Track customer inquiries |
| 👥 | Team | Manage team members |
| 📈 | Analytics | View detailed analytics and trends |
| 👤 | Profile | Account settings and preferences |

### Quick Access
- **View Site:** Opens main website in new tab
- **Sign Out:** Logs you out and returns to login page
- **Profile:** Your account settings and preferences

---

## 🎯 Common Tasks

### Create a Blog Post

**Path:** Dashboard → Blog Posts → New Post

**Steps:**
1. Click "New Post" button
2. Fill in the title (required)
3. Add excerpt/summary (required, max 300 chars)
4. Write content in the rich editor
5. (Optional) Add featured image URL
6. (Optional) Set category
7. (Optional) Set author name
8. Click "Save Post"

**Tips:**
- Slug auto-generates from title (customizable)
- Use editor toolbar for formatting
- Set status to "Draft" to save without publishing
- Character counter shows excerpt length

---

### Manage Team Members

**Path:** Dashboard → Team

**Add a Member:**
1. Click "Add Member" button
2. Enter full name (required)
3. Enter title/position (required)
4. Add image path (optional)
5. Set display order (for sorting)
6. Add bio (optional, max 500 chars)
7. Click "Save"

**Edit a Member:**
1. Find member in table
2. Click "Edit" button
3. Update desired fields
4. Click "Update"

**Delete a Member:**
1. Find member in table
2. Click "Delete" button
3. Confirm deletion
4. Member is removed

**Search Members:**
1. Use search box at top right of table
2. Search by name, title, or bio
3. Results update in real-time
4. Click page numbers to navigate

---

### Track Inquiries

**Path:** Dashboard → Inquiries

**View Contact Inquiries:**
1. Click "Contact" tab
2. See list of incoming contact requests
3. Use search to find specific inquiry
4. See customer name, email, and message preview

**View Quote Requests:**
1. Click "Quotes" tab
2. See all quote request details
3. View pickup and dropoff locations
4. Click "Export" to download as CSV

**View Newsletter Subscriptions:**
1. Click "Newsletter" tab
2. See all subscriber emails
3. Click "Export" to download email list as CSV

**View Tracking Inquiries:**
1. Click "Tracking" tab
2. See tracking numbers submitted

**View Blog Comments:**
1. Click "Comments" tab
2. See comments on blog posts
3. View commenter name and date

---

### Analyze Trends

**Path:** Dashboard → Analytics

**View Summary Stats:**
- Total Submissions (all types)
- Blog Posts count
- Team Members count
- Average daily submissions (last 30 days)

**View Charts:**
1. **Submissions by Type:** See which inquiry type is most common
2. **30-Day Trends:** Track submission patterns over the month

**Filter by Date Range:**
1. Select "From" date
2. Select "To" date
3. Click "Apply"
4. Charts update with new data
5. Click "Reset" to clear filters

**View Recent Activity:**
- Scroll down to see last 20 activities
- See type, description, and timestamp
- Reverse chronological order

---

### Manage Account

**Path:** Sidebar footer → Profile

**View Account Info:**
- See your admin email
- Account creation date
- Last login time
- Account status (Active)

**Change Password:**
1. Click "Change Password" button
2. Enter current password
3. Enter new password (min 6 chars)
4. Confirm new password
5. Click "Update Password"

**Set Preferences:**
1. Toggle "Email Notifications" on/off
2. Toggle "Daily Digest" on/off
3. Select Theme (Light/Dark/Auto)
4. Select Timezone
5. Click "Save Preferences"

**Clear Cache:**
1. Scroll to "Danger Zone"
2. Click "Clear Cache"
3. Confirm action
4. All local data is cleared

**Sign Out All Sessions:**
1. Scroll to "Danger Zone"
2. Click "Sign Out All Sessions"
3. Confirm action
4. You'll be logged out from all devices

---

## 💡 Pro Tips

### Search Features
- **Real-time search:** Starts searching as you type
- **Debounced search:** Waits 300ms after you stop typing
- **Multi-field search:** Searches multiple fields (name, email, bio, etc.)
- **Clear search:** Delete search text to see all results

### Pagination
- **Page buttons:** Click number to jump to specific page
- **10 items per page:** Default pagination size
- **Resets on search:** Page 1 when you search
- **Navigation:** Easy page switching

### Sorting
- **Click column headers:** Click "Name", "Order", "Title" to sort
- **Ascending/Descending:** Click again to reverse order
- **Visual indicator:** Arrow shows sort direction

### Forms
- **Real-time validation:** Errors show as you type
- **Required fields:** Marked with * (asterisk)
- **Character counters:** Bio, excerpt show length/limit
- **Auto-generation:** Slug generates from title
- **Error messages:** Clear, helpful error descriptions

### Mobile Usage
- **Sidebar collapses:** Click away to see content
- **Full-width forms:** Better for typing on mobile
- **Touch-friendly buttons:** Large 44px+ targets
- **Toasts at bottom:** Notifications stay visible

---

## 🔐 Security Tips

### Password Best Practices
- Use a strong, unique password
- Minimum 6 characters (recommend 8+)
- Include letters, numbers, symbols
- Don't reuse passwords
- Change regularly (recommended quarterly)

### Session Security
- Don't leave dashboard unattended
- Log out when finished
- Use "Sign Out All Sessions" if device compromised
- Clear browser cache regularly
- Never share your login credentials

### Data Protection
- Don't paste sensitive data in forms
- Be careful with export files (contain emails)
- Secure exported CSV files
- Use HTTPS only
- Verify SSL certificate

---

## ⚠️ Important Notes

### Before You Delete
- **Blog posts:** Cannot be recovered after deletion
- **Team members:** Removes from all systems
- **Inquiries:** Archives (not deleted, depends on Firebase)
- **Confirmation dialogs:** Always confirm destructive actions

### Auto-Save Features
- **Preferences:** Saved to browser's local storage
- **Blog posts:** Require explicit save
- **Team members:** Require explicit save
- **Settings:** Saved when you click save button

### Character Limits
- Blog title: 200 characters max
- Blog excerpt: 300 characters max
- Team bio: 500 characters max
- These are enforced at input level

### Date/Time
- All dates shown in your local timezone
- Set timezone in Profile preferences
- Creation dates are server-side timestamps
- Last login shows from your account metadata

---

## 🆘 Troubleshooting

### Can't Login?
- Check email address spelling
- Verify password (case-sensitive)
- Reset password if forgotten
- Check internet connection
- Clear browser cache and try again

### Can't Save Changes?
- Check internet connection
- Verify all required fields filled (marked with *)
- Look for red error messages
- Try refreshing the page
- Log out and back in

### Search Not Working?
- Check internet connection
- Wait for data to load (skeletons show while loading)
- Try different search term
- Clear search and try again
- Refresh page if stuck

### Charts Not Showing?
- Check internet connection
- Wait for analytics page to fully load
- JavaScript must be enabled
- Try different browser
- Clear browser cache

### Mobile Issues?
- Ensure viewport is set correctly
- Try landscape orientation
- Pinch to zoom if needed
- Clear browser cache
- Try different mobile browser

---

## 📞 Support

### Common Questions

**Q: How do I reset my password?**
A: Go to Profile → Security → Change Password button

**Q: How long is my session?**
A: Sessions persist for 24 hours. You'll be automatically logged out after that.

**Q: Can I export inquiries data?**
A: Yes, Quote Requests and Newsletter can be exported to CSV.

**Q: How do I backup my data?**
A: Manually export CSV files regularly or contact Firebase support.

**Q: Can multiple admins access simultaneously?**
A: Yes, Firebase supports concurrent access. All see real-time data updates.

---

## 🎓 Learning Resources

### Dashboard Features
- [Blog Editor Guide](#blog-editor-features) - Detailed editor instructions
- [Team Management](#team-management) - Complete team features
- [Analytics Features](#analytics-page-features) - Chart and report guide
- [Mobile Usage](#mobile-experience) - Mobile tips and tricks

### Video Tutorials
- Coming soon to help center
- Email support@crownprevail.com to request

### Documentation
- Full feature documentation: See `ADMIN_DASHBOARD_PREVIEW.md`
- Features matrix: See `ADMIN_FEATURES_MATRIX.md`

---

## 📋 Checklist for New Admins

- [ ] Log in successfully
- [ ] Explore all sidebar pages
- [ ] Create a test blog post
- [ ] Edit a blog post
- [ ] Add a team member
- [ ] Search for team member
- [ ] View inquiries in each tab
- [ ] Export a CSV file
- [ ] Check analytics dashboard
- [ ] Update profile preferences
- [ ] Change your password
- [ ] Log out and back in

---

**Ready to manage your CrownPrevail website! 🎉**

For detailed feature information, see `ADMIN_DASHBOARD_PREVIEW.md`

For complete feature matrix, see `ADMIN_FEATURES_MATRIX.md`
