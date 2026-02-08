const mongoose = require('mongoose');

const knowledgeBaseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    filename: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true // Extracted PDF text
    },
    fileUrl: {
        type: String,
        required: true // Cloudinary URL
    },
    uploadedBy: {
        type: String,
        default: 'admin'
    }
}, {
    timestamps: true
});

// Index for efficient text search
knowledgeBaseSchema.index({ content: 'text', title: 'text' });

module.exports = mongoose.model('KnowledgeBase', knowledgeBaseSchema);
