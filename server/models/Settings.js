const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    notificationsEnabled: {
        type: Boolean,
        default: true
    },
    adsenseCode: {
        type: String,
        default: ''
    },
    adsTxt: {
        type: String,
        default: ''
    },
    metaTags: {
        type: String,
        default: ''
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Settings', settingsSchema);
