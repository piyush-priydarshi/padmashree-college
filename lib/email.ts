import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587', 10),
  secure: process.env.EMAIL_PORT === '465',
  auth: {
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASS || '',
  },
});

export async function sendMail({ to, subject, html }: { to: string; subject: string; html: string }) {
  const mailOptions = {
    from: `"Padmashree College" <${process.env.EMAIL_USER || 'no-reply@padmashreecollege.edu.np'}>`,
    to,
    subject,
    html,
  };
  return transporter.sendMail(mailOptions);
}
