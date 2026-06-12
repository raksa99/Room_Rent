import { Routes } from '@angular/router';
import { BookingFormComponent } from './features/booking/booking-form/booking-form.component';

export const routes: Routes = [
  { path: '', redirectTo: 'booking', pathMatch: 'full' },
  { path: 'booking', component: BookingFormComponent }
];
