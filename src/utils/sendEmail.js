import nodemailer from "nodemailer";

/**
 * Sends an email using Nodemailer
 * @param {Object} options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text email body
 * @param {string} [options.html] - Optional HTML email body
 */
export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    // You can use your SMTP credentials or a service like Gmail
    const transporter = nodemailer.createTransport({
      service: "Gmail", // or use "hotmail", "outlook", "yahoo", or custom SMTP
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"SkillersZone" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Email sending failed.");
  }
};
