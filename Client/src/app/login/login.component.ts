import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../Services/login.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,CommonModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent 
{
    loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    rememberMe: new FormControl('')
  });

  errorMessage : string | undefined;
  isInvalidCredential = false;

  constructor(private router : Router, private loginService : LoginService)
  {
    this.loginForm.reset(); //clear the form
  }
    ngOnInit()
    {
      localStorage.clear();
      sessionStorage.clear();
    }


  login()
  {
    if (this.loginForm.valid)
    {
      const username = this.loginForm.value.username;
      const password = this.loginForm.value.password;

      this.loginService.login(username??'defaultUsername',password?? 'defaultPwd').subscribe(
      {
        next:(res:any)=>
        {
          if (this.loginForm.value.rememberMe) {
            localStorage.setItem('userToken', 'W@tyfg#$%');
          }
          else {
            sessionStorage.setItem('userToken', 'W@tyfg#$%');
          }

          this.errorMessage = "";
          this.isInvalidCredential = false;
          this.loginService.setUser(res.email, res.fullName);
          this.router.navigate(['otr']);
        },
        error : (err)=>
        {
          console.log(err);
                    console.log(err.status);
          if (err.status === 0 || err.status === 500) {
            // ✅ Server not reachable (network error)
            this.errorMessage = 'Server is not reachable. Please try again later.';
          } 
          else 
          {
            this.errorMessage = 'Invalid Credentials !!! Please try again.';
          }

          this.loginForm.reset(); // Clear the form
          this.router.navigate(['login']);
          this.isInvalidCredential = true;
        }
      });
    }
    else 
    {
      console.log('Form is invalid');
      this.loginForm.reset(); // Clear the form
      this.router.navigate(['login']);
      this.isInvalidCredential = true;
    }
  }

}
