// Modules
const nodemailer = require("nodemailer");

// -----------------------------IMPORTS---------------------------------------

// Create transporter function with auth information to send messages in user email
const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS
    }
});

// Send mail function to send messages in user email
const sendMail = async (to, subject, html) => {
    await transporter.sendMail({ 
        from: '"DevMarket" - Verification Link', 
        to, 
        subject, 
        html 
    });
};

module.exports = sendMail;