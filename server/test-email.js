// Test script to verify email configuration
const nodemailer = require('nodemailer');
require('dotenv').config();

console.log('Testing email configuration...');
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '***configured***' : 'NOT SET');
console.log('RECIPIENT_EMAIL:', process.env.RECIPIENT_EMAIL);

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Verify connection
transporter.verify((error, success) => {
    if (error) {
        console.error('❌ Email configuration error:', error);
    } else {
        console.log('✅ Email server is ready to send messages');

        // Send test email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.RECIPIENT_EMAIL,
            subject: '🧪 Test Email - Portfolio Backend',
            html: `
        <h2>Test Email</h2>
        <p>If you receive this email, your email configuration is working correctly!</p>
        <p>Time: ${new Date().toLocaleString()}</p>
      `
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error('❌ Failed to send test email:', err);
            } else {
                console.log('✅ Test email sent successfully!');
                console.log('Message ID:', info.messageId);
            }
            process.exit(0);
        });
    }
});
