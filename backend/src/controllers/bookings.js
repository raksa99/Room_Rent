const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Payment = require('../models/Payment');
const mongoose = require('mongoose');
const roomsController = require('./rooms');

// Local in-memory mock storage
let mockBookings = [];
let mockPayments = [];

const createBooking = async (req, res) => {
  try {
    const { roomId, nationalId, phoneNumber, rentDate, leftDate } = req.body;
    const userId = req.user ? req.user.id : 'mock-user-123';
    const username = req.user ? req.user.username : 'tenant';

    // Dates validation
    const start = new Date(rentDate);
    const end = new Date(leftDate);
    if (end <= start) {
      return res.status(400).json({ error: 'Check-out date must be after check-in date' });
    }

    if (mongoose.connection.readyState !== 1) {
      // Offline fallback
      const room = roomsController.mockRooms.find(r => r._id === roomId);
      if (!room) return res.status(404).json({ error: 'Room not found' });
      if (room.status !== 'AVAILABLE') {
        return res.status(400).json({ error: 'Room is not available' });
      }

      room.status = 'BOOKED';

      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const totalCost = Math.round((diffDays / 30) * room.pricePerMonth * 100) / 100;

      const newBooking = {
        _id: `mock-booking-id-${Date.now()}`,
        user: { _id: userId, username, fullName: username },
        room: { _id: roomId, roomNumber: room.roomNumber, roomType: room.roomType, pricePerMonth: room.pricePerMonth },
        nationalId,
        phoneNumber,
        rentDate: start,
        leftDate: end,
        status: 'PENDING',
        createdAt: new Date()
      };
      mockBookings.push(newBooking);

      const newPayment = {
        _id: `mock-payment-id-${Date.now()}`,
        booking: newBooking,
        paymentStatus: 'UNPAID',
        totalPaid: totalCost
      };
      mockPayments.push(newPayment);

      return res.status(201).json({
        message: 'Booking created successfully (Mock mode)',
        booking: newBooking,
        estimatedCost: totalCost
      });
    }

    // Normal DB mode
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    if (room.status !== 'AVAILABLE') {
      return res.status(400).json({ error: 'Room is not available for booking' });
    }

    const newBooking = new Booking({
      user: userId,
      room: roomId,
      nationalId,
      phoneNumber,
      rentDate: start,
      leftDate: end,
      status: 'PENDING'
    });

    const savedBooking = await newBooking.save();

    room.status = 'BOOKED';
    await room.save();

    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const totalCost = Math.round((diffDays / 30) * room.pricePerMonth * 100) / 100;

    const newPayment = new Payment({
      booking: savedBooking._id,
      paymentStatus: 'UNPAID',
      totalPaid: totalCost
    });
    await newPayment.save();

    res.status(201).json({
      message: 'Booking created successfully',
      booking: savedBooking,
      estimatedCost: totalCost
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllBookings = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json(mockBookings);
    }
    const bookings = await Booking.find()
      .populate('user', 'username fullName')
      .populate('room', 'roomNumber roomType pricePerMonth')
      .sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(200).json(mockBookings);
  }
};

const getMyBookings = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json(mockBookings.filter(b => b.user && b.user._id === req.user.id));
    }
    const bookings = await Booking.find({ user: req.user.id })
      .populate('room', 'roomNumber roomType pricePerMonth')
      .sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(200).json(mockBookings.filter(b => b.user && b.user._id === req.user.id));
  }
};

module.exports = {
  createBooking,
  getAllBookings,
  getMyBookings,
  mockBookings,
  mockPayments
};
