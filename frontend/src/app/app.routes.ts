import { Routes } from '@angular/router';
import { BookingFormComponent } from './features/booking/booking-form/booking-form.component';
import { DashboardComponent } from './features/admin/dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', redirectTo: 'booking', pathMatch: 'full' },
  { path: 'booking', component: BookingFormComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: '**', redirectTo: 'booking' }
];
