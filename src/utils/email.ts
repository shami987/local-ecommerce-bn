import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter
  .verify()
  .then(() => console.log('SMTP ready'))
  .catch((err) => console.error('SMTP config error:', err));


export const sendWelcomeEmail = async (email: string, name: string) => {
  const mailOptions = {
    from: `"Smart Local Commerce" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Welcome to Smart Local Commerce! 🎉',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4CAF50;">Welcome ${name}! 👋</h2>
        <p>Thank you for registering with Smart Local Commerce.</p>
        <p>We're excited to have you on board! You can now:</p>
        <ul>
          <li>Browse local products</li>
          <li>Shop from local stores</li>
          <li>Enjoy exclusive promotions</li>
        </ul>
        <p>Happy shopping!</p>
        <p style="color: #666; font-size: 12px;">Best regards,<br>Smart Local Commerce Team</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
