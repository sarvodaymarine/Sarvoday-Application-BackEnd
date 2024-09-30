/* eslint-disable @typescript-eslint/no-explicit-any */
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { google } from 'googleapis';
import fs from 'fs';
dotenv.config();

const CLIENT_ID = process.env.EMAIL_CLIENT_ID;
const CLIENT_SECRET = process.env.EMAIL_CLIENT_SECREAT;
const REDIRECT_URI = process.env.EMAIL_REDIRECT_URL;
const REFRESH_TOKEN = process.env.EMAIL_REFRESH_TOKEN;
const GMAIL_USER = process.env.NODE_MAILER_USER;

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

export const sendLoginCredentialEmail = async (email: string, name: string, dummyPassowrd: string): Promise<void> => {
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
                  <p>&copy; 2024 Sarvoday Marine. All rights reserved.</p>
                </div>
              </div>
            </body>
          </html>
        `,
  };
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
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error getting access token or sending email:', error);
    if ((error as Error).message.includes('invalid_grant')) {
      console.warn('Trying to refresh access token...');
      try {
        const newAccessToken = await oAuth2Client.refreshAccessToken();
        oAuth2Client.setCredentials({
          refresh_token: REFRESH_TOKEN,
          access_token: newAccessToken.credentials.access_token,
        });
        console.log('Access token refreshed successfully. Retrying email sending...');
        await transporter.sendMail(mailOptions);
      } catch (refreshError) {
        console.error('Error refreshing access token:', refreshError);
      }
    }
  }
};

export const sendResetPasswordEmail = async (email: string, name: string, dummyPassowrd: string): Promise<void> => {
  const mailOptions = {
    from: '"Sarvoday Marine" <sarvodaydev@gmail.com>',
    to: email,
    subject: 'Reset Password Details for your Sarvoday Marine Account',
    html: `<html>
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
        <h1>Password Reset Request</h1>
      </div>
      <div class="content">
        <p>Dear ${name},</p>
        <p>We have received a request to reset your password. Below is your temporary password:</p>
        <p><strong>Temporary Password:</strong> ${dummyPassowrd}</p>
        <p>This password is only valid for a single use. Please log in to your account using the above temporary password and update it to a new, secure password immediately.</p>
        <p>Follow these steps:</p>
        <ol>
          <li>Log in using the temporary password.</li>
          <li>Change your password to something you will remember.</li>
        </ol>
        <p>If you did not request a password reset, please ignore this email or contact our support team immediately.</p>
      </div>
      <div class="footer">
        <p>If you have any questions or encounter any issues, feel free to contact our support team.</p>
        <p>&copy; 2024 Sarvoday Marine. All rights reserved.</p>
      </div>
    </div>
  </body>
</html>
`,
  };
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
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error getting access token or sending email:', error);
    if ((error as Error).message.includes('invalid_grant')) {
      console.warn('Trying to refresh access token...');
      try {
        const newAccessToken = await oAuth2Client.refreshAccessToken();
        oAuth2Client.setCredentials({
          refresh_token: REFRESH_TOKEN,
          access_token: newAccessToken.credentials.access_token,
        });
        console.log('Access token refreshed successfully. Retrying email sending...');
        await transporter.sendMail(mailOptions);
      } catch (refreshError) {
        console.error('Error refreshing access token:', refreshError);
      }
    }
  }
};

export const sendReportMail = async (
  email: string,
  name: string,
  servicesName: string,
  soId: string,
  noOfContainer: string,
  attachment: any,
): Promise<void> => {
  const mailOptions = {
    from: '"Sarvoday Marine" <sarvodaydev@gmail.com>',
    to: email,
    subject: 'Container Reports for Your Review from Sarvoday Marine',
    attachment: attachment.map((filePath: any) => ({
      filename: path.basename(filePath),
      content: fs.readFileSync(filePath),
      contentType: 'application/pdf',
    })),
    html: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f9f9f9;
        margin: 0;
        padding: 0;
        -webkit-font-smoothing: antialiased;
        color: #333;
      }

      table {
        border-spacing: 0;
        width: 100%;
        margin: 0 auto;
      }

      td {
        padding: 0;
      }

      .email-container {
        max-width: 600px;
        margin: 20px auto;
        background-color: #fff;
        padding: 20px;
        border-radius: 6px;
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
      }

      h1,
      h2 {
        color: #333333;
        font-size: 24px;
        font-weight: normal;
      }

      p {
        font-size: 16px;
        line-height: 1.6;
      }

      .service-list {
        margin: 20px 0;
        padding: 0;
        list-style-type: none;
      }

      .service-item {
        margin-bottom: 15px;
        padding: 15px;
        border: 1px solid #e6e6e6;
        border-radius: 5px;
        background-color: #f5f5f5;
      }

      .service-item h3 {
        font-size: 18px;
        margin: 0 0 5px 0;
      }

      .service-item p {
        margin: 0;
      }

      .button {
        display: inline-block;
        margin-top: 20px;
        background-color: #007bff;
        color: #fff;
        padding: 10px 20px;
        text-decoration: none;
        border-radius: 5px;
        font-size: 16px;
      }

      .footer {
        margin-top: 30px;
        font-size: 12px;
        text-align: center;
        color: #777777;
      }

      .footer a {
        color: #007bff;
        text-decoration: none;
      }
    </style>
  </head>
  <body>
    <table role="presentation" class="email-container">
      <tr>
        <td>
          <p>Hello ${name},</p>
          <p>I hope this message finds you well.</p>
          <p>Please find attached the container reports detailing the requested services. The report includes a breakdown of the containers assigned to each service, along with relevant details for your review.</p>
          <ul class="service-list">
            <li class="service-item">
                <h3>SoId: ${soId}</h3>
              <h3>Service: ${servicesName}</h3>
              <p>Number of Containers: ${noOfContainer}</p>
            </li>
          </ul>
          <p>For more detailed information, please refer to the attached container reports.</p>
          <p>If you have any questions or require further information, feel free to reach out.</p>
          <br>
          <p>Best regards, <br>Sarvoday Marine </p>
          <div class="footer">
            <p>&copy; 2024 Sarvoday Marine. All rights reserved.</p>
          </div>
        </td>
      </tr>
    </table>
  </body>
</html>`,
  };
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
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error getting access token or sending email:', error);
    if ((error as Error).message.includes('invalid_grant')) {
      console.warn('Trying to refresh access token...');
      try {
        const newAccessToken = await oAuth2Client.refreshAccessToken();
        oAuth2Client.setCredentials({
          refresh_token: REFRESH_TOKEN,
          access_token: newAccessToken.credentials.access_token,
        });
        console.log('Access token refreshed successfully. Retrying email sending...');
        await transporter.sendMail(mailOptions);
      } catch (refreshError) {
        console.error('Error refreshing access token:', refreshError);
      }
    }
  }
};
