const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS
    }
});

const sendMail = async (to, subject, html) => {
    await transporter.sendMail({ 
        from: '"DevMarket" - Verification Link', 
        to, 
        subject, 
        html 
    });
};

module.exports = sendMail;