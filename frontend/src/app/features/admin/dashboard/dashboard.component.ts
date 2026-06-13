import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Room {
  id: string;
  roomNumber: number;
  type: string;
  price: number;
  status: 'AVAILABLE' | 'BOOKED' | 'MAINTENANCE';
}

interface Booking {
  id: string;
  roomNumber: number;
  roomType: string;
  price: number;
  phoneNumber: string;
  rentDate: string;
  leftDate: string;
  totalDays: number;
  totalPrice: number;
  nationalIdImage: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  createdAt: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  rooms: Room[] = [];
  bookings: Booking[] = [];
  selectedRoom: Room | null = null;
  selectedIdImage: string | null = null;

  // Stats
  totalBookingsCount = 0;
  pendingBookingsCount = 0;
  confirmedBookingsCount = 0;
  totalRevenue = 0;

  // Theme & Language Settings
  isDarkMode = true;
  currentLang: 'en' | 'kh' = 'en';

  t: { [key: string]: { [lang: string]: string } } = {
    adminTitle: {
      en: 'Raksa Rent House Admin Dashboard',
      kh: 'ផ្ទាំងគ្រប់គ្រងរដ្ឋបាលផ្ទះជួល រក្សា'
    },
    subtitle: {
      en: 'Manage room bookings, track rental revenue, update room statuses, and review guest credentials.',
      kh: 'គ្រប់គ្រងការកក់បន្ទប់ តាមដានចំណូលជួល ធ្វើបច្ចុប្បន្នភាពស្ថានភាពបន្ទប់ និងពិនិត្យឯកសារភ្ញៀវ។'
    },
    totalBookings: {
      en: 'Total Bookings',
      kh: 'ការកក់សរុប'
    },
    pendingBookings: {
      en: 'Pending Bookings',
      kh: 'ការកក់រង់ចាំពិនិត្យ'
    },
    confirmedBookings: {
      en: 'Confirmed Bookings',
      kh: 'ការកក់បានបញ្ជាក់'
    },
    estimatedRevenue: {
      en: 'Projected Revenue',
      kh: 'ចំណូលប៉ាន់ស្មាន'
    },
    roomGridTitle: {
      en: 'Interactive Room Manager',
      kh: 'កម្មវិធីគ្រប់គ្រងបន្ទប់អន្តរកម្ម'
    },
    bookingListTitle: {
      en: 'Guest Booking Requests',
      kh: 'សំណើសុំកក់បន្ទប់ពីភ្ញៀវ'
    },
    roomLabel: {
      en: 'Room',
      kh: 'បន្ទប់'
    },
    Standard: {
      en: 'Standard',
      kh: 'ស្តង់ដារ'
    },
    Deluxe: {
      en: 'Deluxe',
      kh: 'ដឺឡាក់'
    },
    Premium: {
      en: 'Premium',
      kh: 'ប្រីមីញ៉ូម'
    },
    price: {
      en: 'Price',
      kh: 'តម្លៃ'
    },
    status: {
      en: 'Status',
      kh: 'ស្ថានភាព'
    },
    actions: {
      en: 'Actions',
      kh: 'សកម្មភាព'
    },
    confirm: {
      en: 'Confirm',
      kh: 'បញ្ជាក់'
    },
    cancel: {
      en: 'Cancel',
      kh: 'បដិសេធ'
    },
    delete: {
      en: 'Delete',
      kh: 'លុបចោល'
    },
    noBookings: {
      en: 'No booking requests submitted yet.',
      kh: 'មិនទាន់មានសំណើសុំកក់បន្ទប់នៅឡើយទេ។'
    },
    bookingDetails: {
      en: 'Booking Details',
      kh: 'ព័ត៌មានលម្អិតនៃការកក់'
    },
    backToBooking: {
      en: 'Back to Booking Page',
      kh: 'ត្រឡប់ទៅទំព័រកក់បន្ទប់'
    },
    forceStatus: {
      en: 'Set Room Status Override',
      kh: 'កំណត់ស្ថានភាពបន្ទប់ឡើងវិញ'
    },
    idPreview: {
      en: 'National ID Photo',
      kh: 'រូបថតអត្តសញ្ញាណប័ណ្ណ'
    },
    close: {
      en: 'Close',
      kh: 'បិទ'
    },
    available: {
      en: 'Available',
      kh: 'ទំនេរ'
    },
    booked: {
      en: 'Booked',
      kh: 'ជាប់រវល់'
    },
    maintenance: {
      en: 'Maintenance',
      kh: 'កំពុងជួសជុល'
    },
    refId: {
      en: 'Ref ID',
      kh: 'លេខយោង'
    },
    phone: {
      en: 'Phone',
      kh: 'ទូរស័ព្ទ'
    },
    stayDates: {
      en: 'Stay Dates',
      kh: 'កាលបរិច្ឆេទស្នាក់នៅ'
    },
    totalCost: {
      en: 'Total Cost',
      kh: 'តម្លៃសរុប'
    },
    idCard: {
      en: 'ID Card',
      kh: 'អត្តសញ្ញាណប័ណ្ណ'
    },
    viewImage: {
      en: 'View Photo',
      kh: 'មើលរូបភាព'
    },
    days: {
      en: 'days',
      kh: 'ថ្ងៃ'
    },
    roomNumber: {
      en: 'Room Number',
      kh: 'លេខបន្ទប់'
    },
    roomType: {
      en: 'Type',
      kh: 'ប្រភេទ'
    },
    roomPrice: {
      en: 'Monthly Rate',
      kh: 'តម្លៃប្រចាំខែ'
    }
  };

  ngOnInit(): void {
    this.loadPreferences();
    this.loadRooms();
    this.loadBookings();
    this.calculateStats();
  }

  loadPreferences(): void {
    if (typeof localStorage !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        this.isDarkMode = savedTheme === 'dark';
      }
      const savedLang = localStorage.getItem('lang');
      if (savedLang === 'en' || savedLang === 'kh') {
        this.currentLang = savedLang;
      }
    }
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    }
  }

  setLanguage(lang: 'en' | 'kh'): void {
    this.currentLang = lang;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('lang', lang);
    }
  }

  loadRooms(): void {
    if (typeof localStorage !== 'undefined') {
      const savedRooms = localStorage.getItem('rooms');
      if (savedRooms) {
        this.rooms = JSON.parse(savedRooms);
      } else {
        // Generate Default Rooms (Rooms 1 to 27)
        const generatedRooms: Room[] = [];
        for (let i = 1; i <= 27; i++) {
          let roomType = 'Standard';
          let price = 150;
          let status: 'AVAILABLE' | 'BOOKED' | 'MAINTENANCE' = 'AVAILABLE';
          
          if (i === 3 || i === 12 || i === 22) {
            status = 'BOOKED';
          } else if (i === 5 || i === 15) {
            status = 'MAINTENANCE';
          }

          if (i >= 10 && i <= 18) {
            roomType = 'Deluxe';
            price = 200;
          } else if (i >= 19) {
            roomType = 'Premium';
            price = 250;
          }

          generatedRooms.push({
            id: `mock-id-${i}`,
            roomNumber: i,
            type: roomType,
            price: price,
            status: status
          });
        }
        this.rooms = generatedRooms;
        localStorage.setItem('rooms', JSON.stringify(this.rooms));
      }
    }
  }

  loadBookings(): void {
    if (typeof localStorage !== 'undefined') {
      const savedBookings = localStorage.getItem('bookings');
      if (savedBookings) {
        this.bookings = JSON.parse(savedBookings);
      } else {
        this.bookings = [];
      }
    }
  }

  calculateStats(): void {
    this.totalBookingsCount = this.bookings.length;
    this.pendingBookingsCount = this.bookings.filter(b => b.status === 'PENDING').length;
    this.confirmedBookingsCount = this.bookings.filter(b => b.status === 'CONFIRMED').length;
    this.totalRevenue = this.bookings
      .filter(b => b.status === 'CONFIRMED')
      .reduce((sum, b) => sum + b.totalPrice, 0);
  }

  selectRoomForManagement(room: Room): void {
    this.selectedRoom = room;
  }

  updateRoomStatusOverride(status: 'AVAILABLE' | 'BOOKED' | 'MAINTENANCE'): void {
    if (!this.selectedRoom) return;

    this.selectedRoom.status = status;
    const index = this.rooms.findIndex(r => r.id === this.selectedRoom?.id);
    if (index !== -1) {
      this.rooms[index].status = status;
      this.saveRooms();
    }
  }

  confirmBooking(booking: Booking): void {
    booking.status = 'CONFIRMED';
    
    // Update matching room to BOOKED
    const roomIndex = this.rooms.findIndex(r => r.roomNumber === booking.roomNumber);
    if (roomIndex !== -1) {
      this.rooms[roomIndex].status = 'BOOKED';
      this.saveRooms();
    }

    this.saveBookings();
    this.calculateStats();
  }

  cancelBooking(booking: Booking): void {
    booking.status = 'CANCELLED';

    // Update matching room back to AVAILABLE
    const roomIndex = this.rooms.findIndex(r => r.roomNumber === booking.roomNumber);
    if (roomIndex !== -1) {
      this.rooms[roomIndex].status = 'AVAILABLE';
      this.saveRooms();
    }

    this.saveBookings();
    this.calculateStats();
  }

  deleteBooking(bookingId: string): void {
    const booking = this.bookings.find(b => b.id === bookingId);
    if (booking && (booking.status === 'CONFIRMED' || booking.status === 'PENDING')) {
      // Free the room
      const roomIndex = this.rooms.findIndex(r => r.roomNumber === booking.roomNumber);
      if (roomIndex !== -1) {
        this.rooms[roomIndex].status = 'AVAILABLE';
        this.saveRooms();
      }
    }

    this.bookings = this.bookings.filter(b => b.id !== bookingId);
    this.saveBookings();
    this.calculateStats();
  }

  saveRooms(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('rooms', JSON.stringify(this.rooms));
    }
  }

  saveBookings(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('bookings', JSON.stringify(this.bookings));
    }
  }

  openIdModal(imageUrl: string): void {
    this.selectedIdImage = imageUrl;
  }

  closeIdModal(): void {
    this.selectedIdImage = null;
  }
}
