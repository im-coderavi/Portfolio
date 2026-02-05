# 🚀 Portfolio Website - Avishek Giri

A modern, responsive full-stack portfolio website built with the MERN stack, featuring an admin panel for content management, AI integration capabilities, and stunning UI/UX design.

![Portfolio Preview](./screenshots/hero-section.png)

## ✨ Features

### 🎨 Frontend
- **Modern UI/UX** - Glassmorphism design with gradient effects
- **Fully Responsive** - Optimized for all devices (mobile, tablet, desktop)
- **Smooth Animations** - Framer Motion for fluid transitions
- **Dark Theme** - Eye-friendly dark color scheme
- **Interactive Sections**:
  - Hero with animated introduction
  - About Me with animated stats
  - Skills showcase with technology cards
  - Professional Experience timeline
  - Projects gallery with filtering
  - Education timeline
  - FAQ accordion
  - Contact form with email integration

### 🛠️ Backend
- **RESTful API** - Express.js server with organized routes
- **MongoDB Database** - Mongoose ODM for data modeling
- **JWT Authentication** - Secure admin panel access
- **Email Integration** - Nodemailer for contact form
- **File Upload** - Multer for project images
- **Visitor Tracking** - Analytics for portfolio visits

### 🔐 Admin Panel
- **Secure Login** - JWT-based authentication
- **Project Management** - Full CRUD operations for projects
- **Experience Management** - Add, edit, delete work experiences
- **Settings Control** - Toggle email notifications
- **Responsive Dashboard** - Mobile-friendly admin interface


## 🛠️ Tech Stack

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Axios** - HTTP client
- **React Router** - Client-side routing
- **React Scroll** - Smooth scrolling
- **Lucide React** - Icon library

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Nodemailer** - Email service
- **Multer** - File upload middleware
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables

## 📁 Project Structure

```
PORTFOLIO/
├── client/                 # Frontend React application
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── admin/     # Admin panel components
│   │   │   ├── animations/# Animation components
│   │   │   ├── common/    # Shared components
│   │   │   └── sections/  # Page sections
│   │   ├── pages/         # Page components
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── server/                # Backend Node.js application
│   ├── models/           # Mongoose models
│   │   ├── Project.js
│   │   ├── Experience.js
│   │   └── Settings.js
│   ├── uploads/          # Uploaded files
│   ├── index.js          # Server entry point
│   ├── package.json
│   └── .env              # Environment variables
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/im-coderavi/Portfolio.git
   cd Portfolio
   ```

2. **Setup Backend**
   ```bash
   cd server
   npm install
   ```

3. **Configure Environment Variables**
   
   Create a `.env` file in the `server` directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_app_password
   RECIPIENT_EMAIL=recipient@email.com
   ADMIN_PASSWORD=your_admin_password
   PORT=5000
   ```

4. **Setup Frontend**
   ```bash
   cd ../client
   npm install
   ```

### Running the Application

1. **Start Backend Server**
   ```bash
   cd server
   npm start
   ```
   Server will run on `http://localhost:5000`

2. **Start Frontend Development Server**
   ```bash
   cd client
   npm run dev
   ```
   Application will run on `http://localhost:5173`

3. **Access Admin Panel**
   - Navigate to `http://localhost:5173/admin/login`
   - Use the admin password from your `.env` file

## 📝 API Endpoints

### Public Routes
- `GET /api/projects` - Get all projects
- `GET /api/experiences` - Get all experiences
- `POST /api/contact` - Send contact message
- `POST /api/visitor` - Track visitor

### Protected Routes (Admin)
- `POST /api/admin/login` - Admin login
- `POST /api/admin/projects` - Create project
- `PUT /api/admin/projects/:id` - Update project
- `DELETE /api/admin/projects/:id` - Delete project
- `POST /api/admin/experiences` - Create experience
- `PUT /api/admin/experiences/:id` - Update experience
- `DELETE /api/admin/experiences/:id` - Delete experience
- `GET /api/admin/settings` - Get settings
- `PUT /api/admin/settings` - Update settings

## 🎨 Features Breakdown

### Experience Section
- Professional timeline layout
- Bullet point support in descriptions
- Current position highlighting
- Technology tags
- Responsive design with proper text wrapping
- Left-aligned content for better readability

### Projects Section
- Image upload functionality
- Technology filtering
- Featured projects
- Live demo and GitHub links
- Responsive grid layout

### Contact Form
- Email validation
- Nodemailer integration
- Success/error notifications
- Spam protection

### Admin Dashboard
- Tab-based navigation
- Real-time updates
- Image preview
- Form validation
- Confirmation dialogs

## 🔒 Security Features

- JWT-based authentication
- Password hashing
- Protected API routes
- CORS configuration
- Input validation
- XSS protection

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: `sm`, `md`, `lg`, `xl`
- Touch-friendly UI elements
- Optimized images
- Flexible layouts

## 🎯 Performance Optimizations

- Code splitting
- Lazy loading
- Image optimization
- Minified production builds
- Efficient re-renders
- Debounced API calls

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy the `dist` folder
3. Set environment variables

### Backend (Heroku/Railway)
1. Push to Git repository
2. Connect to hosting platform
3. Set environment variables
4. Deploy

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Avishek Giri**
- Portfolio: [avishekgiri.dev](https://avishekgiri.dev)
- LinkedIn: [@avishekgiri](https://linkedin.com/in/avishekgiri)
- GitHub: [@avishekgiri](https://github.com/avishekgiri)
- Email: avishekgiri31@gmail.com

## 🙏 Acknowledgments

- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Lucide Icons](https://lucide.dev/) - Beautiful icons
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - Database hosting

## 📊 Project Stats

- **Total Lines of Code**: ~5000+
- **Components**: 20+
- **API Endpoints**: 15+
- **Technologies Used**: 15+

---

<div align="center">
  Made with ❤️ by Avishek Giri
  
  ⭐ Star this repo if you found it helpful!
</div>

