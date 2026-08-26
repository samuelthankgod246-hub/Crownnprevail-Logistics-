# CrownPrevail Admin Dashboard - Feature Preview

## 🎯 Overview
Professional-grade admin dashboard for managing the CrownPrevail Logistics website. Built with Firebase backend, vanilla JavaScript, and modern CSS with Font Awesome icons.

---

## 📋 Pages & Features

### 1. **Login Page** (`admin/index.html`)
**URL:** `/admin/index.html`

**Features:**
- Clean, professional login form
- Real-time email and password validation
- Error message display with animations
- Toast notifications for feedback
- Auto-focus on email field
- Loading state with spinner during login
- Back to website link
- Mobile-responsive design
- Slide-in animation on page load

**Validation:**
- Email format validation
- Password minimum 6 characters
- Real-time error feedback
- Field-level validation on blur

---

### 2. **Dashboard** (`admin/dashboard.html`)
**URL:** `/admin/dashboard.html` (requires login)

**Key Statistics:**
- 📝 Blog Posts count
- ✉️ Contact Inquiries count
- 📋 Quote Requests count
- 📧 Newsletter Subscriptions count

**Quick Actions:**
- ➕ New Blog Post button
- 📧 View Inquiries link
- 👥 Manage Team link

**Recent Inquiries:**
- Live feed of latest contact inquiries
- Shows name, type, message preview, and date
- Clickable to view full details
- Auto-loads most recent 5 entries

**Design:**
- Card-based layout
- Professional color scheme (navy/gold)
- Responsive grid system
- Loading skeletons while fetching data

---

### 3. **Blog Posts** (`admin/blogs.html`)
**URL:** `/admin/blogs.html`

**Features:**
- List all blog posts in professional table
- Create new blog post (button)
- Edit existing posts
- Delete posts with confirmation
- View publication status (Published/Draft)
- Sort by title, author, or date
- See creation date for each post

**Table Columns:**
- Title (clickable to edit)
- Slug (auto-generated from title)
- Author name
- Status badge (Published/Draft)
- Creation date
- Action buttons (Edit/Delete)

---

### 4. **Blog Editor** (`admin/blog-edit.html`)
**URL:** `/admin/blog-edit.html` (create) or `/admin/blog-edit.html?id={postId}` (edit)

**Features:**
- Rich text editor (Quill.js) for content
- Real-time validation with error messages
- Character counter for excerpt (max 300 chars)
- Category dropdown (Logistics, News, Tips, Industry, Other)
- Featured image URL input
- Auto-slug generation from title
- Publish/Draft toggle
- Save or Update button
- Breadcrumb navigation

**Form Fields:**
- Title * (required, max 200 chars)
- Slug (auto-generated, can be customized)
- Author name
- Category selection
- Featured Image URL
- Excerpt/Summary * (required, max 300 chars)
- Content * (required, rich text editor)
- Publish Status checkbox

**Editor Toolbar:**
- Heading levels (1, 2, 3)
- Bold, Italic, Underline, Strikethrough
- Ordered/Unordered lists
- Blockquotes, Code blocks
- Text alignment
- Links and images
- Clean formatting

---

### 5. **Team Management** (`admin/team.html`)
**URL:** `/admin/team.html`

**Features:**
- Display all team members in sortable table
- Add new team member (button)
- Edit existing team members
- Delete team members with confirmation
- Search/filter team members
- Pagination (10 members per page)
- Sort by: Order, Name, or Title

**Table Columns:**
- Order (display priority)
- Name
- Title/Position
- Image path
- Actions (Edit/Delete buttons)

**Add/Edit Modal:**
- Full Name * (required, min 2 chars)
- Title/Position * (required, min 2 chars)
- Image Path (relative path to image)
- Display Order (numeric, for sorting)
- Bio/Description (max 500 chars, with character counter)
- Save/Update button
- Cancel button

**Search Features:**
- Real-time search with debouncing
- Search by name, title, or bio
- Pagination updates dynamically
- Results show instantly

---

### 6. **Inquiries Management** (`admin/inquiries.html`)
**URL:** `/admin/inquiries.html`

**Tabs:**
1. **Contact Inquiries**
   - Table with columns: Date, Name, Email, Service, Message preview
   - Search functionality by name/email
   - Pagination support
   - Real-time search with debouncing

2. **Quote Requests**
   - Shows: Date, Name, Email, From→To locations, Weight
   - Export to CSV button
   - Pagination (10 per page)
   - Professional formatting

3. **Newsletter Subscriptions**
   - Email and subscription date
   - Export to CSV button
   - Pagination support

4. **Tracking Inquiries**
   - Tracking number display
   - Date submitted
   - Simple list view

5. **Blog Comments**
   - Commenter name and date
   - Comment preview
   - Pagination support

**Search & Filter:**
- Contact tab: Search by name or email
- Real-time results with debouncing
- Page automatically resets on search

**Export:**
- Quote Requests → CSV download
- Newsletter Subscriptions → CSV download
- Downloads named: `quote-requests.csv`, `newsletter-subscriptions.csv`

---

### 7. **Analytics** (`admin/analytics.html`)
**URL:** `/admin/analytics.html`

**Statistics:**
- 📊 Total Submissions (all types combined)
- 📝 Total Blog Posts
- 👥 Total Team Members
- 📈 Average Daily Submissions (last 30 days)

**Date Range Filter:**
- "From" date picker
- "To" date picker
- Apply button to filter data
- Reset button to clear filters
- Dynamic chart updates

**Charts:**
1. **Submissions by Type (Doughnut Chart)**
   - Contact inquiries
   - Quote requests
   - Newsletter signups
   - Tracking inquiries
   - Blog comments
   - Color-coded by type
   - Legend at bottom

2. **Submission Trends (Line Chart)**
   - 30-day history
   - Daily submission count
   - Smooth line with point markers
   - Shows trends over time

**Recent Activity Feed:**
- Type icon and label
- Activity description
- Timestamp
- Shows last 20 activities
- Reverse chronological order

---

### 8. **Profile & Settings** (`admin/profile.html`)
**URL:** `/admin/profile.html`

**Account Information:**
- Admin avatar/icon
- Logged-in email address
- Account role display
- Account created date
- Last login timestamp
- Account status indicator

**Security Settings:**
- Change Password button
  - Modal form with current password
  - New password field (min 6 chars)
  - Confirm password field
  - Validates matching passwords
  - Re-authentication required

- Two-Factor Authentication status (Coming Soon)

**Preferences:**
- Email Notifications toggle
- Daily Digest toggle
- Theme selector (Light/Dark/Auto)
- Timezone selector (UTC, EST, CST, MST, PST)
- Save Preferences button
- Reset to Defaults button
- All preferences saved to localStorage

**Danger Zone:**
- Clear Cache button (clears all localStorage/sessionStorage)
- Sign Out All Sessions button (logs out from all devices)
- Warning icons and colors

---

## 🎨 Design System

### Colors
- **Primary Gold:** #a68f50
- **Dark Navy:** #1a2e4a
- **Success Green:** #16a34a
- **Danger Red:** #dc2626
- **Info Blue:** #3b82f6
- **Warning Orange:** #f59e0b
- **Light Gray:** #f0f2f5

### Typography
- Font Family: 'Segoe UI', system-ui, -apple-system, sans-serif
- Heading 1: 26px, bold
- Heading 2: 22px, bold
- Heading 3: 16px, semi-bold
- Body: 14px
- Small: 13px, 12px

### Components
- **Buttons:** 44px+ min height for mobile accessibility
- **Cards:** 12px border-radius, subtle shadows
- **Tables:** Clean borders, hover effects
- **Forms:** 1.5px borders, smooth focus transitions
- **Modals:** 12px border-radius, backdrop blur effect

### Responsive Breakpoints
- **Desktop:** 1024px and up
- **Tablet:** 768px - 1023px
  - Sidebar collapses to icons only (70px)
  - Flex layouts adapt
  - Touch-friendly spacing
- **Mobile:** Below 768px
  - Sidebar 60px wide
  - Single column layouts
  - Full-width buttons
  - 44px+ touch targets

---

## 🔐 Security Features

### Authentication
- Firebase Authentication (Email/Password)
- Secure token storage
- Auto-logout on session expire
- Re-authentication for sensitive operations

### Data Protection
- Input sanitization on all forms
- XSS prevention via HTML escaping
- CSRF tokens (Firebase handles)
- Secure password validation

### Form Validation
- Client-side validation on all forms
- Server-side validation (Firebase rules)
- Error messages in English
- Password minimum 6 characters

---

## 📱 Mobile Experience

### Touch Optimization
- All buttons/links: 44px+ minimum height
- 8px+ padding on interactive elements
- Proper spacing between clickable areas
- No hover-only functionality

### Responsive Adjustments
- Single column layouts on mobile
- Full-width forms
- Stacked table columns where needed
- Sidebar collapses to icon-only view
- Bottom toast notifications
- Modal width 95% on small screens

### Mobile Navigation
- Sidebar available on all screen sizes
- Navigation icons visible on collapse
- Quick access to main functions
- Breadcrumbs for context

---

## ⚡ Performance Features

### Optimization
- Debounced search (300ms delay)
- Loading skeletons for better UX
- Lazy rendering of tables
- Pagination to limit DOM nodes
- Efficient CSS with minimal reflows

### Caching
- Local storage for preferences
- Session storage for temporary data
- Firebase caching enabled
- Minimal network requests

---

## 🎯 Accessibility

### Standards Compliance
- ARIA labels on all inputs
- Semantic HTML structure
- Proper heading hierarchy
- Color contrast ratios (WCAG AA)
- Focus indicators on all interactive elements

### Keyboard Navigation
- Tab through all controls
- Enter to submit forms
- Escape to close modals
- Auto-focus on modal open

---

## 🚀 Getting Started

### Access the Admin Dashboard
1. Navigate to `/admin/index.html`
2. Enter admin email and password
3. Click "Sign In"
4. Redirected to dashboard on success

### Navigation
- Use sidebar to navigate between pages
- View Site button opens main website
- Sign Out button in footer
- Profile link for account settings

### Common Tasks

**Create a Blog Post:**
1. Go to Blog Posts → New Post button
2. Fill in title, excerpt, and content
3. Add featured image URL (optional)
4. Click Save Post
5. View in Blog Posts list

**Manage Team:**
1. Go to Team page
2. Click Add Member
3. Enter name, title, optional bio
4. Set display order
5. Save changes

**View Inquiries:**
1. Go to Inquiries page
2. Select tab (Contact, Quotes, etc.)
3. Use search to filter (Contact tab)
4. Click Export to download CSV

**Check Analytics:**
1. Go to Analytics page
2. View summary statistics
3. Check charts for trends
4. Use date range filter for specific period
5. View recent activity feed

---

## 📊 System Requirements

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

### Dependencies
- Firebase 10.8.0
- Font Awesome 6.5.1
- Quill.js 1.3.6 (for blog editor)
- Chart.js 4.4.1 (for analytics)

### Internet
- Active internet connection required
- Firebase project configured
- Admin credentials set up

---

## 📝 Notes

- All timestamps shown in user's local timezone
- Data auto-saves after form submission
- Session persists for 24 hours
- Profile preferences saved locally
- CSV exports include all available data

---

**Dashboard Version:** 1.0  
**Last Updated:** August 2026  
**Status:** Production Ready ✅
