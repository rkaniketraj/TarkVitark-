// payment.js - Payment Model Schema for debate platform
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paymentSchema = new Schema({
  // MongoDB automatically creates _id field
  
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
    default: 'USD'
  },
  status: {
    type: String,
    enum: ['success', 'failed', 'pending'],
    default: 'pending',
    required: true,
    index: true
  },
  debateId: {
    type: Schema.Types.ObjectId,
    ref: 'DebateRoom',
    index: true,
    // Optional field, so no required: true
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'paypal', 'bank_transfer', 'wallet', 'crypto'],
    default: 'credit_card'
  },
  transactionId: {
    type: String,
    trim: true,
    sparse: true,
    index: true
  },
  description: {
    type: String,
    trim: true
  },
  metadata: {
    type: Map,
    of: Schema.Types.Mixed,
    default: {}
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  processedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Indexes for common queries
paymentSchema.index({ userId: 1, createdAt: -1 });
paymentSchema.index({ status: 1, createdAt: -1 });
paymentSchema.index({ debateId: 1, status: 1 }, { sparse: true });

// Pre-save hook to validate amount based on currency
paymentSchema.pre('save', function(next) {
  // Basic validation for amount
  if (this.isModified('amount') && this.amount <= 0) {
    return next(new Error('Payment amount must be greater than 0'));
  }
  
  // Additional currency-specific validations could be added here
  next();
});

// Instance method to update payment status
paymentSchema.methods.updateStatus = function(newStatus, transactionId = null) {
  this.status = newStatus;
  
  if (newStatus === 'success' || newStatus === 'failed') {
    this.processedAt = new Date();
  }
  
  if (transactionId) {
    this.transactionId = transactionId;
  }
  
  return this.save();
};

// Static method to get user payment history
paymentSchema.statics.getUserPaymentHistory = function(userId) {
  return this.find({ userId })
    .sort({ createdAt: -1 })
    .exec();
};

// Static method to get payments by debate
paymentSchema.statics.getDebatePayments = function(debateId) {
  return this.find({ debateId, status: 'success' })
    .sort({ createdAt: -1 })
    .exec();
};

// Static method to calculate total successful payments
paymentSchema.statics.calculateTotalRevenue = async function(currency = 'USD') {
  const result = await this.aggregate([
    { $match: { status: 'success', currency: currency } },
    { $group: {
        _id: null,
        total: { $sum: '$amount' }
      }
    }
  ]);
  
  return result.length > 0 ? result[0].total : 0;
};

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;