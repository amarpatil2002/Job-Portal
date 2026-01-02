const nodemailer = require("nodemailer")

const transportor = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

exports.veriyUserEmail = async ({ email, otp }) => {
    try {
        const mailOptions = {
            from: `"Job Portal Support" <${process.env.EMAIL_USER}>`,
            // from:process.env.EMAIL_USER,
            to: email,
            subject: "Verify Your Email",
            html: `
        <div style="font-family: Arial, sans-serif">
          <h2>Email Verification</h2>
          <p>Your verification OTP is:</p>
          <h1 style="letter-spacing:4px">${otp}</h1>
          <p>This OTP is valid for <b>1 minute</b>.</p>
          <p>If you didn’t request this, ignore this email.</p>
        </div>
      `,
        }

        // console.log(mailOptions);
        await transportor.sendMail(mailOptions)

    } catch (error) {
        return false
    }
}

exports.setResetOtpEmail = async ({ email, otp }) => {
    try {
        const mailOptions = {
            from: `"Job Portal Support" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Password Reset OTP",
            html: `
        <div style="font-family: Arial, sans-serif; line-height:1.6">
          <h2>Password Reset Request</h2>
          <p>Use the OTP below to reset your password:</p>
          <h1 style="letter-spacing: 4px;">${otp}</h1>
          <p>This OTP is valid for <b>1 minute</b>.</p>
          <p>If you did not request this, please ignore this email.</p>
          <br/>
          <p>— Job Portal Team</p>
        </div>
      `,
        };

        // console.log(mailOptions);
        await transportor.sendMail(mailOptions)

    } catch (error) {
        console.log(error);
        return false;
        // throw new Error("Failed to send OTP")
    }
}
