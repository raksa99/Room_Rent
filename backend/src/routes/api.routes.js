const express = require('express');
const router = express.Router();

// Controllers
const authController = require('../controllers/auth');
const roomsController = require('../controllers/rooms');
const bookingsController = require('../controllers/bookings');
const paymentsController = require('../controllers/payments');

// Middlewares
const { authenticateToken, isAdmin } = require('../middleware/auth.middleware');

// Authentication Routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/profile', authenticateToken, authController.getProfile);

// Rooms Routes
router.get('/rooms', authenticateToken, roomsController.getAllRooms);
router.get('/rooms/available', roomsController.getAvailableRooms);
router.put('/rooms/:id/status', authenticateToken, isAdmin, roomsController.updateRoomStatus);

// Bookings Routes
router.post('/bookings', authenticateToken, bookingsController.createBooking);
router.get('/bookings/admin', authenticateToken, isAdmin, bookingsController.getAllBookings);
router.get('/bookings/my', authenticateToken, bookingsController.getMyBookings);

// Payments Routes
router.get('/payments', authenticateToken, isAdmin, paymentsController.getAllPayments);
router.post('/payments/:id/confirm', authenticateToken, isAdmin, paymentsController.confirmPayment);
router.get('/payments/receipt/:receiptNumber', authenticateToken, paymentsController.getReceiptDetails);

module.exports = router;
