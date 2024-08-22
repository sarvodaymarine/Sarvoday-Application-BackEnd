import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  // service: 'smtp.gmail.com',
  auth: {
    user: 'jainish.sarvodaymarine@gmail.com',
    pass: 'JainishG@08102000',
  },
});

export const sendEmail = async (email: string, name: string, dummyPassowrd: string): Promise<void> => {
  const mailOptions = {
    from: '"Sender Name" <arpitagr2122@gmail.com>',
    to: email,
    subject: 'Access Details for your Sarvoday Marine Account',
    html: `
          <html>
            <head>
              <style>
                .email-container {
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
                  color: #333;
                }
                .header {
                  background-color: #f8f9fa;
                  padding: 10px;
                  text-align: center;
                  border-bottom: 1px solid #ddd;
                }
                .content {
                  padding: 20px;
                }
                .footer {
                  background-color: #f8f9fa;
                  padding: 10px;
                  text-align: center;
                  border-top: 1px solid #ddd;
                  font-size: 12px;
                  color: #777;
                }
                .button {
                  display: inline-block;
                  padding: 10px 20px;
                  margin-top: 10px;
                  font-size: 14px;
                  color: #fff;
                  background-color: #007bff;
                  text-decoration: none;
                  border-radius: 5px;
                }
              </style>
            </head>
            <body>
              <div class="email-container">
                <div class="header">
                  <h1>Welcome to Our Service</h1>
                </div>
                <div class="content">
                  <p>Dear ${name},</p>
                  <p>Your account has been created successfully. Here are your login details:</p>
                  <p><strong>Username:</strong> ${email}</p>
                  <p><strong>Temporary Password:</strong> ${dummyPassowrd}</p>
                  <p>Please log in to your account and change your password as soon as possible.</p>
                </div>
                <div class="footer">
                  <p>If you have any questions, feel free to contact our support team.</p>
                  <p>&copy; 2024 Our Service. All rights reserved.</p>
                </div>
              </div>
            </body>
          </html>
        `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
