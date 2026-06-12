const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  roomNumber: { type: Number, required: true, unique: true },
  status: { type: String, enum: ['AVAILABLE', 'BOOKED', 'MAINTENANCE'], default: 'AVAILABLE' },
  pricePerMonth: { type: Number, required: true },
  roomType: { type: String, enum: ['Standard', 'Deluxe', 'Premium'], default: 'Standard' }
});

module.exports = mongoose.model('Room', RoomSchema);
