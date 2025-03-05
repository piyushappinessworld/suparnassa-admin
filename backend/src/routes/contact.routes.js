const sgMail = require("@sendgrid/mail");

const sendEmail = async (formData) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  // Construct email content dynamically based on the form data
  const textContent = Object.entries(formData)
    .map(([key, value]) => {
      if (key === "subject") return; // Skip the subject field
      return `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`;
    })
    .filter(Boolean) // Remove undefined values
    .join("\n");

  const htmlContent = Object.entries(formData)
    .map(([key, value]) => {
      if (key === "subject") return; // Skip the subject field
      return `<p><strong>${
        key.charAt(0).toUpperCase() + key.slice(1)
      }:</strong> ${value}</p>`;
    })
    .filter(Boolean) // Remove undefined values
    .join("");

  const msg = {
    to: "your-email@example.com", // Change to your email
    from: "your-email@example.com", // Change to your verified sender email in SendGrid
    subject: formData.subject || "New Enquiry from Contact Form",
    text: textContent,
    html: htmlContent,
  };

  try {
    await sgMail.send(msg);
    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, message: "Error sending email" };
  }
};

module.exports = sendEmail;
