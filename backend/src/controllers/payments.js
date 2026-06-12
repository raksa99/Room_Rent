const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const mongoose = require('mongoose');
const bookingsController = require('./bookings');

// Confirm payment and generate receipt
const confirmPayment = async (req, res) => {
  try {
    const { id } = req.params; // payment id

    if (mongoose.connection.readyState !== 1) {
      // Offline fallback
      const payment = bookingsController.mockPayments.find(p => p._id === id);
      if (!payment) {
        return res.status(404).json({ error: 'Payment record not found' });
      }

      if (payment.paymentStatus === 'PAID') {
        return res.status(400).json({ error: 'Payment is already confirmed' });
      }

      const timestamp = Date.now();
      const randomHex = Math.random().toString(16).substring(2, 6).toUpperCase();
      const receiptNumber = `REC-${timestamp}-${randomHex}`;

      payment.paymentStatus = 'PAID';
      payment.receiptNumber = receiptNumber;
      payment.paymentDate = new Date();

      if (payment.booking) {
        payment.booking.status = 'CONFIRMED';
        const booking = bookingsController.mockBookings.find(b => b._id === payment.booking._id);
        if (booking) booking.status = 'CONFIRMED';
      }

      return res.status(200).json({
        message: 'Payment confirmed and receipt generated (Mock mode)',
        payment
      });
    }

    const payment = await Payment.findById(id).populate({
      path: 'booking',
      populate: [
        { path: 'user', select: 'username fullName' },
        { path: 'room', select: 'roomNumber pricePerMonth' }
      ]
    });

    if (!payment) {
      return res.status(404).json({ error: 'Payment record not found' });
    }

    if (payment.paymentStatus === 'PAID') {
      return res.status(400).json({ error: 'Payment is already confirmed' });
    }

    const timestamp = Date.now();
    const randomHex = Math.random().toString(16).substring(2, 6).toUpperCase();
    const receiptNumber = `REC-${timestamp}-${randomHex}`;

    payment.paymentStatus = 'PAID';
    payment.receiptNumber = receiptNumber;
    payment.paymentDate = new Date();
    await payment.save();

    const booking = await Booking.findById(payment.booking._id);
    if (booking) {
      booking.status = 'CONFIRMED';
      await booking.save();
    }

    res.status(200).json({
      message: 'Payment confirmed and receipt generated',
      payment
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all payments (Admin dashboard)
const getAllPayments = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json(bookingsController.mockPayments);
    }
    const payments = await Payment.find()
      .populate({
        path: 'booking',
        populate: [
          { path: 'user', select: 'username fullName' },
          { path: 'room', select: 'roomNumber' }
        ]
      })
      .sort({ paymentDate: -1, _id: -1 });
    res.status(200).json(payments);
  } catch (error) {
    res.status(200).json(bookingsController.mockPayments);
  }
};

// Get receipt details
const getReceiptDetails = async (req, res) => {
  try {
    const { receiptNumber } = req.params;

    if (mongoose.connection.readyState !== 1) {
      // Offline fallback
      const payment = bookingsController.mockPayments.find(p => p.receiptNumber === receiptNumber && p.paymentStatus === 'PAID');
      if (!payment) {
        return res.status(404).json({ error: 'Receipt not found or payment not confirmed' });
      }

      const receipt = {
        receiptNumber: payment.receiptNumber,
        roomNumber: payment.booking.room.roomNumber,
        tenantId: payment.booking.user._id || 'mock-user-id',
        tenantName: payment.booking.user.fullName || payment.booking.user.username,
        phoneNumber: payment.booking.phoneNumber,
        rentDate: payment.booking.rentDate,
        leftDate: payment.booking.leftDate,
        totalPaid: payment.totalPaid,
        paymentDate: payment.paymentDate
      };

      return res.status(200).json(receipt);
    }

    const payment = await Payment.findOne({ receiptNumber, paymentStatus: 'PAID' })
      .populate({
        path: 'booking',
        populate: [
          { path: 'user', select: 'username fullName' },
          { path: 'room', select: 'roomNumber pricePerMonth' }
        ]
      });

    if (!payment) {
      return res.status(404).json({ error: 'Receipt not found or payment not confirmed' });
    }

    const receipt = {
      receiptNumber: payment.receiptNumber,
      roomNumber: payment.booking.room.roomNumber,
      tenantId: payment.booking.user._id,
      tenantName: payment.booking.user.fullName || payment.booking.user.username,
      phoneNumber: payment.booking.phoneNumber,
      rentDate: payment.booking.rentDate,
      leftDate: payment.booking.leftDate,
      totalPaid: payment.totalPaid,
      paymentDate: payment.paymentDate
    };

    res.status(200).json(receipt);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  confirmPayment,
  getAllPayments,
  getReceiptDetails
};
