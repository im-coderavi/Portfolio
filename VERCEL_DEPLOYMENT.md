# 🚀 Complete Vercel Deployment Guide
## Frontend + Backend Both on Vercel

---

## 📋 Prerequisites

- ✅ Vercel account (free tier works)
- ✅ MongoDB Atlas account (free tier)
- ✅ Gmail account for email service
- ✅ GitHub repository ready

---

## Part 1: Backend Deployment on Vercel (Serverless)

### Step 1: Prepare Backend for Vercel

Vercel uses **serverless functions**, so we need to restructure the backend.

**What I'll do:**
1. Create `api/` folder for serverless functions
2. Create `vercel.json` configuration
3. Update file upload to use Vercel Blob Storage or external service
4. Keep existing code structure

### Step 2: Deploy Backend

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com/dashboard
   - Click "Add New" → "Project"

2. **Import Repository**
   - Select `im-coderavi/Portfolio`
   - Click "Import"

3. **Configure Backend Project**
   - **Project Name**: `portfolio-backend`
   - **Framework Preset**: Other
   - **Root Directory**: `server`
   - **Build Command**: Leave empty (serverless)
   - **Output Directory**: Leave empty

4. **Environment Variables** (Add these):
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key_here
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_gmail_app_password
   RECIPIENT_EMAIL=your_email@gmail.com
   ADMIN_PASSWORD=your_admin_password
   NODE_ENV=production
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - You'll get URL: `https://portfolio-backend-xyz.vercel.app`

---

## Part 2: Frontend Deployment on Vercel

### Step 1: Fix Current Deployment Issue

The current issue is that Vercel is using an old commit. We'll force a new deployment.

### Step 2: Deploy Frontend

1. **Go to Vercel Dashboard**
   - Click "Add New" → "Project"

2. **Import Repository (Again)**
   - Select `im-coderavi/Portfolio`
   - Click "Import"

3. **Configure Frontend Project**
   - **Project Name**: `portfolio-frontend` (or your preferred name)
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install --legacy-peer-deps`

4. **Environment Variables**:
   ```
   VITE_API_URL=https://portfolio-backend-xyz.vercel.app
   ```
   (Use your backend URL from Part 1)

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - You'll get URL: `https://portfolio-xyz.vercel.app`

---

## Part 3: MongoDB Atlas Setup

### Step 1: Create Cluster

1. **Go to MongoDB Atlas**
   - Visit https://cloud.mongodb.com
   - Sign up/Login

2. **Create Free Cluster**
   - Click "Build a Database"
   - Select "Free" (M0)
   - Choose region (closest to you)
   - Cluster Name: `Portfolio`
   - Click "Create"

### Step 2: Create Database User

1. **Database Access**
   - Left sidebar → "Database Access"
   - Click "Add New Database User"
   - **Username**: `portfolio_admin`
   - **Password**: Generate strong password (save it!)
   - **Database User Privileges**: "Atlas admin"
   - Click "Add User"

### Step 3: Whitelist IP

1. **Network Access**
   - Left sidebar → "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

### Step 4: Get Connection String

1. **Connect to Cluster**
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - **Driver**: Node.js
   - **Version**: 4.1 or later
   - Copy connection string
   - Replace `<password>` with your database password
   - Example: `mongodb+srv://portfolio_admin:YOUR_PASSWORD@portfolio.xxxxx.mongodb.net/?retryWrites=true&w=majority`

2. **Update Backend Environment Variable**
   - Go to Vercel → Backend Project → Settings → Environment Variables
   - Update `MONGODB_URI` with your connection string
   - Redeploy backend

---

## Part 4: Gmail Setup for Email

### Step 1: Enable 2FA

1. Go to https://myaccount.google.com/security
2. Enable "2-Step Verification"

### Step 2: Create App Password

1. Go to https://myaccount.google.com/apppasswords
2. **App name**: "Portfolio Backend"
3. Click "Create"
4. Copy the 16-character password

### Step 3: Update Backend Environment

1. Vercel → Backend Project → Settings → Environment Variables
2. Update:
   - `EMAIL_USER`: your_email@gmail.com
   - `EMAIL_PASS`: 16-character app password
3. Redeploy backend

---

## Part 5: Update CORS & Final Configuration

### Step 1: Update Backend CORS

The backend needs to allow requests from your frontend URL.

**I'll update this in the code.**

### Step 2: Redeploy Both

1. Backend redeploy (after CORS update)
2. Frontend redeploy (with correct backend URL)

---

## Part 6: Testing

### Test Checklist:

1. **Frontend**:
   - ✅ Website loads
   - ✅ All sections visible
   - ✅ Animations working

2. **Backend API**:
   - ✅ Projects loading
   - ✅ Experiences loading
   - ✅ Contact form working

3. **Admin Panel**:
   - ✅ Login working
   - ✅ Add project working
   - ✅ Add experience working
   - ✅ Image upload working

---

## 🎯 Quick Summary

**Two Vercel Projects:**
1. **Backend**: `portfolio-backend` (serverless functions)
2. **Frontend**: `portfolio-frontend` (static site)

**External Services:**
1. **MongoDB Atlas**: Database (free tier)
2. **Gmail**: Email service (free)

**Total Cost**: ₹0 (All free tiers!)

---

## 🔧 Troubleshooting

### Issue: Build fails with peer dependency error
**Solution**: Add `.npmrc` with `legacy-peer-deps=true` in client folder

### Issue: API calls failing
**Solution**: Check CORS settings and VITE_API_URL environment variable

### Issue: Images not uploading
**Solution**: Vercel serverless has file size limits. Use Vercel Blob or Cloudinary

### Issue: MongoDB connection failed
**Solution**: Check connection string, whitelist IP (0.0.0.0/0), verify credentials

---

## 📝 Important Notes

1. **Serverless Limitations**:
   - File uploads limited to 4.5MB
   - Request timeout: 10 seconds (free tier)
   - Cold starts possible

2. **Free Tier Limits**:
   - Vercel: 100GB bandwidth/month
   - MongoDB Atlas: 512MB storage
   - Gmail: 500 emails/day

3. **Recommended Upgrades** (if needed):
   - Use Cloudinary for image uploads
   - Use Vercel Pro for better performance
   - Use MongoDB paid tier for more storage

---

**Ready to deploy? Let's start! 🚀**
