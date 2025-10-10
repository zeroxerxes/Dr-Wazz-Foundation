const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation');
const { sendDonationEmail } = require('../services/emailService');

// Submit a new donation
router.post('/', async (req, res) => {
  try {
    const {
      donorName,
      donorEmail,
      donationPurpose = 'general',
      donationAmount,
      paymentMethod,
      recurring = false,
      message = ''
    } = req.body;

    // Create new donation
    const donation = new Donation({
      donorName,
      donorEmail,
      donationPurpose,
      donationAmount: parseFloat(donationAmount),
      paymentMethod,
      isRecurring: recurring === 'on' || recurring === true,
      message,
      status: 'pending'
    });

    // Save to database
    await donation.save();

    // Send email with payment instructions
    await sendDonationEmail(donation);

    // Return success response with donation ID
    res.status(201).json({
      success: true,
      message: 'Donation submitted successfully',
      donationId: donation.donationId,
      redirectUrl: `/thank-you.html?donationId=${donation.donationId}`
    });

  } catch (error) {
    console.error('Error processing donation:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing your donation',
      error: error.message
    });
  }
});

// Get donation details
router.get('/:donationId', async (req, res) => {
  try {
    const { donationId } = req.params;
    const donation = await Donation.findOne({ donationId });
    
    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: donation
    });
    
  } catch (error) {
    console.error('Error fetching donation:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching donation details',
      error: error.message
    });
  }
});

module.exports = router;
