const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  paymentStatus: { type: String, enum: ['UNPAID', 'PAID'], default: 'UNPAID' },
  receiptNumber: { type: String, unique: true, sparse: true },
  paymentDate: { type: Date },
  totalPaid: { type: Number, default: 0.00 }
});

module.exports = mongoose.model('Payment', PaymentSchema);
