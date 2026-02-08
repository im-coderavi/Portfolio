const mongoose = require('mongoose');

const chatConversationSchema = new mongoose.Schema({
    sessionId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    messages: [{
        role: {
            type: String,
            enum: ['user', 'assistant'],
            required: true
        },
        content: {
            type: String,
            required: true
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    userInfo: {
        name: String,
        email: String,
        phone: String
    },
    projectDetails: {
        type: String,
        default: ''
    },
    projectConfirmed: {
        type: Boolean,
        default: false
    },
    confirmedAt: {
        type: Date
    },
    // Deal tracking fields
    dealId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Deal'
    },
    hasDeal: {
        type: Boolean,
        default: false
    },
    dealStatus: {
        type: String,
        enum: ['open', 'in-progress', 'closed', 'cancelled'],
        default: null
    },
    lastMessageAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for efficient querying
chatConversationSchema.index({ createdAt: -1 });
chatConversationSchema.index({ projectConfirmed: 1 });

module.exports = mongoose.model('ChatConversation', chatConversationSchema);
