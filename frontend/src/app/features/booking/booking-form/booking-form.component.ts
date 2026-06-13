import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Room {
  id: string; // Mongo ObjectId in production
  roomNumber: number;
  type: string;
  price: number;
  status: 'AVAILABLE' | 'BOOKED' | 'MAINTENANCE';
}

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './booking-form.component.html',
  styles: [`
    input[type="date"] {
      position: relative;
    }
    input[type="date"]::-webkit-calendar-picker-indicator {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: auto;
      height: auto;
      opacity: 0;
      cursor: pointer;
    }
  `]
})
export class BookingFormComponent implements OnInit {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;

  bookingForm!: FormGroup;
  rooms: Room[] = [];
  selectedRoom: Room | null = null;
  minDate: string = '';
  totalPrice: number = 0;
  totalDays: number = 0;
  isSubmitted = false;
  showSuccessView = false;
  lastBooking: any = null;

  // Camera & Image Import States
  showCamera = false;
  stream: MediaStream | null = null;
  idCardImagePreview: string | null = null;

  // Theme & Language Settings
  isDarkMode = true;
  currentLang: 'en' | 'kh' = 'en';

  t: { [key: string]: { [lang: string]: string } } = {
    title: {
      en: 'Book Your Comfort Room',
      kh: 'កក់បន្ទប់មានផាសុកភាពរបស់អ្នក'
    },
    subtitle: {
      en: 'Select one of our 27 premium rooms (1-27), fill in your details, and submit your booking request.',
      kh: 'ជ្រើសរើសបន្ទប់លំដាប់ប្រីមីញ៉ូមមួយក្នុងចំណោម ២៧ បន្ទប់ (១-២៧) បំពេញព័ត៌មានលម្អិតរបស់អ្នក និងដាក់ស្នើការកក់។'
    },
    selectRoomTitle: {
      en: 'Select Room (Rooms 1 to 27)',
      kh: 'ជ្រើសរើសបន្ទប់ (បន្ទប់ ១ ដល់ ២៧)'
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
    bookingInfoTitle: {
      en: 'Booking Information',
      kh: 'ព័ត៌មាននៃការកក់'
    },
    selectedRoomLabel: {
      en: 'Selected Room',
      kh: 'បន្ទប់ដែលបានជ្រើសរើស'
    },
    categorySuffix: {
      en: 'Category',
      kh: 'ប្រភេទ'
    },
    monthSuffix: {
      en: 'month',
      kh: 'ខែ'
    },
    selectRoomPrompt: {
      en: 'Please click a room in the grid to select.',
      kh: 'សូមចុចលើបន្ទប់ក្នុងប្រអប់ដើម្បីជ្រើសរើស។'
    },
    roomRequired: {
      en: 'Selecting a room is required.',
      kh: 'តម្រូវឱ្យជ្រើសរើសបន្ទប់មួយ។'
    },
    nationalIdLabel: {
      en: 'National ID Card Photo',
      kh: 'រូបថតអត្តសញ្ញាណប័ណ្ណសញ្ជាតិខ្មែរ'
    },
    scanCamera: {
      en: 'Scan with Camera',
      kh: 'ស្កេនជាមួយកាមេរ៉ា'
    },
    importImage: {
      en: 'Import Image',
      kh: 'នាំចូលរូបភាព'
    },
    capturePhoto: {
      en: 'Capture Photo',
      kh: 'ថតរូបភាព'
    },
    cancel: {
      en: 'Cancel',
      kh: 'បោះបង់'
    },
    idRegistered: {
      en: 'National ID Image Registered',
      kh: 'បានចុះឈ្មោះរូបថតអត្តសញ្ញាណប័ណ្ណ'
    },
    idRequired: {
      en: 'National ID Card Photo is required. Please capture a photo or import an image.',
      kh: 'តម្រូវឱ្យមានរូបថតអត្តសញ្ញាណប័ណ្ណ។ សូមថតរូប ឬនាំចូលរូបភាព។'
    },
    phoneLabel: {
      en: 'Phone Number (Cambodia)',
      kh: 'លេខទូរស័ព្ទ (កម្ពុជា)'
    },
    phoneRequired: {
      en: 'Phone Number is required.',
      kh: 'តម្រូវឱ្យមានលេខទូរស័ព្ទ។'
    },
    phonePattern: {
      en: 'Please enter 8 to 9 digits (e.g., 99123456).',
      kh: 'សូមបញ្ចូលលេខ ៨ ទៅ ៩ ខ្ទង់ (ឧទាហរណ៍៖ 99123456)។'
    },
    rentDateLabel: {
      en: 'Rent Date',
      kh: 'ថ្ងៃចូលជួល'
    },
    leftDateLabel: {
      en: 'Left Date',
      kh: 'ថ្ងៃចាកចេញ'
    },
    required: {
      en: 'Required.',
      kh: 'តម្រូវឱ្យមាន។'
    },
    pastDateError: {
      en: 'Cannot be in past.',
      kh: 'មិនអាចនៅក្នុងអតីតកាលបានទេ។'
    },
    rangeError: {
      en: 'Must be after Rent Date.',
      kh: 'ត្រូវតែក្រោយថ្ងៃចូលជួល។'
    },
    durationLabel: {
      en: 'Duration',
      kh: 'រយៈពេល'
    },
    daysLabel: {
      en: 'Days',
      kh: 'ថ្ងៃ'
    },
    rateLabel: {
      en: 'Rate',
      kh: 'តម្លៃ'
    },
    estimatedCost: {
      en: 'Estimated Total Cost',
      kh: 'តម្លៃសរុបប៉ាន់ស្មាន'
    },
    submitButton: {
      en: 'Submit Booking Request',
      kh: 'ដាក់ស្នើការស្នើសុំកក់'
    },
    bookingSuccess: {
      en: 'Booking Request Submitted Successfully!',
      kh: 'បានដាក់ស្នើសុំកក់បន្ទប់ដោយជោគជ័យ!'
    },
    successTitle: {
      en: 'Booking Confirmed (Pending Review)',
      kh: 'ការកក់បន្ទប់ត្រូវបានកក់ (រង់ចាំការពិនិត្យ)'
    },
    successRef: {
      en: 'Reference ID',
      kh: 'លេខយោងបន្ទប់'
    },
    successSummary: {
      en: 'Receipt & Booking Summary',
      kh: 'វិក្កយបត្រ & សេចក្តីសង្ខេបនៃការកក់'
    },
    successNote: {
      en: 'Please keep this receipt for your reference. An administrator will review your booking request and contact you shortly.',
      kh: 'សូមរក្សាទុកវិក្កយបត្រនេះសម្រាប់ជាឯកសារយោង។ ភ្នាក់ងាររដ្ឋបាលនឹងពិនិត្យសំណើកក់បន្ទប់របស់អ្នក និងទាក់ទងទៅអ្នកក្នុងពេលឆាប់ៗ។'
    },
    bookAnother: {
      en: 'Book Another Room',
      kh: 'កក់បន្ទប់ផ្សេងទៀត'
    },
    goToDashboard: {
      en: 'Go to Admin Dashboard',
      kh: 'ទៅកាន់ផ្ទាំងគ្រប់គ្រងរដ្ឋបាល'
    }
  };

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    this.loadRooms();
    this.setMinDate();
    this.loadPreferences();
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

  initForm(): void {
    this.bookingForm = this.fb.group({
      roomId: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{8,9}$')]],
      rentDate: ['', [Validators.required, this.futureDateValidator]],
      leftDate: ['', Validators.required],
      nationalIdImage: ['', Validators.required]
    }, { validators: this.dateRangeValidator });

    this.bookingForm.valueChanges.subscribe(() => {
      this.calculatePrice();
    });
  }

  loadRooms(): void {
    if (typeof localStorage !== 'undefined') {
      const savedRooms = localStorage.getItem('rooms');
      if (savedRooms) {
        this.rooms = JSON.parse(savedRooms);
        return;
      }
    }
    // Generate Room 1 to 27
    const generatedRooms: Room[] = [];
    for (let i = 1; i <= 27; i++) {
      let roomType = 'Standard';
      let price = 150;
      let status: 'AVAILABLE' | 'BOOKED' | 'MAINTENANCE' = 'AVAILABLE';
      
      // Seed some demo statuses
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
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('rooms', JSON.stringify(this.rooms));
    }
  }

  setMinDate(): void {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    this.minDate = `${yyyy}-${mm}-${dd}`;
  }

  selectRoom(room: Room): void {
    if (room.status !== 'AVAILABLE') return;
    this.selectedRoom = room;
    this.bookingForm.patchValue({ roomId: room.id });
  }

  futureDateValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const inputDate = new Date(control.value);
    inputDate.setHours(0, 0, 0, 0);
    return inputDate >= today ? null : { pastDate: true };
  }

  dateRangeValidator(group: AbstractControl): ValidationErrors | null {
    const rentDateVal = group.get('rentDate')?.value;
    const leftDateVal = group.get('leftDate')?.value;
    if (!rentDateVal || !leftDateVal) return null;

    const rentDate = new Date(rentDateVal);
    const leftDate = new Date(leftDateVal);
    return leftDate > rentDate ? null : { invalidRange: true };
  }

  calculatePrice(): void {
    const rentDateVal = this.bookingForm.get('rentDate')?.value;
    const leftDateVal = this.bookingForm.get('leftDate')?.value;
    const roomIdVal = this.bookingForm.get('roomId')?.value;

    this.selectedRoom = this.rooms.find(r => r.id === roomIdVal) || null;

    if (rentDateVal && leftDateVal && this.selectedRoom) {
      const rentDate = new Date(rentDateVal);
      const leftDate = new Date(leftDateVal);
      const diffTime = leftDate.getTime() - rentDate.getTime();
      
      if (diffTime > 0) {
        this.totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        this.totalPrice = Math.round((this.totalDays / 30) * this.selectedRoom.price * 100) / 100;
      } else {
        this.totalDays = 0;
        this.totalPrice = 0;
      }
    } else {
      this.totalDays = 0;
      this.totalPrice = 0;
    }
  }

  // Camera Management
  startCamera(): void {
    this.showCamera = true;
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .then(s => {
        this.stream = s;
        // Bind to video tag using short delay to ensure ViewChild hook resolved
        setTimeout(() => {
          if (this.videoElement) {
            this.videoElement.nativeElement.srcObject = s;
          }
        }, 100);
      })
      .catch(err => {
        console.error('Webcam scan failed:', err);
        alert('Could not open camera. Please import file instead.');
        this.showCamera = false;
      });
  }

  capturePhoto(): void {
    if (!this.videoElement || !this.stream) return;

    const video = this.videoElement.nativeElement;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const base64 = canvas.toDataURL('image/jpeg');
      this.idCardImagePreview = base64;
      this.bookingForm.patchValue({ nationalIdImage: base64 });
    }

    this.stopCamera();
  }

  stopCamera(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    this.showCamera = false;
  }

  // File Upload Management
  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        this.idCardImagePreview = base64;
        this.bookingForm.patchValue({ nationalIdImage: base64 });
      };
      reader.readAsDataURL(file);
    }
  }

  removePhoto(): void {
    this.idCardImagePreview = null;
    this.bookingForm.patchValue({ nationalIdImage: '' });
  }

  onSubmit(): void {
    this.isSubmitted = true;
    if (this.bookingForm.invalid) {
      return;
    }
    
    const formVal = this.bookingForm.value;
    const refId = 'RR-' + Math.floor(100000 + Math.random() * 900000);
    const rentDate = formVal.rentDate;
    const leftDate = formVal.leftDate;
    const phone = '+885' + formVal.phoneNumber;
    
    // Create new booking
    const newBooking = {
      id: refId,
      roomNumber: this.selectedRoom?.roomNumber,
      roomType: this.selectedRoom?.type,
      price: this.selectedRoom?.price,
      phoneNumber: phone,
      rentDate: rentDate,
      leftDate: leftDate,
      totalDays: this.totalDays,
      totalPrice: this.totalPrice,
      nationalIdImage: this.idCardImagePreview || formVal.nationalIdImage,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };

    // Save Booking to LocalStorage
    if (typeof localStorage !== 'undefined') {
      const savedBookings = localStorage.getItem('bookings');
      const bookingsList = savedBookings ? JSON.parse(savedBookings) : [];
      bookingsList.unshift(newBooking);
      localStorage.setItem('bookings', JSON.stringify(bookingsList));

      // Mark the Room as BOOKED
      if (this.selectedRoom) {
        this.selectedRoom.status = 'BOOKED';
        const roomIndex = this.rooms.findIndex(r => r.id === this.selectedRoom?.id);
        if (roomIndex !== -1) {
          this.rooms[roomIndex].status = 'BOOKED';
        }
        localStorage.setItem('rooms', JSON.stringify(this.rooms));
      }
    }

    // Set view state
    this.lastBooking = newBooking;
    this.showSuccessView = true;
  }

  resetBookingForm(): void {
    this.bookingForm.reset();
    this.bookingForm.patchValue({
      roomId: '',
      phoneNumber: '',
      rentDate: '',
      leftDate: '',
      nationalIdImage: ''
    });
    this.selectedRoom = null;
    this.idCardImagePreview = null;
    this.totalDays = 0;
    this.totalPrice = 0;
    this.isSubmitted = false;
    this.showSuccessView = false;
    this.lastBooking = null;
    this.loadRooms();
  }

  triggerDatePicker(picker: HTMLInputElement): void {
    if (picker && typeof picker.showPicker === 'function') {
      try {
        picker.showPicker();
      } catch (e) {
        console.error('Failed to open date picker:', e);
        picker.focus();
      }
    } else if (picker) {
      picker.focus();
    }
  }
}
