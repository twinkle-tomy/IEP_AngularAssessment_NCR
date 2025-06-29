import { Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { LoginService } from '../../Services/login.service';
import { CommonModule } from '@angular/common';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, DialogModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

    @Input() headerName: string = '';

    userEmail:any;
    userFullName:any;
    dropdownOpen = false; 
    @ViewChild('dropdownRef', { static: true }) dropdownRef!: ElementRef;
    confirmVisible = false;   

    constructor(private loginService : LoginService, private router : Router)
    {

    }

  ngOnInit() {
    this.userEmail = this.loginService.userEmail;
    this.userFullName = this.loginService.userFullName;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const clickedInside = this.dropdownRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.dropdownOpen = false;
    }
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  showLogoutConfirm() {
    this.confirmVisible = true;
    console.log(this.confirmVisible);
  }

  onDialogClose(action: 'cancel' | 'confirm') {
    this.confirmVisible = false;

    if (action === 'confirm') {
      this.logout();
    }
  }

  logout() 
  {
    localStorage.clear();
    sessionStorage.clear();        
    this.loginService.clearUser();
    this.router.navigate(['login']);
  }

}
