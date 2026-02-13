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

export const sendNewShopNotification = async (email: string, name: string, shopName: string, shopLocation: string) => {
  const mailOptions = {
    from: `"Smart Local Commerce" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: '🎉 New Shop Added - Check It Out!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4CAF50;">Hi ${name}! 👋</h2>
        <p>Great news! A new shop has been added to Smart Local Commerce.</p>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #333;">🏪 ${shopName}</h3>
          <p style="margin: 5px 0; color: #666;">📍 Location: ${shopLocation}</p>
        </div>
        <p>Visit the shop now and explore their products!</p>
        <p style="color: #666; font-size: 12px;">Best regards,<br>Smart Local Commerce Team</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const sendNewPromotionNotification = async (email: string, name: string, shopName: string, discount: string) => {
  const mailOptions = {
    from: `"Smart Local Commerce" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: '🎁 New Promotion Alert - Save Now!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4CAF50;">Hi ${name}! 👋</h2>
        <p>Exciting news! A new promotion is now available.</p>
        <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ffc107;">
          <h3 style="margin: 0 0 10px 0; color: #333;">🏪 ${shopName}</h3>
          <p style="margin: 5px 0; color: #856404; font-size: 18px; font-weight: bold;">💰 ${discount} OFF</p>
        </div>
        <p>Don't miss out on this amazing deal!</p>
        <p style="color: #666; font-size: 12px;">Best regards,<br>Smart Local Commerce Team</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
