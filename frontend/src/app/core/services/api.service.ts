import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl: string;

  constructor(private http: HttpClient) {
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      this.baseUrl = 'http://localhost:3001/api';
    } else {
      this.baseUrl = '/api';
    }
  }

  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('admin_token');
      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
      }
    }
    return headers;
  }

  getAvailableRooms(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/rooms/available`);
  }

  createBooking(bookingData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/bookings`, bookingData);
  }

  // Admin Actions
  autoLoginAdmin(): Observable<any> {
    const defaultAdmin = {
      username: 'admin',
      password: 'adminpassword',
      role: 'ADMIN',
      fullName: 'Raksa Rent Admin'
    };

    // Try to login. If fails, register, then save token.
    return this.http.post<any>(`${this.baseUrl}/auth/login`, {
      username: defaultAdmin.username,
      password: defaultAdmin.password
    }).pipe(
      tap(res => {
        if (res.token && typeof localStorage !== 'undefined') {
          localStorage.setItem('admin_token', res.token);
        }
      }),
      catchError(() => {
        // Registration fallback
        return this.http.post<any>(`${this.baseUrl}/auth/register`, defaultAdmin).pipe(
          tap(res => {
            if (res.token && typeof localStorage !== 'undefined') {
              localStorage.setItem('admin_token', res.token);
            }
          }),
          catchError(regErr => {
            console.error('Auto Admin Authentication failed:', regErr);
            return throwError(() => regErr);
          })
        );
      })
    );
  }

  getAllRooms(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/rooms`, { headers: this.getHeaders() });
  }

  getAllBookings(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/bookings/admin`, { headers: this.getHeaders() });
  }

  updateRoomStatus(roomId: string, status: string): Observable<any> {
    return this.http.put<any>(
      `${this.baseUrl}/rooms/${roomId}/status`,
      { status },
      { headers: this.getHeaders() }
    );
  }

  updateBookingStatus(bookingId: string, status: string): Observable<any> {
    return this.http.put<any>(
      `${this.baseUrl}/bookings/${bookingId}/status`,
      { status },
      { headers: this.getHeaders() }
    );
  }

  deleteBooking(bookingId: string): Observable<any> {
    return this.http.delete<any>(
      `${this.baseUrl}/bookings/${bookingId}`,
      { headers: this.getHeaders() }
    );
  }
}

