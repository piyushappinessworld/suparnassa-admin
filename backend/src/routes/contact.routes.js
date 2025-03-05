// sendEmail.js
const sgMail = require("@sendgrid/mail");

const sendEmail = async (formData) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: "agrawaljoy1@gmail.com",
    from: "piyush.a@appinessworld.com",
    subject: "New Enquiry from Contact Form",
    text: `
      First Name: ${formData.firstName}
      Last Name: ${formData.lastName}
      Email: ${formData.email}
      Phone: ${formData.phone}
      Inquiry Type: ${formData.inquiryType}
      Source: ${formData.source}
      Message: ${formData.message}
      Agreed to Terms: ${formData.terms ? "Yes" : "No"}
    `,
    html: `
      <p><strong>First Name:</strong> ${formData.firstName}</p>
      <p><strong>Last Name:</strong> ${formData.lastName}</p>
      <p><strong>Email:</strong> ${formData.email}</p>
      <p><strong>Phone:</strong> ${formData.phone}</p>
      <p><strong>Inquiry Type:</strong> ${formData.inquiryType}</p>
      <p><strong>Source:</strong> ${formData.source}</p>
      <p><strong>Message:</strong> ${formData.message}</p>
      <p><strong>Agreed to Terms:</strong> ${formData.terms ? "Yes" : "No"}</p>
    `,
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
