// ============================================
// KNOWLEDGE BASE MANAGEMENT ENDPOINTS
// ============================================

// Configure multer for PDF uploads
const pdfStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'portfolio/knowledge-base',
        allowed_formats: ['pdf'],
        resource_type: 'raw'
    }
});

const pdfUpload = multer({ storage: pdfStorage });

// Upload PDF to knowledge base (Admin only)
app.post('/api/admin/knowledge-base/upload', verifyToken, pdfUpload.single('pdf'), async (req, res) => {
    try {
        const { title } = req.body;

        if (!req.file) {
            return res.status(400).json({ success: false, message: 'PDF file is required' });
        }

        if (!title) {
            return res.status(400).json({ success: false, message: 'Title is required' });
        }

        console.log('📄 [/api/admin/knowledge-base/upload] Uploading PDF:', title);

        // Download PDF from Cloudinary to extract text
        const response = await fetch(req.file.path);
        const buffer = await response.arrayBuffer();

        // Extract text from PDF
        const pdfData = await pdfParse(Buffer.from(buffer));
        const extractedText = pdfData.text;

        console.log(`📄 Extracted ${extractedText.length} characters from PDF`);

        // Save to database
        const knowledgeBase = new KnowledgeBase({
            title,
            filename: req.file.filename,
            content: extractedText,
            fileUrl: req.file.path,
            uploadedBy: 'admin'
        });

        await knowledgeBase.save();

        res.status(201).json({
            success: true,
            message: 'PDF uploaded and processed successfully',
            knowledgeBase: {
                id: knowledgeBase._id,
                title: knowledgeBase.title,
                filename: knowledgeBase.filename,
                contentLength: extractedText.length
            }
        });
    } catch (error) {
        console.error('❌ [/api/admin/knowledge-base/upload] Error:', error);
        res.status(500).json({ success: false, message: 'Failed to upload PDF', error: error.message });
    }
});

// Get all knowledge base items (Admin only)
app.get('/api/admin/knowledge-base', verifyToken, async (req, res) => {
    try {
        const knowledgeBase = await KnowledgeBase.find()
            .select('-content') // Exclude large content field
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: knowledgeBase.length,
            knowledgeBase
        });
    } catch (error) {
        console.error('❌ [/api/admin/knowledge-base] Error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch knowledge base' });
    }
});

// Delete knowledge base item (Admin only)
app.delete('/api/admin/knowledge-base/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;

        const kb = await KnowledgeBase.findById(id);

        if (!kb) {
            return res.status(404).json({ success: false, message: 'Knowledge base item not found' });
        }

        // Delete from Cloudinary
        const publicId = kb.fileUrl.split('/').slice(-2).join('/').split('.')[0];
        await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });

        // Delete from database
        await KnowledgeBase.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'Knowledge base item deleted successfully'
        });
    } catch (error) {
        console.error('❌ [/api/admin/knowledge-base/:id] Error:', error);
        res.status(500).json({ success: false, message: 'Failed to delete knowledge base item' });
    }
});

// ============================================
// DEAL MANAGEMENT ENDPOINTS
// ============================================

// Create deal from conversation
app.post('/api/chat/create-deal', async (req, res) => {
    try {
        const { sessionId, userInfo, projectDetails, budget, timeline } = req.body;

        if (!sessionId || !userInfo || !projectDetails) {
            return res.status(400).json({
                success: false,
                message: 'Session ID, user info, and project details are required'
            });
        }

        // Find conversation
        const conversation = await ChatConversation.findOne({ sessionId });

        if (!conversation) {
            return res.status(404).json({ success: false, message: 'Conversation not found' });
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

        const deal = await Deal.findByIdAndUpdate(
            id,
            { status, notes, ...(status === 'closed' && { closedAt: new Date() }) },
            { new: true }
        );

        if (!deal) {
            return res.status(404).json({ success: false, message: 'Deal not found' });
        }

        // Update conversation
        await ChatConversation.findByIdAndUpdate(deal.conversationId, {
            dealStatus: status
        });

        res.status(200).json({
            success: true,
            message: 'Deal updated successfully',
            deal
        });
    } catch (error) {
        console.error('❌ [/api/admin/deals/:id] Error:', error);
        res.status(500).json({ success: false, message: 'Failed to update deal' });
    }
});
