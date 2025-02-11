// mailer.js
const nodemailer = require('nodemailer');
require('dotenv').config();

let transporter;

async function configureTransporter() {
    transporter = nodemailer.createTransport({
        host: "smtp.gmail.com", 
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        tls: {
            rejectUnauthorized: false // Allow self-signed certificates (optional)
        }
    });
      await transporter.verify()
  .then(() => {
    console.log("SMTP connection established successfully.");
  })
  .catch(err => {
    console.error("SMTP connection failed:", err);
    console.error("Error stack trace:", err.stack);
  });
}

configureTransporter();

module.exports = {
    sendOtp : async(email,otp) => {
        const  mailOptions = {
          from: '"MyEconics - Learning Management System" <no-reply@yourdomain.com>',
          to: email,
          subject: 'Your OTP for Password Change',
          text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
      };
  
      await transporter.sendMail(mailOptions);
    },
}