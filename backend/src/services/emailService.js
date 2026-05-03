const nodemailer = require("nodemailer");

// Create the transporter using your Gmail credentials from the .env file
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendEmailAlert(targetUrl, itemName) {
  try {
    const mailOptions = {
      from: `"Sniper Bot" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Sending it to yourself!
      subject: `🚨 IN STOCK: ${itemName}`,
      html: `
        <h2>Good news! Your item is in stock.</h2>
        <p>We found stock for <b>${itemName}</b>.</p>
        <a href="${targetUrl}" style="padding: 10px 20px; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px; display: inline-block;">
          Buy it Now
        </a>
        <br><br>
        <p>Happy hunting,<br>Your Sniper Bot</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[Email] Alert sent successfully: ${info.messageId}`);
  } catch (error) {
    console.error("[Email Error] Failed to send alert:", error);
  }
}

module.exports = { sendEmailAlert };
