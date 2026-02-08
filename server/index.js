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
const pdfParse = require('pdf-parse');
const axios = require('axios');
require('dotenv').config();

// Import Models
const Project = require('./models/Project');
const Settings = require('./models/Settings');
const Experience = require('./models/Experience');
const ChatConversation = require('./models/ChatConversation');
const Deal = require('./models/Deal');

// Import Chatbot Logic (Rule-based - No external API needed!)
const { getBotResponse } = require('./config/chatbot');

const app = express();
const PORT = process.env.PORT || 5000;

// Debug: Check if key env vars are loaded
console.log('Environment Check:');
console.log('MONGODB_URI defined:', !!process.env.MONGODB_URI);
console.log('CLOUDINARY_CLOUD_NAME defined:', !!process.env.CLOUDINARY_CLOUD_NAME);

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

// Cloudinary Storage Configuration for Images
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

// Cloudinary Storage Configuration for PDFs (Knowledge Base)
const pdfStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'portfolio/knowledge-base',
        allowed_formats: ['pdf'],
        resource_type: 'raw'
    }
});

const pdfUpload = multer({
    storage: pdfStorage,
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
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Admin-Password');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve uploaded files (for backward compatibility with local images)
// This allows existing images to load locally while we migrate them
const uploadDir = path.join(__dirname, 'uploads');
if (fs.existsSync(uploadDir)) {
    app.use('/uploads', express.static(uploadDir));
}

// MongoDB Connection with caching for serverless
let cachedDb = null;
let connectionPromise = null;

async function connectToDatabase(retries = 3) {
    // If already connected, return immediately
    if (cachedDb && mongoose.connection.readyState === 1) {
        console.log('✅ Using cached MongoDB connection');
        return cachedDb;
    }

    // If connection is in progress, wait for it
    if (connectionPromise) {
        console.log('⏳ Connection in progress, waiting...');
        await connectionPromise;
        if (mongoose.connection.readyState === 1) {
            return mongoose.connection;
        }
    }

    // Start new connection
    connectionPromise = (async () => {
        let lastError;
        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                console.log(`🔄 MongoDB connection attempt ${attempt}/${retries}...`);

                // Disconnect if in connecting state (stuck connection)
                if (mongoose.connection.readyState === 2) {
                    console.log('⚠️ Found stuck connection, disconnecting...');
                    await mongoose.disconnect();
                }

                await mongoose.connect(process.env.MONGODB_URI, {
                    serverSelectionTimeoutMS: 30000,
                    socketTimeoutMS: 45000,
                    bufferCommands: true, // Enable buffering to prevent race conditions
                    maxPoolSize: 10,
                    minPoolSize: 1,
                });

                // Wait for connection to be ready
                if (mongoose.connection.readyState !== 1) {
                    await new Promise((resolve, reject) => {
                        const timeout = setTimeout(() => {
                            reject(new Error('Connection timeout waiting for ready state'));
                        }, 10000);

                        mongoose.connection.once('connected', () => {
                            clearTimeout(timeout);
                            resolve();
                        });

                        mongoose.connection.once('error', (err) => {
                            clearTimeout(timeout);
                            reject(err);
                        });
                    });
                }

                console.log('✅ Connected to MongoDB Atlas');
                cachedDb = mongoose.connection;
                return cachedDb;
            } catch (err) {
                lastError = err;
                console.error(`❌ MongoDB connection attempt ${attempt}/${retries} failed:`, err.message);

                // If this isn't the last attempt, wait before retrying
                if (attempt < retries) {
                    const waitTime = attempt * 1000;
                    console.log(`⏳ Waiting ${waitTime}ms before retry...`);
                    await new Promise(resolve => setTimeout(resolve, waitTime));
                }
            }
        }

        // All retries failed
        console.error('❌ All MongoDB connection attempts failed');
        throw lastError;
    })();

    try {
        const result = await connectionPromise;
        return result;
    } finally {
        connectionPromise = null;
    }
}

// Initialize connection
connectToDatabase().catch(console.error);

// Middleware to verify JWT token
// Simple password-based authentication middleware
const verifyToken = (req, res, next) => {
    const password = req.header('X-Admin-Password');

    if (!password) {
        return res.status(401).json({ success: false, message: 'Admin password required' });
    }

    if (password !== process.env.ADMIN_PASSWORD) {
        return res.status(401).json({ success: false, message: 'Invalid admin password' });
    }

    next();
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
// Nodemailer transporter configuration
// Using explicit SMTP settings for better reliability on Vercel
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // Use SSL
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Removed transporter.verify() to prevent startup timeouts in serverless environment

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
        const { notificationsEnabled, adsenseCode, adsTxt, metaTags } = req.body;

        const updateData = { notificationsEnabled, updatedAt: Date.now() };
        if (adsenseCode !== undefined) updateData.adsenseCode = adsenseCode;
        if (adsTxt !== undefined) updateData.adsTxt = adsTxt;
        if (metaTags !== undefined) updateData.metaTags = metaTags;

        const settings = await Settings.findOneAndUpdate(
            {},
            updateData,
            { new: true, upsert: true }
        );

        res.status(200).json({ success: true, message: 'Settings updated', settings });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update settings' });
    }
});

// Serve ads.txt (public)
app.get('/ads.txt', async (req, res) => {
    try {
        await connectToDatabase();
        const settings = await Settings.findOne();
        res.header('Content-Type', 'text/plain');
        res.send(settings ? settings.adsTxt || '' : '');
    } catch (error) {
        console.error('Error serving ads.txt:', error);
        res.status(500).send('');
    }
});

// Get Public Settings (public) - for injecting scripts/tags
app.get('/api/public-settings', async (req, res) => {
    try {
        await connectToDatabase();
        const settings = await Settings.findOne();
        res.status(200).json({
            success: true,
            adsenseCode: settings ? settings.adsenseCode : '',
            metaTags: settings ? settings.metaTags : ''
        });
    } catch (error) {
        console.error('Error fetching public settings:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch settings' });
    }
});



// Get all projects (public)
app.get('/api/projects', async (req, res) => {
    try {
        console.log('📊 [/api/projects] Request received');
        console.log('📊 [/api/projects] MongoDB connection state:', mongoose.connection.readyState);

        await connectToDatabase(); // Ensure connection
        console.log('📊 [/api/projects] Database connected, fetching projects...');

        const projects = await Project.find().sort({ order: 1, createdAt: -1 });
        console.log(`📊 [/api/projects] Found ${projects.length} projects`);

        res.status(200).json({
            success: true,
            projects
        });
    } catch (error) {
        console.error('❌ [/api/projects] Error fetching projects:');
        console.error('❌ Error name:', error.name);
        console.error('❌ Error message:', error.message);
        console.error('❌ Error stack:', error.stack);
        console.error('❌ MongoDB state:', mongoose.connection.readyState);

        res.status(500).json({
            success: false,
            message: 'Failed to fetch projects',
            error: error.message,
            errorType: error.name,
            dbState: mongoose.connection.readyState
        });
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
        console.log('💼 [/api/experiences] Request received');
        console.log('💼 [/api/experiences] MongoDB connection state:', mongoose.connection.readyState);

        await connectToDatabase(); // Ensure connection
        console.log('💼 [/api/experiences] Database connected, fetching experiences...');

        const experiences = await Experience.find().sort({ order: 1, startDate: -1 });
        console.log(`💼 [/api/experiences] Found ${experiences.length} experiences`);

        res.status(200).json({
            success: true,
            experiences
        });
    } catch (error) {
        console.error('❌ [/api/experiences] Error fetching experiences:');
        console.error('❌ Error name:', error.name);
        console.error('❌ Error message:', error.message);
        console.error('❌ Error stack:', error.stack);
        console.error('❌ MongoDB state:', mongoose.connection.readyState);

        res.status(500).json({
            success: false,
            message: 'Failed to fetch experiences',
            error: error.message,
            errorType: error.name,
            dbState: mongoose.connection.readyState
        });
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

// ==================== AI CHATBOT ENDPOINTS ====================

// Send message to chatbot
app.post('/api/chat/message', async (req, res) => {
    try {
        const { sessionId, message } = req.body;

        if (!sessionId || !message) {
            return res.status(400).json({ success: false, message: 'Session ID and message are required' });
        }

        console.log(`💬 [/api/chat/message] Session: ${sessionId}, Message: ${message.substring(0, 50)}...`);

        // Find or create conversation
        let conversation = await ChatConversation.findOne({ sessionId });

        if (!conversation) {
            conversation = new ChatConversation({
                sessionId,
                messages: []
            });
        }

        // Add user message to conversation
        conversation.messages.push({
            role: 'user',
            content: message,
            timestamp: new Date()
        });
        conversation.lastMessageAt = new Date();

        // Get projects and experiences for context
        const projects = await Project.find().select('title description technologies');
        const experiences = await Experience.find().select('company position current');

        // Get bot response using rule-based system
        const botReply = getBotResponse(message, projects, experiences);

        console.log(`🤖 [/api/chat/message] Bot reply: ${botReply.substring(0, 50)}...`);

        // Add bot response to conversation
        conversation.messages.push({
            role: 'assistant',
            content: botReply,
            timestamp: new Date()
        });

        // Save conversation
        await conversation.save();

        res.status(200).json({
            success: true,
            message: botReply,
            sessionId: conversation.sessionId
        });
    } catch (error) {
        console.error('❌ [/api/chat/message] Error:', error);

        // Simple fallback for any errors
        const fallbackMessage = `Sorry, I encountered an error processing your message. 

**You can reach Avishek at:**
📧 Email: avishekgiri31@gmail.com
📝 Contact form on this website

Please try again or contact directly!`;

        res.status(200).json({
            success: true,
            message: fallbackMessage,
            sessionId: req.body.sessionId
        });
    }
});

// Get conversation history
app.get('/api/chat/history/:sessionId', async (req, res) => {
    try {
        const { sessionId } = req.params;

        const conversation = await ChatConversation.findOne({ sessionId });

        if (!conversation) {
            return res.status(200).json({
                success: true,
                messages: []
            });
        }

        res.status(200).json({
            success: true,
            messages: conversation.messages,
            userInfo: conversation.userInfo,
            projectConfirmed: conversation.projectConfirmed
        });
    } catch (error) {
        console.error('❌ [/api/chat/history] Error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch conversation history' });
    }
});

// Confirm project interest
app.post('/api/chat/confirm-project', async (req, res) => {
    try {
        const { sessionId, userInfo, projectDetails } = req.body;

        if (!sessionId || !userInfo || !userInfo.name || !userInfo.email) {
            return res.status(400).json({
                success: false,
                message: 'Session ID, name, and email are required'
            });
        }

        console.log(`✅ [/api/chat/confirm-project] Project confirmed for session: ${sessionId}`);

        // Update conversation
        const conversation = await ChatConversation.findOneAndUpdate(
            { sessionId },
            {
                userInfo,
                projectDetails: projectDetails || '',
                projectConfirmed: true,
                confirmedAt: new Date()
            },
            { new: true }
        );

        if (!conversation) {
            return res.status(404).json({ success: false, message: 'Conversation not found' });
        }

        // Prepare conversation summary for email
        const conversationSummary = conversation.messages
            .map(msg => `<p><strong>${msg.role === 'user' ? 'Visitor' : 'AI Assistant'}:</strong> ${msg.content}</p>`)
            .join('');

        // Send email notification
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.RECIPIENT_EMAIL,
            subject: '🚀 New Project Inquiry from AI Chatbot',
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
                        .info-label { font-weight: 600; color: #333; min-width: 100px; }
                        .info-value { color: #555; flex: 1; }
                        .conversation-box { background: #f8f9fa; padding: 25px; border-radius: 12px; margin: 25px 0; border: 1px solid #dee2e6; max-height: 400px; overflow-y: auto; }
                        .footer { background: #f8f9fa; padding: 25px 30px; text-align: center; color: #6c757d; font-size: 13px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🤖 New Project Inquiry via AI Chatbot</h1>
                            <p>A visitor confirmed their interest in working with you!</p>
                        </div>
                        <div class="content">
                            <h2>Contact Information</h2>
                            <div class="info-row">
                                <div class="info-label">👤 Name:</div>
                                <div class="info-value"><strong>${userInfo.name}</strong></div>
                            </div>
                            <div class="info-row">
                                <div class="info-label">📧 Email:</div>
                                <div class="info-value"><a href="mailto:${userInfo.email}">${userInfo.email}</a></div>
                            </div>
                            ${userInfo.phone ? `
                            <div class="info-row">
                                <div class="info-label">📱 Phone:</div>
                                <div class="info-value">${userInfo.phone}</div>
                            </div>
                            ` : ''}
                            
                            ${projectDetails ? `
                            <h2>Project Details</h2>
                            <div class="info-row">
                                <div class="info-value">${projectDetails}</div>
                            </div>
                            ` : ''}
                            
                            <h2>Conversation History</h2>
                            <div class="conversation-box">
                                ${conversationSummary}
                            </div>
                        </div>
                        <div class="footer">
                            <p>Sent from your AI Chatbot Assistant</p>
                            <p>${new Date().toLocaleString()}</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log(`✅ [/api/chat/confirm-project] Email sent successfully`);
        } catch (emailError) {
            console.error('❌ [/api/chat/confirm-project] Email error:', emailError);
            // Don't fail the request if email fails
        }

        res.status(200).json({
            success: true,
            message: 'Project confirmation received! Avishek will reach out to you soon.',
            conversation
        });
    } catch (error) {
        console.error('❌ [/api/chat/confirm-project] Error:', error);
        res.status(500).json({ success: false, message: 'Failed to confirm project' });
    }
});

// Get all conversations (Admin only)
app.get('/api/admin/chat/conversations', verifyToken, async (req, res) => {
    try {
        const conversations = await ChatConversation.find()
            .sort({ lastMessageAt: -1 })
            .select('-__v');

        const stats = {
            total: conversations.length,
            confirmed: conversations.filter(c => c.projectConfirmed).length,
            pending: conversations.filter(c => !c.projectConfirmed).length
        };

        res.status(200).json({
            success: true,
            conversations,
            stats
        });
    } catch (error) {
        console.error('❌ [/api/admin/chat/conversations] Error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch conversations' });
    }
});

// Delete conversation (Admin only)
app.delete('/api/admin/chat/conversations/:sessionId', verifyToken, async (req, res) => {
    try {
        const { sessionId } = req.params;

        const conversation = await ChatConversation.findOneAndDelete({ sessionId });

        if (!conversation) {
            return res.status(404).json({ success: false, message: 'Conversation not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Conversation deleted successfully'
        });
    } catch (error) {
        console.error('❌ [/api/admin/chat/conversations] Error:', error);
        res.status(500).json({ success: false, message: 'Failed to delete conversation' });
    }
});


// ============================================
// DEAL MANAGEMENT ENDPOINTS
// ============================================

// Create deal from conversation
app.post('/api/chat/create-deal', async (req, res) => {
    try {
        const { sessionId, userInfo, projectDetails, budget, timeline } = req.body;

        if (!sessionId || !userInfo) {
            return res.status(400).json({
                success: false,
                message: 'Session ID and user info are required'
            });
        }

        // Find or create conversation
        let conversation = await ChatConversation.findOne({ sessionId });

        if (!conversation) {
            // Create a new conversation for this session
            conversation = new ChatConversation({
                sessionId,
                messages: []
            });
            await conversation.save();
        }

        // Create deal
        const deal = new Deal({
            conversationId: conversation._id,
            userInfo,
            projectDetails,
            budget,
            timeline,
            status: 'open'
        });

        await deal.save();

        // Update conversation
        conversation.dealId = deal._id;
        conversation.hasDeal = true;
        conversation.dealStatus = 'open';
        await conversation.save();

        res.status(201).json({
            success: true,
            message: 'Deal created successfully',
            dealId: deal._id
        });
    } catch (error) {
        console.error('❌ [/api/chat/create-deal] Error:', error);
        res.status(500).json({ success: false, message: 'Failed to create deal' });
    }
});

// Close deal and send email
app.post('/api/chat/close-deal', async (req, res) => {
    try {
        const { dealId, notes } = req.body;

        if (!dealId) {
            return res.status(400).json({ success: false, message: 'Deal ID is required' });
        }

        // Find and update deal
        const deal = await Deal.findById(dealId).populate('conversationId');

        if (!deal) {
            return res.status(404).json({ success: false, message: 'Deal not found' });
        }

        deal.status = 'closed';
        deal.closedAt = new Date();
        if (notes) deal.notes = notes;
        await deal.save();

        // Update conversation
        await ChatConversation.findByIdAndUpdate(deal.conversationId._id, {
            dealStatus: 'closed'
        });

        // Prepare email
        const conversation = deal.conversationId;
        const conversationSummary = conversation.messages
            .map(msg => `<p><strong>${msg.role === 'user' ? 'Client' : 'AI'}:</strong> ${msg.content}</p>`)
            .join('');

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.RECIPIENT_EMAIL,
            subject: `🎉 Deal Closed - ${deal.userInfo.name}`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                        .section { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                        .label { font-weight: bold; color: #667eea; }
                        .conversation { max-height: 300px; overflow-y: auto; background: #f5f5f5; padding: 15px; border-radius: 5px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🎉 Deal Closed Successfully!</h1>
                        </div>
                        <div class="content">
                            <div class="section">
                                <h2>Client Information</h2>
                                <p><span class="label">Name:</span> ${deal.userInfo.name}</p>
                                <p><span class="label">Email:</span> ${deal.userInfo.email}</p>
                                <p><span class="label">Phone:</span> ${deal.userInfo.phone || 'Not provided'}</p>
                            </div>
                            
                            <div class="section">
                                <h2>Project Details</h2>
                                <p>${deal.projectDetails}</p>
                            </div>
                            
                            <div class="section">
                                <h2>Budget & Timeline</h2>
                                <p><span class="label">Budget:</span> ${deal.budget || 'Not specified'}</p>
                                <p><span class="label">Timeline:</span> ${deal.timeline || 'Not specified'}</p>
                            </div>
                            
                            ${notes ? `
                            <div class="section">
                                <h2>Notes</h2>
                                <p>${notes}</p>
                            </div>
                            ` : ''}
                            
                            <div class="section">
                                <h2>Conversation History</h2>
                                <div class="conversation">
                                    ${conversationSummary}
                                </div>
                            </div>
                            
                            <div class="section">
                                <h2>Next Steps</h2>
                                <p>✅ Review the project details</p>
                                <p>✅ Reach out to the client at ${deal.userInfo.email}</p>
                                <p>✅ Prepare a detailed proposal</p>
                            </div>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({
            success: true,
            message: 'Deal closed and notification sent successfully'
        });
    } catch (error) {
        console.error('❌ [/api/chat/close-deal] Error:', error);
        res.status(500).json({ success: false, message: 'Failed to close deal' });
    }
});

// Get all deals (Admin only)
app.get('/api/admin/deals', verifyToken, async (req, res) => {
    try {
        const { status } = req.query;

        const filter = status ? { status } : {};

        const deals = await Deal.find(filter)
            .populate('conversationId', 'sessionId messages')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: deals.length,
            deals
        });
    } catch (error) {
        console.error('❌ [/api/admin/deals] Error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch deals' });
    }
});

// Update deal status (Admin only)
app.patch('/api/admin/deals/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { status, notes } = req.body;

        console.log(`📝 [/api/admin/deals/${id}] Updating status to: ${status}`);

        const updateData = {};
        if (status) {
            updateData.status = status;
            if (status === 'closed') {
                updateData.closedAt = new Date();
            }
        }
        if (notes) {
            updateData.notes = notes;
        }

        const deal = await Deal.findByIdAndUpdate(id, updateData, { new: true });

        if (!deal) {
            console.log(`❌ [/api/admin/deals/${id}] Deal not found`);
            return res.status(404).json({ success: false, message: 'Deal not found' });
        }

        console.log(`✅ [/api/admin/deals/${id}] Status updated successfully`);

        res.status(200).json({
            success: true,
            message: 'Deal status updated successfully',
            deal
        });
    } catch (error) {
        console.error('❌ [/api/admin/deals/:id] Error:', error.message);
        res.status(500).json({ success: false, message: 'Failed to update deal: ' + error.message });
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

// Database status endpoint for debugging
app.get('/api/db-status', async (req, res) => {
    try {
        console.log('🔍 [/api/db-status] Checking database status...');

        // Connection state mapping
        const states = {
            0: 'disconnected',
            1: 'connected',
            2: 'connecting',
            3: 'disconnecting'
        };

        const connectionState = mongoose.connection.readyState;
        console.log('🔍 Connection state:', states[connectionState]);

        // Try to connect if not connected
        if (connectionState !== 1) {
            console.log('🔍 Attempting to connect...');
            await connectToDatabase();
        }

        // Get collection stats
        const projectCount = await Project.countDocuments();
        const experienceCount = await Experience.countDocuments();
        const settingsCount = await Settings.countDocuments();

        console.log(`🔍 Collections - Projects: ${projectCount}, Experiences: ${experienceCount}, Settings: ${settingsCount}`);

        res.status(200).json({
            success: true,
            database: {
                connected: mongoose.connection.readyState === 1,
                state: states[mongoose.connection.readyState],
                host: mongoose.connection.host || 'N/A',
                name: mongoose.connection.name || 'N/A'
            },
            collections: {
                projects: projectCount,
                experiences: experienceCount,
                settings: settingsCount
            },
            environment: {
                nodeEnv: process.env.NODE_ENV || 'development',
                mongodbConfigured: !!process.env.MONGODB_URI,
                cloudinaryConfigured: !!process.env.CLOUDINARY_CLOUD_NAME
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('❌ [/api/db-status] Error:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            errorType: error.name,
            database: {
                connected: false,
                state: 'error'
            },
            timestamp: new Date().toISOString()
        });
    }
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

