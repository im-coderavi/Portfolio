const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
    ip: {
        type: String,
        required: false // Optional as we might not always get it or want to store it fully
    },
    userAgent: {
        type: String,
        required: true
    },
    referrer: {
        type: String,
        default: 'Direct'
    },
    language: {
        type: String,
        default: 'en'
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    path: {
        type: String,
        default: '/'
    },
    deviceType: {
        type: String,
        default: 'desktop'
    }
}, { timestamps: true });

module.exports = mongoose.model('Visitor', visitorSchema);
