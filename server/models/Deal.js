const mongoose = require('mongoose');

const dealSchema = new mongoose.Schema({
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ChatConversation',
        required: true
    },
    userInfo: {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        phone: String
    },
    projectDetails: {
        type: String,
        required: true
    },
    budget: String,
    timeline: String,
    status: {
        type: String,
        enum: ['open', 'in-progress', 'closed', 'cancelled'],
        default: 'open'
    },
    notes: String,
    closedAt: Date
}, {
    timestamps: true
});

// Indexes for efficient querying
dealSchema.index({ status: 1, createdAt: -1 });
dealSchema.index({ 'userInfo.email': 1 });

module.exports = mongoose.model('Deal', dealSchema);
