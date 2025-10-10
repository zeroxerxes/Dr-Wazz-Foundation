const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donationId: {
    type: String,
    required: true,
    unique: true
  },
  donorName: {
    type: String,
    required: true
  },
  donorEmail: {
    type: String,
    required: true
  },
  donationPurpose: {
    type: String,
    default: 'general'
  },
  donationAmount: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['mobile_money', 'bank_transfer'],
    required: true
  },
  isRecurring: {
    type: Boolean,
    default: false
  },
  message: String,
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  paymentDetails: {
    transactionId: String,
    paymentDate: Date
  }
}, {
  timestamps: true
});

// Add indexes for faster queries
donationSchema.index({ donationId: 1 });
donationSchema.index({ donorEmail: 1 });

donationSchema.pre('save', function(next) {
  if (this.isNew && !this.donationId) {
    this.donationId = 'DON-' + Date.now();
  }
  next();
});

const Donation = mongoose.model('Donation', donationSchema);

module.exports = Donation;
