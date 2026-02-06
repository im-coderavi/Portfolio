const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();

// Import Models
const Project = require('./models/Project');
const Settings = require('./models/Settings');
const Experience = require('./models/Experience');

const app = express();
const PORT = process.env.PORT || 5000;

// Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Initialize Default Settings
const initializeSettings = async () => {
    try {
        const settings = await Settings.findOne();
        if (!settings) {
            await new Settings({ notificationsEnabled: true }).save();
            console.log('✅ Default settings initialized');
        }
    } catch (error) {
        console.error('❌ Error initializing settings:', error);
    }
};

// Cloudinary Storage Configuration
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'portfolio-projects',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
        transformation: [{ width: 1200, height: 675, crop: 'limit' }]
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Middleware
// Simplified CORS configuration to support Vercel rewrites
// Vercel rewrites don't preserve the original Origin header properly,
// so we need to allow all origins for the API to work correctly
const corsOptions = {
    origin: '*',  // Allow all origins (necessary for Vercel rewrites)
    credentials: false,  // Disable credentials (JWT is sent in Authorization header)
    optionsSuccessStatus: 200
};

// Add explicit CORS headers to all responses
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB Connection with caching for serverless
let cachedDb = null;

async function connectToDatabase() {
    if (cachedDb && mongoose.connection.readyState === 1) {
        return cachedDb;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 30000, // 30 seconds for serverless cold start
            socketTimeoutMS: 45000,
            bufferCommands: false, // Disable buffering
        });

        // Set buffer timeout to prevent hanging operations
        mongoose.set('bufferTimeoutMS', 30000);
        console.log('✅ Connected to MongoDB Atlas');
        cachedDb = mongoose.connection;
        // Note: Settings will be initialized on first admin access
        return cachedDb;
    } catch (err) {
        console.error('❌ MongoDB connection error:', err);
        throw err;
    }
}

// Initialize connection
connectToDatabase().catch(console.error);

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = decoded;
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: 'Invalid or expired token.' });
    }
};

// Middleware to ensure MongoDB connection before API routes
const ensureDbConnection = async (req, res, next) => {
    try {
        await connectToDatabase();
        next();
    } catch (error) {
        console.error('Database connection failed:', error);
        res.status(503).json({ success: false, message: 'Database connection unavailable' });
    }
};

// Apply database connection middleware to all API routes
app.use('/api', ensureDbConnection);

// ==================== EMAIL SERVICES ====================

// Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Verify transporter configuration
transporter.verify((error, success) => {
    if (error) {
        console.error('❌ Email configuration error:', error);
    } else {
        console.log('✅ Email server is ready to send messages');
    }
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required'
        });
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.RECIPIENT_EMAIL,
        subject: `🚀 New Portfolio Contact: ${subject}`,
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f7fa; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); }
          .header { background: linear-gradient(135deg, #00F5FF 0%, #0066FF 100%); padding: 40px 30px; text-align: center; }
          .header h1 { margin: 0; color: #ffffff; font-size: 28px; }
          .content { padding: 40px 30px; }
          .info-row { display: flex; margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-radius: 10px; border-left: 4px solid #00F5FF; }
          .info-label { font-weight: 600; color: #333; min-width: 80px; }
          .info-value { color: #555; flex: 1; }
          .message-box { background: #f8f9fa; padding: 25px; border-radius: 12px; margin: 25px 0; border: 1px solid #dee2e6; }
          .footer { background: #f8f9fa; padding: 25px 30px; text-align: center; color: #6c757d; font-size: 13px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📧 New Contact Message</h1>
            <p>Someone reached out through your portfolio website</p>
          </div>
          <div class="content">
            <div class="info-row">
              <div class="info-label">👤 Name:</div>
              <div class="info-value"><strong>${name}</strong></div>
            </div>
            <div class="info-row">
              <div class="info-label">📧 Email:</div>
              <div class="info-value"><a href="mailto:${email}">${email}</a></div>
            </div>
            <div class="info-row">
              <div class="info-label">📝 Subject:</div>
              <div class="info-value"><strong>${subject}</strong></div>
            </div>
            <div class="message-box">
              <div style="font-weight: 700; margin-bottom: 10px;">💬 Message:</div>
              <div style="white-space: pre-wrap;">${message}</div>
            </div>
          </div>
          <div class="footer">
            <p>Sent from your portfolio website</p>
            <p>${new Date().toLocaleString()}</p>
          </div>
        </div>
      </body>
      </html>
    `,
        replyTo: email
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent successfully from ${email}`);
        res.status(200).json({ success: true, message: 'Message sent successfully!' });
    } catch (error) {
        console.error('❌ Error sending email:', error);
        res.status(500).json({ success: false, message: 'Failed to send message.' });
    }
});

// Visitor tracking endpoint
app.post('/api/visitor', async (req, res) => {
    const { timestamp, userAgent, referrer, language } = req.body;

    try {
        // Check if notifications are enabled
        const settings = await Settings.findOne();
        if (settings && !settings.notificationsEnabled) {
            return res.status(200).json({ success: true, message: 'Visitor tracked (notifications disabled)' });
        }

        const visitorMailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.RECIPIENT_EMAIL,
            subject: `👀 New Visitor on Your Portfolio Website`,
            html: `
          <!DOCTYPE html>
          <html>
          <body style="font-family: sans-serif; background-color: #f5f7fa; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; padding: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <h2 style="color: #7C3AED; text-align: center;">👀 New Website Visitor</h2>
                <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; margin-top: 20px;">
                    <p><strong>🕒 Time:</strong> ${new Date(timestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'full', timeStyle: 'medium' })}</p>
                    <p><strong>💻 Browser:</strong> ${userAgent || 'Unknown'}</p>
                    <p><strong>🔗 Referrer:</strong> ${referrer || 'Direct visit'}</p>
                    <p><strong>🌐 Language:</strong> ${language || 'Unknown'}</p>
                    <p style="font-size: 12px; color: #888; margin-top: 10px;">To disable these emails, visit your Admin Panel.</p>
                </div>
            </div>
          </body>
          </html>
        `
        };

        await transporter.sendMail(visitorMailOptions);
        console.log(`✅ Visitor notification sent at ${new Date(timestamp).toLocaleString()}`);
        res.status(200).json({ success: true, message: 'Visitor tracked successfully' });
    } catch (error) {
        console.error('❌ Error processing visitor:', error);
        res.status(200).json({ success: false, message: 'Visitor tracked (email failed)' });
    }
});

// ==================== ADMIN ENDPOINTS ====================

// Admin login endpoint
app.post('/api/admin/login', async (req, res) => {
    const { password } = req.body;

    if (!password) {
        return res.status(400).json({ success: false, message: 'Password is required' });
    }

    // Compare password
    if (password !== process.env.ADMIN_PASSWORD) {
        return res.status(401).json({ success: false, message: 'Invalid password' });
    }

    // Generate JWT token
    const token = jwt.sign(
        { admin: true, timestamp: Date.now() },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );

    res.status(200).json({
        success: true,
        message: 'Login successful',
        token
    });
});

// Get Settings (Protected)
app.get('/api/admin/settings', verifyToken, async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = await new Settings({ notificationsEnabled: true }).save();
        }
        res.status(200).json({ success: true, settings });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch settings' });
    }
});

// Update Settings (Protected)
app.post('/api/admin/settings', verifyToken, async (req, res) => {
    try {
        const { notificationsEnabled } = req.body;

        const settings = await Settings.findOneAndUpdate(
            {},
            { notificationsEnabled, updatedAt: Date.now() },
            { new: true, upsert: true }
        );

        res.status(200).json({ success: true, message: 'Settings updated', settings });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update settings' });
    }
});

// Get all projects (public)
app.get('/api/projects', async (req, res) => {
    try {
        await connectToDatabase(); // Ensure connection
        const projects = await Project.find().sort({ order: 1, createdAt: -1 });
        res.status(200).json({
            success: true,
            projects
        });
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch projects' });
    }
});

// Add new project (protected)
app.post('/api/admin/projects', verifyToken, upload.single('image'), async (req, res) => {
    try {
        const { title, description, technologies, liveUrl, githubUrl, featured } = req.body;

        let image = req.body.image;
        if (req.file) {
            image = req.file.path; // Cloudinary URL
        }

        if (!title || !description || ((!image || image === 'undefined') && !req.file)) {
            // Only require image if no file and no image string provided
            return res.status(400).json({ success: false, message: 'Title, description, and image are required' });
        }

        // If image is still empty but we are editing, we usually don't need it. But this is ADD.
        // If upload is optional, we handle it. But requirement is to have it.

        const projectCount = await Project.countDocuments();

        const newProject = new Project({
            title,
            description,
            image: image || '',
            technologies: technologies ? (Array.isArray(technologies) ? technologies : technologies.split(',').map(t => t.trim())) : [],
            liveUrl: liveUrl || '',
            githubUrl: githubUrl || '',
            featured: featured === 'true' || featured === true || false,
            order: projectCount
        });

        await newProject.save();

        res.status(201).json({
            success: true,
            message: 'Project added successfully',
            project: newProject
        });
    } catch (error) {
        console.error('Error adding project:', error);
        res.status(500).json({ success: false, message: 'Failed to add project' });
    }
});

// Update project (protected)
app.put('/api/admin/projects/:id', verifyToken, upload.single('image'), async (req, res) => {
    try {
        const { id } = req.params;
        const updates = { ...req.body };

        if (req.file) {
            updates.image = req.file.path; // Cloudinary URL
        }

        // If technologies comes as string from form-data, parse it
        if (updates.technologies && typeof updates.technologies === 'string') {
            updates.technologies = updates.technologies.split(',').map(t => t.trim()).filter(Boolean);
        }

        if (updates.featured !== undefined) {
            updates.featured = updates.featured === 'true' || updates.featured === true;
        }

        const project = await Project.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Project updated successfully',
            project
        });
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ success: false, message: 'Failed to update project' });
    }
});

// Delete project (protected)
app.delete('/api/admin/projects/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;

        const project = await Project.findByIdAndDelete(id);

        // Delete image from Cloudinary if it's a Cloudinary URL
        if (project && project.image && project.image.includes('cloudinary.com')) {
            try {
                // Extract public_id from Cloudinary URL
                const urlParts = project.image.split('/');
                const filename = urlParts[urlParts.length - 1];
                const publicId = `portfolio-projects/${filename.split('.')[0]}`;
                await cloudinary.uploader.destroy(publicId);
                console.log('✅ Deleted image from Cloudinary:', publicId);
            } catch (error) {
                console.error('❌ Failed to delete image from Cloudinary:', error);
            }
        }

        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Project deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ success: false, message: 'Failed to delete project' });
    }
});

// ==================== EXPERIENCE ENDPOINTS ====================

// Get all experiences (public)
app.get('/api/experiences', async (req, res) => {
    try {
        await connectToDatabase(); // Ensure connection
        const experiences = await Experience.find().sort({ order: 1, startDate: -1 });
        res.status(200).json({
            success: true,
            experiences
        });
    } catch (error) {
        console.error('Error fetching experiences:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch experiences' });
    }
});

// Add new experience (protected)
app.post('/api/admin/experiences', verifyToken, async (req, res) => {
    try {
        const { company, position, startDate, endDate, current, description, location, technologies } = req.body;

        if (!company || !position || !startDate) {
            return res.status(400).json({ success: false, message: 'Company, position, and start date are required' });
        }

        const experienceCount = await Experience.countDocuments();

        const newExperience = new Experience({
            company,
            position,
            startDate,
            endDate: current ? null : endDate,
            current: current || false,
            description: description || '',
            location: location || '',
            technologies: technologies ? (Array.isArray(technologies) ? technologies : technologies.split(',').map(t => t.trim())) : [],
            order: experienceCount
        });

        await newExperience.save();

        res.status(201).json({
            success: true,
            message: 'Experience added successfully',
            experience: newExperience
        });
    } catch (error) {
        console.error('Error adding experience:', error);
        res.status(500).json({ success: false, message: 'Failed to add experience' });
    }
});

// Update experience (protected)
app.put('/api/admin/experiences/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const updates = { ...req.body };

        // If technologies comes as string, parse it
        if (updates.technologies && typeof updates.technologies === 'string') {
            updates.technologies = updates.technologies.split(',').map(t => t.trim()).filter(Boolean);
        }

        // If current is true, set endDate to null
        if (updates.current === true || updates.current === 'true') {
            updates.endDate = null;
            updates.current = true;
        } else if (updates.current === false || updates.current === 'false') {
            updates.current = false;
        }

        const experience = await Experience.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!experience) {
            return res.status(404).json({ success: false, message: 'Experience not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Experience updated successfully',
            experience
        });
    } catch (error) {
        console.error('Error updating experience:', error);
        res.status(500).json({ success: false, message: 'Failed to update experience' });
    }
});

// Delete experience (protected)
app.delete('/api/admin/experiences/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;

        const experience = await Experience.findByIdAndDelete(id);

        if (!experience) {
            return res.status(404).json({ success: false, message: 'Experience not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Experience deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting experience:', error);
        res.status(500).json({ success: false, message: 'Failed to delete experience' });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// Start server (only in development, not on Vercel)
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`🚀 Server is running on port ${PORT}`);
        console.log(`📧 Email service configured for: ${process.env.EMAIL_USER}`);
        console.log(`🔐 Admin panel enabled`);
    });
}

// Export for Vercel serverless
module.exports = app;

