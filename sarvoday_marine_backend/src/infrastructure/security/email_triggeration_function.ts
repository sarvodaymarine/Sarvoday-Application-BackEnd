/* eslint-disable @typescript-eslint/no-explicit-any */
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { google } from 'googleapis';
dotenv.config();

const CLIENT_ID = process.env.EMAIL_CLIENT_ID;
const CLIENT_SECRET = process.env.EMAIL_CLIENT_SECREAT;
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = process.env.EMAIL_REFRESH_TOKEN;
const GMAIL_USER = process.env.NODE_MAILER_USER;

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

export const sendEmail = async (email: string, name: string, dummyPassowrd: string): Promise<void> => {
  const mailOptions = {
    from: '"Sarvoday Marine" <sarvodaydev@gmail.com>',
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
    const accessToken = await oAuth2Client.getAccessToken();
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        type: 'OAuth2',
        user: GMAIL_USER,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    } as nodemailer.TransportOptions);

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export const sendReportMail = async (email: string, name: string, attachment: any): Promise<void> => {
  const mailOptions = {
    from: '"Sarvoday Marine" <sarvodaydev@gmail.com>',
    to: email,
    subject: 'Reports from Sarvoday Marine',
    attachment: attachment,
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
                  <p>Please Find the Attached Reports of your Containers.</p>
                  <p>Thanks for the Business</p>
                   <p><strong>Sarvoday Marine</strong></p>
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
    const accessToken = await oAuth2Client.getAccessToken();
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        type: 'OAuth2',
        user: GMAIL_USER,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    } as nodemailer.TransportOptions);

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
