# 🚀 Vercel Deployment Guide

Complete step-by-step guide to deploy your portfolio on Vercel.

## 📋 Prerequisites

- ✅ GitHub account
- ✅ Vercel account (sign up at https://vercel.com)
- ✅ MongoDB Atlas account (for database)
- ✅ Gmail account (for email service)

---

## Part 1: Deploy Frontend on Vercel

### Step 1: Prepare Frontend for Deployment

1. **Update API URLs in Frontend**
   
   Open `client/src/components/admin/ExperienceManager.jsx` and update API URLs:
   ```javascript
   // Replace localhost URLs with your backend URL (we'll add this later)
   const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
   ```

2. **Create Environment Variable File**
   
   Create `client/.env.production`:
   ```env
   VITE_API_URL=https://your-backend-url.com
   ```

3. **Update all API calls to use environment variable**
   
   In all components that make API calls, use:
   ```javascript
   const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
   axios.get(`${API_URL}/api/projects`)
   ```

### Step 2: Push Changes to GitHub

```bash
cd d:\PORTFOLIO
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### Step 3: Deploy on Vercel

1. **Go to Vercel**
   - Visit https://vercel.com
   - Click "Sign Up" or "Login"
   - Choose "Continue with GitHub"

2. **Import Project**
   - Click "Add New Project"
   - Select "Import Git Repository"
   - Find and select `im-coderavi/Portfolio`
   - Click "Import"

3. **Configure Project**
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Add Environment Variables**
   - Click "Environment Variables"
   - Add: `VITE_API_URL` = `https://your-backend-url.com` (we'll update this later)

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete (2-3 minutes)
   - You'll get a URL like: `https://portfolio-xyz.vercel.app`

---

## Part 2: Deploy Backend

### Option A: Deploy Backend on Render (Recommended)

#### Step 1: Prepare Backend

1. **Create `server/package.json` start script**
   
   Make sure your `server/package.json` has:
   ```json
   {
     "scripts": {
       "start": "node index.js"
     }
   }
   ```

2. **Add PORT configuration**
   
   In `server/index.js`, make sure you have:
   ```javascript
   const PORT = process.env.PORT || 5000;
   ```

#### Step 2: Deploy on Render

1. **Go to Render**
   - Visit https://render.com
   - Sign up/Login with GitHub

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select `im-coderavi/Portfolio`

3. **Configure Service**
   - **Name**: `portfolio-backend`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

4. **Add Environment Variables**
   ```
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_secret_key_here
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_gmail_app_password
   RECIPIENT_EMAIL=your_email@gmail.com
   ADMIN_PASSWORD=your_admin_password
   PORT=10000
   NODE_ENV=production
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (3-5 minutes)
   - You'll get a URL like: `https://portfolio-backend-xyz.onrender.com`

#### Step 3: Update Frontend Environment Variable

1. Go back to Vercel dashboard
2. Go to your project → Settings → Environment Variables
3. Update `VITE_API_URL` to your Render backend URL
4. Redeploy frontend

---

### Option B: Deploy Backend on Railway

#### Step 1: Deploy on Railway

1. **Go to Railway**
   - Visit https://railway.app
   - Sign up/Login with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose `im-coderavi/Portfolio`

3. **Configure Service**
   - Railway will auto-detect Node.js
   - Set **Root Directory**: `server`
   - Click "Add Variables" and add all environment variables

4. **Environment Variables**
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   RECIPIENT_EMAIL=your_email@gmail.com
   ADMIN_PASSWORD=your_password
   PORT=5000
   ```

5. **Deploy**
   - Railway will automatically deploy
   - You'll get a URL like: `https://portfolio-backend.up.railway.app`

---

## Part 3: Setup MongoDB Atlas

### Step 1: Create MongoDB Cluster

1. **Go to MongoDB Atlas**
   - Visit https://www.mongodb.com/cloud/atlas
   - Sign up/Login

2. **Create Cluster**
   - Click "Build a Database"
   - Choose "Free" tier (M0)
   - Select region closest to you
   - Click "Create Cluster"

3. **Create Database User**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Username: `portfolio_user`
   - Password: Generate strong password
   - User Privileges: "Read and write to any database"
   - Click "Add User"

4. **Whitelist IP Address**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<password>` with your database user password
   - Example: `mongodb+srv://portfolio_user:PASSWORD@cluster0.xxxxx.mongodb.net/portfolio?retryWrites=true&w=majority`

### Step 2: Update Backend Environment Variables

Add the MongoDB connection string to your backend deployment (Render/Railway).

---

## Part 4: Setup Gmail for Email Service

### Step 1: Enable 2-Factor Authentication

1. Go to Google Account Settings
2. Security → 2-Step Verification
3. Enable it

### Step 2: Generate App Password

1. Go to Google Account → Security
2. Click "App passwords"
3. Select "Mail" and "Other (Custom name)"
4. Name it "Portfolio Backend"
5. Click "Generate"
6. Copy the 16-character password

### Step 3: Update Backend Environment Variables

Add to your backend deployment:
- `EMAIL_USER`: your_email@gmail.com
- `EMAIL_PASS`: the 16-character app password

---

## Part 5: Final Configuration

### Step 1: Update CORS in Backend

In `server/index.js`, update CORS configuration:

```javascript
const corsOptions = {
    origin: [
        'http://localhost:5173',
        'https://your-vercel-app.vercel.app', // Add your Vercel URL
    ],
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
```

### Step 2: Update Frontend API URL

In Vercel:
1. Go to Settings → Environment Variables
2. Update `VITE_API_URL` with your backend URL
3. Redeploy

### Step 3: Test Everything

1. **Visit your Vercel URL**
2. **Test Contact Form**
3. **Login to Admin Panel**: `your-url.vercel.app/admin/login`
4. **Add a Project**
5. **Add an Experience**
6. **Verify everything works**

---

## 🎉 Deployment Complete!

Your portfolio is now live at:
- **Frontend**: https://your-app.vercel.app
- **Backend**: https://your-backend.onrender.com (or Railway)

---

## 🔧 Troubleshooting

### Issue: API calls failing

**Solution**: Check CORS configuration and make sure frontend has correct backend URL

### Issue: Images not loading

**Solution**: Make sure image URLs are absolute paths or properly configured

### Issue: Email not sending

**Solution**: Verify Gmail app password and EMAIL_USER/EMAIL_PASS environment variables

### Issue: MongoDB connection failed

**Solution**: Check connection string, whitelist IP (0.0.0.0/0), and verify user credentials

---

## 📝 Post-Deployment Checklist

- [ ] Frontend deployed on Vercel
- [ ] Backend deployed on Render/Railway
- [ ] MongoDB Atlas configured
- [ ] Gmail app password set up
- [ ] Environment variables added
- [ ] CORS configured
- [ ] Contact form tested
- [ ] Admin panel working
- [ ] Projects CRUD working
- [ ] Experience CRUD working
- [ ] Custom domain added (optional)

---

## 🌐 Custom Domain (Optional)

### Add Custom Domain to Vercel

1. Go to Vercel Dashboard → Your Project
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions
5. Wait for DNS propagation (up to 48 hours)

---

**Need Help?** Check the official documentation:
- [Vercel Docs](https://vercel.com/docs)
- [Render Docs](https://render.com/docs)
- [Railway Docs](https://docs.railway.app)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com)
