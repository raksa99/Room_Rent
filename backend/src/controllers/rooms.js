const Room = require('../models/Room');
const mongoose = require('mongoose');

// Generate 27 mock rooms for in-memory fallback
const getMockRooms = () => {
  const rooms = [];
  for (let i = 1; i <= 27; i++) {
    let roomType = 'Standard';
    let price = 150.00;
    let status = 'AVAILABLE';
    
    if (i === 3 || i === 12 || i === 22) status = 'BOOKED';
    if (i === 5 || i === 15) status = 'MAINTENANCE';

    if (i >= 10 && i <= 18) {
      roomType = 'Deluxe';
      price = 200.00;
    } else if (i >= 19) {
      roomType = 'Premium';
      price = 250.00;
    }

    rooms.push({
      _id: `mock-room-id-${i}`,
      roomNumber: i,
      status,
      pricePerMonth: price,
      roomType
    });
  }
  return rooms;
};

let mockRooms = getMockRooms();

const getAllRooms = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json(mockRooms);
    }
    const rooms = await Room.find().sort({ roomNumber: 1 });
    res.status(200).json(rooms);
  } catch (error) {
    res.status(200).json(mockRooms);
  }
};

const getAvailableRooms = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json(mockRooms.filter(r => r.status === 'AVAILABLE'));
    }
    const rooms = await Room.find({ status: 'AVAILABLE' }).sort({ roomNumber: 1 });
    res.status(200).json(rooms);
  } catch (error) {
    res.status(200).json(mockRooms.filter(r => r.status === 'AVAILABLE'));
  }
};

const updateRoomStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!['AVAILABLE', 'BOOKED', 'MAINTENANCE'].includes(status)) {
      return res.status(400).json({ error: 'Invalid room status' });
    }

    if (mongoose.connection.readyState !== 1) {
      const room = mockRooms.find(r => r._id === id);
      if (!room) return res.status(404).json({ error: 'Room not found' });
      room.status = status;
      return res.status(200).json(room);
    }

    const updatedRoom = await Room.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedRoom) {
      return res.status(404).json({ error: 'Room not found' });
    }

    res.status(200).json(updatedRoom);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllRooms,
  getAvailableRooms,
  updateRoomStatus,
  mockRooms
};
