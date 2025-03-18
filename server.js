const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();

// Middleware
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? [
            "https://aybanda.vercel.app",
            "https://ajay-dev.vercel.app",
            "https://ajay-dev-aybanda.vercel.app",
            "https://aybanda.com",
            "https://www.aybanda.com",
          ]
        : "http://localhost:8000",
    methods: ["POST"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.static("public"));

// Email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  pool: true, // Use pooled connections
  maxConnections: 3, // Maximum number of simultaneous connections
  maxMessages: Infinity, // Maximum number of messages per connection
  debug: true, // Enable debug logs
  logger: true, // Enable logger
});

// Verify email configuration on startup
transporter.verify(function (error, success) {
  if (error) {
    console.error("Email configuration error:", error);
    console.error("Environment variables:", {
      EMAIL_USER: process.env.EMAIL_USER ? "Set" : "Not set",
      EMAIL_PASS: process.env.EMAIL_PASS ? "Set" : "Not set",
      NODE_ENV: process.env.NODE_ENV,
    });
  } else {
    console.log("Server is ready to send emails");
  }
});

// Quote request endpoint
app.post("/api/quote", async (req, res) => {
  console.log("Received quote request:", {
    body: req.body,
    headers: req.headers,
    origin: req.get("origin"),
  });

  try {
    const { name, email, services, message } = req.body;

    // Validate input
    if (!name || !email || !services || !message) {
      console.error("Missing required fields:", {
        name,
        email,
        services,
        message,
      });
      return res.status(400).json({ error: "All fields are required" });
    }

    // Send immediate success response
    res.status(200).json({ message: "Quote request received successfully" });

    // Prepare email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `New Quote Request from ${name}`,
      html: `
        <h2>New Quote Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Services:</strong> ${services.join(", ")}</p>
        <p><strong>Project Details:</strong></p>
        <p>${message}</p>
      `,
    };

    const autoReplyOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Thank you for your quote request",
      html: `
        <h2>Thank you for reaching out, ${name}!</h2>
        <p>I've received your quote request for the following services:</p>
        <ul>
          ${services.map((service) => `<li>${service}</li>`).join("")}
        </ul>
        <p>I'll review your project details and get back to you with a personalized quote within 24 hours.</p>
        <p>Best regards,<br>Ajay Bandaru</p>
      `,
    };

    // Send emails asynchronously with retries and logging
    const sendEmailWithRetry = async (options, retries = 3) => {
      for (let i = 0; i < retries; i++) {
        try {
          console.log(`Attempt ${i + 1} to send email to ${options.to}`);
          const info = await transporter.sendMail(options);
          console.log("Email sent successfully:", info);
          return true;
        } catch (error) {
          console.error(`Email attempt ${i + 1} failed:`, error);
          if (i === retries - 1) throw error;
          await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
        }
      }
    };

    // Send both emails in parallel with error handling
    Promise.all([
      sendEmailWithRetry(mailOptions),
      sendEmailWithRetry(autoReplyOptions),
    ]).catch((error) => {
      console.error("Error sending emails:", error);
      console.error("Email configuration:", {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS ? "Set" : "Not set",
        service: "gmail",
      });
    });
  } catch (error) {
    console.error("Error processing quote request:", error);
    // Don't send error response here since we already sent success
    // This prevents client from getting an error after success message
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT} in ${process.env.NODE_ENV || "development"} mode`
  );
});
