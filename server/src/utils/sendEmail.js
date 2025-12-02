import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, text) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('⚠️  EMAIL_USER or EMAIL_PASS not configured. Skipping email...');
      return true;
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: subject,
      html: `<p>${text}</p>`,
      text: text,
    };

    await transporter.sendMail(mailOptions);
    
    return true;
  } catch (error) {
    if (error.code === 'EAUTH') {
      console.error('⚠️  Authentication failed. Check EMAIL_USER and EMAIL_PASS credentials');
    } else if (error.code === 'ETIMEDOUT') {
      console.error('⚠️  Connection timeout. SMTP may be blocked by hosting provider');
    }
    
    return true;
  }
};
