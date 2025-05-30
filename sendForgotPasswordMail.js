const nodemailer = require('nodemailer');

const sendMail = async (email, token) => {
    
    let mailTransporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: `${process.env.EMAIL}`,
            pass: `${process.env.EMAIL_PASSWORD}`
        }
    })

    const mailInfo = {
        from: `${process.env.EMAIL}`,
        to: `${email}`,
        subject: "Password Reset",
        html: `
                <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
                    <div style="max-width: 600px; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1); text-align: center;">
                        <img src="https://yourlogo.com/logo.png" alt="FreshMart Logo" style="width: 150px; margin-bottom: 20px;">
                        <h1 style="color: #333;">Reset Your Password</h1>
                        <p style="font-size: 16px; color: #555;">You're receiving this email because you requested a password reset for your FreshMart account.</p>
                        <p>Click the button below to reset your password:</p>
                        <a href="https://www.yourcareerex.com/reset-password/${token}" style="display: inline-block; background-color: #28a745; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-size: 18px; margin-top: 20px;">Reset Password</a>
                        <p>If you didn't request a password reset, you can safely ignore this email.</p>
                        <div style="margin-top: 20px; font-size: 14px; color: #888;">
                            <p>© 2025 FreshMart. All rights reserved.</p>
                        </div>
                    </div>
                </div>
            `,
    }

    await mailTransporter.sendMail(mailInfo)
}

const validEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

module.exports = {sendMail, validEmail};