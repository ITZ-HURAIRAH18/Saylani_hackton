import dotenv from "dotenv";
dotenv.config();


import nodemailer from "nodemailer";
import User from "../models/User.js";

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});


/**
 * Send email with subject + custom HTML template
 * 
 * @param {string} userId - MongoDB user ID
 * @param {string} subject - Email subject
 * @param {string} htmlTemplate - Email HTML content
 * @param {boolean} sendToAdmin - If true, send copy to admin
 */
export const sendEmail = async (userId, subject, htmlTemplate, sendToAdmin = false) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found, cannot send email");

  try {
    // 1️⃣ Send to user
    const userMailOptions = {
      from: `"${process.env.EMAIL_NAME}" <${process.env.EMAIL}>`,
      to: user.email,
      subject,
      html: htmlTemplate,
    };
    await transport.sendMail(userMailOptions);

    // 2️⃣ Send separately to admin (if enabled)
    if (sendToAdmin && process.env.ADMIN_EMAIL) {
      const adminMailOptions = {
        from: `"${process.env.EMAIL_NAME}" <${process.env.EMAIL}>`,
        to: process.env.ADMIN_EMAIL,
        subject: `[ADMIN COPY] ${subject}`,
        html: htmlTemplate,
      };
      await transport.sendMail(adminMailOptions);
    }

    return { success: true, message: "Emails sent successfully" };
  } catch (error) {
    throw new Error(error.message);
  }
};

