import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  // Initialize from localStorage or fallback to empty
  userEmail = signal<string>(localStorage.getItem('userEmail') || '');
  userFullName = signal<string>(localStorage.getItem('userFullName') || '');

  constructor(private router : Router, private http : HttpClient) 
  { 

  }

  setUser(email: string, fullName: string) {
    // const newUser: User = {
    //   fullName: fullName,
    //   email: email
    // };
    this.userEmail.set(email);
    this.userFullName.set(fullName);
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userFullName', fullName);
  }

  clearUser() {
    this.userEmail.set('');
    this.userFullName.set('');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userFullName');
  }

  login(username: string, password: string): Observable<any> 
  {
    return this.http.post('/api/login', { username, password });
  }
}
