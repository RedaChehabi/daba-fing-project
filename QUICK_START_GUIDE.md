# DabaFing Quick Start Guide

Get up and running with DabaFing locally in just a few minutes! This guide covers the essentials to start analyzing fingerprints right away.

## 🚀 Quick Setup (10 minutes)

### Step 1: Set Up the Backend
1. **Clone the repository** (if not already done)
2. **Navigate to backend directory**:
   ```bash
   cd backend
   ```
3. **Create virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
4. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```
5. **Run migrations**:
   ```bash
   python manage.py migrate
   ```
6. **Create admin user**:
   ```bash
   python create_admin.py
   ```
7. **Start the backend server**:
   ```bash
   python manage.py runserver 0.0.0.0:8000
   ```

### Step 2: Choose Your Frontend
Pick one of the available frontend options:

#### Option A: Desktop App (Recommended for development)
```bash
cd frontend-desktop
npm install
npm run dev
```
Open your browser to `http://localhost:3000`

#### Option B: Mobile App
```bash
cd frontend-mobile
npm install
npm start
```
Use Expo Go app to scan the QR code

### Step 3: Create Your Account
1. Open the application (desktop or mobile)
2. Click **"Register"** to create a new account
3. Enter your email and create a strong password
4. Complete your profile

### Step 4: Upload Your First Fingerprint
1. Click **"Upload Fingerprint"** on the dashboard
2. Drag & drop your image or click to browse
3. Fill in the required information:
   - **Title**: Give it a descriptive name
   - **Hand**: Left or Right
   - **Finger**: Select the specific finger
4. Click **"Upload Fingerprint"**

### Step 5: Analyze Your Fingerprint
1. After upload confirmation, click **"Analyze Fingerprint"**
2. Wait 10-30 seconds for AI processing
3. Review your results!

## 📸 Image Requirements

### ✅ What Works Best
- **Format**: JPEG or PNG
- **Size**: Under 10MB
- **Resolution**: 500 DPI or higher
- **Quality**: Clear, sharp, well-lit
- **Content**: Complete fingerprint, centered

### ❌ What to Avoid
- Blurry or out-of-focus images
- Partial fingerprints
- Poor lighting or shadows
- Wet or dirty fingers
- Heavy compression artifacts

## 📊 Understanding Your Results

### Pattern Types
- **Loop**: Most common (60-65% of people)
- **Whorl**: Circular patterns (30-35% of people)
- **Arch**: Wave-like patterns (5% of people)

### Confidence Score
- **90-100%**: Excellent - highly reliable
- **80-89%**: Good - reliable for most uses
- **70-79%**: Fair - consider retaking image
- **Below 70%**: Poor - retake with better quality

### Quality Indicators
- **High Quality**: Clear patterns, good contrast
- **Medium Quality**: Acceptable but could be improved
- **Low Quality**: Difficult to analyze, retake recommended

## 🔧 Quick Troubleshooting

### Upload Issues
**Problem**: File won't upload
- ✅ Check file size (must be under 10MB)
- ✅ Verify format (JPEG, PNG, BMP, TIFF, WebP)
- ✅ Try refreshing the page

**Problem**: Low confidence score
- ✅ Retake with better lighting
- ✅ Ensure finger is clean and dry
- ✅ Use higher resolution image
- ✅ Make sure fingerprint is complete

### Analysis Issues
**Problem**: Analysis is slow
- ✅ Wait up to 2 minutes (normal for complex patterns)
- ✅ Check your internet connection
- ✅ Try during off-peak hours

**Problem**: Unexpected results
- ✅ Review image quality
- ✅ Check for scars or distortions
- ✅ Try uploading a different image of the same finger

## 💡 Pro Tips

### For Best Results
1. **Clean Everything**: Wipe finger and scanner/camera lens
2. **Good Lighting**: Use bright, even lighting without shadows
3. **Steady Hands**: Keep finger still during capture
4. **Multiple Shots**: Take several images and choose the best
5. **Center the Print**: Make sure the fingerprint fills the frame

### Navigation Tips
- Use **tooltips** (hover over ? icons) for quick help
- Access **Help Center** from any page for detailed guides
- Try the **Quick Help** tab for common solutions
- Use **search** in Help Center to find specific topics

### Security Best Practices
- Enable **two-factor authentication** in account settings
- Use a **strong, unique password**
- **Log out** when finished, especially on shared computers
- Review **privacy settings** to control data sharing

## 🆘 Need Help?

### In-App Help
- **Tooltips**: Hover over ? icons for quick explanations
- **Help Button**: Click for comprehensive help system
- **Tutorials**: Interactive guides for all features

### Documentation
- **User Guide**: Complete documentation (see [USER_GUIDE.md](./USER_GUIDE.md))
- **Project Report**: Technical details (see [FINAL_PROJECT_REPORT.md](./FINAL_PROJECT_REPORT.md))
- **Contributing Guide**: Development guidelines (see [CONTRIBUTING.md](./CONTRIBUTING.md))

### Local Development Support
- **Check logs**: Backend logs show in terminal where you ran `python manage.py runserver`
- **API testing**: Use `http://localhost:8000/admin` for Django admin interface
- **Database**: Use `python manage.py shell` for database inspection

### Troubleshooting
- **Mobile App Issues**: See [MOBILE_APP_TROUBLESHOOTING.md](./MOBILE_APP_TROUBLESHOOTING.md)
- **Backend Issues**: Check Django server logs for errors
- **Frontend Issues**: Check browser console for JavaScript errors

## 🎯 What's Next?

### Explore Features
- **Dashboard Analytics**: View your upload history and statistics
- **Export Options**: Download results in PDF or JSON format
- **User Management**: Access Django admin for user administration
- **API Testing**: Use Django REST Framework browsable API

### Development
- **Read the documentation**: Comprehensive guides available
- **Explore the codebase**: Well-structured project organization
- **Run tests**: Each component has test suites
- **Contribute**: See contributing guidelines

---

## 📋 Quick Reference

### Keyboard Shortcuts
- `Ctrl/Cmd + U`: Quick upload
- `Ctrl/Cmd + H`: Open help
- `Ctrl/Cmd + D`: Go to dashboard
- `Esc`: Close modals/dialogs

### File Formats Supported
- JPEG (.jpg, .jpeg)
- PNG (.png)
- BMP (.bmp)
- TIFF (.tiff, .tif)
- WebP (.webp)

### System Requirements
- **Browser**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Internet**: Stable connection required
- **JavaScript**: Must be enabled
- **Cookies**: Required for authentication

### Local URLs
- **Backend API**: `http://localhost:8000/api/`
- **Django Admin**: `http://localhost:8000/admin/`
- **Desktop App**: `http://localhost:3000`
- **API Documentation**: `http://localhost:8000/api/` (browsable)

### Default Credentials
- **Admin User**: Created via `python create_admin.py`
- **Test Users**: Created via `python create_test_users.py`

### Useful Commands
```bash
# Backend
cd backend
python manage.py runserver 0.0.0.0:8000

# Desktop App  
cd frontend-desktop
npm run dev

# Mobile App
cd frontend-mobile
npm start
```

---

**Ready to get started?** Follow the setup steps above and start analyzing fingerprints locally!

*Need the full documentation? See [USER_GUIDE.md](./USER_GUIDE.md) for comprehensive instructions.* 