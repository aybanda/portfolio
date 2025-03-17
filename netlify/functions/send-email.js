const nodemailer = require("nodemailer");

exports.handler = async function (event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { name, email, services, message } = JSON.parse(event.body);

    // Validate input
    if (!name || !email || !services || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "All fields are required" }),
      };
    }

    // Create email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

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

    // Send emails
    await Promise.all([
      transporter.sendMail(mailOptions),
      transporter.sendMail(autoReplyOptions),
    ]);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Quote request received successfully" }),
    };
  } catch (error) {
    console.error("Error processing quote request:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to process quote request" }),
    };
  }
};
