require('dotenv').config();
const mongoose = require('mongoose');
const Room = require('../models/Room');

const seedRooms = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/room-rental');
    
    // Clear existing rooms if seeding fresh
    await Room.deleteMany({});
    
    const rooms = [];
    // Populate 27 rooms: Rooms 1-9 Standard, 10-18 Deluxe, 19-27 Premium
    for (let i = 1; i <= 27; i++) {
      let roomType = 'Standard';
      let price = 150.00;
      
      if (i >= 10 && i <= 18) {
        roomType = 'Deluxe';
        price = 200.00;
      } else if (i >= 19) {
        roomType = 'Premium';
        price = 250.00;
      }

      rooms.push({
        roomNumber: i,
        status: 'AVAILABLE',
        pricePerMonth: price,
        roomType: roomType
      });
    }

    await Room.insertMany(rooms);
    console.log('Successfully seeded 27 rooms!');
    process.exit();
  } catch (error) {
    console.error(`Error seeding rooms: ${error.message}`);
    process.exit(1);
  }
};

seedRooms();
