const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs').promises;

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Payment instructions templates
const paymentInstructions = {
  mobile_money: (donation) => ({
    subject: 'Complete Your Donation - Mobile Money Instructions',
    text: `
      Dear ${donation.donorName},
      
      Thank you for your generous donation of GHS ${donation.donationAmount.toFixed(2)} to Dr. WaZzz Foundation.
      
      To complete your donation, please follow these instructions:
      
      1. Open your mobile money app
      2. Select "Send Money" or "MoMo Pay"
      3. Enter the following details:
         - Number: 0244 123 4567
         - Amount: GHS ${donation.donationAmount.toFixed(2)}
         - Reference: ${donation.donationId}
      4. Enter your PIN to complete the transaction
      
      Once your payment is received, we'll send you a confirmation email.
      
      If you have any questions, please contact us at support@drwazz.org
      
      Thank you for your support!
      
      Best regards,
      The Dr. WaZzz Foundation Team
    `,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Complete Your Donation - Mobile Money Instructions</h2>
        <p>Dear ${donation.donorName},</p>
        
        <p>Thank you for your generous donation of <strong>GHS ${donation.donationAmount.toFixed(2)}</strong> to Dr. WaZzz Foundation.</p>
        
        <h3>To complete your donation, please follow these instructions:</h3>
        <ol>
          <li>Open your mobile money app</li>
          <li>Select "Send Money" or "MoMo Pay"</li>
          <li>Enter the following details:
            <ul>
              <li><strong>Number:</strong> 0244 123 4567</li>
              <li><strong>Amount:</strong> GHS ${donation.donationAmount.toFixed(2)}</li>
              <li><strong>Reference:</strong> ${donation.donationId}</li>
            </ul>
          </li>
          <li>Enter your PIN to complete the transaction</li>
        </ol>
        
        <p>Once your payment is received, we'll send you a confirmation email.</p>
        
        <p>If you have any questions, please contact us at <a href="mailto:support@drwazz.org">support@drwazz.org</a></p>
        
        <p>Thank you for your support!</p>
        
        <p>Best regards,<br>The Dr. WaZzz Foundation Team</p>
      </div>
    `
  }),
  
  bank_transfer: (donation) => ({
    subject: 'Complete Your Donation - Bank Transfer Instructions',
    text: `
      Dear ${donation.donorName},
      
      Thank you for your generous donation of GHS ${donation.donationAmount.toFixed(2)} to Dr. WaZzz Foundation.
      
      To complete your donation, please transfer the amount using the following bank details:
      
      Bank: EcoBank Ghana
      Account Name: Dr. WaZzz Foundation
      Account Number: 1234567890
      Branch: Accra Main
      SWIFT: ECOCGHAC
      Reference: ${donation.donationId}
      
      Please include the reference number (${donation.donationId}) in the transfer details so we can track your payment.
      
      Once your payment is received, we'll send you a confirmation email.
      
      If you have any questions, please contact us at support@drwazz.org
      
      Thank you for your support!
      
      Best regards,
      The Dr. WaZzz Foundation Team
    `,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Complete Your Donation - Bank Transfer Instructions</h2>
        <p>Dear ${donation.donorName},</p>
        
        <p>Thank you for your generous donation of <strong>GHS ${donation.donationAmount.toFixed(2)}</strong> to Dr. WaZzz Foundation.</p>
        
        <h3>To complete your donation, please transfer the amount using the following bank details:</h3>
        
        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <p><strong>Bank:</strong> EcoBank Ghana</p>
          <p><strong>Account Name:</strong> Dr. WaZzz Foundation</p>
          <p><strong>Account Number:</strong> 1234567890</p>
          <p><strong>Branch:</strong> Accra Main</p>
          <p><strong>SWIFT:</strong> ECOCGHAC</p>
          <p><strong>Reference:</strong> ${donation.donationId}</p>
        </div>
        
        <p>Please include the reference number (<strong>${donation.donationId}</strong>) in the transfer details so we can track your payment.</p>
        
        <p>Once your payment is received, we'll send you a confirmation email.</p>
        
        <p>If you have any questions, please contact us at <a href="mailto:support@drwazz.org">support@drwazz.org</a></p>
        
        <p>Thank you for your support!</p>
        
        <p>Best regards,<br>The Dr. WaZzz Foundation Team</p>
      </div>
    `
  })
};

// Function to send donation email
const sendDonationEmail = async (donation) => {
  try {
    // Get the appropriate email template based on payment method
    const emailTemplate = paymentInstructions[donation.paymentMethod](donation);
    
    // Setup email data
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: donation.donorEmail,
      subject: emailTemplate.subject,
      text: emailTemplate.text,
      html: emailTemplate.html
    };
    
    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// Function to send payment confirmation email
const sendPaymentConfirmationEmail = async (donation) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: donation.donorEmail,
      subject: 'Donation Received - Thank You!',
      text: `
        Dear ${donation.donorName},
        
        We are pleased to inform you that we have received your donation of GHS ${donation.donationAmount.toFixed(2)}.
        
        Donation ID: ${donation.donationId}
        Date: ${new Date().toLocaleDateString()}
        
        Thank you for your generous support. Your contribution will help us continue our mission.
        
        Best regards,
        The Dr. WaZzz Foundation Team
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Donation Received - Thank You!</h2>
          <p>Dear ${donation.donorName},</p>
          
          <p>We are pleased to inform you that we have received your donation of <strong>GHS ${donation.donationAmount.toFixed(2)}</strong>.</p>
          
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <p><strong>Donation ID:</strong> ${donation.donationId}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          
          <p>Thank you for your generous support. Your contribution will help us continue our mission to make a difference in our community.</p>
          
          <p>Best regards,<br>The Dr. WaZzz Foundation Team</p>
        </div>
      `
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('Confirmation email sent:', info.messageId);
    
    return info;
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    throw error;
  }
};

module.exports = {
  sendDonationEmail,
  sendPaymentConfirmationEmail
};
