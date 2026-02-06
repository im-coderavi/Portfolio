# 🚀 Portfolio Website - Avishek Giri

<div align="center">

[![React](https://img.shields.io/badge/React-18.2.0-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green?style=for-the-badge&logo=nodedotjs)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-black?style=for-the-badge&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-blue?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?style=for-the-badge&logo=vercel)](https://vercel.com/)

**A modern, responsive MERN stack portfolio featuring a dynamic admin panel, cloud-based image management, and AI integration capabilities.**

[View Live Demo](https://coderavi.in) · [Report Bug](https://github.com/im-coderavi/Portfolio/issues) · [Request Feature](https://github.com/im-coderavi/Portfolio/issues)

</div>

---

## ✨ Features

### 🎨 Frontend Experience
- **Glassmorphism Design**: Stunning visual effects with smooth gradients and heavy blur.
- **Fully Responsive**: Verified on all devices from 320px mobile to 4k monitors.
- **Framer Motion Animations**: Fluid page transitions, scroll interactions, and gesture support.
- **Interactive Sections**:
  - **Dynamic Hero**: Animated text and impressive first impression.
  - **Experience Timeline**: Visual representation of professional journey.
  - **Projects Gallery**: Filterable grid with cloud-hosted images.
  - **Live Contact Form**: Real-time email delivery with spam protection.

### 🔐 Powerful Admin Panel
- **Secure Authentication**: JWT-based secure login system covering all admin routes.
- **Content Management**: 
  - **Projects**: Create, edit, delete projects with Cloudinary image upload.
  - **Experiences**: Manage work history with real-time updates.
- **Toggle Notifications**: Enable/disable email alerts for new visitors directly from the dashboard.
- **Analytics**: Track visitor stats (optional integration).

### 🛠️ Backend Architecture
- **Serverless Ready**: Optimized for Vercel Serverless Functions.
- **Cloud Storage**: **Cloudinary** integration for persistent, high-performance image hosting.
- **Database**: MongoDB Atlas for scalable data storage.
- **Security**: CORS protection, Helmet headers, and input sanitization.

---

## 🛠️ Tech Stack

| Domain | Technologies |
|:--- |:--- |
| **Frontend** | React, Vite, Tailwind CSS, Framer Motion, Axios, Lucide Icons |
| **Backend** | Node.js, Express.js, JWT, Nodemailer |
| **Database** | MongoDB Atlas (Mongoose ODM) |
| **Storage** | Cloudinary (Image CDN) |
| **Deployment** | Vercel (Frontend & Backend) |

---

## ⚡ Getting Started

Follow these steps to set up the project locally.

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas Account
- Cloudinary Account (Free Tier)
- Gmail Account (for email notifications)

### 1. Clone the Repository
```bash
git clone https://github.com/im-coderavi/Portfolio.git
cd Portfolio
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:
```env
# Server Config
PORT=5000
MONGODB_URI=your_mongodb_connection_string

# Security
JWT_SECRET=your_super_secret_key
ADMIN_PASSWORD=SelectStrongPassword@123

# Email Service (Gmail App Password)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
RECIPIENT_EMAIL=your_email@gmail.com

# Cloudinary (Image Storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Start the server:
```bash
npm start
```

### 3. Frontend Setup
```bash
cd client
npm install
```

Start the development server:
```bash
npm run dev
```
Open `http://localhost:5173` to view the site.

---

## 📁 Project Structure

```bash
PORTFOLIO/
├── client/              # Frontend (Vite + React)
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── config/      # API configuration
│   │   ├── pages/       # Route pages (Home, Admin, Login)
│   │   └── ...
│   └── ...
├── server/              # Backend (Express)
│   ├── models/          # Mongoose Schemas (Project, Experience)
│   ├── index.js         # Entry point
│   └── ...
└── README.md            # Documentation
```

---

## 🚀 Deployment Guide (Vercel)

This project is optimized for deployment on Vercel.

### Backend Deployment
1. Push your code to GitHub.
2. Import the `server` directory as a new project in Vercel.
3. Select **Express** as the framework preset (or None).
4. Add all **Environment Variables** from your `.env` file to Vercel Settings.
5. Deploy!

### Frontend Deployment
1. Import the `client` directory as a new project in Vercel.
2. Vercel will auto-detect Vite.
3. Deploy!
4. **Note**: The frontend connects to the deployed backend automatically via `config/api.js`.

---

## 🔐 API Documentation

| Method | Endpoint | Description | Auth |
|:--- |:--- |:--- |:--- |
| `GET` | `/api/projects` | Fetch all projects | Public |
| `GET` | `/api/experiences` | Fetch all experiences | Public |
| `POST` | `/api/contact` | Send message | Public |
| `POST` | `/api/admin/login` | Admin login | Public |
| `POST` | `/api/admin/projects` | Create project | **Admin** |
| `PUT` | `/api/admin/projects/:id` | Update project | **Admin** |
| `DELETE` | `/api/admin/projects/:id` | Delete project | **Admin** |

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">

**Made with ❤️ by [Avishek Giri](https://avishekgiri.dev)**

</div>
